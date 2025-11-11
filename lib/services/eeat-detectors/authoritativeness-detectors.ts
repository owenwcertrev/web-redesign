/**
 * Authoritativeness Detectors (A1-A7)
 * Automated detection for reputation & identity signals
 */

import type { PageAnalysis } from '../url-analyzer'
import type { DataForSEOMetrics } from '../dataforseo-api'
import type { EEATVariable, EEATEvidence, BlogInsights } from '../../types/blog-analysis'
import { EEAT_VARIABLES } from '../../eeat-config'

/**
 * A1: Editorial mentions
 * High-quality mentions in trade press, reputable orgs (requires external API)
 */
export function detectEditorialMentions(
  domainMetrics?: DataForSEOMetrics,
  authorReputation?: { mediaCount?: number },
  pageAnalysis?: PageAnalysis,
  apiError?: string
): EEATVariable {
  const config = EEAT_VARIABLES.authoritativeness.find(v => v.id === 'A1')!
  const evidence: EEATEvidence[] = []
  let score = 0
  let isEstimated = false
  let estimationNote: string | undefined

  // Use domain rank as proxy for editorial mentions
  if (domainMetrics?.domainRank) {
    const rank = domainMetrics.domainRank
    if (rank >= 80) score += 2.5 // High domain authority (80-100) likely has mentions
    else if (rank >= 60) score += 2
    else if (rank >= 40) score += 1.5
    else if (rank >= 20) score += 1

    evidence.push({
      type: 'metric',
      value: `Domain authority: ${rank}/100`,
      confidence: score / config.maxScore
    })
  }

  // Use organic keywords as signal for brand recognition
  if (domainMetrics?.organicKeywords) {
    const keywords = domainMetrics.organicKeywords
    if (keywords >= 100000) score += 2.5
    else if (keywords >= 50000) score += 2
    else if (keywords >= 10000) score += 1.5
    else if (keywords >= 1000) score += 1

    evidence.push({
      type: 'metric',
      value: `${keywords.toLocaleString()} organic keywords`,
      label: 'Brand visibility'
    })
  }

  // Author media mentions
  if (authorReputation?.mediaCount) {
    score += Math.min(authorReputation.mediaCount * 0.5, 1)
    evidence.push({
      type: 'metric',
      value: `${authorReputation.mediaCount} media mentions`
    })
  }

  // Fallback estimation if API failed
  if (!domainMetrics && pageAnalysis) {
    isEstimated = true
    estimationNote = `Couldn't fetch domain metrics${apiError ? ` (${apiError})` : ''}. Estimating based on on-page quality signals.`

    // Estimate based on on-page signals
    let estimatedScore = 1.5 // Baseline

    // SSL indicates professional site
    if (pageAnalysis.hasSSL) estimatedScore += 0.5

    // Schema indicates technical sophistication
    if (pageAnalysis.schemaMarkup && pageAnalysis.schemaMarkup.length >= 3) estimatedScore += 0.5
    else if (pageAnalysis.schemaMarkup && pageAnalysis.schemaMarkup.length > 0) estimatedScore += 0.3

    // Author presence indicates editorial standards
    if (pageAnalysis.authors && pageAnalysis.authors.length > 0) estimatedScore += 0.5

    // Content quality signals
    if (pageAnalysis.wordCount && pageAnalysis.wordCount >= 1000) estimatedScore += 0.5

    score = Math.min(estimatedScore, config.maxScore)

    evidence.push({
      type: 'estimation',
      value: estimationNote,
      isEstimate: true
    })
  } else if (!domainMetrics) {
    // No API data and no page analysis - cannot estimate
    return createEmptyVariable(config, 'Domain metrics unavailable - run comprehensive analysis for full score')
  }

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
      ? 'Build brand authority through editorial mentions, press coverage, and thought leadership'
      : undefined,
    detectionMethod: config.detectionMethod,
    isEstimated,
    estimationNote
  }
}

/**
 * A2: Authors cited elsewhere
 * Author presence on faculty pages, committees, profiles
 */
