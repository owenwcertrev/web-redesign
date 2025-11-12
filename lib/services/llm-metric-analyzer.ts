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

    // Fetch author bios in parallel (with timeout)
    const authors = pageAnalysis.authors || []
    const authorBios = await Promise.allSettled(
      authors
        .filter(a => a.url) // Only fetch if URL exists
        .map(async (author) => ({
          name: author.name,
          bio: await fetchAuthorBio(author.url!)
        }))
    )

    // Extract successful bio fetches
    const bios: Array<{name: string, bio: string}> = []
    for (const result of authorBios) {
      if (result.status === 'fulfilled' && result.value.bio !== null) {
        bios.push({
          name: result.value.name,
          bio: result.value.bio
        })
      }
    }

    // Build E1-specific analysis prompt
    const prompt = buildE1AnalysisPrompt(pageAnalysis, contentSample, bios)

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
 */
function buildE1AnalysisPrompt(
  pageAnalysis: PageAnalysis,
  contentSample: string,
  authorBios: Array<{name: string, bio: string}> = []
): string {
  const authors = pageAnalysis.authors || []
  const title = pageAnalysis.title || 'Untitled'

  // Format author information
  const authorsText = authors.length > 0
    ? authors.map(a => `- ${a.name}${a.credentials ? ` (${a.credentials})` : ''}`).join('\n')
    : 'No authors listed'

  // Format author bio information
  const biosText = authorBios.length > 0
    ? authorBios.map(bio => `**${bio.name}:**\n${bio.bio}\n`).join('\n')
    : 'No author bios available'

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

**Author Bios (for cross-validation):**
${biosText}

**Content Sample (first ~1000 words):**
${contentSample.substring(0, 5000)}

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

1. **Cross-vertical credentials:** Recognize credentials from ALL fields and languages:
   - Medical: MD, RD, RN, PA-C, BSc, MS, Facharzt (DE), Docteur (FR)
   - Finance: CFA, CFP, CPA, Series 7/65, Chartered Accountant
   - Tech: Software Engineer, "10 years at Google", PhD CS, Dipl.-Ing. (DE), Ingénieur (FR)
   - Law: JD, Esq, Attorney, Maître (FR), Rechtsanwalt (DE)
   - Food: Chef, Culinary Institute, James Beard
   - Business: CEO, Founder, VP, Director, Licenciado (ES), Dottore (IT)
   - International: Dr., Prof., Eng., any professional post-nominal

2. **Context matters:** "10+ years building ML systems at Google" = strong experience even without formal credential

3. **Institutional voice:** "Our research team" or "Our editorial board" indicates organizational experience

4. **Implied expertise:** "Board-certified cardiologist treating patients for 20 years" = clear professional experience

5. **Author bio cross-validation:** If author bios are provided, use them to validate credentials and expertise relevant to the content topic

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
