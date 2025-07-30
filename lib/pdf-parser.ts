import { PDFDocument } from 'pdf-lib';

// Use pdf-lib and custom text extraction to parse PDFs
export async function parsePDF(buffer: Buffer): Promise<{ text: string; numpages: number }> {
  try {
    // Load the PDF document
    const pdfDoc = await PDFDocument.load(buffer);
    const pages = pdfDoc.getPages();
    
    // Extract text from the buffer
    const fullText = await extractTextFromBuffer(buffer);
    
    return {
      text: fullText || 'No text content found',
      numpages: pages.length
    };
  } catch (error) {
    console.error('PDF parsing error:', error);
    
    // Fallback: try basic text extraction
    try {
      const fallbackText = await extractTextFromBuffer(buffer);
      return {
        text: fallbackText || '',
        numpages: 1
      };
    } catch (fallbackError) {
      console.error('Fallback parsing also failed:', fallbackError);
      return {
        text: '',
        numpages: 0
      };
    }
  }
}

// Extract text from PDF buffer
async function extractTextFromBuffer(buffer: Buffer): Promise<string> {
  const str = buffer.toString('latin1');
  
  // Look for text between BT and ET markers (PDF text objects)
  const textMatches = str.match(/BT\s*(.*?)\s*ET/gs) || [];
  
  let extractedText = '';
  for (const match of textMatches) {
    // Extract text from PDF commands - look for Tj and TJ operators
    const tjMatches = match.match(/\(((?:[^()\\]|\\.)*)\)\s*Tj/g) || [];
    const tjArrayMatches = match.match(/\[(.*?)\]\s*TJ/g) || [];
    
    // Process Tj commands
    for (const tjMatch of tjMatches) {
      const text = tjMatch.match(/\(((?:[^()\\]|\\.)*)\)/)?.[1] || '';
      extractedText += decodeText(text) + ' ';
    }
    
    // Process TJ commands (text arrays)
    for (const tjArrayMatch of tjArrayMatches) {
      const arrayContent = tjArrayMatch.match(/\[(.*?)\]/)?.[1] || '';
      const textParts = arrayContent.match(/\(((?:[^()\\]|\\.)*)\)/g) || [];
      for (const part of textParts) {
        const text = part.slice(1, -1);
        extractedText += decodeText(text);
      }
      extractedText += ' ';
    }
  }
  
  // Clean up extracted text
  extractedText = extractedText
    .replace(/\s+/g, ' ')
    .trim();
  
  return extractedText;
}

// Decode PDF text strings
function decodeText(text: string): string {
  return text
    .replace(/\\(\d{3})/g, (m, oct) => String.fromCharCode(parseInt(oct, 8)))
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\b/g, '\b')
    .replace(/\\f/g, '\f')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .replace(/\\\\/g, '\\');
}