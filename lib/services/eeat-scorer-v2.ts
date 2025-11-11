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

  const experience = calculateExperienceCategory(pageAnalysis, undefined, undefined, true)
  const expertise = calculateExpertiseCategory(
    pageAnalysis,
    undefined,
    undefined,
    apiResults.authorReputation,
    true
  )
  const authoritativeness = calculateAuthoritativenessCategory(
    pageAnalysis,
    undefined,
    apiResults.domainMetrics,
    apiResults.authorReputation,
    undefined,
    apiResults.domainMetricsError,
    true
  )
  const trustworthiness = calculateTrustworthinessCategory(pageAnalysis, undefined, true)

  // Round overall score to 2 decimal places to avoid floating point precision issues
  const overall = Math.round((experience.totalScore + expertise.totalScore +
                  authoritativeness.totalScore + trustworthiness.totalScore) * 100) / 100

  // Calculate total missed points from single-page limitations
  const totalMissedPoints =
    (experience.singlePageLimitation?.missedPoints || 0) +
    (expertise.singlePageLimitation?.missedPoints || 0) +
    (authoritativeness.singlePageLimitation?.missedPoints || 0) +
    (trustworthiness.singlePageLimitation?.missedPoints || 0)

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
    isSinglePageAnalysis: true,
    singlePageNote: totalMissedPoints > 0
      ? `Single-page analysis: ${totalMissedPoints} points unavailable from blog-level metrics. Analyze multiple posts for complete scoring.`
      : undefined
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

  // Round overall score to 2 decimal places to avoid floating point precision issues
  const overall = Math.round((experience.totalScore + expertise.totalScore +
                  authoritativeness.totalScore + trustworthiness.totalScore) * 100) / 100

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
    false // Blog analysis, not single-page
  )

  const expertise = calculateExpertiseCategory(
    posts[0]?.pageAnalysis,
    blogInsights,
    nlpAnalysis,
    authorReputation,
    false // Blog analysis, not single-page
  )

  const authoritativeness = calculateAuthoritativenessCategory(
    posts[0]?.pageAnalysis,
    blogInsights,
    domainMetrics,
    authorReputation,
    posts,
    undefined,
    false // Blog analysis, not single-page
  )

  const trustworthiness = calculateTrustworthinessCategory(
    posts[0]?.pageAnalysis,
    blogInsights,
    false // Blog analysis, not single-page
  )

  // Round overall score to 2 decimal places to avoid floating point precision issues
  const overall = Math.round((experience.totalScore + expertise.totalScore +
                  authoritativeness.totalScore + trustworthiness.totalScore) * 100) / 100

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
  isSinglePageAnalysis: boolean = false
): EEATCategoryScore {
  const variables: EEATVariable[] = []
  const unavailableVariables: string[] = []
  let missedPoints = 0

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
  } else if (isSinglePageAnalysis) {
    const e6Config = EEAT_VARIABLES.experience.find(v => v.id === 'E6')!
    unavailableVariables.push('E6')
    missedPoints += e6Config.maxScore
  }

  // E7: Content freshness rate (blog-level)
  if (blogInsights) {
    variables.push(ExperienceDetectors.detectContentFreshnessRate(blogInsights, undefined))
  } else if (isSinglePageAnalysis) {
    const e7Config = EEAT_VARIABLES.experience.find(v => v.id === 'E7')!
    unavailableVariables.push('E7')
    missedPoints += e7Config.maxScore
  }

  const categoryScore = createCategoryScore('experience', 'Experience', variables)

  // Add single-page limitation info
  if (isSinglePageAnalysis && unavailableVariables.length > 0) {
    categoryScore.singlePageLimitation = {
      unavailableVariables,
      missedPoints
    }
  }

  return categoryScore
}

/**
 * Calculate Expertise category (X1-X6)
 */
