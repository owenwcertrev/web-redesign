/**
 * E-E-A-T Scoring Engine
 * Combines all analysis data to calculate E-E-A-T scores
 */

import { EEAT_CONFIG, calculateOverallScore } from '../eeat-config'
import type { PageAnalysis } from './url-analyzer'
import type { DataForSEOMetrics } from './dataforseo-api'
import type { NLPAnalysisResult } from './nlp-analyzer'
import type { ReputationResult } from './reputation-checker'

export interface EEATScore {
  overall: number
  experience: number
  expertise: number
  authoritativeness: number
  trustworthiness: number
}

export interface EEATAnalysisResult {
  url: string
  scores: EEATScore
  issues: Issue[]
  suggestions: Suggestion[]
  metrics: {
    page: PageAnalysis
    dataforseo: DataForSEOMetrics
  }
}

export interface Issue {
  severity: 'critical' | 'high' | 'medium' | 'low'
  category: 'experience' | 'expertise' | 'authoritativeness' | 'trustworthiness'
  title: string
  description: string
  impact: string
}

export interface Suggestion {
  category: 'experience' | 'expertise' | 'authoritativeness' | 'trustworthiness'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
}

/**
 * Calculates complete E-E-A-T scores from all analysis data
 */
export function calculateEEATScores(
  page: PageAnalysis,
  dataforseo: DataForSEOMetrics,
  nlpAnalysis: NLPAnalysisResult | null = null,
  authorReputations: ReputationResult[] = []
): EEATScore {
  const experience = calculateExperienceScore(page, dataforseo, nlpAnalysis, authorReputations)
  const expertise = calculateExpertiseScore(page, dataforseo, nlpAnalysis, authorReputations)
  const authoritativeness = calculateAuthoritativenessScore(page, dataforseo, authorReputations)
  const trustworthiness = calculateTrustworthinessScore(page, dataforseo)

  return {
    overall: calculateOverallScore({
      experience,
      expertise,
      authoritativeness,
      trustworthiness,
    }),
    experience,
    expertise,
    authoritativeness,
    trustworthiness,
  }
}

/**
 * Estimates domain rank based on on-page quality signals
 * Used for instant analysis when external domain metrics aren't available
 * Returns a score from 0-100 representing estimated domain authority
 */
export function estimateDomainRank(page: PageAnalysis): number {
  let rank = 50 // Start with neutral baseline

  // SSL is table stakes for credible sites (+10)
  if (page.hasSSL) {
    rank += 10
  } else {
    rank -= 15 // Major penalty for no HTTPS
  }

  // Schema markup indicates technical sophistication (+0 to +15)
  if (page.schemaMarkup > 0) {
    if (page.schemaMarkup >= 5) {
      rank += 15 // Comprehensive schema implementation
    } else if (page.schemaMarkup >= 3) {
      rank += 10 // Good schema coverage
    } else {
      rank += 5 // Basic schema present
    }
  }

  // Author attribution indicates editorial standards (+0 to +10)
  if (page.authors.length > 0) {
    rank += 10 // Has clear authorship
  }

  // Citations indicate research-backed content (+0 to +10)
  if (page.citations >= 10) {
    rank += 10 // Well-cited content
  } else if (page.citations >= 5) {
    rank += 5 // Some citations
  }

  // Content depth indicates investment in quality (+0 to +10)
  if (page.wordCount >= 2000) {
    rank += 10 // Comprehensive content
  } else if (page.wordCount >= 1000) {
    rank += 5 // Substantial content
  } else if (page.wordCount < 300) {
    rank -= 5 // Thin content
  }

  // Readability indicates professional writing (+0 to +5)
  if (page.readabilityScore >= 60) {
    rank += 5 // Clear, readable content
  } else if (page.readabilityScore < 30) {
    rank -= 5 // Poor readability
  }

  // Images with proper alt text indicate attention to detail (+0 to +5)
  const imagesWithAlt = page.images.filter(img => img.hasAlt).length
  if (imagesWithAlt >= 5) {
    rank += 5 // Good image optimization
  } else if (imagesWithAlt >= 2) {
    rank += 2 // Some optimization
  }

  // Clamp to 0-100 range
  return Math.max(0, Math.min(100, rank))
}