export function detectAuthorsCitedElsewhere(
  authorReputation?: {
    hasLinkedIn?: boolean
    hasPublications?: boolean
    hasMediaMentions?: boolean
    hasUniversityProfile?: boolean
  }
): EEATVariable {
  const config = EEAT_VARIABLES.authoritativeness.find(v => v.id === 'A2')!
  const evidence: EEATEvidence[] = []
  let score = 0

  if (!authorReputation) {
    return createEmptyVariable(config, 'Author reputation data not available')
  }

  if (authorReputation.hasLinkedIn) {
    score += 1
    evidence.push({ type: 'note', value: 'LinkedIn profile found' })
  }

  if (authorReputation.hasPublications) {
    score += 1.5
    evidence.push({ type: 'note', value: 'Professional publications found' })
  }

  if (authorReputation.hasMediaMentions) {
    score += 1
    evidence.push({ type: 'note', value: 'Media mentions found' })
  }

  if (authorReputation.hasUniversityProfile) {
    score += 1.5
    evidence.push({ type: 'note', value: 'University/faculty profile found' })
  }

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
      ? 'Ensure authors have external professional profiles (LinkedIn, faculty pages, publications)'
      : undefined,
    detectionMethod: config.detectionMethod
  }
}

/**
 * A3: Entity clarity
 * Organization/Person schema with sameAs; About page
 */
export function detectEntityClarity(pageAnalysis: PageAnalysis): EEATVariable {
  const config = EEAT_VARIABLES.authoritativeness.find(v => v.id === 'A3')!
  const evidence: EEATEvidence[] = []
  let score = 0

  const schema = pageAnalysis.schemaMarkup || []

  // Check for Organization schema
  const orgSchema = schema.find(s => s.type === 'Organization')
  if (orgSchema?.data) {
    score += 1.5
    evidence.push({
      type: 'snippet',
      value: orgSchema.data.name || 'Organization schema present',
      label: 'Organization markup'
    })

    // Check for sameAs in Organization
    if (orgSchema.data.sameAs) {
      score += 1
      const sameAsLinks = Array.isArray(orgSchema.data.sameAs) ? orgSchema.data.sameAs : [orgSchema.data.sameAs]
      evidence.push({
        type: 'metric',
        value: `${sameAsLinks.length} sameAs links`,
        label: 'Social/profile links'
      })
    }

    // Check for logo
    if (orgSchema.data.logo) {
      score += 0.5
      evidence.push({ type: 'note', value: 'Organization logo present' })
    }
  }

  // Check for Person schema
  const personSchema = schema.find(s => s.type === 'Person')
  if (personSchema?.data) {
    score += 1
    evidence.push({
      type: 'snippet',
      value: personSchema.data.name || 'Person schema present',
      label: 'Person markup'
    })

    if (personSchema.data.sameAs) {
      score += 0.5
      evidence.push({ type: 'note', value: 'Person sameAs links present' })
    }
  }

  // Note: About page link detection would require individual link analysis
  // Currently not available in PageAnalysis structure

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
      ? 'Add Organization schema with sameAs links and ensure About page is accessible'
      : undefined,
    detectionMethod: config.detectionMethod
  }
}

/**
 * A4: Independent references
 * Other sites citing your content (backlinks from DataForSEO)
 */
