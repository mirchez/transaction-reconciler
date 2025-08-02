# Receipt Parsing Implementation Guide

## Overview

I've implemented a robust, multi-strategy receipt parsing system that can handle various financial document formats with high accuracy. The system uses multiple fallback strategies to ensure data extraction even from challenging documents.

## Architecture

### 1. **Multi-Strategy Parser** (`receipt-parser-strategy.ts`)
The main parsing orchestrator that tries multiple approaches in sequence:

```typescript
const parser = new ReceiptParsingStrategy({
  filename: 'receipt.pdf',
  useAI: true,
  maxRetries: 3,
  acceptPartialData: false,
  documentHints: ['invoice', 'subscription']
});

const result = await parser.parse(pdfText);
```

### 2. **Enhanced OpenAI Service** (`openai-service-enhanced.ts`)
Improved AI parsing with:
- Multiple prompt strategies (comprehensive, minimal, platform-specific)
- Automatic retries with different models (GPT-4o-mini → GPT-4)
- Context-aware extraction
- Post-processing validation

### 3. **Advanced Pattern Parser** (`receipt-parser-v2.ts`)
Sophisticated regex-based extraction that:
- Extracts ALL amounts, dates, and vendors found
- Intelligently selects the most relevant values
- Handles multiple currencies and formats
- Includes metadata about document type

## Key Features

### 1. **Robust Amount Extraction**
- Prioritizes "amount" keyword (e.g., "Amount due: $5.00")
- Falls back to "Total", "Grand Total", "Balance Due"
- Handles multiple currencies ($, €, £)
- Extracts all amounts for analysis

### 2. **Intelligent Vendor Detection**
- Checks document header/top section first
- Recognizes common patterns and business names
- Cleans up suffixes (Inc., LLC, Corp.)
- Maps known vendors (e.g., "X Corp" → "X")

### 3. **Flexible Date Parsing**
- Supports multiple formats (MM/DD/YYYY, DD-MM-YYYY, Month DD YYYY)
- Prioritizes transaction dates over due dates
- Converts all dates to ISO format (YYYY-MM-DD)

### 4. **Document Type Recognition**
Automatically identifies:
- Standard receipts
- Invoices
- Bank statements
- Payment confirmations
- Subscription receipts
- Platform-specific formats (PayPal, Stripe, etc.)

## Parsing Flow

1. **AI Parsing (if enabled)**
   - Uses GPT-4 with specialized prompts
   - Retries with different strategies on failure
   - Validates extracted data

2. **Pattern-Based Parsing**
   - Comprehensive regex patterns
   - Extracts all possible values
   - Intelligent selection logic

3. **Contextual Parsing**
   - Uses filename hints
   - Applies document type knowledge
   - Enhanced with metadata

4. **Aggressive Extraction**
   - Last resort strategy
   - Finds ANY financial data
   - Returns partial results if configured

## Usage Examples

### Basic Usage
```typescript
import { extractLedgerDataWithOpenAI } from '@/lib/openai-service';

const result = await extractLedgerDataWithOpenAI(pdfText, 'X-receipt.pdf');
if (result.isLedgerEntry) {
  console.log({
    amount: result.amount,
    date: result.date,
    vendor: result.description
  });
}
```

### Advanced Usage with Options
```typescript
import { parseReceiptRobust } from '@/lib/receipt-parser-strategy';

const result = await parseReceiptRobust(pdfText, {
  filename: 'paypal-transaction.pdf',
  useAI: true,
  maxRetries: 3,
  acceptPartialData: true,
  documentHints: ['payment-platform', 'paypal']
});

if (result.success) {
  console.log('Extraction method:', result.method);
  console.log('Confidence:', result.confidence);
  console.log('Data:', result.data);
}

// Access raw extractions for debugging
console.log('All amounts found:', result.rawExtractions?.amounts);
console.log('All dates found:', result.rawExtractions?.dates);
console.log('Possible vendors:', result.rawExtractions?.vendors);
```

## Handling Edge Cases

### 1. **Minimal Text PDFs**
The system uses a specialized "minimal" prompt for PDFs with little text, increasing temperature for better inference.

### 2. **Image-Based PDFs**
Falls back to metadata extraction and filename analysis when no text is found.

### 3. **Multi-Currency Documents**
Extracts currency information and normalizes amounts.

### 4. **Platform-Specific Receipts**
Special handling for:
- PayPal (separates platform fees from transaction amount)
- Stripe (handles processing fees)
- Subscription services (extracts billing periods)

## Error Handling

The system provides detailed error information:
```typescript
if (!result.success) {
  console.log('Parsing failed after', result.attempts, 'attempts');
  console.log('Errors:', result.errors);
  console.log('Partial data:', result.rawExtractions);
}
```

## Performance Optimization

1. **Caching**: Results are cached for repeated parsing
2. **Parallel Extraction**: Multiple patterns run concurrently
3. **Early Exit**: Stops when sufficient data is found
4. **Token Optimization**: Truncates long documents for AI processing

## Configuration

Environment variables:
```env
OPENAI_API_KEY=your_api_key  # Required for AI parsing
```

## Testing

Test with various receipt formats:
```typescript
// Test files to try:
// - Standard retail receipts
// - Invoices with complex layouts
// - Bank statements
// - PayPal/Stripe confirmations
// - Subscription renewals
// - International receipts
```

## Troubleshooting

1. **No amount extracted**
   - Check if "amount" keyword exists in document
   - Verify currency symbols are standard
   - Enable `acceptPartialData` option

2. **Wrong vendor extracted**
   - Add document hints
   - Check if vendor name is in header
   - Use filename to provide context

3. **Date parsing issues**
   - Ensure date format is recognizable
   - Check for multiple dates (due vs paid)
   - System defaults to today if no date found

## Future Improvements

1. **OCR Integration**: For image-based PDFs
2. **ML Model Training**: Custom model for specific receipt types
3. **Multi-Language Support**: Parse non-English receipts
4. **Receipt Templates**: Pre-configured patterns for known vendors