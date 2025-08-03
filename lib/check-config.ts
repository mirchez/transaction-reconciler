/**
 * Configuration validation for Google Document AI and other services
 */

export function checkGoogleDocumentAIConfig(): {
  isConfigured: boolean;
  missingVars: string[];
} {
  const requiredVars = [
    'GOOGLE_PROJECT_ID',
    'GOOGLE_LOCATION', 
    'GOOGLE_PROCESSOR_ID',
    'GOOGLE_APPLICATION_CREDENTIALS'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.log('⚠️ Google Document AI not fully configured. Missing:', missingVars.join(', '));
    console.log('ℹ️ Falling back to pdf-parse for text extraction');
  } else {
    console.log('✅ Google Document AI is configured');
    console.log('📁 Credentials path:', process.env.GOOGLE_APPLICATION_CREDENTIALS);
  }

  return {
    isConfigured: missingVars.length === 0,
    missingVars
  };
}

export function checkOpenAIConfig(): boolean {
  if (!process.env.OPENAI_API_KEY) {
    console.log('⚠️ OpenAI API key not configured');
    return false;
  }
  console.log('✅ OpenAI is configured');
  return true;
}

export function checkAllConfigurations(): void {
  console.log('🔍 === CONFIGURATION CHECK ===');
  
  // Check Google Document AI
  const documentAI = checkGoogleDocumentAIConfig();
  
  // Check OpenAI
  const hasOpenAI = checkOpenAIConfig();
  
  // Summary
  console.log('📊 === CONFIGURATION SUMMARY ===');
  console.log('Google Document AI:', documentAI.isConfigured ? '✅ Ready' : '❌ Not configured');
  console.log('OpenAI:', hasOpenAI ? '✅ Ready' : '❌ Not configured');
  console.log('PDF Parser:', '✅ Ready (pdf-parse installed)');
  console.log('================================');
}