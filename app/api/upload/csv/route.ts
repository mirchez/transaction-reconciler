import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { BankTransactionSchema, CSVRowSchema, UploadResponse } from "@/lib/types/transactions";
import Papa from "papaparse";
import { z } from "zod";

// Helper function to parse amount string to number
function parseAmount(amountStr: string): number {
  // Remove currency symbols, commas, and spaces
  const cleanAmount = amountStr.replace(/[$,\s]/g, "");
  
  // Handle negative amounts (parentheses or minus sign)
  const isNegative = cleanAmount.includes("(") || cleanAmount.startsWith("-");
  const numericAmount = parseFloat(cleanAmount.replace(/[()]/g, "").replace("-", ""));
  
  return isNegative ? -numericAmount : numericAmount;
}

// Helper function to parse date string to ISO format
function parseDate(dateStr: string): string {
  try {
    // Try various date formats
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
    
    // Try MM/DD/YYYY format
    const parts = dateStr.split(/[-\/]/);
    if (parts.length === 3) {
      const [part1, part2, part3] = parts;
      
      // Determine if it's MM/DD/YYYY or DD/MM/YYYY based on values
      let month, day, year;
      
      if (part3.length === 4) {
        // Format is either MM/DD/YYYY or DD/MM/YYYY
        year = parseInt(part3);
        if (parseInt(part1) > 12) {
          // Must be DD/MM/YYYY
          day = parseInt(part1);
          month = parseInt(part2) - 1;
        } else {
          // Assume MM/DD/YYYY (US format)
          month = parseInt(part1) - 1;
          day = parseInt(part2);
        }
      } else if (part1.length === 4) {
        // Format is YYYY/MM/DD
        year = parseInt(part1);
        month = parseInt(part2) - 1;
        day = parseInt(part3);
      } else {
        throw new Error("Unknown date format");
      }
      
      const parsedDate = new Date(year, month, day);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toISOString();
      }
    }
    
    throw new Error("Could not parse date");
  } catch {
    // If all parsing fails, return current date
    return new Date().toISOString();
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.includes("csv") && !file.name.endsWith(".csv")) {
      return NextResponse.json(
        { success: false, message: "File must be a CSV" },
        { status: 400 }
      );
    }

    // Read file content
    const text = await file.text();

    // Parse CSV
    const parseResult = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase(),
    });

    if (parseResult.errors.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Failed to parse CSV", 
          errors: parseResult.errors.map(e => ({ error: e.message }))
        },
        { status: 400 }
      );
    }

    const results: UploadResponse = {
      success: true,
      message: "",
      processed: 0,
      failed: 0,
      errors: [],
    };

    // Process each row
    for (let i = 0; i < parseResult.data.length; i++) {
      const row = parseResult.data[i] as any;

      try {
        // Map CSV columns to our schema
        // Try to find date, amount, and description columns
        let date = row.date || row.Date || row.transaction_date || row["Transaction Date"] || "";
        let amount = row.amount || row.Amount || row.debit || row.credit || row.Debit || row.Credit || "";
        let description = row.description || row.Description || row.merchant || row.Merchant || row.details || row.Details || "";

        // If columns not found, try by index (common CSV formats)
        if (!date && !amount && !description) {
          const values = Object.values(row);
          if (values.length >= 3) {
            date = values[0] as string;
            description = values[1] as string;
            amount = values[2] as string;
          }
        }

        // Create CSV row object
        const csvRow = {
          date,
          amount: amount.toString(),
          description,
        };

        // Validate CSV row format
        const csvValidation = CSVRowSchema.safeParse(csvRow);
        if (!csvValidation.success) {
          results.errors?.push({
            row: i + 1,
            error: `Invalid row format: ${csvValidation.error.errors.map(e => e.message).join(", ")}`,
          });
          results.failed = (results.failed || 0) + 1;
          continue;
        }

        // Transform to bank transaction format
        const bankTransaction = {
          date: parseDate(csvValidation.data.date),
          amount: parseAmount(csvValidation.data.amount),
          description: csvValidation.data.description,
        };

        // Validate bank transaction
        const bankValidation = BankTransactionSchema.safeParse(bankTransaction);
        if (!bankValidation.success) {
          results.errors?.push({
            row: i + 1,
            error: `Invalid data: ${bankValidation.error.errors.map(e => e.message).join(", ")}`,
          });
          results.failed = (results.failed || 0) + 1;
          continue;
        }

        // Save to database
        await prisma.bankTransaction.create({
          data: {
            ...bankValidation.data,
            userId: "demo-user", // TODO: Replace with actual user ID from auth
            matched: false,
          },
        });

        results.processed = (results.processed || 0) + 1;
      } catch (error) {
        console.error(`Error processing row ${i + 1}:`, error);
        results.errors?.push({
          row: i + 1,
          error: error instanceof Error ? error.message : "Unknown error",
        });
        results.failed = (results.failed || 0) + 1;
      }
    }

    // Set appropriate message
    if (results.processed === parseResult.data.length) {
      results.message = `Successfully imported ${results.processed} transaction(s)`;
    } else if (results.processed > 0) {
      results.message = `Imported ${results.processed} transaction(s), failed ${results.failed} row(s)`;
    } else {
      results.message = `Failed to import any transactions`;
      results.success = false;
    }

    return NextResponse.json(results, {
      status: results.success ? 200 : 400,
    });
  } catch (error) {
    console.error("CSV upload error:", error);
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