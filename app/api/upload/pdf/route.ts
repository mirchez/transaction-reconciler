import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { LedgerEntrySchema, UploadResponse } from "@/lib/types/transactions";
import { parsePDF } from "@/lib/pdf-parser";

// Helper function to extract transaction data from PDF text
function extractTransactionData(text: string): {
  amount?: number;
  date?: string;
  vendor?: string;
  category?: string;
} {
  const data: any = {};

  console.log("PDF Text Content:", text); // Debug log

  // Extract amount - look for Total: pattern first
  const totalRegex = /Total:?\s*\$?([\d,]+\.?\d{0,2})/i;
  const totalMatch = text.match(totalRegex);

  if (totalMatch) {
    data.amount = parseFloat(totalMatch[1].replace(/,/g, ""));
  } else {
    // Fallback: look for largest amount
    const amountRegex = /\$([\d,]+\.?\d{0,2})/g;
    const amounts = text.match(amountRegex);
    if (amounts) {
      const parsedAmounts = amounts
        .map((a) => parseFloat(a.replace(/[$,]/g, "")))
        .filter((a) => !isNaN(a) && a > 0);
      if (parsedAmounts.length > 0) {
        data.amount = Math.max(...parsedAmounts);
      }
    }
  }

  // Extract date - Look for "Date:" pattern first, then common formats
  const datePatternRegex = /Date:\s*([^\n]+)/i;
  const datePatternMatch = text.match(datePatternRegex);

  if (datePatternMatch) {
    const dateStr = datePatternMatch[1].trim();
    try {
      const parsedDate = new Date(dateStr);
      if (!isNaN(parsedDate.getTime())) {
        data.date = parsedDate.toISOString();
      }
    } catch {
      // Continue to fallback
    }
  }

  if (!data.date) {
    // Fallback: look for common date formats
    const dateRegex =
      /(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})|(\d{4}[-\/]\d{1,2}[-\/]\d{1,2})|(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},?\s+\d{4}/gi;
    const dates = text.match(dateRegex);
    if (dates && dates.length > 0) {
      try {
        const parsedDate = new Date(dates[0]);
        if (!isNaN(parsedDate.getTime())) {
          data.date = parsedDate.toISOString();
        } else {
          data.date = new Date().toISOString();
        }
      } catch {
        data.date = new Date().toISOString();
      }
    } else {
      data.date = new Date().toISOString();
    }
  }

  // Extract vendor - look for company name after RECEIPT header
  const lines = text
    .split("\n")
    .filter((line) => line.trim() && line.length > 2);

  // Look for vendor name (usually the second non-empty line after RECEIPT)
  let foundReceipt = false;
  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.toLowerCase() === "receipt") {
      foundReceipt = true;
      continue;
    }

    if (
      foundReceipt &&
      trimmed.length > 3 &&
      !trimmed.match(/^\d/) &&
      !trimmed.match(/^\$/) &&
      !trimmed.toLowerCase().includes("phone") &&
      !trimmed.toLowerCase().includes("ave") &&
      !trimmed.toLowerCase().includes("street")
    ) {
      data.vendor = trimmed.substring(0, 100);
      break;
    }
  }

  // Fallback vendor extraction
  if (!data.vendor) {
    for (const line of lines) {
      const trimmed = line.trim();
      if (
        !trimmed.toLowerCase().includes("receipt") &&
        !trimmed.match(/^\d+$/) &&
        !trimmed.match(/^\$?[\d,]+\.?\d{0,2}$/) &&
        !trimmed.match(/^\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}/) &&
        trimmed.length > 3 &&
        !trimmed.includes(":")
      ) {
        data.vendor = trimmed.substring(0, 100);
        break;
      }
    }
  }

  if (!data.vendor) {
    data.vendor = "Unknown Vendor";
  }

  // Category extraction based on items
  const categoryKeywords = {
    Software: ["software", "license", "subscription", "app"],
    Training: ["training", "course", "tutorial", "education"],
    Support: ["support", "maintenance", "service"],
    Hardware: ["hardware", "device", "equipment"],
    Office: ["office", "supplies", "stationery"],
  };

  const lowerText = text.toLowerCase();
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((keyword) => lowerText.includes(keyword))) {
      data.category = category;
      break;
    }
  }

  if (!data.category) {
    data.category = "General";
  }

  return data;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "No files provided" },
        { status: 400 }
      );
    }

    const results: UploadResponse & {
      extractedData?: any[];
      sessionId?: string;
    } = {
      success: true,
      message: "",
      processed: 0,
      failed: 0,
      errors: [],
      extractedData: [],
      sessionId: undefined,
    };

    // Create a session for this upload batch
    const sessionId = `session-${Date.now()}`;
    results.sessionId = sessionId;

    // Process each PDF
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        // Validate file type
        if (
          !file.type.includes("pdf") &&
          !file.name.toLowerCase().endsWith(".pdf")
        ) {
          results.errors?.push({
            row: i + 1,
            error: `File ${file.name} is not a PDF`,
          });
          results.failed = (results.failed || 0) + 1;
          continue;
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Parse PDF using our wrapper
        const pdfData = await parsePDF(buffer);

        // Extract transaction data
        const extractedData = extractTransactionData(pdfData.text);

        // Prepare ledger entry data
        const ledgerData = {
          date: extractedData.date || new Date().toISOString(),
          amount: extractedData.amount || 0,
          vendor: extractedData.vendor || file.name.replace(".pdf", ""),
          category: extractedData.category || "General",
        };

        // Validate the extracted data
        const validationResult = LedgerEntrySchema.safeParse(ledgerData);

        if (!validationResult.success) {
          results.errors?.push({
            row: i + 1,
            error: `Invalid data in ${
              file.name
            }: ${validationResult.error.issues
              .map((e: any) => e.message)
              .join(", ")}`,
          });
          results.failed = (results.failed || 0) + 1;
          continue;
        }

        // Save to database
        const savedEntry = await prisma.ledgerEntry.create({
          data: {
            ...validationResult.data,
            matched: false,
          },
        });

        // Check for matching bank transactions
        const matchingTransactions = await prisma.bankTransaction.findMany({
          where: {
            matched: false,
            amount: {
              equals: validationResult.data.amount,
            },
            date: {
              gte: new Date(
                new Date(validationResult.data.date).getTime() -
                  7 * 24 * 60 * 60 * 1000
              ), // 7 days before
              lte: new Date(
                new Date(validationResult.data.date).getTime() +
                  7 * 24 * 60 * 60 * 1000
              ), // 7 days after
            },
          },
        });

        // If we find a match, create a match log
        if (matchingTransactions.length > 0) {
          const bestMatch = matchingTransactions[0]; // Simple: take first match

          await prisma.matchLog.create({
            data: {
              ledgerEntryId: savedEntry.id,
              bankTransactionId: bestMatch.id,
              matchScore: 0.9, // High confidence for exact amount match
            },
          });

          // Update both entries as matched
          await Promise.all([
            prisma.ledgerEntry.update({
              where: { id: savedEntry.id },
              data: { matched: true },
            }),
            prisma.bankTransaction.update({
              where: { id: bestMatch.id },
              data: { matched: true },
            }),
          ]);
        }

        // Add to extracted data for display
        results.extractedData?.push({
          fileName: file.name,
          date: validationResult.data.date,
          amount: validationResult.data.amount,
          vendor: validationResult.data.vendor,
          category: validationResult.data.category,
          id: savedEntry.id,
        });

        results.processed = (results.processed || 0) + 1;
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        results.errors?.push({
          row: i + 1,
          error: `Failed to process ${file.name}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        });
        results.failed = (results.failed || 0) + 1;
      }
    }

    // Set appropriate message
    if ((results.processed || 0) === files.length) {
      results.message = `Successfully processed all ${
        results.processed || 0
      } PDF file(s)`;
    } else if ((results.processed || 0) > 0) {
      results.message = `Processed ${results.processed || 0} file(s), failed ${
        results.failed || 0
      } file(s)`;
    } else {
      results.message = `Failed to process all files`;
      results.success = false;
    }

    return NextResponse.json(results, {
      status: results.success ? 200 : 400,
    });
  } catch (error) {
    console.error("PDF upload error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        errors: [
          { error: error instanceof Error ? error.message : "Unknown error" },
        ],
      },
      { status: 500 }
    );
  }
}
