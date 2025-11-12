/**
 * Experience Detectors (E1-E7)
 * Automated detection for first-hand perspective & recency signals
 */

import type { PageAnalysis } from '../url-analyzer'
import type { NLPAnalysisResult } from '../nlp-analyzer'
import type { EEATVariable, EEATEvidence } from '../../types/blog-analysis'
import type { BlogInsights } from '../../types/blog-analysis'
import { EEAT_VARIABLES } from '../../eeat-config'
import { analyzeE1WithGPT4 } from '../llm-metric-analyzer'

/**
 * E1: First-person narratives
 * Detect experience signals: first-person narratives, professional backgrounds, clinical practice
 * Recognizes both blog-style personal stories AND professional/institutional experience
 *
 * HYBRID DETECTION: Runs regex + GPT-4 in parallel, LLM overrides if successful
 * @param pageAnalysis - The page data to analyze
 * @param nlpAnalysis - Optional legacy NLP analysis
 * @param skipLLM - If true, skip LLM analysis (used for blog aggregation to save costs)
 */
export function detectFirstPersonNarratives(
  pageAnalysis: PageAnalysis,
  nlpAnalysis?: NLPAnalysisResult,
  skipLLM: boolean = false
): EEATVariable | Promise<EEATVariable> {
  const config = EEAT_VARIABLES.experience.find(v => v.id === 'E1')!

  // === HYBRID APPROACH: Try LLM first (parallel with regex) ===
  // Skip LLM for blog aggregation (too expensive to run on 10+ posts)
  if (!skipLLM && process.env.ENABLE_LLM_SCORING === 'true') {
    return detectE1WithLLM(pageAnalysis, nlpAnalysis)
  }

  // === FALLBACK: Use regex detection (sync) ===
  return detectE1WithRegex(pageAnalysis, nlpAnalysis)
}

/**
 * E1 detection with LLM (async)
 */
async function detectE1WithLLM(
  pageAnalysis: PageAnalysis,
  nlpAnalysis?: NLPAnalysisResult
): Promise<EEATVariable> {
  const config = EEAT_VARIABLES.experience.find(v => v.id === 'E1')!
  const contentSample = pageAnalysis.contentText || ''

  // Run LLM with timeout
  const [llmResult] = await Promise.allSettled([
    Promise.race([
      analyzeE1WithGPT4(pageAnalysis, contentSample),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)) // 5s timeout
    ])
  ])

  // If LLM succeeded, use its result (LLM overrides regex)
  if (llmResult.status === 'fulfilled' && llmResult.value) {
    const llm = llmResult.value
    return {
      id: config.id,
      name: config.name,
      description: config.description,
      maxScore: config.maxScore,
      actualScore: llm.score,
      status: getVariableStatus(llm.score, config),
      evidence: [
        {
          type: 'metric',
          value: `Analyzed by GPT-4: ${llm.score}/${config.maxScore} points`,
          label: 'AI-powered analysis',
          confidence: llm.confidence
        },
        {
          type: 'snippet',
          value: llm.reasoning,
          label: 'Analysis reasoning'
        },
        ...llm.detectedSignals.map(signal => ({
          type: 'snippet' as const,
          value: signal,
          label: 'Detected by GPT-4'
        }))
      ],
      recommendation: llm.score < config.thresholds.good
        ? generateE1Recommendation(llm.score, pageAnalysis)
        : undefined,
      detectionMethod: config.detectionMethod
    }
  }

  // LLM failed or timed out - fall back to regex
  return detectE1WithRegex(pageAnalysis, nlpAnalysis)
}

/**
 * E1 detection with regex (sync) - used as fallback or for blog aggregation
 */
