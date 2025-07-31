import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parsePDF } from "@/lib/pdf-parser";
import { extractLedgerDataWithOpenAI } from "@/lib/openai-service";
import { Decimal } from "@prisma/client/runtime/library";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const userEmail = formData.get("email") as string;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!userEmail) {
      return NextResponse.json(
        { error: "No email provided" },
        { status: 400 }
      );
    }

    // Ensure user exists
    await prisma.user.upsert({
      where: { email: userEmail },
      update: {},
      create: { email: userEmail },
    });

    // Parse PDF
    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfData = await parsePDF(buffer);
    const pdfText = pdfData.text;

    if (!pdfText || pdfText.trim().length === 0) {
      return NextResponse.json(
        { error: "Could not extract text from PDF" },
        { status: 400 }
      );
    }

    // Log PDF text extraction
    console.log(`📄 Processing PDF: ${file.name}`);
    console.log(`📏 Text length: ${pdfText.length} characters`);
    
    // Extract ledger data using AI
    const extractedData = await extractLedgerDataWithOpenAI(pdfText);

    if (!extractedData.isLedgerEntry) {
      console.log("❌ Document is not a ledger entry:", file.name);
      console.log("   Extracted data:", {
        hasAmount: extractedData.debit || extractedData.credit,
        vendor: extractedData.name,
        confidence: extractedData.confidence
      });
      
      // Provide more specific feedback
      let message = "Could not extract required financial data";
      if (!extractedData.debit && !extractedData.credit) {
        message = "No amount found in the document";
      } else if (!extractedData.name) {
        message = "No vendor/merchant name found in the document";
      }
      
      return NextResponse.json(
        { 
          error: "Missing required financial data",
          message: message,
          details: "Document must contain at least an amount and vendor name",
          missingData: {
            amount: !extractedData.debit && !extractedData.credit,
            vendor: !extractedData.name
          },
          isReceipt: false,
          confidence: extractedData.confidence
        },
        { status: 400 }
      );
    }

    // Validate minimum required data for a ledger entry
    const hasAmount = extractedData.debit || extractedData.credit;
    const hasVendor = extractedData.name;
    const hasDate = extractedData.date;
    
    if (!hasAmount || !hasVendor) {
      console.log("❌ Receipt missing required data:", {
        hasAmount,
        hasVendor,
        hasDate,
        data: extractedData
      });
      return NextResponse.json(
        { 
          error: "Receipt is missing required information",
          message: "The receipt must have at least an amount and vendor name",
          missingFields: {
            amount: !hasAmount,
            vendor: !hasVendor,
            date: !hasDate
          },
          isReceipt: true,
          isValid: false
        },
        { status: 400 }
      );
    }

    // Check if we're being called from email check (has X-Email-ID header)
    const emailId = request.headers.get("X-Email-ID");
    if (!userEmail && emailId) {
      // This is from email check, we need to extract email from somewhere
      // For now, we'll require email to be passed
      return NextResponse.json(
        { error: "Email is required for processing" },
        { status: 400 }
      );
    }

    // Log successful extraction
    console.log("✅ Successfully extracted ledger data:");
    console.log(`   Type: ${extractedData.type}`);
    console.log(`   Vendor: ${extractedData.name}`);
    console.log(`   Amount: $${extractedData.debit || extractedData.credit}`);
    console.log(`   Date: ${extractedData.date}`);
    console.log(`   Category: ${extractedData.account}`);
    console.log(`   Confidence: ${extractedData.confidence}`);

    // Create ledger entry
    const ledgerEntry = await prisma.ledger.create({
      data: {
        userEmail,
        date: extractedData.date ? new Date(extractedData.date) : new Date(),
        type: extractedData.type || "Receipt",
        num: extractedData.num,
        name: extractedData.name,
        description: extractedData.description || `${extractedData.type || "Receipt"} from ${extractedData.name || "Unknown"}`,
        account: extractedData.account,
        split: extractedData.split,
        debit: extractedData.debit ? new Decimal(extractedData.debit) : null,
        credit: extractedData.credit ? new Decimal(extractedData.credit) : null,
        balance: extractedData.balance ? new Decimal(extractedData.balance) : null,
      },
    });
    
    console.log(`💾 Saved to database with ID: ${ledgerEntry.id}`);

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${extractedData.type || "receipt"}`,
      entry: {
        id: ledgerEntry.id,
        date: ledgerEntry.date.toISOString(),
        type: ledgerEntry.type,
        vendor: ledgerEntry.name,
        description: ledgerEntry.description,
        amount: ledgerEntry.debit || ledgerEntry.credit || 0,
        account: ledgerEntry.account,
        confidence: extractedData.confidence,
      },
    });
  } catch (error) {
    console.error("PDF upload error:", error);
    return NextResponse.json(
      { 
        error: "Failed to process PDF", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}