import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { EmailService } from "@/lib/email-service";
import { matchTransactionsWithAI } from "@/lib/openai-service";
import { z } from "zod";

const MatchRequestSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = MatchRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid data", details: result.error.errors },
        { status: 400 }
      );
    }

    const { email } = result.data;

    // Get email record
    const emailRecord = await EmailService.getOrCreateEmail(email);

    // Get all bank transactions for this email that aren't matched yet
    const bankTransactions = await prisma.bankTransaction.findMany({
      where: {
        emailId: emailRecord.id,
        matches: { none: {} } // Not matched yet
      },
      orderBy: { date: 'desc' }
    });

    // Get all ledger entries for this email that aren't matched yet
    const ledgerEntries = await prisma.ledgerEntry.findMany({
      where: {
        emailId: emailRecord.id,
        matches: { none: {} } // Not matched yet
      },
      orderBy: { date: 'desc' }
    });

    if (bankTransactions.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No bank transactions to match",
        matches: 0
      });
    }

    if (ledgerEntries.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No ledger entries to match",
        matches: 0
      });
    }

    console.log(`Starting AI matching for ${email}:`);
    console.log(`- Bank transactions: ${bankTransactions.length}`);
    console.log(`- Ledger entries: ${ledgerEntries.length}`);

    // Prepare data for AI matching
    const bankData = bankTransactions.map(bt => ({
      id: bt.id,
      date: bt.date,
      description: bt.description,
      amount: Number(bt.amount)
    }));

    const ledgerData = ledgerEntries.map(le => ({
      id: le.id,
      date: le.date,
      description: le.description,
      debit: le.debit ? Number(le.debit) : undefined,
      credit: le.credit ? Number(le.credit) : undefined
    }));

    // Use AI to find matches
    const aiMatches = await matchTransactionsWithAI(bankData, ledgerData);

    let createdMatches = 0;

    // Process each AI-suggested match
    for (const match of aiMatches.matches) {
      // Only create matches with high confidence (0.6 or higher)
      if (match.matchScore >= 0.6) {
        try {
          // Find the actual bank transaction and ledger entry
          const bankTransaction = bankTransactions.find(bt => bt.id === match.bankTransactionId);
          const ledgerEntry = ledgerEntries.find(le => le.id === match.ledgerEntryId);

          if (!bankTransaction || !ledgerEntry) {
            console.warn(`Invalid match IDs: bank=${match.bankTransactionId}, ledger=${match.ledgerEntryId}`);
            continue;
          }

          // Create the match record
          await prisma.matched.create({
            data: {
              emailId: emailRecord.id,
              ledgerEntryId: match.ledgerEntryId,
              bankTransactionId: match.bankTransactionId,
              bankTransactionFormatted: `${bankTransaction.date.toLocaleDateString()}: ${bankTransaction.description} - $${bankTransaction.amount}`,
              description: ledgerEntry.description,
              amount: bankTransaction.amount,
              date: bankTransaction.date,
              matchScore: match.matchScore,
            }
          });

          createdMatches++;
          console.log(`✅ Created match: ${ledgerEntry.name} <-> ${bankTransaction.description} (score: ${match.matchScore})`);
        } catch (error) {
          console.error(`Error creating match:`, error);
        }
      } else {
        console.log(`⚠️ Skipping low-confidence match (score: ${match.matchScore}): ${match.reasoning}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully matched ${createdMatches} transaction(s)`,
      matches: createdMatches,
      totalSuggestions: aiMatches.matches.length,
      processed: {
        bankTransactions: bankTransactions.length,
        ledgerEntries: ledgerEntries.length
      }
    });

  } catch (error) {
    console.error('Error in transaction matching:', error);
    return NextResponse.json(
      { error: "Failed to match transactions", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    const matches = await EmailService.getMatches(email);
    return NextResponse.json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json(
      { error: "Failed to fetch matches" },
      { status: 500 }
    );
  }
}