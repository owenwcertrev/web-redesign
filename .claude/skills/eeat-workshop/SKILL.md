---
name: eeat-workshop
description: Workshop individual E-E-A-T metrics by testing against Healthline (industry benchmark), analyzing detection accuracy, calibrating thresholds, and automatically implementing improvements. Invoke when the user wants to refine a specific metric (E1-E7, X1-X6, A1-A7, T1-T7) or asks to workshop E-E-A-T scoring.
---

# E-E-A-T Metric Workshop Skill

You are an expert in Google's E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) quality guidelines and SEO content analysis. Your role is to help workshop individual E-E-A-T metrics by testing them against industry-leading content (like Healthline) and systematically improving their detection accuracy, threshold calibration, and user-facing recommendations.

## Context: The E-E-A-T Scoring System

This project implements a 27-variable E-E-A-T scoring system for evaluating content quality:

- **Experience (E1-E7)**: 7 variables, 25 points max
- **Expertise (X1-X6)**: 6 variables, 25 points max
- **Authoritativeness (A1-A7)**: 7 variables, 25 points max
- **Trustworthiness (T1-T7)**: 7 variables, 25 points max

Each metric has:
- Configuration in `lib/eeat-config.ts` (max points, thresholds, descriptions)
- Detector logic in `lib/services/eeat-detectors/[category]-detectors.ts`
- Evidence collection, scoring logic, and recommendations

## Universal Detection Philosophy

**Primary Goal:** Build E-E-A-T detection that works for **99+ websites** across ALL verticals, ALL blogs, with ACCURACY and REDUNDANCY.

E-E-A-T metrics must work comprehensively:
- ✅ **All verticals:** Medical, finance, tech, law, food, real estate, business, academia, fitness, international
- ✅ **All languages:** English, German, French, Spanish, Italian + generic patterns
- ✅ **All content types:** Blog posts, articles, landing pages, directories, news sites
- ✅ **All publisher types:** Professional publishers (Healthline), personal blogs, corporate sites, news organizations

### Multi-Layered Detection Strategy

Each metric should have **redundant detection pathways** to ensure no false negatives:

**Layer 1: Regex patterns** (fast, reliable fallback)
- Pattern-match common signals across all verticals
- 50+ patterns covering edge cases
- International patterns included
- **Always works (no API dependencies)**

**Layer 2: Schema markup** (structured data)
- Extract from JSON-LD, meta tags, microdata
- Author info, review info, organizational data
- **Reliable but not always present**

**Layer 3: LLM semantic analysis** (optional enhancement)
- Context-aware understanding via GPT-4o
- Cross-validates signals from Layers 1-2
- Catches nuanced expertise regex misses
- **Expensive but highly accurate - falls back gracefully**

**Layer 4: External validation** (when needed)
- Author bio pages (cross-validation)
- Third-party citations (authoritativeness)
- Domain authority metrics
- **Slow but definitive**

**Goal:** If one pathway fails, others catch the signal. NO false negatives for industry benchmarks like Healthline.

### Accuracy Requirements

- **Industry benchmarks** (Healthline, Investopedia, etc.) must score 80-100% of max points
- **Legitimate expertise** must be recognized regardless of vertical or language
- **Redundancy validated:** Each detection pathway should catch 50%+ of signals independently
- **No false negatives:** If a site has clear E-E-A-T signals, they must be detected

## Your Task

When invoked with a metric ID (e.g., "E1" or "X3"), you will:

1. **Load the current implementation**
2. **Run live analysis against Healthline** (industry benchmark)
3. **Analyze detection accuracy, threshold calibration, and recommendations**
4. **Automatically implement improvements**
5. **Validate changes with re-testing**
6. **Summarize all changes made**

## Workflow

### Step 1: Load Current Implementation & Analyze Multi-Layered Architecture

#### A. Load Configuration

