import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// This endpoint creates test data for development
export async function POST(request: NextRequest) {
  try {
    const userEmail = "demo-user@example.com";
    
    // Create test ledger entries
    const ledgerEntries = await Promise.all([
      prisma.ledger.create({
        data: {
          userEmail,
          date: new Date("2024-01-15"),
          amount: 542.48,
          description: "Tech Solutions Inc. - Software License",
        },
      }),
      prisma.ledger.create({
        data: {
          userEmail,
          date: new Date("2024-01-14"),
          amount: 123.45,
          description: "Office Supplies Co. - Printer Paper",
        },
      }),
    ]);
    
    // Create test bank transactions
    const bankTransactions = await Promise.all([
      prisma.bank.create({
        data: {
          userEmail,
          date: new Date("2024-01-15"),
          amount: 542.48,
          description: "TECH SOLUTIONS INC",
        },
      }),
      prisma.bank.create({
        data: {
          userEmail,
          date: new Date("2024-01-16"),
          amount: 89.99,
          description: "AMAZON PURCHASE",
        },
      }),
    ]);
    
    // Create a match for the first entries
    const match = await prisma.matched.create({
      data: {
        userEmail,
        ledgerId: ledgerEntries[0].id,
        bankId: bankTransactions[0].id,
        bankTransaction: `2024-01-15: TECH SOLUTIONS INC - $542.48`,
        description: ledgerEntries[0].description,
        amount: 542.48,
        date: ledgerEntries[0].date,
      },
    });
    
    return NextResponse.json({
      success: true,
      data: {
        ledgerEntries,
        bankTransactions,
        matches: [match],
      },
    });
  } catch (error) {
    console.error("Test data creation error:", error);
    return NextResponse.json(
      { error: "Failed to create test data", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// DELETE endpoint to clean up test data
export async function DELETE(request: NextRequest) {
  try {
    const userEmail = "demo-user@example.com";
    
    // Delete in order to respect foreign key constraints
    await prisma.matched.deleteMany({ where: { userEmail } });
    await prisma.ledger.deleteMany({ where: { userEmail } });
    await prisma.bank.deleteMany({ where: { userEmail } });
    
    return NextResponse.json({ success: true, message: "Test data deleted" });
  } catch (error) {
    console.error("Test data deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete test data", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}