/**
 * E-E-A-T Scoring Engine
 * Combines all analysis data to calculate E-E-A-T scores
 */

import { EEAT_CONFIG, calculateOverallScore } from '../eeat-config'
import type { PageAnalysis } from './url-analyzer'
import type { SemrushDomainMetrics, SemrushBacklinkData } from './semrush-api'
import type { MozMetrics } from './moz-api'

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
    semrush: SemrushDomainMetrics
    moz: MozMetrics
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
  semrush: SemrushDomainMetrics,
  moz: MozMetrics
): EEATScore {
  const experience = calculateExperienceScore(page, semrush, moz)
  const expertise = calculateExpertiseScore(page, semrush, moz)
  const authoritativeness = calculateAuthoritativenessScore(page, semrush, moz)
  const trustworthiness = calculateTrustworthinessScore(page, semrush, moz)

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
 * Factors: Author credentials, content quality, citations
 */
function calculateExperienceScore(
  page: PageAnalysis,
  semrush: SemrushDomainMetrics,
  moz: MozMetrics
): number {
  let score = 0

  // Author credentials (0-10 points)
  if (page.authors.length > 0) {
    score += 5
    // Bonus for credentials
    if (page.authors.some(a => a.credentials)) {
      score += 3
    }
    // Bonus for schema markup author
    if (page.authors.some(a => a.source === 'schema')) {
      score += 2
    }
  }

  // Content quality (0-10 points)
  const wordCount = page.wordCount
  if (wordCount >= EEAT_CONFIG.content.optimalWordCount) {
    score += 5
  } else if (wordCount >= EEAT_CONFIG.content.minWordCount) {
    score += 3
  }

  if (page.readabilityScore >= 50 && page.readabilityScore <= 70) {
    score += 3 // Optimal readability
  } else if (page.readabilityScore >= 40 && page.readabilityScore <= 80) {
    score += 2
  }

  if (page.headings.h2.length >= 3) {
    score += 2
  }

  // Citations (0-5 points)
  if (page.citations >= 10) {
    score += 5
  } else if (page.citations >= 5) {
    score += 3
  } else if (page.citations >= 1) {
    score += 2
  }

  return Math.min(25, score)
}

/**
 * Expertise Score (0-25)
 * Factors: Author credentials, schema markup, citations
 */
function calculateExpertiseScore(
  page: PageAnalysis,
  semrush: SemrushDomainMetrics,
  moz: MozMetrics
): number {
  let score = 0

  // Author presence and credentials (0-12 points)
  if (page.authors.length === 0) {
    score += 0 // Critical issue
  } else {
    score += 6

    // Bonus for multiple authors
    if (page.authors.length > 1) {
      score += 2
    }

    // Bonus for credentials
    if (page.authors.some(a => a.credentials)) {
      score += 4
    }
  }

  // Schema markup (0-8 points)
  const hasRelevantSchema = page.schemaMarkup.some(s =>
    EEAT_CONFIG.schemaTypes.includes(s.type)
  )

  if (hasRelevantSchema) {
    score += 4
  }

  // Bonus for person/organization schema
  if (page.schemaMarkup.some(s => s.type === 'Person' || s.type === 'Organization')) {
    score += 2
  }

  // Bonus for medical/health schema
  if (page.schemaMarkup.some(s => s.type === 'MedicalWebPage' || s.type === 'HealthTopicContent')) {
    score += 2
  }

  // Citations/references (0-5 points)
  if (page.citations >= 10) {
    score += 5
  } else if (page.citations >= 5) {
    score += 3
  } else if (page.citations >= 1) {
    score += 2
  }

  return Math.min(25, score)
}

/**
 * Authoritativeness Score (0-25)
 * Factors: Domain authority, backlinks, citations
 */
function calculateAuthoritativenessScore(
  page: PageAnalysis,
  semrush: SemrushDomainMetrics,
  moz: MozMetrics
): number {
  let score = 0

  // Domain Authority (0-10 points)
  const da = moz.domainAuthority
  if (da >= 80) {
    score += 10
  } else if (da >= 60) {
    score += 8
  } else if (da >= 40) {
    score += 6
  } else if (da >= 20) {
    score += 4
  } else {
    score += 2
  }

  // Backlinks (0-10 points)
  const backlinks = semrush.backlinks
  if (backlinks >= 100000) {
    score += 10
  } else if (backlinks >= 10000) {
    score += 8
  } else if (backlinks >= 1000) {
    score += 6
  } else if (backlinks >= 100) {
    score += 4
  } else if (backlinks >= 10) {
    score += 2
  }

  // Referring domains (0-5 points)
  const domains = semrush.referringDomains
  if (domains >= 1000) {
    score += 5
  } else if (domains >= 500) {
    score += 4
  } else if (domains >= 100) {
    score += 3
  } else if (domains >= 10) {
    score += 2
  }

  return Math.min(25, score)
}

/**
 * Trustworthiness Score (0-25)
 * Factors: SSL, schema markup, user signals
 */
function calculateTrustworthinessScore(
  page: PageAnalysis,
  semrush: SemrushDomainMetrics,
  moz: MozMetrics
): number {
  let score = 0

  // SSL/Security (0-5 points)
  if (page.hasSSL) {
    score += 5
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

  // Spam score (0-7 points) - Lower is better
  const spamScore = moz.spamScore
  if (spamScore <= 5) {
    score += 7
  } else if (spamScore <= 10) {
    score += 5
  } else if (spamScore <= 20) {
    score += 3
  } else if (spamScore <= 40) {
    score += 1
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

  return Math.min(25, score)
}

/**
 * Identifies issues in the analysis
 */
export function identifyIssues(
  page: PageAnalysis,
  semrush: SemrushDomainMetrics,
  moz: MozMetrics,
  scores: EEATScore
): Issue[] {
  const issues: Issue[] = []

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
  if (moz.domainAuthority < 30) {
    issues.push({
      severity: 'high',
      category: 'authoritativeness',
      title: 'Low Domain Authority',
      description: `Your domain authority is ${moz.domainAuthority}, which is below average.`,
      impact: 'Low DA makes it harder to rank for competitive keywords.',
    })
  }

  if (semrush.backlinks < 100) {
    issues.push({
      severity: 'high',
      category: 'authoritativeness',
      title: 'Few Backlinks',
      description: `Only ${semrush.backlinks} backlinks detected.`,
      impact: 'Backlinks are crucial for building authoritativeness.',
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

  if (moz.spamScore > 10) {
    issues.push({
      severity: 'medium',
      category: 'trustworthiness',
      title: 'Elevated Spam Score',
      description: `Moz spam score is ${moz.spamScore}%. Recommended: below 10%.`,
      impact: 'High spam score can trigger manual reviews or penalties.',
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
  semrush: SemrushDomainMetrics,
  moz: MozMetrics,
  scores: EEATScore
): Suggestion[] {
  const suggestions: Suggestion[] = []

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
  if (moz.domainAuthority < 40) {
    suggestions.push({
      category: 'authoritativeness',
      title: 'Build Domain Authority',
      description: 'Focus on earning high-quality backlinks from authoritative sites in your industry. Guest posting, PR, and expert partnerships can help.',
      priority: 'high',
    })
  }

  if (semrush.backlinks < 1000) {
    suggestions.push({
      category: 'authoritativeness',
      title: 'Increase Backlink Profile',
      description: 'Create linkable assets (research, tools, guides) and promote them to earn more backlinks from relevant sites.',
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
