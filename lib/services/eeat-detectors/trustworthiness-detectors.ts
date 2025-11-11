/**
 * Trustworthiness Detectors (T1-T7)
 * Automated detection for transparency, provenance, and safety signals
 */

import type { PageAnalysis } from '../url-analyzer'
import type { EEATVariable, EEATEvidence, BlogInsights } from '../../types/blog-analysis'
import { EEAT_VARIABLES, YMYL_INDICATORS } from '../../eeat-config'

/**
 * T1: Editorial principles
 * Public editorial/corrections policy linked in footer
 */
export function detectEditorialPrinciples(pageAnalysis: PageAnalysis): EEATVariable {
  const config = EEAT_VARIABLES.trustworthiness.find(v => v.id === 'T1')!
  const evidence: EEATEvidence[] = []
  let score = 0

  const text = pageAnalysis.contentText?.toLowerCase() || ''

  // Note: Link-specific checks not available with current PageAnalysis structure
  // Would need individual link data to check for policy pages

  // Check for policy mentions in text
  if (text.includes('editorial') && (text.includes('policy') || text.includes('standards'))) {
    score += 1.5
    evidence.push({
      type: 'note',
      value: 'Editorial policy mentioned in content'
    })
  }

  // Check for corrections/retractions mentions
  if (text.includes('correction') || text.includes('retraction')) {
    score += 1
    evidence.push({
      type: 'note',
      value: 'Correction policy mentioned'
    })
  }

  if (score === 0) {
    evidence.push({
      type: 'note',
      value: 'No editorial policy found'
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
      ? 'Add public editorial principles and corrections policy, linked in footer'
      : undefined,
    detectionMethod: config.detectionMethod
  }
}

/**
 * T2: YMYL disclaimers
 * Appropriate disclaimers on health/financial content
 */
export function detectYMYLDisclaimers(pageAnalysis: PageAnalysis): EEATVariable {
  const config = EEAT_VARIABLES.trustworthiness.find(v => v.id === 'T2')!
  const evidence: EEATEvidence[] = []
  let score = 0

  const text = pageAnalysis.contentText?.toLowerCase() || ''

  // Check if content is YMYL
  const isYMYL = YMYL_INDICATORS.some(indicator => text.includes(indicator))

  if (!isYMYL) {
    // Not YMYL - full score
    score = config.maxScore
    evidence.push({
      type: 'note',
      value: 'Not YMYL content - disclaimer not required'
    })
  } else {
    // Check for medical/health disclaimers
    const medicalDisclaimers = [
      /\b(not medical advice|consult.*doctor|consult.*physician|emergency.*911)\b/gi,
      /\b(for informational purposes|educational purposes only)\b/gi,
      /\b(see.*healthcare provider|speak.*medical professional)\b/gi
    ]

    // Check for financial disclaimers
    const financialDisclaimers = [
      /\b(not financial advice|consult.*financial advisor|consult.*accountant)\b/gi,
      /\b(not investment advice|do your own research|dyor)\b/gi
    ]

    const allDisclaimers = [...medicalDisclaimers, ...financialDisclaimers]

    allDisclaimers.forEach(pattern => {
      const matches = text.match(pattern)
      if (matches) {
        score += 1.5
        evidence.push({
          type: 'snippet',
          value: matches[0],
          label: 'Disclaimer found'
        })
      }
    })

    // Check for emergency guidance (extra credit for medical content)
    if (text.includes('medical') || text.includes('health')) {
      if (/\b(911|emergency|urgent care|immediate medical attention)\b/i.test(text)) {
        score += 1
        evidence.push({
          type: 'note',
          value: 'Emergency guidance present'
        })
      }
    }

    if (score === 0) {
      evidence.push({
        type: 'note',
        value: 'YMYL content detected but no disclaimers found'
      })
    }
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
    recommendation: isYMYL && score < config.thresholds.good
      ? 'Add appropriate disclaimers (e.g., "Not medical advice, consult your doctor") on YMYL content'
      : undefined,
    detectionMethod: config.detectionMethod
  }
}

/**
 * T3: Provenance signals
 * Bylines, dates, reviewer labels visible
 */
export function detectProvenanceSignals(pageAnalysis: PageAnalysis): EEATVariable {
  const config = EEAT_VARIABLES.trustworthiness.find(v => v.id === 'T3')!
  const evidence: EEATEvidence[] = []
  let score = 0

  const schema = pageAnalysis.schemaMarkup || []
  const authors = pageAnalysis.authors || []

  // Check for bylines
  if (authors.length > 0) {
    score += 1.5
    evidence.push({
      type: 'metric',
      value: `${authors.length} author(s) found`,
      label: 'Byline present'
    })
  }

  // Check for datePublished in schema
  const hasDatePublished = schema.some(s => s.data?.datePublished)
  if (hasDatePublished) {
    score += 1.5
    evidence.push({
      type: 'note',
      value: 'Published date in schema'
    })
  }

  // Check for dateModified in schema
  const hasDateModified = schema.some(s => s.data?.dateModified || s.data?.dateUpdated)
  if (hasDateModified) {
    score += 1
    evidence.push({
      type: 'note',
      value: 'Modified date in schema'
    })
  }

  // Check for reviewer in schema
  const hasReviewer = schema.some(s => s.data?.reviewedBy || s.data?.medicalReviewer)
  if (hasReviewer) {
    score += 1
    evidence.push({
      type: 'note',
      value: 'Reviewer present in schema'
    })
  }

  // Check for "How we created this" or methodology sections
  const text = pageAnalysis.contentText?.toLowerCase() || ''
  const methodologyPatterns = [
    /\b(how we.*created|how we.*wrote|our methodology|our process)\b/gi,
    /\b(sources and methodology|research methodology)\b/gi
  ]

  methodologyPatterns.forEach(pattern => {
    if (pattern.test(text)) {
      score += 0.5
      evidence.push({
        type: 'note',
        value: 'Methodology disclosure found'
      })
    }
  })

  if (score === 0) {
    evidence.push({
      type: 'note',
      value: 'No provenance signals detected'
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
      ? 'Add bylines, published/modified dates, and reviewer labels to all content'
      : undefined,
    detectionMethod: config.detectionMethod
  }
}

/**
 * T4: Contact transparency
 * About/Team page, contact info, Privacy/Terms
 */
export function detectContactTransparency(pageAnalysis: PageAnalysis): EEATVariable {
  const config = EEAT_VARIABLES.trustworthiness.find(v => v.id === 'T4')!
  const evidence: EEATEvidence[] = []
  let score = 0

  const schema = pageAnalysis.schemaMarkup || []
  const text = pageAnalysis.contentText?.toLowerCase() || ''

  // Note: Link-specific checks not available with current PageAnalysis structure

  // Check for contact info in Organization schema
  const orgSchema = schema.find(s => s.type === 'Organization')
  if (orgSchema?.data) {
    if (orgSchema.data.address) {
      score += 0.5
      evidence.push({ type: 'note', value: 'Address in schema' })
    }
    if (orgSchema.data.telephone || orgSchema.data.phone) {
      score += 0.5
      evidence.push({ type: 'note', value: 'Phone in schema' })
    }
    if (orgSchema.data.email) {
      score += 0.5
      evidence.push({ type: 'note', value: 'Email in schema' })
    }
  }

  // Check for visible contact info in text
  if (/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(text)) {
    score += 0.3
    evidence.push({ type: 'note', value: 'Phone number visible' })
  }

  if (/\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/i.test(text)) {
    score += 0.2
    evidence.push({ type: 'note', value: 'Email address visible' })
  }

  if (score === 0) {
    evidence.push({
      type: 'note',
      value: 'No contact or transparency information found'
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
      ? 'Add About/Team page, contact information, Privacy Policy, and Terms of Service'
      : undefined,
    detectionMethod: config.detectionMethod
  }
}

/**
 * T5: Schema hygiene
 * Valid Article/WebPage/Person markup with key fields
 */
export function detectSchemaHygiene(pageAnalysis: PageAnalysis): EEATVariable {
  const config = EEAT_VARIABLES.trustworthiness.find(v => v.id === 'T5')!
  const evidence: EEATEvidence[] = []
  let score = 0

  const schema = pageAnalysis.schemaMarkup || []

  if (schema.length === 0) {
    evidence.push({
      type: 'note',
      value: 'No schema markup found'
    })
    return {
      id: config.id,
      name: config.name,
      description: config.description,
      maxScore: config.maxScore,
      actualScore: 0,
      status: 'poor',
      evidence,
      recommendation: 'Add Article or WebPage schema markup with author, dates, and headline',
      detectionMethod: config.detectionMethod
    }
  }

  // Check for Article/BlogPosting/WebPage schema
  const contentSchema = schema.find(s =>
    s.type === 'Article' ||
    s.type === 'BlogPosting' ||
    s.type === 'WebPage' ||
    s.type === 'MedicalWebPage'
  )

  if (contentSchema) {
    score += 1.5
    evidence.push({
      type: 'snippet',
      value: contentSchema.type,
      label: 'Content schema present'
    })

    // Check for required/important fields
    if (contentSchema.data?.headline || contentSchema.data?.name) {
      score += 0.5
      evidence.push({ type: 'note', value: 'Headline present' })
    }

    if (contentSchema.data?.author) {
      score += 1
      evidence.push({ type: 'note', value: 'Author field present' })
    }

    if (contentSchema.data?.datePublished) {
      score += 0.5
      evidence.push({ type: 'note', value: 'Published date present' })
    }

    if (contentSchema.data?.dateModified) {
      score += 0.5
      evidence.push({ type: 'note', value: 'Modified date present' })
    }

    if (contentSchema.data?.image) {
      score += 0.3
      evidence.push({ type: 'note', value: 'Image present' })
    }

    if (contentSchema.data?.description) {
      score += 0.2
      evidence.push({ type: 'note', value: 'Description present' })
    }
  } else {
    evidence.push({
      type: 'note',
      value: 'No Article/WebPage schema found'
    })
  }

  // Check for Person schema
  const personSchema = schema.find(s => s.type === 'Person')
  if (personSchema) {
    score += 0.5
    evidence.push({ type: 'note', value: 'Person schema present' })
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
      ? 'Ensure Article schema has all key fields: headline, author, datePublished, dateModified, image'
      : undefined,
    detectionMethod: config.detectionMethod
  }
}

/**
 * T6: Schema adoption rate
 * Consistent schema markup across blog
 */
export function detectSchemaAdoptionRate(blogInsights?: BlogInsights): EEATVariable {
  const config = EEAT_VARIABLES.trustworthiness.find(v => v.id === 'T6')!
  const evidence: EEATEvidence[] = []
  let score = 0

  if (!blogInsights) {
    return createEmptyVariable(config, 'Blog analysis not available')
  }

  const schemaAdoption = blogInsights.schemaAdoption
  const adoptionRate = schemaAdoption.adoptionRate

  // Score based on adoption rate
  if (adoptionRate >= 95) score = config.maxScore
  else if (adoptionRate >= 80) score = 1.7
  else if (adoptionRate >= 60) score = 1.4
  else if (adoptionRate >= 40) score = 1
  else if (adoptionRate >= 20) score = 0.6
  else score = 0.4

  evidence.push({
    type: 'metric',
    value: `${Math.round(adoptionRate)}% adoption rate`,
    label: `${schemaAdoption.postsWithSchema} of ${schemaAdoption.postsWithSchema + schemaAdoption.postsWithoutSchema} posts`
  })

  if (schemaAdoption.commonSchemaTypes.length > 0) {
    evidence.push({
      type: 'snippet',
      value: schemaAdoption.commonSchemaTypes.map(t => t.type).slice(0, 3).join(', '),
      label: 'Common schema types'
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
      ? 'Add schema markup to all blog posts (target 95%+ adoption rate)'
      : undefined,
    detectionMethod: config.detectionMethod
  }
}

/**
 * T7: Quality consistency
 * Low variance in content quality across blog
 */
export function detectQualityConsistency(posts?: any[]): EEATVariable {
  const config = EEAT_VARIABLES.trustworthiness.find(v => v.id === 'T7')!
  const evidence: EEATEvidence[] = []
  let score = 0

  if (!posts || posts.length < 2) {
    return createEmptyVariable(config, 'Insufficient posts for consistency analysis')
  }

  // Calculate variance in word counts
  const wordCounts = posts.map(p => p.wordCount || 0).filter(wc => wc > 0)

  if (wordCounts.length === 0) {
    return createEmptyVariable(config, 'No word count data available')
  }

  const mean = wordCounts.reduce((sum, wc) => sum + wc, 0) / wordCounts.length
  const variance = wordCounts.reduce((sum, wc) => sum + Math.pow(wc - mean, 2), 0) / wordCounts.length
  const stdDev = Math.sqrt(variance)
  const coefficientOfVariation = stdDev / mean

  // Score based on consistency (lower CV = more consistent)
  if (coefficientOfVariation < 0.3) {
    score = config.maxScore // Very consistent
  } else if (coefficientOfVariation < 0.5) {
    score = 1.5 // Good consistency
  } else if (coefficientOfVariation < 0.7) {
    score = 1 // Moderate consistency
  } else {
    score = 0.5 // Low consistency
  }

  evidence.push({
    type: 'metric',
    value: `CV: ${(coefficientOfVariation * 100).toFixed(1)}%`,
    label: `Avg: ${Math.round(mean)} words ± ${Math.round(stdDev)}`
  })

  // Check for outliers (posts way outside the norm)
  const outliers = wordCounts.filter(wc => Math.abs(wc - mean) > 2 * stdDev).length
  if (outliers > 0) {
    evidence.push({
      type: 'note',
      value: `${outliers} outlier posts detected`
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
      ? 'Maintain consistent content quality and depth across all blog posts'
      : undefined,
    detectionMethod: config.detectionMethod
  }
}

/**
 * Helper functions
 */

function getVariableStatus(
  score: number,
  config: typeof EEAT_VARIABLES.trustworthiness[0]
): 'excellent' | 'good' | 'needs-improvement' | 'poor' {
  if (score >= config.thresholds.excellent) return 'excellent'
  if (score >= config.thresholds.good) return 'good'
  if (score >= config.thresholds.needsImprovement) return 'needs-improvement'
  return 'poor'
}

function createEmptyVariable(
  config: typeof EEAT_VARIABLES.trustworthiness[0],
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
