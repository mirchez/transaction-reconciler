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

    // Calculate the time 5 minutes ago
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const gmailDateQuery = Math.floor(fiveMinutesAgo.getTime() / 1000); // Gmail uses Unix timestamp
    
    console.log(`\n🕐 Checking emails from last 5 minutes`);
    console.log(`   Current time: ${new Date().toLocaleString()}`);
    console.log(`   Checking from: ${fiveMinutesAgo.toLocaleString()}`);
    
    // Get only unread emails from the last 5 minutes
    let messages = [];
    try {
      // Get unread emails with PDF attachments from last 5 minutes
      const response = await gmail.users.messages.list({
        userId: "me",
        q: `is:unread has:attachment filename:pdf after:${gmailDateQuery}`,
        maxResults: 20
      });
      messages = response.data.messages || [];
      console.log(`📧 Found ${messages.length} unread emails with PDFs from last 5 minutes`);
    } catch (error: any) {
      // If search fails, try a simpler approach - just get unread emails
      console.log("⚠️ Complex search failed, trying simpler approach:", error.message);
      const response = await gmail.users.messages.list({
        userId: "me",
        q: `is:unread after:${gmailDateQuery}`,
        maxResults: 20,
      });
      messages = response.data.messages || [];
      console.log(`📧 Found ${messages.length} unread emails from last 5 minutes`);
    }
    const processedPdfs: any[] = [];
    const emailsFound: any[] = [];
    const successfullyProcessedMessageIds: string[] = [];
    const failedPdfs: any[] = [];

    for (const message of messages) {
      if (!message.id) continue;

      // Check if this email has already been processed
      try {
        const existingProcessedEmail = await prisma.processedEmail.findUnique({
          where: { gmailId: message.id }
        });
        
        if (existingProcessedEmail) {
          console.log(`⏭️ Email ${message.id} already processed, skipping...`);
          continue;
        }
      } catch (error) {
        console.warn(`⚠️ ProcessedEmail table not available yet, continuing...`);
        // Continue processing if table doesn't exist yet
      }

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
        const dateHeader = headers.find((h: any) => h.name === "Date")?.value;
        const emailDate = dateHeader ? new Date(dateHeader) : new Date();
        
        // Check if email is from the last 5 minutes
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        if (emailDate < fiveMinutesAgo) {
          console.log(`⏭️ Email ${message.id} is older than 5 minutes, skipping...`);
          console.log(`   Email date: ${emailDate.toLocaleString()}`);
          console.log(`   Cutoff time: ${fiveMinutesAgo.toLocaleString()}`);
          continue;
        }
        
        const emailData = {
          id: message.id,
          subject: headers.find((h: any) => h.name === "Subject")?.value || "No subject",
          from: headers.find((h: any) => h.name === "From")?.value || "Unknown",
          date: emailDate.toISOString(),
          hasAttachments: false,
          pdfAttachments: [],
        };

        // Check for attachments
        const parts = fullMessage.data.payload?.parts || [];
        const pdfAttachments: any[] = [];
        
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
        
        // Simplify email logs
        const sender = emailData.from?.split('<')[0]?.trim() || 'Unknown';
        const hasPdfs = pdfAttachments.length > 0;
        if (hasPdfs) {
          console.log(`📄 ${sender}: "${emailData.subject}" - ${pdfAttachments.length} PDF(s)`);
        }
        if (pdfAttachments.length > 0) {
          
          // Process each PDF attachment
          for (const pdfAttachment of pdfAttachments) {
            try {
              
              // Get the attachment data
              if (!pdfAttachment.attachmentId) {
                console.warn(`⚠️ No attachment ID for ${pdfAttachment.filename}`);
                continue;
              }
              
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
                formData.append("file", file);
                formData.append("email", email); // Add the user email

                // Call our PDF processing endpoint
                const processResponse = await fetch(
                  `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/upload/pdf`,
                  {
                    method: "POST",
                    body: formData,
                    headers: {
                      "X-Allow-Duplicates": "true", // Allow duplicates for new emails
                      "X-Email-ID": message.id || "", // Pass the email ID
                    }
                  }
                );

                if (processResponse.ok) {
                  const result = await processResponse.json();
                  
                  // Successfully processed receipt
                  processedPdfs.push({
                    filename: pdfAttachment.filename,
                    messageId: message.id,
                    result,
                  });
                  console.log(`   ✅ PDF processed successfully: ${pdfAttachment.filename}`);
                  
                  // Track successfully processed message
                  if (!successfullyProcessedMessageIds.includes(message.id)) {
                    successfullyProcessedMessageIds.push(message.id);
                  }
                } else {
                  const errorResponse = await processResponse.json();
                  
                  if (errorResponse.isReceipt === false) {
                    console.log(`   ⚠️  Not a receipt: ${pdfAttachment.filename}`);
                    console.log(`      ${errorResponse.message}`);
                    failedPdfs.push({
                      filename: pdfAttachment.filename,
                      reason: "Not a receipt",
                      message: errorResponse.message
                    });
                  } else if (errorResponse.isValid === false) {
                    console.log(`   ⚠️  Invalid receipt: ${pdfAttachment.filename}`);
                    console.log(`      Missing: ${Object.keys(errorResponse.missingFields || {}).filter(k => errorResponse.missingFields[k]).join(", ")}`);
                    failedPdfs.push({
                      filename: pdfAttachment.filename,
                      reason: "Invalid receipt",
                      message: `Missing: ${Object.keys(errorResponse.missingFields || {}).filter(k => errorResponse.missingFields[k]).join(", ")}`
                    });
                  } else {
                    console.log(`   ❌ Failed to process PDF: ${pdfAttachment.filename}`);
                    console.log(`      Error: ${errorResponse.error || errorResponse.message}`);
                    failedPdfs.push({
                      filename: pdfAttachment.filename,
                      reason: "Processing error",
                      message: errorResponse.error || errorResponse.message
                    });
                  }
                }
              }
            } catch (error: any) {
              console.log(`   ❌ Error processing attachment: ${error.message}`);
            }
          }
          
          // Mark this email as processed if we processed at least one PDF
          if (pdfAttachments.length > 0) {
            try {
              await prisma.processedEmail.create({
                data: {
                  gmailId: message.id,
                  userEmail: email,
                  subject: emailData.subject,
                  from: emailData.from,
                  attachmentCount: pdfAttachments.length
                }
              });
              console.log(`✅ Email ${message.id} marked as processed`);
            } catch (error: any) {
              if (error.message?.includes('processedEmail')) {
                console.warn(`⚠️ ProcessedEmail table not available yet`);
              } else {
                console.error(`Failed to mark email as processed:`, error.message);
              }
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
      failedPdfs: failedPdfs,
      stats: emailStats,
      emailsFound: emailsFound.length,
      emails: emailsFound,
      emailsWithAttachments: emailsFound.filter(e => e.hasAttachments).length,
      emailsWithPdfs: emailsFound.filter(e => e.pdfAttachments.length > 0).length,
      newEmails: processedPdfs.length, // Para compatibilidad con el frontend
      totalChecked: messages.length,
      message: processedPdfs.length > 0 ? 
        `Processed ${processedPdfs.length} PDF${processedPdfs.length > 1 ? 's' : ''} successfully` : 
        failedPdfs.length > 0 ?
          `Found ${failedPdfs.length} PDF${failedPdfs.length > 1 ? 's' : ''} but they were not valid receipts` :
        messages.length > 0 ? 
          "Found emails but no new PDFs to process" : 
          "No unread emails found"
    };
    
    console.log(`\n📊 Summary: ${messages.length} emails | ${response.emailsWithPdfs} with PDFs | ${processedPdfs.length} processed`);
    
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
    
    // Mark successfully processed emails as read
    if (successfullyProcessedMessageIds.length > 0) {
      try {
        console.log(`\n🔖 Marking ${successfullyProcessedMessageIds.length} processed emails as read...`);
        const markReadResponse = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/gmail/mark-read`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              messageIds: successfullyProcessedMessageIds,
            }),
          }
        );
        
        if (markReadResponse.ok) {
          const markReadResult = await markReadResponse.json();
          console.log(`✅ Marked ${markReadResult.marked} emails as read`);
        }
      } catch (error) {
        console.error("Failed to mark emails as read:", error);
        // Don't fail the whole operation if marking as read fails
      }
    }
    
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error checking Gmail:", error);
    return NextResponse.json(
      { error: "Failed to check Gmail" },
      { status: 500 }
    );
  }
}