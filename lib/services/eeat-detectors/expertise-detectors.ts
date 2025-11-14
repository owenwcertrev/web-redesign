/**
 * Expertise Detectors (X1-X6)
 * Automated detection for credentials, depth, and evidence signals
 */

import type { PageAnalysis } from '../url-analyzer'
import type { NLPAnalysisResult } from '../nlp-analyzer'
import type { EEATVariable, EEATEvidence, BlogInsights } from '../../types/blog-analysis'
import { EEAT_VARIABLES } from '../../eeat-config'

/**
 * X1: Named authors with credentials
 * Detect author name + role/degree + headshot + bio page
 */
export function detectNamedAuthorsWithCredentials(
  pageAnalysis: PageAnalysis,
  authorReputation?: { hasLinkedIn?: boolean; hasPublications?: boolean; hasMediaMentions?: boolean }
): EEATVariable {
  const config = EEAT_VARIABLES.expertise.find(v => v.id === 'X1')!
  const evidence: EEATEvidence[] = []
  let score = 0

  // Null safety checks
  if (!pageAnalysis) {
    return {
      id: config.id,
      name: config.name,
      description: config.description,
      maxScore: config.maxScore,
      actualScore: 0,
      status: 'poor',
      evidence: [{ type: 'note', value: 'No page analysis data available' }],
      recommendation: 'Unable to analyze - page data missing',
      detectionMethod: config.detectionMethod
    }
  }

  const schema = pageAnalysis.schemaMarkup || []
  const authors = pageAnalysis.authors || []

  console.error('[X1 Detector] Starting with:', {
    schemaCount: schema.length,
    authorsCount: authors.length,
    authors
  })

  // Check for author schema with detailed info
  schema.forEach(s => {
    if (s.type === 'Person' && s.data?.name) {
      score += 1.5
      evidence.push({
        type: 'snippet',
        value: s.data.name,
        label: 'Author in schema'
      })

      // Check for credentials in schema
      if (s.data.jobTitle || s.data.description) {
        score += 1
        evidence.push({
          type: 'snippet',
          value: s.data.jobTitle || s.data.description,
          label: 'Author credentials in schema'
        })
      }

      // Check for image (headshot)
      if (s.data.image) {
        score += 0.5
        evidence.push({
          type: 'note',
          value: 'Author photo found'
        })
      }

      // Check for url/sameAs (bio page)
      if (s.data.url || s.data.sameAs) {
        score += 1
        evidence.push({
          type: 'url',
          value: s.data.url || (Array.isArray(s.data.sameAs) ? s.data.sameAs[0] : s.data.sameAs),
          label: 'Author bio/profile link'
        })
      }
    }

    // Check for reviewedBy (medical/health content)
    if (s.data?.reviewedBy) {
      const reviewers = Array.isArray(s.data.reviewedBy) ? s.data.reviewedBy : [s.data.reviewedBy]

      reviewers.forEach((reviewer: any) => {
        const reviewerName = typeof reviewer === 'string' ? reviewer : reviewer?.name

        if (reviewerName) {
          score += 1.5
          evidence.push({
            type: 'snippet',
            value: reviewerName,
            label: 'Medical reviewer in schema'
          })

          // Check for reviewer credentials
          const reviewerCreds = reviewer?.jobTitle || reviewer?.description
          if (reviewerCreds || /MD|PhD|RN|MPH|DDS|PharmD|RD|CNE|COI/i.test(reviewerName)) {
            score += 1
            evidence.push({
              type: 'snippet',
              value: reviewerCreds || 'Credentials in name',
              label: 'Reviewer credentials'
            })
          }

          // Check for reviewer photo
          if (reviewer?.image) {
            score += 0.5
            evidence.push({
              type: 'note',
              value: 'Reviewer photo found'
            })
          }

          // Check for reviewer profile URL
          if (reviewer?.url) {
            score += 0.5
            evidence.push({
              type: 'url',
              value: reviewer.url,
              label: 'Reviewer profile link'
            })
          }
        }
      })
    }

    // Check for medicalReviewer (alternate naming)
    if (s.data?.medicalReviewer) {
      const reviewers = Array.isArray(s.data.medicalReviewer) ? s.data.medicalReviewer : [s.data.medicalReviewer]

      reviewers.forEach((reviewer: any) => {
        const reviewerName = typeof reviewer === 'string' ? reviewer : reviewer?.name

        if (reviewerName) {
          score += 1.5
          evidence.push({
            type: 'snippet',
            value: reviewerName,
            label: 'Medical reviewer in schema'
          })

          // Check for credentials
          const reviewerCreds = reviewer?.jobTitle || reviewer?.description
          if (reviewerCreds) {
            score += 1
            evidence.push({
              type: 'snippet',
              value: reviewerCreds,
              label: 'Reviewer credentials'
            })
          }
        }
      })
    }
  })

  // Check byline authors
  if (authors.length > 0) {
    authors.forEach(author => {
      if (author.name) {
        score += 0.5
        evidence.push({
          type: 'snippet',
          value: author.name,
          label: 'Byline author'
        })

        // Detect credentials in author name
        const credentialPatterns = /\b(MD|PhD|RN|MPH|DDS|JD|MBA|MSc|BSc|Dr\.|Prof\.|PharmD|RD|CNE|COI|PA-C|MCMSc|MSN|DO|NP|APRN)\b/gi
        if (credentialPatterns.test(author.name)) {
          score += 1
          evidence.push({
            type: 'note',
            value: 'Professional credentials detected'
          })
        }

        // Check for credentials field
        if (author.credentials) {
          score += 0.5
          evidence.push({
            type: 'snippet',
            value: author.credentials,
            label: 'Author credentials'
          })
        }

        // Check for author photo
        if (author.photo) {
          score += 0.5
          evidence.push({
            type: 'note',
            value: 'Author photo found'
          })
        }

        // Check for author bio/profile URL
        if (author.url) {
          score += 1
          evidence.push({
            type: 'url',
            value: author.url,
            label: 'Author bio/profile link'
          })
        }
      }
    })
  }

  // Reputation bonus (from external API)
  if (authorReputation) {
    if (authorReputation.hasLinkedIn) {
      score += 0.5
      evidence.push({ type: 'note', value: 'LinkedIn profile found' })
    }
    if (authorReputation.hasPublications) {
      score += 0.5
      evidence.push({ type: 'note', value: 'Professional publications found' })
    }
    if (authorReputation.hasMediaMentions) {
      score += 0.5
      evidence.push({ type: 'note', value: 'Media mentions found' })
    }
  }

  // Cap at maxScore
  const uncappedScore = score
  score = Math.min(score, config.maxScore)

  console.error('[X1 Detector] Final score:', {
    uncappedScore,
    cappedScore: score,
    maxScore: config.maxScore,
    evidenceCount: evidence.length,
    evidence
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
      ? 'Add author bylines with full credentials (name, degree, photo) and link to detailed bio pages'
      : undefined,
    detectionMethod: config.detectionMethod
  }
}

/**
 * X2: YMYL reviewer presence
 * Detect "Reviewed by [Name, Credentials]" on health/financial content
 */
export function detectYMYLReviewerPresence(pageAnalysis: PageAnalysis): EEATVariable {
  const config = EEAT_VARIABLES.expertise.find(v => v.id === 'X2')!
  const evidence: EEATEvidence[] = []
  let score = 0

  const text = pageAnalysis.contentText || ''
  const schema = pageAnalysis.schemaMarkup || []

  // Check if content is YMYL
  const ymylIndicators = ['medical', 'health', 'treatment', 'disease', 'symptoms', 'diagnosis', 'financial', 'investment', 'tax']
  const isYMYL = ymylIndicators.some(indicator => text.toLowerCase().includes(indicator))

  if (!isYMYL) {
    // Not YMYL content - full score
    score = config.maxScore
    evidence.push({
      type: 'note',
      value: 'Not YMYL content - reviewer not required'
    })
  } else {
    // Check for reviewer mentions
    const reviewerPatterns = [
      /\b(reviewed by|medically reviewed by|fact-checked by|verified by)\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/gi,
      /\b(medical reviewer|clinical reviewer|expert reviewer):\s*([A-Z][a-z]+)/gi
    ]

    reviewerPatterns.forEach(pattern => {
      const matches = text.match(pattern)
      if (matches) {
        score += 2
        evidence.push({
          type: 'snippet',
          value: matches[0],
          label: 'Reviewer mention'
        })
      }
    })

    // Check for reviewer in schema
    const reviewSchema = schema.find(s => s.data?.reviewedBy || s.data?.medicalReviewer)
    if (reviewSchema?.data) {
      score += 2
      const reviewer = reviewSchema.data.reviewedBy || reviewSchema.data.medicalReviewer
      evidence.push({
        type: 'snippet',
        value: typeof reviewer === 'string' ? reviewer : (reviewer as any)?.name || 'Reviewer found',
        label: 'Reviewer in schema'
      })
    }

    // Check for credentials in reviewer mention
    const credentialPatterns = /\b(MD|PhD|RN|MPH|DDS|CFA|CFP)\b/gi
    if (credentialPatterns.test(text)) {
      score += 1
      evidence.push({
        type: 'note',
        value: 'Reviewer credentials detected'
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
    recommendation: isYMYL && score < config.thresholds.good
      ? 'Add "Medically reviewed by [Name, Credentials]" or similar reviewer disclosure on YMYL content'
      : undefined,
    detectionMethod: config.detectionMethod
  }
}

/**
 * X3: Credential verification links
 * Detect sameAs links to LinkedIn, hospitals, universities, license boards
 */
export function detectCredentialVerificationLinks(pageAnalysis: PageAnalysis): EEATVariable {
  const config = EEAT_VARIABLES.expertise.find(v => v.id === 'X3')!
  const evidence: EEATEvidence[] = []
  let score = 0

  const schema = pageAnalysis.schemaMarkup || []

  // Verification domains
  const verificationDomains = [
    'linkedin.com',
    'twitter.com',
    'researchgate.net',
    'scholar.google.com',
    'orcid.org',
    '.edu', // Universities
    'hospital', // Hospital domains
    'medical', // Medical institutions
    'license', // License boards
    'board', // Professional boards
  ]

  // Check sameAs in Person schema
  schema.forEach(s => {
    if (s.type === 'Person' && s.data?.sameAs) {
      const sameAsLinks: string[] = Array.isArray(s.data.sameAs) ? s.data.sameAs : [s.data.sameAs]
      sameAsLinks.forEach((link: string) => {
        const matchesDomain = verificationDomains.some(domain => link.includes(domain))
        if (matchesDomain) {
          score += 1
          evidence.push({
            type: 'url',
            value: link,
            label: 'Credential verification link in schema'
          })
        }
      })
    }
  })

  // Note: Individual link analysis not available in PageAnalysis structure
  // Links are only available as counts (internal/external)

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
      ? 'Add sameAs links in author schema pointing to LinkedIn, university, or professional profiles'
      : undefined,
    detectionMethod: config.detectionMethod
  }
}

/**
 * X4: Citation quality
 * Proportion of .gov/.edu/peer-reviewed sources
 */
export function detectCitationQuality(pageAnalysis: PageAnalysis): EEATVariable {
  const config = EEAT_VARIABLES.expertise.find(v => v.id === 'X4')!
  const evidence: EEATEvidence[] = []
  let score = 0

  const citationQuality = pageAnalysis.citationQuality

  if (citationQuality && citationQuality.totalCitations > 0) {
    const qualityScore = citationQuality.qualityScore || 0

    // Score based on citation quality
    if (qualityScore >= 80 && citationQuality.totalCitations >= 5) {
      score = config.maxScore
    } else if (qualityScore >= 60 || citationQuality.totalCitations >= 4) {
      score = 3
    } else if (qualityScore >= 40 || citationQuality.totalCitations >= 3) {
      score = 2
    } else if (citationQuality.totalCitations >= 1) {
      score = 1
    }

    evidence.push({
      type: 'metric',
      value: `${citationQuality.totalCitations} citations (quality score: ${qualityScore}/100)`,
      confidence: score / config.maxScore
    })

    // Add tier breakdown if available (with null check)
    if (citationQuality.breakdown?.tier1 && citationQuality.breakdown.tier1 > 0) {
      evidence.push({
        type: 'metric',
        value: `${citationQuality.breakdown.tier1} tier-1 sources (gov/edu/peer-reviewed)`,
        label: 'High-quality citations'
      })
    }
  } else {
    evidence.push({
      type: 'note',
      value: 'No external citations found'
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
      ? 'Cite more authoritative sources (.gov, .edu, peer-reviewed journals) to support claims'
      : undefined,
    detectionMethod: config.detectionMethod
  }
}

/**
 * X5: Content depth & clarity
 * Check heading structure, definitions, internal links
 */
export function detectContentDepthClarity(pageAnalysis: PageAnalysis, nlpAnalysis?: NLPAnalysisResult): EEATVariable {
  const config = EEAT_VARIABLES.expertise.find(v => v.id === 'X5')!
  const evidence: EEATEvidence[] = []
  let score = 0

  const headings = pageAnalysis.headings || { h1: [], h2: [], h3: [] }
  const links = pageAnalysis.links || { internal: 0, external: 0 }
  const wordCount = pageAnalysis.wordCount || 0

  // Check heading structure (H2, H3 present)
  const h2Count = headings.h2?.length || 0
  const h3Count = headings.h3?.length || 0

  if (h2Count >= 3 && h3Count >= 2) {
    score += 1.5
    evidence.push({
      type: 'metric',
      value: `${h2Count} H2 + ${h3Count} H3 headings`,
      label: 'Strong heading structure'
    })
  } else if (h2Count >= 2) {
    score += 0.8
    evidence.push({
      type: 'metric',
      value: `${h2Count} H2 headings`,
      label: 'Basic heading structure'
    })
  }

  // Check for internal links (shows depth)
  const internalLinksCount = links.internal
  if (internalLinksCount >= 5) {
    score += 1
    evidence.push({
      type: 'metric',
      value: `${internalLinksCount} internal links`,
      label: 'Good internal linking'
    })
  } else if (internalLinksCount >= 2) {
    score += 0.5
  }

  // Use NLP expertise depth if available
  if (nlpAnalysis?.expertiseDepthScore) {
    const expertiseScore = (nlpAnalysis.expertiseDepthScore / 10) * 0.5
    score += expertiseScore
    evidence.push({
      type: 'metric',
      value: `${nlpAnalysis.expertiseDepthScore}/10 expertise depth`,
      label: 'NLP analysis'
    })
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
      ? 'Improve content structure with clear H2/H3 headings and add internal links to related content'
      : undefined,
    detectionMethod: config.detectionMethod
  }
}

/**
 * X6: Author consistency
 * Consistent author attribution across blog
 */
export function detectAuthorConsistency(blogInsights?: BlogInsights): EEATVariable {
  const config = EEAT_VARIABLES.expertise.find(v => v.id === 'X6')!
  const evidence: EEATEvidence[] = []
  let score = 0

  if (!blogInsights) {
    return createEmptyVariable(config, 'Blog analysis not available')
  }

  const authorConsistency = blogInsights.authorConsistency
  const attributionRate = authorConsistency.attributionRate

  // Score based on attribution rate
  if (attributionRate >= 95) {
    score = config.maxScore
  } else if (attributionRate >= 85) {
    score = 2.5
  } else if (attributionRate >= 70) {
    score = 2
  } else if (attributionRate >= 50) {
    score = 1
  } else {
    score = 0.5
  }

  // Consistency bonus
  if (authorConsistency.consistency === 'single' || authorConsistency.consistency === 'consistent-team') {
    score = Math.min(score + 0.5, config.maxScore)
  }

  evidence.push({
    type: 'metric',
    value: `${Math.round(attributionRate)}% attribution rate`,
    label: `${authorConsistency.postsWithAuthor} of ${authorConsistency.postsWithAuthor + authorConsistency.postsWithoutAuthor} posts`
  })

  evidence.push({
    type: 'note',
    value: `Consistency type: ${authorConsistency.consistency}`
  })

  if (authorConsistency.primaryAuthors.length > 0) {
    evidence.push({
      type: 'snippet',
      value: authorConsistency.primaryAuthors.map(a => a.name).slice(0, 3).join(', '),
      label: 'Primary authors'
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
      ? 'Add author bylines to all blog posts and maintain consistent team attribution'
      : undefined,
    detectionMethod: config.detectionMethod
  }
}

/**
 * Helper functions
 */

function getVariableStatus(
  score: number,
  config: typeof EEAT_VARIABLES.expertise[0]
): 'excellent' | 'good' | 'needs-improvement' | 'poor' {
  if (score >= config.thresholds.excellent) return 'excellent'
  if (score >= config.thresholds.good) return 'good'
  if (score >= config.thresholds.needsImprovement) return 'needs-improvement'
  return 'poor'
}

function createEmptyVariable(
  config: typeof EEAT_VARIABLES.expertise[0],
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
