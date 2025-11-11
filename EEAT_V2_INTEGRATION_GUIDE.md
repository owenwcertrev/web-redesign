# E-E-A-T V2 Integration Guide

## What's Been Built

### ✅ Completed Components

1. **Type System** (`lib/types/blog-analysis.ts`)
   - `EEATVariable` - Individual variable with score, evidence, estimation flags
   - `EEATEvidence` - Supporting evidence with estimation markers
   - `EEATCategoryScore` - Category with array of variables
   - `EEATScore` - Complete score with all 4 categories

2. **Configuration** (`lib/eeat-config.ts`)
   - 27 variables defined with importance weights:
     - Experience (E1-E7): 25 points
     - Expertise (X1-X6): 25 points
     - Authoritativeness (A1-A7): 25 points
     - Trustworthiness (T1-T7): 25 points
   - Individual thresholds for each variable

3. **Detector Modules** (`lib/services/eeat-detectors/`)
   - `experience-detectors.ts` - E1-E7 detection
   - `expertise-detectors.ts` - X1-X6 detection
   - `authoritativeness-detectors.ts` - A1-A7 detection (with estimation fallback)
   - `trustworthiness-detectors.ts` - T1-T7 detection
   - All include blog metric integration

4. **API Orchestration** (`lib/services/api-orchestrator.ts`)
   - `fetchInstantAPIs()` - Parallel execution with 10s timeouts
     - DataForSEO domain metrics
     - Basic author reputation check via Brave Search
   - `fetchComprehensiveAPIs()` - Full analysis for background jobs
   - Graceful degradation with error tracking

5. **New Scoring Engine** (`lib/services/eeat-scorer-v2.ts`)
   - `calculateInstantEEATScores()` - On-page + fast APIs
   - `calculateComprehensiveEEATScores()` - All APIs + LLM analysis
   - `calculateBlogEEATScores()` - Aggregate across multiple posts
   - Returns new `EEATScore` structure with variables

6. **UI Components**
   - `components/EEATCategoryCard.tsx` - Expandable category card
   - `components/EEATScoreDisplay.tsx` - Complete score display with expandable cards
   - Shows estimation warnings (⚠️) on estimated variables
   - Click to expand and see all variables + evidence

## Integration Steps

### Step 1: Update API Route (`app/api/analyze-url/route.ts`)

#### For Single-Page Analysis

Replace:
```typescript
import { calculateInstantEEATScores } from '@/lib/services/eeat-scorer'
```

With:
```typescript
import { calculateInstantEEATScores } from '@/lib/services/eeat-scorer-v2'
```

Update the call:
```typescript
// OLD
const scores = calculateInstantEEATScores(pageAnalysis)

// NEW (async with domain for API calls)
const scores = await calculateInstantEEATScores(pageAnalysis, domain)
```

#### For Blog Analysis

Replace blog scoring logic to use new system:
```typescript
import { calculateBlogEEATScores } from '@/lib/services/eeat-scorer-v2'

// After analyzeBlogPosts()
const blogInsights = calculateBlogInsights(batchResult.successful)
const eeatScore = await calculateBlogEEATScores(
  batchResult.successful,
  blogInsights,
  undefined, // domainMetrics (will fetch in instant mode)
  undefined, // nlpAnalysis (for comprehensive only)
  undefined  // authorReputation (will fetch in instant mode)
)

// Return new structure
return NextResponse.json({
  success: true,
  analysis: {
    type: 'blog',
    eeatScore, // New variable-based structure
    blogInsights, // Keep existing insights
    domainInfo: {
      domain,
      postsAnalyzed: batchResult.successful.length,
      totalPostsFound: discovery.totalFound
    }
  }
})
```

### Step 2: Update Frontend to Use New Components

In `app/eeat-meter/page.tsx` or wherever results are displayed:

Replace the old results rendering with:
```tsx
import EEATScoreDisplay from '@/components/EEATScoreDisplay'

// In your component
{results && results.eeatScore && (
  <EEATScoreDisplay
    score={results.eeatScore}
    showComprehensiveUpsell={true}
    postsAnalyzed={results.domainInfo?.postsAnalyzed}
  />
)}
```

### Step 3: Update Inngest Background Jobs

