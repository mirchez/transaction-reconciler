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

  console.log(`Starting AI matching: ${bankTransactions.length} bank transactions, ${ledgerEntries.length} ledger entries`);

  const systemPrompt = `You are a highly precise financial transaction matching expert. Given bank transactions and ledger entries, identify matches based on STRICT criteria:

1. Amount: MUST match exactly or within $0.01 (one cent tolerance only for rounding)
2. Date: MUST be within 2 days maximum (bank processing delays)
3. Description/vendor: Must have strong similarity or clear connection
4. Be VERY conservative - only match when you're highly confident

IMPORTANT RULES:
- Amount differences > $0.01 should NOT be matched
- Date differences > 2 days should NOT be matched
- If amounts don't match exactly (within $0.01), reject the match
- Only suggest matches with confidence >= 85%
- Provide specific reasons for each match

For each match, provide a confidence score (0-100) and a detailed reason.`;

  const userPrompt = `Match these bank transactions with ledger entries using STRICT PRECISION:

Bank Transactions:
${bankTransactions.map((t, i) => 
  `${i+1}. [ID: ${t.id}] Date: ${t.date.toISOString().split('T')[0]}, Amount: $${t.amount.toFixed(2)}, Description: "${t.description}"`
).join('\n')}

Ledger Entries:
${ledgerEntries.map((e, i) => 
  `${i+1}. [ID: ${e.id}] Date: ${e.date.toISOString().split('T')[0]}, Amount: $${e.amount.toFixed(2)}, Vendor: "${e.vendor}", Category: "${e.category || 'N/A'}"`
).join('\n')}

CRITICAL MATCHING RULES:
1. Amounts must match EXACTLY (max $0.01 difference for rounding)
2. Dates must be within 2 days maximum
3. Only high-confidence matches (85%+ score)
4. Verify each match meets ALL criteria before including

Return a JSON object with a "matches" array in this format:
{
  "matches": [
    {
      "bankTransactionId": "bank_id",
      "ledgerEntryId": "ledger_id",
      "matchScore": 95,
      "matchReason": "Amount matches exactly ($X.XX), dates 1 day apart (bank: YYYY-MM-DD, ledger: YYYY-MM-DD), vendor 'ABC' found in bank description"
    }
  ]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
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
    
    console.log(`AI suggested ${matches.length} potential matches`);
    
    // Validate and filter matches with strict criteria
    const validatedMatches = matches
      .filter((match: any) => {
        if (!match.bankTransactionId || !match.ledgerEntryId || match.matchScore < 85) {
          return false;
        }

        const bankTx = bankTransactions.find(t => t.id === match.bankTransactionId);
        const ledgerEntry = ledgerEntries.find(e => e.id === match.ledgerEntryId);

        if (!bankTx || !ledgerEntry) {
          return false;
        }

        // Strict amount validation (max $0.01 difference)
        const amountDiff = Math.abs(bankTx.amount - ledgerEntry.amount);
        if (amountDiff > 0.01) {
          console.log(`Rejecting match: Amount difference too large ($${amountDiff.toFixed(2)})`);
          return false;
        }

        // Strict date validation (max 2 days difference)
        const daysDiff = Math.abs(
          (bankTx.date.getTime() - ledgerEntry.date.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysDiff > 2) {
          console.log(`Rejecting match: Date difference too large (${daysDiff.toFixed(1)} days)`);
          return false;
        }

        return true;
      })
      .map((match: any) => ({
        bankTransactionId: match.bankTransactionId,
        ledgerEntryId: match.ledgerEntryId,
        matchScore: Math.min(100, Math.max(0, match.matchScore)),
        matchReason: match.matchReason || "AI-detected match"
      }));

    console.log(`After validation: ${validatedMatches.length} matches passed strict criteria`);
    return validatedMatches;
  } catch (error) {
    console.error("Error matching transactions with AI:", error);
    return [];
  }
}