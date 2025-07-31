import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Delete all data in the correct order to avoid foreign key constraints
    await prisma.$transaction([
      // Delete match logs first (references both ledger entries and bank transactions)
      prisma.matchLog.deleteMany({}),
      
      // Delete ledger entries
      prisma.ledgerEntry.deleteMany({}),
      
      // Delete bank transactions
      prisma.bankTransaction.deleteMany({}),
    ]);

    return NextResponse.json({ 
      success: true, 
      message: "All data has been reset successfully" 
    });
  } catch (error) {
    console.error("Error resetting data:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to reset data" 
      },
      { status: 500 }
    );
  }
}