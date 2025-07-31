import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { prisma } from "@/lib/prisma";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/?error=auth_denied`
      );
    }

    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/?error=no_code`
      );
    }

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data: userInfo } = await oauth2.userinfo.get();

    if (!userInfo.email) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/?error=no_email`
      );
    }

    // Store the tokens in the database
    // Since we don't have user authentication, we'll store by email
    await prisma.googleAuth.upsert({
      where: { email: userInfo.email },
      update: {
        accessToken: tokens.access_token!,
        refreshToken: tokens.refresh_token || undefined,
        expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
        scope: tokens.scope || "",
        tokenType: tokens.token_type || "Bearer",
        updatedAt: new Date(),
      },
      create: {
        email: userInfo.email,
        name: userInfo.name || userInfo.email,
        accessToken: tokens.access_token!,
        refreshToken: tokens.refresh_token || undefined,
        expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
        scope: tokens.scope || "",
        tokenType: tokens.token_type || "Bearer",
      },
    });

    // Redirect back to the app with success
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/?gmail_connected=true&email=${userInfo.email}`
    );
  } catch (error) {
    console.error("Error in OAuth callback:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    // More specific error handling
    if (error instanceof Error) {
      if (error.message.includes("invalid_grant")) {
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_APP_URL}/?error=invalid_grant`
        );
      }
      if (error.message.includes("redirect_uri_mismatch")) {
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_APP_URL}/?error=redirect_uri_mismatch`
        );
      }
    }
    
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/?error=auth_failed`
    );
  }
}