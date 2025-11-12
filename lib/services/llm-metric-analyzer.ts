/**
 * LLM Metric Analyzer Service
 *
 * Uses GPT-4 to provide context-aware analysis of individual E-E-A-T metrics.
 * Complements regex detection with deeper understanding of credentials, experience, and professional context.
 */

import OpenAI from 'openai'
import type { PageAnalysis } from './url-analyzer'

export interface LLMMetricResult {
  score: number // Actual score for the metric (0 to maxScore)
  confidence: number // Confidence level 0-1
  reasoning: string // Explanation of the score
  detectedSignals: string[] // Specific signals found
  detectedBy: 'llm'
}

/**
 * Analyzes E1 (First-person narratives / Experience signals) using GPT-4
 *
 * Detects:
 * - Professional credentials across all verticals
 * - Years of experience statements
 * - First-person experience narratives
 * - Institutional/professional context
 * - Implied expertise from role descriptions
 */
export async function analyzeE1WithGPT4(
  pageAnalysis: PageAnalysis,
  contentSample: string
): Promise<LLMMetricResult | null> {
  // Skip if no API key or LLM scoring disabled
  if (!process.env.OPENAI_API_KEY) {
    return null
  }

  if (process.env.ENABLE_LLM_SCORING !== 'true') {
    return null
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Build E1-specific analysis prompt
    const prompt = buildE1AnalysisPrompt(pageAnalysis, contentSample)

    // Call GPT-4 with structured output
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      temperature: 0.3, // Low temperature for consistent scoring
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: 'You are an E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) content quality analyst. Analyze content for experience signals according to Google\'s quality guidelines.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
    })

    const result = response.choices[0]?.message?.content
    if (!result) {
      throw new Error('No response from GPT-4')
    }

    // Parse and validate response
    const parsed = JSON.parse(result)

    return {
      score: normalizeScore(parsed.score, 4), // E1 max is 4 points
      confidence: Math.min(Math.max(parsed.confidence || 0.5, 0), 1),
      reasoning: parsed.reasoning || 'No reasoning provided',
      detectedSignals: Array.isArray(parsed.detectedSignals) ? parsed.detectedSignals : [],
      detectedBy: 'llm'
    }
  } catch (error) {
    console.error('[LLM E1 Analyzer] Error:', error)
    return null
  }
}

/**
 * Builds the analysis prompt for E1 (Experience signals)
 */
function buildE1AnalysisPrompt(pageAnalysis: PageAnalysis, contentSample: string): string {
  const authors = pageAnalysis.authors || []
  const title = pageAnalysis.title || 'Untitled'

  // Format author information
  const authorsText = authors.length > 0
    ? authors.map(a => `- ${a.name}${a.credentials ? ` (${a.credentials})` : ''}`).join('\n')
    : 'No authors listed'

  return `Analyze this content for **E1: First-person narratives / Experience signals** (max 4 points).

**METRIC DEFINITION:**
E1 measures demonstrated first-hand experience through:
1. Professional credentials (ANY field: medical, finance, tech, law, food, etc.)
2. Years of professional experience mentioned
3. First-person narratives ("In my practice...", "I've found...")
4. Institutional/professional context ("our research", "built at Google")
5. Expert reviewer presence
6. Professional roles indicating direct experience

**CONTENT TO ANALYZE:**

**Title:** ${title}

**Authors:**
${authorsText}

**Content Sample (first ~500 words):**
${contentSample.substring(0, 2500)}

---

**SCORING GUIDELINES:**

**4 points (Excellent):**
- 2+ credentialed authors/contributors with clear professional backgrounds
- OR strong first-person experience narratives with specific examples
- OR combination of credentials + professional context

**3 points (Good):**
- 1-2 credentialed professional(s) identified
- OR substantial first-person experience content
- Clear professional authority demonstrated

**2 points (Needs Improvement):**
- Some professional signals (e.g., job title, years experience)
- OR limited first-person narratives
- Experience implied but not strongly demonstrated

**1 point (Poor):**
- Minimal experience signals
- Generic author info without credentials

**0 points (None):**
- No identifiable experience signals
- Anonymous or no author attribution

---

**IMPORTANT CONSIDERATIONS:**

1. **Cross-vertical credentials:** Recognize credentials from ALL fields:
   - Medical: MD, RD, RN, PA-C, BSc, MS
   - Finance: CFA, CFP, CPA, Series 7/65
   - Tech: Software Engineer, "10 years at Google", PhD CS
   - Law: JD, Esq, Attorney, Bar Certified
   - Food: Chef, Culinary Institute, James Beard
   - Business: CEO, Founder, VP, Director
   - Any professional license or certification

2. **Context matters:** "10+ years building ML systems at Google" = strong experience even without formal credential

3. **Institutional voice:** "Our research team" or "Our editorial board" indicates organizational experience

4. **Implied expertise:** "Board-certified cardiologist treating patients for 20 years" = clear professional experience

---

**REQUIRED JSON OUTPUT:**

{
  "score": 0-4,
  "confidence": 0.0-1.0,
  "reasoning": "Brief explanation of score (2-3 sentences)",
  "detectedSignals": ["signal1", "signal2", "signal3"]
}

**Examples of detectedSignals:**
- "Author: Jane Smith, CFA, CFP - finance credentials"
- "10+ years professional experience mentioned"
- "First-person narrative: 'In my practice...' found 3 times"
- "Expert reviewer: Dr. John Doe, MD"
- "Institutional voice: 'our research team' mentioned"

Provide your analysis now.`
}

/**
 * Normalize score to ensure it's within valid range
 */
function normalizeScore(score: number, maxScore: number): number {
  if (typeof score !== 'number' || isNaN(score)) {
    return 0
  }
  return Math.min(Math.max(score, 0), maxScore)
}

/**
 * Truncate text to maximum word count
 */
function truncateText(text: string, maxWords: number): string {
  const words = text.split(/\s+/)
  if (words.length <= maxWords) {
    return text
  }
  return words.slice(0, maxWords).join(' ') + '...'
}
