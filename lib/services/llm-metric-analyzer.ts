/**
 * LLM Metric Analyzer Service
 *
 * Uses GPT-4 to provide context-aware analysis of individual E-E-A-T metrics.
 * Complements regex detection with deeper understanding of credentials, experience, and professional context.
 */

import OpenAI from 'openai'
import * as cheerio from 'cheerio'
import type { PageAnalysis } from './url-analyzer'

export interface LLMMetricResult {
  score: number // Actual score for the metric (0 to maxScore)
  confidence: number // Confidence level 0-1
  reasoning: string // Explanation of the score
  detectedSignals: string[] // Specific signals found
  detectedBy: 'llm'
}

/**
 * Fetches author bio content from URL with timeout
 * Returns bio text or null if fetch fails
 */
async function fetchAuthorBio(url: string, timeout: number = 3000): Promise<string | null> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; EEATBot/1.0; +https://certrev.com)'
      }
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      return null
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // Remove script, style, nav, footer
    $('script, style, nav, footer, header').remove()

    // Get text from main content areas
    const bioText = $('main, article, .bio, .author-bio, .about, [class*="bio"], [class*="about"]')
      .first()
      .text()
      .trim()

    // If no specific bio section, get body text
    const text = bioText || $('body').text().trim()

    // Clean and truncate to ~500 words
    return text
      .replace(/\s+/g, ' ')
      .substring(0, 2500)
  } catch (error) {
    // Timeout or fetch error - return null gracefully
    return null
  }
}

/**
 * Analyzes E1 (First-person narratives / Experience signals) using GPT-4
 *
 * SCOPE (2025-01): E1 detects CONTENT-BASED experience signals ONLY
 * - First-person experience narratives in content
 * - Professional voice in content ("Our research team...", "10+ years practicing")
 * - Institutional experience statements in content
 *
 * DOES NOT DETECT (handled by other metrics):
 * - Author credentials (MD, PhD, CFA) → X1
 * - Expert reviewers in schema → E2/X2
 * - Author bios or professional titles → X1
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

    // Build E1-specific analysis prompt (no author bio fetching - that's X1's domain)
    const prompt = buildE1AnalysisPrompt(pageAnalysis, contentSample)

    // Call GPT-4o with structured output (supports JSON mode, faster & cheaper than GPT-4)
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
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
 * SCOPE FIX (2025-01): Only analyze CONTENT, not author metadata
 */
function buildE1AnalysisPrompt(
  pageAnalysis: PageAnalysis,
  contentSample: string
): string {
  const title = pageAnalysis.title || 'Untitled'

  return `Analyze this content for **E1: First-person narratives / Experience signals** (max 4 points).

**CRITICAL SCOPE DEFINITION:**
E1 measures experience signals **IN THE CONTENT TEXT ONLY**. DO NOT analyze author names, credentials, or bios.

**What E1 DETECTS (in content):**
1. ✅ First-person experience narratives ("In my experience...", "I've observed...", "I've treated...")
2. ✅ Professional voice in content ("10+ years practicing medicine", "decades of clinical work")
3. ✅ Institutional voice in content ("Our research team", "Our study found", "Our data shows")
4. ✅ Contextual experience statements ("treating patients for 20 years", "building ML systems at Google")

**What E1 DOES NOT DETECT (handled by other metrics):**
- ❌ Author names or credentials (MD, PhD, CFA) → Handled by X1
- ❌ Expert reviewers → Handled by E2/X2
- ❌ Author bio pages → Handled by X1

**CONTENT TO ANALYZE:**

**Title:** ${title}

**Content Sample (first ~1000 words):**
${contentSample.substring(0, 5000)}

---

**SCORING GUIDELINES:**

**4 points (Excellent):**
- Strong first-person experience narratives with specific examples
- Multiple professional voice indicators ("10+ years", "our research", "treating patients")
- Clear demonstration of hands-on expertise IN THE CONTENT

**3 points (Good):**
- Substantial first-person experience content OR institutional voice
- Professional context mentioned in content
- Clear practical experience demonstrated

**2 points (Needs Improvement):**
- Some professional signals in content (years experience mentioned, institutional voice)
- Limited first-person narratives
- Experience implied but not strongly demonstrated

**1 point (Poor):**
- Minimal experience signals in content
- Vague or generic professional statements

**0 points (None):**
- No identifiable experience signals in content
- Pure third-person factual writing with no experience context

---

**IMPORTANT CONSIDERATIONS:**

1. **Content-only analysis:** ONLY look at the content text. Ignore author bylines, credentials, or any metadata.

2. **First-person indicators:** "In my practice", "I've found", "We've observed", "From my experience"

3. **Professional voice:** "10+ years", "decades of experience", "board-certified", "licensed practitioner" WITHIN CONTENT

4. **Institutional voice:** "Our research team", "Our analysis shows", "Our editorial board", "Our study found"

5. **Context matters:** "Treating patients for 20 years in cardiology" = strong content-based experience

6. **International patterns:** Recognize experience statements in German, French, Spanish, Italian

---

**REQUIRED JSON OUTPUT:**

{
  "score": 0-4,
  "confidence": 0.0-1.0,
  "reasoning": "Brief explanation of score focusing on CONTENT signals (2-3 sentences)",
  "detectedSignals": ["signal1", "signal2", "signal3"]
}

**Examples of detectedSignals (content-based only):**
- "First-person narrative: 'In my practice treating patients...' found 3 times"
- "Professional voice: '15+ years of clinical experience' mentioned in content"
- "Institutional voice: 'Our research team analyzed...' found"
- "Experience context: 'treating over 10,000 patients' mentioned"

Provide your analysis now. Remember: ONLY analyze content text, NOT author metadata.`
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