export function detectIndependentReferences(domainMetrics?: DataForSEOMetrics): EEATVariable {
  const config = EEAT_VARIABLES.authoritativeness.find(v => v.id === 'A4')!
  const evidence: EEATEvidence[] = []
  let score = 0

  if (!domainMetrics) {
    return createEmptyVariable(config, 'Backlink data not available')
  }

  // Use referring domains as proxy for independent references
  const referringDomains = domainMetrics.referringDomains || 0

  if (referringDomains >= 1000) score = config.maxScore
  else if (referringDomains >= 500) score = 3.5
  else if (referringDomains >= 100) score = 3
  else if (referringDomains >= 50) score = 2
  else if (referringDomains >= 10) score = 1
  else score = 0.5

  evidence.push({
    type: 'metric',
    value: `${referringDomains.toLocaleString()} referring domains`,
    confidence: score / config.maxScore
  })

  // Use organic traffic as quality signal
  if (domainMetrics.organicTrafficValue) {
    const trafficValue = domainMetrics.organicTrafficValue
    evidence.push({
      type: 'metric',
      value: `$${trafficValue.toLocaleString()} estimated traffic value`,
      label: 'Quality indicator'
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
      ? 'Build backlinks through quality content that other sites reference and cite'
      : undefined,
    detectionMethod: config.detectionMethod
  }
}

/**
 * A5: Quality patterns
 * Absence of thin/affiliate/spam content
 */
export function detectQualityPatterns(pageAnalysis: PageAnalysis, posts?: any[]): EEATVariable {
  const config = EEAT_VARIABLES.authoritativeness.find(v => v.id === 'A5')!
  const evidence: EEATEvidence[] = []
  let score = config.maxScore // Start at max, deduct for issues

  const wordCount = pageAnalysis.wordCount || 0

  // Check for thin content
  if (wordCount < 300) {
    score -= 1.5
    evidence.push({
      type: 'note',
      value: `Thin content: ${wordCount} words`
    })
  }

  // Note: Affiliate link detection would require individual link analysis
  // Currently not available in PageAnalysis structure

  // Check blog posts for quality consistency
  if (posts && posts.length > 0) {
    const thinPosts = posts.filter(p => (p.wordCount || 0) < 300).length
    const thinRatio = thinPosts / posts.length

    if (thinRatio > 0.3) {
      score -= 1
      evidence.push({
        type: 'note',
        value: `${Math.round(thinRatio * 100)}% of posts are thin content (<300 words)`
      })
    }
  }

  if (score === config.maxScore) {
    evidence.push({
      type: 'note',
      value: 'No low-quality patterns detected'
    })
  }

  score = Math.max(0, Math.min(score, config.maxScore))
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
      ? 'Remove thin content and reduce affiliate link density to improve quality signals'
      : undefined,
    detectionMethod: config.detectionMethod
  }
}

/**
 * A6: Internal linking network
 * Strong link graph shows topical authority
 */
export function detectInternalLinkingNetwork(blogInsights?: BlogInsights): EEATVariable {
  const config = EEAT_VARIABLES.authoritativeness.find(v => v.id === 'A6')!
  const evidence: EEATEvidence[] = []
  let score = 0

  if (!blogInsights) {
    return createEmptyVariable(config, 'Blog analysis not available')
  }

  const internalLinking = blogInsights.internalLinking
  const avgLinks = internalLinking.avgInternalLinksPerPost

  // Score based on avg internal links
  if (avgLinks >= 5) score += 1.5
  else if (avgLinks >= 3) score += 1
  else if (avgLinks >= 1) score += 0.5

  // Network strength bonus
  if (internalLinking.networkStrength === 'strong') score += 1.5
  else if (internalLinking.networkStrength === 'moderate') score += 1
  else if (internalLinking.networkStrength === 'weak') score += 0.5

  // Link density bonus
  if (internalLinking.linkDensity >= 3) score += 0.5
  else if (internalLinking.linkDensity >= 2) score += 0.3

  evidence.push({
    type: 'metric',
    value: `${avgLinks.toFixed(1)} internal links per post`,
    label: `Network: ${internalLinking.networkStrength}`
  })

  evidence.push({
    type: 'metric',
    value: `${internalLinking.linkDensity.toFixed(1)} links per 1000 words`
  })

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
      ? 'Add more internal links (5+ per post) to build strong topical authority network'
      : undefined,
    detectionMethod: config.detectionMethod
  }
}

/**
 * A7: Topic focus
 * Concentrated expertise vs scattered topics
 */
export function detectTopicFocus(blogInsights?: BlogInsights): EEATVariable {
  const config = EEAT_VARIABLES.authoritativeness.find(v => v.id === 'A7')!
  const evidence: EEATEvidence[] = []
  let score = 0

  if (!blogInsights) {
    return createEmptyVariable(config, 'Blog analysis not available')
  }

  const topicDiversity = blogInsights.topicDiversity

  // Score based on coverage type (focused is best)
  if (topicDiversity.coverage === 'focused') {
    score = config.maxScore
  } else if (topicDiversity.coverage === 'diverse') {
    score = 1.5
  } else if (topicDiversity.coverage === 'narrow') {
    score = 1.3
  } else {
    score = 0.7 // scattered
  }

  // Focus score bonus
  const focusBonus = (topicDiversity.focusScore / 100) * 0.5
  score += focusBonus

  evidence.push({
    type: 'metric',
    value: `Coverage: ${topicDiversity.coverage}`,
    label: `${topicDiversity.uniqueTopics} unique topics`
  })

  evidence.push({
    type: 'metric',
    value: `Focus score: ${topicDiversity.focusScore}/100`
  })

  if (topicDiversity.topKeywords.length > 0) {
    evidence.push({
      type: 'snippet',
      value: topicDiversity.topKeywords.slice(0, 5).map(k => k.keyword).join(', '),
      label: 'Top keywords'
    })
  }

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
      ? 'Focus content on core topics to demonstrate concentrated expertise rather than scattered coverage'
      : undefined,
    detectionMethod: config.detectionMethod
  }
}

/**
 * Helper functions
 */

function getVariableStatus(
  score: number,
  config: typeof EEAT_VARIABLES.authoritativeness[0]
): 'excellent' | 'good' | 'needs-improvement' | 'poor' {
  if (score >= config.thresholds.excellent) return 'excellent'
  if (score >= config.thresholds.good) return 'good'
  if (score >= config.thresholds.needsImprovement) return 'needs-improvement'
  return 'poor'
}

function createEmptyVariable(
  config: typeof EEAT_VARIABLES.authoritativeness[0],
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