/**
 * Calculates instant E-E-A-T scores WITHOUT external APIs
 * Uses only page analysis data - no DataForSEO, NLP, or reputation checking
 * Fast, synchronous, suitable for immediate display
 */
export function calculateInstantEEATScores(page: PageAnalysis): EEATScore {
  // Estimate domain rank from on-page quality signals
  const estimatedDomainRank = estimateDomainRank(page)

  // Create estimated metrics for authoritativeness
  // Based on basic page quality signals
  const estimatedMetrics: DataForSEOMetrics = {
    domainRank: estimatedDomainRank, // Smart estimation instead of hardcoded 50
    pageRank: 0,
    backlinks: 0,
    referringDomains: 0,
    referringMainDomains: 0,
    followedBacklinks: 0,
    nofollowedBacklinks: 0,
    govBacklinks: 0,
    eduBacklinks: 0,
    spamScore: 0,
    organicKeywords: 0,
    organicTraffic: 0,
    organicTrafficValue: 0,
  }

  const experience = calculateExperienceScore(page, estimatedMetrics, null, [])
  const expertise = calculateExpertiseScore(page, estimatedMetrics, null, [])
  const authoritativeness = calculateAuthoritativenessScore(page, estimatedMetrics, [])
  const trustworthiness = calculateTrustworthinessScore(page, estimatedMetrics)

  return {
    overall: calculateOverallScore({
      experience,
      expertise,
      authoritativeness,
      trustworthiness,
    }),
    experience,
    expertise,
    authoritativeness,
    trustworthiness,
  }
}

/**
 * Experience Score (0-25)
 * Factors: Author credentials, content quality, citations, NLP analysis, reputation
 * Adjusted to be more lenient for high-authority sites
 */
function calculateExperienceScore(
  page: PageAnalysis,
  dataforseo: DataForSEOMetrics,
  nlpAnalysis: NLPAnalysisResult | null,
  authorReputations: ReputationResult[]
): number {
  let score = 0

  // Author credentials (0-8 points)
  if (page.authors.length > 0) {
    score += 4
    // Bonus for credentials
    if (page.authors.some(a => a.credentials)) {
      score += 2
    }
    // Bonus for schema markup author
    if (page.authors.some(a => a.source === 'schema')) {
      score += 2
    }
  } else if (dataforseo.domainRank >= 85) {
    // High-authority domains get partial credit (assumed experience)
    score += 3
  } else if (dataforseo.domainRank >= 70) {
    score += 2
  }

  // Content quality (0-12 points)
  const wordCount = page.wordCount
  if (wordCount >= EEAT_CONFIG.content.optimalWordCount) {
    score += 6
  } else if (wordCount >= EEAT_CONFIG.content.minWordCount) {
    score += 4
  }

  // More lenient readability scoring (technical content can be harder to read)
  if (page.readabilityScore >= 50 && page.readabilityScore <= 70) {
    score += 3 // Optimal readability
  } else if (page.readabilityScore >= 30 && page.readabilityScore <= 80) {
    score += 2 // Acceptable for technical content
  } else if (page.readabilityScore > 0) {
    score += 1 // At least some readability
  }

  if (page.headings.h2.length >= 3) {
    score += 3
  }

  // Citations with quality weighting (0-5 points)
  // Use quality score if available, otherwise fall back to count
  if (page.citationQuality && page.citationQuality.qualityScore > 0) {
    // Map quality score (0-100) to points (0-5)
    const qualityScore = page.citationQuality.qualityScore
    if (qualityScore >= 80) {
      score += 5 // Excellent quality citations
    } else if (qualityScore >= 60) {
      score += 4 // Good quality citations
    } else if (qualityScore >= 40) {
      score += 3 // Moderate quality citations
    } else if (qualityScore >= 20) {
      score += 2 // Some quality citations
    } else if (page.citations > 0) {
      score += 1 // Has citations but low quality
    }
  } else {
    // Fallback to count-based scoring if quality analysis unavailable
    if (page.citations >= 10) {
      score += 5
    } else if (page.citations >= 5) {
      score += 3
    } else if (page.citations >= 1) {
      score += 2
    }
  }

  // NLP-based experience and tone analysis (0-5 points)
  if (nlpAnalysis) {
    // Experience signals: first-person accounts, case studies, real examples (0-3 points)
    const experienceScore = nlpAnalysis.experienceScore
    if (experienceScore >= 8) {
      score += 3 // Strong first-person experience signals
    } else if (experienceScore >= 6) {
      score += 2 // Some experience signals
    } else if (experienceScore >= 4) {
      score += 1 // Minimal experience signals
    }
    // Scores below 4 get 0 points (lacks real experience)

    // Tone quality: Penalize promotional content, reward factual tone (0-2 points)
    const toneScore = nlpAnalysis.toneScore
    if (toneScore >= 8) {
      score += 2 // Highly factual, educational tone
    } else if (toneScore >= 6) {
      score += 1 // Mostly factual with some promotional elements
    } else if (toneScore <= 3) {
      score -= 2 // Heavy promotional tone is penalized
    }
  }

  // Author reputation boost (0-3 points)
  if (authorReputations.length > 0) {
    const bestReputation = Math.max(...authorReputations.map(r => r.reputationScore))
    if (bestReputation >= 80) {
      score += 3 // Excellent reputation with strong professional presence
    } else if (bestReputation >= 60) {
      score += 2 // Good reputation with verified credentials
    } else if (bestReputation >= 40) {
      score += 1 // Moderate reputation
    }
    // Below 40: no bonus (limited or no professional presence)
  }

  // Quality bonus: Reward comprehensive content with proper structure (0-2 points)
  let qualityBonus = 0
  if (page.wordCount >= 2000 && page.citations >= 5 && page.headings.h2.length >= 3) {
    qualityBonus += 2 // Comprehensive, well-structured, cited content
  } else if ((page.wordCount >= 1000 && page.citations >= 3) || (page.wordCount >= 1500 && page.headings.h2.length >= 2)) {
    qualityBonus += 1 // Good content depth
  }
  score += qualityBonus

  return Math.min(25, score)
}

