import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // For now, check if any GoogleAuth record exists
    // In production, you'd check the current user's session
    const googleAuth = await prisma.googleAuth.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!googleAuth) {
      return NextResponse.json({
        connected: false,
        email: null,
      });
    }

    // Check if tokens are still valid (simple check)
    const isExpired = googleAuth.expiryDate && googleAuth.expiryDate < new Date();

    return NextResponse.json({
      connected: !isExpired,
      email: googleAuth.email,
    });
  } catch (error) {
    console.error("Error checking Gmail status:", error);
    return NextResponse.json({
      connected: false,
      email: null,
    });
  }
}