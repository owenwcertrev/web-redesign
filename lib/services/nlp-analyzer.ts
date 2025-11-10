/**
 * NLP Analyzer Service
 *
 * Uses OpenAI to analyze content quality, tone, experience signals, and AI-generated patterns.
 * Helps identify promotional language, lack of real experience, and AI-generated content.
 */

import OpenAI from 'openai'

export interface NLPAnalysisResult {
  toneScore: number // 0-10: Factual (10) vs Promotional (0)
  experienceScore: number // 0-10: Strong first-person experience signals
  expertiseDepthScore: number // 0-10: Vocabulary sophistication and technical accuracy
  aiContentScore: number // 0-10: Human-written (10) vs AI-generated (0)
  grammarQualityScore: number // 0-10: Grammar and writing quality
  overallScore: number // 0-100: Composite quality score
  analysis: string // Human-readable summary
  flags: string[] // Specific issues detected
}

/**
 * Analyzes page content using OpenAI NLP
 */
export async function analyzeContentWithNLP(
  content: string,
  title: string,
  wordCount: number
): Promise<NLPAnalysisResult | null> {
  // Skip if no API key configured
  if (!process.env.OPENAI_API_KEY) {
    console.warn('[NLP Analyzer] OpenAI API key not configured, skipping NLP analysis')
    return null
  }

  // Skip if content is too short (not enough to analyze)
  if (wordCount < 100) {
    console.warn('[NLP Analyzer] Content too short for NLP analysis (< 100 words)')
    return null
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Truncate content to avoid excessive API costs (max ~2000 words)
    const truncatedContent = truncateText(content, 2000)

    // Construct analysis prompt
    const prompt = buildAnalysisPrompt(title, truncatedContent, wordCount)

    // Call OpenAI API with GPT-4o-mini (cost-effective)
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert content quality analyst specializing in E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) evaluation for Google SEO. Analyze content objectively and provide structured scores.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3, // Low temperature for consistent scoring
      max_tokens: 800,
      response_format: { type: 'json_object' },
    })

    const resultText = response.choices[0]?.message?.content
    if (!resultText) {
      throw new Error('No response from OpenAI API')
    }

    // Parse JSON response
    const parsed = JSON.parse(resultText)

    // Validate and normalize scores
    const result: NLPAnalysisResult = {
      toneScore: normalizeScore(parsed.toneScore),
      experienceScore: normalizeScore(parsed.experienceScore),
      expertiseDepthScore: normalizeScore(parsed.expertiseDepthScore),
      aiContentScore: normalizeScore(parsed.aiContentScore),
      grammarQualityScore: normalizeScore(parsed.grammarQualityScore),
      overallScore: 0, // Will calculate below
      analysis: parsed.analysis || 'No analysis provided',
      flags: Array.isArray(parsed.flags) ? parsed.flags : [],
    }

    // Calculate overall score (0-100)
    result.overallScore = Math.round(
      (result.toneScore * 0.2 +
        result.experienceScore * 0.25 +
        result.expertiseDepthScore * 0.25 +
        result.aiContentScore * 0.2 +
        result.grammarQualityScore * 0.1) *
        10
    )

    console.log(`[NLP Analyzer] Analysis complete - Overall score: ${result.overallScore}/100`)

    return result
  } catch (error) {
    console.error('[NLP Analyzer] Error during analysis:', error)
    return null // Graceful fallback - continue without NLP analysis
  }
}

/**
 * Builds the analysis prompt for OpenAI
 */
function buildAnalysisPrompt(title: string, content: string, wordCount: number): string {
  return `Analyze this web content for E-E-A-T quality. Provide scores (0-10 scale) and flags.

**TITLE:** ${title}

**CONTENT (${wordCount} words):**
${content}

**REQUIRED JSON OUTPUT FORMAT:**
{
  "toneScore": <0-10, where 10=purely factual/educational, 0=highly promotional/salesy>,
  "experienceScore": <0-10, where 10=strong first-person experience/case studies, 0=no real experience signals>,
  "expertiseDepthScore": <0-10, where 10=sophisticated vocabulary/technical depth, 0=superficial/basic>,
  "aiContentScore": <0-10, where 10=clearly human-written with unique voice, 0=obvious AI patterns>,
  "grammarQualityScore": <0-10, where 10=excellent grammar/writing, 0=poor grammar/errors>,
  "analysis": "<2-3 sentence summary of overall quality>",
  "flags": [<array of specific issues: "promotional_language", "ai_generated_patterns", "lacks_experience_signals", "superficial_content", "grammar_errors", "generic_content", "clickbait_tone", etc.>]
}

**SCORING GUIDELINES:**

**Tone Score:**
- 10: Pure informational/educational content, no sales pitch
- 7-9: Mostly factual with minimal promotional elements
- 4-6: Mix of information and promotion
- 1-3: Heavy sales focus, exaggerated claims
- 0: Pure advertising copy

**Experience Score:**
- 10: Multiple first-person accounts, detailed case studies, specific personal examples
- 7-9: Some first-person language and real experiences
- 4-6: Generic examples without personal experience
- 1-3: No personal experience signals, only third-party information
- 0: Completely lacks any experience markers

**Expertise Depth Score:**
- 10: Deep technical knowledge, sophisticated terminology, nuanced analysis
- 7-9: Good technical content with proper terminology
- 4-6: Surface-level coverage of topics
- 1-3: Basic/beginner content with minimal depth
- 0: Extremely superficial or inaccurate

**AI Content Score:**
- 10: Unique human voice, natural flow, authentic examples
- 7-9: Mostly human-written with good authenticity
- 4-6: Some AI patterns but still acceptable
- 1-3: Strong AI patterns (repetitive structure, generic phrasing, lack of personality)
- 0: Obvious AI-generated content (formulaic, robotic, generic)

**Grammar Quality Score:**
- 10: Flawless grammar, excellent sentence structure
- 7-9: Minor issues but generally well-written
- 4-6: Several grammar issues but readable
- 1-3: Frequent errors affecting readability
- 0: Severe grammar problems

Return ONLY valid JSON.`
}

/**
 * Truncates text to a maximum word count
 */
function truncateText(text: string, maxWords: number): string {
  const words = text.split(/\s+/)
  if (words.length <= maxWords) {
    return text
  }
  return words.slice(0, maxWords).join(' ') + '...'
}

/**
 * Normalizes a score to 0-10 range
 */
function normalizeScore(score: any): number {
  const num = parseFloat(score)
  if (isNaN(num)) return 0
  return Math.max(0, Math.min(10, num))
}

/**
 * Gets a human-readable description of NLP analysis quality
 */
export function getNLPQualityDescription(result: NLPAnalysisResult | null): string {
  if (!result) {
    return 'NLP analysis not available'
  }

  if (result.overallScore >= 80) {
    return 'Excellent content quality with strong authenticity'
  } else if (result.overallScore >= 60) {
    return 'Good content quality with minor issues'
  } else if (result.overallScore >= 40) {
    return 'Moderate content quality, could improve authenticity'
  } else {
    return 'Low content quality with significant authenticity concerns'
  }
}
