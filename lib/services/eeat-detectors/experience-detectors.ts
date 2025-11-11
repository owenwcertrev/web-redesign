/**
 * Experience Detectors (E1-E7)
 * Automated detection for first-hand perspective & recency signals
 */

import type { PageAnalysis } from '../url-analyzer'
import type { NLPAnalysisResult } from '../nlp-analyzer'
import type { EEATVariable, EEATEvidence } from '../../types/blog-analysis'
import type { BlogInsights } from '../../types/blog-analysis'
import { EEAT_VARIABLES } from '../../eeat-config'

/**
 * E1: First-person narratives
 * Detect "I/we/my/our" in context of experience/practice/observation
 */
export function detectFirstPersonNarratives(
  pageAnalysis: PageAnalysis,
  nlpAnalysis?: NLPAnalysisResult
): EEATVariable {
  const config = EEAT_VARIABLES.experience.find(v => v.id === 'E1')!
  const evidence: EEATEvidence[] = []
  let score = 0

  // Use NLP analysis if available
  if (nlpAnalysis?.experienceScore) {
    score = Math.min(config.maxScore, (nlpAnalysis.experienceScore / 10) * config.maxScore)
    evidence.push({
      type: 'metric',
      value: `${nlpAnalysis.experienceScore}/10 experience signals detected`,
      confidence: nlpAnalysis.experienceScore / 10
    })
  } else {
    // Fallback: regex patterns for first-person experience
    const text = pageAnalysis.contentText?.toLowerCase() || ''

    // High-confidence experience patterns (specific contexts)
    const strongExperiencePatterns = [
      /\b(in my experience|from my experience|in our experience|from our experience)\b/gi,
      /\b(my practice|our practice|my clinic|our clinic|my patients|our patients)\b/gi,
      /\b(in my work|in our work|my research|our research|my study|our study)\b/gi,
      /\b(my observation|our observation|i observed|we observed|i noticed|we noticed)\b/gi,
      /\b(i've seen|we've seen|i've found|we've found|i've worked with|we've worked with)\b/gi,
      /\b(based on my|based on our|through my|through our)\s+(experience|work|practice|research|testing)\b/gi
    ]

    // Medium-confidence patterns (recommendation/opinion based on experience)
    const mediumExperiencePatterns = [
      /\b(i recommend|we recommend|i suggest|we suggest)\b(?!\s+(checking|considering|avoiding|researching)\s+(competitors|alternatives|other options))/gi,
      /\b(from my perspective|in my opinion|in our opinion)\b/gi,
      /\b(i (believe|think).*based on)\b/gi
    ]

    let strongMatchCount = 0
    let mediumMatchCount = 0

    // Count strong matches (weighted more)
    strongExperiencePatterns.forEach(pattern => {
      const matches = text.match(pattern)
      if (matches) {
        strongMatchCount += matches.length
        if (strongMatchCount <= 3) { // Only show first 3 to avoid spam
          evidence.push({
            type: 'snippet',
            value: matches.slice(0, 3).join(', '),
            label: 'First-person experience phrases'
          })
        }
      }
    })

    // Count medium matches
    mediumExperiencePatterns.forEach(pattern => {
      const matches = text.match(pattern)
      if (matches) {
        mediumMatchCount += matches.length
      }
    })

    // Calculate weighted match count (strong matches count as 1.5x)
    const weightedMatchCount = (strongMatchCount * 1.5) + mediumMatchCount

    // Score based on weighted match frequency (0-4 points)
    if (weightedMatchCount >= 12) score = config.maxScore
    else if (weightedMatchCount >= 7) score = 3
    else if (weightedMatchCount >= 3) score = 2
    else if (weightedMatchCount >= 1) score = 1
  }

  const status = getVariableStatus(score, config)

  return {
    id: config.id,
    name: config.name,
    description: config.description,
    maxScore: config.maxScore,
    actualScore: score,
    status,
    evidence,
    recommendation: score < config.thresholds.good
      ? 'Add more first-person narratives and case examples to demonstrate practical experience'
      : undefined,
    detectionMethod: config.detectionMethod
  }
}

/**
 * E2: Author perspective blocks
 * Detect sections like "Reviewer's Note", "Expert's Opinion", "Author's Perspective"
 */
