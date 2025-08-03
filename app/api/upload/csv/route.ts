import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import Papa from "papaparse";
import { Decimal } from "@prisma/client/runtime/library";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface CSVRow {
  [key: string]: string;
}

async function extractBankDataWithAI(csvData: CSVRow[]): Promise<
  {
    date: string;
    description: string;
    amount: number;
  }[]
> {
  if (!process.env.OPENAI_API_KEY || csvData.length === 0) {
    return extractBankDataFallback(csvData);
  }

  try {
    const headers = Object.keys(csvData[0]);
    const sampleRows = csvData.slice(0, 5);

    const prompt = `Analyze this CSV bank statement data and identify which columns contain:
1. Transaction date
2. Transaction description
3. Transaction amount (could be debit/credit or single amount column)

Headers: ${headers.join(", ")}
Sample data: ${JSON.stringify(sampleRows, null, 2)}

Return a JSON object with this format:
{
  "dateColumn": "column_name",
  "descriptionColumn": "column_name", 
  "amountColumn": "column_name",
  "isDebitCreditSeparate": true/false,
  "debitColumn": "column_name" (if separate),
  "creditColumn": "column_name" (if separate)
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a CSV data analyzer. Identify column mappings for bank transaction data.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    const mapping = JSON.parse(completion.choices[0]?.message?.content || "{}");

    return csvData.map((row) => {
      let amount = 0;
      if (mapping.isDebitCreditSeparate) {
        const debit = parseFloat(row[mapping.debitColumn] || "0");
        const credit = parseFloat(row[mapping.creditColumn] || "0");
        amount = debit || -credit; // Debits positive, credits negative
      } else {
        amount = parseFloat(row[mapping.amountColumn] || "0");
      }

      // Parse date using the helper function
      const dateStr = row[mapping.dateColumn] || "";
      const parsedDate = dateStr ? parseDate(dateStr) : new Date().toISOString();

      return {
        date: parsedDate,
        description: row[mapping.descriptionColumn] || "Unknown transaction",
        amount: Math.abs(amount), // Store as positive
      };
    });
  } catch (error) {
    console.error("AI CSV parsing error:", error);
    return extractBankDataFallback(csvData);
  }
}

function extractBankDataFallback(csvData: CSVRow[]): {
  date: string;
  description: string;
  amount: number;
}[] {
  return csvData.map((row) => {
    // Common column name patterns
    const dateColumns = [
      "date",
      "transaction date",
      "posted date",
      "trans date",
      "fecha",
      "fecha transaccion",
    ];
    const descColumns = ["description", "desc", "memo", "details", "merchant", "descripcion", "concepto"];
    const amountColumns = [
      "amount",
      "debit",
      "credit",
      "withdrawal",
      "deposit",
      "monto",
      "importe",
      "cargo",
      "abono",
    ];

    let date = "";
    let description = "";
    let amount = 0;

    // Find columns case-insensitively
    for (const [key, value] of Object.entries(row)) {
      const lowerKey = key.toLowerCase();

      if (dateColumns.some((col) => lowerKey.includes(col))) {
        date = value;
      } else if (descColumns.some((col) => lowerKey.includes(col))) {
        description = value;
      } else if (amountColumns.some((col) => lowerKey.includes(col))) {
        const parsed = parseFloat(value.replace(/[$,]/g, ""));
        if (!isNaN(parsed)) {
          amount = Math.abs(parsed);
        }
      }
    }

    // Parse date with multiple format support
    let parsedDate = new Date().toISOString();
    if (date) {
      parsedDate = parseDate(date);
    }

    return {
      date: parsedDate,
      description: description || "Unknown transaction",
      amount: amount,
    };
  });
}

function parseDate(dateStr: string): string {
  // Try multiple date formats
  const formats = [
    // ISO format
    (s: string) => new Date(s),
    // DD/MM/YYYY
    (s: string) => {
      const parts = s.split('/');
      if (parts.length === 3) {
        return new Date(`${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`);
      }
      return null;
    },
    // MM/DD/YYYY
    (s: string) => {
      const parts = s.split('/');
      if (parts.length === 3) {
        return new Date(`${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`);
      }
      return null;
    },
    // DD-MM-YYYY
    (s: string) => {
      const parts = s.split('-');
      if (parts.length === 3 && parts[0].length <= 2) {
        return new Date(`${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`);
      }
      return null;
    },
    // YYYY-MM-DD (already ISO)
    (s: string) => {
      if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
        return new Date(s);
      }
      return null;
    }
  ];

  for (const format of formats) {
    try {
      const date = format(dateStr);
      if (date && !isNaN(date.getTime())) {
        return date.toISOString();
      }
    } catch {}
  }

  // If all formats fail, return current date
  console.warn(`Could not parse date: ${dateStr}, using current date`);
  return new Date().toISOString();
}


export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const userEmail = formData.get("email") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!userEmail) {
      return NextResponse.json({ error: "No email provided" }, { status: 400 });
    }

    // Ensure user exists
    await prisma.user.upsert({
      where: { email: userEmail },
      update: {},
      create: { email: userEmail },
    });

    // Parse CSV
    const text = await file.text();
    const parseResult = Papa.parse<CSVRow>(text, {
      header: true,
      skipEmptyLines: true,
    });

    if (parseResult.errors.length > 0) {
      console.error("CSV parsing errors:", parseResult.errors);
      return NextResponse.json(
        { error: "Failed to parse CSV file" },
        { status: 400 }
      );
    }

    // Extract bank data using AI
    const bankData = await extractBankDataWithAI(parseResult.data);

    // Check for duplicates and save bank transactions
    const createdTransactions: any[] = [];
    const duplicates: any[] = [];
    const skippedSimilar: any[] = [];

    for (const transaction of bankData) {
      const transactionDate = new Date(transaction.date);
      const transactionAmount = new Decimal(transaction.amount);

      // Skip if date is invalid
      if (isNaN(transactionDate.getTime())) {
        console.error(`Invalid date for transaction: ${transaction.description}`);
        continue;
      }

      // Strict duplicate checking - check for similar transactions
      const existingTransaction = await prisma.bank.findFirst({
        where: {
          userEmail,
          AND: [
            {
              date: {
                gte: new Date(transactionDate.getTime() - 24 * 60 * 60 * 1000), // 1 day before
                lte: new Date(transactionDate.getTime() + 24 * 60 * 60 * 1000), // 1 day after
              },
            },
            {
              amount: transactionAmount,
            },
            {
              OR: [
                { description: transaction.description },
                { description: { contains: transaction.description.split(' ')[0] } }, // Check first word
                { description: { contains: transaction.description.slice(-10) } }, // Check last 10 chars
              ],
            },
          ],
        },
      });

      if (existingTransaction) {
        const exactMatch = 
          existingTransaction.date.toISOString().split('T')[0] === transactionDate.toISOString().split('T')[0] &&
          existingTransaction.description === transaction.description &&
          existingTransaction.amount.equals(transactionAmount);

        if (exactMatch) {
          duplicates.push({
            ...transaction,
            existingId: existingTransaction.id,
            reason: "Exact duplicate"
          });
        } else {
          skippedSimilar.push({
            ...transaction,
            existingId: existingTransaction.id,
            reason: "Similar transaction detected",
            existing: {
              date: existingTransaction.date.toISOString().split('T')[0],
              description: existingTransaction.description,
              amount: Number(existingTransaction.amount)
            }
          });
        }
      } else {
        const created = await prisma.bank.create({
          data: {
            userEmail,
            date: transactionDate,
            description: transaction.description,
            amount: transactionAmount,
          },
        });
        createdTransactions.push(created);
      }
    }

    // If all transactions are duplicates or similar, return error
    if (createdTransactions.length === 0 && (duplicates.length > 0 || skippedSimilar.length > 0)) {
      return NextResponse.json(
        {
          error: "All transactions already exist or are too similar",
          message:
            "This CSV file appears to contain duplicate transactions. Duplicate bank statements are strictly prohibited to maintain data integrity.",
          duplicates: duplicates.length,
          similar: skippedSimilar.length,
          details: {
            exactDuplicates: duplicates.slice(0, 5), // Show first 5
            similarTransactions: skippedSimilar.slice(0, 5), // Show first 5
          }
        },
        { status: 409 } // Conflict status
      );
    }

    // Log details if we have duplicates or similar transactions
    if (duplicates.length > 0 || skippedSimilar.length > 0) {
      console.log(`⚠️ CSV Upload: Found ${duplicates.length} exact duplicates and ${skippedSimilar.length} similar transactions`);
      if (duplicates.length > 0) {
        console.log("Exact duplicates:", duplicates.slice(0, 3).map(d => `${d.date} - ${d.description} - $${d.amount}`));
      }
      if (skippedSimilar.length > 0) {
        console.log("Similar transactions:", skippedSimilar.slice(0, 3).map(s => `${s.date} - ${s.description} - $${s.amount}`));
      }
    }

    return NextResponse.json({
      success: true,
      message:
        duplicates.length > 0 || skippedSimilar.length > 0
          ? `Processed ${createdTransactions.length} new transactions (${duplicates.length} exact duplicates and ${skippedSimilar.length} similar transactions skipped)`
          : `Successfully processed ${createdTransactions.length} transactions`,
      stats: {
        total: bankData.length,
        created: createdTransactions.length,
        duplicates: duplicates.length,
        similar: skippedSimilar.length,
      },
      warnings: skippedSimilar.length > 0 ? {
        message: "Some transactions were skipped because they appear to be similar to existing ones",
        count: skippedSimilar.length,
        examples: skippedSimilar.slice(0, 3)
      } : undefined
    });
  } catch (error) {
    console.error("CSV upload error:", error);
    return NextResponse.json(
      {
        error: "Failed to process CSV",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
