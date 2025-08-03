import { DocumentProcessorServiceClient } from '@google-cloud/documentai';

// Types for Document AI response
interface DocumentEntity {
  type?: string;
  mentionText?: string;
  confidence?: number;
  normalizedValue?: {
    text?: string;
    moneyValue?: {
      units?: string;
      nanos?: number;
      currencyCode?: string;
    };
    dateValue?: {
      year?: number;
      month?: number;
      day?: number;
    };
  };
}

interface ParsedReceipt {
  amount?: number;
  currency?: string;
  date?: string;
  vendor?: string;
  items?: Array<{
    description: string;
    amount?: number;
    quantity?: number;
  }>;
  confidence: number;
  rawText?: string;
  rawEntities?: DocumentEntity[];
}

export class GoogleDocumentAIParser {
  private client: DocumentProcessorServiceClient;
  private processorName: string;

  constructor() {
    // Initialize the client
    this.client = new DocumentProcessorServiceClient({
      // If credentials are in env var, it will use them automatically
      // Otherwise, specify keyFilename
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });

    // Build processor name from env vars
    const projectId = process.env.GOOGLE_PROJECT_ID || 'transaction-reconciler';
    const location = process.env.GOOGLE_LOCATION || 'us';
    const processorId = process.env.GOOGLE_PROCESSOR_ID || 'a000db6421f1079b';
    
    this.processorName = `projects/${projectId}/locations/${location}/processors/${processorId}`;
    
    console.log('🤖 Document AI initialized with processor:', this.processorName);
  }

  async parseReceipt(pdfBuffer: Buffer): Promise<ParsedReceipt> {
    try {
      console.log('📄 Sending PDF to Google Document AI...');
      console.log('📊 PDF size:', pdfBuffer.length, 'bytes');

      // Prepare the request
      const request = {
        name: this.processorName,
        rawDocument: {
          content: pdfBuffer.toString('base64'),
          mimeType: 'application/pdf',
        },
      };

      // Process the document
      const [result] = await this.client.processDocument(request);
      const { document } = result;

      if (!document) {
        throw new Error('No document returned from Document AI');
      }

      console.log('✅ Document AI processing complete');
      console.log('📝 Extracted text length:', document.text?.length || 0);
      console.log('🔍 Found entities:', document.entities?.length || 0);

      // Extract structured data
      const entities = (document.entities || []) as DocumentEntity[];
      const parsedData = this.extractReceiptData(entities, document.text || '');

      // Log extracted data
      console.log('💰 === EXTRACTED RECEIPT DATA ===');
      console.log('Amount:', parsedData.amount, parsedData.currency);
      console.log('Date:', parsedData.date);
      console.log('Vendor:', parsedData.vendor);
      console.log('Items:', parsedData.items?.length || 0);
      console.log('Confidence:', parsedData.confidence);
      console.log('💰 === END RECEIPT DATA ===');

      return parsedData;

    } catch (error: any) {
      console.error('❌ Document AI error:', error.message);
      console.error('Full error:', error);
      
      throw new Error(`Document AI parsing failed: ${error.message}`);
    }
  }

  private extractReceiptData(entities: DocumentEntity[], rawText: string): ParsedReceipt {
    const result: ParsedReceipt = {
      confidence: 0,
      rawText,
      rawEntities: entities,
    };

    let totalConfidence = 0;
    let entityCount = 0;

    // Log all entities for debugging
    console.log('🔍 === ALL ENTITIES ===');
    entities.forEach((entity, index) => {
      console.log(`Entity ${index}:`, {
        type: entity.type,
        text: entity.mentionText,
        confidence: entity.confidence,
        normalizedValue: entity.normalizedValue,
      });
    });
    console.log('🔍 === END ENTITIES ===');

    // Extract total amount
    const amountEntity = entities.find(e => 
      e.type === 'total_amount' || 
      e.type === 'total_price' ||
      e.type === 'net_amount' ||
      e.type === 'grand_total'
    );

    if (amountEntity?.normalizedValue?.moneyValue) {
      const money = amountEntity.normalizedValue.moneyValue;
      result.amount = Number(money.units || 0) + (money.nanos || 0) / 1000000000;
      result.currency = money.currencyCode || 'USD';
      totalConfidence += amountEntity.confidence || 0;
      entityCount++;
    } else if (amountEntity?.mentionText) {
      // Fallback: parse amount from text
      const amountMatch = amountEntity.mentionText.match(/[\d,]+\.?\d*/);
      if (amountMatch) {
        result.amount = parseFloat(amountMatch[0].replace(/,/g, ''));
      }
    }

    // Extract date
    const dateEntity = entities.find(e => 
      e.type === 'receipt_date' || 
      e.type === 'invoice_date' ||
      e.type === 'purchase_date' ||
      e.type === 'transaction_date'
    );

    if (dateEntity?.normalizedValue?.dateValue) {
      const date = dateEntity.normalizedValue.dateValue;
      result.date = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
      totalConfidence += dateEntity.confidence || 0;
      entityCount++;
    } else if (dateEntity?.mentionText) {
      // Fallback: use mention text
      result.date = this.parseDate(dateEntity.mentionText);
    }

    // Extract vendor/supplier
    const vendorEntity = entities.find(e => 
      e.type === 'supplier_name' || 
      e.type === 'vendor' ||
      e.type === 'merchant_name' ||
      e.type === 'receiver'
    );

    if (vendorEntity) {
      result.vendor = vendorEntity.mentionText || '';
      totalConfidence += vendorEntity.confidence || 0;
      entityCount++;
    }

    // Extract line items
    const lineItems = entities.filter(e => e.type === 'line_item');
    if (lineItems.length > 0) {
      result.items = lineItems.map(item => ({
        description: item.mentionText || '',
        amount: this.extractAmountFromText(item.mentionText || ''),
      }));
    }

    // Calculate average confidence
    result.confidence = entityCount > 0 ? totalConfidence / entityCount : 0.5;

    // If no structured data found, try to extract from raw text
    if (!result.amount || !result.vendor) {
      console.log('⚠️ Missing structured data, attempting text extraction...');
      this.extractFromRawText(result, rawText);
    }

    return result;
  }

  private extractFromRawText(result: ParsedReceipt, text: string): void {
    // Extract amount if not found
    if (!result.amount) {
      const amountMatch = text.match(/(?:total|amount|paid).*?([0-9,]+\.?\d*)/i);
      if (amountMatch) {
        result.amount = parseFloat(amountMatch[1].replace(/,/g, ''));
      }
    }

    // Extract vendor if not found
    if (!result.vendor) {
      // Look for common patterns in first few lines
      const lines = text.split('\n').filter(l => l.trim());
      for (const line of lines.slice(0, 5)) {
        if (line.length > 2 && line.length < 50 && !line.match(/^\d/)) {
          result.vendor = line.trim();
          break;
        }
      }
    }

    // Extract date if not found
    if (!result.date) {
      const dateMatch = text.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/);
      if (dateMatch) {
        result.date = this.parseDate(dateMatch[1]);
      }
    }
  }

  private extractAmountFromText(text: string): number | undefined {
    const match = text.match(/[\d,]+\.?\d*/);
    return match ? parseFloat(match[0].replace(/,/g, '')) : undefined;
  }

  private parseDate(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    } catch {}
    return dateStr;
  }
}

// Singleton instance
let parserInstance: GoogleDocumentAIParser | null = null;

export function getGoogleDocumentAIParser(): GoogleDocumentAIParser {
  if (!parserInstance) {
    parserInstance = new GoogleDocumentAIParser();
  }
  return parserInstance;
}