/**
 * Trustworthiness Detectors (T1-T7)
 * Automated detection for transparency, provenance, and safety signals
 */

import type { PageAnalysis } from '../url-analyzer'
import type { EEATVariable, EEATEvidence, BlogInsights } from '../../types/blog-analysis'
import { EEAT_VARIABLES, YMYL_INDICATORS } from '../../eeat-config'

/**
 * T1: Editorial principles (Domain-level for blog, page-level for single)
 * Public editorial/corrections policy linked in footer
 */
export function detectEditorialPrinciples(pageAnalysis?: PageAnalysis, posts?: any[]): EEATVariable {
  const config = EEAT_VARIABLES.trustworthiness.find(v => v.id === 'T1')!

  // For blog analysis with multiple posts, check domain-level resources
  if (posts && posts.length > 1) {
    return detectEditorialPrinciplesDomainLevel(posts, config)
  }

  // For single page analysis, check on-page signals
  if (!pageAnalysis) {
    return {
      id: config.id,
      name: config.name,
      description: config.description,
      maxScore: config.maxScore,
      actualScore: 0,
      status: 'poor',
      evidence: [{ type: 'note', value: 'No page data available' }],
      recommendation: 'Add editorial policy page and link it in footer',
      detectionMethod: config.detectionMethod
    }
  }

  const evidence: EEATEvidence[] = []
  let score = 0

  const text = pageAnalysis.contentText?.toLowerCase() || ''
  const headings = pageAnalysis.headings || { h1: [], h2: [], h3: [] }
  const allHeadings = [...headings.h1, ...headings.h2, ...headings.h3].map(h => h.toLowerCase())

  // 1. Check for editorial policy/standards pages (strongest signal - 2 points)
  const policyPagePatterns = [
    /\b(our editorial (policy|standards|guidelines|process))\b/gi,
    /\b(editorial (principles|integrity|independence))\b/gi,
    /\b(how we (write|review|verify|fact-check|create content))\b/gi,
    /\b(content (standards|guidelines|review process))\b/gi
  ]

  let foundPolicyPage = false
  policyPagePatterns.forEach(pattern => {
    // Check both headings (stronger signal) and text
    const matchesHeading = allHeadings.some(h => pattern.test(h))
    const matchesText = pattern.test(text)

    if (matchesHeading) {
      score += 2
      foundPolicyPage = true
      evidence.push({
        type: 'note',
        value: 'Editorial policy page or section found (heading)'
      })
    } else if (matchesText) {
      score += 1.5
      foundPolicyPage = true
      evidence.push({
        type: 'note',
        value: 'Editorial policy mentioned in content'
      })
    }
  })

  // 2. Check for corrections/transparency policy (1.5 points)
  const correctionsPatterns = [
    /\b(corrections? (policy|procedure|process))\b/gi,
    /\b(how we (handle|correct|address) (errors|mistakes))\b/gi,
    /\b(if you (find|spot|notice) (an error|a mistake|inaccuracy))\b/gi,
    /\b(update (policy|log|history))\b/gi
  ]

  let foundCorrections = false
  correctionsPatterns.forEach(pattern => {
    if (pattern.test(text) && !foundCorrections) {
      score += 1.5
      foundCorrections = true
      evidence.push({
        type: 'note',
        value: 'Corrections policy found'
      })
    }
  })

  // 3. Check for fact-checking or review process mentions (0.5 points)
  const reviewProcessPatterns = [
    /\b(medically reviewed by|reviewed by|fact-checked by|verified by)\b/gi,
    /\b((medical|expert|editorial) review (process|board|team))\b/gi,
    /\b(peer.reviewed|peer review)\b/gi
  ]

  let foundReviewProcess = false
  reviewProcessPatterns.forEach(pattern => {
    if (pattern.test(text) && !foundReviewProcess) {
      score += 0.5
      foundReviewProcess = true
      evidence.push({
        type: 'note',
        value: 'Review or fact-checking process mentioned'
      })
    }
  })

  // 4. Deductions for false positives
  // Check if "editorial" is only used in competitor context
  const competitorContextPatterns = [
    /\b(competitor|other|alternative).{0,20}editorial/gi,
    /\beditorial.{0,20}(competitor|alternative|other sites)/gi
  ]

  const hasCompetitorContext = competitorContextPatterns.some(p => p.test(text))
  if (hasCompetitorContext && score <= 1.5) {
    // Likely just mentioning competitors' policies, not their own
    score = Math.max(0, score - 0.5)
    evidence.push({
      type: 'note',
      value: 'Possible false positive: competitor context detected'
    })
  }

  if (score === 0) {
    evidence.push({
      type: 'note',
      value: 'No editorial policy or standards found'
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
 * T1 Helper: Domain-level editorial principles detection for blog analysis
 * Checks for site-wide editorial policy resources across all posts
 */
function detectEditorialPrinciplesDomainLevel(posts: any[], config: any): EEATVariable {
  const evidence: EEATEvidence[] = []
  let score = 0

  // Strategy: Check content text across posts for mentions of editorial/corrections policies
  // Note: pageAnalysis.links only contains counts, not actual URLs
  let postsWithEditorialLinks = 0
  let postsWithCorrectionsLinks = 0

  // Common editorial policy URL patterns
  const editorialUrlPatterns = [
    /editorial[-_]policy/i,
    /editorial[-_]guidelines/i,
    /editorial[-_]standards/i,
    /about[-_]us.*editorial/i,
    /how[-_]we[-_]write/i,
    /content[-_]standards/i
  ]

  const correctionsUrlPatterns = [
    /corrections/i,
    /accuracy/i,
    /fact[-_]check/i
  ]

  // Analyze content text across posts for mentions of editorial/corrections policies
  posts.forEach(post => {
    const text = post.pageAnalysis?.contentText?.toLowerCase() || ''
    let foundEditorial = false
    let foundCorrections = false

    // Check for editorial policy mentions in content
    if (!foundEditorial && editorialUrlPatterns.some(pattern => pattern.test(text))) {
      postsWithEditorialLinks++
      foundEditorial = true
    }

    // Check for corrections policy mentions in content
    if (!foundCorrections && correctionsUrlPatterns.some(pattern => pattern.test(text))) {
      postsWithCorrectionsLinks++
      foundCorrections = true
    }
  })

  // Score based on presence and consistency
  if (postsWithEditorialLinks > 0) {
    const consistencyRate = postsWithEditorialLinks / posts.length

    if (consistencyRate >= 0.8) {
      // Editorial policy mentioned in 80%+ of posts (excellent site-wide implementation)
      score += 2.5
      evidence.push({
        type: 'metric',
        value: `Editorial policy found (${Math.round(consistencyRate * 100)}% of posts mention it)`,
        label: 'Site-wide policy',
        confidence: consistencyRate
      })
    } else if (consistencyRate >= 0.5) {
      // Editorial policy mentioned in 50%+ of posts
      score += 2
      evidence.push({
        type: 'metric',
        value: `Editorial policy found (${Math.round(consistencyRate * 100)}% of posts mention it)`,
        label: 'Partial consistency'
      })
    } else {
      // Editorial policy exists but inconsistently mentioned
      score += 1.5
      evidence.push({
        type: 'note',
        value: `Editorial policy exists but only ${Math.round(consistencyRate * 100)}% of posts mention it`
      })
    }
  }

  if (postsWithCorrectionsLinks > 0) {
    const consistencyRate = postsWithCorrectionsLinks / posts.length

    if (consistencyRate >= 0.5) {
      score += 1.5
      evidence.push({
        type: 'metric',
        value: `Corrections policy found (${Math.round(consistencyRate * 100)}% of posts mention it)`,
        label: 'Transparency commitment'
      })
    } else {
      score += 1
      evidence.push({
        type: 'note',
        value: `Corrections policy exists but only mentioned in ${Math.round(consistencyRate * 100)}% of posts`
      })
    }
  }

  // If no policies found, provide helpful feedback
  if (postsWithEditorialLinks === 0 && postsWithCorrectionsLinks === 0) {
    evidence.push({
      type: 'note',
      value: 'No editorial policy or corrections policy mentions found across blog posts'
    })
    evidence.push({
      type: 'note',
      value: `Analyzed ${posts.length} posts - expected mentions of editorial policy or corrections policy in content`
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
      ? 'Create an editorial policy page and link it consistently in blog post footers'
      : score < config.thresholds.excellent
      ? 'Increase consistency: ensure all blog posts link to editorial policy'
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
 * T4: Contact transparency (Domain-level for blog, page-level for single)
 * About/Team page, contact info, Privacy/Terms
 */
export function detectContactTransparency(pageAnalysis?: PageAnalysis, posts?: any[]): EEATVariable {
  const config = EEAT_VARIABLES.trustworthiness.find(v => v.id === 'T4')!

  // For blog analysis with multiple posts, check domain-level resources
  if (posts && posts.length > 1) {
    return detectContactTransparencyDomainLevel(posts, config)
  }

  // For single page analysis, check on-page signals
  if (!pageAnalysis) {
    return {
      id: config.id,
      name: config.name,
      description: config.description,
      maxScore: config.maxScore,
      actualScore: 0,
      status: 'poor',
      evidence: [{ type: 'note', value: 'No page data available' }],
      recommendation: 'Add About/Team page, contact information, Privacy Policy, and Terms of Service',
      detectionMethod: config.detectionMethod
    }
  }

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
 * T4 Helper: Domain-level contact transparency detection for blog analysis
 * Checks for site-wide About/Contact/Privacy/Terms pages across all posts
 */
function detectContactTransparencyDomainLevel(posts: any[], config: any): EEATVariable {
  const evidence: EEATEvidence[] = []
  let score = 0

  // Strategy: Check content text across posts for mentions of transparency pages
  // Note: pageAnalysis.links only contains counts, not actual URLs
  let postsWithAbout = 0
  let postsWithContact = 0
  let postsWithPrivacy = 0
  let postsWithTerms = 0

  // Common URL patterns for transparency pages
  const aboutUrlPatterns = [
    /\babout[-_]us\b/i,
    /\babout\b/i,
    /\bteam\b/i,
    /\bwho[-_]we[-_]are\b/i,
    /\bcompany\b/i
  ]

  const contactUrlPatterns = [
    /\bcontact[-_]us\b/i,
    /\bcontact\b/i,
    /\bget[-_]in[-_]touch\b/i
  ]

  const privacyUrlPatterns = [
    /\bprivacy[-_]policy\b/i,
    /\bprivacy\b/i
  ]

  const termsUrlPatterns = [
    /\bterms[-_]of[-_]service\b/i,
    /\bterms[-_]and[-_]conditions\b/i,
    /\bterms\b/i
  ]

  // Analyze content text across posts for transparency page mentions
  posts.forEach(post => {
    const text = post.pageAnalysis?.contentText?.toLowerCase() || ''
    let foundAbout = false
    let foundContact = false
    let foundPrivacy = false
    let foundTerms = false

    // Check for About page mentions
    if (!foundAbout && aboutUrlPatterns.some(pattern => pattern.test(text))) {
      postsWithAbout++
      foundAbout = true
    }

    // Check for Contact page mentions
    if (!foundContact && contactUrlPatterns.some(pattern => pattern.test(text))) {
      postsWithContact++
      foundContact = true
    }

    // Check for Privacy policy mentions
    if (!foundPrivacy && privacyUrlPatterns.some(pattern => pattern.test(text))) {
      postsWithPrivacy++
      foundPrivacy = true
    }

    // Check for Terms of service mentions
    if (!foundTerms && termsUrlPatterns.some(pattern => pattern.test(text))) {
      postsWithTerms++
      foundTerms = true
    }
  })

  // Score based on presence and consistency
  // About page (1.5 pts)
  if (postsWithAbout > 0) {
    const consistencyRate = postsWithAbout / posts.length
    if (consistencyRate >= 0.8) {
      score += 1.5
      evidence.push({
        type: 'metric',
        value: `About page found (${Math.round(consistencyRate * 100)}% of posts mention it)`,
        label: 'Site identity',
        confidence: consistencyRate
      })
    } else {
      score += 1
      evidence.push({
        type: 'note',
        value: `About page found but only ${Math.round(consistencyRate * 100)}% of posts mention it`
      })
    }
  }

  // Contact page (1 pt)
  if (postsWithContact > 0) {
    const consistencyRate = postsWithContact / posts.length
    if (consistencyRate >= 0.8) {
      score += 1
      evidence.push({
        type: 'metric',
        value: `Contact page found (${Math.round(consistencyRate * 100)}% of posts mention it)`,
        label: 'Accessibility'
      })
    } else {
      score += 0.7
      evidence.push({
        type: 'note',
        value: `Contact page found but only ${Math.round(consistencyRate * 100)}% mention it`
      })
    }
  }

  // Privacy policy (1 pt)
  if (postsWithPrivacy > 0) {
    const consistencyRate = postsWithPrivacy / posts.length
    if (consistencyRate >= 0.8) {
      score += 1
      evidence.push({
        type: 'metric',
        value: `Privacy policy found (${Math.round(consistencyRate * 100)}% of posts mention it)`,
        label: 'Data transparency'
      })
    } else {
      score += 0.7
      evidence.push({
        type: 'note',
        value: `Privacy policy found but only ${Math.round(consistencyRate * 100)}% mention it`
      })
    }
  }

  // Terms of service (0.5 pts)
  if (postsWithTerms > 0) {
    const consistencyRate = postsWithTerms / posts.length
    if (consistencyRate >= 0.8) {
      score += 0.5
      evidence.push({
        type: 'metric',
        value: `Terms of service found (${Math.round(consistencyRate * 100)}% of posts mention it)`,
        label: 'Legal clarity'
      })
    } else {
      score += 0.3
      evidence.push({
        type: 'note',
        value: `Terms found but only ${Math.round(consistencyRate * 100)}% mention it`
      })
    }
  }

  // Summary evidence
  const foundPages = [
    postsWithAbout > 0 ? 'About' : null,
    postsWithContact > 0 ? 'Contact' : null,
    postsWithPrivacy > 0 ? 'Privacy' : null,
    postsWithTerms > 0 ? 'Terms' : null
  ].filter(Boolean)

  if (foundPages.length > 0) {
    evidence.push({
      type: 'metric',
      value: `${foundPages.length}/4 transparency pages found: ${foundPages.join(', ')}`,
      label: 'Domain transparency'
    })
  } else {
    evidence.push({
      type: 'note',
      value: 'No transparency pages mentioned across blog posts'
    })
    evidence.push({
      type: 'note',
      value: `Analyzed ${posts.length} posts - expected footer links to /about, /contact, /privacy, /terms`
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
      ? `Create missing pages (${4 - foundPages.length} of 4): About, Contact, Privacy, Terms`
      : score < config.thresholds.excellent
      ? 'Increase footer link consistency across all blog posts'
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

  // Additional safety check for division by zero
  if (mean === 0 || !isFinite(mean)) {
    return createEmptyVariable(config, 'Invalid word count data')
  }

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
