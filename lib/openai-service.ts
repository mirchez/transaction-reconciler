import OpenAI from "openai";
import { z } from "zod";
import { LedgerEntrySchema } from "@/lib/types/transactions";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Schema for OpenAI response
const OpenAIParsedReceiptSchema = z.object({
  date: z.string().describe("ISO datetime string format YYYY-MM-DDTHH:mm:ss.sssZ"),
  amount: z.number().positive().describe("Total amount as a positive number"),
  vendor: z.string().min(1).describe("Vendor or merchant name"),
  category: z.string().optional().describe("Category: Software, Training, Support, Hardware, Office, or General"),
  confidence: z.number().min(0).max(1).describe("Confidence score between 0 and 1"),
  rawData: z.object({
    items: z.array(z.object({
      description: z.string(),
      amount: z.number().optional(),
    })).optional(),
    taxAmount: z.number().optional(),
    subtotal: z.number().optional(),
  }).optional(),
});

export type ParsedReceipt = z.infer<typeof OpenAIParsedReceiptSchema>;

export async function parseReceiptWithOpenAI(pdfText: string): Promise<ParsedReceipt> {
  try {
    const systemPrompt = `You are a receipt parsing assistant. Extract structured data from receipt text and return it in JSON format.
    
    Rules:
    1. Extract the vendor/merchant name (clean, without address or extra info)
    2. Find the total amount (not subtotal, the final total after tax)
    3. Extract the transaction date and convert to ISO 8601 format
    4. Categorize based on keywords: Software, Training, Support, Hardware, Office, or General
    5. Provide a confidence score (0-1) based on how clearly the data was found
    6. Include raw data like line items, tax, and subtotal if available
    
    Return ONLY valid JSON with this structure:
    {
      "date": "YYYY-MM-DDTHH:mm:ss.sssZ",
      "amount": number,
      "vendor": "string",
      "category": "string",
      "confidence": number,
      "rawData": {
        "items": [{"description": "string", "amount": number}],
        "taxAmount": number,
        "subtotal": number
      }
    }`;

    const userPrompt = `Parse this receipt text and extract the transaction details. Return ONLY JSON, no other text:\n\n${pdfText}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.1,
      max_tokens: 1000,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error("No response from OpenAI");
    }

    const parsedData = JSON.parse(responseText);
    
    // Validate with Zod schema
    const validatedData = OpenAIParsedReceiptSchema.parse(parsedData);
    
    return validatedData;
  } catch (error) {
    console.error("OpenAI parsing error:", error);
    
    // Fallback to regex-based parsing if OpenAI fails
    return fallbackParsing(pdfText);
  }
}

function fallbackParsing(text: string): ParsedReceipt {
  // Extract amount
  const amountMatch = text.match(/(?:total|amount due|balance due)[\s:]*\$?([\d,]+\.?\d*)/i);
  const amount = amountMatch 
    ? parseFloat(amountMatch[1].replace(/,/g, ''))
    : 0;

  // Extract date
  const dateMatch = text.match(/(?:date|issued|transaction)[\s:]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i);
  const date = dateMatch
    ? new Date(dateMatch[1]).toISOString()
    : new Date().toISOString();

  // Extract vendor (first line that's not numeric/date)
  const lines = text.split('\n').filter(line => line.trim());
  const vendor = lines.find(line => 
    line.length > 2 && 
    !line.match(/^\d/) && 
    !line.match(/date|receipt|invoice/i)
  ) || "Unknown Vendor";

  // Categorize
  const categoryKeywords = {
    Software: /software|app|license|subscription|saas/i,
    Training: /training|course|education|workshop|seminar/i,
    Support: /support|maintenance|service|consulting/i,
    Hardware: /hardware|equipment|device|computer|laptop/i,
    Office: /office|supplies|stationery|furniture/i,
  };

  let category = "General";
  for (const [cat, regex] of Object.entries(categoryKeywords)) {
    if (regex.test(text)) {
      category = cat;
      break;
    }
  }

  return {
    date,
    amount,
    vendor: vendor.trim(),
    category,
    confidence: 0.5, // Lower confidence for fallback
  };
}

// Function to validate if parsed data meets requirements
export function validateParsedReceipt(data: ParsedReceipt): boolean {
  return (
    data.amount > 0 &&
    data.vendor.length > 0 &&
    data.vendor !== "Unknown Vendor" &&
    !isNaN(new Date(data.date).getTime())
  );
}