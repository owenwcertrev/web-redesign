/**
 * E-E-A-T Scoring Engine V2
 * Variable-based scoring system using detector modules
 */

import type { PageAnalysis } from './url-analyzer'
import type { DataForSEOMetrics } from './dataforseo-api'
import type { NLPAnalysisResult } from './nlp-analyzer'
import type { ReputationResult } from './reputation-checker'
import type {
  EEATScore,
  EEATCategoryScore,
  EEATVariable,
  BlogInsights
} from '../types/blog-analysis'
import { EEAT_VARIABLES, getOverallStatus, getCategoryMaxScore, BENCHMARKS } from '../eeat-config'

// Import all detectors
import * as ExperienceDetectors from './eeat-detectors/experience-detectors'
import * as ExpertiseDetectors from './eeat-detectors/expertise-detectors'
import * as AuthoritativenessDetectors from './eeat-detectors/authoritativeness-detectors'
import * as TrustworthinessDetectors from './eeat-detectors/trustworthiness-detectors'

/**
 * Calculate E-E-A-T scores for a single page (instant mode with fast APIs)
 * Uses on-page analysis + DataForSEO domain metrics + basic author reputation
 * APIs are called in parallel with 10s timeouts - graceful degradation on failure
 */
export async function calculateInstantEEATScores(
  pageAnalysis: PageAnalysis,
  domain: string
): Promise<EEATScore> {
  // Import orchestrator dynamically to avoid circular deps
  const { fetchInstantAPIs } = await import('./api-orchestrator')

  // Get first author name for reputation check
  const authorName = pageAnalysis.authors?.[0]?.name

  // Fetch instant APIs in parallel with timeouts
  const apiResults = await fetchInstantAPIs(domain, authorName)

  const experience = calculateExperienceCategory(pageAnalysis)
  const expertise = calculateExpertiseCategory(
    pageAnalysis,
    undefined,
    undefined,
    apiResults.authorReputation
  )
  const authoritativeness = calculateAuthoritativenessCategory(
    pageAnalysis,
    undefined,
    apiResults.domainMetrics,
    apiResults.authorReputation,
    undefined,
    apiResults.domainMetricsError
  )
  const trustworthiness = calculateTrustworthinessCategory(pageAnalysis)

  const overall = experience.totalScore + expertise.totalScore +
                  authoritativeness.totalScore + trustworthiness.totalScore

  return {
    overall,
    categories: {
      experience,
      expertise,
      authoritativeness,
      trustworthiness
    },
    status: getOverallStatus(overall),
    benchmarkComparison: {
      fortune500: `${BENCHMARKS.fortune500.min}-${BENCHMARKS.fortune500.max}`,
      midMarket: `${BENCHMARKS.midMarket.min}-${BENCHMARKS.midMarket.max}`,
      startup: `${BENCHMARKS.startup.min}-${BENCHMARKS.startup.max}`
    }
  }
}

/**
 * Calculate comprehensive E-E-A-T scores with external API data
 */
export function calculateComprehensiveEEATScores(
  pageAnalysis: PageAnalysis,
  domainMetrics?: DataForSEOMetrics,
  nlpAnalysis?: NLPAnalysisResult,
  authorReputation?: ReputationResult
): EEATScore {
  const experience = calculateExperienceCategory(pageAnalysis, undefined, nlpAnalysis)
  const expertise = calculateExpertiseCategory(pageAnalysis, undefined, nlpAnalysis, authorReputation)
  const authoritativeness = calculateAuthoritativenessCategory(pageAnalysis, undefined, domainMetrics, authorReputation)
  const trustworthiness = calculateTrustworthinessCategory(pageAnalysis)

  const overall = experience.totalScore + expertise.totalScore +
                  authoritativeness.totalScore + trustworthiness.totalScore

  return {
    overall,
    categories: {
      experience,
      expertise,
      authoritativeness,
      trustworthiness
    },
    status: getOverallStatus(overall),
    benchmarkComparison: {
      fortune500: `${BENCHMARKS.fortune500.min}-${BENCHMARKS.fortune500.max}`,
      midMarket: `${BENCHMARKS.midMarket.min}-${BENCHMARKS.midMarket.max}`,
      startup: `${BENCHMARKS.startup.min}-${BENCHMARKS.startup.max}`
    }
  }
}

/**
 * Calculate E-E-A-T scores for blog analysis (multiple posts)
 */