export function detectAuthorPerspectiveBlocks(pageAnalysis: PageAnalysis): EEATVariable {
  const config = EEAT_VARIABLES.experience.find(v => v.id === 'E2')!
  const evidence: EEATEvidence[] = []
  let score = 0

  const text = pageAnalysis.contentText || ''
  const headings = pageAnalysis.headings || { h1: [], h2: [], h3: [] }

  // Check for perspective block indicators in headings or bold text
  const perspectivePatterns = [
    /\b(reviewer'?s? note|editor'?s? note|expert'?s? note)\b/gi,
    /\b(author'?s? perspective|expert perspective|professional perspective)\b/gi,
    /\b(my take|our take|expert opinion|professional opinion)\b/gi,
    /\b(clinical perspective|practitioner'?s? view)\b/gi
  ]

  // Check headings first (stronger signal) - combine all heading levels
  const allHeadings = [...headings.h1, ...headings.h2, ...headings.h3]
  allHeadings.forEach(headingText => {
    perspectivePatterns.forEach(pattern => {
      if (pattern.test(headingText)) {
        score += 1.5
        evidence.push({
          type: 'snippet',
          value: headingText,
          label: 'Perspective section heading'
        })
      }
    })
  })

  // Check for perspective blocks in text
  perspectivePatterns.forEach(pattern => {
    const matches = text.match(pattern)
    if (matches) {
      score += 0.5 * matches.length
      evidence.push({
        type: 'snippet',
        value: matches.slice(0, 2).join(', '),
        label: 'Perspective indicators in text'
      })
    }
  })

  // Cap at maxScore
  score = Math.min(score, config.maxScore)

  const status = getVariableStatus(score, config)

  return {
    id: config.id,
    name: config.name,
    description: config.description,
    maxScore: config.maxScore,
    actualScore: score,
    status,
    evidence,
    recommendation: score < config.thresholds.good
      ? 'Add reviewer or author perspective sections to provide expert insights'
      : undefined,
    detectionMethod: config.detectionMethod
  }
}

/**
 * E3: Original assets
 * Detect brand-owned images, charts, custom data (vs stock photos)
 */
export function detectOriginalAssets(pageAnalysis: PageAnalysis): EEATVariable {
  const config = EEAT_VARIABLES.experience.find(v => v.id === 'E3')!
  const evidence: EEATEvidence[] = []
  let score = 0

  const images = pageAnalysis.images || { total: 0, withAlt: 0 }
  const text = pageAnalysis.contentText?.toLowerCase() || ''

  // Check for original data indicators in text
  const originalityPatterns = [
    /\b(our data|our research|our study|our analysis|our findings)\b/gi,
    /\b(custom chart|custom graph|original research|proprietary data)\b/gi,
    /\b(clinic photos|practice photos|our team|our facility)\b/gi
  ]

  originalityPatterns.forEach(pattern => {
    const matches = text.match(pattern)
    if (matches) {
      score += 0.5
      evidence.push({
        type: 'snippet',
        value: matches.slice(0, 2).join(', '),
        label: 'Original asset indicators'
      })
    }
  })

  // Check image metrics (alt text indicates custom/original content)
  if (images.total > 0) {
    const altTextRatio = images.withAlt / images.total

    // High alt text ratio suggests custom images with proper descriptions
    if (altTextRatio >= 0.8 && images.total >= 3) {
      score += 1.5
      evidence.push({
        type: 'metric',
        value: `${images.total} images with ${Math.round(altTextRatio * 100)}% alt text coverage`,
        label: 'Strong image optimization',
        confidence: altTextRatio
      })
    } else if (altTextRatio >= 0.5 || images.total >= 2) {
      score += 0.8
      evidence.push({
        type: 'metric',
        value: `${images.total} images (${Math.round(altTextRatio * 100)}% with alt text)`,
        label: 'Basic image presence'
      })
    }
  }

  // Cap at maxScore
  score = Math.min(score, config.maxScore)

  const status = getVariableStatus(score, config)

  return {
    id: config.id,
    name: config.name,
    description: config.description,
    maxScore: config.maxScore,
    actualScore: score,
    status,
    evidence,
    recommendation: score < config.thresholds.good
      ? 'Use more original images, charts, and data from your own research or practice'
      : undefined,
    detectionMethod: config.detectionMethod
  }
}

/**
 * E4: Freshness
 * Check dateModified in schema or visible update notes within 12 months
 */
export function detectFreshness(pageAnalysis: PageAnalysis): EEATVariable {
  const config = EEAT_VARIABLES.experience.find(v => v.id === 'E4')!
  const evidence: EEATEvidence[] = []
  let score = 0

  const schema = pageAnalysis.schemaMarkup || []
  const now = new Date()
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 12, now.getDate())

  // Check schema dateModified or datePublished
  let mostRecentDate: Date | null = null

  schema.forEach(s => {
    const dateModified = s.data?.dateModified || s.data?.dateUpdated
    const datePublished = s.data?.datePublished

    if (dateModified) {
      const date = new Date(dateModified)
      if (!isNaN(date.getTime())) {
        if (!mostRecentDate || date > mostRecentDate) {
          mostRecentDate = date
        }
      }
    } else if (datePublished) {
      const date = new Date(datePublished)
      if (!isNaN(date.getTime())) {
        if (!mostRecentDate || date > mostRecentDate) {
          mostRecentDate = date
        }
      }
    }
  })

  if (mostRecentDate !== null) {
    const recentDate = mostRecentDate as Date
    const monthsOld = Math.floor((now.getTime() - recentDate.getTime()) / (1000 * 60 * 60 * 24 * 30))

    if (recentDate >= twelveMonthsAgo) {
      // Within 12 months - excellent freshness
      if (monthsOld <= 3) score = config.maxScore // Very fresh (0-3 months)
      else if (monthsOld <= 6) score = 4 // Fresh (3-6 months)
      else score = 3 // Recent (6-12 months)
    } else {
      // Older than 12 months
      if (monthsOld <= 24) score = 2 // 1-2 years old
      else score = 1 // 2+ years old
    }

    evidence.push({
      type: 'metric',
      value: `Last updated ${monthsOld} months ago`,
      label: recentDate.toLocaleDateString()
    })
  } else {
    // No date found
    evidence.push({
      type: 'note',
      value: 'No dateModified or datePublished found in schema'
    })
    score = 0
  }

  const status = getVariableStatus(score, config)

  return {
    id: config.id,
    name: config.name,
    description: config.description,
    maxScore: config.maxScore,
    actualScore: score,
    status,
    evidence,
    recommendation: score < config.thresholds.good
      ? 'Add dateModified to schema markup and update content regularly (ideally every 6-12 months)'
      : undefined,
    detectionMethod: config.detectionMethod
  }
}

/**
 * E5: Experience markup
 * Check for MedicalWebPage schema and "What we do" sections
 */
export function detectExperienceMarkup(pageAnalysis: PageAnalysis): EEATVariable {
  const config = EEAT_VARIABLES.experience.find(v => v.id === 'E5')!
  const evidence: EEATEvidence[] = []
  let score = 0

  const schema = pageAnalysis.schemaMarkup || []
  const headings = pageAnalysis.headings || { h1: [], h2: [], h3: [] }

  // Check for experience-related schema types
  const experienceSchemaTypes = ['MedicalWebPage', 'HealthTopicContent']

  schema.forEach(s => {
    if (s.type && experienceSchemaTypes.includes(s.type)) {
      score += 1
      evidence.push({
        type: 'snippet',
        value: s.type,
        label: 'Experience-related schema'
      })
    }
  })

  // Check for "What we do" or similar sections
  const experienceSectionPatterns = [
    /\b(what we do|who we are|our approach|our methodology|our process)\b/gi,
    /\b(how we help|why choose us|our expertise|our background)\b/gi
  ]

  const allHeadings = [...headings.h1, ...headings.h2, ...headings.h3]
  allHeadings.forEach(headingText => {
    experienceSectionPatterns.forEach(pattern => {
      if (pattern.test(headingText)) {
        score += 0.5
        evidence.push({
          type: 'snippet',
          value: headingText,
          label: 'Experience section heading'
        })
      }
    })
  })

  // Cap at maxScore
  score = Math.min(score, config.maxScore)

  const status = getVariableStatus(score, config)

  return {
    id: config.id,
    name: config.name,
    description: config.description,
    maxScore: config.maxScore,
    actualScore: score,
    status,
    evidence,
    recommendation: score < config.thresholds.good
      ? 'Add MedicalWebPage schema for YMYL content and include "What we do" sections'
      : undefined,
    detectionMethod: config.detectionMethod
  }
}

/**
 * E6: Publishing consistency
 * Calculate from blog insights - regular updates demonstrate ongoing experience
 */
export function detectPublishingConsistency(blogInsights?: BlogInsights): EEATVariable {
  const config = EEAT_VARIABLES.experience.find(v => v.id === 'E6')!
  const evidence: EEATEvidence[] = []
  let score = 0

  if (!blogInsights || !blogInsights.publishingFrequency) {
    return createEmptyVariable(config, 'Blog analysis not available')
  }

  const freq = blogInsights.publishingFrequency
  const postsPerMonth = freq.postsPerMonth ?? 0

  // Score based on publishing frequency
  if (postsPerMonth >= 4 && postsPerMonth <= 8) {
    score = config.maxScore // Optimal range
  } else if (postsPerMonth >= 2 && postsPerMonth <= 12) {
    score = 3 // Good range
  } else if (postsPerMonth >= 1) {
    score = 2 // Acceptable
  } else if (postsPerMonth >= 0.5) {
    score = 1 // Infrequent
  }

  // Trend bonus/penalty
  if (freq.trend === 'increasing') {
    score = Math.min(score + 0.5, config.maxScore)
  } else if (freq.trend === 'decreasing') {
    score = Math.max(score - 0.5, 0)
  }

  evidence.push({
    type: 'metric',
    value: `${postsPerMonth.toFixed(1)} posts/month`,
    label: `Trend: ${freq.trend}`
  })

  if (freq.dateRange.spanMonths > 0) {
    evidence.push({
      type: 'metric',
      value: `${freq.totalPosts} posts over ${freq.dateRange.spanMonths} months`
    })
  }

  const status = getVariableStatus(score, config)

  return {
    id: config.id,
    name: config.name,
    description: config.description,
    maxScore: config.maxScore,
    actualScore: score,
    status,
    evidence,
    recommendation: score < config.thresholds.good
      ? 'Publish 4-8 articles per month to demonstrate consistent, ongoing experience'
      : undefined,
    detectionMethod: config.detectionMethod
  }
}

/**
 * E7: Content freshness rate
 * Percentage of blog posts updated within 12 months
 */
export function detectContentFreshnessRate(blogInsights?: BlogInsights, posts?: any[]): EEATVariable {
  const config = EEAT_VARIABLES.experience.find(v => v.id === 'E7')!
  const evidence: EEATEvidence[] = []
  let score = 0

  if (!posts || posts.length === 0) {
    return createEmptyVariable(config, 'No blog posts available for analysis')
  }

  const now = new Date()
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 12, now.getDate())

  let freshCount = 0
  posts.forEach(post => {
    const pageAnalysis = post.pageAnalysis
    const schema: PageAnalysis['schemaMarkup'] = pageAnalysis?.schemaMarkup || []

    schema.forEach(s => {
      const dateModified = s.data?.dateModified || s.data?.dateUpdated
      if (dateModified) {
        const date = new Date(dateModified)
        if (!isNaN(date.getTime()) && date >= twelveMonthsAgo) {
          freshCount++
        }
      }
    })
  })

  const freshnessRate = freshCount / posts.length

  // Score based on freshness rate
  if (freshnessRate >= 0.7) score = config.maxScore // 70%+ fresh
  else if (freshnessRate >= 0.5) score = 3 // 50-70% fresh
  else if (freshnessRate >= 0.3) score = 2 // 30-50% fresh
  else if (freshnessRate >= 0.1) score = 1 // 10-30% fresh
  else score = 0.5 // <10% fresh

  evidence.push({
    type: 'metric',
    value: `${Math.round(freshnessRate * 100)}% of posts updated in last 12 months`,
    label: `${freshCount} of ${posts.length} posts`
  })

  const status = getVariableStatus(score, config)

  return {
    id: config.id,
    name: config.name,
    description: config.description,
    maxScore: config.maxScore,
    actualScore: score,
    status,
    evidence,
    recommendation: score < config.thresholds.good
      ? 'Update older blog posts regularly to maintain content freshness (target 50%+ in last 12 months)'
      : undefined,
    detectionMethod: config.detectionMethod
  }
}

/**
 * Helper: Get variable status based on score
 */
function getVariableStatus(
  score: number,
  config: typeof EEAT_VARIABLES.experience[0]
): 'excellent' | 'good' | 'needs-improvement' | 'poor' {
  if (score >= config.thresholds.excellent) return 'excellent'
  if (score >= config.thresholds.good) return 'good'
  if (score >= config.thresholds.needsImprovement) return 'needs-improvement'
  return 'poor'
}

/**
 * Helper: Create empty variable for missing data
 */
function createEmptyVariable(
  config: typeof EEAT_VARIABLES.experience[0],
  note: string
): EEATVariable {
  return {
    id: config.id,
    name: config.name,
    description: config.description,
    maxScore: config.maxScore,
    actualScore: 0,
    status: 'poor',
    evidence: [{ type: 'note', value: note }],
    recommendation: 'Insufficient data for analysis',
    detectionMethod: config.detectionMethod
  }
}
