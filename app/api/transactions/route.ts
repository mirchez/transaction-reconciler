import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Get user email from query params or headers
    const searchParams = request.nextUrl.searchParams;
    const userEmail = searchParams.get("email");

    if (!userEmail) {
      return NextResponse.json({
        transactions: [],
        stats: { total: 0, matched: 0, ledgerOnly: 0, bankOnly: 0 },
      });
    }

    // Ensure user exists
    await prisma.user.upsert({
      where: { email: userEmail },
      update: {},
      create: { email: userEmail },
    });
    
    // Fetch all data for this email
    const [ledgerEntries, bankTransactions, matches] = await Promise.all([
      prisma.ledger.findMany({
        where: { userEmail },
        orderBy: { date: "desc" },
      }),
      prisma.bank.findMany({
        where: { userEmail },
        orderBy: { date: "desc" },
      }),
      prisma.matched.findMany({
        where: { userEmail },
        include: {
          ledger: true,
          bank: true,
        },
      }),
    ]);
    
    // Create a map of matches for quick lookup
    const matchMap = new Map();
    matches.forEach(match => {
      matchMap.set(`ledger-${match.ledgerId}`, match);
      matchMap.set(`bank-${match.bankId}`, match);
    });
    
    // Format transactions for display
    const transactions = [];
    
    // Add matched transactions
    matches.forEach(match => {
      transactions.push({
        id: match.id,
        date: match.date.toISOString(),
        amount: Number(match.amount),
        description: match.description,
        source: "Both" as const,
        status: "matched" as const,
        ledgerEntryId: match.ledgerId,
        bankTransactionId: match.bankId,
        matchScore: 100,
        bankTransaction: match.bankTransaction,
      });
    });
    
    // Add unmatched ledger entries
    ledgerEntries.forEach(entry => {
      if (!matchMap.has(`ledger-${entry.id}`)) {
        transactions.push({
          id: entry.id,
          date: entry.date.toISOString(),
          amount: Number(entry.amount),
          description: entry.description,
          source: "Ledger" as const,
          status: "ledger-only" as const,
          ledgerEntryId: entry.id,
        });
      }
    });
    
    // Add unmatched bank transactions
    bankTransactions.forEach(transaction => {
      if (!matchMap.has(`bank-${transaction.id}`)) {
        transactions.push({
          id: transaction.id,
          date: transaction.date.toISOString(),
          amount: Number(transaction.amount),
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
        ledgerOnly: ledgerEntries.filter(e => !matchMap.has(`ledger-${e.id}`)).length,
        bankOnly: bankTransactions.filter(t => !matchMap.has(`bank-${t.id}`)).length,
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