/**
 * Expertise Score (0-25)
 * Factors: Author credentials, schema markup, citations, domain authority, NLP analysis, reputation
 * Adjusted: High-authority domains get partial credit even without explicit author markup
 */
function calculateExpertiseScore(
  page: PageAnalysis,
  dataforseo: DataForSEOMetrics,
  nlpAnalysis: NLPAnalysisResult | null,
  authorReputations: ReputationResult[]
): number {
  let score = 0

  // Author presence and credentials (0-10 points)
  if (page.authors.length === 0) {
    // Give partial credit for high-authority domains (assumed editorial oversight)
    if (dataforseo.domainRank >= 85) {
      score += 5 // Top-tier sites likely have strict editorial standards
    } else if (dataforseo.domainRank >= 70) {
      score += 4
    } else if (dataforseo.domainRank >= 50) {
      score += 2
    }
  } else {
    score += 5

    // Bonus for multiple authors
    if (page.authors.length > 1) {
      score += 2
    }

    // Bonus for credentials
    if (page.authors.some(a => a.credentials)) {
      score += 3
    }
  }

  // Schema markup (0-6 points)
  const hasRelevantSchema = page.schemaMarkup.some(s =>
    EEAT_CONFIG.schemaTypes.includes(s.type)
  )

  if (hasRelevantSchema) {
    score += 3
  }

  // Bonus for person/organization schema
  if (page.schemaMarkup.some(s => s.type === 'Person' || s.type === 'Organization')) {
    score += 2
  }

  // Bonus for medical/health schema
  if (page.schemaMarkup.some(s => s.type === 'MedicalWebPage' || s.type === 'HealthTopicContent')) {
    score += 1
  }

  // Citations/references with quality weighting (0-4 points)
  // Use quality score if available, otherwise fall back to count
  if (page.citationQuality && page.citationQuality.qualityScore > 0) {
    // Map quality score (0-100) to points (0-4)
    const qualityScore = page.citationQuality.qualityScore
    if (qualityScore >= 80) {
      score += 4 // Excellent quality citations
    } else if (qualityScore >= 60) {
      score += 3 // Good quality citations
    } else if (qualityScore >= 40) {
      score += 2 // Moderate quality citations
    } else if (page.citations > 0) {
      score += 1 // Has citations but low quality
    }
  } else {
    // Fallback to count-based scoring if quality analysis unavailable
    if (page.citations >= 10) {
      score += 4
    } else if (page.citations >= 5) {
      score += 3
    } else if (page.citations >= 1) {
      score += 2
    }
  }

  // Content depth bonus (0-5 points)
  // Comprehensive content suggests expertise
  if (page.wordCount >= 2000) {
    score += 5
  } else if (page.wordCount >= 1000) {
    score += 3
  } else if (page.wordCount >= 500) {
    score += 2
  }

  // NLP-based expertise and authenticity analysis (0-5 points)
  if (nlpAnalysis) {
    // Expertise depth: vocabulary sophistication, technical accuracy (0-3 points)
    const expertiseDepthScore = nlpAnalysis.expertiseDepthScore
    if (expertiseDepthScore >= 8) {
      score += 3 // Deep technical knowledge, sophisticated terminology
    } else if (expertiseDepthScore >= 6) {
      score += 2 // Good technical content
    } else if (expertiseDepthScore >= 4) {
      score += 1 // Surface-level coverage
    }
    // Scores below 4 get 0 points (superficial content)

    // AI content detection: Penalize AI-generated content (0-2 points)
    const aiContentScore = nlpAnalysis.aiContentScore
    if (aiContentScore >= 8) {
      score += 2 // Clear human voice, authentic examples
    } else if (aiContentScore >= 6) {
      score += 1 // Mostly human-written
    } else if (aiContentScore <= 3) {
      score -= 2 // Obvious AI-generated content is penalized
    }
    // Scores 4-5 get 0 points (neutral)
  }

  // Author reputation boost (0-5 points)
  if (authorReputations.length > 0) {
    const bestReputation = Math.max(...authorReputations.map(r => r.reputationScore))

    // Check for specific reputation signals that demonstrate expertise
    const hasPublications = authorReputations.some(r =>
      r.signals.some(s => s.type === 'publication')
    )
    const hasMediaMentions = authorReputations.some(r =>
      r.signals.some(s => s.type === 'media_mention' && s.authority === 'high')
    )

    if (bestReputation >= 80) {
      score += 5 // Excellent reputation with strong professional presence
    } else if (bestReputation >= 60) {
      score += 4 // Good reputation with verified credentials
    } else if (bestReputation >= 40) {
      score += 2 // Moderate reputation
    } else if (bestReputation >= 20) {
      score += 1 // Some reputation
    }

    // Additional bonus for publications (demonstrates expertise)
    if (hasPublications) {
      score += 2
    }
  }

  // Quality bonus: Reward well-researched expert content (0-2 points)
  let qualityBonus = 0
  if (page.wordCount >= 1500 && page.citations >= 8 && page.schemaMarkup.length >= 2) {
    qualityBonus += 2 // Deep, well-researched expert content
  } else if (page.wordCount >= 1000 && page.citations >= 4) {
    qualityBonus += 1 // Good research depth
  }
  score += qualityBonus

  return Math.min(25, score)
}

