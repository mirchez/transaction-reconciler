import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { generateTestReceiptPDF } from '@/libs/test-receipt-generator';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    // Get the authenticated user's Google credentials
    const googleAuth = await prisma.googleAuth.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    if (!googleAuth || !googleAuth.accessToken) {
      return NextResponse.json(
        { error: 'Please connect your Gmail account first.' },
        { status: 401 }
      );
    }

    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      access_token: googleAuth.accessToken,
      refresh_token: googleAuth.refreshToken,
    });

    // Create Gmail API instance
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Generate PDF
    const pdfBuffer = generateTestReceiptPDF();
    const pdfBase64 = Buffer.from(pdfBuffer).toString('base64');

    // Create email content
    const emailContent = [
      'MIME-Version: 1.0',
      `To: ${googleAuth.email}`,
      `From: ${googleAuth.email}`,
      'Subject: Test Receipt - Tech Solutions Inc.',
      'Content-Type: multipart/mixed; boundary="boundary"',
      '',
      '--boundary',
      'Content-Type: text/html; charset=UTF-8',
      'Content-Transfer-Encoding: 7bit',
      '',
      `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Test Receipt Attached</h2>
        <p style="color: #666;">This is a test email from the Transaction Reconciler system.</p>
        <p style="color: #666;">Please find attached a sample receipt PDF.</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">
          This is an automated test email. If you received this in error, please ignore it.
        </p>
      </div>`,
      '',
      '--boundary',
      'Content-Type: application/pdf; name="test-receipt.pdf"',
      'Content-Disposition: attachment; filename="test-receipt.pdf"',
      'Content-Transfer-Encoding: base64',
      '',
      pdfBase64,
      '',
      '--boundary--'
    ].join('\n');

    // Convert to base64
    const encodedMessage = Buffer.from(emailContent).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    // Send email
    const result = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      messageId: result.data.id,
      recipient: googleAuth.email
    });

  } catch (error: any) {
    console.error('Error sending test email:', error);
    
    // Check if it's a token expiration error
    if (error.code === 401) {
      return NextResponse.json(
        { error: 'Gmail authentication expired. Please reconnect your Gmail account.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to send test email', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}