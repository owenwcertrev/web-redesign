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
    let estimatedScore = 0.5 // Lower baseline for transparency
    const schema = pageAnalysis.schemaMarkup || []

    // 1. Professional infrastructure (max 1.0)
    if (pageAnalysis.hasSSL) {
      estimatedScore += 0.3
      evidence.push({ type: 'note', value: 'SSL certificate (estimated +0.3)' })
    }

    // Organization schema suggests established brand
    const hasOrgSchema = schema.some(s => s.type === 'Organization')
    if (hasOrgSchema) {
      estimatedScore += 0.4
      evidence.push({ type: 'note', value: 'Organization schema (estimated +0.4)' })
    }

    // Strong schema implementation (3+ types)
    if (schema.length >= 3) {
      estimatedScore += 0.3
      evidence.push({ type: 'note', value: `${schema.length} schema types (estimated +0.3)` })
    }

    // 2. Editorial standards (max 1.0)
    const hasAuthors = pageAnalysis.authors && pageAnalysis.authors.length > 0
    if (hasAuthors) {
      estimatedScore += 0.5
      evidence.push({ type: 'note', value: 'Named authors present (estimated +0.5)' })

      // Author with credentials
      const hasCredentials = pageAnalysis.authors?.some(author =>
        /\b(MD|PhD|MBA|DDS|JD|RN|MS|MA|BS|BA|DVM)\b/i.test(author.name || '')
      )
      if (hasCredentials) {
        estimatedScore += 0.3
        evidence.push({ type: 'note', value: 'Author credentials found (estimated +0.3)' })
      }
    }

    // Date stamps indicate content maintenance
    const hasDateStamps = schema.some(s => s.data?.dateModified || s.data?.datePublished)
    if (hasDateStamps) {
      estimatedScore += 0.2
      evidence.push({ type: 'note', value: 'Date stamps in schema (estimated +0.2)' })
    }

    // 3. Content quality (max 1.0)
    const wordCount = pageAnalysis.wordCount || 0
    if (wordCount >= 2000) {
      estimatedScore += 0.5
      evidence.push({ type: 'note', value: `${wordCount} words - comprehensive (estimated +0.5)` })
    } else if (wordCount >= 1000) {
      estimatedScore += 0.3
      evidence.push({ type: 'note', value: `${wordCount} words (estimated +0.3)` })
    }

    // Well-researched content with citations
    if (pageAnalysis.citationQuality?.totalCitations && pageAnalysis.citationQuality.totalCitations >= 5) {
      estimatedScore += 0.3
      evidence.push({ type: 'note', value: `${pageAnalysis.citationQuality.totalCitations} citations (estimated +0.3)` })
    }

    // High-quality citations (.gov/.edu)
    if (pageAnalysis.citationQuality?.qualityScore && pageAnalysis.citationQuality.qualityScore >= 70) {
      estimatedScore += 0.2
      evidence.push({ type: 'note', value: 'High-quality citations (estimated +0.2)' })
    }

    score = Math.min(estimatedScore, config.maxScore * 0.6) // Cap estimated scores at 60% of max (3/5)

    evidence.push({
      type: 'estimation',
      value: `${estimationNote} Estimated score capped at 60% of maximum. Run comprehensive analysis for full score.`,
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
  },
  pageAnalysis?: PageAnalysis
): EEATVariable {
  const config = EEAT_VARIABLES.authoritativeness.find(v => v.id === 'A2')!
  const evidence: EEATEvidence[] = []
  let score = 0
  let isEstimated = false

  if (authorReputation) {
    // Use API data when available
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
  } else if (pageAnalysis) {
    // Fallback: Estimate from on-page author signals
    isEstimated = true
    const schema = pageAnalysis.schemaMarkup || []
    const authors = pageAnalysis.authors || []

    // Check for author schema with sameAs links (indicates external profiles)
    const authorSchema = schema.find(s => s.type === 'Person')
    if (authorSchema?.data?.sameAs) {
      const sameAsLinks = Array.isArray(authorSchema.data.sameAs) ? authorSchema.data.sameAs : [authorSchema.data.sameAs]

      // Check for LinkedIn
      if (sameAsLinks.some((link: string) => link.includes('linkedin.com'))) {
        score += 0.8
        evidence.push({ type: 'note', value: 'LinkedIn link in author schema (estimated)' })
      }

      // Check for university/edu domains
      if (sameAsLinks.some((link: string) => link.includes('.edu'))) {
        score += 1.2
        evidence.push({ type: 'note', value: 'University profile link detected (estimated)' })
      }

      // Check for other professional profiles
      if (sameAsLinks.length >= 2) {
        score += 0.5
        evidence.push({ type: 'note', value: `${sameAsLinks.length} professional links (estimated)` })
      }
    }

    // Check for author presence with credentials
    if (authors.length > 0) {
      const hasCredentials = authors.some(author =>
        /\b(MD|PhD|MBA|DDS|JD|RN|MS|MA|BS|BA|DVM)\b/i.test(author.name || '')
      )
      if (hasCredentials) {
        score += 0.5
        evidence.push({ type: 'note', value: 'Author with credentials found (estimated)' })
      }
    }

    evidence.push({
      type: 'estimation',
      value: 'Estimated from on-page signals. Run comprehensive analysis for full score.',
      isEstimate: true
    })
  } else {
    return createEmptyVariable(config, 'Author reputation data not available')
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
    detectionMethod: config.detectionMethod,
    isEstimated,
    estimationNote: isEstimated ? 'Estimated from on-page signals' : undefined
  }
}

