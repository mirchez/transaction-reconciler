import { prisma } from "@/lib/db";
import { z } from "zod";
import { NextResponse } from "next/server";

const PatchSchema = z.object({
  description: z.string().optional(),
  amount: z.number().optional(),
  date: z.string().datetime().optional(),
});

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.bank.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const result = PatchSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: z.treeifyError(result.error) },
      { status: 400 }
    );
  }

  const updated = await prisma.bank.update({
    where: { id },
    data: result.data,
  });

  return NextResponse.json(updated);
}
