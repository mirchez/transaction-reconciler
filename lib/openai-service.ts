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

const SYSTEM_PROMPT = `You are an expert financial document analyzer with deep understanding of receipts, invoices, and financial transactions. Your job is to intelligently extract transaction data from ANY document that represents a financial transaction.

CONTEXT UNDERSTANDING:
You should recognize financial documents in various forms:
- Traditional receipts and invoices
- Email confirmations of purchases
- Bank notifications or statements
- Order confirmations and shipping notices
- Digital payment confirmations (PayPal, Venmo, etc.)
- Subscription renewals and recurring charges (X Premium, Netflix, etc.)
- Utility bills and service statements
- Restaurant bills and cafe receipts
- Travel expenses (hotels, flights, car rentals)
- Medical bills and pharmacy receipts
- Any document showing money was spent or received

INTELLIGENT EXTRACTION:
Don't just search for literal words. Understand the context and extract:

1. DATE - Find the transaction date using contextual clues:
   - Look for: "Date paid", "Date of issue", "Date due", "Transaction Date", "Purchase Date"
   - For invoices that show "due date", use the payment date if available
   - Could be at the top of receipt, in header, or near total
   - Format flexibly: MM/DD/YYYY, DD-MM-YYYY, Month DD YYYY, July 24, 2025, etc.
   - If you see "paid on [date]", use that date
   - Return as YYYY-MM-DD format

2. DESCRIPTION - Extract the vendor/merchant name intelligently:
   - Company name is usually prominent at top, in logo, or in "Bill to" section
   - For subscriptions, look for service name (e.g., "X Premium", "Twitter Blue")
   - Keep simple: "X", "Twitter", "X Corp", "X Premium" all become "X"
   - Keep to 2-3 words maximum
   - Common patterns:
     * Invoice header: Company name
     * Receipt header: Company name or logo
     * Subscription services: Service provider name
   - If it's a subscription, you can add the type: "X Premium"

3. AMOUNT - Find ANY value associated with the word "amount":
   - IMPORTANT: If you see the word "amount" ANYWHERE, use the value next to it
   - Examples: "Amount due", "Amount paid", "Total amount", "Amount", etc.
   - ALL of these should extract the associated value:
     * "Amount due $5.00" → 5.00
     * "Amount paid $5.00" → 5.00  
     * "Total amount: $5.00" → 5.00
     * "Amount: $5.00 USD" → 5.00
   - If no "amount" word found, then look for "Total", "Grand Total", or price with "$"
   - Always return as positive number without currency symbols

CONFIDENCE SCORING:
- 0.9-1.0: Clear receipt with all data easily found
- 0.7-0.9: Most data found, some inference needed
- 0.5-0.7: Partial data, significant inference
- Below 0.5: Questionable document or missing critical data

DECISION LOGIC:
Set isLedgerEntry = true if you can confidently extract:
- A monetary amount (the transaction value)
- A description (who was paid or what was bought)
- Even if date is missing, still process if amount and vendor are clear

SPECIAL CASES:
1. If the email context strongly suggests a receipt (subject contains "receipt", "order", "payment", etc.)
   and you see ANY amount in the document, lean towards marking it as a ledger entry
2. For well-known companies (Twitter/X, Amazon, etc.), be more lenient in accepting as receipts
3. If PDF parsing failed but context suggests transaction, make educated guesses:
   - Use email date as transaction date
   - Extract company name from email sender or subject
   - Look for amount patterns in any available text
4. For X/Twitter receipts specifically:
   - Invoice number format: T1GMCAV6-0005
   - Company shows as "X, Corp." or just "X"
   - Look for "X Premium" subscription
   - Standard amount is often $5.00 for basic premium

EXAMPLES OF VALID EXTRACTIONS:
- "Invoice" header with "$5.00 USD due July 24, 2025" → {date: "2025-07-24", description: "X", amount: 5.00}
- "Receipt" header with "$5.00 paid on July 24, 2025" → {date: "2025-07-24", description: "X", amount: 5.00}
- "X Premium Jul 24 - Aug 24, 2025" → {date: "2025-07-24", description: "X Premium", amount: 5.00}

BE INCLUSIVE: When in doubt about whether something is a financial document, 
if there's any indication of a transaction (amount + vendor), mark it as a ledger entry.

Respond with JSON:
{
  "isLedgerEntry": true/false,
  "date": "YYYY-MM-DD",
  "description": "Vendor Name",
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
        { role: "user", content: `Please analyze this document and extract the transaction information. 

CRITICAL RULE FOR AMOUNT:
- If you see the word "amount" ANYWHERE in the document, use the number next to it
- Examples: "Amount due $5.00", "Amount paid $5.00", "Total amount $5.00" - ALL should extract 5.00
- This is the HIGHEST PRIORITY - always use "amount" values when present

Remember to:
1. Understand the context - this could be any type of financial document
2. For AMOUNT: First look for the word "amount", then use that value
3. Extract the merchant/vendor name (keep it short, e.g., "X" for X Corp)
4. Identify the transaction date (prefer "paid on" dates over "due" dates)

