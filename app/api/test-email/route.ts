import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { prisma } from "@/lib/db";
import jsPDF from "jspdf";

// Track which PDF version to send next (in-memory counter)
let pdfCounter = 0;

async function generateTestReceipt(): Promise<Buffer> {
  try {
    const doc = new jsPDF();
    
    // Rotate through 3 different receipts
    const receiptVersion = pdfCounter % 3;
    pdfCounter++; // Increment for next time
    
    // Different receipt data for each version
    const receipts = [
      {
        // Receipt 1: Tech Solutions Inc (original)
        company: 'Tech Solutions Inc.',
        address: '123 Innovation Drive',
        city: 'San Francisco, CA 94103',
        phone: '(415) 555-0123',
        receiptNo: 'TSI-2024-0115',
        date: '2024-01-15',
        time: '10:45 AM',
        items: [
          { name: 'Software License (Annual)', price: 299.99, details: ['Professional Edition', '1 User License'] },
          { name: 'Premium Support Package', price: 49.99, details: ['Priority Email Support', '24/7 Access'] }
        ],
        subtotal: 349.98,
        tax: 29.75,
        total: 379.73,
        paymentMethod: 'Credit Card ****1234',
        transactionId: 'TXN-20240115-1045'
      },
      {
        // Receipt 2: Amazon Marketplace
        company: 'Amazon Marketplace',
        address: '410 Terry Avenue North',
        city: 'Seattle, WA 98109',
        phone: '(206) 266-1000',
        receiptNo: 'AMZ-2024-0204',
        date: '2024-02-04',
        time: '2:30 PM',
        items: [
          { name: 'Wireless Mouse', price: 29.99, details: ['Logitech M705', 'Black'] },
          { name: 'USB-C Hub', price: 15.00, details: ['7-in-1 Adapter', 'Aluminum'] }
        ],
        subtotal: 44.99,
        tax: 1.00,
        total: 45.99,
        paymentMethod: 'Prime Visa ****5678',
        transactionId: 'AMZ-20240204-1430'
      },
      {
        // Receipt 3: Starbucks Coffee
        company: 'Starbucks Coffee',
        address: '1912 Pike Place',
        city: 'Seattle, WA 98101',
        phone: '(206) 448-8762',
        receiptNo: 'SBX-2024-0107',
        date: '2024-01-07',
        time: '8:15 AM',
        items: [
          { name: 'Venti Caramel Macchiato', price: 5.45, details: ['Extra Shot', 'Almond Milk'] },
          { name: 'Butter Croissant', price: 0.00, details: ['Warmed'] }
        ],
        subtotal: 5.45,
        tax: 0.30,
        total: 5.75,
        paymentMethod: 'Starbucks Card ****9012',
        transactionId: 'SBX-20240107-0815'
      }
    ];
    
    const receipt = receipts[receiptVersion];
    
    // Header
    doc.setFontSize(24);
    doc.text('RECEIPT', 105, 20, { align: 'center' });

    // Company Info
    doc.setFontSize(14);
    doc.text(receipt.company, 105, 35, { align: 'center' });
    doc.setFontSize(10);
    doc.text(receipt.address, 105, 42, { align: 'center' });
    doc.text(receipt.city, 105, 48, { align: 'center' });
    doc.text(`Phone: ${receipt.phone}`, 105, 54, { align: 'center' });

    // Line separator
    doc.line(20, 60, 190, 60);

    // Receipt Details
    doc.setFontSize(10);
    doc.text(`Receipt #: ${receipt.receiptNo}`, 20, 70);
    doc.text(`Date: ${receipt.date}`, 20, 76);
    doc.text(`Time: ${receipt.time}`, 20, 82);

    // Line separator
    doc.line(20, 88, 190, 88);

    // Items header
    doc.setFontSize(12);
    doc.text('ITEMS PURCHASED:', 20, 98);

    // Items
    doc.setFontSize(10);
    let y = 108;
    
    receipt.items.forEach(item => {
      doc.text(item.name, 20, y);
      doc.text(`$${item.price.toFixed(2)}`, 170, y, { align: 'right' });
      y += 6;
      doc.setFontSize(9);
      item.details.forEach(detail => {
        doc.text(`  - ${detail}`, 20, y);
        y += 5;
      });
      y += 5;
    });

    // Line separator
    doc.line(20, y, 190, y);
    y += 10;

    // Totals
    doc.setFontSize(10);
    doc.text('Subtotal:', 120, y);
    doc.text(`$${receipt.subtotal.toFixed(2)}`, 170, y, { align: 'right' });
    y += 6;
    doc.text('Sales Tax:', 120, y);
    doc.text(`$${receipt.tax.toFixed(2)}`, 170, y, { align: 'right' });
    y += 8;
    
    doc.setFontSize(12);
    doc.text('Total:', 120, y);
    doc.text(`$${receipt.total.toFixed(2)}`, 170, y, { align: 'right' });
    y += 10;

    // Payment info
    doc.setFontSize(9);
    doc.text(`Payment Method: ${receipt.paymentMethod}`, 20, y);
    y += 5;
    doc.text(`Transaction ID: ${receipt.transactionId}`, 20, y);
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
    doc.text(`PDF Version: ${receiptVersion + 1} of 3`, 105, y, { align: 'center' });

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
    
    // Get receipt version for filename
    const receiptNames = ['tech-solutions', 'amazon', 'starbucks'];
    const currentVersion = (pdfCounter - 1) % 3; // -1 because we already incremented
    const fileName = `test-receipt-${receiptNames[currentVersion]}-${Date.now()}.pdf`;

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