/**
 * Authoritativeness Score (0-25)
 * Factors: Domain rank (estimated), organic traffic, keyword rankings, citations, author reputation
 * Note: Without backlinks API, using organic performance as authority proxy
 */
function calculateAuthoritativenessScore(
  page: PageAnalysis,
  dataforseo: DataForSEOMetrics,
  authorReputations: ReputationResult[]
): number {
  let score = 0

  // Domain Rank (0-10 points) - Estimated from organic performance
  const domainRank = dataforseo.domainRank
  if (domainRank >= 80) {
    score += 10
  } else if (domainRank >= 60) {
    score += 8
  } else if (domainRank >= 40) {
    score += 6
  } else if (domainRank >= 20) {
    score += 4
  } else {
    score += 2
  }

  // Organic Keywords (0-8 points) - proxy for domain authority
  const keywords = dataforseo.organicKeywords
  if (keywords >= 100000) {
    score += 8
  } else if (keywords >= 10000) {
    score += 6
  } else if (keywords >= 1000) {
    score += 4
  } else if (keywords >= 100) {
    score += 2
  }

  // Organic Traffic (0-7 points) - indicates established authority
  const traffic = dataforseo.organicTraffic
  if (traffic >= 1000000) {
    score += 7
  } else if (traffic >= 100000) {
    score += 5
  } else if (traffic >= 10000) {
    score += 3
  } else if (traffic >= 1000) {
    score += 2
  }

  // Author reputation boost for authoritativeness (0-3 points)
  // Well-known authors with media mentions and professional recognition boost authority
  if (authorReputations.length > 0) {
    const bestReputation = Math.max(...authorReputations.map(r => r.reputationScore))

    // Check for high-authority signals (media mentions, professional profiles)
    const hasHighAuthoritySignals = authorReputations.some(r =>
      r.signals.some(s =>
        (s.type === 'media_mention' || s.type === 'professional_profile') &&
        s.authority === 'high'
      )
    )

    if (bestReputation >= 80 && hasHighAuthoritySignals) {
      score += 3 // Highly recognized authority in the field
    } else if (bestReputation >= 60) {
      score += 2 // Well-established professional
    } else if (bestReputation >= 40) {
      score += 1 // Some professional recognition
    }
  }

  return Math.min(25, score)
}

