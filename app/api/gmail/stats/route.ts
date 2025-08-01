import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Simulated email tracking (in production, you'd store this in database)
const emailTracking = new Map();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Get tracking data for this email
    const tracking = emailTracking.get(email) || {
      totalChecked: 0,
      pdfsFound: 0,
      lastCheck: null,
      recentEmails: [],
    };

    // Get recent processed PDFs from database
    const recentLedgerEntries = await prisma.ledger.findMany({
      where: {
        userEmail: email,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    return NextResponse.json({
      totalChecked: tracking.totalChecked,
      pdfsFound: recentLedgerEntries.length,
      lastCheck: tracking.lastCheck,
      recentEmails: tracking.recentEmails.slice(0, 5),
    });
  } catch (error) {
    console.error("Error fetching Gmail stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}

// Helper function to update tracking (call this from the check endpoint)
function updateEmailTracking(email: string, data: any) {
  const current = emailTracking.get(email) || {
    totalChecked: 0,
    pdfsFound: 0,
    lastCheck: null,
    recentEmails: [],
  };

  const updatedEmails = data.newEmails.map((e: any) => ({
    ...e,
    pdfCount: e.pdfAttachments?.length || 0,
    hasPdf: (e.pdfAttachments?.length || 0) > 0,
  }));

  emailTracking.set(email, {
    totalChecked: current.totalChecked + data.checked,
    pdfsFound: current.pdfsFound + data.pdfsFound,
    lastCheck: new Date(),
    recentEmails: [...updatedEmails, ...current.recentEmails].slice(0, 10),
  });
}