/**
 * A3: Entity clarity
 * Organization/Person schema with sameAs; About page
 */
export function detectEntityClarity(pageAnalysis?: PageAnalysis): EEATVariable {
  const config = EEAT_VARIABLES.authoritativeness.find(v => v.id === 'A3')!
  const evidence: EEATEvidence[] = []
  let score = 0

  if (!pageAnalysis) {
    return {
      id: config.id,
      name: config.name,
      description: config.description,
      maxScore: config.maxScore,
      actualScore: 0,
      status: 'poor',
      evidence: [{ type: 'note', value: 'No page data available' }],
      recommendation: 'Add Organization/Person schema and clear About page',
      detectionMethod: config.detectionMethod
    }
  }

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
export function detectIndependentReferences(
  domainMetrics?: DataForSEOMetrics,
  pageAnalysis?: PageAnalysis
): EEATVariable {
  const config = EEAT_VARIABLES.authoritativeness.find(v => v.id === 'A4')!
  const evidence: EEATEvidence[] = []
  let score = 0
  let isEstimated = false

  if (domainMetrics) {
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
  } else if (pageAnalysis) {
    // Fallback: Estimate authority from on-page quality signals
    isEstimated = true
    let estimatedScore = 0.5 // Baseline

    // Strong schema implementation suggests established site (likely has backlinks)
    const schema = pageAnalysis.schemaMarkup || []
    if (schema.length >= 5) {
      estimatedScore += 0.8
      evidence.push({ type: 'note', value: 'Comprehensive schema markup (estimated authority indicator)' })
    } else if (schema.length >= 3) {
      estimatedScore += 0.5
    }

    // Organization schema suggests established brand (likely cited)
    const hasOrgSchema = schema.some(s => s.type === 'Organization')
    if (hasOrgSchema) {
      estimatedScore += 0.5
      evidence.push({ type: 'note', value: 'Organization schema present (estimated)' })
    }

    // SSL and professional setup
    if (pageAnalysis.hasSSL) {
      estimatedScore += 0.3
    }

    // Comprehensive content suggests authority
    const wordCount = pageAnalysis.wordCount || 0
    if (wordCount >= 2000) {
      estimatedScore += 0.5
      evidence.push({ type: 'note', value: 'Comprehensive content (estimated authority)' })
    } else if (wordCount >= 1000) {
      estimatedScore += 0.3
    }

    // Quality citations suggest the site is well-researched (likely cited by others)
    if (pageAnalysis.citationQuality?.totalCitations && pageAnalysis.citationQuality.totalCitations >= 5) {
      estimatedScore += 0.4
      evidence.push({ type: 'note', value: 'Well-researched content with citations (estimated)' })
    }

    score = Math.min(estimatedScore, config.maxScore)

    evidence.push({
      type: 'estimation',
      value: 'Estimated from on-page quality signals. Run comprehensive analysis for accurate backlink data.',
      isEstimate: true
    })
  } else {
    return createEmptyVariable(config, 'Backlink data not available')
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
    detectionMethod: config.detectionMethod,
    isEstimated,
    estimationNote: isEstimated ? 'Estimated from on-page quality signals' : undefined
  }
}

/**
 * A5: Quality patterns
 * Absence of thin/affiliate/spam content
 */
export function detectQualityPatterns(pageAnalysis?: PageAnalysis, posts?: any[]): EEATVariable {
  const config = EEAT_VARIABLES.authoritativeness.find(v => v.id === 'A5')!
  const evidence: EEATEvidence[] = []
  let score = config.maxScore // Start at max, deduct for issues

  // For blog analysis with multiple posts, analyze across all posts
  if (posts && posts.length > 1) {
    // Aggregate quality signals across all posts
    let thinContentCount = 0
    let totalWordCount = 0

    posts.forEach(post => {
      const wc = post.pageAnalysis?.wordCount || 0
      totalWordCount += wc
      if (wc < 300) thinContentCount++
    })

    const avgWordCount = totalWordCount / posts.length
    const thinContentRate = (thinContentCount / posts.length) * 100

    // Penalize high rate of thin content
    if (thinContentRate > 50) {
      score -= 2
      evidence.push({
        type: 'note',
        value: `${thinContentRate.toFixed(0)}% posts are thin (<300 words)`
      })
    } else if (thinContentRate > 25) {
      score -= 1
      evidence.push({
        type: 'note',
        value: `${thinContentRate.toFixed(0)}% posts are thin (<300 words)`
      })
    }

    evidence.push({
      type: 'metric',
      value: `Average: ${Math.round(avgWordCount)} words per post`,
      label: 'Content depth across blog'
    })

    // Check for duplicate content (title similarity)
    try {
      const duplicateRate = detectDuplicateContent(posts)
      if (duplicateRate > 20) {
        score -= 0.5
        evidence.push({
          type: 'note',
          value: `${duplicateRate.toFixed(0)}% title similarity detected (possible duplicate content)`
        })
      }

      // Check for keyword cannibalization (similar titles targeting same keywords)
      const cannibalizationRate = detectKeywordCannibalization(posts)
      if (cannibalizationRate > 15) {
        score -= 0.5
        evidence.push({
          type: 'note',
          value: `${cannibalizationRate.toFixed(0)}% keyword overlap (possible cannibalization)`
        })
      }

      // Report quality checks
      if (duplicateRate <= 10 && cannibalizationRate <= 10) {
        evidence.push({
          type: 'metric',
          value: 'No significant duplicate content or keyword cannibalization detected',
          label: 'Advanced quality checks'
        })
      }
    } catch (error) {
      console.error('[A5] Error in advanced quality checks:', error)
      // Continue without advanced checks if they fail
    }
  } else if (pageAnalysis) {
    // Single page analysis
    const wordCount = pageAnalysis.wordCount || 0

    // Check for thin content
    if (wordCount < 300) {
      score -= 1.5
      evidence.push({
        type: 'note',
        value: `Thin content: ${wordCount} words`
      })
    }
  }

  // Note: Affiliate link detection would require individual link analysis
  // Currently not available in PageAnalysis structure

  // Check blog posts for quality consistency (legacy logic)
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

/**
 * Detect duplicate content via title similarity
 * Returns percentage of posts with very similar titles
 */
function detectDuplicateContent(posts: any[]): number {
  if (posts.length < 2) return 0

  let similarPairs = 0
  let totalComparisons = 0

  // Compare each post title with every other post
  for (let i = 0; i < posts.length; i++) {
    for (let j = i + 1; j < posts.length; j++) {
      const title1 = posts[i].title || posts[i].pageAnalysis?.title || ''
      const title2 = posts[j].title || posts[j].pageAnalysis?.title || ''

      if (title1 && title2) {
        totalComparisons++
        const similarity = calculateTitleSimilarity(title1, title2)
        // Consider >70% similarity as potential duplicate
        if (similarity > 0.7) {
          similarPairs++
        }
      }
    }
  }

  return totalComparisons > 0 ? (similarPairs / totalComparisons) * 100 : 0
}

/**
 * Detect keyword cannibalization via keyword overlap
 * Returns percentage of posts targeting similar keywords
 */
function detectKeywordCannibalization(posts: any[]): number {
  if (posts.length < 2) return 0

  let overlapPairs = 0
  let totalComparisons = 0

  // Extract main keywords from titles (first 3 important words)
  const postKeywords = posts.map(post => {
    const title = post.title || post.pageAnalysis?.title || ''
    return extractKeywords(title)
  })

  // Compare keyword sets
  for (let i = 0; i < postKeywords.length; i++) {
    for (let j = i + 1; j < postKeywords.length; j++) {
      if (postKeywords[i].length > 0 && postKeywords[j].length > 0) {
        totalComparisons++
        const overlap = calculateKeywordOverlap(postKeywords[i], postKeywords[j])
        // Consider >50% keyword overlap as potential cannibalization
        if (overlap > 0.5) {
          overlapPairs++
        }
      }
    }
  }

  return totalComparisons > 0 ? (overlapPairs / totalComparisons) * 100 : 0
}

/**
 * Calculate title similarity using Jaccard index
 */
function calculateTitleSimilarity(title1: string, title2: string): number {
  const words1 = new Set(title1.toLowerCase().split(/\s+/).filter(w => w.length > 3))
  const words2 = new Set(title2.toLowerCase().split(/\s+/).filter(w => w.length > 3))

  if (words1.size === 0 || words2.size === 0) return 0

  const words1Array = Array.from(words1)
  const words2Array = Array.from(words2)

  const intersection = new Set(words1Array.filter(x => words2.has(x)))
  const union = new Set([...words1Array, ...words2Array])

  return intersection.size / union.size
}

/**
 * Extract keywords from title (remove stop words, keep important words)
 */
function extractKeywords(title: string): string[] {
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'under', 'again', 'further', 'then', 'once', 'how', 'what', 'when', 'where', 'why', 'which', 'who', 'whom'])

  return title
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word))
    .slice(0, 5) // Keep top 5 keywords
}

/**
 * Calculate keyword overlap between two keyword sets
 */
function calculateKeywordOverlap(keywords1: string[], keywords2: string[]): number {
  if (keywords1.length === 0 || keywords2.length === 0) return 0

  const set1 = new Set(keywords1)
  const set2 = new Set(keywords2)
  const set1Array = Array.from(set1)
  const intersection = new Set(set1Array.filter(x => set2.has(x)))

  return intersection.size / Math.min(set1.size, set2.size)
}
