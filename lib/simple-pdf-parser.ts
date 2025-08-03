import OpenAI from "openai";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simple schema for extraction
const SimpleExtractionSchema = z.object({
  isLedgerEntry: z.boolean().default(false),
  date: z.string().nullable().optional(),
  description: z.string().nullable().optional(), 
  amount: z.number().nullable().optional(),
  confidence: z.number().min(0).max(1).default(0.5),
});

export type SimpleExtraction = z.infer<typeof SimpleExtractionSchema>;

const SIMPLE_PROMPT = `You are a receipt parser. Extract financial data from this document.

Look for:
1. Amount (any monetary value, especially near words like "amount", "total", "paid")
2. Vendor/Company name (usually at the top)
3. Date (transaction date preferred over due date)

Return JSON:
{
  "isLedgerEntry": true/false (true if you find amount + vendor),
  "amount": number or null,
  "date": "YYYY-MM-DD" or null,
  "description": "vendor name" or null,
  "confidence": 0.0-1.0
}`;

export async function simpleExtractWithAI(pdfText: string): Promise<SimpleExtraction> {
  console.log('🔍 === SIMPLE EXTRACT WITH AI START ===');
  console.log('📝 Input text length:', pdfText ? pdfText.length : 0);
  console.log('📝 Input text preview:', pdfText ? pdfText.substring(0, 200) : 'NO TEXT');
  console.log('🔑 Has OpenAI key:', !!process.env.OPENAI_API_KEY);
  
  try {
    if (!process.env.OPENAI_API_KEY || !pdfText || pdfText.trim().length === 0) {
      console.log('⚠️ Skipping AI - no key or empty text');
      return simpleFallbackParsing(pdfText);
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SIMPLE_PROMPT },
        { role: "user", content: `Extract data from:\n${pdfText.substring(0, 4000)}` }
      ],
      temperature: 0.1,
      max_tokens: 500,
      response_format: { type: "json_object" }
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      return simpleFallbackParsing(pdfText);
    }

    const parsed = JSON.parse(responseText);
    
    console.log('🤖 === OPENAI RESPONSE ===');
    console.log('Raw response:', parsed);
    
    // Ensure all fields exist
    const result = {
      isLedgerEntry: Boolean(parsed.isLedgerEntry),
      amount: typeof parsed.amount === 'number' ? parsed.amount : null,
      date: parsed.date || null,
      description: parsed.description || null,
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.5,
    };
    
    console.log('Processed result:', result);
    console.log('🤖 === END OPENAI RESPONSE ===');

    // Validate the entry
    if (result.amount && result.amount > 0 && result.description) {
      result.isLedgerEntry = true;
      result.confidence = Math.max(result.confidence, 0.7);
    } else if (!result.amount || result.amount === 0) {
      result.isLedgerEntry = false;
      result.confidence = Math.min(result.confidence, 0.3);
    }

    return SimpleExtractionSchema.parse(result);

  } catch (error) {
    console.error("AI extraction error:", error);
    return simpleFallbackParsing(pdfText);
  }
}

function simpleFallbackParsing(text: string): SimpleExtraction {
  console.log('🔍 === FALLBACK PARSING START ===');
  console.log('Text length:', text ? text.length : 0);
  console.log('Text preview:', text ? text.substring(0, 100) : 'NO TEXT');
  
  const result: SimpleExtraction = {
    isLedgerEntry: false,
    amount: null,
    date: null,
    description: null,
    confidence: 0.3,
  };

  if (!text || text.length === 0) {
    console.log('⚠️ No text to parse');
    return result;
  }

  // Extract amount
  const amountPatterns = [
    /amount[^$\d]*([\d,]+\.?\d*)/i,
    /total[^$\d]*([\d,]+\.?\d*)/i,
    /\$\s*([\d,]+\.?\d*)/,
    /([\d,]+\.\d{2})(?:\s|$)/
  ];

  for (const pattern of amountPatterns) {
    const match = text.match(pattern);
    if (match) {
      const amount = parseFloat(match[1].replace(/,/g, ''));
      if (!isNaN(amount) && amount > 0) {
        result.amount = amount;
        break;
      }
    }
  }

  // Extract vendor
  const lines = text.split('\n').filter(l => l.trim());
  for (const line of lines.slice(0, 5)) {
    if (line.length > 2 && line.length < 50 && !line.match(/^\d/) && 
        !line.match(/^(date|receipt|invoice|total|amount)/i)) {
      result.description = line.trim();
      break;
    }
  }

  // Extract date
  const dateMatch = text.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/);
  if (dateMatch) {
    try {
      const date = new Date(dateMatch[1]);
      if (!isNaN(date.getTime())) {
        result.date = date.toISOString().split('T')[0];
      }
    } catch {}
  }

  // Set as ledger entry if we have required data
  if (result.amount && result.amount > 0 && result.description) {
    result.isLedgerEntry = true;
    result.confidence = 0.6;
  }
  
  console.log('Fallback result:', result);
  console.log('🔍 === FALLBACK PARSING END ===');

  return result;
}