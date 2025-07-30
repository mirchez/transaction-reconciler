import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const LedgerSchema = z.object({
  date: z.string().datetime(),
  amount: z.number(),
  vendor: z.string(),
  category: z.string().optional(),
});

export async function GET() {
  const data = await prisma.ledgerEntry.findMany({ orderBy: { date: "desc" } });
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

  const entry = await prisma.ledgerEntry.create({
    data: result.data,
  });

  return NextResponse.json(entry, { status: 201 });
}
