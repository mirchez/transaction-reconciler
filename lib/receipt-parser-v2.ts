import OpenAI from "openai";
import { z } from "zod";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Enhanced schema with more fields for better extraction
const ReceiptExtractionSchema = z.object({
  isFinancialDocument: z.boolean().default(false),
  extractedData: z.object({
    amount: z.number().nullable().optional(),
    date: z.string().nullable().optional(),
    vendor: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    invoiceNumber: z.string().nullable().optional(),
    paymentMethod: z.string().nullable().optional(),
    currency: z.string().nullable().optional(),
  }).default({}),
  metadata: z.object({
    documentType: z.string().default('unknown'),
    confidence: z.number().min(0).max(1).default(0.5),
    extractionMethod: z.string().default('unknown'),
  }).default({}),
  rawExtraction: z.object({
    amounts: z.array(z.number()).default([]),
    dates: z.array(z.string()).default([]),
    possibleVendors: z.array(z.string()).default([]),
  }).default({})
});

export type ReceiptExtraction = z.infer<typeof ReceiptExtractionSchema>;

const SYSTEM_PROMPT = `You are a specialized financial document parser. Your task is to extract transaction data from various types of financial documents with maximum accuracy.

EXTRACTION STRATEGY:
1. First, identify the document type (invoice, receipt, bank statement, payment confirmation, etc.)
2. Extract ALL amounts found in the document
3. Extract ALL dates found in the document
4. Identify ALL possible vendor/merchant names
5. Then intelligently select the most relevant values based on context

DOCUMENT TYPES TO RECOGNIZE:
- Standard receipts (retail, restaurant, services)
- Invoices (with invoice numbers, due dates, bill-to sections)
- Bank/credit card statements
- Digital payment confirmations (PayPal, Stripe, Venmo, Zelle)
- Subscription receipts (SaaS, streaming services, memberships)
- Platform-specific receipts (Amazon, Uber, DoorDash, etc.)
- Wire transfer confirmations
- Mobile payment receipts
- Cryptocurrency transaction receipts
- International payment receipts

EXTRACTION RULES:

1. AMOUNTS:
   - Extract ALL monetary values found
   - Look for patterns: $X.XX, USD X.XX, X.XX USD, €X.XX, £X.XX
   - Consider words: amount, total, subtotal, grand total, balance, paid, charged, fee
   - For invoices: "Amount Due" takes precedence over "Total"
   - For receipts: "Total" or "Grand Total" is usually the main amount
   - Include currency if specified

2. DATES:
   - Extract ALL dates found
   - Recognize formats: MM/DD/YYYY, DD-MM-YYYY, YYYY-MM-DD, Month DD YYYY
   - Date keywords: date, issued, paid, due, transaction, posted, created, invoice date
   - For subscriptions: use start date of billing period
   - Convert all dates to YYYY-MM-DD format

3. VENDOR/MERCHANT:
   - Look at document header/top section first
   - Check for: company name, logo text, "from", "merchant", "seller", "vendor"
   - For emails: check sender name/domain
   - For platforms: extract both platform AND actual merchant (e.g., "Amazon - Book Seller Inc")
   - Clean up: remove Inc, LLC, Corp, Ltd unless it's part of a well-known brand

4. DESCRIPTION:
   - Combine vendor name with transaction type if relevant
   - For subscriptions: include service name (e.g., "Netflix Monthly")
   - For invoices: include invoice number if available
   - Keep concise: 2-4 words maximum

SPECIAL HANDLING:

1. BANK STATEMENTS:
   - Each transaction line is separate
   - Description often includes merchant name
   - Posted date vs transaction date

2. PAYPAL/STRIPE:
   - Look for "Payment to" or "Payment from"
   - Transaction ID is important
   - May have both platform fee and actual amount

3. SUBSCRIPTIONS (X Premium, Netflix, etc.):
   - Billing period is important
   - Recurring amount pattern
   - Auto-renewal indicators

4. INTERNATIONAL:
   - Currency conversion rates
   - Multiple currencies in same document
   - International wire fees

OUTPUT FORMAT:
Always return a complete JSON response with all fields, even if some are empty. Use the schema exactly as defined.`;

