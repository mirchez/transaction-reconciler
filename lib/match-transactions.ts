import OpenAI from "openai";
import { prisma } from "@/lib/db";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface BankTransactionInput {
  id: string;
  date: Date;
  amount: number;
  description: string;
}

interface LedgerEntryInput {
  id: string;
  date: Date;
  amount: number;
  vendor: string;
  category?: string | null;
}

interface MatchResult {
  bankTransactionId: string;
  ledgerEntryId: string;
  matchScore: number;
  matchReason: string;
}

export async function matchTransactionsWithAI(
  bankTransactions: BankTransactionInput[],
  ledgerEntries: LedgerEntryInput[]
): Promise<MatchResult[]> {
  if (bankTransactions.length === 0 || ledgerEntries.length === 0) {
    return [];
  }

  const systemPrompt = `You are a financial transaction matching expert. Given bank transactions and ledger entries, identify matches based on:
1. Amount (must be very close, within $0.50)
2. Date (within 5 days)
3. Description/vendor similarity
4. Common patterns in transaction descriptions

For each match, provide a confidence score (0-100) and a brief reason.
Only suggest matches with confidence > 70%.`;

  const userPrompt = `Match these bank transactions with ledger entries:

Bank Transactions:
${bankTransactions.map((t, i) => 
  `${i+1}. [ID: ${t.id}] Date: ${t.date.toISOString().split('T')[0]}, Amount: $${t.amount.toFixed(2)}, Description: "${t.description}"`
).join('\n')}

Ledger Entries:
${ledgerEntries.map((e, i) => 
  `${i+1}. [ID: ${e.id}] Date: ${e.date.toISOString().split('T')[0]}, Amount: $${e.amount.toFixed(2)}, Vendor: "${e.vendor}", Category: "${e.category || 'N/A'}"`
).join('\n')}

Return a JSON array of matches in this format:
[
  {
    "bankTransactionId": "bank_id",
    "ledgerEntryId": "ledger_id",
    "matchScore": 95,
    "matchReason": "Exact amount match, dates within 2 days, vendor name in description"
  }
]`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      console.error("No content from OpenAI");
      return [];
    }

    const result = JSON.parse(content);
    const matches = result.matches || result.array || result || [];
    
    // Validate and filter matches
    return matches
      .filter((match: any) => 
        match.bankTransactionId && 
        match.ledgerEntryId && 
        match.matchScore >= 70 &&
        bankTransactions.some(t => t.id === match.bankTransactionId) &&
        ledgerEntries.some(e => e.id === match.ledgerEntryId)
      )
      .map((match: any) => ({
        bankTransactionId: match.bankTransactionId,
        ledgerEntryId: match.ledgerEntryId,
        matchScore: Math.min(100, Math.max(0, match.matchScore)),
        matchReason: match.matchReason || "AI-detected match"
      }));
  } catch (error) {
    console.error("Error matching transactions with AI:", error);
    return [];
  }
}