Read and display:
- Metric configuration from `lib/eeat-config.ts` (find the metric by ID)
- Detector function from the appropriate file:
  - E1-E7: `lib/services/eeat-detectors/experience-detectors.ts`
  - X1-X6: `lib/services/eeat-detectors/expertise-detectors.ts`
  - A1-A7: `lib/services/eeat-detectors/authoritativeness-detectors.ts`
  - T1-T7: `lib/services/eeat-detectors/trustworthiness-detectors.ts`

Show the user:
- Metric name and max points
- Current thresholds (excellent/good/needs improvement/poor)
- Detection patterns used
- Recommendation text

#### B. Analyze Detection Pathways

For each metric, identify which detection layers are implemented:

**Layer 1: Regex Patterns (Required)**
- How many regex patterns exist?
- Do they cover all verticals (medical, finance, tech, law, food, etc.)?
- Are international patterns included (German, French, Spanish, Italian)?
- Example for E1: Check for ~60+ credential patterns across 9+ verticals

**Layer 2: Schema Markup (Common)**
- Does the detector check JSON-LD schema?
- Does it extract author info, reviewer info, or organizational data?
- Example for E1: Check for `reviewedBy` and author schema

**Layer 3: LLM Semantic Analysis (Optional)**
- Is there an `analyzeXXWithGPT4()` function in `lib/services/llm-metric-analyzer.ts`?
- Does the detector support hybrid mode (LLM + regex fallback)?
- Is there a `skipLLM` parameter for cost control?
- Does it gracefully fall back to regex on timeout?
- Example for E1: `analyzeE1WithGPT4()` with author bio fetching

**Layer 4: External Validation (When Applicable)**
- Does the metric fetch external data (author bios, citations, domain authority)?
- Is there timeout/retry logic?
- Example for E1: Author bio URLs fetched in parallel with 3s timeout

#### C. Universal Coverage Check

Verify the metric works across ALL verticals:

**Medical:** MD, RD, RN, PA-C, BSc, MS, Facharzt (DE), Docteur (FR)
**Finance:** CFA, CFP, CPA, Series 7/65, Chartered Accountant
**Tech:** Software Engineer, PhD CS, Dipl.-Ing. (DE), "10 years at Google"
**Law:** JD, Esq, Attorney, Maître (FR), Rechtsanwalt (DE), Abogado (ES)
**Food:** Chef, Culinary Institute, James Beard
**Real Estate:** Realtor, Licensed Broker, GRI
**Business:** CEO, Founder, VP, Licenciado (ES), Dottore (IT)
**Academia:** Professor, PhD, Professeur (FR)
**Fitness:** Certified Trainer, CSCS, NASM
**Generic/International:** Dr., Prof., Eng., post-nominal patterns

**If ANY vertical is missing patterns, note for improvement.**

#### D. Redundancy Validation

Check if metric has multiple pathways:
- If LLM is disabled, does regex still catch most signals?
- If schema is missing, does content analysis compensate?
- If author URLs are blocked, do in-page credentials work?

**Goal:** Metric should have ≥2 independent pathways that each catch 50%+ of signals.

### Step 2: Run Live Analysis Across ALL Verticals

#### Universal Testing Strategy

Test the metric against **industry benchmarks** in MULTIPLE verticals to ensure universal coverage. Don't just test Healthline - test across different industries to validate patterns.

#### A. Primary Benchmark (Healthline)

Choose an appropriate Healthline URL for testing based on the metric:
- For YMYL-specific metrics (X2, T2): Use health content like `https://www.healthline.com/health/heart-disease`
- For author-related metrics (E1, E2, X1-X3): Use bylined articles like `https://www.healthline.com/nutrition/is-dairy-bad-or-good`
- For blog-level metrics (E6, E7, X6, A6, A7, T6, T7): Use domain `healthline.com`
- For general metrics: Any high-quality Healthline article

Execute the E-E-A-T analysis:
```bash
npx tsx scripts/debug-single-url.ts [URL]
```

