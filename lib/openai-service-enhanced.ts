import OpenAI from "openai";
import { z } from "zod";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Enhanced schema for better structure
const EnhancedLedgerSchema = z.object({
  isLedgerEntry: z.boolean(),
  date: z.string().optional(),
  description: z.string().optional(),
  amount: z.number().optional(),
  confidence: z.number().min(0).max(1),
  metadata: z.object({
    vendor: z.string().optional(),
    invoiceNumber: z.string().optional(),
    paymentMethod: z.string().optional(),
    documentType: z.string().optional(),
    currency: z.string().optional(),
  }).optional(),
});

export type EnhancedLedgerExtraction = z.infer<typeof EnhancedLedgerSchema>;

// Different prompts for different scenarios
const PROMPTS = {
  // Main extraction prompt - comprehensive and flexible
  MAIN: `You are an AI specialized in extracting financial data from documents. Your task is to identify and extract transaction information from various types of financial documents.

CRITICAL EXTRACTION RULES:

1. AMOUNT EXTRACTION (HIGHEST PRIORITY):
   - If you see the word "amount" ANYWHERE, use that value
   - Common patterns: "Amount: $X", "Amount Due: $X", "Total Amount: $X", "Amount Paid: $X"
   - Also look for: Total, Grand Total, Balance Due, You Paid, Charged
   - Extract the numeric value without currency symbols
   - For multiple amounts, prefer "Total" or "Grand Total"

2. DATE EXTRACTION:
   - Look for transaction/payment date (not due date unless that's all you have)
   - Common patterns: "Date: X", "Paid on: X", "Transaction Date: X", "Posted: X"
   - Convert any date format to YYYY-MM-DD
   - If no date found, that's okay - still process if amount and vendor exist

3. VENDOR/DESCRIPTION:
   - Extract the company/merchant name from the document
   - Usually found at the top, in headers, or after "From:", "Merchant:", "Vendor:"
   - For known companies, use their common name (e.g., "X" instead of "X Corp")
   - Keep it concise (2-3 words max)

4. DOCUMENT TYPE DETECTION:
   - Receipt: Has items, subtotal, tax, total
   - Invoice: Has invoice number, bill to, due date
   - Bank statement: Multiple transactions listed
   - Payment confirmation: Confirmation number, payment method
   - Subscription: Recurring, billing period

ALWAYS extract data if you find:
- An amount (any monetary value)
- A vendor/merchant name

Return JSON with this structure:
{
  "isLedgerEntry": true/false,
  "amount": 123.45,
  "date": "YYYY-MM-DD",
  "description": "Vendor Name",
  "confidence": 0.0-1.0,
  "metadata": {
    "vendor": "Full vendor name",
    "invoiceNumber": "INV-123",
    "paymentMethod": "Credit Card",
    "documentType": "receipt|invoice|statement|confirmation",
    "currency": "USD"
  }
}`,

  // Focused prompt for when we have minimal text
  MINIMAL: `Extract financial transaction data from this document.

RULES:
1. Look for ANY amount (number with decimals, especially with $ or currency)
2. Look for ANY company/vendor name (usually at top or prominent)
3. Look for ANY date

Even partial data is valuable. Extract whatever you can find.

Focus on these patterns:
- $X.XX or X.XX with currency
- Company names in headers
- Dates in any format

Return the standard JSON structure even if some fields are empty.`,

  // Prompt for handling specific platforms
  PLATFORM_SPECIFIC: `Extract transaction data from this platform-specific receipt.

PLATFORM PATTERNS:
- PayPal: "Payment to", transaction ID, fee separate from amount
- Stripe: "Payment from", processing fee, net amount
- Amazon: Order number, items list, order total
- Uber/Lyft: Trip fare, tip, total
- Subscription services: Billing period, recurring amount

EXTRACTION FOCUS:
1. Main transaction amount (not fees)
2. Actual vendor (not just the platform)
3. Transaction date (not processing date)

Return the standard JSON structure.`,
};