export function calculateBlogEEATScores(
  posts: any[],
  blogInsights: BlogInsights,
  domainMetrics?: DataForSEOMetrics,
  nlpAnalysis?: NLPAnalysisResult,
  authorReputation?: ReputationResult
): EEATScore {
  // Calculate aggregate category scores across all posts
  const experience = calculateExperienceCategory(
    posts[0]?.pageAnalysis,
    blogInsights,
    nlpAnalysis,
    posts
  )

  const expertise = calculateExpertiseCategory(
    posts[0]?.pageAnalysis,
    blogInsights,
    nlpAnalysis,
    authorReputation
  )

  const authoritativeness = calculateAuthoritativenessCategory(
    posts[0]?.pageAnalysis,
    blogInsights,
    domainMetrics,
    authorReputation,
    posts
  )

  const trustworthiness = calculateTrustworthinessCategory(
    posts[0]?.pageAnalysis,
    blogInsights,
    posts
  )

  const overall = experience.totalScore + expertise.totalScore +
                  authoritativeness.totalScore + trustworthiness.totalScore

  return {
    overall,
    categories: {
      experience,
      expertise,
      authoritativeness,
      trustworthiness
    },
    status: getOverallStatus(overall),
    benchmarkComparison: {
      fortune500: `${BENCHMARKS.fortune500.min}-${BENCHMARKS.fortune500.max}`,
      midMarket: `${BENCHMARKS.midMarket.min}-${BENCHMARKS.midMarket.max}`,
      startup: `${BENCHMARKS.startup.min}-${BENCHMARKS.startup.max}`
    },
    postsAnalyzed: posts.length
  }
}

/**
 * Calculate Experience category (E1-E7)
 */
function calculateExperienceCategory(
  pageAnalysis?: PageAnalysis,
  blogInsights?: BlogInsights,
  nlpAnalysis?: NLPAnalysisResult,
  posts?: any[]
): EEATCategoryScore {
  const variables: EEATVariable[] = []

  if (pageAnalysis) {
    // E1: First-person narratives
    variables.push(ExperienceDetectors.detectFirstPersonNarratives(pageAnalysis, nlpAnalysis))

    // E2: Author perspective blocks
    variables.push(ExperienceDetectors.detectAuthorPerspectiveBlocks(pageAnalysis))

    // E3: Original assets
    variables.push(ExperienceDetectors.detectOriginalAssets(pageAnalysis))

    // E4: Freshness
    variables.push(ExperienceDetectors.detectFreshness(pageAnalysis))

    // E5: Experience markup
    variables.push(ExperienceDetectors.detectExperienceMarkup(pageAnalysis))
  }

  // E6: Publishing consistency (blog-level)
  if (blogInsights) {
    variables.push(ExperienceDetectors.detectPublishingConsistency(blogInsights))
  }

  // E7: Content freshness rate (blog-level)
  if (posts) {
    variables.push(ExperienceDetectors.detectContentFreshnessRate(blogInsights, posts))
  }

  return createCategoryScore('experience', 'Experience', variables)
}

/**
 * Calculate Expertise category (X1-X6)
 */
function calculateExpertiseCategory(
  pageAnalysis?: PageAnalysis,
  blogInsights?: BlogInsights,
  nlpAnalysis?: NLPAnalysisResult,
  authorReputation?: ReputationResult
): EEATCategoryScore {
  const variables: EEATVariable[] = []

  if (pageAnalysis) {
    // X1: Named authors with credentials
    // Transform ReputationResult to expected format
    const reputationFlags = authorReputation ? {
      hasLinkedIn: authorReputation.signals.some(s => s.type === 'professional_profile' && s.source.toLowerCase().includes('linkedin')),
      hasPublications: authorReputation.signals.some(s => s.type === 'publication'),
      hasMediaMentions: authorReputation.signals.some(s => s.type === 'media_mention')
    } : undefined

    variables.push(ExpertiseDetectors.detectNamedAuthorsWithCredentials(
      pageAnalysis,
      reputationFlags
    ))

    // X2: YMYL reviewer presence
    variables.push(ExpertiseDetectors.detectYMYLReviewerPresence(pageAnalysis))

    // X3: Credential verification links
    variables.push(ExpertiseDetectors.detectCredentialVerificationLinks(pageAnalysis))

    // X4: Citation quality
    variables.push(ExpertiseDetectors.detectCitationQuality(pageAnalysis))

    // X5: Content depth & clarity
    variables.push(ExpertiseDetectors.detectContentDepthClarity(pageAnalysis, nlpAnalysis))
  }

  // X6: Author consistency (blog-level)
  if (blogInsights) {
    variables.push(ExpertiseDetectors.detectAuthorConsistency(blogInsights))
  }

  return createCategoryScore('expertise', 'Expertise', variables)
}

