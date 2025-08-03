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

async function enhanceDescriptionsWithAI(transactions: {
  date: string;
  description: string;
  amount: number;
  missingFields?: string[];
}[]): Promise<{
  date: string;
  description: string;
  amount: number;
  missingFields?: string[];
}[]> {
  try {
    // Only enhance descriptions that are not N/A
    const descriptionsToEnhance = transactions.map(t => 
      t.description === "N/A" ? "N/A" : t.description
    );
    
    const enhancementPrompt = `You are an expert at converting bank transaction codes and abbreviations into clear, descriptive transaction descriptions. 

Transform these bank transaction descriptions to be more detailed and user-friendly (minimum 5 words each):

Input descriptions: ${JSON.stringify(descriptionsToEnhance)}

Rules for enhancement:
- If a description is "N/A", keep it as "N/A" without modification
- Convert abbreviations to full words: "AMZ" → "Amazon", "WMT" → "Walmart", "SBUX" → "Starbucks"
- Add context when possible: "ATM" → "ATM Cash Withdrawal", "DEP" → "Direct Deposit Payment"
- Keep merchant names recognizable: "STARBUCKS #1234" → "Starbucks Coffee Purchase Location 1234"
- Make payment types clear: "ACH" → "ACH Electronic Transfer", "WIRE" → "Wire Transfer Payment"
- For unclear codes, add "Transaction" or "Payment" to meet minimum word count
- Maintain the essential information while making it more readable
- Each description must be at least 5 words long (except for "N/A" values)

Examples:
- "AMZ PMNT" → "Amazon Payment Transaction"
- "UBER TRIP" → "Uber Transportation Service Trip"
- "DEPOSIT ACH" → "ACH Direct Deposit Payment"
- "WMT SUPERCENTER #1234" → "Walmart Supercenter Store Purchase Transaction"
- "ATM WITHDRAWAL FEE" → "ATM Cash Withdrawal Fee Transaction"

Return a JSON object with a "descriptions" array containing enhanced descriptions in the same order:
{
  "descriptions": ["Enhanced description 1", "Enhanced description 2", ...]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a bank transaction description enhancer. Make descriptions clear, detailed, and user-friendly while maintaining accuracy."
        },
        { role: "user", content: enhancementPrompt }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0]?.message?.content || "{}");
    const enhancedDescriptions = response.descriptions || descriptionsToEnhance;

    // Apply enhanced descriptions to transactions
    return transactions.map((transaction, index) => ({
      ...transaction,
      description: enhancedDescriptions[index] || transaction.description
    }));

  } catch (error) {
    console.error("Description enhancement error:", error);
    // Return original transactions if enhancement fails
    return transactions;
  }
}

async function extractBankDataWithAI(csvData: CSVRow[]): Promise<
  {
    date: string; // Can be ISO date string or "N/A"
    description: string; // Can be enhanced description or "N/A"
    amount: number; // 0 if N/A
    missingFields?: string[];
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

IMPORTANT RULES:
1. If you cannot identify a specific column for date, description, or amount, use "N/A" as the column name
2. At least ONE field must be identifiable (cannot have all three as N/A)
3. When processing descriptions, enhance them to be more detailed and descriptive (minimum 5 words)
4. For rows where specific values are missing or empty, return "N/A" for that field

Transform short codes or abbreviations into meaningful descriptions:
- "AMZ PMNT" → "Amazon Payment Transaction"
- "STARBUCKS #1234" → "Starbucks Coffee Purchase Location 1234"
- "WMT SUPERCENTER" → "Walmart Supercenter Store Purchase"
- "UBER TRIP 123" → "Uber Transportation Trip Service"
- "ATM WITHDRAWAL" → "ATM Cash Withdrawal Transaction"
- "DEPOSIT ACH" → "ACH Direct Deposit Payment"

Headers: ${headers.join(", ")}
Sample data: ${JSON.stringify(sampleRows, null, 2)}

Return a JSON object with this format:
{
  "dateColumn": "column_name" or "N/A",
  "descriptionColumn": "column_name" or "N/A", 
  "amountColumn": "column_name" or "N/A",
  "isDebitCreditSeparate": true/false,
  "debitColumn": "column_name" (if separate),
  "creditColumn": "column_name" (if separate),
  "enhanceDescriptions": true
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

    const transactions = csvData.map((row) => {
      let amount = 0;
      let dateStr = "";
      let description = "";
      const missingFields: string[] = [];

      // Handle amount
      if (mapping.amountColumn === "N/A") {
        amount = 0;
        missingFields.push('amount');
      } else if (mapping.isDebitCreditSeparate) {
        const debit = parseFloat(row[mapping.debitColumn] || "0");
        const credit = parseFloat(row[mapping.creditColumn] || "0");
        amount = debit || -credit; // Debits positive, credits negative
      } else {
        amount = parseFloat(row[mapping.amountColumn] || "0");
        if (amount === 0 || isNaN(amount)) {
          missingFields.push('amount');
        }
      }

      // Handle date
      if (mapping.dateColumn === "N/A") {
        dateStr = "N/A";
        missingFields.push('date');
      } else {
        dateStr = row[mapping.dateColumn] || "";
        if (!dateStr || dateStr.trim() === '') {
          dateStr = "N/A";
          missingFields.push('date');
        }
      }

      // Handle description
      if (mapping.descriptionColumn === "N/A") {
        description = "N/A";
        missingFields.push('description');
      } else {
        description = row[mapping.descriptionColumn] || "";
        if (!description || description.trim() === '') {
          description = "N/A";
          missingFields.push('description');
        }
      }

      // Parse date if not N/A
      const parsedDate = (dateStr !== "N/A" && dateStr) ? parseDate(dateStr) : "N/A";

      return {
        date: parsedDate,
        description: description,
        amount: amount,
        missingFields: missingFields.length > 0 ? missingFields : undefined
      };
    });

    // Enhance descriptions if requested
    if (mapping.enhanceDescriptions && transactions.length > 0) {
      return await enhanceDescriptionsWithAI(transactions);
    }

    return transactions;
  } catch (error) {
    console.error("AI CSV parsing error:", error);
    return extractBankDataFallback(csvData);
  }
}

function extractBankDataFallback(csvData: CSVRow[]): {
  date: string;
  description: string;
  amount: number;
  missingFields: string[];
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
    const missingFields: string[] = [];

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

    // Check for missing fields
    if (!date || date.trim() === '') {
      missingFields.push('date');
    }
    if (!description || description.trim() === '') {
      missingFields.push('description');
    }
    if (amount === 0) {
      missingFields.push('amount');
    }

    // Parse date with multiple format support or use N/A
    let parsedDate = "N/A";
    if (date && date.trim() !== '') {
      parsedDate = parseDate(date);
    }

    return {
      date: parsedDate,
      description: description || "N/A",
      amount: amount,
      missingFields: missingFields
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
    const rawDataString = formData.get("rawData") as string;

    // Log raw data for debugging (when present)
    if (rawDataString) {
      try {
        const rawDataInfo = JSON.parse(rawDataString);
        console.log("📊 Raw CSV Data Received:", {
          headers: rawDataInfo.headers,
          totalRows: rawDataInfo.totalRows,
          sampleData: rawDataInfo.data?.slice(0, 2) // Log first 2 rows
        });
      } catch (e) {
        console.log("⚠️ Could not parse raw data:", e);
      }
    }

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
    
    // Validate data quality
    let invalidRows = 0;
    const validBankData = bankData.filter(transaction => {
      const missingCount = transaction.missingFields?.length || 0;
      
      // Reject if more than 2 fields are missing
      if (missingCount > 2) {
        console.warn(`Too many missing fields (${missingCount}): ${transaction.missingFields?.join(', ')}`);
        invalidRows++;
        return false;
      }
      
      return true;
    });
    
    // If too many invalid rows, reject the entire CSV
    if (invalidRows > bankData.length * 0.5) {
      return NextResponse.json(
        {
          error: "CSV needs to provide more info",
          message: "Too many transactions are missing required fields or have insufficient description details",
          stats: {
            total: bankData.length,
            invalid: invalidRows,
            percentage: Math.round((invalidRows / bankData.length) * 100)
          }
        },
        { status: 400 }
      );
    }

    // Check for duplicates and save bank transactions
    const createdTransactions: any[] = [];
    const duplicates: any[] = [];
    const skippedSimilar: any[] = [];

    for (const transaction of validBankData) {
      // Skip if critical data is N/A
      if (transaction.date === "N/A") {
        console.error(`Missing date for transaction: ${transaction.description}`);
        continue;
      }
      
      if (transaction.amount === 0 && transaction.missingFields?.includes('amount')) {
        console.error(`Missing amount for transaction: ${transaction.description}`);
        continue;
      }

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
        valid: validBankData.length,
        invalid: invalidRows,
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
