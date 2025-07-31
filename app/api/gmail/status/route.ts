import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get the most recently updated Google auth connection
    const googleAuth = await prisma.googleAuth.findFirst({
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!googleAuth) {
      return NextResponse.json({ connected: false });
    }

    return NextResponse.json({
      connected: true,
      email: googleAuth.email,
      name: googleAuth.name,
      connectedAt: googleAuth.createdAt,
      lastChecked: googleAuth.updatedAt,
    });
  } catch (error) {
    console.error("Error checking Gmail status:", error);
    return NextResponse.json({ connected: false });
  }
}