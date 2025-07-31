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

    // Get unmatched ledger and bank entries
    const [ledgerEntries, bankEntries] = await Promise.all([
      prisma.ledger.findMany({
        where: { 
          userEmail: email,
          matched: {
            none: {}
          }
        }
      }),
      prisma.bank.findMany({
        where: { 
          userEmail: email,
          matched: {
            none: {}
          }
        }
      })
    ]);

    const matches = [];

    for (const bank of bankEntries) {
      for (const ledger of ledgerEntries) {
        // Check if amounts match (bank amount vs ledger debit or credit)
        const bankAmount = Number(bank.amount);
        const ledgerAmount = Number(ledger.debit || ledger.credit || 0);
        
        if (Math.abs(bankAmount - ledgerAmount) < 0.01) {
          // Check if dates are close (within 7 days)
          const bankDate = new Date(bank.date);
          const ledgerDate = new Date(ledger.date);
          const daysDiff = Math.abs(bankDate.getTime() - ledgerDate.getTime()) / (1000 * 60 * 60 * 24);
          
          if (daysDiff <= 7) {
            // Check if descriptions are similar
            const bankDesc = bank.description.toLowerCase();
            const ledgerDesc = (ledger.description || ledger.name || "").toLowerCase();
            
            if (bankDesc.includes(ledgerDesc) || ledgerDesc.includes(bankDesc) || 
                (ledger.name && bankDesc.includes(ledger.name.toLowerCase()))) {
              matches.push({ bank, ledger });
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
      message: `Matched ${matches.length} transactions`,
      stats: {
        newMatches: matches.length,
        totalMatched: totalMatched,
        totalLedger: totalLedger,
        totalBank: totalBank,
        unmatchedLedger: totalLedger - totalMatched,
        unmatchedBank: totalBank - totalMatched
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