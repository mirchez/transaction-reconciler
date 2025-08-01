import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  console.log("Stats API called");
  
  try {
    // Get counts for each type
    const [matchedCount, totalLedger, totalBank] = await Promise.all([
      // Count matched transactions
      prisma.matched.count(),
      // Count total ledger entries
      prisma.ledger.count(),
      // Count total bank transactions
      prisma.bank.count(),
    ]);
    
    // Calculate unmatched counts
    const ledgerOnlyCount = totalLedger - matchedCount;
    const bankOnlyCount = totalBank - matchedCount;

    return NextResponse.json({
      matched: matchedCount,
      ledgerOnly: ledgerOnlyCount,
      bankOnly: bankOnlyCount,
    });
  } catch (error) {
    console.error("Stats API error:", error);
    // Return default values on error instead of 500
    return NextResponse.json({
      matched: 0,
      ledgerOnly: 0,
      bankOnly: 0,
    });
  }
}