const USER_PROMPT_TEMPLATE = `Analyze this document and extract all financial transaction information.

IMPORTANT INSTRUCTIONS:
1. Extract ALL amounts, dates, and vendor names you find
2. If you see "amount" anywhere, prioritize that value
3. For X/Twitter receipts, use "X" as the vendor
4. Be inclusive - if it looks financial, treat it as such
5. Include all amounts in the rawExtraction.amounts array
6. Include all dates in the rawExtraction.dates array
7. Include all possible vendor names in the rawExtraction.possibleVendors array

Document content:
{content}

Return a complete JSON response following the exact schema provided.`;

export async function parseReceiptV2(pdfText: string, filename?: string): Promise<ReceiptExtraction> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.log("⚠️ OpenAI API key not found, using enhanced fallback parsing");
      return enhancedFallbackParsing(pdfText, filename);
    }

    console.log("🤖 Analyzing document with OpenAI GPT-4...");
    
    // Prepare the text - keep more content for better context
    const maxLength = 8000; // Increased for GPT-4
    const textToAnalyze = pdfText.length > maxLength 
      ? pdfText.substring(0, maxLength) + "\n... (truncated)"
      : pdfText;

    // Add filename context if available
    const contextualizedText = filename 
      ? `Filename: ${filename}\n\n${textToAnalyze}`
      : textToAnalyze;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview", // Use GPT-4 for better accuracy
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: USER_PROMPT_TEMPLATE.replace("{content}", contextualizedText) }
      ],
      temperature: 0.1,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error("No response from OpenAI");
    }

    const parsedData = JSON.parse(responseText);
    console.log("✅ OpenAI analysis complete");
    
    // Ensure the data has the expected structure
    const dataWithDefaults = {
      isFinancialDocument: parsedData.isFinancialDocument ?? false,
      extractedData: parsedData.extractedData || {},
      metadata: parsedData.metadata || {},
      rawExtraction: parsedData.rawExtraction || {
        amounts: [],
        dates: [],
        possibleVendors: []
      }
    };
    
    // Validate against schema
    const validatedData = ReceiptExtractionSchema.parse(dataWithDefaults);
    
    // Post-process to ensure we have the best values
    return postProcessExtraction(validatedData);
    
  } catch (error) {
    console.error("❌ OpenAI parsing error:", error);
    console.log("⚠️ Falling back to enhanced local parser...");
    return enhancedFallbackParsing(pdfText, filename);
  }
}

function postProcessExtraction(data: ReceiptExtraction): ReceiptExtraction {
  // If we have multiple amounts, try to pick the most likely total
  if (data.rawExtraction.amounts.length > 1) {
    // Look for the largest amount (usually the total)
    const amounts = [...data.rawExtraction.amounts].sort((a, b) => b - a);
    if (!data.extractedData.amount) {
      data.extractedData.amount = amounts[0];
    }
  }

  // If we have multiple dates, pick the most recent or most relevant
  if (data.rawExtraction.dates.length > 1 && !data.extractedData.date) {
    // Convert dates and sort
    const dates = data.rawExtraction.dates
      .map(d => ({ original: d, parsed: new Date(d) }))
      .filter(d => !isNaN(d.parsed.getTime()))
      .sort((a, b) => b.parsed.getTime() - a.parsed.getTime());
    
    if (dates.length > 0) {
      data.extractedData.date = dates[0].original;
    }
  }

  // Clean up vendor name
  if (data.extractedData.vendor) {
    data.extractedData.vendor = cleanVendorName(data.extractedData.vendor);
  }

  // Set description if not already set
  if (!data.extractedData.description && data.extractedData.vendor) {
    data.extractedData.description = data.extractedData.vendor;
  }

  return data;
}