/**
 * Calculate Authoritativeness category (A1-A7)
 */
function calculateAuthoritativenessCategory(
  pageAnalysis?: PageAnalysis,
  blogInsights?: BlogInsights,
  domainMetrics?: DataForSEOMetrics,
  authorReputation?: ReputationResult,
  posts?: any[],
  apiError?: string
): EEATCategoryScore {
  const variables: EEATVariable[] = []

  // Transform ReputationResult to expected formats
  const reputationFlags = authorReputation ? {
    hasLinkedIn: authorReputation.signals.some(s => s.type === 'professional_profile' && s.source.toLowerCase().includes('linkedin')),
    hasPublications: authorReputation.signals.some(s => s.type === 'publication'),
    hasMediaMentions: authorReputation.signals.some(s => s.type === 'media_mention')
  } : undefined

  const mediaCount = authorReputation ? {
    mediaCount: authorReputation.signals.filter(s => s.type === 'media_mention').length
  } : undefined

  // A1: Editorial mentions (external API with graceful degradation)
  variables.push(AuthoritativenessDetectors.detectEditorialMentions(
    domainMetrics,
    mediaCount,
    pageAnalysis,
    apiError
  ))

  // A2: Authors cited elsewhere (external API)
  variables.push(AuthoritativenessDetectors.detectAuthorsCitedElsewhere(reputationFlags))

  if (pageAnalysis) {
    // A3: Entity clarity
    variables.push(AuthoritativenessDetectors.detectEntityClarity(pageAnalysis))

    // A5: Quality patterns
    variables.push(AuthoritativenessDetectors.detectQualityPatterns(pageAnalysis, posts))
  }

  // A4: Independent references (external API)
  variables.push(AuthoritativenessDetectors.detectIndependentReferences(domainMetrics))

  // A6: Internal linking network (blog-level)
  if (blogInsights) {
    variables.push(AuthoritativenessDetectors.detectInternalLinkingNetwork(blogInsights))
  }

  // A7: Topic focus (blog-level)
  if (blogInsights) {
    variables.push(AuthoritativenessDetectors.detectTopicFocus(blogInsights))
  }

  return createCategoryScore('authoritativeness', 'Authoritativeness', variables)
}

/**
 * Calculate Trustworthiness category (T1-T7)
 */
function calculateTrustworthinessCategory(
  pageAnalysis?: PageAnalysis,
  blogInsights?: BlogInsights,
  posts?: any[]
): EEATCategoryScore {
  const variables: EEATVariable[] = []

  if (pageAnalysis) {
    // T1: Editorial principles
    variables.push(TrustworthinessDetectors.detectEditorialPrinciples(pageAnalysis))

    // T2: YMYL disclaimers
    variables.push(TrustworthinessDetectors.detectYMYLDisclaimers(pageAnalysis))

    // T3: Provenance signals
    variables.push(TrustworthinessDetectors.detectProvenanceSignals(pageAnalysis))

    // T4: Contact transparency
    variables.push(TrustworthinessDetectors.detectContactTransparency(pageAnalysis))

    // T5: Schema hygiene
    variables.push(TrustworthinessDetectors.detectSchemaHygiene(pageAnalysis))
  }

  // T6: Schema adoption rate (blog-level)
  if (blogInsights) {
    variables.push(TrustworthinessDetectors.detectSchemaAdoptionRate(blogInsights))
  }

  // T7: Quality consistency (blog-level)
  if (posts) {
    variables.push(TrustworthinessDetectors.detectQualityConsistency(posts))
  }

  return createCategoryScore('trustworthiness', 'Trustworthiness', variables)
}

/**
 * Helper: Create category score from variables
 */
function createCategoryScore(
  category: 'experience' | 'expertise' | 'authoritativeness' | 'trustworthiness',
  displayName: string,
  variables: EEATVariable[]
): EEATCategoryScore {
  const totalScore = variables.reduce((sum, v) => sum + v.actualScore, 0)
  const maxScore = getCategoryMaxScore(category)
  const percentage = (totalScore / maxScore) * 100

  let overallStatus: 'excellent' | 'good' | 'fair' | 'poor'
  if (percentage >= 85) overallStatus = 'excellent'
  else if (percentage >= 65) overallStatus = 'good'
  else if (percentage >= 40) overallStatus = 'fair'
  else overallStatus = 'poor'

  return {
    category,
    displayName,
    totalScore,
    maxScore,
    percentage,
    variables,
    overallStatus
  }
}