In `lib/inngest/eeat-analysis.ts`:

Update comprehensive analysis to use new scoring:
```typescript
import { calculateComprehensiveEEATScores } from '@/lib/services/eeat-scorer-v2'
import { analyzeContentWithNLP } from '@/lib/services/nlp-analyzer'
import { checkAuthorReputation } from '@/lib/services/reputation-checker'
import { fetchComprehensiveAPIs } from '@/lib/services/api-orchestrator'

// In your Inngest function
const { domainMetrics, authorReputation, nlpAnalysis, errors } =
  await fetchComprehensiveAPIs(
    domain,
    pageAnalysis.authors?.[0]?.name,
    pageAnalysis.textContent
  )

const comprehensiveScore = calculateComprehensiveEEATScores(
  pageAnalysis,
  domainMetrics,
  nlpAnalysis,
  authorReputation
)

// Send email with comprehensiveScore (includes all variables + evidence)
```

### Step 4: Update Email Template

Create new email template showing:
- Overall score with gauge
- 4 category summaries
- Top 5-10 variables needing improvement
- Link back to full report with expandable cards

## Key Differences from Old System

### Old System
- Simple category scores (4 numbers)
- No variable breakdown
- No estimation tracking
- Blog score separate from E-E-A-T

### New System
- 27 individual variables tracked
- Each variable has score, evidence, recommendations
- Estimation flags when APIs fail
- Blog metrics integrated into E-E-A-T categories
- Complete transparency on how score is calculated

## API Response Structure

### Old Format (DEPRECATED)
```json
{
  "score": 65,
  "breakdown": {
    "experience": 18,
    "expertise": 16,
    "authoritativeness": 15,
    "trustworthiness": 16
  }
}
```

### New Format
```json
{
  "eeatScore": {
    "overall": 65,
    "categories": {
      "experience": {
        "category": "experience",
        "displayName": "Experience",
        "totalScore": 18,
        "maxScore": 25,
        "percentage": 72,
        "overallStatus": "good",
        "variables": [
          {
            "id": "E1",
            "name": "First-person narratives",
            "description": "Presence of practitioner stories...",
            "maxScore": 4,
            "actualScore": 3.2,
            "status": "good",
            "evidence": [
              {
                "type": "metric",
                "value": "75% experience signals detected",
                "confidence": 0.75
              }
            ],
            "isEstimated": false,
            "detectionMethod": "automated"
          }
          // ... E2-E7
        ]
      }
      // ... expertise, authoritativeness, trustworthiness
    },
    "status": "good",
    "benchmarkComparison": {
      "fortune500": "75-85",
      "midMarket": "55-70",
      "startup": "30-50"
    },
    "postsAnalyzed": 20
  }
}
```

## Testing Checklist

- [ ] Test instant analysis with successful APIs
- [ ] Test instant analysis with API timeouts (disconnect internet briefly)
- [ ] Verify estimation notes appear correctly
- [ ] Test blog analysis with 20+ posts
- [ ] Test comprehensive analysis background job
- [ ] Verify email reports include all variables
- [ ] Test UI expandable cards
- [ ] Verify evidence displays correctly
- [ ] Test on mobile devices

## Migration Notes

- Old `eeat-scorer.ts` is still available for backward compatibility
- New system is in `eeat-scorer-v2.ts`
- Can run both systems in parallel during transition
- Frontend components are additive (won't break existing UI)

## Future Enhancements

1. **Content Gap Analysis** (T.B.D.)
   - Identify missing topics based on competitors
   - Suggest content opportunities

2. **NLP Integration** (T.B.D.)
   - OpenAI analysis for E1 (experience signals)
   - OpenAI analysis for X5 (expertise depth)
   - Aggregate insights across blog

3. **Backlink Analysis** (When budget allows)
   - A4 (Independent references) - full backlink data
   - Quality assessment of referring domains

4. **Historical Tracking**
   - Store scores over time
   - Show improvement trends
   - Track variable changes

## Questions?

- Variables defined: `lib/eeat-config.ts`
- Detectors: `lib/services/eeat-detectors/`
- Scorer: `lib/services/eeat-scorer-v2.ts`
- UI: `components/EEATScoreDisplay.tsx` and `components/EEATCategoryCard.tsx`
