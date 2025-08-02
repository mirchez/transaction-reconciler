# Hybrid Transaction Matching System

## Overview

The transaction reconciliation system now uses a two-phase hybrid approach that combines logic-based matching with AI-powered matching to optimize both accuracy and cost.

## How It Works

### Phase 1: Logic-Based Matching
The system first attempts to match transactions using deterministic rules:
- **Exact amount match** (within $0.01)
- **Same date** (exact day match)
- **Description similarity** (common words or vendor names)

This phase is fast, free, and handles the majority of straightforward matches.

### Phase 2: AI-Powered Matching (Optional)
For transactions that didn't match in Phase 1, the system can use OpenAI's GPT-3.5 to:
- Identify matches with slight variations in amounts (within $0.50)
- Match transactions with dates within 5 days of each other
- Recognize vendor names despite formatting differences
- Understand common transaction patterns

This phase only runs if:
1. There are unmatched transactions after Phase 1
2. The `OPENAI_API_KEY` environment variable is configured

## Configuration

### Enable AI Matching
Add your OpenAI API key to your `.env` file:
```
OPENAI_API_KEY=your_openai_api_key_here
```

### Disable AI Matching
Simply remove or comment out the `OPENAI_API_KEY` in your `.env` file. The system will only use logic-based matching.

## Database Schema

The `Matched` table now includes metadata about how each match was made:

```prisma
model Matched {
  // ... existing fields ...
  matchType    String   @default("logic") // "logic" or "ai"
  matchScore   Int      @default(100)     // 0-100 confidence score
  matchReason  String?  // Optional explanation of the match
}
```

## API Response

The `/api/reconcile` endpoint now returns detailed information about matches:

```json
{
  "success": true,
  "message": "Successfully matched 5 new transactions (3 by logic, 2 by AI)",
  "stats": {
    "newMatches": 5,
    "logicMatches": 3,
    "aiMatches": 2,
    "totalMatched": 25,
    "totalLedger": 30,
    "totalBank": 28,
    "unmatchedLedger": 5,
    "unmatchedBank": 3,
    "aiEnabled": true
  },
  "matches": [
    {
      "ledgerId": "...",
      "bankId": "...",
      "matchType": "logic",
      "matchScore": 100,
      "matchReason": "Exact amount, date, and description match",
      // ... other fields
    }
  ]
}
```

## UI Updates

Matched transactions in the UI now display:
- **Match Score**: The confidence percentage (70-100%)
- **Match Type Badge**: "Logic" or "AI" indicator
- **Match Reason**: Tooltip explaining why the match was made

## Cost Optimization

The hybrid approach significantly reduces API costs by:
1. Only sending unmatched transactions to OpenAI
2. Batching multiple transactions in a single API call
3. Using the efficient GPT-3.5-turbo model
4. Caching results to avoid redundant API calls

## Match Quality

- **Logic matches**: 100% confidence, exact matches only
- **AI matches**: 70-100% confidence based on similarity
- All AI matches include an explanation for transparency

## Migration

After updating the code, run the Prisma migration to add the new fields:

```bash
pnpm prisma migrate dev --name add-match-metadata
```

This will add the `matchType`, `matchScore`, and `matchReason` fields to the `Matched` table.