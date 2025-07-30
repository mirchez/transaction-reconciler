import { prisma } from "@/lib/db";
import { z } from "zod";
import { NextResponse } from "next/server";

const PatchSchema = z.object({
  matched: z.boolean().optional(),
});

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await prisma.bankTransaction.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const result = PatchSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: z.treeifyError(result.error) },
      { status: 400 }
    );
  }

  const updated = await prisma.bankTransaction.update({
    where: { id: params.id },
    data: result.data,
  });

  return NextResponse.json(updated);
}
