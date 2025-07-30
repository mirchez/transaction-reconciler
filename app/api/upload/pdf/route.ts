import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { LedgerEntrySchema, UploadResponse } from "@/lib/types/transactions";
import pdf from "pdf-parse";
import { z } from "zod";

// Helper function to extract transaction data from PDF text
function extractTransactionData(text: string): {
  amount?: number;
  date?: string;
  vendor?: string;
  category?: string;
} {
  const data: any = {};

  // Extract amount (look for currency patterns)
  const amountRegex = /\$?[\d,]+\.?\d{0,2}/g;
  const amounts = text.match(amountRegex);
  if (amounts) {
    // Take the largest amount found as the transaction amount
    const parsedAmounts = amounts
      .map((a) => parseFloat(a.replace(/[$,]/g, "")))
      .filter((a) => !isNaN(a));
    if (parsedAmounts.length > 0) {
      data.amount = Math.max(...parsedAmounts);
    }
  }

  // Extract date (look for common date formats)
  const dateRegex = /(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})|(\d{4}[-\/]\d{1,2}[-\/]\d{1,2})/g;
  const dates = text.match(dateRegex);
  if (dates && dates.length > 0) {
    try {
      // Try to parse the first date found
      const parsedDate = new Date(dates[0]);
      if (!isNaN(parsedDate.getTime())) {
        data.date = parsedDate.toISOString();
      }
    } catch {
      // If parsing fails, try to use current date
      data.date = new Date().toISOString();
    }
  }

  // Extract vendor (look for common patterns)
  // This is simplified - in production, you'd use more sophisticated NLP
  const lines = text.split("\n").filter((line) => line.trim());
  if (lines.length > 0) {
    // Often the vendor name is in the first few lines
    data.vendor = lines[0].trim().substring(0, 100); // Limit vendor name length
  }

  // Category extraction would require more sophisticated logic
  // For now, we'll leave it optional
  
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

    const results: UploadResponse & { extractedData?: any[] } = {
      success: true,
      message: "",
      processed: 0,
      failed: 0,
      errors: [],
      extractedData: [],
    };

    // Process each PDF
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        // Validate file type
        if (!file.type.includes("pdf")) {
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

        // Parse PDF
        const pdfData = await pdf(buffer);
        
        // Extract transaction data
        const extractedData = extractTransactionData(pdfData.text);

        // Prepare ledger entry data
        const ledgerData = {
          date: extractedData.date || new Date().toISOString(),
          amount: extractedData.amount || 0,
          vendor: extractedData.vendor || file.name.replace(".pdf", ""),
          category: extractedData.category,
        };

        // Validate the extracted data
        const validationResult = LedgerEntrySchema.safeParse(ledgerData);
        
        if (!validationResult.success) {
          results.errors?.push({
            row: i + 1,
            error: `Invalid data in ${file.name}: ${validationResult.error.errors.map(e => e.message).join(", ")}`,
          });
          results.failed = (results.failed || 0) + 1;
          continue;
        }

        // Save to database
        const savedEntry = await prisma.ledgerEntry.create({
          data: {
            ...validationResult.data,
            userId: "demo-user", // TODO: Replace with actual user ID from auth
            matched: false,
          },
        });

        // Add to extracted data for display
        results.extractedData?.push({
          fileName: file.name,
          ...validationResult.data,
          id: savedEntry.id,
        });

        results.processed = (results.processed || 0) + 1;
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        results.errors?.push({
          row: i + 1,
          error: `Failed to process ${file.name}: ${error instanceof Error ? error.message : "Unknown error"}`,
        });
        results.failed = (results.failed || 0) + 1;
      }
    }

    // Set appropriate message
    if (results.processed === files.length) {
      results.message = `Successfully processed all ${results.processed} PDF file(s)`;
    } else if (results.processed > 0) {
      results.message = `Processed ${results.processed} file(s), failed ${results.failed} file(s)`;
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
        errors: [{ error: error instanceof Error ? error.message : "Unknown error" }],
      },
      { status: 500 }
    );
  }
}