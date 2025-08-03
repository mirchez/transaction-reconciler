// Workaround for pdf-parse v1.1.1 bug where it tries to load test file in debug mode
let pdf: any;
try {
  pdf = require('pdf-parse/lib/pdf-parse.js');
} catch (error) {
  pdf = require('pdf-parse');
}

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
  };
}

/**
 * Parse PDF using only pdf-parse (no Document AI - no billing required)
 */
export async function parsePDF(buffer: Buffer): Promise<PDFParseResult> {
  console.log('📄 Starting PDF parsing with pdf-parse...');
  console.log(`📊 PDF size: ${buffer.length} bytes`);
  
  try {
    // Parse PDF with pdf-parse
    const data = await pdf(buffer);
    
    console.log('✅ PDF parsed successfully');
    console.log(`📝 === EXTRACTED TEXT ===`);
    console.log(`Length: ${data.text.length} characters`);
    console.log(`Pages: ${data.numpages}`);
    console.log(`Preview (first 500 chars): ${data.text.substring(0, 500)}`);
    console.log(`📝 === END EXTRACTED TEXT ===`);
    
    // Extract metadata if available
    const metadata: any = {};
    if (data.info) {
      if (data.info.Title) metadata.title = data.info.Title;
      if (data.info.Subject) metadata.subject = data.info.Subject;
      if (data.info.Author) metadata.author = data.info.Author;
      if (data.info.Creator) metadata.creator = data.info.Creator;
      if (data.info.Producer) metadata.producer = data.info.Producer;
      if (data.info.CreationDate) metadata.creationDate = data.info.CreationDate;
      if (data.info.ModDate) metadata.modDate = data.info.ModDate;
    }
    
    // If no text found, create placeholder
    let text = data.text;
    if (!text || text.trim().length === 0) {
      console.log('⚠️ No text content extracted from PDF');
      text = 'PDF Document - No text content extracted. This may be an image-based or encrypted PDF.';
    }
    
    return {
      text,
      numpages: data.numpages || 1,
      metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
    };
    
  } catch (error) {
    console.error('❌ PDF parsing error:', error);
    
    return {
      text: 'Failed to extract text from PDF. The file may be corrupted, encrypted, or in an unsupported format.',
      numpages: 0,
      metadata: undefined,
    };
  }
}

export async function parsePDFWithOCR(buffer: Buffer): Promise<PDFParseResult> {
  console.log('🔄 OCR parsing not implemented yet, falling back to standard parsing');
  return parsePDF(buffer);
}

export async function checkPDFValidity(buffer: Buffer): Promise<boolean> {
  try {
    const header = buffer.toString('ascii', 0, 5);
    return header === '%PDF-';
  } catch {
    return false;
  }
}