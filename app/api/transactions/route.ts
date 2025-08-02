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
    
    // Format transactions for display - the frontend expects ALL ledger and ALL bank entries
    const transactions: any[] = [];
    
    // Add ALL ledger entries (both matched and unmatched)
    ledgerEntries.forEach(entry => {
      const matchData = matchMap.get(`ledger-${entry.id}`);
      transactions.push({
        id: entry.id,
        date: entry.date.toISOString().split('T')[0],
        amount: Number(entry.amount),
        description: entry.description,
        source: "Ledger" as const,
        status: matchData ? "matched" as const : "ledger-only" as const,
        ledgerEntryId: entry.id,
        bankTransactionId: matchData?.bankId,
        matchScore: matchData?.matchScore || (matchData ? 100 : undefined),
        matchType: matchData?.matchType,
        matchReason: matchData?.matchReason,
      });
    });
    
    // Add ALL bank transactions (both matched and unmatched)
    bankTransactions.forEach(transaction => {
      const matchData = matchMap.get(`bank-${transaction.id}`);
      transactions.push({
        id: transaction.id,
        date: transaction.date.toISOString().split('T')[0],
        amount: Number(transaction.amount),
        description: transaction.description,
        source: "Bank" as const,
        status: matchData ? "matched" as const : "bank-only" as const,
        bankTransactionId: transaction.id,
        ledgerEntryId: matchData?.ledgerId,
        matchScore: matchData?.matchScore || (matchData ? 100 : undefined),
        matchType: matchData?.matchType,
        matchReason: matchData?.matchReason,
      });
    });
    
    // Keep matched transactions separate for reconciliation summary
    matches.forEach(match => {
      transactions.push({
        id: match.id,
        date: match.date.toISOString().split('T')[0],
        amount: Number(match.amount),
        description: match.description,
        source: "Both" as const,
        status: "matched" as const,
        ledgerEntryId: match.ledgerId,
        bankTransactionId: match.bankId,
        matchScore: match.matchScore || 100,
        matchType: match.matchType || "logic",
        matchReason: match.matchReason,
        bankDescription: match.bankTransaction,
      });
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