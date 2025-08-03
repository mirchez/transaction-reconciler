import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

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
 * Simple PDF text extraction using system's pdftotext command
 */
export async function parsePDF(buffer: Buffer): Promise<PDFParseResult> {
  let tempFilePath: string | null = null;
  
  try {
    console.log('📄 Starting simple PDF parsing...');
    console.log(`📊 PDF size: ${buffer.length} bytes`);
    
    // Create temporary file
    const tempDir = os.tmpdir();
    const tempFileName = `pdf_${Date.now()}_${Math.random().toString(36).substring(7)}.pdf`;
    tempFilePath = path.join(tempDir, tempFileName);
    
    // Write buffer to temporary file
    await fs.promises.writeFile(tempFilePath, buffer);
    console.log('✅ Temp file written:', tempFilePath);
    
    // Try to extract text using pdftotext command (if available)
    try {
      console.log('🔍 Attempting to extract text with pdftotext...');
      const { stdout, stderr } = await execAsync(`pdftotext -layout "${tempFilePath}" -`, {
        encoding: 'utf8',
        maxBuffer: 10 * 1024 * 1024 // 10MB buffer
      });
      
      if (stderr) {
        console.warn('⚠️ pdftotext warnings:', stderr);
      }
      
      if (stdout && stdout.trim().length > 0) {
        console.log('✅ Text extracted successfully');
        console.log(`📝 Extracted ${stdout.length} characters`);
        
        return {
          text: stdout,
          numpages: 1, // Simple parser doesn't count pages
          metadata: undefined
        };
      }
    } catch (error: any) {
      console.log('⚠️ pdftotext not available or failed:', error.message);
    }
    
    // Fallback: Return a basic structure that indicates it's a PDF
    console.log('📄 Using fallback - treating as binary PDF');
    
    // Try to extract basic info from PDF structure
    const pdfString = buffer.toString('latin1');
    const text = extractBasicPDFInfo(pdfString);
    
    return {
      text: text || 'PDF Document - Unable to extract text. This may be an image-based or encrypted PDF.',
      numpages: 1,
      metadata: undefined
    };
    
  } catch (error) {
    console.error('❌ PDF parsing error:', error);
    
    return {
      text: 'Failed to parse PDF document.',
      numpages: 0,
      metadata: undefined
    };
    
  } finally {
    // Clean up temporary file
    if (tempFilePath) {
      try {
        await fs.promises.unlink(tempFilePath);
        console.log('🧹 Cleaned up temporary file');
      } catch (cleanupError) {
        console.warn('⚠️ Failed to clean up temporary file:', cleanupError);
      }
    }
  }
}

/**
 * Extract basic information from PDF binary structure
 */
function extractBasicPDFInfo(pdfString: string): string {
  const info: string[] = [];
  
  // Look for common PDF metadata patterns
  const patterns = {
    title: /\/Title\s*\((.*?)\)/,
    author: /\/Author\s*\((.*?)\)/,
    subject: /\/Subject\s*\((.*?)\)/,
    creator: /\/Creator\s*\((.*?)\)/,
    producer: /\/Producer\s*\((.*?)\)/,
  };
  
  for (const [key, pattern] of Object.entries(patterns)) {
    const match = pdfString.match(pattern);
    if (match && match[1]) {
      info.push(`${key}: ${cleanPDFString(match[1])}`);
    }
  }
  
  // Try to find any readable text between BT and ET markers
  const textMatches = pdfString.match(/BT\s*(.*?)\s*ET/gs) || [];
  const extractedTexts: string[] = [];
  
  for (const match of textMatches.slice(0, 5)) { // Limit to first 5 text blocks
    const cleaned = cleanPDFString(match);
    if (cleaned.length > 10) {
      extractedTexts.push(cleaned);
    }
  }
  
  if (info.length > 0 || extractedTexts.length > 0) {
    return [...info, '', ...extractedTexts].join('\n');
  }
  
  return '';
}

/**
 * Clean PDF string removing escape sequences
 */
function cleanPDFString(str: string): string {
  return str
    .replace(/\\(\d{3})/g, (m, oct) => String.fromCharCode(parseInt(oct, 8)))
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .replace(/\\\\/g, '\\')
    .replace(/[^\x20-\x7E\n\r\t]/g, '') // Remove non-printable characters
    .trim();
}

/**
 * Alternative parsing method for specific PDF types
 */
export async function parsePDFWithOCR(buffer: Buffer): Promise<PDFParseResult> {
  console.log('🔄 OCR parsing not implemented yet, falling back to standard parsing');
  return parsePDF(buffer);
}

/**
 * Check if pdftotext is available on the system
 */
export async function checkPDFToolsAvailable(): Promise<boolean> {
  try {
    await execAsync('pdftotext -v');
    return true;
  } catch {
    return false;
  }
}