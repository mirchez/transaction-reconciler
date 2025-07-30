import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  console.log("Stats API called");
  
  try {
    const userId = "demo-user"; // TODO: Replace with actual user ID from auth

    // Get counts for each type
    const [matchedCount, ledgerOnlyCount, bankOnlyCount] = await Promise.all([
      // Count matched transactions (both ledger and bank entries that are matched)
      prisma.matchLog.count({
        where: { userId },
      }),
      // Count ledger entries that are not matched
      prisma.ledgerEntry.count({
        where: {
          userId,
          matched: false,
        },
      }),
      // Count bank transactions that are not matched
      prisma.bankTransaction.count({
        where: {
          userId,
          matched: false,
        },
      }),
    ]);

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