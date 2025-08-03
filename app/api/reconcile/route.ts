import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Decimal } from "@prisma/client/runtime/library";
import { matchTransactionsWithAI } from "@/lib/match-transactions";

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

    // Track different types of matches
    const logicMatches: any[] = [];
    const aiMatches: any[] = [];
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
                logicMatches.push({ bank, ledger, matchScore: 100 });
                // Mark both as used so they won't be matched again
                usedLedgerIds.add(ledger.id);
                usedBankIds.add(bank.id);
                
                // Mark ALL similar entries as used to prevent duplicate matching
                // This assumes no duplicate transactions should exist
                for (const l of sortedLedgerEntries) {
                  if (Number(l.amount) === ledgerAmount && 
                      new Date(l.date).toISOString().split('T')[0] === ledgerDate &&
                      l.description.toLowerCase() === ledgerDesc) {
                    usedLedgerIds.add(l.id);
                  }
                }
                
                for (const b of sortedBankEntries) {
                  if (Number(b.amount) === bankAmount && 
                      new Date(b.date).toISOString().split('T')[0] === bankDate &&
                      b.description.toLowerCase() === bankDesc) {
                    usedBankIds.add(b.id);
                  }
                }
                
                break; // Move to next bank entry
              }
            }
          }
        }
      }
    }

    // Second pass: Use AI matching for unmatched transactions
    if (process.env.OPENAI_API_KEY) {
      // Get unmatched transactions
      const unmatchedBankEntries = bankEntries.filter(b => 
        !usedBankIds.has(b.id) && 
        !existingMatches.some(m => m.bankId === b.id)
      );
      
      const unmatchedLedgerEntries = ledgerEntries.filter(l => 
        !usedLedgerIds.has(l.id) && 
        !existingMatches.some(m => m.ledgerId === l.id)
      );

      if (unmatchedBankEntries.length > 0 && unmatchedLedgerEntries.length > 0) {
        try {
          // Prepare data for AI matching
          const bankTransactionsForAI = unmatchedBankEntries.map(b => ({
            id: b.id,
            date: new Date(b.date),
            amount: Number(b.amount),
            description: b.description
          }));

          const ledgerEntriesForAI = unmatchedLedgerEntries.map(l => ({
            id: l.id,
            date: new Date(l.date),
            amount: Number(l.amount),
            vendor: l.description,
            category: null
          }));

          // Call AI matching
          const aiMatchResults = await matchTransactionsWithAI(
            bankTransactionsForAI,
            ledgerEntriesForAI
          );

          // Process AI matches
          for (const aiMatch of aiMatchResults) {
            const bank = unmatchedBankEntries.find(b => b.id === aiMatch.bankTransactionId);
            const ledger = unmatchedLedgerEntries.find(l => l.id === aiMatch.ledgerEntryId);
            
            if (bank && ledger) {
              const matchPairKey = `${ledger.id}-${bank.id}`;
              if (!existingMatchPairs.has(matchPairKey) && 
                  !usedLedgerIds.has(ledger.id) && 
                  !usedBankIds.has(bank.id)) {
                aiMatches.push({ 
                  bank, 
                  ledger, 
                  matchScore: aiMatch.matchScore
                });
                usedLedgerIds.add(ledger.id);
                usedBankIds.add(bank.id);
              }
            }
          }
        } catch (error) {
          console.error("AI matching failed:", error);
          // Continue without AI matches if it fails
        }
      }
    }

    // Combine all matches
    const allMatches = [...logicMatches, ...aiMatches];

    // Create matched records
    for (const match of allMatches) {
      const { bank, ledger, matchScore } = match;
      
      await prisma.matched.create({
        data: {
          userEmail: email,
          ledgerId: ledger.id,
          bankId: bank.id,
          bankTransaction: `From: ${bank.description} $${bank.amount} on ${new Date(bank.date).toLocaleDateString()}`,
          description: ledger.description,
          amount: bank.amount,
          date: ledger.date,
          matchScore: matchScore
        }
      });
    }

    // Get updated statistics
    const [totalMatched, totalLedger, totalBank] = await Promise.all([
      prisma.matched.count({ where: { userEmail: email } }),
      prisma.ledger.count({ where: { userEmail: email } }),
      prisma.bank.count({ where: { userEmail: email } })
    ]);

    // Build detailed message
    let message = "";
    if (allMatches.length > 0) {
      if (logicMatches.length > 0 && aiMatches.length > 0) {
        message = `Successfully matched ${allMatches.length} new transaction${allMatches.length > 1 ? 's' : ''} (${logicMatches.length} by logic, ${aiMatches.length} by AI)`;
      } else if (logicMatches.length > 0) {
        message = `Successfully matched ${logicMatches.length} new transaction${logicMatches.length > 1 ? 's' : ''} using logic-based matching`;
      } else if (aiMatches.length > 0) {
        message = `Successfully matched ${aiMatches.length} new transaction${aiMatches.length > 1 ? 's' : ''} using AI matching`;
      }
    } else {
      message = "No new matches found";
    }

    return NextResponse.json({
      success: true,
      message,
      stats: {
        newMatches: allMatches.length,
        logicMatches: logicMatches.length,
        aiMatches: aiMatches.length,
        totalMatched: totalMatched,
        totalLedger: totalLedger,
        totalBank: totalBank,
        unmatchedLedger: totalLedger - totalMatched,
        unmatchedBank: totalBank - totalMatched,
        totalComparisons: ledgerEntries.length * bankEntries.length,
        aiEnabled: !!process.env.OPENAI_API_KEY
      },
      matches: allMatches.map(m => ({
        ledgerId: m.ledger.id,
        bankId: m.bank.id,
        matchScore: m.matchScore,
        ledgerDescription: m.ledger.description,
        bankDescription: m.bank.description,
        amount: Number(m.bank.amount),
        ledgerDate: m.ledger.date,
        bankDate: m.bank.date
      }))
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