/**
 * Trustworthiness Score (0-25)
 * Factors: SSL, schema markup, page quality signals, organic presence
 * Note: Spam score not available without backlinks API
 */
function calculateTrustworthinessScore(
  page: PageAnalysis,
  dataforseo: DataForSEOMetrics
): number {
  let score = 0

  // SSL/Security (0-7 points) - Critical trust signal
  if (page.hasSSL) {
    score += 7
  }

  // Schema markup (0-8 points)
  if (page.schemaMarkup.length > 0) {
    score += 4
  }

  if (page.schemaMarkup.length >= 3) {
    score += 2
  }

  // Bonus for Organization schema (shows legitimacy)
  if (page.schemaMarkup.some(s => s.type === 'Organization')) {
    score += 2
  }

  // Organic presence (0-5 points) - proxy for trustworthiness
  // Sites with organic traffic are typically trustworthy
  if (dataforseo.organicKeywords > 10000) {
    score += 5
  } else if (dataforseo.organicKeywords > 1000) {
    score += 3
  } else if (dataforseo.organicKeywords > 100) {
    score += 2
  }

  // Page quality signals (0-5 points)
  if (page.images.total > 0 && (page.images.withAlt / page.images.total) >= 0.8) {
    score += 2 // Good image accessibility
  }

  if (page.metaDescription.length > 0) {
    score += 1
  }

  if (page.headings.h1.length === 1) {
    score += 1 // Exactly one H1 is best practice
  }

  if (page.links.external > 0) {
    score += 1 // Links to external sources
  }

  // Quality bonus: Reward comprehensive trustworthy content (0-3 points)
  let qualityBonus = 0
  if (page.hasSSL && page.schemaMarkup.length >= 3 && page.images.total > 0) {
    qualityBonus += 2 // Professional, well-structured site
    if ((page.images.withAlt / page.images.total) >= 0.8) {
      qualityBonus += 1 // Attention to accessibility details
    }
  } else if (page.hasSSL && page.schemaMarkup.length >= 1) {
    qualityBonus += 1 // Basic professional standards
  }
  score += qualityBonus

  return Math.min(25, score)
}

/**
 * Identifies issues in the analysis
 */
