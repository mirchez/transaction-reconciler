import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Create a new upload session
export async function POST(request: NextRequest) {
  try {
    
    // Create a unique session ID
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Get current transaction counts to track what was uploaded in this session
    const [ledgerCount, bankCount] = await Promise.all([
      prisma.ledger.count(),
      prisma.bank.count(),
    ]);
    
    // Store session info (in production, you'd use a session store or database)
    const session = {
      id: sessionId,
      startLedgerCount: ledgerCount,
      startBankCount: bankCount,
      createdAt: new Date().toISOString(),
    };
    
    return NextResponse.json(session);
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}

// Get session data with uploaded transactions
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get("id");
    
    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID required" },
        { status: 400 }
      );
    }
    
    // Get all transactions
    const [ledgerEntries, bankTransactions, matches] = await Promise.all([
      prisma.ledger.findMany({
        orderBy: { createdAt: "desc" },
      }),
      prisma.bank.findMany({
        orderBy: { createdAt: "desc" },
      }),
      prisma.matched.findMany({
        include: {
          ledger: true,
          bank: true,
        },
      }),
    ]);
    
    return NextResponse.json({
      sessionId,
      ledgerEntries,
      bankTransactions,
      matches,
      summary: {
        totalLedgerEntries: ledgerEntries.length,
        totalBankTransactions: bankTransactions.length,
        totalMatches: matches.length,
        unmatchedLedger: ledgerEntries.length - matches.length,
        unmatchedBank: bankTransactions.length - matches.length,
      },
    });
  } catch (error) {
    console.error("Session fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch session data" },
      { status: 500 }
    );
  }
}