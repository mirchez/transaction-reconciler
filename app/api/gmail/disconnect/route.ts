import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { google } from "googleapis";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Get the auth record
    const googleAuth = await prisma.googleAuth.findUnique({
      where: { email },
    });

    if (!googleAuth) {
      return NextResponse.json(
        { error: "Gmail account not found" },
        { status: 404 }
      );
    }

    // Revoke the access token if possible
    try {
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );

      oauth2Client.setCredentials({
        access_token: googleAuth.accessToken,
      });

      await oauth2Client.revokeCredentials();
      console.log(`✅ Revoked Google access for ${email}`);
    } catch (error) {
      console.log("⚠️ Could not revoke token (may already be invalid):", error);
    }

    // Delete the auth record from database
    await prisma.googleAuth.delete({
      where: { email },
    });

    // Delete the user and all related data (cascade delete) if exists
    try {
      await prisma.user.delete({
        where: { email },
      });
    } catch (error) {
      console.log("⚠️ User record not found or already deleted");
    }

    console.log(`🗑️ Removed Gmail connection and all data for ${email}`);

    return NextResponse.json({
      success: true,
      message: "Gmail disconnected and all data cleared successfully",
    });
  } catch (error) {
    console.error("Error disconnecting Gmail:", error);
    return NextResponse.json(
      { error: "Failed to disconnect Gmail" },
      { status: 500 }
    );
  }
}