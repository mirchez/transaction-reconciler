import OpenAI from "openai";
import { z } from "zod";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Schema for OpenAI response
const LedgerExtractionSchema = z.object({
  isLedgerEntry: z.boolean(),
  date: z.string().optional(),
  type: z.string().optional(),
  num: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  description: z.string().optional(),
  account: z.string().optional().nullable(),
  split: z.string().optional().nullable(),
  debit: z.number().optional().nullable(),
  credit: z.number().optional().nullable(),
  balance: z.number().optional().nullable(),
  confidence: z.number().min(0).max(1),
});

export type LedgerExtraction = z.infer<typeof LedgerExtractionSchema>;

const SYSTEM_PROMPT = `You are an expert accounting assistant helping small businesses manage their bookkeeping. Your role is to analyze ANY document and extract financial/accounting information if present.

IMPORTANT: Any document that contains transaction data (date, amount, vendor/party) should be processed, not just traditional receipts or invoices. This includes:
- Receipts, invoices, bills, statements
- Financial reports, summaries, ledgers
- Transaction lists, payment confirmations
- Any document with financial data

For documents with financial data, extract:
1. Date - Transaction date in YYYY-MM-DD format. Look for dates like "Date:", "Invoice Date:", "Transaction Date:", or at the top of receipts
2. Type - Document type: Receipt, Invoice, Bill, Statement, Credit Note, etc.
3. Number - Reference number, invoice #, receipt #, order #, etc.
4. Name - Vendor/merchant name (company who issued the document)
5. Description - Clear description of what was purchased/paid
6. Account - Categorize intelligently:
   - Food & Dining (restaurants, cafes, groceries)
   - Transportation (uber, taxi, gas, parking)
   - Office Supplies (stationery, equipment)
   - Technology (software, subscriptions, hardware)
   - Travel (hotels, flights)
   - Utilities (electricity, water, internet)
   - Professional Services (consulting, legal, accounting)
   - Marketing & Advertising
   - Rent & Lease
   - Other Expenses
7. Debit - Amount paid/spent (always positive)
8. Credit - Amount received/refunded (always positive)

IMPORTANT RULES:
- Set isLedgerEntry to TRUE if you can extract: amount AND vendor/party name
- Look for the TOTAL, AMOUNT DUE, GRAND TOTAL, or BALANCE DUE for the amount
- For regular purchases/expenses: use debit field
- For refunds/returns/credits: use credit field
- Extract vendor name from logo, header, or "from" field
- If date is unclear, use today's date
- Confidence: 0-1 based on data quality and completeness
- Even if it's not a traditional receipt, if it has financial data, process it

Respond with JSON:
{
  "isLedgerEntry": true/false,
  "date": "YYYY-MM-DD",
  "type": "Receipt",
  "num": "reference number or null",
  "name": "Vendor Name",
  "description": "Clear description of purchase",
  "account": "Appropriate category",
  "split": null,
  "debit": 123.45,
  "credit": null,
  "balance": null,
  "confidence": 0.95,
  "rawData": "relevant extracted text snippets"
}`;

