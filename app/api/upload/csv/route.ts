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

      return {
        date: row[mapping.dateColumn] || new Date().toISOString(),
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
    ];
    const descColumns = ["description", "desc", "memo", "details", "merchant"];
    const amountColumns = [
      "amount",
      "debit",
      "credit",
      "withdrawal",
      "deposit",
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

    // Parse date
    let parsedDate = new Date().toISOString();
    if (date) {
      try {
        const d = new Date(date);
        if (!isNaN(d.getTime())) {
          parsedDate = d.toISOString();
        }
      } catch {}
    }

    return {
      date: parsedDate,
      description: description || "Unknown transaction",
      amount: amount,
    };
  });
}

async function matchTransactions(userEmail: string) {
  // Get unmatched ledger and bank entries
  const [ledgerEntries, bankEntries] = await Promise.all([
    prisma.ledger.findMany({
      where: {
        userEmail,
        matched: {
          none: {},
        },
      },
    }),
    prisma.bank.findMany({
      where: {
        userEmail,
        matched: {
          none: {},
        },
      },
    }),
  ]);

  const matches = [];

  for (const bank of bankEntries) {
    for (const ledger of ledgerEntries) {
      // Check if amounts match (bank amount vs ledger debit or credit)
      const bankAmount = Number(bank.amount);
      const ledgerAmount = Number(ledger.debit || ledger.credit || 0);

      if (Math.abs(bankAmount - ledgerAmount) < 0.01) {
        // Check if dates are close (within 7 days)
        const bankDate = new Date(bank.date);
        const ledgerDate = new Date(ledger.date);
        const daysDiff =
          Math.abs(bankDate.getTime() - ledgerDate.getTime()) /
          (1000 * 60 * 60 * 24);

        if (daysDiff <= 7) {
          // Check if descriptions are similar
          const bankDesc = bank.description.toLowerCase();
          const ledgerDesc = (
            ledger.description ||
            ledger.name ||
            ""
          ).toLowerCase();

          if (
            bankDesc.includes(ledgerDesc) ||
            ledgerDesc.includes(bankDesc) ||
            (ledger.name && bankDesc.includes(ledger.name.toLowerCase()))
          ) {
            matches.push({ bank, ledger });
          }
        }
      }
    }
  }

  // Create matched records
  for (const match of matches) {
    const { bank, ledger } = match;

    await prisma.matched.create({
      data: {
        userEmail,
        ledgerId: ledger.id,
        bankId: bank.id,
        bankTransaction: `From: ${bank.description} $${
          bank.amount
        } on ${new Date(bank.date).toLocaleDateString()}`,
        description: ledger.description,
        amount: bank.amount,
        date: ledger.date,
      },
    });
  }

  return matches.length;
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
    const createdTransactions = [];
    const duplicates = [];

    for (const transaction of bankData) {
      const transactionDate = new Date(transaction.date);
      const transactionAmount = new Decimal(transaction.amount);

      // Check if this exact transaction already exists
      const existingTransaction = await prisma.bank.findFirst({
        where: {
          userEmail,
          date: transactionDate,
          description: transaction.description,
          amount: transactionAmount,
        },
      });

      if (existingTransaction) {
        duplicates.push(transaction);
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

    // If all transactions are duplicates, return error
    if (createdTransactions.length === 0 && duplicates.length > 0) {
      return NextResponse.json(
        {
          error: "All transactions already exist",
          message:
            "This file has already been uploaded - duplicate files are not allowed",
          duplicates: duplicates.length,
        },
        { status: 409 } // Conflict status
      );
    }

    // Perform matching
    const matchedCount = await matchTransactions(userEmail);

    return NextResponse.json({
      success: true,
      message:
        duplicates.length > 0
          ? `Processed ${createdTransactions.length} transactions (${duplicates.length} duplicates skipped)`
          : `Processed ${createdTransactions.length} transactions`,
      stats: {
        total: createdTransactions.length,
        duplicates: duplicates.length,
        matched: matchedCount,
        unmatched: createdTransactions.length - matchedCount,
      },
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
