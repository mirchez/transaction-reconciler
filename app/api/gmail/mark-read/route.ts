import { NextResponse } from "next/server";
import { google } from "googleapis";
import { prisma } from "@/lib/prisma";

async function getAuthenticatedClient(email: string) {
  const googleAuth = await prisma.googleAuth.findUnique({
    where: { email },
  });

  if (!googleAuth) {
    throw new Error("Google account not connected");
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    access_token: googleAuth.accessToken,
    refresh_token: googleAuth.refreshToken,
    expiry_date: googleAuth.expiryDate?.getTime(),
    token_type: googleAuth.tokenType,
    scope: googleAuth.scope,
  });

  return { oauth2Client, googleAuth };
}

export async function POST(request: Request) {
  try {
    const { email, messageIds } = await request.json();

    if (!email || !messageIds || !Array.isArray(messageIds)) {
      return NextResponse.json(
        { error: "Email and messageIds array are required" },
        { status: 400 }
      );
    }

    const { oauth2Client } = await getAuthenticatedClient(email);
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // Mark messages as read
    const results = await Promise.all(
      messageIds.map(async (messageId) => {
        try {
          await gmail.users.messages.modify({
            userId: "me",
            id: messageId,
            requestBody: {
              removeLabelIds: ["UNREAD"],
            },
          });
          return { messageId, success: true };
        } catch (error) {
          console.error(`Failed to mark message ${messageId} as read:`, error);
          return { messageId, success: false, error: error instanceof Error ? error.message : String(error) };
        }
      })
    );

    const successCount = results.filter((r) => r.success).length;
    console.log(`✅ Marked ${successCount}/${messageIds.length} emails as read`);

    return NextResponse.json({
      marked: successCount,
      failed: messageIds.length - successCount,
      results,
    });
  } catch (error) {
    console.error("Error marking emails as read:", error);
    return NextResponse.json(
      { error: "Failed to mark emails as read" },
      { status: 500 }
    );
  }
}