export async function extractLedgerDataWithOpenAI(pdfText: string): Promise<LedgerExtraction> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.log("⚠️ OpenAI API key not found, using fallback parsing");
      return fallbackLedgerParsing(pdfText);
    }

    console.log("🤖 Analyzing document with OpenAI...");
    
    // Truncate very long PDFs to avoid token limits
    const maxLength = 4000;
    const textToAnalyze = pdfText.length > maxLength 
      ? pdfText.substring(0, maxLength) + "\n... (truncated)"
      : pdfText;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Analyze this document and extract accounting data:\n\n${textToAnalyze}` }
      ],
      temperature: 0.1,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error("No response from OpenAI");
    }

    const parsedData = JSON.parse(responseText);
    console.log("✅ OpenAI analysis complete:", {
      isLedgerEntry: parsedData.isLedgerEntry,
      type: parsedData.type,
      vendor: parsedData.name,
      amount: parsedData.debit || parsedData.credit,
      confidence: parsedData.confidence
    });
    
    // Validate against schema
    const validatedData = LedgerExtractionSchema.parse(parsedData);
    
    // Override isLedgerEntry if we have the required data
    const hasAmount = validatedData.debit || validatedData.credit;
    const hasVendor = validatedData.name && validatedData.name.trim() !== "";
    
    // If we have amount and vendor, it's valid for ledger regardless of document type
    if (hasAmount && hasVendor) {
      console.log("✅ Document has required ledger data, marking as valid");
      return {
        ...validatedData,
        isLedgerEntry: true,  // Override to true since we have the data we need
        confidence: Math.max(validatedData.confidence, 0.8)
      };
    }
    
    // If marked as ledger entry but missing data, invalidate
    if (validatedData.isLedgerEntry && (!hasAmount || !hasVendor)) {
      console.log("⚠️ Document marked as ledger but missing required fields:", { hasAmount, hasVendor });
      return {
        ...validatedData,
        isLedgerEntry: false,
        confidence: 0.3
      };
    }
    
    return validatedData;
  } catch (error) {
    console.error("❌ OpenAI parsing error:", error);
    console.log("⚠️ Falling back to local parser...");
    return fallbackLedgerParsing(pdfText);
  }
}

function fallbackLedgerParsing(text: string): LedgerExtraction {
  // Look for common receipt patterns
  const isReceipt = /receipt|invoice|bill|total|amount|payment/i.test(text);
  
  if (!isReceipt) {
    return {
      isLedgerEntry: false,
      confidence: 0.9
    };
  }

  // Extract amount
  const totalMatch = text.match(/(?:total|amount due|balance due|grand total)[\s:]*\$?([\d,]+\.?\d*)/i);
  const amountMatch = totalMatch || text.match(/\$?([\d,]+\.?\d*)/);
  const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : 0;

  // Extract date
  const datePatterns = [
    /(?:date|issued|transaction)[\s:]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
    /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/,
    /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},?\s+\d{4}/i
  ];
  
  let dateStr = new Date().toISOString().split('T')[0];
  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      try {
        const parsed = new Date(match[1]);
        if (!isNaN(parsed.getTime())) {
          dateStr = parsed.toISOString().split('T')[0];
          break;
        }
      } catch {}
    }
  }

  // Extract vendor
  const lines = text.split('\n').filter(line => line.trim());
  const vendor = lines.find(line => 
    line.length > 2 && 
    !line.match(/^\d/) && 
    !line.match(/date|receipt|invoice|total|amount/i)
  ) || "Unknown Vendor";

  // Extract invoice/receipt number
  const numMatch = text.match(/(?:invoice|receipt|order|reference|#)[\s:]*([A-Z0-9\-]+)/i);
  const num = numMatch ? numMatch[1] : null;

  // Categorize
  const categories = {
    "Food & Dining": /restaurant|food|dining|cafe|coffee|meal|lunch|dinner|breakfast/i,
    "Transportation": /uber|lyft|taxi|gas|fuel|parking|toll/i,
    "Office Supplies": /office|supplies|staples|paper|ink|stationery/i,
    "Technology": /software|hardware|computer|laptop|subscription|app/i,
    "Travel": /hotel|flight|airline|travel|lodging/i,
    "Entertainment": /movie|theater|concert|entertainment/i,
    "Healthcare": /pharmacy|medical|doctor|hospital|clinic/i,
    "Utilities": /electric|gas|water|internet|phone|utility/i,
  };

  let account = "General Expense";
  for (const [cat, regex] of Object.entries(categories)) {
    if (regex.test(text)) {
      account = cat;
      break;
    }
  }

  return {
    isLedgerEntry: true,
    date: dateStr,
    type: "Receipt",
    num: num,
    name: vendor.trim(),
    description: `Purchase from ${vendor.trim()}`,
    account: account,
    split: null,
    debit: amount,
    credit: null,
    balance: null,
    confidence: 0.7
  };
}

// Legacy functions for backward compatibility
export async function parseReceiptWithOpenAI(pdfText: string): Promise<any> {
  const result = await extractLedgerDataWithOpenAI(pdfText);
  if (!result.isLedgerEntry) {
    throw new Error("Not a valid receipt or ledger entry");
  }
  
  return {
    date: result.date ? new Date(result.date).toISOString() : new Date().toISOString(),
    amount: result.debit || result.credit || 0,
    vendor: result.name || "Unknown",
    category: result.account || "General",
    confidence: result.confidence
  };
}

export function validateParsedReceipt(data: any): boolean {
  return data.amount > 0 && data.vendor && data.vendor !== "Unknown";
}