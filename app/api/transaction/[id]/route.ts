import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    console.log("Fetching transaction with ID:", id);
    
    // First try to find a match by ID
    const match = await prisma.matchLog.findFirst({
      where: {
        OR: [
          { id },
          { ledgerEntryId: id },
          { bankTransactionId: id }
        ]
      },
      include: {
        ledgerEntry: true,
        bankTransaction: true,
      }
    });
    
    if (match) {
      // Found a matched transaction
      return NextResponse.json({
        type: "matched",
        match: {
          id: match.id,
          score: match.matchScore,
          createdAt: match.createdAt,
          ledgerEntry: match.ledgerEntry,
          bankTransaction: match.bankTransaction,
        }
      });
    }
    
    // Try to find a ledger entry
    const ledgerEntry = await prisma.ledgerEntry.findFirst({
      where: { id }
    });
    
    if (ledgerEntry) {
      // Check if this entry has any matches
      const relatedMatches = await prisma.matchLog.findMany({
        where: { ledgerEntryId: id },
        include: { bankTransaction: true },
        orderBy: { matchScore: 'desc' }
      });
      
      return NextResponse.json({
        type: "ledger",
        ledgerEntry,
        potentialMatches: relatedMatches
      });
    }
    
    // Try to find a bank transaction
    const bankTransaction = await prisma.bankTransaction.findFirst({
      where: { id }
    });
    
    if (bankTransaction) {
      // Check if this transaction has any matches
      const relatedMatches = await prisma.matchLog.findMany({
        where: { bankTransactionId: id },
        include: { ledgerEntry: true },
        orderBy: { matchScore: 'desc' }
      });
      
      return NextResponse.json({
        type: "bank",
        bankTransaction,
        potentialMatches: relatedMatches
      });
    }
    
    // No transaction found
    return NextResponse.json(
      { error: "Transaction not found" },
      { status: 404 }
    );
    
  } catch (error) {
    console.error("Error fetching transaction:", error);
    
    // Check if it's a Prisma error about missing userId
    if (error instanceof Error && error.message.includes('userId')) {
      return NextResponse.json(
        { 
          error: "Database schema mismatch. Please run 'pnpm prisma generate' and 'pnpm prisma migrate dev' to update the database schema." 
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to fetch transaction details" },
      { status: 500 }
    );
  }
}