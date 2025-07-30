import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    
    // Fetch all data
    const [ledgerEntries, bankTransactions, matches] = await Promise.all([
      prisma.ledgerEntry.findMany({
        orderBy: { date: "desc" },
      }),
      prisma.bankTransaction.findMany({
        orderBy: { date: "desc" },
      }),
      prisma.matchLog.findMany({
        include: {
          ledgerEntry: true,
          bankTransaction: true,
        },
      }),
    ]);
    
    // Create a map of matches for quick lookup
    const matchMap = new Map();
    matches.forEach(match => {
      matchMap.set(`ledger-${match.ledgerEntryId}`, match);
      matchMap.set(`bank-${match.bankTransactionId}`, match);
    });
    
    // Format transactions for display
    const transactions = [];
    
    // Add matched transactions
    matches.forEach(match => {
      transactions.push({
        id: match.id,
        date: match.ledgerEntry.date.toISOString(),
        amount: match.ledgerEntry.amount,
        description: match.ledgerEntry.vendor,
        source: "Both" as const,
        status: "matched" as const,
        category: match.ledgerEntry.category || undefined,
        vendor: match.ledgerEntry.vendor,
        ledgerEntryId: match.ledgerEntryId,
        bankTransactionId: match.bankTransactionId,
        matchScore: match.matchScore,
      });
    });
    
    // Add unmatched ledger entries
    ledgerEntries.forEach(entry => {
      if (!entry.matched) {
        transactions.push({
          id: entry.id,
          date: entry.date.toISOString(),
          amount: entry.amount,
          description: entry.vendor,
          source: "Ledger" as const,
          status: "ledger-only" as const,
          category: entry.category || undefined,
          vendor: entry.vendor,
          ledgerEntryId: entry.id,
        });
      }
    });
    
    // Add unmatched bank transactions
    bankTransactions.forEach(transaction => {
      if (!transaction.matched) {
        transactions.push({
          id: transaction.id,
          date: transaction.date.toISOString(),
          amount: transaction.amount,
          description: transaction.description,
          source: "Bank" as const,
          status: "bank-only" as const,
          bankTransactionId: transaction.id,
        });
      }
    });
    
    // Sort by date (newest first)
    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return NextResponse.json({
      transactions,
      stats: {
        total: transactions.length,
        matched: matches.length,
        ledgerOnly: ledgerEntries.filter(e => !e.matched).length,
        bankOnly: bankTransactions.filter(t => !t.matched).length,
      },
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions", transactions: [] },
      { status: 500 }
    );
  }
}