function calculateExpertiseCategory(
  pageAnalysis?: PageAnalysis,
  blogInsights?: BlogInsights,
  nlpAnalysis?: NLPAnalysisResult,
  authorReputation?: ReputationResult,
  isSinglePageAnalysis: boolean = false
): EEATCategoryScore {
  const variables: EEATVariable[] = []
  const unavailableVariables: string[] = []
  let missedPoints = 0

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
  } else if (isSinglePageAnalysis) {
    const x6Config = EEAT_VARIABLES.expertise.find(v => v.id === 'X6')!
    unavailableVariables.push('X6')
    missedPoints += x6Config.maxScore
  }

  const categoryScore = createCategoryScore('expertise', 'Expertise', variables)

  // Add single-page limitation info
  if (isSinglePageAnalysis && unavailableVariables.length > 0) {
    categoryScore.singlePageLimitation = {
      unavailableVariables,
      missedPoints
    }
  }

  return categoryScore
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
  apiError?: string,
  isSinglePageAnalysis: boolean = false
): EEATCategoryScore {
  const variables: EEATVariable[] = []
  const unavailableVariables: string[] = []
  let missedPoints = 0

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

  // A2: Authors cited elsewhere (external API with fallback)
  variables.push(AuthoritativenessDetectors.detectAuthorsCitedElsewhere(reputationFlags, pageAnalysis))

  if (pageAnalysis) {
    // A3: Entity clarity
    variables.push(AuthoritativenessDetectors.detectEntityClarity(pageAnalysis))

    // A5: Quality patterns
    variables.push(AuthoritativenessDetectors.detectQualityPatterns(pageAnalysis, posts))
  }

  // A4: Independent references (external API with fallback)
  variables.push(AuthoritativenessDetectors.detectIndependentReferences(domainMetrics, pageAnalysis))

  // A6: Internal linking network (blog-level)
  if (blogInsights) {
    variables.push(AuthoritativenessDetectors.detectInternalLinkingNetwork(blogInsights))
  } else if (isSinglePageAnalysis) {
    const a6Config = EEAT_VARIABLES.authoritativeness.find(v => v.id === 'A6')!
    unavailableVariables.push('A6')
    missedPoints += a6Config.maxScore
  }

  // A7: Topic focus (blog-level)
  if (blogInsights) {
    variables.push(AuthoritativenessDetectors.detectTopicFocus(blogInsights))
  } else if (isSinglePageAnalysis) {
    const a7Config = EEAT_VARIABLES.authoritativeness.find(v => v.id === 'A7')!
    unavailableVariables.push('A7')
    missedPoints += a7Config.maxScore
  }

  const categoryScore = createCategoryScore('authoritativeness', 'Authoritativeness', variables)

  // Add single-page limitation info
  if (isSinglePageAnalysis && unavailableVariables.length > 0) {
    categoryScore.singlePageLimitation = {
      unavailableVariables,
      missedPoints
    }
  }

  return categoryScore
}

/**
 * Calculate Trustworthiness category (T1-T7)
 */
function calculateTrustworthinessCategory(
  pageAnalysis?: PageAnalysis,
  blogInsights?: BlogInsights,
  isSinglePageAnalysis: boolean = false
): EEATCategoryScore {
  const variables: EEATVariable[] = []
  const unavailableVariables: string[] = []
  let missedPoints = 0

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
  } else if (isSinglePageAnalysis) {
    const t6Config = EEAT_VARIABLES.trustworthiness.find(v => v.id === 'T6')!
    unavailableVariables.push('T6')
    missedPoints += t6Config.maxScore
  }

  // T7: Quality consistency (blog-level)
  if (blogInsights) {
    variables.push(TrustworthinessDetectors.detectQualityConsistency(undefined))
  } else if (isSinglePageAnalysis) {
    const t7Config = EEAT_VARIABLES.trustworthiness.find(v => v.id === 'T7')!
    unavailableVariables.push('T7')
    missedPoints += t7Config.maxScore
  }

  const categoryScore = createCategoryScore('trustworthiness', 'Trustworthiness', variables)

  // Add single-page limitation info
  if (isSinglePageAnalysis && unavailableVariables.length > 0) {
    categoryScore.singlePageLimitation = {
      unavailableVariables,
      missedPoints
    }
  }

  return categoryScore
}

/**
 * Helper: Create category score from variables
 */
function createCategoryScore(
  category: 'experience' | 'expertise' | 'authoritativeness' | 'trustworthiness',
  displayName: string,
  variables: EEATVariable[]
): EEATCategoryScore {
  // Round to 2 decimal places to avoid floating point precision issues
  const totalScore = Math.round(variables.reduce((sum, v) => sum + v.actualScore, 0) * 100) / 100
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
