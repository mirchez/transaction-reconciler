import { NextResponse } from "next/server";
import { google } from "googleapis";
import { prisma } from "@/lib/db";
import { parsePDF } from "@/lib/pdf-parser";
import { extractLedgerDataWithOpenAI } from "@/lib/openai-service";
import { Decimal } from "@prisma/client/runtime/library";

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

    console.log(`🔍 Checking Gmail for ${email}`);

    // Ensure user exists
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    let oauth2Client;
    let googleAuth;
    
    try {
      const result = await getAuthenticatedClient(email);
      oauth2Client = result.oauth2Client;
      googleAuth = result.googleAuth;
    } catch (error) {
      console.error("❌ Failed to authenticate:", error);
      return NextResponse.json(
        { error: "Gmail not connected or authentication failed" },
        { status: 401 }
      );
    }

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
                
                try {
                  // Parse PDF directly
                  const pdfData = await parsePDF(buffer);
                  const pdfText = pdfData.text;

                  if (!pdfText || pdfText.trim().length === 0) {
                    throw new Error("Could not extract text from PDF");
                  }

                  // Extract ledger data using AI
                  const extractedData = await extractLedgerDataWithOpenAI(pdfText);

                  if (!extractedData.isLedgerEntry) {
                    console.log(`   ⚠️  Not a financial document: ${pdfAttachment.filename}`);
                    failedPdfs.push({
                      filename: pdfAttachment.filename,
                      reason: "Not a receipt",
                      message: "No financial data found"
                    });
                    continue;
                  }

                  // Validate minimum required data
                  const hasAmount = extractedData.amount && extractedData.amount > 0;
                  const hasDescription = extractedData.description && extractedData.description.trim() !== "";
                  
                  if (!hasAmount || !hasDescription) {
                    console.log(`   ⚠️  Invalid receipt: ${pdfAttachment.filename}`);
                    const missing = [];
                    if (!hasAmount) missing.push("amount");
                    if (!hasDescription) missing.push("description");
                    failedPdfs.push({
                      filename: pdfAttachment.filename,
                      reason: "Invalid receipt",
                      message: `Missing: ${missing.join(", ")}`
                    });
                    continue;
                  }

                  // Create ledger entry
                  const ledgerEntry = await prisma.ledger.create({
                    data: {
                      userEmail: email,
                      date: extractedData.date ? new Date(extractedData.date) : new Date(),
                      description: extractedData.description || "Unknown transaction",
                      amount: new Decimal(extractedData.amount || 0),
                    },
                  });

                  // Successfully processed receipt
                  processedPdfs.push({
                    filename: pdfAttachment.filename,
                    messageId: message.id,
                    result: {
                      id: ledgerEntry.id,
                      date: ledgerEntry.date.toISOString(),
                      description: ledgerEntry.description,
                      amount: Number(ledgerEntry.amount),
                    },
                  });
                  console.log(`   ✅ PDF processed successfully: ${pdfAttachment.filename}`);
                  
                  // Track successfully processed message
                  if (!successfullyProcessedMessageIds.includes(message.id)) {
                    successfullyProcessedMessageIds.push(message.id);
                  }
                } catch (processingError: any) {
                  console.log(`   ❌ Failed to process PDF: ${pdfAttachment.filename}`);
                  console.log(`      Error: ${processingError.message}`);
                  failedPdfs.push({
                    filename: pdfAttachment.filename,
                    reason: "Processing error",
                    message: processingError.message
                  });
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

    // Update tracking is done through the database, not needed here

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
        console.log(`   - ${pdf.filename}: $${pdf.result.amount} - ${pdf.result.description}`);
      }
    }
    console.log("------------------------\n");
    
    // Mark successfully processed emails as read
    if (successfullyProcessedMessageIds.length > 0) {
      try {
        console.log(`\n🔖 Marking ${successfullyProcessedMessageIds.length} processed emails as read...`);
        
        // Mark emails as read using Gmail API directly
        for (const messageId of successfullyProcessedMessageIds) {
          try {
            await gmail.users.messages.modify({
              userId: "me",
              id: messageId,
              requestBody: {
                removeLabelIds: ["UNREAD"],
              },
            });
          } catch (error) {
            console.log(`Failed to mark message ${messageId} as read:`, error);
          }
        }
        
        console.log(`✅ Marked ${successfullyProcessedMessageIds.length} emails as read`);
      } catch (error) {
        console.error("Failed to mark emails as read:", error);
        // Don't fail the whole operation if marking as read fails
      }
    }
    
    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Error checking Gmail:", error);
    
    // Provide more specific error messages
    let errorMessage = "Failed to check Gmail";
    let statusCode = 500;
    
    if (error.code === 401) {
      errorMessage = "Gmail authentication failed. Please reconnect your account.";
      statusCode = 401;
    } else if (error.code === 403) {
      errorMessage = "Gmail permissions denied. Please reconnect with proper permissions.";
      statusCode = 403;
    } else if (error.message?.includes("token")) {
      errorMessage = "Gmail access token expired. Please reconnect your account.";
      statusCode = 401;
    } else if (error.message?.includes("OPENAI_API_KEY")) {
      errorMessage = "OpenAI service not configured. Please contact support.";
      statusCode = 503;
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error.message 
      },
      { status: statusCode }
    );
  }
}