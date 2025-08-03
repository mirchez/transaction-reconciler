import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const LedgerSchema = z.object({
  date: z.string().datetime(),
  amount: z.number(),
  description: z.string(),
});

export async function GET() {
  const data = await prisma.ledger.findMany({ orderBy: { date: "desc" } });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const result = LedgerSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: z.treeifyError(result.error) },
      { status: 400 }
    );
  }

  const entry = await prisma.ledger.create({
    data: {
      ...result.data,
      userEmail: "demo-user@example.com", // TODO: Get from session
    },
  });

  return NextResponse.json(entry, { status: 201 });
}

export async function DELETE(req: Request) {
  try {
    // Get user email from query params
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("email");

    if (!userEmail) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    // Delete matched entries that reference ledger transactions
    await prisma.matched.deleteMany({
      where: { userEmail }
    });

    // Delete ledger entries
    await prisma.ledger.deleteMany({
      where: { userEmail }
    });

    // Delete processed emails to reset email tracking
    await prisma.processedEmail.deleteMany({
      where: { userEmail }
    });

    return NextResponse.json(
      { success: true, message: "Ledger data deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting ledger data:", error);
    return NextResponse.json(
      { error: "Failed to delete ledger data" },
      { status: 500 }
    );
  }
}