Display the results:
- Score received (out of max points)
- Status tier (excellent/good/needs improvement/poor)
- Evidence collected
- Recommendations shown to user

**Expected:** Healthline should score 80-100% of max points (3-4/4 for E1, 5-6/6 for X1, etc.)

#### B. Cross-Vertical Validation

Test 2-3 additional sites from different verticals to ensure patterns work universally:

**Finance site (if metric applies):**
```bash
npx tsx scripts/debug-single-url.ts https://www.investopedia.com/[article]
```
Expected: CFA, CFP, financial journalist credentials detected

**Tech blog (if metric applies):**
```bash
npx tsx scripts/debug-single-url.ts https://[engineering-blog]/[post]
```
Expected: "Senior Engineer", "PhD CS", contextual expertise detected

**Law/Legal site (if metric applies):**
Test content with JD, Esq, Attorney credentials

**Food/Culinary site (if metric applies):**
Test Serious Eats or similar with Chef credentials

**International site (if patterns added):**
Test German, French, Spanish, or Italian professional content

**Goal:** If ANY vertical scores poorly when it should score well, add missing patterns.

#### C. Redundancy Testing (LLM-Enhanced Metrics Only)

If the metric supports LLM (check for `ENABLE_LLM_SCORING` logic):

**Test with LLM enabled:**
```bash
ENABLE_LLM_SCORING=true npx tsx scripts/debug-single-url.ts [URL]
```

**Test with LLM disabled (regex fallback):**
```bash
ENABLE_LLM_SCORING=false npx tsx scripts/debug-single-url.ts [URL]
```

**Compare scores:**
- LLM mode: Should score highest (full semantic understanding)
- Regex mode: Should score within ±1 point (fallback still works)

Check evidence labels to confirm which mode was used:
- LLM evidence: "Experience analysis", "Assessment" (seamless labels)
- Regex evidence: "First-person experience phrases", "Professional experience indicators"

**If regex fallback scores significantly lower (<50% of LLM score), improve regex patterns.**

#### D. Blog-Level Testing (For Blog Metrics)

If testing E6, E7, X6, A6, A7, T6, T7:

```bash
npx tsx scripts/analyze-blog.ts healthline.com
```

Check that:
- LLM runs in parallel on all posts (not sequential)
- Duration: ~5-10s for 10 posts (parallel), not 50s (sequential)
- Cost: <$0.50 per blog
- Aggregation logic produces accurate average scores

### Step 3: Analyze Performance

Evaluate three dimensions:

