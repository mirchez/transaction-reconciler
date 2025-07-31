import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { prisma } from "@/lib/db";
import jsPDF from "jspdf";

async function generateTestReceipt(): Promise<Buffer> {
  try {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(24);
    doc.text('RECEIPT', 105, 20, { align: 'center' });

    // Company Info
    doc.setFontSize(14);
    doc.text('Tech Solutions Inc.', 105, 35, { align: 'center' });
    doc.setFontSize(10);
    doc.text('123 Innovation Drive', 105, 42, { align: 'center' });
    doc.text('San Francisco, CA 94103', 105, 48, { align: 'center' });
    doc.text('Phone: (415) 555-0123', 105, 54, { align: 'center' });

    // Line separator
    doc.line(20, 60, 190, 60);

    // Receipt Details
    doc.setFontSize(10);
    doc.text('Receipt #: TSI-2024-0115', 20, 70);
    doc.text(`Date: 2024-01-15`, 20, 76);
    doc.text('Time: 10:45 AM', 20, 82);

    // Line separator
    doc.line(20, 88, 190, 88);

    // Items header
    doc.setFontSize(12);
    doc.text('ITEMS PURCHASED:', 20, 98);

    // Items
    doc.setFontSize(10);
    let y = 108;
    
    // Item 1
    doc.text('Software License (Annual)', 20, y);
    doc.text('$299.99', 170, y, { align: 'right' });
    y += 6;
    doc.setFontSize(9);
    doc.text('  - Professional Edition', 20, y);
    y += 5;
    doc.text('  - 1 User License', 20, y);
    y += 10;

    // Item 2
    doc.setFontSize(10);
    doc.text('Premium Support Package', 20, y);
    doc.text('$49.99', 170, y, { align: 'right' });
    y += 6;
    doc.setFontSize(9);
    doc.text('  - Priority Email Support', 20, y);
    y += 5;
    doc.text('  - 24/7 Access', 20, y);
    y += 10;

    // Line separator
    doc.line(20, y, 190, y);
    y += 10;

    // Totals
    doc.setFontSize(10);
    doc.text('Subtotal:', 120, y);
    doc.text('$349.98', 170, y, { align: 'right' });
    y += 6;
    doc.text('Sales Tax (8.5%):', 120, y);
    doc.text('$29.75', 170, y, { align: 'right' });
    y += 8;
    
    doc.setFontSize(12);
    doc.text('Total:', 120, y);
    doc.text('$379.73', 170, y, { align: 'right' });
    y += 10;

    // Payment info
    doc.setFontSize(9);
    doc.text('Payment Method: Credit Card ****1234', 20, y);
    y += 5;
    doc.text('Transaction ID: TXN-20240115-1045', 20, y);
    y += 8;

    // Line separator
    doc.line(20, y, 190, y);
    y += 10;

    // Footer
    doc.setFontSize(10);
    doc.text('Thank you for your purchase!', 105, y, { align: 'center' });
    y += 6;
    doc.text('Please keep this receipt for your records', 105, y, { align: 'center' });
    
    y += 10;
    doc.setFontSize(8);
    doc.setTextColor(136, 136, 136);
    doc.text('Parser Data: Date=2024-01-15, Amount=$379.73, Vendor=Tech Solutions Inc., Category=Software', 105, y, { align: 'center' });

    // Convert to buffer
    const pdfOutput = doc.output('arraybuffer');
    return Buffer.from(pdfOutput);
  } catch (error) {
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    console.log(`📧 Sending test email to ${email}`);

    // Get Gmail auth
    const googleAuth = await prisma.googleAuth.findUnique({
      where: { email },
    });

    if (!googleAuth) {
      return NextResponse.json(
        { error: "Gmail account not connected" },
        { status: 401 }
      );
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

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // Generate test receipt PDF
    const pdfBuffer = await generateTestReceipt();
    const pdfBase64 = pdfBuffer.toString('base64');
    const fileName = `test-receipt-${Date.now()}.pdf`;

    // Create email with attachment
    const boundary = `boundary_${Date.now()}`;
    const messageParts = [
      'From: me',
      `To: ${email}`,
      'Subject: Test Receipt - Transaction Reconciler',
      'MIME-Version: 1.0',
      `Content-Type: multipart/mixed; boundary="${boundary}"`,
      '',
      `--${boundary}`,
      'Content-Type: text/plain; charset="UTF-8"',
      'Content-Transfer-Encoding: 7bit',
      '',
      'This is a test email with a sample receipt PDF.',
      '',
      'The PDF contains a sample receipt that should be processed by the Transaction Reconciler.',
      '',
      'Best regards,',
      'Transaction Reconciler Team',
      '',
      `--${boundary}`,
      `Content-Type: application/pdf; name="${fileName}"`,
      'Content-Transfer-Encoding: base64',
      `Content-Disposition: attachment; filename="${fileName}"`,
      '',
      pdfBase64,
      '',
      `--${boundary}--`
    ];

    const message = messageParts.join('\n');
    const encodedMessage = Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    // Send email
    const result = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log(`✅ Test email sent successfully: ${result.data.id}`);

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully",
      messageId: result.data.id,
      details: {
        to: email,
        fileName: fileName,
        pdfSize: `${(pdfBuffer.length / 1024).toFixed(2)} KB`
      }
    });

  } catch (error: any) {
    console.error("Error sending test email:", error);
    
    let errorMessage = "Failed to send test email";
    if (error.code === 401) {
      errorMessage = "Gmail authentication failed. Please reconnect your account.";
    } else if (error.code === 403) {
      errorMessage = "Gmail permissions denied. Please reconnect with proper permissions.";
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error.message 
      },
      { status: error.code || 500 }
    );
  }
}