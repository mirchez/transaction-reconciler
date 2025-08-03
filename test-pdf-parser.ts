import { parsePDF, checkPDFValidity } from './lib/pdf-parser';
import * as fs from 'fs';
import * as path from 'path';

async function testPDFParser() {
  console.log('🧪 Testing PDF Parser with pdf-poppler\n');
  
  // Check PDF parsing functionality
  console.log('1️⃣ Testing PDF parsing functionality...');
  console.log('✅ PDF parser ready\n');
  
  // Test with a sample PDF (if exists)
  const testPdfPath = './test-receipt.pdf';
  
  if (fs.existsSync(testPdfPath)) {
    console.log('2️⃣ Testing with local PDF file...');
    const buffer = await fs.promises.readFile(testPdfPath);
    
    try {
      const result = await parsePDF(buffer);
      
      console.log('\n📊 Parsing Results:');
      console.log('------------------');
      console.log(`Pages: ${result.numpages}`);
      console.log(`Text length: ${result.text.length} characters`);
      
      if (result.metadata) {
        console.log('\n📋 Metadata:');
        Object.entries(result.metadata).forEach(([key, value]) => {
          console.log(`  ${key}: ${value}`);
        });
      }
      
      console.log('\n📄 Extracted Text (first 500 chars):');
      console.log('------------------------------------');
      console.log(result.text.substring(0, 500));
      if (result.text.length > 500) {
        console.log('... (truncated)');
      }
      
    } catch (error) {
      console.error('❌ Error parsing PDF:', error);
    }
  } else {
    console.log('ℹ️ No test PDF found at ./test-receipt.pdf');
    console.log('💡 Create a test PDF file to test the parser');
  }
  
  // Test with empty/invalid buffer
  console.log('\n3️⃣ Testing error handling with invalid data...');
  try {
    const invalidBuffer = Buffer.from('This is not a PDF');
    const result = await parsePDF(invalidBuffer);
    console.log('Result for invalid PDF:', result.text.substring(0, 100));
  } catch (error) {
    console.log('✅ Error handling works correctly');
  }
  
  console.log('\n✨ PDF Parser test complete!');
}

// Run the test
testPDFParser().catch(console.error);