Document content:
${textToAnalyze}` }
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
  // Look for financial document patterns - be more inclusive
  const financialPatterns = [
    /receipt|invoice|bill|statement/i,
    /total|amount|payment|paid|charge/i,
    /order|purchase|transaction/i,
    /\$\s*[\d,]+\.?\d*/,  // Any dollar amount
    /subtotal|tax|grand\s*total/i,
    /thank\s*you\s*for\s*your\s*(purchase|order|payment)/i,
    /confirmation|confirmed/i
  ];
  
  const isFinancialDoc = financialPatterns.some(pattern => pattern.test(text));
  
  if (!isFinancialDoc) {
    return {
      isLedgerEntry: false,
      confidence: 0.9
    };
  }

  // Extract amount - PRIORITIZE anything with the word "amount"
  const amountPatterns = [
    // HIGHEST PRIORITY: Any line with the word "amount" and a value
    /amount[^$\d]*([$]?[\d,]+\.?\d*)/i,
    // Look for "amount" followed by any characters then a number
    /amount.*?([\d,]+\.?\d*)/i,
    // Look for totals with various labels
    /(?:total|balance\s*due|grand\s*total|you\s*paid|charged?)[\s:]*\$?([\d,]+\.?\d*)/i,
    // Look for "Total: $X" or "Total $X" patterns
    /total[\s:]+\$?([\d,]+\.?\d*)/i,
    // Look for amounts at end of line with dollar sign
    /\$\s*([\d,]+\.?\d*)(?:\s|$)/,
    // Look for decimal numbers that could be prices
    /([\d,]+\.\d{2})(?:\s|$)/,
    // Last resort - any number with 2 decimal places
    /(?:^|\s)([\d,]+\.\d{2})(?:\s|$)/
  ];
  
  let amountMatch: RegExpMatchArray | null = null;
  for (const pattern of amountPatterns) {
    const matches = Array.from(text.matchAll(pattern));
    if (matches.length > 0) {
      // Get the largest amount (likely the total)
      const amounts = matches.map(m => parseFloat(m[1].replace(/,/g, '')));
      const maxAmount = Math.max(...amounts);
      if (maxAmount > 0) {
        amountMatch = ['', maxAmount.toString()] as RegExpMatchArray;
        break;
      }
    }
  }
  const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : 0;

  // Extract date - look for various date formats
  const datePatterns = [
    // Look for dates with labels
    /(?:date|issued|posted|processed|transaction\s*date|purchase\s*date)[\s:]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
    /(?:date|issued|posted|processed)[\s:]*([A-Za-z]+\s+\d{1,2},?\s+\d{4})/i,
    // Standard date formats
    /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/,
    /(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/,  // ISO format
    // Month name formats
    /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4}/i,
    /(\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})/i,
    // Compact formats
    /(\d{1,2}\/\d{1,2}\/\d{2})/,  // MM/DD/YY
    // Time stamps that include dates
    /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\s+\d{1,2}:\d{2}/
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

  // Extract vendor/company name intelligently
  const lines = text.split('\n').filter(line => line.trim());
  
  // Strategy 1: Look for company name in the first few lines (usually at the top)
  let vendor = "";
  for (const line of lines.slice(0, 10)) {
    const cleanLine = line.trim();
    // Skip common non-vendor lines
    if (cleanLine.length > 2 && 
        !cleanLine.match(/^\d/) && 
        !cleanLine.match(/^(date|receipt|invoice|order\s*#|transaction|reference|confirmation)/i) &&
        !cleanLine.match(/^(subtotal|tax|total|amount|payment|thank\s*you)/i) &&
        cleanLine.length < 50) {  // Company names are usually not super long
      // Check if it looks like a company name
      if (cleanLine.match(/^[A-Z][A-Za-z\s&,.'()-]*$/)) {
        vendor = cleanLine;
        break;
      }
    }
  }
  
  // Strategy 2: Look for explicit vendor indicators
  if (!vendor) {
    const vendorPatterns = [
      /(?:from|merchant|vendor|store|retailer|sold\s*by|billed\s*to)[\s:]+([A-Za-z][A-Za-z\s&,.'()-]+?)(?:\n|$|\s{2,})/i,
      /(?:^|\n)([A-Z][A-Za-z\s&,.'()-]+?)\s*\n.*(?:receipt|invoice|statement)/i,
      /payment\s*to[\s:]+([A-Za-z][A-Za-z\s&,.'()-]+?)(?:\n|$)/i
    ];
    
    for (const pattern of vendorPatterns) {
      const match = text.match(pattern);
      if (match && match[1].trim().length > 2) {
        vendor = match[1].trim();
        break;
      }
    }
  }
  
  // Strategy 3: Look for common business name patterns
  if (!vendor) {
    // Look for patterns like "ABC Inc", "XYZ LLC", "Store #123"
    const businessMatch = text.match(/([A-Z][A-Za-z\s&,.'()-]+(?:Inc|LLC|Ltd|Corp|Co|Store|Market|Shop|Restaurant|Cafe|Hotel|Services|Center|Clinic|Pharmacy))/i);
    if (businessMatch) {
      vendor = businessMatch[1].trim();
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