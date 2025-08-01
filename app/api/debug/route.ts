import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const [ledgerCount, bankCount, matchCount] = await Promise.all([
      prisma.ledger.count(),
      prisma.bank.count(),
      prisma.matched.count(),
    ]);
    
    // Get a few sample records
    const [ledgerSamples, bankSamples, matchSamples] = await Promise.all([
      prisma.ledger.findMany({ take: 3 }),
      prisma.bank.findMany({ take: 3 }),
      prisma.matched.findMany({ take: 3, include: { ledger: true, bank: true } }),
    ]);
    
    return NextResponse.json({
      counts: {
        ledgerEntries: ledgerCount,
        bankTransactions: bankCount,
        matches: matchCount,
      },
      samples: {
        ledgerEntries: ledgerSamples,
        bankTransactions: bankSamples,
        matches: matchSamples,
      }
    });
  } catch (error) {
    console.error("Debug endpoint error:", error);
    return NextResponse.json({ 
      error: "Failed to fetch debug info",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}