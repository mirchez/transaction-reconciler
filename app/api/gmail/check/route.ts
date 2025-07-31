import { NextResponse } from "next/server";
import { google } from "googleapis";
import { prisma } from "@/lib/prisma";

async function getAuthenticatedClient(email: string) {
  const googleAuth = await prisma.googleAuth.findUnique({
    where: { email },
  });

  if (!googleAuth) {
    throw new Error("Google account not connected");
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    access_token: googleAuth.accessToken,
    refresh_token: googleAuth.refreshToken,
    expiry_date: googleAuth.expiryDate?.getTime(),
    token_type: googleAuth.tokenType,
    scope: googleAuth.scope,
  });

  return { oauth2Client, googleAuth };
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const { oauth2Client, googleAuth } = await getAuthenticatedClient(email);
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // Get only the last 5 emails (most recent)
    let messages = [];
    try {
      // First try to get emails with attachments
      const response = await gmail.users.messages.list({
        userId: "me",
        q: "has:attachment filename:pdf",
        maxResults: 5,
        orderBy: "internalDate desc", // Most recent first
      });
      messages = response.data.messages || [];
      console.log(`✅ Gmail API Response - Found ${messages.length} recent emails with PDF attachments (last 5)`);
    } catch (error: any) {
      // If search fails, try a simpler approach - just get last 5 emails
      console.log("⚠️ Complex search failed, trying simpler approach:", error.message);
      const response = await gmail.users.messages.list({
        userId: "me",
        maxResults: 5,
      });
      messages = response.data.messages || [];
      console.log(`✅ Gmail API Response - Found ${messages.length} recent emails (last 5)`);
    }
    const processedPdfs = [];
    const emailsFound = [];

    for (const message of messages) {
      if (!message.id) continue;

      // Get full message details to check attachments
      let fullMessage;
      try {
        // First get metadata
        fullMessage = await gmail.users.messages.get({
          userId: "me",
          id: message.id,
          format: "full",
        });
        
        const headers = fullMessage.data.payload?.headers || [];
        const emailData = {
          id: message.id,
          subject: headers.find((h: any) => h.name === "Subject")?.value || "No subject",
          from: headers.find((h: any) => h.name === "From")?.value || "Unknown",
          date: headers.find((h: any) => h.name === "Date")?.value || new Date().toISOString(),
          hasAttachments: false,
          pdfAttachments: [],
        };

        // Check for attachments
        const parts = fullMessage.data.payload?.parts || [];
        const pdfAttachments = [];
        
        for (const part of parts) {
          if (part.filename) {
            emailData.hasAttachments = true;
            if (part.filename.toLowerCase().endsWith('.pdf')) {
              pdfAttachments.push({
                filename: part.filename,
                attachmentId: part.body?.attachmentId,
                size: part.body?.size || 0,
              });
            }
          }
        }
        
        emailData.pdfAttachments = pdfAttachments;
        emailsFound.push(emailData);
        
        console.log(`📧 Email found: "${emailData.subject}" from ${emailData.from}`);
        console.log(`   📎 Attachments: ${emailData.hasAttachments ? 'Yes' : 'No'}`);
        if (pdfAttachments.length > 0) {
          console.log(`   📄 PDFs found: ${pdfAttachments.map(p => p.filename).join(', ')}`);
          
          // Process each PDF attachment
          for (const pdfAttachment of pdfAttachments) {
            try {
              console.log(`   🔄 Processing PDF: ${pdfAttachment.filename}`);
              
              // Get the attachment data
              const attachment = await gmail.users.messages.attachments.get({
                userId: "me",
                messageId: message.id,
                id: pdfAttachment.attachmentId,
              });

              if (attachment.data.data) {
                // Decode base64 attachment data
                const buffer = Buffer.from(attachment.data.data, "base64");
                
                // Process the PDF using our existing PDF upload endpoint
                const formData = new FormData();
                // Create a proper File object with correct type
                const file = new File([buffer], pdfAttachment.filename, { 
                  type: "application/pdf",
                  lastModified: Date.now()
                });
                formData.append("files", file);

                // Call our PDF processing endpoint
                const processResponse = await fetch(
                  `${process.env.NEXT_PUBLIC_APP_URL}/api/upload/pdf`,
                  {
                    method: "POST",
                    body: formData,
                  }
                );

                if (processResponse.ok) {
                  const result = await processResponse.json();
                  
                  // Check if it was a duplicate
                  if (result.failed > 0 && result.errors?.some((e: any) => e.error.includes("Duplicate"))) {
                    console.log(`   ⚠️  PDF already exists: ${pdfAttachment.filename} - Skipped`);
                  } else if (result.processed > 0) {
                    processedPdfs.push({
                      filename: pdfAttachment.filename,
                      messageId: message.id,
                      result,
                    });
                    console.log(`   ✅ PDF processed successfully: ${pdfAttachment.filename}`);
                    if (result.extractedData?.[0]) {
                      const data = result.extractedData[0];
                      console.log(`      Amount: $${data.amount}, Vendor: ${data.vendor}`);
                      if (result.matchingTransactions?.length > 0) {
                        console.log(`      🔗 Found ${result.matchingTransactions.length} matching bank transactions`);
                      }
                    }
                  }
                } else {
                  const errorText = await processResponse.text();
                  console.log(`   ❌ Failed to process PDF: ${pdfAttachment.filename}`);
                  console.log(`      Status: ${processResponse.status}`);
                  console.log(`      Error: ${errorText}`);
                }
              }
            } catch (error: any) {
              console.log(`   ❌ Error processing attachment: ${error.message}`);
            }
          }
        }
      } catch (error: any) {
        console.log(`❌ Failed to get message ${message.id}:`, error.message);
        if (error.code === 403) {
          console.log(`⚠️  User needs to reconnect Gmail with updated permissions`);
        }
        continue;
      }
    }

    // Update last check timestamp
    await prisma.googleAuth.update({
      where: { email },
      data: { updatedAt: new Date() },
    });

    // Track email statistics
    const emailDetails = [];
    for (const msg of messages.slice(0, 5)) {
      if (!msg.id) continue;
      try {
        const msgDetail = await gmail.users.messages.get({
          userId: "me",
          id: msg.id,
          format: "metadata",
          metadataHeaders: ["Subject", "From"],
        });
        
        const headers = msgDetail.data.payload?.headers || [];
        emailDetails.push({
          id: msg.id,
          subject: headers.find((h: any) => h.name === "Subject")?.value || "No subject",
          from: headers.find((h: any) => h.name === "From")?.value || "Unknown",
          hasPdf: processedPdfs.some(p => p.messageId === msg.id),
          pdfCount: processedPdfs.filter(p => p.messageId === msg.id).length,
          processedAt: new Date(),
        });
      } catch (error) {
        console.log(`Failed to get email details for ${msg.id}`);
      }
    }

    const emailStats = {
      checked: messages.length,
      pdfsFound: processedPdfs.length,
      newEmails: emailDetails,
    };

    // Update tracking (in production, store in database)
    const { updateEmailTracking } = await import("../stats/route");
    updateEmailTracking(email, emailStats);

    const response = {
      processed: processedPdfs.length,
      pdfs: processedPdfs,
      stats: emailStats,
      emailsFound: emailsFound.length,
      emails: emailsFound,
      emailsWithAttachments: emailsFound.filter(e => e.hasAttachments).length,
      emailsWithPdfs: emailsFound.filter(e => e.pdfAttachments.length > 0).length,
    };
    
    console.log("\n📊 Gmail Check Summary:");
    console.log(`- Recent emails checked: ${messages.length} (last 5 emails)`);
    console.log(`- Emails with attachments: ${response.emailsWithAttachments}`);
    console.log(`- Emails with PDFs: ${response.emailsWithPdfs}`);
    console.log(`- New PDFs processed: ${processedPdfs.length}`);
    console.log(`- Account: ${email}`);
    
    // Si se procesaron PDFs, mostrar los resultados
    if (processedPdfs.length > 0) {
      console.log("\n📄 Processed PDFs:");
      for (const pdf of processedPdfs) {
        console.log(`   - ${pdf.filename}: $${pdf.result.amount} from ${pdf.result.vendor}`);
        if (pdf.result.matchingTransactions?.length > 0) {
          console.log(`     🔗 Found ${pdf.result.matchingTransactions.length} matching bank transactions`);
        }
      }
    }
    console.log("------------------------\n");
    
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error checking Gmail:", error);
    return NextResponse.json(
      { error: "Failed to check Gmail" },
      { status: 500 }
    );
  }
}