#### A. Detection Accuracy
- Is the detector correctly identifying positive signals?
- Is it missing any signals that Healthline clearly has?
- Are there false positives (detecting things that aren't there)?
- Does the detection logic align with Google's E-E-A-T guidelines?

**Consider:**
- Regex patterns for finding author names, credentials, review labels
- DOM structure analysis (heading hierarchy, schema markup)
- External API data (DataForSEO metrics, backlinks)
- Edge cases and variations in content structure

#### B. Threshold Calibration
- Does Healthline (industry leader) score in the "excellent" or "good" range?
- Are the score thresholds (excellent/good/needs improvement/poor) set appropriately?
- Is the maximum point value justified for this metric's importance?

**Expected behavior:**
- Industry leaders like Healthline should typically score 80-100% of max points
- Sites with partial implementation should score in "good" or "needs improvement"
- Sites missing the signal entirely should score "poor"

#### C. Recommendation Quality
- Are the recommendations actionable and specific?
- Do they explain WHY the metric matters for E-E-A-T?
- Do they provide concrete examples or implementation guidance?
- Are they appropriate for the user's score level?

#### D. Universal Coverage & Redundancy Analysis

**Critical questions for building robust, universal metrics:**

**1. Vertical coverage:** Does the metric work for ALL industries?
- Medical, finance, tech, law, food, real estate, business, academia, fitness
- If ANY vertical scores 0 when it should score 2+, add patterns
- Test with real sites from each vertical

**2. Language coverage:** Does the metric work for international content?
- German: Dipl.-Ing., Facharzt, Rechtsanwalt
- French: Docteur, Ingénieur, Maître
- Spanish: Licenciado, Ingeniero, Abogado
- Italian: Dottore, Ingegnere, Avvocato
- Generic: Dr., Prof., Eng. (catch-all patterns)

**3. Redundancy:** If ONE pathway fails, do others compensate?
- Disable LLM → regex should catch 50%+ of signals
- Remove schema → content analysis should work
- Block author bios → in-page credentials should be detected
- Missing one pattern type → other patterns compensate

**4. Publisher diversity:** Does the metric work for different publisher types?
- Professional publishers (Healthline, WebMD): High credentialing expected
- Personal blogs: First-person narratives + some credentials
- Corporate sites: Institutional voice + team credentials
- News sites: Journalist credentials + bylines
- All should receive appropriate scores for their E-E-A-T level

**5. False negatives:** Are there legitimate signals being missed?
- "Board-certified cardiologist treating patients for 20 years" = clear experience
- "Senior Engineer with 10 years at Google" = contextual expertise
- "Chef trained at Culinary Institute" = professional background
- "CFA charterholder managing $500M portfolio" = finance credentials
- If ANY obvious signal is missed, it's a critical gap

**6. LLM Performance (if applicable):**
- Does LLM correctly identify cross-vertical credentials?
- Is author bio cross-validation working (fetching + analyzing bios)?
- Are LLM calls completing within 5s timeout?
- Is evidence presentation seamless (no "AI detected" language)?
- For blog analysis: Are all posts analyzed in parallel?

**Target: 99+ websites across all verticals should get accurate scores, not just Healthline.**

### Step 4: Implement Improvements

Based on your analysis, make changes automatically:

#### Update Detection Logic (if needed)
Edit the detector function in the appropriate file:
- Add missing detection patterns
- Fix false positive/negative issues
- Improve evidence collection
- Refine scoring logic

**Example improvements:**
- Add new regex patterns for author credentials
- Improve schema markup parsing
- Better handling of edge cases
- More robust DOM traversal

#### Calibrate Thresholds (if needed)
Edit `lib/eeat-config.ts`:
- Adjust threshold values for excellent/good/needs improvement/poor
- Modify max points if the metric's weight should change
- Update metric descriptions if needed

**Example calibration:**
```typescript
// Before
thresholds: {
  excellent: { min: 4, max: 5 },
  good: { min: 2, max: 3 },
  needsImprovement: { min: 1, max: 1 },
  poor: { min: 0, max: 0 }
}

// After (if Healthline is scoring "good" but should be "excellent")
thresholds: {
  excellent: { min: 3, max: 5 },
  good: { min: 1, max: 2 },
  needsImprovement: { min: 0.5, max: 0.5 },
  poor: { min: 0, max: 0 }
}
```

#### Improve Recommendations (if needed)
Update the recommendation text in the detector function:
- Make advice more specific and actionable
- Add examples of what to implement
- Explain the E-E-A-T benefit clearly
- Link to best practices or guidelines

**Example improvement:**
```typescript
// Before
recommendations: [
  "Add author information to improve expertise signals"
]

// After
recommendations: [
  "Add named author with credentials: Include author name, professional degree (e.g., MD, PhD), headshot, and short bio. Example: 'By Dr. Jane Smith, MD - Board-certified cardiologist with 15+ years of experience.'"
]
```

### Step 5: Validate Changes

Re-run the analysis:
```bash
npx tsx scripts/debug-single-url.ts [same URL]
```

Compare before vs. after:
- Did the score change as expected?
- Is the evidence collection more comprehensive?
- Are the recommendations more helpful?
- Does Healthline now score appropriately for an industry leader?

If validation fails or results are unexpected:
- Investigate what went wrong
- Make additional adjustments
- Re-test until satisfied

### Step 6: Summary

Provide a concise summary:

```markdown
## Workshop Summary: [Metric ID - Metric Name]

**Test URL:** [Healthline URL used]

**Before:**
- Score: X/Y points ([status])
- Issues: [brief description]

**After:**
- Score: X/Y points ([status])
- Improvements: [what was fixed]

**Changes Made:**
1. [File path] - [description of change]
2. [File path] - [description of change]

**Validation:** ✅ Healthline now scores [excellent/good] as expected

**Reasoning:** [Why these changes improve the metric's accuracy and alignment with E-E-A-T guidelines]

**Next Steps:** Ready to workshop next metric.
```

## Building Comprehensive, Universal Metrics

### Multi-Layered Detection Pattern (Standard Architecture)

When workshopping ANY metric, aim for this multi-layered approach:

**Layer 1: Fast Regex Patterns (Required)**
- Pattern-match common signals across ALL verticals
- 50+ patterns minimum for comprehensive coverage
- International patterns included (German, French, Spanish, Italian)
- **Always works - no API dependencies, no cost**
- Example: E1 has 60+ credential patterns across 9 verticals

**Layer 2: Schema/Structured Data (When Available)**
- Extract from JSON-LD, meta tags, microdata
- Author info, reviewer info, organizational data
- **Reliable but not always present - graceful handling required**
- Example: E1 checks `reviewedBy` and author schema

**Layer 3: LLM Semantic Analysis (Optional Enhancement)**
- Context-aware understanding via GPT-4o
- Cross-validates signals from Layers 1-2
- Catches nuanced expertise regex misses
- **Expensive but highly accurate - must fall back gracefully**
- Example: E1 uses `analyzeE1WithGPT4()` with author bio fetching

**Layer 4: External Validation (When Needed)**
- Author bio pages, third-party citations, domain authority
- Timeout/retry logic required (3-5s timeout recommended)
- **Slow but definitive - use sparingly**
- Example: E1 fetches author bios in parallel with 3s timeout

### Redundancy Strategy

**Every metric should have ≥2 pathways:**
- If LLM fails → regex catches most signals (50%+ coverage minimum)
- If schema missing → content analysis compensates
- If patterns miss edge case → LLM semantic layer catches it
- If external fetch fails → internal analysis works

**Testing redundancy:**
```bash
# Test each pathway independently
ENABLE_LLM_SCORING=false npx tsx test-metric.ts  # Regex only
ENABLE_LLM_SCORING=true npx tsx test-metric.ts   # Regex + LLM

# Both should score within 1 point for benchmarks
```

### Universal Coverage Checklist

Before deploying a metric enhancement, verify:

- [ ] Tested on 5+ verticals (medical, finance, tech, law, food, real estate, business, academia, fitness)
- [ ] Tested on international content (German, French, Spanish, Italian)
- [ ] Tested on different publisher types (professional, blog, corporate, news)
- [ ] Redundancy validated (disable each pathway, ensure others compensate 50%+)
- [ ] Industry benchmarks score correctly (Healthline 3-4/4 for E1, etc.)
- [ ] No false negatives for obvious signals
- [ ] Cost acceptable for blog analysis (<$0.50 per blog if using LLM)
- [ ] Performance acceptable (<10s for blog, <5s for single page)
- [ ] Evidence is clear, actionable, and professional (no "AI detected" language)

### Example: Adding LLM to a Metric

To extend LLM support to any metric (as **optional enhancement**, not replacement):

**1. Keep existing regex patterns** (required fallback)

**2. Add LLM analyzer** in `lib/services/llm-metric-analyzer.ts`:
```typescript
export async function analyzeX1WithGPT4(
  pageAnalysis: PageAnalysis,
  contentSample: string
): Promise<LLMMetricResult | null> {
  // X1-specific prompt covering all verticals
  // Include international credentials
  // Cross-validate with author bios if applicable
  // Graceful error handling with null return
}
```

**3. Add hybrid detection** in detector file:
```typescript
export function detectX1(..., skipLLM = false): EEATVariable | Promise<EEATVariable> {
  const config = EEAT_VARIABLES.expertise.find(v => v.id === 'X1')!

  if (!skipLLM && process.env.ENABLE_LLM_SCORING === 'true') {
    return detectX1WithLLM(...) // LLM with regex fallback
  }

  return detectX1WithRegex(...) // Regex only
}

async function detectX1WithLLM(...): Promise<EEATVariable> {
  const [llmResult] = await Promise.allSettled([
    Promise.race([
      analyzeX1WithGPT4(...),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000))
    ])
  ])

  if (llmResult.status === 'fulfilled' && llmResult.value) {
    // Use LLM result with seamless evidence
    return { /* LLM result */ }
  }

  // Fall back to regex
  return detectX1WithRegex(...)
}
```

**4. Update blog aggregation** for parallel LLM (if applicable):
```typescript
variables.push(await aggregateVariableAcrossPostsAsync(posts, 'X1', (post) =>
  ExpertiseDetectors.detectX1(post.pageAnalysis, nlpAnalysis, false) // skipLLM: false
))
```

**5. Test redundancy:** Verify metric works with LLM enabled AND disabled (within ±1 point)

**6. Test universally:** All verticals, international content, publisher types

## Important Guidelines

When workshopping E-E-A-T metrics, follow these principles:

### 1. Universal Coverage is Priority #1
- MUST work across all verticals (not just medical/health)
- MUST work for international content (not just English)
- MUST work for all publisher types (not just Healthline)
- Test on 5+ different verticals before deploying
- Add patterns for German, French, Spanish, Italian when relevant

### 2. Redundancy is Non-Negotiable
- Every metric needs ≥2 detection pathways
- If one pathway fails, others must compensate (50%+ coverage minimum)
- Test each pathway independently to validate
- LLM should enhance, not replace, solid regex patterns

### 3. No False Negatives on Benchmarks
- Industry leaders (Healthline, Investopedia) must score 80-100% of max points
- Personal blogs with genuine expertise must get credit
- Professional credentials must be recognized across ALL fields
- If obvious E-E-A-T signals are missed, it's a critical bug

### 4. Accuracy > Innovation
- Don't add LLM if regex already works perfectly
- Don't remove regex when adding LLM (keep as fallback)
- Don't sacrifice reliability for fancy features
- Validate with multiple test sites, not just one

### 5. Cost-Performance Balance
- Single page: <5s total (acceptable for user-facing tool)
- Blog (10 posts): <10s total (parallel execution required)
- Blog LLM cost: <$0.50 per blog (sustainable at scale)
- No sequential API calls - always parallelize

### 6. Graceful Degradation
- LLM timeout → fall back to regex (seamless to user)
- Author bio fetch fails → continue without bio
- Schema missing → use content analysis
- API rate limit → cache + retry + fallback

### 7. Evidence Quality
- Show WHAT was detected (specific credentials, phrases, patterns)
- Show WHERE it was found (author names, content, bios, schema)
- Show WHY score was given (transparent reasoning)
- Keep language professional (no "AI detected", "GPT-4 analyzed", "LLM found")
- Use seamless labels: "Experience analysis", "Assessment", "Evidence"

### 8. International Support
- Add patterns for German, French, Spanish, Italian credentials
- Test with non-English professional content
- Use generic patterns (Dr., Prof., Eng.) as catch-all
- LLM prompt should explicitly mention international credentials
- Don't assume English-only web

### 9. Vertical-Specific Patterns
- **Medical:** MD, RD, RN, PA-C, Facharzt (DE), Docteur (FR)
- **Finance:** CFA, CFP, CPA, Chartered Accountant, Series 7/65
- **Tech:** Software Engineer, years at company, PhD CS, Dipl.-Ing. (DE)
- **Law:** JD, Esq, Attorney, Maître (FR), Rechtsanwalt (DE), Abogado (ES)
- **Food:** Chef, Culinary Institute, James Beard
- **Business:** CEO, Founder, VP, Licenciado (ES), Dottore (IT)
- **Academia:** Professor, PhD, Professeur (FR)
- **Fitness:** Certified Trainer, CSCS, NASM
- Add more patterns as you discover gaps during testing

### 10. Testing Discipline
- Test BEFORE committing changes
- Test across ≥5 verticals with real sites
- Test with LLM enabled AND disabled (redundancy check)
- Test edge cases (missing schema, no author, international, various publisher types)
- Test cost and performance at scale (blog-level analysis)
- Validate against industry benchmarks (Healthline should score well)

### 11. Make Changes Automatically
- Don't just recommend - actually implement improvements
- Use Edit tool to update detector functions
- Use Edit tool to update config/thresholds
- Validate changes with re-testing
- Document all changes made

### 12. Reference E-E-A-T Guidelines
- Align changes with Google's official E-E-A-T definitions
- Focus on signals that indicate genuine expertise/experience
- Avoid gaming or artificial inflation of scores
- Prioritize user value and content quality

## Metric Reference

### Experience Metrics (E1-E7)
- E1: First-person narratives (4 pts)
- E2: Author perspective blocks (3 pts)
- E3: Original assets (3 pts)
- E4: Freshness (5 pts)
- E5: Experience markup (2 pts)
- E6: Publishing consistency [blog-level] (4 pts)
- E7: Content freshness rate [blog-level] (4 pts)

### Expertise Metrics (X1-X6)
- X1: Named authors with credentials (6 pts)
- X2: YMYL reviewer presence (5 pts)
- X3: Credential verification links (4 pts)
- X4: Citation quality (4 pts)
- X5: Content depth & clarity (3 pts)
- X6: Author consistency [blog-level] (3 pts)

### Authoritativeness Metrics (A1-A7)
- A1: Editorial mentions (5 pts)
- A2: Authors cited elsewhere (4 pts)
- A3: Entity clarity (4 pts)
- A4: Independent references (4 pts)
- A5: Quality patterns (3 pts)
- A6: Internal linking network [blog-level] (3 pts)
- A7: Topic focus [blog-level] (2 pts)

### Trustworthiness Metrics (T1-T7)
- T1: Editorial principles (4 pts)
- T2: YMYL disclaimers (4 pts)
- T3: Provenance signals (5 pts)
- T4: Contact transparency (4 pts)
- T5: Schema hygiene (4 pts)
- T6: Schema adoption rate [blog-level] (2 pts)
- T7: Quality consistency [blog-level] (2 pts)

## Usage

To invoke this skill:
```
/eeat-workshop E1
```

Replace `E1` with the metric ID you want to workshop (E1-E7, X1-X6, A1-A7, T1-T7).

## Universal Coverage Testing Checklist

When workshopping any metric, use this comprehensive checklist:

### Vertical Coverage (Test ALL Applicable)
- [ ] **Medical site** (Healthline, WebMD): Expected score 3-4/4 or 80-100%
- [ ] **Finance site** (Investopedia, Morningstar): Expected score 2-4/4 or 60-100%
- [ ] **Tech blog** (Medium engineering, dev.to): Expected score 2-4/4 or 60-100%
- [ ] **Law site** (Legal blog, firm website): Expected score 2-4/4 or 60-100%
- [ ] **Food site** (Serious Eats, recipe blog): Expected score 2-4/4 or 60-100%
- [ ] **Real estate site** (Realtor blog): Expected score 2-4/4 or 60-100%
- [ ] **Business site** (Forbes, entrepreneur blog): Expected score 2-4/4 or 60-100%
- [ ] **Academia site** (University, research blog): Expected score 3-4/4 or 80-100%
- [ ] **Fitness site** (Personal trainer blog): Expected score 2-4/4 or 60-100%

### International Coverage
- [ ] **German professional site** (Facharzt, Dipl.-Ing.): Credentials detected
- [ ] **French professional content** (Docteur, Ingénieur): Credentials detected
- [ ] **Spanish content** (Licenciado, Ingeniero): Credentials detected
- [ ] **Italian content** (Dottore, Avvocato): Credentials detected
- [ ] **Generic international** (Dr., Prof., Eng.): Catch-all patterns work

### Publisher Types
- [ ] **Professional publisher** (Healthline-level): Score 80-100% of max
- [ ] **Personal blog with expertise**: Score 60-80% if signals present
- [ ] **Corporate site** (team credentials): Score 60-100% if signals present
- [ ] **News site** (journalist credentials): Score 60-80% if signals present

### Redundancy Validation
- [ ] **LLM enabled** → Correct score achieved
- [ ] **LLM disabled** → Score within ±1 point (regex fallback works)
- [ ] **Schema removed** → Content analysis still works
- [ ] **Author bios blocked** → In-page credentials still detected
- [ ] **ALL pathways disabled except 1** → At least 50% accuracy maintained

### Edge Cases
- [ ] **No author attribution** → Score 0 points (expected behavior)
- [ ] **Generic author** ("Admin", "Staff") → Score 0 points (expected)
- [ ] **Credentials in content but not author** → Partial credit given
- [ ] **Multiple authors (5+)** → Aggregates correctly
- [ ] **Guest post vs staff writer** → Differentiates appropriately

### Performance & Cost (LLM-Enhanced Metrics)
- [ ] **Single page analysis**: <5 seconds total
- [ ] **Blog analysis (10 posts)**: <10 seconds total
- [ ] **LLM calls run in parallel** (not sequential) - check duration
- [ ] **Blog LLM cost**: <$0.50 per 10-post blog
- [ ] **No timeout errors** in normal operation
- [ ] **Graceful fallback** on LLM timeout/failure

### Evidence Quality
- [ ] **Shows specific signals detected** (credentials, phrases, patterns)
- [ ] **Shows detection source** (author names, content, bios, schema)
- [ ] **No AI language** in user-facing evidence (no "GPT-4", "LLM", "AI detected")
- [ ] **Evidence feels professional** (seamless labels: "Experience analysis", "Assessment")
- [ ] **Reasoning is clear** and actionable for users

### Files Reference

**Core Detection Files:**
- `lib/services/eeat-detectors/experience-detectors.ts` - E1-E7 detection
- `lib/services/eeat-detectors/expertise-detectors.ts` - X1-X6 detection
- `lib/services/eeat-detectors/authoritativeness-detectors.ts` - A1-A7 detection
- `lib/services/eeat-detectors/trustworthiness-detectors.ts` - T1-T7 detection
- `lib/eeat-config.ts` - Metric configurations and thresholds

**LLM Enhancement (Optional):**
- `lib/services/llm-metric-analyzer.ts` - GPT-4o analyzers + author bio fetching
- `lib/services/eeat-scorer-v2.ts` - Blog aggregation with parallel LLM

**Testing Scripts:**
- `scripts/debug-single-url.ts` - Single page analysis
- `scripts/analyze-blog.ts` - Blog-level analysis
- `test-e1-llm.ts` - E1 LLM-specific testing (create similar for other metrics)

**Configuration:**
- `.env` / `.env.local` - ENABLE_LLM_SCORING, OPENAI_API_KEY

## Notes

- Blog-level metrics (E6, E7, X6, A6, A7, T6, T7) require testing with a domain, not a single URL
- Some metrics depend on external APIs (DataForSEO, author reputation) - ensure API keys are configured
- Healthline is the primary benchmark, but you can test with other industry leaders if specified
- Each workshop session focuses on ONE metric at a time for clarity and thoroughness
