import { config } from 'dotenv';
import { parsePDF } from './lib/pdf-parser';
import { simpleExtractWithAI } from './lib/simple-pdf-parser';
import { checkAllConfigurations } from './lib/check-config';
import * as fs from 'fs';

// Load environment variables from .env.local
config({ path: '.env.local' });

async function testCompleteFlow() {
  console.log('🧪 === TESTING COMPLETE PDF PARSING FLOW ===\n');
  
  // 1. Check configurations
  console.log('1️⃣ Checking configurations...');
  checkAllConfigurations();
  console.log('');
  
  // 2. Test with a sample PDF (if exists)
  const testPdfPath = './test-receipt.pdf';
  
  if (!fs.existsSync(testPdfPath)) {
    console.log('❌ No test PDF found at ./test-receipt.pdf');
    console.log('💡 Please add a test receipt PDF to test the complete flow');
    return;
  }
  
  console.log('2️⃣ Testing PDF parsing flow...');
  const buffer = await fs.promises.readFile(testPdfPath);
  
  try {
    // Test main parser (should use Document AI if configured)
    console.log('\n📄 Testing main parser...');
    const result = await parsePDF(buffer);
    
    console.log('\n✅ Main Parser Results:');
    console.log('Text length:', result.text.length);
    console.log('Pages:', result.numpages);
    if (result.metadata) {
      console.log('Metadata:', result.metadata);
    }
    
    // Test simple AI extraction
    console.log('\n🤖 Testing AI extraction on parsed text...');
    const aiResult = await simpleExtractWithAI(result.text);
    
    console.log('\n✅ AI Extraction Results:');
    console.log('Is Ledger Entry:', aiResult.isLedgerEntry);
    console.log('Amount:', aiResult.amount);
    console.log('Vendor:', aiResult.description);
    console.log('Date:', aiResult.date);
    console.log('Confidence:', aiResult.confidence);
    
  } catch (error) {
    console.error('❌ Error during testing:', error);
  }
  
  console.log('\n✨ === TEST COMPLETE ===');
}

// Run the test
testCompleteFlow().catch(console.error);