export function identifyIssues(
  page: PageAnalysis,
  dataforseo: DataForSEOMetrics,
  scores: EEATScore,
  nlpAnalysis: NLPAnalysisResult | null = null,
  authorReputations: ReputationResult[] = []
): Issue[] {
  const issues: Issue[] = []

  // Author reputation issues
  if (authorReputations.length > 0) {
    const bestReputation = Math.max(...authorReputations.map(r => r.reputationScore))

    // Check for negative signals
    const hasNegativeSignals = authorReputations.some(r =>
      r.signals.some(s => s.type === 'negative')
    )

    if (hasNegativeSignals) {
      const negativeSignals = authorReputations.flatMap(r =>
        r.signals.filter(s => s.type === 'negative')
      )
      const highAuthorityNegative = negativeSignals.some(s => s.authority === 'high')

      issues.push({
        severity: highAuthorityNegative ? 'critical' : 'high',
        category: 'expertise',
        title: 'Author Reputation Concerns',
        description: `Negative signals detected for author: ${negativeSignals.map(s => s.description).join('; ')}`,
        impact: 'Negative author reputation can severely impact content credibility and E-E-A-T scores.',
      })
    } else if (bestReputation < 20 && page.authors.length > 0) {
      // Low reputation but author is present
      issues.push({
        severity: 'medium',
        category: 'expertise',
        title: 'Limited Author Reputation',
        description: `Author has minimal professional web presence or recognition.`,
        impact: 'Without verifiable credentials or professional presence, expertise is hard to establish.',
      })
    }
  }

  // NLP-based content quality issues
  if (nlpAnalysis) {
    // AI-generated content detection
    if (nlpAnalysis.aiContentScore <= 3) {
      issues.push({
        severity: 'critical',
        category: 'expertise',
        title: 'AI-Generated Content Detected',
        description: 'Content shows strong patterns of AI generation (formulaic structure, generic phrasing, lack of unique voice).',
        impact: 'Google may penalize AI-generated content that lacks expertise and original insights.',
      })
    } else if (nlpAnalysis.aiContentScore <= 5) {
      issues.push({
        severity: 'high',
        category: 'expertise',
        title: 'Potentially AI-Assisted Content',
        description: 'Content shows some AI generation patterns. Consider adding more personal voice and unique examples.',
        impact: 'May reduce perceived expertise and authenticity.',
      })
    }

    // Promotional tone detection
    if (nlpAnalysis.toneScore <= 3) {
      issues.push({
        severity: 'high',
        category: 'experience',
        title: 'Overly Promotional Tone',
        description: 'Content is heavily promotional or sales-focused rather than educational.',
        impact: 'Users and search engines prefer factual, informative content over sales copy.',
      })
    } else if (nlpAnalysis.toneScore <= 5) {
      issues.push({
        severity: 'medium',
        category: 'experience',
        title: 'Mixed Promotional Content',
        description: 'Content contains noticeable promotional elements that may reduce credibility.',
        impact: 'Balance informational value with promotional messaging.',
      })
    }

    // Experience signals
    if (nlpAnalysis.experienceScore <= 3) {
      issues.push({
        severity: 'high',
        category: 'experience',
        title: 'Lacks First-Person Experience',
        description: 'Content has no clear first-person accounts, case studies, or real-world examples.',
        impact: 'Google\'s E-E-A-T guidelines emphasize demonstrable experience with the topic.',
      })
    }

    // Expertise depth
    if (nlpAnalysis.expertiseDepthScore <= 3) {
      issues.push({
        severity: 'high',
        category: 'expertise',
        title: 'Superficial Content',
        description: 'Content lacks technical depth, sophisticated terminology, or nuanced analysis.',
        impact: 'Reduces perceived expertise and authority on the topic.',
      })
    }
  }

  // Critical issues
  if (!page.hasSSL) {
    issues.push({
      severity: 'critical',
      category: 'trustworthiness',
      title: 'No SSL Certificate',
      description: 'Your site is not using HTTPS, which significantly impacts trust and SEO.',
      impact: 'Users and search engines view non-HTTPS sites as insecure.',
    })
  }

  if (page.authors.length === 0) {
    issues.push({
      severity: 'critical',
      category: 'expertise',
      title: 'Missing Author Bylines',
      description: 'No author information detected on the page.',
      impact: 'Google and users cannot verify the expertise behind your content.',
    })
  }

  if (page.schemaMarkup.length === 0) {
    issues.push({
      severity: 'critical',
      category: 'expertise',
      title: 'No Structured Data',
      description: 'No schema markup detected on the page.',
      impact: 'Search engines cannot understand your content\'s context and expertise.',
    })
  }

  // High severity issues
  if (dataforseo.domainRank < 30) {
    issues.push({
      severity: 'high',
      category: 'authoritativeness',
      title: 'Low Organic Visibility',
      description: `Your domain has limited organic search presence (estimated rank: ${dataforseo.domainRank}/100).`,
      impact: 'Low organic visibility makes it harder to rank for competitive keywords.',
    })
  }

  if (dataforseo.organicKeywords < 100) {
    issues.push({
      severity: 'high',
      category: 'authoritativeness',
      title: 'Limited Keyword Rankings',
      description: `Domain ranks for only ${dataforseo.organicKeywords} organic keywords.`,
      impact: 'Limited keyword rankings indicate low domain authority in search engines.',
    })
  }

  if (page.wordCount < EEAT_CONFIG.content.minWordCount) {
    issues.push({
      severity: 'high',
      category: 'experience',
      title: 'Thin Content',
      description: `Page has only ${page.wordCount} words. Recommended minimum: ${EEAT_CONFIG.content.minWordCount}.`,
      impact: 'Insufficient content depth to demonstrate expertise.',
    })
  }

  // Medium severity issues
  if (page.citations === 0) {
    issues.push({
      severity: 'medium',
      category: 'expertise',
      title: 'No Citations or References',
      description: 'No external citations or references detected.',
      impact: 'Citations help establish credibility and verify claims.',
    })
  }

  if (page.headings.h1.length !== 1) {
    issues.push({
      severity: 'medium',
      category: 'trustworthiness',
      title: 'H1 Heading Issues',
      description: `Page has ${page.headings.h1.length} H1 headings. Best practice is exactly 1.`,
      impact: 'Affects content structure and SEO.',
    })
  }

  if (dataforseo.organicTraffic < 1000 && dataforseo.organicKeywords > 100) {
    issues.push({
      severity: 'medium',
      category: 'authoritativeness',
      title: 'Low Organic Traffic',
      description: `Despite ranking for keywords, organic traffic is low (${Math.round(dataforseo.organicTraffic)} estimated monthly visits).`,
      impact: 'Low traffic suggests poor rankings or low-value keyword targeting.',
    })
  }

  // Low severity issues
  if (!page.metaDescription) {
    issues.push({
      severity: 'low',
      category: 'trustworthiness',
      title: 'Missing Meta Description',
      description: 'No meta description tag found.',
      impact: 'Missed opportunity to control search result snippet.',
    })
  }

  if (page.images.total > 0 && (page.images.withAlt / page.images.total) < 0.5) {
    issues.push({
      severity: 'low',
      category: 'trustworthiness',
      title: 'Missing Alt Text',
      description: `Only ${Math.round((page.images.withAlt / page.images.total) * 100)}% of images have alt text.`,
      impact: 'Affects accessibility and image SEO.',
    })
  }

  return issues
}

