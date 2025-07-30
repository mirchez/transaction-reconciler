import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const PatchSchema = z.object({
  category: z.string().optional(),
  matched: z.boolean().optional(),
});

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await prisma.ledgerEntry.delete({ where: { id: params.id } });
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

  const updated = await prisma.ledgerEntry.update({
    where: { id: params.id },
    data: result.data,
  });

  return NextResponse.json(updated);
}
