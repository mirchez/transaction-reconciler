import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// This endpoint creates test data for development
export async function POST(request: NextRequest) {
  try {
    const userId = "demo-user";
    
    // Create test ledger entries
    const ledgerEntries = await Promise.all([
      prisma.ledgerEntry.create({
        data: {
          userId,
          date: new Date("2024-01-15"),
          amount: 542.48,
          vendor: "Tech Solutions Inc.",
          category: "Software",
          matched: false,
        },
      }),
      prisma.ledgerEntry.create({
        data: {
          userId,
          date: new Date("2024-01-14"),
          amount: 123.45,
          vendor: "Office Supplies Co.",
          category: "Office",
          matched: false,
        },
      }),
    ]);
    
    // Create test bank transactions
    const bankTransactions = await Promise.all([
      prisma.bankTransaction.create({
        data: {
          userId,
          date: new Date("2024-01-15"),
          amount: 542.48,
          description: "TECH SOLUTIONS INC",
          matched: false,
        },
      }),
      prisma.bankTransaction.create({
        data: {
          userId,
          date: new Date("2024-01-16"),
          amount: 89.99,
          description: "AMAZON PURCHASE",
          matched: false,
        },
      }),
    ]);
    
    // Create a match for the first entries
    await prisma.matchLog.create({
      data: {
        userId,
        ledgerEntryId: ledgerEntries[0].id,
        bankTransactionId: bankTransactions[0].id,
        matchScore: 0.95,
      },
    });
    
    // Update matched status
    await Promise.all([
      prisma.ledgerEntry.update({
        where: { id: ledgerEntries[0].id },
        data: { matched: true },
      }),
      prisma.bankTransaction.update({
        where: { id: bankTransactions[0].id },
        data: { matched: true },
      }),
    ]);
    
    return NextResponse.json({
      success: true,
      message: "Test data created successfully",
      data: {
        ledgerEntries: ledgerEntries.length,
        bankTransactions: bankTransactions.length,
        matches: 1,
      },
    });
  } catch (error) {
    console.error("Error creating test data:", error);
    return NextResponse.json(
      { error: "Failed to create test data" },
      { status: 500 }
    );
  }
}

// Delete all test data
export async function DELETE(request: NextRequest) {
  try {
    const userId = "demo-user";
    
    // Delete in correct order due to foreign key constraints
    await prisma.matchLog.deleteMany({ where: { userId } });
    await prisma.ledgerEntry.deleteMany({ where: { userId } });
    await prisma.bankTransaction.deleteMany({ where: { userId } });
    
    return NextResponse.json({
      success: true,
      message: "Test data deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting test data:", error);
    return NextResponse.json(
      { error: "Failed to delete test data" },
      { status: 500 }
    );
  }
}