function detectE1WithRegex(
  pageAnalysis: PageAnalysis,
  nlpAnalysis?: NLPAnalysisResult
): EEATVariable {
  const config = EEAT_VARIABLES.experience.find(v => v.id === 'E1')!
  const evidence: EEATEvidence[] = []
  let score = 0

  // Use legacy NLP analysis if available (from old system)
  if (nlpAnalysis?.experienceScore) {
    score = Math.min(config.maxScore, (nlpAnalysis.experienceScore / 10) * config.maxScore)
    evidence.push({
      type: 'metric',
      value: `${nlpAnalysis.experienceScore}/10 experience signals detected`,
      confidence: nlpAnalysis.experienceScore / 10
    })
  } else {
    const text = pageAnalysis.contentText?.toLowerCase() || ''
    const authors = pageAnalysis.authors || []

    // === PATHWAY 1: Personal First-Person Narratives (blog-style) ===
    // High-confidence experience patterns (specific contexts)
    const strongExperiencePatterns = [
      /\b(in my experience|from my experience|in our experience|from our experience)\b/gi,
      /\b(my practice|our practice|my clinic|our clinic|my patients|our patients)\b/gi,
      /\b(in my work|in our work|through my|through our)\s+(experience|work|practice|research|testing)\b/gi,
      /\b(my observation|our observation|i observed|we observed|i noticed|we noticed)\b/gi,
      /\b(i've seen|we've seen|i've found|we've found|i've worked with|we've worked with)\b/gi,
      /\b(based on my|based on our)\s+(experience|work|practice|research|testing)\b/gi,
      /\b(i've treated|we've treated|i've helped|we've helped)\b/gi
    ]

    // Medium-confidence patterns (recommendations/opinions based on experience)
    const mediumExperiencePatterns = [
      /\b(i recommend|we recommend|i suggest|we suggest)\b(?!\s+(checking|considering|avoiding|researching)\s+(competitors|alternatives|other options))/gi,
      /\b(from my perspective|in my opinion|in our opinion)\b/gi,
      /\b(i (believe|think).*based on)\b/gi
    ]

    let strongMatchCount = 0
    let mediumMatchCount = 0
    let evidenceAdded = false

    strongExperiencePatterns.forEach(pattern => {
      const matches = text.match(pattern)
      if (matches) {
        strongMatchCount += matches.length
        if (!evidenceAdded) {
          evidence.push({
            type: 'snippet',
            value: matches.slice(0, 3).join(', '),
            label: 'First-person experience phrases'
          })
          evidenceAdded = true
        }
      }
    })

    mediumExperiencePatterns.forEach(pattern => {
      const matches = text.match(pattern)
      if (matches) mediumMatchCount += matches.length
    })

    // === PATHWAY 2: Professional/Institutional Experience ===
    // Professional experience patterns (collective/institutional voice) - UNIVERSAL
    const professionalExperiencePatterns = [
      // Institutional research/work (any field)
      /\b(our research|our study|our analysis|our findings|our data|our team|our investigation)\b/gi,
      /\b(our (editorial|legal|engineering|financial|culinary|design) team)\b/gi,
      /\b(our (experts|specialists|analysts|consultants|advisors))\b/gi,

      // Experience statements (any profession)
      /\b(\d+\+?\s*years?.*(experience|practicing|working in|specializing in))\b/gi, // "10+ years experience"
      /\b(decades of experience|years of expertise)\b/gi,

      // Professional practice (multi-vertical)
      /\b((clinical|legal|financial|engineering|culinary) practice)\b/gi,
      /\b(practicing (physician|attorney|engineer|accountant|architect))\b/gi,
      /\b(professional practice|treating (patients|clients)|serving clients)\b/gi,

      // Licensing/Certification (any field)
      /\b((board[- ])?certified|licensed|registered)\s+(professional|practitioner|specialist)\b/gi,

      // Professional activities (universal)
      /\b(worked (with|as a|at)|specializes? in|focuses on|expert in)\b/gi,
      /\b(built|founded|developed|created|managed)\s+(for|at|with)\b/gi, // "Built software at Google"
    ]

    let professionalMatchCount = 0
    professionalExperiencePatterns.forEach(pattern => {
      const matches = text.match(pattern)
      if (matches) {
        professionalMatchCount += matches.length
        if (professionalMatchCount <= 3) {
          evidence.push({
            type: 'snippet',
            value: matches.slice(0, 2).join(', '),
            label: 'Professional experience indicators'
          })
        }
      }
    })

    // === PATHWAY 3: Author Professional Background ===
    // Check if authors have experience-related credentials or roles
    let authorExperienceScore = 0
    authors.forEach(author => {
      const authorInfo = `${author.name || ''} ${author.credentials || ''}`.toLowerCase()

      // Professional credentials that indicate direct experience across ALL verticals
      const experienceCredentials = [
        // === MEDICAL/HEALTH ===
        /\b(md|do|phd|pharmd|dds|dvm|dnp|psyd)\b/i, // Doctors/Psychologists
        /\b(rn|np|pa-c|lpn|cna|emt)\b/i, // Nursing/Emergency
        /\b(rd|rdn|ldn|cns)\b/i, // Dietitian/Nutritionist
        /\b(mph|msn|msw|mft|lcsw|lmft|lpc|lcpc)\b/i, // Mental health / Public health
        /\b(pt|ot|slp|ccc-slp|dpt)\b/i, // Physical/Occupational therapy
        /\b(ms|mph|mha|mhs|msc|mcmsc)\b/i, // Master's in health sciences
        /\b(bs|bsc|bsn|ba)\b/i, // Bachelor's degrees
        /\b(mba)\b/i, // MBA

        // === FINANCE/ACCOUNTING ===
        /\b(cfa|cfp|cpa|cma|cia)\b/i, // Chartered Financial Analyst, Certified Financial Planner, CPA
        /\b(series\s*(7|6|63|65|66))\b/i, // FINRA licenses
        /\b(chartered (financial|accountant))\b/i,
        /\b(enrolled agent|ea)\b/i, // Tax professionals

        // === LAW ===
        /\b(jd|esq|esquire|llm|llb)\b/i, // Law degrees
        /\b(attorney|lawyer|counsel)\b/i,
        /\b(bar certified|admitted to (the )?bar|licensed to practice law)\b/i,

        // === TECHNOLOGY/ENGINEERING ===
        /\b(software engineer|senior engineer|principal engineer|staff engineer|lead engineer)\b/i,
        /\b(phd.*(computer science|cs|engineering|data science))\b/i,
        /\b(ms.*(computer science|cs|engineering|data science))\b/i,
        /\b(full[- ]stack|backend|frontend|devops|machine learning)\s+(engineer|developer)\b/i,
        /\b(certified.*(professional|developer|architect)|aws certified|google cloud certified|azure certified)\b/i,

        // === FOOD/CULINARY ===
        /\b(chef|executive chef|head chef|sous chef|pastry chef)\b/i,
        /\b(culinary (institute|school|arts|degree))\b/i,
        /\b(james beard|michelin star|cordon bleu)\b/i,
        /\b(certified (master chef|culinary|sommelier))\b/i,

        // === REAL ESTATE ===
        /\b(realtor|real estate (broker|agent))\b/i,
        /\b(licensed (broker|agent)|broker license)\b/i,
        /\b(gri|crs|abr)\b/i, // Graduate REALTOR Institute, Certified Residential Specialist

        // === BUSINESS/MANAGEMENT (generic professional roles) ===
        /\b(ceo|cto|cfo|coo|founder|co[- ]founder)\b/i,
        /\b(director|vice president|vp|senior (vice president|vp))\b/i,
        /\b(president|managing director|general manager)\b/i,
        /\b(senior|lead|principal|staff)\s+(analyst|consultant|advisor|specialist)\b/i,

        // === EDUCATION/ACADEMIA ===
        /\b(professor|associate professor|assistant professor)\b/i,
        /\b(phd|doctorate|doctoral)\b/i, // Any PhD
        /\b(adjunct|lecturer|instructor)\b/i,

        // === FITNESS/WELLNESS ===
        /\b(certified (personal trainer|fitness|yoga|pilates))\b/i,
        /\b(cscs|nsca|nasm|ace|issa)\b/i, // Strength & conditioning certifications

        // === GENERIC PROFESSIONAL PATTERNS ===
        /\b(physician|doctor|nurse|therapist|dietitian|nutritionist|pharmacist|practitioner)\b/i,
        /\b(\d+\+?\s*years?.*(professional |clinical )?(experience|practicing))\b/i, // "10+ years experience"
        /\b(board[- ]certified|licensed|registered|certified)\b/i,
        /\b(specialist|expert|professional|consultant)\s+in\b/i,

        // === GENERIC POST-NOMINAL CREDENTIALS PATTERN ===
        // Catches any 2-5 uppercase letter credentials after comma: "John Smith, CFA, CMT"
        /,\s*[A-Z]{2,5}(\b|,|\s)/i,
      ]

      const hasExperienceCredential = experienceCredentials.some(pattern => pattern.test(authorInfo))

      if (hasExperienceCredential) {
        authorExperienceScore += 1
        evidence.push({
          type: 'snippet',
          value: `${author.name || 'Author'} - professional background`,
          label: 'Author with professional experience'
        })
      }
    })

    // === PATHWAY 4: Expert Reviewer (Experienced Practitioner Review) ===
    // Check schema for reviewedBy or medicalReviewer (universal - any field's expert review)
    const schema = pageAnalysis.schemaMarkup || []
    let reviewerExperienceScore = 0

    schema.forEach(s => {
      const reviewer = s.data?.reviewedBy || s.data?.medicalReviewer
      if (reviewer) {
        const reviewerName = typeof reviewer === 'string' ? reviewer : reviewer?.name
        if (reviewerName) {
          reviewerExperienceScore += 1.5
          evidence.push({
            type: 'snippet',
            value: reviewerName,
            label: 'Expert reviewer (implies professional experience)'
          })
        }
      }
    })

    // === CALCULATE FINAL SCORE ===
    // Weight different pathways appropriately:
    // - Personal narratives: highest weight (1.5x for strong, 1x for medium) - Blog-style content
    // - Professional patterns: medium weight (0.75x) - Editorial/institutional voice
    // - Author backgrounds: strong boost (1.5pt per credentialed author, cap at 3pts) - Professional publishers
    // - Reviewer presence: strong boost (2pts for medical reviewer) - YMYL content quality signal

    const narrativeScore = (strongMatchCount * 1.5) + mediumMatchCount
    const professionalScore = professionalMatchCount * 0.75
    const authorScore = Math.min(authorExperienceScore * 1.5, 3) // Cap at 3 pts (2 credentialed authors = 3pts)
    const reviewerScore = Math.min(reviewerExperienceScore, 2) // Cap at 2 pts

    const totalWeighted = narrativeScore + professionalScore + authorScore + reviewerScore

    // Calibrated scoring thresholds for professional publishers
    // Professional medical sites (like Healthline) score high via credentialed authors + reviewers
    // Blog-style sites score high via first-person narratives
    if (totalWeighted >= 5) score = config.maxScore // Excellent: Strong experience signals
    else if (totalWeighted >= 3) score = 3 // Good: Multiple experience indicators
    else if (totalWeighted >= 1.5) score = 2 // Fair: Some experience signals
    else if (totalWeighted >= 0.5) score = 1 // Minimal: Limited experience shown
    else score = 0

    // Add summary metric
    if (totalWeighted > 0) {
      evidence.push({
        type: 'metric',
        value: `Experience score: ${totalWeighted.toFixed(1)} (narratives: ${narrativeScore.toFixed(1)}, professional: ${professionalScore.toFixed(1)}, authors: ${authorScore.toFixed(1)}, reviewers: ${reviewerScore.toFixed(1)})`,
        label: 'Combined experience signals'
      })
    }
  }

  const status = getVariableStatus(score, config)

  // Dynamic recommendations based on what's missing
  let recommendation: string | undefined
  if (score < config.thresholds.good) {
    const hasAuthors = (pageAnalysis.authors?.length || 0) > 0
    const hasReviewers = (pageAnalysis.schemaMarkup || []).some(s => s.data?.reviewedBy || s.data?.medicalReviewer)

    if (!hasAuthors && !hasReviewers) {
      recommendation = 'Add named authors with professional backgrounds (e.g., "15 years clinical experience") and/or medical reviewers to demonstrate practical experience'
    } else if (score < 1) {
      recommendation = 'Include first-person narratives ("In my practice..."), case examples, or professional context ("Our research team...") to demonstrate hands-on experience'
    } else {
      recommendation = 'Strengthen experience signals: add personal insights, clinical observations, or institutional research findings to show direct expertise application'
    }
  }

  return {
    id: config.id,
    name: config.name,
    description: config.description,
    maxScore: config.maxScore,
    actualScore: score,
    status,
    evidence,
    recommendation,
    detectionMethod: config.detectionMethod
  }
}

