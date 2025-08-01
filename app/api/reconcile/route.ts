import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Decimal } from "@prisma/client/runtime/library";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "No email provided" },
        { status: 400 }
      );
    }

    // Get ALL ledger and bank entries (not just unmatched)
    const [ledgerEntries, bankEntries, existingMatches] = await Promise.all([
      prisma.ledger.findMany({
        where: { 
          userEmail: email
        }
      }),
      prisma.bank.findMany({
        where: { 
          userEmail: email
        }
      }),
      prisma.matched.findMany({
        where: {
          userEmail: email
        }
      })
    ]);

    // Validation: Ensure at least one entry exists in both ledger and bank
    if (ledgerEntries.length === 0) {
      return NextResponse.json(
        { 
          error: "No ledger entries found", 
          message: "Please upload receipts or add ledger entries before reconciling" 
        },
        { status: 400 }
      );
    }

    if (bankEntries.length === 0) {
      return NextResponse.json(
        { 
          error: "No bank entries found", 
          message: "Please upload a bank statement CSV before reconciling" 
        },
        { status: 400 }
      );
    }

    // Create a set of already matched pairs to avoid duplicates
    const existingMatchPairs = new Set(
      existingMatches.map(m => `${m.ledgerId}-${m.bankId}`)
    );

    const matches = [];
    const usedLedgerIds = new Set();
    const usedBankIds = new Set();

    // Sort by date to prioritize matching closer dates first
    const sortedBankEntries = [...bankEntries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const sortedLedgerEntries = [...ledgerEntries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    for (const bank of sortedBankEntries) {
      // Skip if this bank entry was already matched
      if (usedBankIds.has(bank.id)) continue;
      
      for (const ledger of sortedLedgerEntries) {
        // Skip if this ledger entry was already matched
        if (usedLedgerIds.has(ledger.id)) continue;
        
        // Check if amounts match
        const bankAmount = Number(bank.amount);
        const ledgerAmount = Number(ledger.amount);
        
        if (Math.abs(bankAmount - ledgerAmount) < 0.01) {
          // Check if dates match exactly (same day)
          const bankDate = new Date(bank.date).toISOString().split('T')[0];
          const ledgerDate = new Date(ledger.date).toISOString().split('T')[0];
          
          if (bankDate === ledgerDate) {
            // Check if descriptions are similar
            const bankDesc = bank.description.toLowerCase();
            const ledgerDesc = ledger.description.toLowerCase();
            
            // Look for common words or vendor names
            const bankWords = bankDesc.split(/\s+/);
            const ledgerWords = ledgerDesc.split(/\s+/);
            
            const hasCommonWords = bankWords.some(word => 
              word.length > 3 && ledgerWords.some(lw => lw.includes(word) || word.includes(lw))
            );
            
            if (hasCommonWords || bankDesc.includes(ledgerDesc) || ledgerDesc.includes(bankDesc)) {
              // Check if this pair hasn't been matched before
              const matchPairKey = `${ledger.id}-${bank.id}`;
              if (!existingMatchPairs.has(matchPairKey)) {
                matches.push({ bank, ledger });
                // Mark both as used so they won't be matched again in this run
                usedLedgerIds.add(ledger.id);
                usedBankIds.add(bank.id);
                break; // Move to next bank entry
              }
            }
          }
        }
      }
    }

    // Create matched records
    for (const match of matches) {
      const { bank, ledger } = match;
      
      await prisma.matched.create({
        data: {
          userEmail: email,
          ledgerId: ledger.id,
          bankId: bank.id,
          bankTransaction: `From: ${bank.description} $${bank.amount} on ${new Date(bank.date).toLocaleDateString()}`,
          description: ledger.description,
          amount: bank.amount,
          date: ledger.date
        }
      });
    }

    // Get updated statistics
    const [totalMatched, totalLedger, totalBank] = await Promise.all([
      prisma.matched.count({ where: { userEmail: email } }),
      prisma.ledger.count({ where: { userEmail: email } }),
      prisma.bank.count({ where: { userEmail: email } })
    ]);

    return NextResponse.json({
      success: true,
      message: matches.length > 0 
        ? `Successfully matched ${matches.length} new transaction${matches.length > 1 ? 's' : ''}`
        : "No new matches found",
      stats: {
        newMatches: matches.length,
        totalMatched: totalMatched,
        totalLedger: totalLedger,
        totalBank: totalBank,
        unmatchedLedger: totalLedger - totalMatched,
        unmatchedBank: totalBank - totalMatched,
        totalComparisons: ledgerEntries.length * bankEntries.length
      }
    });
  } catch (error) {
    console.error("Reconciliation error:", error);
    return NextResponse.json(
      { 
        error: "Failed to reconcile transactions", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}