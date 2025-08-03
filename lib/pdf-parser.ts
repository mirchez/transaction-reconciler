// Workaround for pdf-parse v1.1.1 bug where it tries to load test file in debug mode
// The bug occurs because of isDebugMode = !module.parent check in pdf-parse/index.js
let pdf: any;
try {
  // Import the actual pdf parsing function directly to avoid debug mode
  pdf = require('pdf-parse/lib/pdf-parse.js');
} catch (error) {
  // Fallback to default import if direct import fails
  pdf = require('pdf-parse');
}
import { getGoogleDocumentAIParser } from './google-document-ai-parser';

// Interface for PDF parsing result
interface PDFParseResult {
  text: string;
  numpages: number;
  metadata?: {
    title?: string;
    subject?: string;
    author?: string;
    creator?: string;
    producer?: string;
    creationDate?: string;
    modDate?: string;
    // Additional fields from Document AI
    vendor?: string;
    amount?: number;
    currency?: string;
    date?: string;
  };
}

/**
 * Parse PDF using Google Document AI with pdf-parse as fallback
 */
export async function parsePDF(buffer: Buffer): Promise<PDFParseResult> {
  console.log('📄 Starting PDF parsing...');
  console.log(`📊 PDF size: ${buffer.length} bytes`);
  
  // Check if Google Document AI is configured AND billing is enabled
  const hasDocumentAI = process.env.GOOGLE_PROJECT_ID && 
                       process.env.GOOGLE_PROCESSOR_ID && 
                       process.env.GOOGLE_APPLICATION_CREDENTIALS &&
                       process.env.ENABLE_DOCUMENT_AI === 'true';
  
  if (hasDocumentAI) {
    try {
      console.log('🤖 Using Google Document AI for parsing...');
      const documentAIParser = getGoogleDocumentAIParser();
      const result = await documentAIParser.parseReceipt(buffer);
      
      // Convert Document AI result to our format
      let text = result.rawText || '';
      
      // If no raw text but we have structured data, create a summary
      if (!text && (result.vendor || result.amount)) {
        const parts = [];
        if (result.vendor) parts.push(`Vendor: ${result.vendor}`);
        if (result.amount) parts.push(`Amount: ${result.currency || '$'}${result.amount}`);
        if (result.date) parts.push(`Date: ${result.date}`);
        if (result.items && result.items.length > 0) {
          parts.push(`Items: ${result.items.length}`);
          result.items.forEach(item => {
            parts.push(`  - ${item.description}${item.amount ? ` ($${item.amount})` : ''}`);
          });
        }
        text = parts.join('\n');
      }
      
      console.log('✅ Document AI parsing successful');
      
      return {
        text: text || 'Receipt parsed successfully',
        numpages: 1, // Document AI doesn't return page count
        metadata: {
          vendor: result.vendor,
          amount: result.amount,
          currency: result.currency,
          date: result.date,
          producer: 'Google Document AI',
        }
      };
      
    } catch (error) {
      console.error('⚠️ Document AI parsing failed, falling back to pdf-parse:', error);
      // Fall through to pdf-parse
    }
  } else {
    console.log('ℹ️ Google Document AI not configured, using pdf-parse');
  }
  
  // Fallback to pdf-parse
  return parsePDFWithPdfParse(buffer);
}

/**
 * Parse PDF using pdf-parse library
 */
async function parsePDFWithPdfParse(buffer: Buffer): Promise<PDFParseResult> {
  try {
    console.log('📄 Parsing with pdf-parse...');
    
    // Parse PDF with pdf-parse
    const data = await pdf(buffer);
    
    console.log('✅ PDF parsed successfully with pdf-parse');
    console.log(`📝 === EXTRACTED TEXT ===`);
    console.log(`Length: ${data.text.length} characters`);
    console.log(`Pages: ${data.numpages}`);
    console.log(`PDF Version: ${data.version}`);
    console.log(`Preview (first 500 chars): ${data.text.substring(0, 500)}`);
    console.log(`📝 === END EXTRACTED TEXT ===`);
    
    // Extract metadata if available
    const metadata: any = {};
    if (data.info) {
      console.log('📋 === PDF METADATA ===');
      console.log('Raw info:', data.info);
      
      if (data.info.Title) metadata.title = data.info.Title;
      if (data.info.Subject) metadata.subject = data.info.Subject;
      if (data.info.Author) metadata.author = data.info.Author;
      if (data.info.Creator) metadata.creator = data.info.Creator;
      if (data.info.Producer) metadata.producer = data.info.Producer;
      if (data.info.CreationDate) metadata.creationDate = data.info.CreationDate;
      if (data.info.ModDate) metadata.modDate = data.info.ModDate;
      
      console.log('Processed metadata:', metadata);
      console.log('📋 === END METADATA ===');
    }
    
    // If no text found, create placeholder
    let text = data.text;
    if (!text || text.trim().length === 0) {
      console.log('⚠️ No text content extracted from PDF');
      
      const placeholderParts = ['PDF Document - No text content extracted'];
      
      if (metadata.title) {
        placeholderParts.push(`Title: ${metadata.title}`);
      }
      if (metadata.author) {
        placeholderParts.push(`Author: ${metadata.author}`);
      }
      if (metadata.creationDate) {
        placeholderParts.push(`Date: ${metadata.creationDate}`);
      }
      
      placeholderParts.push('This may be an image-based or encrypted PDF.');
      
      text = placeholderParts.join('\n');
    }
    
    return {
      text,
      numpages: data.numpages || 1,
      metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
    };
    
  } catch (error) {
    console.error('❌ PDF parsing error:', error);
    
    // If pdf-parse fails, try basic extraction
    return fallbackParsing(buffer);
  }
}

/**
 * Fallback parsing for when all methods fail
 */
function fallbackParsing(buffer: Buffer): PDFParseResult {
  console.log('🔄 Attempting fallback parsing...');
  
  try {
    // Convert buffer to string to search for basic info
    const pdfString = buffer.toString('latin1');
    
    // Look for basic text patterns
    const textMatches = pdfString.match(/BT\s*(.*?)\s*ET/gs) || [];
    let text = '';
    
    for (const match of textMatches.slice(0, 10)) { // Limit to first 10 blocks
      const cleaned = match
        .replace(/BT|ET/g, '')
        .replace(/\\/g, '')
        .replace(/[^\x20-\x7E\n]/g, ' ')
        .trim();
      
      if (cleaned.length > 10) {
        text += cleaned + '\n';
      }
    }
    
    if (text.length > 0) {
      console.log('✅ Fallback extracted some text');
      return {
        text: text.substring(0, 1000), // Limit fallback text
        numpages: 1,
        metadata: undefined
      };
    }
  } catch (e) {
    console.error('❌ Fallback parsing also failed:', e);
  }
  
  return {
    text: 'Failed to extract text from PDF. The file may be corrupted, encrypted, or in an unsupported format.',
    numpages: 0,
    metadata: undefined,
  };
}

/**
 * Alternative parsing method for specific PDF types
 */
export async function parsePDFWithOCR(buffer: Buffer): Promise<PDFParseResult> {
  console.log('🔄 OCR parsing not implemented yet, falling back to standard parsing');
  return parsePDF(buffer);
}

/**
 * Utility function to check PDF validity
 */
export async function checkPDFValidity(buffer: Buffer): Promise<boolean> {
  try {
    const header = buffer.toString('ascii', 0, 5);
    return header === '%PDF-';
  } catch {
    return false;
  }
}