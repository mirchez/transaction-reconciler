import { parseReceiptV2, type ReceiptExtraction } from './receipt-parser-v2';
import { extractLedgerDataEnhanced, type EnhancedLedgerExtraction } from './openai-service-enhanced';

export interface ParsingResult {
  success: boolean;
  data?: {
    amount: number;
    date: string;
    description: string;
    vendor?: string;
    invoiceNumber?: string;
    currency?: string;
    documentType?: string;
  };
  confidence: number;
  method: string;
  attempts: number;
  errors: string[];
  rawExtractions?: {
    amounts: number[];
    dates: string[];
    vendors: string[];
  };
}

export interface ParsingOptions {
  filename?: string;
  useAI?: boolean;
  maxRetries?: number;
  acceptPartialData?: boolean;
  documentHints?: string[];
}

/**
 * Robust receipt parsing strategy that tries multiple approaches
 */
export class ReceiptParsingStrategy {
  private options: Required<ParsingOptions>;
  
  constructor(options: ParsingOptions = {}) {
    this.options = {
      filename: options.filename || '',
      useAI: options.useAI ?? true,
      maxRetries: options.maxRetries ?? 3,
      acceptPartialData: options.acceptPartialData ?? false,
      documentHints: options.documentHints || [],
    };
  }

  async parse(pdfText: string): Promise<ParsingResult> {
    const errors: string[] = [];
    let attempts = 0;
    
    console.log('🚀 Starting multi-strategy receipt parsing');
    
    // Strategy 1: Try enhanced AI parsing if enabled
    if (this.options.useAI && process.env.OPENAI_API_KEY) {
      attempts++;
      try {
        const aiResult = await this.tryAIParsing(pdfText);
        if (aiResult.success) {
          return aiResult;
        }
        errors.push(...aiResult.errors);
      } catch (error) {
        errors.push(`AI parsing error: ${error}`);
      }
    }

    // Strategy 2: Try pattern-based parsing
    attempts++;
    try {
      const patternResult = await this.tryPatternParsing(pdfText);
      if (patternResult.success) {
        return patternResult;
      }
      errors.push(...patternResult.errors);
    } catch (error) {
      errors.push(`Pattern parsing error: ${error}`);
    }

    // Strategy 3: Try contextual parsing with hints
    if (this.options.documentHints.length > 0 || this.options.filename) {
      attempts++;
      try {
        const contextResult = await this.tryContextualParsing(pdfText);
        if (contextResult.success) {
          return contextResult;
        }
        errors.push(...contextResult.errors);
      } catch (error) {
        errors.push(`Contextual parsing error: ${error}`);
      }
    }

    // Strategy 4: Aggressive extraction - find ANY financial data
    attempts++;
    const aggressiveResult = await this.tryAggressiveExtraction(pdfText);
    
    // Return the best result we have
    if (aggressiveResult.success || this.options.acceptPartialData) {
      return aggressiveResult;
    }

    return {
      success: false,
      confidence: 0,
      method: 'none',
      attempts,
      errors: [...errors, 'All parsing strategies failed'],
    };
  }

  private async tryAIParsing(pdfText: string): Promise<ParsingResult> {
    console.log('📤 Attempting AI parsing with GPT-4');
    
    const result = await extractLedgerDataEnhanced(pdfText, {
      filename: this.options.filename,
      documentHints: this.options.documentHints,
    });

    if (result.isLedgerEntry && result.amount && result.description) {
      return {
        success: true,
        data: {
          amount: result.amount,
          date: result.date || new Date().toISOString().split('T')[0],
          description: result.description,
          vendor: result.metadata?.vendor,
          invoiceNumber: result.metadata?.invoiceNumber,
          currency: result.metadata?.currency || 'USD',
          documentType: result.metadata?.documentType,
        },
        confidence: result.confidence,
        method: 'ai-gpt4',
        attempts: 1,
        errors: [],
      };
    }

    return {
      success: false,
      confidence: result.confidence,
      method: 'ai-gpt4',
      attempts: 1,
      errors: ['AI could not extract required fields'],
    };
  }

  private async tryPatternParsing(pdfText: string): Promise<ParsingResult> {
    console.log('🔍 Attempting pattern-based parsing');
    
    const result = await parseReceiptV2(pdfText, this.options.filename);
    
    if (result.isFinancialDocument && 
        result.extractedData.amount && 
        result.extractedData.vendor) {
      return {
        success: true,
        data: {
          amount: result.extractedData.amount,
          date: result.extractedData.date || new Date().toISOString().split('T')[0],
          description: result.extractedData.description || result.extractedData.vendor,
          vendor: result.extractedData.vendor,
          invoiceNumber: result.extractedData.invoiceNumber,
          currency: result.extractedData.currency || 'USD',
        },
        confidence: result.metadata.confidence,
        method: 'pattern',
        attempts: 1,
        errors: [],
        rawExtractions: result.rawExtraction,
      };
    }

    return {
      success: false,
      confidence: result.metadata.confidence,
      method: 'pattern',
      attempts: 1,
      errors: ['Pattern matching could not extract required fields'],
      rawExtractions: result.rawExtraction,
    };
  }

  private async tryContextualParsing(pdfText: string): Promise<ParsingResult> {
    console.log('🎯 Attempting contextual parsing with hints');
    
    // Use filename and hints to guide extraction
    const enhancedText = this.enhanceTextWithContext(pdfText);
    
    // Try pattern parsing with enhanced text
    return this.tryPatternParsing(enhancedText);
  }