export async function extractLedgerDataEnhanced(
  pdfText: string,
  options?: {
    filename?: string;
    previousAttempts?: number;
    documentHints?: string[];
  }
): Promise<EnhancedLedgerExtraction> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.log("⚠️ OpenAI API key not found, using fallback parsing");
      return fallbackEnhancedParsing(pdfText, options);
    }

    const attempts = options?.previousAttempts || 0;
    const maxAttempts = 3;

    if (attempts >= maxAttempts) {
      console.log("❌ Max attempts reached, using fallback");
      return fallbackEnhancedParsing(pdfText, options);
    }

    console.log(`🤖 AI Analysis attempt ${attempts + 1}/${maxAttempts}`);

    // Choose prompt based on text length and attempts
    let systemPrompt = PROMPTS.MAIN;
    let temperature = 0.1;

    if (pdfText.length < 500) {
      systemPrompt = PROMPTS.MINIMAL;
      temperature = 0.3; // Slightly higher for creativity with minimal text
    } else if (options?.documentHints?.includes('platform')) {
      systemPrompt = PROMPTS.PLATFORM_SPECIFIC;
    }

    // Add context from filename
    let enhancedText = pdfText;
    if (options?.filename) {
      enhancedText = `Filename: ${options.filename}\n\n${pdfText}`;
    }

    // Prepare the request
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      { 
        role: "user", 
        content: `Extract financial transaction data from this document.

${attempts > 0 ? 'Previous extraction failed. Please try harder to find ANY financial data.' : ''}

Focus on finding:
1. Amount (PRIORITY: Look for "amount" keyword first)
2. Vendor/Company name
3. Date

Document:
${enhancedText}` 
      }
    ];

    // Add few-shot examples for better accuracy
    if (attempts > 0) {
      messages.splice(1, 0, {
        role: "assistant",
        content: JSON.stringify({
          isLedgerEntry: true,
          amount: 5.00,
          date: "2025-07-24",
          description: "X Premium",
          confidence: 0.9,
          metadata: {
            vendor: "X Corp",
            documentType: "invoice",
            currency: "USD"
          }
        })
      });
      messages.splice(2, 0, {
        role: "user",
        content: "Good! Now analyze the actual document provided."
      });
    }

    const completion = await openai.chat.completions.create({
      model: attempts === 0 ? "gpt-4o-mini" : "gpt-4-turbo-preview", // Use GPT-4 on retry
      messages,
      temperature,
      max_tokens: 1500,
      response_format: { type: "json_object" },
      seed: attempts, // Different seed for each attempt
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error("No response from OpenAI");
    }

    const parsedData = JSON.parse(responseText);
    console.log("✅ AI extraction complete:", {
      found: parsedData.isLedgerEntry,
      amount: parsedData.amount,
      vendor: parsedData.description,
    });

    // Validate and enhance the result
    const validated = EnhancedLedgerSchema.parse(parsedData);
    
    // If extraction failed but we have partial data, retry with hints
    if (!validated.isLedgerEntry && (validated.amount || validated.description)) {
      console.log("⚠️ Partial data found, retrying with enhanced context");
      return extractLedgerDataEnhanced(pdfText, {
        ...options,
        previousAttempts: attempts + 1,
        documentHints: ['partial-data', ...(options?.documentHints || [])],
      });
    }

    // Post-process to ensure quality
    return postProcessEnhancedExtraction(validated, pdfText);

  } catch (error) {
    console.error("❌ AI extraction error:", error);
    
    // Retry with different strategy
    if (options?.previousAttempts === undefined) {
      console.log("🔄 Retrying with different approach");
      return extractLedgerDataEnhanced(pdfText, {
        ...options,
        previousAttempts: 1,
      });
    }

    return fallbackEnhancedParsing(pdfText, options);
  }
}

function postProcessEnhancedExtraction(
  data: EnhancedLedgerExtraction,
  originalText: string
): EnhancedLedgerExtraction {
  // Verify amount extraction if "amount" keyword exists
  if (originalText.toLowerCase().includes('amount')) {
    const amountMatch = originalText.match(/amount[^$\d]*([$]?[\d,]+\.?\d*)/i);
    if (amountMatch) {
      const extractedAmount = parseFloat(amountMatch[1].replace(/[$,]/g, ''));
      if (!isNaN(extractedAmount) && extractedAmount !== data.amount) {
        console.log(`🔧 Correcting amount from ${data.amount} to ${extractedAmount}`);
        data.amount = extractedAmount;
      }
    }
  }

  // Ensure we have required fields for a valid entry
  const hasAmount = data.amount && data.amount > 0;
  const hasDescription = data.description && data.description.trim() !== "";
  
  if (hasAmount && hasDescription) {
    data.isLedgerEntry = true;
    data.confidence = Math.max(data.confidence, 0.8);
  } else {
    data.isLedgerEntry = false;
    data.confidence = Math.min(data.confidence, 0.5);
  }

  return data;
}