/**
 * E2: Author perspective blocks
 * Detect sections like "Reviewer's Note", "Expert's Opinion", "Author's Perspective"
 */
export function detectAuthorPerspectiveBlocks(pageAnalysis: PageAnalysis): EEATVariable {
  const config = EEAT_VARIABLES.experience.find(v => v.id === 'E2')!
  const evidence: EEATEvidence[] = []
  let score = 0

  const text = pageAnalysis.contentText || ''
  const headings = pageAnalysis.headings || { h1: [], h2: [], h3: [] }

  // Check for perspective block indicators in headings or bold text
  const perspectivePatterns = [
    /\b(reviewer'?s? note|editor'?s? note|expert'?s? note)\b/gi,
    /\b(author'?s? perspective|expert perspective|professional perspective)\b/gi,
    /\b(my take|our take|expert opinion|professional opinion)\b/gi,
    /\b(clinical perspective|practitioner'?s? view)\b/gi
  ]

  // Check headings first (stronger signal) - combine all heading levels
  const allHeadings = [...headings.h1, ...headings.h2, ...headings.h3]
  allHeadings.forEach(headingText => {
    perspectivePatterns.forEach(pattern => {
      if (pattern.test(headingText)) {
        score += 1.5
        evidence.push({
          type: 'snippet',
          value: headingText,
          label: 'Perspective section heading'
        })
      }
    })
  })

  // Check for perspective blocks in text
  perspectivePatterns.forEach(pattern => {
    const matches = text.match(pattern)
    if (matches) {
      score += 0.5 * matches.length
      evidence.push({
        type: 'snippet',
        value: matches.slice(0, 2).join(', '),
        label: 'Perspective indicators in text'
      })
    }
  })

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
      ? 'Add reviewer or author perspective sections to provide expert insights'
      : undefined,
    detectionMethod: config.detectionMethod
  }
}

/**
 * E3: Original assets
 * Detect brand-owned images, charts, custom data (vs stock photos)
 */
export function detectOriginalAssets(pageAnalysis: PageAnalysis): EEATVariable {
  const config = EEAT_VARIABLES.experience.find(v => v.id === 'E3')!
  const evidence: EEATEvidence[] = []
  let score = 0

  const images = pageAnalysis.images || { total: 0, withAlt: 0 }
  const text = pageAnalysis.contentText?.toLowerCase() || ''

  // Check for original data indicators in text
  const originalityPatterns = [
    /\b(our data|our research|our study|our analysis|our findings)\b/gi,
    /\b(custom chart|custom graph|original research|proprietary data)\b/gi,
    /\b(clinic photos|practice photos|our team|our facility)\b/gi
  ]

  originalityPatterns.forEach(pattern => {
    const matches = text.match(pattern)
    if (matches) {
      score += 0.5
      evidence.push({
        type: 'snippet',
        value: matches.slice(0, 2).join(', '),
        label: 'Original asset indicators'
      })
    }
  })

  // Check image metrics (alt text indicates custom/original content)
  if (images.total > 0) {
    const altTextRatio = images.withAlt / images.total

    // High alt text ratio suggests custom images with proper descriptions
    if (altTextRatio >= 0.8 && images.total >= 3) {
      score += 1.5
      evidence.push({
        type: 'metric',
        value: `${images.total} images with ${Math.round(altTextRatio * 100)}% alt text coverage`,
        label: 'Strong image optimization',
        confidence: altTextRatio
      })
    } else if (altTextRatio >= 0.5 || images.total >= 2) {
      score += 0.8
      evidence.push({
        type: 'metric',
        value: `${images.total} images (${Math.round(altTextRatio * 100)}% with alt text)`,
        label: 'Basic image presence'
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
    recommendation: score < config.thresholds.good
      ? 'Use more original images, charts, and data from your own research or practice'
      : undefined,
    detectionMethod: config.detectionMethod
  }
}

/**
 * E4: Freshness
 * Check dateModified in schema or visible update notes within 12 months
 */
export function detectFreshness(pageAnalysis: PageAnalysis): EEATVariable {
  const config = EEAT_VARIABLES.experience.find(v => v.id === 'E4')!
  const evidence: EEATEvidence[] = []
  let score = 0

  const schema = pageAnalysis.schemaMarkup || []
  const now = new Date()
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 12, now.getDate())

  // Check schema dateModified or datePublished
  let mostRecentDate: Date | null = null

  schema.forEach(s => {
    const dateModified = s.data?.dateModified || s.data?.dateUpdated
    const datePublished = s.data?.datePublished

    if (dateModified) {
      const date = new Date(dateModified)
      if (!isNaN(date.getTime())) {
        if (!mostRecentDate || date > mostRecentDate) {
          mostRecentDate = date
        }
      }
    } else if (datePublished) {
      const date = new Date(datePublished)
      if (!isNaN(date.getTime())) {
        if (!mostRecentDate || date > mostRecentDate) {
          mostRecentDate = date
        }
      }
    }
  })

  if (mostRecentDate !== null) {
    const recentDate = mostRecentDate as Date
    const monthsOld = Math.floor((now.getTime() - recentDate.getTime()) / (1000 * 60 * 60 * 24 * 30))

    if (recentDate >= twelveMonthsAgo) {
      // Within 12 months - excellent freshness
      if (monthsOld <= 3) score = config.maxScore // Very fresh (0-3 months)
      else if (monthsOld <= 6) score = 4 // Fresh (3-6 months)
      else score = 3 // Recent (6-12 months)
    } else {
      // Older than 12 months
      if (monthsOld <= 24) score = 2 // 1-2 years old
      else score = 1 // 2+ years old
    }

    evidence.push({
      type: 'metric',
      value: `Last updated ${monthsOld} months ago`,
      label: recentDate.toLocaleDateString()
    })
  } else {
    // No date found
    evidence.push({
      type: 'note',
      value: 'No dateModified or datePublished found in schema'
    })
    score = 0
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
      ? 'Add dateModified to schema markup and update content regularly (ideally every 6-12 months)'
      : undefined,
    detectionMethod: config.detectionMethod
  }
}

/**
 * E5: Experience markup
 * Check for MedicalWebPage schema and "What we do" sections
 */
export function detectExperienceMarkup(pageAnalysis: PageAnalysis): EEATVariable {
  const config = EEAT_VARIABLES.experience.find(v => v.id === 'E5')!
  const evidence: EEATEvidence[] = []
  let score = 0

  const schema = pageAnalysis.schemaMarkup || []
  const headings = pageAnalysis.headings || { h1: [], h2: [], h3: [] }

  // Check for experience-related schema types
  const experienceSchemaTypes = ['MedicalWebPage', 'HealthTopicContent']

  schema.forEach(s => {
    if (s.type && experienceSchemaTypes.includes(s.type)) {
      score += 1
      evidence.push({
        type: 'snippet',
        value: s.type,
        label: 'Experience-related schema'
      })
    }
  })

  // Check for "What we do" or similar sections
  const experienceSectionPatterns = [
    /\b(what we do|who we are|our approach|our methodology|our process)\b/gi,
    /\b(how we help|why choose us|our expertise|our background)\b/gi
  ]

  const allHeadings = [...headings.h1, ...headings.h2, ...headings.h3]
  allHeadings.forEach(headingText => {
    experienceSectionPatterns.forEach(pattern => {
      if (pattern.test(headingText)) {
        score += 0.5
        evidence.push({
          type: 'snippet',
          value: headingText,
          label: 'Experience section heading'
        })
      }
    })
  })

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
      ? 'Add MedicalWebPage schema for YMYL content and include "What we do" sections'
      : undefined,
    detectionMethod: config.detectionMethod
  }
}

/**
 * E6: Publishing consistency
 * Calculate from blog insights - regular updates demonstrate ongoing experience
 */
export function detectPublishingConsistency(blogInsights?: BlogInsights): EEATVariable {
  const config = EEAT_VARIABLES.experience.find(v => v.id === 'E6')!
  const evidence: EEATEvidence[] = []
  let score = 0

  if (!blogInsights || !blogInsights.publishingFrequency) {
    return createEmptyVariable(config, 'Blog analysis not available')
  }

  const freq = blogInsights.publishingFrequency
  const postsPerMonth = freq.postsPerMonth ?? 0

  // Score based on publishing frequency
  if (postsPerMonth >= 4 && postsPerMonth <= 8) {
    score = config.maxScore // Optimal range
  } else if (postsPerMonth >= 2 && postsPerMonth <= 12) {
    score = 3 // Good range
  } else if (postsPerMonth >= 1) {
    score = 2 // Acceptable
  } else if (postsPerMonth >= 0.5) {
    score = 1 // Infrequent
  }

  // Trend bonus/penalty
  if (freq.trend === 'increasing') {
    score = Math.min(score + 0.5, config.maxScore)
  } else if (freq.trend === 'decreasing') {
    score = Math.max(score - 0.5, 0)
  }

  evidence.push({
    type: 'metric',
    value: `${postsPerMonth.toFixed(1)} posts/month`,
    label: `Trend: ${freq.trend}`
  })

  if (freq.dateRange.spanMonths > 0) {
    evidence.push({
      type: 'metric',
      value: `${freq.totalPosts} posts over ${freq.dateRange.spanMonths} months`
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
      ? 'Publish 4-8 articles per month to demonstrate consistent, ongoing experience'
      : undefined,
    detectionMethod: config.detectionMethod
  }
}

/**
 * E7: Content freshness rate
 * Percentage of blog posts updated within 12 months
 */
export function detectContentFreshnessRate(blogInsights?: BlogInsights, posts?: any[]): EEATVariable {
  const config = EEAT_VARIABLES.experience.find(v => v.id === 'E7')!
  const evidence: EEATEvidence[] = []
  let score = 0

  if (!posts || posts.length === 0) {
    return createEmptyVariable(config, 'No blog posts available for analysis')
  }

  const now = new Date()
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 12, now.getDate())

  let freshCount = 0
  posts.forEach(post => {
    const pageAnalysis = post.pageAnalysis
    const schema: PageAnalysis['schemaMarkup'] = pageAnalysis?.schemaMarkup || []

    schema.forEach(s => {
      const dateModified = s.data?.dateModified || s.data?.dateUpdated
      if (dateModified) {
        const date = new Date(dateModified)
        if (!isNaN(date.getTime()) && date >= twelveMonthsAgo) {
          freshCount++
        }
      }
    })
  })

  const freshnessRate = freshCount / posts.length

  // Score based on freshness rate
  if (freshnessRate >= 0.7) score = config.maxScore // 70%+ fresh
  else if (freshnessRate >= 0.5) score = 3 // 50-70% fresh
  else if (freshnessRate >= 0.3) score = 2 // 30-50% fresh
  else if (freshnessRate >= 0.1) score = 1 // 10-30% fresh
  else score = 0.5 // <10% fresh

  evidence.push({
    type: 'metric',
    value: `${Math.round(freshnessRate * 100)}% of posts updated in last 12 months`,
    label: `${freshCount} of ${posts.length} posts`
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
      ? 'Update older blog posts regularly to maintain content freshness (target 50%+ in last 12 months)'
      : undefined,
    detectionMethod: config.detectionMethod
  }
}

/**
 * Helper: Generate context-aware recommendation for E1
 */
function generateE1Recommendation(score: number, pageAnalysis: PageAnalysis): string {
  const hasAuthors = (pageAnalysis.authors?.length || 0) > 0
  const hasReviewers = (pageAnalysis.schemaMarkup || []).some(s => s.data?.reviewedBy || s.data?.medicalReviewer)

  if (!hasAuthors && !hasReviewers) {
    return 'Add named authors with professional backgrounds (e.g., "15 years clinical experience") and/or expert reviewers to demonstrate practical experience'
  } else if (score < 1) {
    return 'Include first-person narratives ("In my practice..."), case examples, or professional context ("Our research team...") to demonstrate hands-on experience'
  } else {
    return 'Strengthen experience signals: add personal insights, clinical observations, or institutional research findings to show direct expertise application'
  }
}

/**
 * Helper: Get variable status based on score
 */
function getVariableStatus(
  score: number,
  config: typeof EEAT_VARIABLES.experience[0]
): 'excellent' | 'good' | 'needs-improvement' | 'poor' {
  if (score >= config.thresholds.excellent) return 'excellent'
  if (score >= config.thresholds.good) return 'good'
  if (score >= config.thresholds.needsImprovement) return 'needs-improvement'
  return 'poor'
}

/**
 * Helper: Create empty variable for missing data
 */
function createEmptyVariable(
  config: typeof EEAT_VARIABLES.experience[0],
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
