import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    console.log(`🔧 Force disconnecting Gmail for ${email}`);

    // Delete auth record if exists
    try {
      await prisma.googleAuth.delete({
        where: { email },
      });
      console.log("✅ Deleted GoogleAuth record");
    } catch (error) {
      console.log("⚠️ GoogleAuth record not found or already deleted");
    }

    // Delete user and all related data if exists
    try {
      await prisma.user.delete({
        where: { email },
      });
      console.log("✅ Deleted User record and all related data");
    } catch (error) {
      console.log("⚠️ User record not found or already deleted");
    }

    console.log(`✅ Force disconnect completed for ${email}`);

    return NextResponse.json({
      success: true,
      message: "Gmail force disconnected successfully",
    });
  } catch (error) {
    console.error("Error force disconnecting Gmail:", error);
    return NextResponse.json(
      { 
        error: "Failed to force disconnect Gmail",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}