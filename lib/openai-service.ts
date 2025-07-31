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
  description: z.string().optional(),
  amount: z.number().optional(),
  confidence: z.number().min(0).max(1),
});

export type LedgerExtraction = z.infer<typeof LedgerExtractionSchema>;

const SYSTEM_PROMPT = `You are an expert accounting assistant helping small businesses manage their bookkeeping. Your role is to analyze ANY document and extract financial/accounting information if present.

IMPORTANT: Any document that contains transaction data (date, amount, description) should be processed, not just traditional receipts or invoices. This includes:
- Receipts, invoices, bills, statements
- Financial reports, summaries, ledgers
- Transaction lists, payment confirmations
- Any document with financial data

For documents with financial data, extract:
1. Date - Transaction date in YYYY-MM-DD format. Look for dates like "Date:", "Invoice Date:", "Transaction Date:", or at the top of receipts
2. Description - VERY SHORT description (2-3 words maximum):
   - Priority 1: Use company/vendor name (e.g., "Starbucks", "Amazon", "Uber")
   - Priority 2: If no clear vendor, use what was bought (e.g., "Office Supplies", "Gas Station")
   - Keep it simple - NO long sentences, NO reference numbers, NO categories
3. Amount - The total amount of the transaction (always positive)
   - Look for TOTAL, AMOUNT DUE, GRAND TOTAL, or BALANCE DUE
   - For regular purchases/expenses: positive amount
   - For refunds/returns/credits: still positive (we'll handle sign in the app)

IMPORTANT RULES:
- Set isLedgerEntry to TRUE if you can extract BOTH: amount AND description
- Description MUST be SHORT (2-3 words max) - preferably just the company name
- If no vendor/company name found, use the most prominent text or document title
- If date is unclear, use today's date
- Confidence: 0-1 based on data quality and completeness
- Even if it's not a traditional receipt, if it has financial data, process it

Respond with JSON:
{
  "isLedgerEntry": true/false,
  "date": "YYYY-MM-DD",
  "description": "Company Name",
  "amount": 123.45,
  "confidence": 0.95
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
      description: parsedData.description,
      amount: parsedData.amount,
      confidence: parsedData.confidence
    });
    
    // Validate against schema
    const validatedData = LedgerExtractionSchema.parse(parsedData);
    
    // Override isLedgerEntry if we have the required data
    const hasAmount = validatedData.amount && validatedData.amount > 0;
    const hasDescription = validatedData.description && validatedData.description.trim() !== "";
    
    // If we have amount and description, it's valid for ledger
    if (hasAmount && hasDescription) {
      console.log("✅ Document has required ledger data, marking as valid");
      return {
        ...validatedData,
        isLedgerEntry: true,  // Override to true since we have the data we need
        confidence: Math.max(validatedData.confidence, 0.8)
      };
    }
    
    // If marked as ledger entry but missing data, invalidate
    if (validatedData.isLedgerEntry && (!hasAmount || !hasDescription)) {
      console.log("⚠️ Document marked as ledger but missing required fields:", { hasAmount, hasDescription });
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

  // Extract vendor/company name
  const lines = text.split('\n').filter(line => line.trim());
  
  // Look for company name in the first few lines (usually at the top)
  let vendor = "";
  for (const line of lines.slice(0, 5)) {
    if (line.length > 2 && 
        !line.match(/^\d/) && 
        !line.match(/date|receipt|invoice|total|amount|thank|your|purchase|order/i)) {
      vendor = line.trim();
      break;
    }
  }
  
  // If no vendor found, check for common company patterns
  if (!vendor) {
    const companyMatch = text.match(/(?:from|at|merchant|vendor|company|store)[\s:]*([A-Za-z\s&]+?)(?:\n|$)/i);
    if (companyMatch) {
      vendor = companyMatch[1].trim();
    }
  }
  
  // If still no vendor, use category as description
  if (!vendor || vendor.length < 2) {
    const categories = {
      "Restaurant": /restaurant|food|dining|cafe|coffee|meal/i,
      "Transport": /uber|lyft|taxi|gas|fuel|parking/i,
      "Office": /office|supplies|staples|paper/i,
      "Tech": /software|hardware|computer|subscription/i,
      "Hotel": /hotel|lodging|accommodation/i,
      "Healthcare": /pharmacy|medical|doctor|hospital/i,
      "Utilities": /electric|gas|water|internet|phone/i,
    };

    for (const [cat, regex] of Object.entries(categories)) {
      if (regex.test(text)) {
        vendor = cat;
        break;
      }
    }
  }
  
  if (!vendor) {
    vendor = "Unknown";
  }
  
  // Clean up vendor name - keep it short (2-3 words max)
  const words = vendor.split(/\s+/).filter(w => w.length > 0);
  const description = words.slice(0, 2).join(' ');

  return {
    isLedgerEntry: amount > 0 && description !== "Unknown",
    date: dateStr,
    description: description,
    amount: amount,
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
    amount: result.amount || 0,
    description: result.description || "Unknown",
    confidence: result.confidence
  };
}

export function validateParsedReceipt(data: any): boolean {
  return data.amount > 0 && data.description && data.description !== "Unknown";
}