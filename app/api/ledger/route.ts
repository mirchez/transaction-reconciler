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