function fallbackEnhancedParsing(
  text: string,
  options?: { filename?: string; documentHints?: string[] }
): EnhancedLedgerExtraction {
  console.log("🔧 Enhanced fallback parser activated");

  // Multi-pattern amount extraction
  const amountPatterns = [
    { pattern: /amount[^$\d]*([$]?[\d,]+\.?\d*)/i, priority: 10 },
    { pattern: /total[^$\d]*([$]?[\d,]+\.?\d*)/i, priority: 8 },
    { pattern: /paid[^$\d]*([$]?[\d,]+\.?\d*)/i, priority: 7 },
    { pattern: /\$\s*([\d,]+\.?\d*)/g, priority: 5 },
    { pattern: /([\d,]+\.\d{2})(?:\s|$)/, priority: 3 },
  ];

  let amount: number | undefined;
  let highestPriority = 0;

  for (const { pattern, priority } of amountPatterns) {
    const matches = [...text.matchAll(pattern)];
    for (const match of matches) {
      const value = parseFloat(match[1].replace(/[$,]/g, ''));
      if (!isNaN(value) && value > 0 && priority > highestPriority) {
        amount = value;
        highestPriority = priority;
      }
    }
  }

  // Intelligent vendor extraction
  const vendorPatterns = [
    /^([A-Z][A-Za-z\s&,.'()-]{2,40})$/m, // Company name at line start
    /(?:from|merchant|vendor|billed by|sold by)[\s:]+([A-Za-z][A-Za-z\s&,.'()-]+)/i,
    /([A-Z][A-Za-z\s&,.'()-]+)[\s\n]+(?:receipt|invoice)/i,
  ];

  let vendor = "";
  for (const pattern of vendorPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      vendor = match[1].trim();
      break;
    }
  }

  // Use filename hints
  if (!vendor && options?.filename) {
    const fileVendor = options.filename.match(/([A-Za-z]+)[\s_-]?(?:receipt|invoice|statement)/i);
    if (fileVendor) {
      vendor = fileVendor[1];
    }
  }

  // Date extraction with multiple formats
  let date: string | undefined;
  const datePatterns = [
    /(?:date|paid|posted|processed)[\s:]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
    /(?:date|paid|posted)[\s:]*([A-Za-z]+ \d{1,2},? \d{4})/i,
    /(\d{4}-\d{2}-\d{2})/,
  ];

  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      try {
        const parsed = new Date(match[1]);
        if (!isNaN(parsed.getTime())) {
          date = parsed.toISOString().split('T')[0];
          break;
        }
      } catch {}
    }
  }

  const hasRequiredData = amount && amount > 0 && vendor;

  return {
    isLedgerEntry: !!hasRequiredData,
    amount,
    date: date || new Date().toISOString().split('T')[0],
    description: vendor.split(' ').slice(0, 3).join(' '), // First 3 words
    confidence: hasRequiredData ? 0.7 : 0.3,
    metadata: {
      vendor: vendor,
      documentType: guessDocumentType(text),
      currency: "USD",
    }
  };
}

function guessDocumentType(text: string): string {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('invoice')) return 'invoice';
  if (lowerText.includes('receipt')) return 'receipt';
  if (lowerText.includes('statement')) return 'statement';
  if (lowerText.includes('confirmation')) return 'confirmation';
  if (lowerText.includes('subscription') || lowerText.includes('recurring')) return 'subscription';
  
  return 'unknown';
}

// Backward compatibility wrapper
export async function extractLedgerDataWithOpenAI(pdfText: string): Promise<any> {
  const enhanced = await extractLedgerDataEnhanced(pdfText);
  return {
    isLedgerEntry: enhanced.isLedgerEntry,
    date: enhanced.date,
    description: enhanced.description,
    amount: enhanced.amount,
    confidence: enhanced.confidence,
  };
}