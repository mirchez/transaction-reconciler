import { prisma } from "@/lib/db";
import { z } from "zod";
import { NextResponse } from "next/server";

const BankSchema = z.object({
  date: z.string().datetime(),
  amount: z.number(),
  description: z.string(),
});

export async function GET() {
  const data = await prisma.bank.findMany({
    orderBy: { date: "desc" },
  });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  
  // Get user email from request body or headers
  const userEmail = body.userEmail || req.headers.get('x-user-email');
  
  if (!userEmail) {
    return NextResponse.json(
      { error: "User email is required" },
      { status: 400 }
    );
  }
  
  const result = BankSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: z.treeifyError(result.error) },
      { status: 400 }
    );
  }

  const tx = await prisma.bank.create({
    data: {
      ...result.data,
      userEmail: userEmail,
    },
  });

  return NextResponse.json(tx, { status: 201 });
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

    // Delete matched entries that reference bank transactions
    await prisma.matched.deleteMany({
      where: { userEmail }
    });

    // Delete bank transactions only
    await prisma.bank.deleteMany({
      where: { userEmail }
    });

    return NextResponse.json(
      { success: true, message: "Bank/CSV data deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting bank data:", error);
    return NextResponse.json(
      { error: "Failed to delete bank data" },
      { status: 500 }
    );
  }
}
