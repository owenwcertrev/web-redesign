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
  EEATEvidence,
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
  // For blog analysis, ALL metrics should be based on:
  // 1. Aggregated data across posts (E1-E5, X1-X5, A2-A3, T1-T5)
  // 2. Domain-level data (A1, A4)
  // 3. Blog-level insights (E6-E7, X6, A6-A7, T6-T7)
  // We should NOT use posts[0] - that's just one article, not representative of SEO strategy

  console.log('[calculateBlogEEATScores] Starting blog analysis with', posts.length, 'posts')

  let experience, expertise, authoritativeness, trustworthiness

  try {
    console.log('[calculateBlogEEATScores] Calculating Experience category...')
    experience = calculateExperienceCategory(
      undefined, // No single pageAnalysis for blog mode
      blogInsights,
      nlpAnalysis,
      false, // Blog analysis, not single-page
      posts // All scoring based on posts array
    )
    console.log('[calculateBlogEEATScores] Experience score:', experience.totalScore)
  } catch (error) {
    console.error('[calculateBlogEEATScores] ERROR in Experience category:', error)
    throw new Error(`Experience category failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }

  try {
    console.log('[calculateBlogEEATScores] Calculating Expertise category...')
    expertise = calculateExpertiseCategory(
      undefined, // No single pageAnalysis for blog mode
      blogInsights,
      nlpAnalysis,
      authorReputation,
      false, // Blog analysis, not single-page
      posts // All scoring based on posts array
    )
    console.log('[calculateBlogEEATScores] Expertise score:', expertise.totalScore)
  } catch (error) {
    console.error('[calculateBlogEEATScores] ERROR in Expertise category:', error)
    throw new Error(`Expertise category failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }

  try {
    console.log('[calculateBlogEEATScores] Calculating Authoritativeness category...')
    authoritativeness = calculateAuthoritativenessCategory(
      undefined, // No single pageAnalysis for blog mode
      blogInsights,
      domainMetrics,
      authorReputation,
      posts,
      undefined,
      false // Blog analysis, not single-page
    )
    console.log('[calculateBlogEEATScores] Authoritativeness score:', authoritativeness.totalScore)
  } catch (error) {
    console.error('[calculateBlogEEATScores] ERROR in Authoritativeness category:', error)
    throw new Error(`Authoritativeness category failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }

  try {
    console.log('[calculateBlogEEATScores] Calculating Trustworthiness category...')
    trustworthiness = calculateTrustworthinessCategory(
      undefined, // No single pageAnalysis for blog mode
      blogInsights,
      false, // Blog analysis, not single-page
      posts // All scoring based on posts array
    )
    console.log('[calculateBlogEEATScores] Trustworthiness score:', trustworthiness.totalScore)
  } catch (error) {
    console.error('[calculateBlogEEATScores] ERROR in Trustworthiness category:', error)
    throw new Error(`Trustworthiness category failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }

  // Round overall score to 2 decimal places to avoid floating point precision issues
  const overall = Math.round((experience.totalScore + expertise.totalScore +
                  authoritativeness.totalScore + trustworthiness.totalScore) * 100) / 100

  console.log('[calculateBlogEEATScores] Overall score:', overall)

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
  isSinglePageAnalysis: boolean = false,
  posts?: any[]
): EEATCategoryScore {
  const variables: EEATVariable[] = []
  const unavailableVariables: string[] = []
  let missedPoints = 0

  // If we have multiple posts (blog analysis), aggregate E1-E5 across all posts
  if (posts && posts.length > 1) {
    // E1: First-person narratives (aggregate across posts)
    variables.push(aggregateVariableAcrossPosts(posts, 'E1', (post) =>
      ExperienceDetectors.detectFirstPersonNarratives(post.pageAnalysis, nlpAnalysis)
    ))

    // E2: Author perspective blocks (aggregate)
    variables.push(aggregateVariableAcrossPosts(posts, 'E2', (post) =>
      ExperienceDetectors.detectAuthorPerspectiveBlocks(post.pageAnalysis)
    ))

    // E3: Original assets (aggregate)
    variables.push(aggregateVariableAcrossPosts(posts, 'E3', (post) =>
      ExperienceDetectors.detectOriginalAssets(post.pageAnalysis)
    ))

    // E4: Freshness (aggregate)
    variables.push(aggregateVariableAcrossPosts(posts, 'E4', (post) =>
      ExperienceDetectors.detectFreshness(post.pageAnalysis)
    ))

    // E5: Experience markup (aggregate)
    variables.push(aggregateVariableAcrossPosts(posts, 'E5', (post) =>
      ExperienceDetectors.detectExperienceMarkup(post.pageAnalysis)
    ))
  } else if (pageAnalysis) {
    // Single page analysis - use original logic
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
  isSinglePageAnalysis: boolean = false,
  posts?: any[]
): EEATCategoryScore {
  const variables: EEATVariable[] = []
  const unavailableVariables: string[] = []
  let missedPoints = 0

  // Transform ReputationResult to expected format (if available)
  const reputationFlags = authorReputation ? {
    hasLinkedIn: authorReputation.signals.some(s => s.type === 'professional_profile' && s.source.toLowerCase().includes('linkedin')),
    hasPublications: authorReputation.signals.some(s => s.type === 'publication'),
    hasMediaMentions: authorReputation.signals.some(s => s.type === 'media_mention')
  } : undefined

  // If we have multiple posts (blog analysis), aggregate X1-X5 across all posts
  if (posts && posts.length > 1) {
    // X1: Named authors with credentials (aggregate)
    variables.push(aggregateVariableAcrossPosts(posts, 'X1', (post) =>
      ExpertiseDetectors.detectNamedAuthorsWithCredentials(post.pageAnalysis, reputationFlags)
    ))

    // X2: YMYL reviewer presence (aggregate)
    variables.push(aggregateVariableAcrossPosts(posts, 'X2', (post) =>
      ExpertiseDetectors.detectYMYLReviewerPresence(post.pageAnalysis)
    ))

    // X3: Credential verification links (aggregate)
    variables.push(aggregateVariableAcrossPosts(posts, 'X3', (post) =>
      ExpertiseDetectors.detectCredentialVerificationLinks(post.pageAnalysis)
    ))

    // X4: Citation quality (aggregate)
    variables.push(aggregateVariableAcrossPosts(posts, 'X4', (post) =>
      ExpertiseDetectors.detectCitationQuality(post.pageAnalysis)
    ))

    // X5: Content depth & clarity (aggregate)
    variables.push(aggregateVariableAcrossPosts(posts, 'X5', (post) =>
      ExpertiseDetectors.detectContentDepthClarity(post.pageAnalysis, nlpAnalysis)
    ))
  } else if (pageAnalysis) {
    // Single page analysis - use original logic
    // X1: Named authors with credentials
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

  // A1: Editorial mentions (domain-level - always add first, no post aggregation needed)
  // For blog mode, we don't need pageAnalysis fallback since we have domainMetrics
  if (posts && posts.length > 1) {
    // Blog mode: use domain metrics only, no pageAnalysis fallback
    variables.push(AuthoritativenessDetectors.detectEditorialMentions(
      domainMetrics,
      mediaCount,
      undefined, // Don't use single page as fallback in blog mode
      apiError
    ))
  } else {
    // Single page mode: can use pageAnalysis as fallback if domain metrics fail
    variables.push(AuthoritativenessDetectors.detectEditorialMentions(
      domainMetrics,
      mediaCount,
      pageAnalysis,
      apiError
    ))
  }

  // If we have multiple posts (blog analysis), aggregate A2-A3-A4-A5 across all posts
  if (posts && posts.length > 1) {
    // A2: Authors cited elsewhere (aggregate)
    variables.push(aggregateVariableAcrossPosts(posts, 'A2', (post) =>
      AuthoritativenessDetectors.detectAuthorsCitedElsewhere(reputationFlags, post.pageAnalysis)
    ))

    // A3: Entity clarity (aggregate)
    variables.push(aggregateVariableAcrossPosts(posts, 'A3', (post) =>
      AuthoritativenessDetectors.detectEntityClarity(post.pageAnalysis)
    ))

    // A4: Independent references (domain-level - no pageAnalysis needed for blog mode)
    variables.push(AuthoritativenessDetectors.detectIndependentReferences(domainMetrics, undefined))

    // A5: Quality patterns (aggregate across all posts)
    variables.push(AuthoritativenessDetectors.detectQualityPatterns(undefined, posts))
  } else if (pageAnalysis) {
    // Single page analysis - use original logic
    // A2: Authors cited elsewhere
    variables.push(AuthoritativenessDetectors.detectAuthorsCitedElsewhere(reputationFlags, pageAnalysis))

    // A3: Entity clarity
    variables.push(AuthoritativenessDetectors.detectEntityClarity(pageAnalysis))

    // A4: Independent references (use domain + single page fallback)
    variables.push(AuthoritativenessDetectors.detectIndependentReferences(domainMetrics, pageAnalysis))

    // A5: Quality patterns
    variables.push(AuthoritativenessDetectors.detectQualityPatterns(pageAnalysis, posts))
  } else {
    // No data available - use fallbacks with undefined pageAnalysis
    // A2: Authors cited elsewhere
    variables.push(AuthoritativenessDetectors.detectAuthorsCitedElsewhere(reputationFlags, undefined))

    // A3: Entity clarity - requires pageAnalysis, so will return low score
    variables.push(AuthoritativenessDetectors.detectEntityClarity(undefined))

    // A4: Independent references (domain-level only)
    variables.push(AuthoritativenessDetectors.detectIndependentReferences(domainMetrics, undefined))

    // A5: Quality patterns
    variables.push(AuthoritativenessDetectors.detectQualityPatterns(undefined, posts))
  }

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
  isSinglePageAnalysis: boolean = false,
  posts?: any[]
): EEATCategoryScore {
  const variables: EEATVariable[] = []
  const unavailableVariables: string[] = []
  let missedPoints = 0

  // If we have multiple posts (blog analysis), use domain-level detection for T1, T4
  if (posts && posts.length > 1) {
    // T1: Editorial principles (domain-level - check footer links across posts)
    variables.push(TrustworthinessDetectors.detectEditorialPrinciples(undefined, posts))

    // T2: YMYL disclaimers (aggregate)
    variables.push(aggregateVariableAcrossPosts(posts, 'T2', (post) =>
      TrustworthinessDetectors.detectYMYLDisclaimers(post.pageAnalysis)
    ))

    // T3: Provenance signals (aggregate)
    variables.push(aggregateVariableAcrossPosts(posts, 'T3', (post) =>
      TrustworthinessDetectors.detectProvenanceSignals(post.pageAnalysis)
    ))

    // T4: Contact transparency (domain-level - check footer links across posts)
    variables.push(TrustworthinessDetectors.detectContactTransparency(undefined, posts))

    // T5: Schema hygiene (aggregate)
    variables.push(aggregateVariableAcrossPosts(posts, 'T5', (post) =>
      TrustworthinessDetectors.detectSchemaHygiene(post.pageAnalysis)
    ))
  } else if (pageAnalysis) {
    // Single page analysis - use original logic
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
 * Helper: Aggregate a variable across multiple blog posts with trend detection
 */
function aggregateVariableAcrossPosts(
  posts: any[],
  variableId: string,
  detectorFn: (post: any) => EEATVariable
): EEATVariable {
  // Calculate variable for each post with error handling
  const results = posts.map((post, index) => {
    try {
      // Add null safety check for post data
      if (!post) {
        console.warn(`[${variableId}] Post at index ${index} is null/undefined`)
        return {
          score: 0,
          date: null,
          evidence: [{ type: 'note' as const, value: 'Post data missing' }]
        }
      }

      if (!post.pageAnalysis) {
        console.warn(`[${variableId}] Post missing pageAnalysis: ${post.url || 'unknown URL'}`)
        return {
          score: 0,
          date: extractPostDate(post),
          evidence: [{ type: 'note' as const, value: 'Page analysis data missing' }]
        }
      }

      const result = detectorFn(post)

      // Debug logging for E1 specifically
      if (variableId === 'X1') {
        console.log(`[${variableId}] Post: ${post.url || 'unknown'} | Score: ${result.actualScore}/${result.maxScore} | Authors: ${post.pageAnalysis.authors?.length || 0}`)
        if (post.pageAnalysis.authors && post.pageAnalysis.authors.length > 0) {
          post.pageAnalysis.authors.forEach((author: any) => {
            console.log(`  - ${author.name} (${author.credentials || 'no creds'}) [${author.source}]`)
          })
        }
      }

      return {
        score: result.actualScore,
        date: extractPostDate(post),
        evidence: result.evidence
      }
    } catch (error) {
      console.error(`[aggregateVariableAcrossPosts] Error detecting ${variableId} for post ${post?.url || 'unknown'}:`, error)
      return {
        score: 0,
        date: extractPostDate(post),
        evidence: []
      }
    }
  }).filter(r => r.score !== undefined && !isNaN(r.score))

  if (results.length === 0) {
    // Fallback if no posts could be analyzed
    const firstResult = detectorFn(posts[0])
    return firstResult
  }

  // Calculate average score
  const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length

  // Round to 2 decimal places
  const roundedScore = Math.round(avgScore * 100) / 100

  // Get config for this variable
  const config = getVariableConfig(variableId)
  if (!config) {
    return detectorFn(posts[0]) // Fallback
  }

  // Get dated results for trend detection and freshness distribution
  const datedResults = results
    .filter(r => r.date !== null)
    .sort((a, b) => a.date!.getTime() - b.date!.getTime())

  // Detect trend if dates are available
  const trend = detectScoreTrend(results)

  // Build aggregated evidence
  const evidence: EEATEvidence[] = [
    {
      type: 'metric',
      value: `Average across ${results.length} posts: ${roundedScore}/${config.maxScore}`,
      label: 'Aggregated score'
    }
  ]

  // Add trend commentary if detected
  if (trend.direction !== 'stable') {
    evidence.push({
      type: 'metric',
      value: `${trend.direction} (${trend.description})`,
      label: 'Trend',
      confidence: trend.confidence
    })
  }

  // Add score distribution info
  const distribution = getScoreDistribution(results, config)
  if (distribution) {
    evidence.push({
      type: 'metric',
      value: distribution,
      label: 'Distribution'
    })
  }

  // Special handling for E4 (Freshness): Add time-based distribution
  if (variableId === 'E4' && datedResults.length >= 5) {
    const freshnessDistribution = getFreshnessDistribution(datedResults)
    if (freshnessDistribution) {
      evidence.push({
        type: 'metric',
        value: freshnessDistribution,
        label: 'Freshness breakdown'
      })
    }
  }

  // Special handling for X1 (Authors): Add author strategy breakdown
  if (variableId === 'X1' && posts && posts.length >= 5) {
    try {
      const authorStrategy = getAuthorStrategyBreakdown(posts)
      if (authorStrategy) {
        evidence.push({
          type: 'metric',
          value: authorStrategy.summary,
          label: 'Author strategy'
        })
        if (authorStrategy.topAuthors) {
          evidence.push({
            type: 'snippet',
            value: authorStrategy.topAuthors,
            label: 'Top authors'
          })
        }
      }
    } catch (error) {
      console.error('[X1] Error getting author strategy breakdown:', error)
    }
  }

  // Special handling for A2 (Authors cited elsewhere): Add author coverage breakdown
  if (variableId === 'A2' && posts && posts.length >= 5) {
    try {
      const authorCoverage = getAuthorCoverageBreakdown(posts)
      if (authorCoverage) {
        evidence.push({
          type: 'metric',
          value: authorCoverage,
          label: 'Author coverage'
        })
      }
    } catch (error) {
      console.error('[A2] Error getting author coverage breakdown:', error)
    }
  }

  // Determine status based on average score
  const status = getVariableStatusFromScore(roundedScore, config)

  // Build recommendation with trend awareness
  let recommendation: string | undefined
  if (roundedScore < config.thresholds.good) {
    recommendation = `${config.name} is below optimal. `
    if (trend.direction === 'increasing') {
      recommendation += `Good news: trending upward. Continue this momentum.`
    } else if (trend.direction === 'decreasing') {
      recommendation += `Concerning: trending downward. Prioritize improvements in recent content.`
    } else {
      recommendation += `Focus on adding more ${config.name.toLowerCase()} to your content.`
    }
  } else if (trend.direction === 'decreasing' && roundedScore < config.thresholds.excellent) {
    recommendation = `Strong score, but trending downward. Maintain consistency in recent posts.`
  }

  return {
    id: config.id,
    name: config.name,
    description: config.description,
    maxScore: config.maxScore,
    actualScore: roundedScore,
    status,
    evidence,
    recommendation,
    detectionMethod: config.detectionMethod
  }
}

/**
 * Extract post date from various possible locations
 */
function extractPostDate(post: any): Date | null {
  // Try schema markup first
  if (post.pageAnalysis?.schemaMarkup) {
    for (const schema of post.pageAnalysis.schemaMarkup) {
      const dateModified = schema.data?.dateModified || schema.data?.dateUpdated
      const datePublished = schema.data?.datePublished

      const dateStr = dateModified || datePublished
      if (dateStr) {
        const date = new Date(dateStr)
        if (!isNaN(date.getTime())) {
          return date
        }
      }
    }
  }

  // Try top-level date fields
  if (post.date) {
    const date = new Date(post.date)
    if (!isNaN(date.getTime())) {
      return date
    }
  }

  return null
}

/**
 * Detect score trend over time
 */
function detectScoreTrend(results: Array<{ score: number; date: Date | null }>): {
  direction: 'increasing' | 'decreasing' | 'stable'
  description: string
  confidence: number
} {
  // Filter results with valid dates and sort by date
  const datedResults = results
    .filter(r => r.date !== null)
    .sort((a, b) => a.date!.getTime() - b.date!.getTime())

  if (datedResults.length < 3) {
    // Not enough dated posts to detect trend
    return { direction: 'stable', description: 'insufficient data', confidence: 0 }
  }

  // Split into older half and newer half
  const midpoint = Math.floor(datedResults.length / 2)
  const olderHalf = datedResults.slice(0, midpoint)
  const newerHalf = datedResults.slice(midpoint)

  const olderAvg = olderHalf.reduce((sum, r) => sum + r.score, 0) / olderHalf.length
  const newerAvg = newerHalf.reduce((sum, r) => sum + r.score, 0) / newerHalf.length

  const difference = newerAvg - olderAvg
  const percentChange = (difference / olderAvg) * 100

  // Confidence based on number of samples
  const confidence = Math.min(datedResults.length / 10, 1)

  // Determine trend direction
  if (Math.abs(percentChange) < 10) {
    return {
      direction: 'stable',
      description: `${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(1)}% change`,
      confidence
    }
  } else if (percentChange > 0) {
    return {
      direction: 'increasing',
      description: `+${percentChange.toFixed(1)}% from older to newer posts`,
      confidence
    }
  } else {
    return {
      direction: 'decreasing',
      description: `${percentChange.toFixed(1)}% from older to newer posts`,
      confidence
    }
  }
}

/**
 * Get score distribution description
 */
function getScoreDistribution(
  results: Array<{ score: number }>,
  config: any
): string | null {
  if (results.length < 5) return null

  const excellent = results.filter(r => r.score >= config.thresholds.excellent).length
  const good = results.filter(r => r.score >= config.thresholds.good && r.score < config.thresholds.excellent).length
  const needsImprovement = results.filter(r => r.score >= config.thresholds.needsImprovement && r.score < config.thresholds.good).length
  const poor = results.filter(r => r.score < config.thresholds.needsImprovement).length

  return `${excellent} excellent, ${good} good, ${needsImprovement} fair, ${poor} poor`
}

/**
 * Get variable configuration by ID
 */
function getVariableConfig(id: string): any {
  for (const category of Object.values(EEAT_VARIABLES)) {
    const variable = category.find((v: any) => v.id === id)
    if (variable) return variable
  }
  return null
}

/**
 * Get variable status from score and config
 */
function getVariableStatusFromScore(
  score: number,
  config: any
): 'excellent' | 'good' | 'needs-improvement' | 'poor' {
  if (score >= config.thresholds.excellent) return 'excellent'
  if (score >= config.thresholds.good) return 'good'
  if (score >= config.thresholds.needsImprovement) return 'needs-improvement'
  return 'poor'
}

/**
 * Get author coverage breakdown (for A2 specifically)
 * Shows which authors appear across the blog and their authority patterns
 */
function getAuthorCoverageBreakdown(posts: any[]): string | null {
  const authorMap = new Map<string, number>()

  posts.forEach(post => {
    const authors = post.pageAnalysis?.authors || []
    authors.forEach((author: any) => {
      const name = author.name || author.text || 'Unknown'
      authorMap.set(name, (authorMap.get(name) || 0) + 1)
    })
  })

  if (authorMap.size === 0) {
    return null
  }

  const postsWithAuthors = posts.filter(p => p.pageAnalysis?.authors?.length > 0).length
  const authorCoverage = Math.round((postsWithAuthors / posts.length) * 100)
  const uniqueAuthors = authorMap.size

  // Determine if blog has consistent authorship (few authors) or diverse (many authors)
  let pattern = ''
  if (uniqueAuthors === 1) {
    pattern = 'single author blog'
  } else if (uniqueAuthors <= 3) {
    pattern = 'consistent core team'
  } else if (uniqueAuthors <= 10) {
    pattern = 'moderate author diversity'
  } else {
    pattern = 'high author diversity'
  }

  return `${uniqueAuthors} unique authors, ${authorCoverage}% author coverage (${pattern})`
}

/**
 * Get author strategy breakdown (for X1 specifically)
 * Shows top authors by post count with credential quality
 */
function getAuthorStrategyBreakdown(posts: any[]): {
  summary: string
  topAuthors: string | null
} | null {
  // Extract all authors from posts
  const authorMap = new Map<string, { count: number; hasCredentials: boolean; posts: any[] }>()

  posts.forEach(post => {
    const authors = post.pageAnalysis?.authors || []
    authors.forEach((author: any) => {
      const name = author.name || author.text || 'Unknown'
      if (!authorMap.has(name)) {
        authorMap.set(name, { count: 0, hasCredentials: false, posts: [] })
      }
      const entry = authorMap.get(name)!
      entry.count++
      entry.posts.push(post)

      // Check for credentials in author object
      if (author.credentials || author.role || author.title) {
        entry.hasCredentials = true
      }
    })
  })

  if (authorMap.size === 0) {
    return null
  }

  // Sort authors by post count
  const sortedAuthors = Array.from(authorMap.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)

  // Calculate stats
  const totalAuthors = authorMap.size
  const postsWithAuthors = posts.filter(p => p.pageAnalysis?.authors?.length > 0).length
  const attributionRate = Math.round((postsWithAuthors / posts.length) * 100)
  const authorsWithCredentials = Array.from(authorMap.values()).filter(a => a.hasCredentials).length
  const credentialRate = Math.round((authorsWithCredentials / totalAuthors) * 100)

  // Build summary
  const summary = `${totalAuthors} authors, ${attributionRate}% attribution rate, ${credentialRate}% have credentials`

  // Build top authors list
  let topAuthors: string | null = null
  if (sortedAuthors.length > 0) {
    topAuthors = sortedAuthors
      .map(([name, data]) => {
        const cred = data.hasCredentials ? '✓' : '✗'
        return `${name} (${data.count} posts) ${cred}`
      })
      .join(', ')
  }

  return { summary, topAuthors }
}

/**
 * Get freshness distribution (for E4 specifically)
 * Shows % of posts updated within different time windows
 */
function getFreshnessDistribution(
  datedResults: Array<{ score: number; date: Date | null }>
): string | null {
  const now = new Date()
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 12, now.getDate())
  const twentyFourMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 24, now.getDate())

  let within6Months = 0
  let within12Months = 0
  let within24Months = 0
  let older = 0

  datedResults.forEach(result => {
    if (!result.date) return

    if (result.date >= sixMonthsAgo) {
      within6Months++
    } else if (result.date >= twelveMonthsAgo) {
      within12Months++
    } else if (result.date >= twentyFourMonthsAgo) {
      within24Months++
    } else {
      older++
    }
  })

  const total = datedResults.length
  const pct6 = Math.round((within6Months / total) * 100)
  const pct12 = Math.round(((within6Months + within12Months) / total) * 100)
  const pct24 = Math.round(((within6Months + within12Months + within24Months) / total) * 100)

  return `${pct6}% <6mo, ${pct12}% <12mo, ${pct24}% <24mo`
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
