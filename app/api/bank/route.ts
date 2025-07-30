import { prisma } from "@/lib/db";
import { z } from "zod";
import { NextResponse } from "next/server";

const BankSchema = z.object({
  date: z.string().datetime(),
  amount: z.number(),
  description: z.string(),
});

export async function GET() {
  const data = await prisma.bankTransaction.findMany({
    orderBy: { date: "desc" },
  });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const result = BankSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: z.treeifyError(result.error) },
      { status: 400 }
    );
  }

  const tx = await prisma.bankTransaction.create({
    data: result.data,
  });

  return NextResponse.json(tx, { status: 201 });
}
