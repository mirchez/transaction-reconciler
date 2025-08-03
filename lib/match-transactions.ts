import { prisma } from "@/lib/db";

interface BankTransactionInput {
  id: string;
  date: Date | null;
  amount: number | null;
  description: string | null;
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
  matchLevel: 'full' | 'partial' | 'ambiguous';
}

function normalizeText(text: string): string {
  return text.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');
}

function calculateDateDifference(date1: Date, date2: Date): number {
  return Math.abs((date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24));
}

function calculateAmountDifference(amount1: number, amount2: number): number {
  return Math.abs(amount1 - amount2);
}

function calculateTextSimilarity(text1: string, text2: string): number {
  const normalized1 = normalizeText(text1);
  const normalized2 = normalizeText(text2);
  
  const words1 = normalized1.split(/\s+/);
  const words2 = normalized2.split(/\s+/);
  
  let matchingWords = 0;
  
  for (const word1 of words1) {
    if (word1.length > 2) {
      for (const word2 of words2) {
        if (word2.length > 2 && (word1.includes(word2) || word2.includes(word1))) {
          matchingWords++;
          break;
        }
      }
    }
  }
  
  const totalWords = Math.max(words1.length, words2.length);
  return totalWords > 0 ? (matchingWords / totalWords) * 100 : 0;
}

export async function matchTransactionsWithAI(
  bankTransactions: BankTransactionInput[],
  ledgerEntries: LedgerEntryInput[]
): Promise<MatchResult[]> {
  if (bankTransactions.length === 0 || ledgerEntries.length === 0) {
    return [];
  }

  console.log(`Starting rule-based matching: ${bankTransactions.length} bank transactions, ${ledgerEntries.length} ledger entries`);

  const matches: MatchResult[] = [];
  const usedLedgerIds = new Set<string>();

  for (const bankTx of bankTransactions) {
    let bestMatch: MatchResult | null = null;
    
    for (const ledgerEntry of ledgerEntries) {
      if (usedLedgerIds.has(ledgerEntry.id)) continue;
      
      let matchingCriteria = 0;
      const reasons: string[] = [];
      
      // Check amount match (within $0.01 tolerance) - skip if bank amount is null
      if (bankTx.amount !== null) {
        const amountDiff = calculateAmountDifference(bankTx.amount, ledgerEntry.amount);
        const amountMatches = amountDiff <= 0.01;
        if (amountMatches) {
          matchingCriteria++;
          reasons.push(`Amount matches exactly ($${bankTx.amount.toFixed(2)})`);
        }
      }
      
      // Check date match (exact match only) - skip if bank date is null
      if (bankTx.date !== null) {
        const bankDateStr = bankTx.date.toISOString().split('T')[0];
        const ledgerDateStr = ledgerEntry.date.toISOString().split('T')[0];
        const dateMatches = bankDateStr === ledgerDateStr;
        if (dateMatches) {
          matchingCriteria++;
          reasons.push(`Dates match exactly (${bankDateStr})`);
        }
      }
      
      // Check description/vendor similarity - skip if bank description is null
      if (bankTx.description !== null) {
        const textSimilarity = calculateTextSimilarity(bankTx.description, ledgerEntry.vendor);
        const descriptionMatches = textSimilarity >= 30;
        if (descriptionMatches) {
          matchingCriteria++;
          reasons.push(`Text similarity: ${textSimilarity.toFixed(0)}%`);
        }
      }
      
      // Calculate match score based on number of matching criteria
      let matchScore = 0;
      let matchLevel: 'full' | 'partial' | 'ambiguous' = 'ambiguous';
      
      if (matchingCriteria === 3) {
        matchScore = 100;
        matchLevel = 'full';
      } else if (matchingCriteria === 2) {
        matchScore = 66;
        matchLevel = 'partial';
      } else if (matchingCriteria === 1) {
        matchScore = 33;
        matchLevel = 'ambiguous';
      }
      
      // Only consider matches with at least one criterion met
      if (matchScore > 0) {
        const matchReason = reasons.length > 0 
          ? reasons.join(', ')
          : `${matchingCriteria}/3 criteria matched`;
          
        const currentMatch: MatchResult = {
          bankTransactionId: bankTx.id,
          ledgerEntryId: ledgerEntry.id,
          matchScore,
          matchReason,
          matchLevel
        };
        
        // Keep track of the best match for this bank transaction
        if (!bestMatch || currentMatch.matchScore > bestMatch.matchScore) {
          bestMatch = currentMatch;
        }
      }
    }
    
    // Add the best match if found
    if (bestMatch) {
      matches.push(bestMatch);
      usedLedgerIds.add(bestMatch.ledgerEntryId);
    }
  }
  
  console.log(`Found ${matches.length} matches: ${matches.filter(m => m.matchLevel === 'full').length} full, ${matches.filter(m => m.matchLevel === 'partial').length} partial, ${matches.filter(m => m.matchLevel === 'ambiguous').length} ambiguous`);
  
  return matches;
}