  private async tryAggressiveExtraction(pdfText: string): Promise<ParsingResult> {
    console.log('💪 Attempting aggressive extraction');
    
    const amounts = this.extractAllAmounts(pdfText);
    const dates = this.extractAllDates(pdfText);
    const vendors = this.extractPossibleVendors(pdfText);
    
    // If we have at least an amount, consider it partial success
    if (amounts.length > 0) {
      const amount = Math.max(...amounts); // Use largest amount as total
      const date = dates[0] || new Date().toISOString().split('T')[0];
      const vendor = vendors[0] || 'Unknown Vendor';
      
      return {
        success: this.options.acceptPartialData || (amounts.length > 0 && vendors.length > 0),
        data: {
          amount,
          date,
          description: vendor,
          vendor,
          currency: 'USD',
        },
        confidence: vendors.length > 0 ? 0.5 : 0.3,
        method: 'aggressive',
        attempts: 1,
        errors: [],
        rawExtractions: {
          amounts,
          dates,
          vendors,
        },
      };
    }

    return {
      success: false,
      confidence: 0.1,
      method: 'aggressive',
      attempts: 1,
      errors: ['No financial data found'],
      rawExtractions: {
        amounts,
        dates,
        vendors,
      },
    };
  }

  private enhanceTextWithContext(text: string): string {
    let enhanced = text;
    
    // Add filename context
    if (this.options.filename) {
      enhanced = `Document: ${this.options.filename}\n\n${enhanced}`;
    }
    
    // Add document type hints
    if (this.options.documentHints.length > 0) {
      enhanced = `Type hints: ${this.options.documentHints.join(', ')}\n\n${enhanced}`;
    }
    
    return enhanced;
  }

  private extractAllAmounts(text: string): number[] {
    const amounts: number[] = [];
    const patterns = [
      /amount[^$\d]*([\d,]+\.?\d*)/gi,
      /total[^$\d]*([\d,]+\.?\d*)/gi,
      /\$\s*([\d,]+\.?\d*)/g,
      /([\d,]+\.\d{2})(?=\s|$)/g,
    ];

    for (const pattern of patterns) {
      const matches = [...text.matchAll(pattern)];
      for (const match of matches) {
        const amount = parseFloat(match[1].replace(/,/g, ''));
        if (!isNaN(amount) && amount > 0 && amount < 1000000) { // Sanity check
          amounts.push(amount);
        }
      }
    }

    // Remove duplicates and sort
    return [...new Set(amounts)].sort((a, b) => b - a);
  }

  private extractAllDates(text: string): string[] {
    const dates: string[] = [];
    const patterns = [
      /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/g,
      /(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/g,
      /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4})/gi,
    ];

    for (const pattern of patterns) {
      const matches = [...text.matchAll(pattern)];
      for (const match of matches) {
        try {
          const date = new Date(match[1]);
          if (!isNaN(date.getTime()) && date.getFullYear() > 2000 && date.getFullYear() < 2030) {
            dates.push(date.toISOString().split('T')[0]);
          }
        } catch {}
      }
    }

    return [...new Set(dates)];
  }

  private extractPossibleVendors(text: string): string[] {
    const vendors: string[] = [];
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    // Check first few lines for vendor name
    for (let i = 0; i < Math.min(10, lines.length); i++) {
      const line = lines[i];
      if (this.looksLikeVendorName(line)) {
        vendors.push(this.cleanVendorName(line));
      }
    }

    // Look for explicit vendor patterns
    const patterns = [
      /(?:from|merchant|vendor|sold by|billed to|company)[\s:]+([^\n]+)/gi,
      /^([A-Z][A-Za-z\s&,.'()-]+)$/gm,
    ];

    for (const pattern of patterns) {
      const matches = [...text.matchAll(pattern)];
      for (const match of matches) {
        if (match[1] && this.looksLikeVendorName(match[1])) {
          vendors.push(this.cleanVendorName(match[1]));
        }
      }
    }

    // Use filename as last resort
    if (vendors.length === 0 && this.options.filename) {
      const nameMatch = this.options.filename.match(/([A-Za-z]+)/);
      if (nameMatch) {
        vendors.push(nameMatch[1]);
      }
    }

    return [...new Set(vendors)].slice(0, 5); // Return top 5 unique vendors
  }

  private looksLikeVendorName(text: string): boolean {
    const cleaned = text.trim();
    return (
      cleaned.length > 2 &&
      cleaned.length < 50 &&
      !cleaned.match(/^\d/) &&
      !cleaned.match(/^(date|receipt|invoice|total|amount|tax|subtotal|order|transaction)/i) &&
      cleaned.match(/^[A-Z]/)
    );
  }

  private cleanVendorName(vendor: string): string {
    return vendor
      .replace(/\s+(Inc\.?|LLC|Corp\.?|Ltd\.?|Limited|Company|Co\.)$/i, '')
      .replace(/[^\w\s&'-]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .slice(0, 3)
      .join(' ');
  }
}

// Convenience function for simple usage
export async function parseReceiptRobust(
  pdfText: string, 
  options?: ParsingOptions
): Promise<ParsingResult> {
  const parser = new ReceiptParsingStrategy(options);
  return parser.parse(pdfText);
}