/**
 * Generates suggestions for improvement
 */
export function generateSuggestions(
  page: PageAnalysis,
  dataforseo: DataForSEOMetrics,
  scores: EEATScore,
  nlpAnalysis: NLPAnalysisResult | null = null,
  authorReputations: ReputationResult[] = []
): Suggestion[] {
  const suggestions: Suggestion[] = []

  // Author reputation suggestions
  if (page.authors.length > 0 && authorReputations.length > 0) {
    const bestReputation = Math.max(...authorReputations.map(r => r.reputationScore))

    if (bestReputation < 40) {
      suggestions.push({
        category: 'expertise',
        title: 'Build Author Professional Presence',
        description: 'Create or update LinkedIn profile, contribute to industry publications, speak at conferences, and build professional recognition online.',
        priority: 'high',
      })
    }

    // Check if author has publications
    const hasPublications = authorReputations.some(r =>
      r.signals.some(s => s.type === 'publication')
    )

    if (!hasPublications && bestReputation < 60) {
      suggestions.push({
        category: 'expertise',
        title: 'Publish Research or Articles',
        description: 'Contribute articles to industry publications, write research papers, or publish case studies to establish thought leadership.',
        priority: 'medium',
      })
    }
  } else if (page.authors.length === 0) {
    suggestions.push({
      category: 'expertise',
      title: 'Add Verifiable Author Information',
      description: 'Include author byline with links to professional profiles (LinkedIn, company bio, publications) to establish credibility.',
      priority: 'high',
    })
  }

  // NLP-based content improvement suggestions
  if (nlpAnalysis) {
    // AI content suggestions
    if (nlpAnalysis.aiContentScore <= 5) {
      suggestions.push({
        category: 'expertise',
        title: 'Add Authentic Human Voice',
        description: 'Replace generic AI-generated phrases with unique insights, specific examples, and personal perspectives. Use varied sentence structures and natural language.',
        priority: 'high',
      })
    }

    // Tone improvement suggestions
    if (nlpAnalysis.toneScore <= 5) {
      suggestions.push({
        category: 'experience',
        title: 'Reduce Promotional Language',
        description: 'Focus on educational value and factual information rather than sales messaging. Let the quality of your content speak for itself.',
        priority: 'high',
      })
    }

    // Experience signals suggestions
    if (nlpAnalysis.experienceScore <= 5) {
      suggestions.push({
        category: 'experience',
        title: 'Demonstrate Real Experience',
        description: 'Add first-person accounts, detailed case studies, specific metrics from your work, and lessons learned from hands-on experience.',
        priority: 'high',
      })
    }

    // Expertise depth suggestions
    if (nlpAnalysis.expertiseDepthScore <= 5) {
      suggestions.push({
        category: 'expertise',
        title: 'Increase Technical Depth',
        description: 'Use industry-specific terminology, provide nuanced analysis, cite research, and demonstrate deep understanding of complex topics.',
        priority: 'high',
      })
    }
  }

  // Experience suggestions
  if (scores.experience < 20) {
    suggestions.push({
      category: 'experience',
      title: 'Add First-Hand Experience',
      description: 'Include case studies, personal examples, or real-world applications to demonstrate practical experience with the topic.',
      priority: 'high',
    })
  }

  if (page.wordCount < EEAT_CONFIG.content.optimalWordCount) {
    suggestions.push({
      category: 'experience',
      title: 'Expand Content Depth',
      description: `Aim for at least ${EEAT_CONFIG.content.optimalWordCount} words to thoroughly cover the topic and demonstrate comprehensive knowledge.`,
      priority: 'high',
    })
  }

  // Expertise suggestions
  if (page.authors.length === 0 || !page.authors.some(a => a.credentials)) {
    suggestions.push({
      category: 'expertise',
      title: 'Add Expert Bylines with Credentials',
      description: 'Include author bio with professional credentials, certifications, or relevant experience. Use schema markup to highlight expertise.',
      priority: 'high',
    })
  }

  if (!page.schemaMarkup.some(s => s.type === 'Person')) {
    suggestions.push({
      category: 'expertise',
      title: 'Implement Person Schema',
      description: 'Add Person schema markup to highlight author credentials and expertise to search engines.',
      priority: 'high',
    })
  }

  // Authoritativeness suggestions
  if (dataforseo.domainRank < 40) {
    suggestions.push({
      category: 'authoritativeness',
      title: 'Improve Organic Search Presence',
      description: 'Focus on creating comprehensive, expert-reviewed content that ranks for relevant keywords. Partner with credentialed experts to boost authority.',
      priority: 'high',
    })
  }

  if (dataforseo.organicKeywords < 1000) {
    suggestions.push({
      category: 'authoritativeness',
      title: 'Expand Keyword Coverage',
      description: 'Create in-depth content targeting long-tail keywords in your niche. Quality content reviewed by experts will naturally rank better.',
      priority: 'medium',
    })
  }

  // Trustworthiness suggestions
  if (!page.hasSSL) {
    suggestions.push({
      category: 'trustworthiness',
      title: 'Enable HTTPS',
      description: 'Install an SSL certificate immediately. This is non-negotiable for modern websites.',
      priority: 'high',
    })
  }

  if (page.citations < 5) {
    suggestions.push({
      category: 'trustworthiness',
      title: 'Add Citations and References',
      description: 'Link to authoritative sources (.gov, .edu, peer-reviewed research) to back up your claims and build trust.',
      priority: 'medium',
    })
  }

  if (page.schemaMarkup.length < 2) {
    suggestions.push({
      category: 'trustworthiness',
      title: 'Enhance Structured Data',
      description: 'Add comprehensive schema markup (Article, Organization, FAQPage, HowTo) to help search engines understand your content.',
      priority: 'medium',
    })
  }

  // CertREV pitch
  suggestions.push({
    category: 'expertise',
    title: 'Get Expert Verification with CertREV',
    description: 'Have credentialed professionals review and verify your content. Expert validation significantly boosts E-E-A-T scores and consumer trust.',
    priority: 'high',
  })

  return suggestions
}