function cleanVendorName(vendor: string): string {
  // Remove common suffixes unless they're part of the brand
  const cleaned = vendor
    .replace(/\s+(Inc\.?|LLC|Corp\.?|Ltd\.?|Limited|Company|Co\.)$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Special cases for known vendors
  const vendorMap: Record<string, string> = {
    'X Corp': 'X',
    'X, Corp.': 'X',
    'Twitter': 'X',
    'Amazon.com': 'Amazon',
    'Amazon Web Services': 'AWS',
    'Google Cloud Platform': 'Google Cloud',
    'Microsoft Corporation': 'Microsoft',
  };

  return vendorMap[cleaned] || cleaned;
}

function enhancedFallbackParsing(text: string, filename?: string): ReceiptExtraction {
  console.log("🔧 Running enhanced fallback parser...");
  
  // Extract all amounts
  const amountRegexes = [
    /\$\s*([\d,]+\.?\d*)/g,
    /USD\s*([\d,]+\.?\d*)/g,
    /([\d,]+\.?\d*)\s*USD/g,
    /€\s*([\d,]+\.?\d*)/g,
    /£\s*([\d,]+\.?\d*)/g,
    /amount[^$\d]*([\d,]+\.?\d*)/gi,
    /total[^$\d]*([\d,]+\.?\d*)/gi,
  ];

  const amounts: number[] = [];
  for (const regex of amountRegexes) {
    const matches = [...text.matchAll(regex)];
    for (const match of matches) {
      const amount = parseFloat(match[1].replace(/,/g, ''));
      if (!isNaN(amount) && amount > 0) {
        amounts.push(amount);
      }
    }
  }

  // Extract all dates
  const dateRegexes = [
    /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/g,
    /(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/g,
    /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4}/gi,
    /\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}/gi,
  ];

  const dates: string[] = [];
  for (const regex of dateRegexes) {
    const matches = [...text.matchAll(regex)];
    for (const match of matches) {
      try {
        const date = new Date(match[0]);
        if (!isNaN(date.getTime())) {
          dates.push(date.toISOString().split('T')[0]);
        }
      } catch {}
    }
  }

  // Extract possible vendors
  const vendors: string[] = [];
  
  // Look at first few lines
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    if (line.length > 2 && line.length < 50 && !line.match(/^\d/) && 
        !line.match(/^(date|receipt|invoice|total|amount|subtotal)/i)) {
      vendors.push(line);
    }
  }

  // Look for explicit vendor patterns
  const vendorPatterns = [
    /(?:from|merchant|vendor|sold by|billed to)[\s:]+([^\n]+)/i,
    /payment to[\s:]+([^\n]+)/i,
  ];

  for (const pattern of vendorPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      vendors.push(match[1].trim());
    }
  }

  // Use filename as hint
  if (filename) {
    const nameMatch = filename.match(/([A-Za-z]+)[\s_-]?receipt/i);
    if (nameMatch) {
      vendors.push(nameMatch[1]);
    }
  }

  // Determine if this is a financial document
  const isFinancial = amounts.length > 0 || 
    /receipt|invoice|payment|transaction|order|bill/i.test(text) ||
    /\$|USD|EUR|GBP/i.test(text);

  // Pick the best values
  const amount = amounts.length > 0 ? Math.max(...amounts) : undefined;
  const date = dates.length > 0 ? dates[0] : new Date().toISOString().split('T')[0];
  const vendor = vendors.length > 0 ? cleanVendorName(vendors[0]) : undefined;

  return {
    isFinancialDocument: isFinancial,
    extractedData: {
      amount,
      date,
      vendor,
      description: vendor,
      currency: 'USD', // Default to USD
    },
    metadata: {
      documentType: 'unknown',
      confidence: amount && vendor ? 0.7 : 0.3,
      extractionMethod: 'fallback',
    },
    rawExtraction: {
      amounts,
      dates,
      possibleVendors: vendors,
    }
  };
}

// Convert old format to new format for backward compatibility
export function convertToLegacyFormat(extraction: ReceiptExtraction): any {
  return {
    isLedgerEntry: extraction.isFinancialDocument && 
      extraction.extractedData.amount !== undefined && 
      extraction.extractedData.vendor !== undefined,
    date: extraction.extractedData.date,
    description: extraction.extractedData.description || extraction.extractedData.vendor,
    amount: extraction.extractedData.amount,
    confidence: extraction.metadata.confidence,
  };
}