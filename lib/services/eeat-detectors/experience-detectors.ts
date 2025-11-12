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
          value: `${llm.score}/${config.maxScore} points`,
          label: 'Experience analysis',
          confidence: llm.confidence
        },
        {
          type: 'snippet',
          value: llm.reasoning,
          label: 'Assessment'
        },
        ...llm.detectedSignals.map(signal => ({
          type: 'snippet' as const,
          value: signal,
          label: 'Evidence'
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
 *
 * FIXED ISSUES (2025-01):
 * - Regex state corruption (exec + lastIndex reset)
 * - Pattern over-counting (capped matches)
 * - Removed Pathways 3 & 4 (credential detection moved to E2)
 * - Performance optimization (text sampling)
 * - Tightened generic patterns
 * - Evidence reporting (once per pathway)
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

    // PERFORMANCE FIX: Sample first 12,000 chars (~2000 words)
    // Experience signals appear early in content - no need to scan entire page
    const textSample = text.slice(0, 12000)

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
    // TIGHTENED (2025-01): Require experience context to prevent false positives
    const mediumExperiencePatterns = [
      /\b(i recommend|we recommend|i suggest|we suggest)\s+(based on|from my|from our|in my)\b/gi, // Requires experience context
      /\b(from my perspective|in my opinion|in our opinion)\b/gi,
      /\b(i (believe|think).*based on)\b/gi
    ]

    let strongMatchCount = 0
    let mediumMatchCount = 0
    let narrativeEvidenceAdded = false

    // BUG FIX: Use exec() with lastIndex reset to prevent state corruption
    const MAX_NARRATIVE_MATCHES = 5 // Cap total narrative matches to prevent over-counting

    for (const pattern of strongExperiencePatterns) {
      let match
      while ((match = pattern.exec(textSample)) !== null) {
        strongMatchCount++
        pattern.lastIndex = 0 // Reset regex state

        if (!narrativeEvidenceAdded) {
          // Collect up to 3 examples for evidence
          const examples: string[] = []
          for (const p of strongExperiencePatterns) {
            const matches = textSample.match(p)
            p.lastIndex = 0
            if (matches) examples.push(...matches.slice(0, 1))
            if (examples.length >= 3) break
          }

          evidence.push({
            type: 'snippet',
            value: examples.slice(0, 3).join(', '),
            label: 'First-person experience phrases'
          })
          narrativeEvidenceAdded = true
        }
        break // Only count first match per pattern to prevent over-counting
      }
    }

    for (const pattern of mediumExperiencePatterns) {
      let match
      while ((match = pattern.exec(textSample)) !== null) {
        mediumMatchCount++
        pattern.lastIndex = 0 // Reset regex state
        break // Only count first match per pattern
      }
    }

    // Cap narrative matches to prevent over-counting from repetitive content
    strongMatchCount = Math.min(strongMatchCount, MAX_NARRATIVE_MATCHES)
    mediumMatchCount = Math.min(mediumMatchCount, MAX_NARRATIVE_MATCHES)

    // === PATHWAY 2: Professional/Institutional Experience ===
    // Professional experience patterns (collective/institutional voice) - UNIVERSAL
    // TIGHTENED (2025-01): More specific patterns to prevent false positives
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

      // Professional activities (TIGHTENED: requires specific context)
      /\b(worked (with|as a|at))\s+\w+\s+(patients|clients|companies|teams)\b/gi, // Requires object
      /\b(specializes? in|expert in)\s+\w+/gi, // Requires specialization area
      /\b(built|founded|developed|created)\s+(a|an|the)\s+\w+\s+(company|product|system|platform|practice)\b/gi, // Requires object

      // Passive voice experience (ADDED: catches institutional voice)
      /\b(observations from|findings from|conclusions based on|experience treating|experience working with)\b/gi
    ]

    let professionalMatchCount = 0
    let professionalEvidenceAdded = false
    const MAX_PROFESSIONAL_MATCHES = 10 // Cap professional matches

    for (const pattern of professionalExperiencePatterns) {
      const matches = textSample.match(pattern)
      pattern.lastIndex = 0 // Reset regex state

      if (matches) {
        professionalMatchCount += Math.min(matches.length, 3) // Max 3 per pattern

        if (!professionalEvidenceAdded) {
          evidence.push({
            type: 'snippet',
            value: matches.slice(0, 2).join(', '),
            label: 'Professional experience indicators'
          })
          professionalEvidenceAdded = true
        }
      }
    }

    // Cap professional matches
    professionalMatchCount = Math.min(professionalMatchCount, MAX_PROFESSIONAL_MATCHES)

    // === REMOVED PATHWAYS 3 & 4 ===
    // Author credentials and reviewers are now EXCLUSIVELY handled by E2
    // This eliminates double-counting between E1 and E2
    // E1 = NARRATIVE experience (content-based)
    // E2 = ATTRIBUTION experience (author/reviewer credentials)

    // === CALCULATE FINAL SCORE ===
    // UPDATED SCORING (2025-01): Only narratives + professional voice
    // Removed author/reviewer pathways to eliminate E2 overlap

    const narrativeScore = (strongMatchCount * 1.5) + mediumMatchCount
    const professionalScore = professionalMatchCount * 0.75

    const totalWeighted = narrativeScore + professionalScore

    // Recalibrated thresholds (without author/reviewer boost)
    // Personal blogs score high via narratives
    // Professional sites score high via institutional voice
    if (totalWeighted >= 6) score = config.maxScore // Excellent: Strong narrative + professional
    else if (totalWeighted >= 4) score = 3 // Good: Multiple experience indicators
    else if (totalWeighted >= 2) score = 2 // Fair: Some experience signals
    else if (totalWeighted >= 0.75) score = 1 // Minimal: Limited experience shown
    else score = 0

    // Add summary metric
    if (totalWeighted > 0) {
      evidence.push({
        type: 'metric',
        value: `Experience score: ${totalWeighted.toFixed(1)} (narratives: ${narrativeScore.toFixed(1)}, professional: ${professionalScore.toFixed(1)})`,
        label: 'Combined experience signals'
      })
    }
  }

  const status = getVariableStatus(score, config)

  // Dynamic recommendations based on what's missing
  let recommendation: string | undefined
  if (score < config.thresholds.good) {
    const missing: string[] = []
    const narrativeScore = (evidence.find(e => e.label?.includes('First-person')) ? 1 : 0)
    const professionalScore = (evidence.find(e => e.label?.includes('Professional')) ? 1 : 0)

    if (narrativeScore === 0) {
      missing.push('first-person narratives ("In my experience...", "I\'ve observed...")')
    }
    if (professionalScore === 0) {
      missing.push('institutional voice ("Our research team...", "10+ years experience")')
    }

    if (missing.length > 0) {
      recommendation = `Add experience signals to content: ${missing.join(' and/or ')}. Show hands-on expertise through personal insights or professional context.`
    } else {
      recommendation = 'Strengthen experience signals: add more specific examples, case observations, or professional insights to demonstrate direct expertise application'
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
 * Detect professional perspective STRUCTURE (not credential quality):
 * - Explicit perspective sections ("Reviewer's Note", "Expert Opinion")
 * - Medical/expert reviewer attribution (industry standard for YMYL)
 * - Collaborative authorship (multiple authors providing diverse perspectives)
 *
 * SCOPE (2025-01): E2 detects STRUCTURE, X1/X2 validate CREDENTIALS
 * - E2: Does reviewer exist? Is there collaborative authorship?
 * - X1: What credentials do authors have?
 * - X2: Is reviewer qualified for YMYL content?
 */
export function detectAuthorPerspectiveBlocks(pageAnalysis: PageAnalysis): EEATVariable {
  const config = EEAT_VARIABLES.experience.find(v => v.id === 'E2')!
  const evidence: EEATEvidence[] = []
  let score = 0

  const text = pageAnalysis.contentText || ''
  const headings = pageAnalysis.headings || { h1: [], h2: [], h3: [] }
  const authors = pageAnalysis.authors || []
  const schema = pageAnalysis.schemaMarkup || []

  // === PATHWAY 1: Explicit Perspective Section Headings (Editorial Style) ===
  // Strong signal for blog/editorial content across ALL verticals
  const perspectiveSectionPatterns = [
    // Generic perspective sections
    /\b(reviewer'?s? note|editor'?s? note|expert'?s? note)\b/gi,
    /\b(author'?s? perspective|expert perspective|professional perspective)\b/gi,
    /\b(my take|our take|expert opinion|professional opinion)\b/gi,

    // Medical/health
    /\b(clinical perspective|practitioner'?s? view|professional view)\b/gi,

    // Tech/engineering
    /\b(engineer'?s? perspective|technical analysis|developer'?s? note|engineering lead'?s? take)\b/gi,

    // Food/culinary
    /\b(chef'?s? note|culinary perspective|tasting notes|chef'?s? take)\b/gi,

    // Legal
    /\b(attorney'?s? analysis|legal perspective|counsel'?s? opinion|lawyer'?s? view)\b/gi,

    // Finance/business
    /\b(analyst'?s? view|financial perspective|economist'?s? take|cfo'?s? perspective)\b/gi,

    // International (German, French, Spanish, Italian)
    /\b(expertenmeinung|fachmeinung)\b/gi, // DE: expert opinion
    /\b(avis d'expert|perspective professionnelle)\b/gi, // FR: expert opinion, professional perspective
    /\b(opinión del experto|perspectiva profesional)\b/gi, // ES: expert opinion, professional perspective
    /\b(parere dell'esperto|prospettiva professionale)\b/gi // IT: expert opinion, professional perspective
  ]

  const allHeadings = [...headings.h1, ...headings.h2, ...headings.h3]
  let explicitSectionFound = false
  let headingMatchCount = 0
  const MAX_HEADING_MATCHES = 2 // BUG FIX (2025-01): Cap heading matches to prevent score overflow

  // BUG FIX (2025-01): Use for loop instead of forEach to enable break, and reset regex state
  for (const headingText of allHeadings) {
    if (headingMatchCount >= MAX_HEADING_MATCHES) break;

    for (const pattern of perspectiveSectionPatterns) {
      // BUG FIX (2025-01): Use exec() instead of test() and reset lastIndex to prevent regex state corruption
      const match = pattern.exec(headingText)
      pattern.lastIndex = 0 // Reset global regex state

      if (match) {
        score += 1.5
        explicitSectionFound = true
        headingMatchCount++
        evidence.push({
          type: 'snippet',
          value: headingText,
          label: 'Perspective section heading'
        })
        break // Only match once per heading
      }
    }
  }

  // Check for perspective indicators in body text
  // BUG FIX (2025-01): Limit search to first 2000 words for performance
  const textSample = text.slice(0, 12000) // ~2000 words (avg 6 chars/word)

  perspectiveSectionPatterns.forEach(pattern => {
    const matches = textSample.match(pattern)
    if (matches && !explicitSectionFound) {
      score += 0.5 * Math.min(matches.length, 2) // Cap contribution from text mentions
      evidence.push({
        type: 'snippet',
        value: matches.slice(0, 2).join(', '),
        label: 'Perspective indicators in text'
      })
    }
    // Reset global regex state after match
    pattern.lastIndex = 0
  })

  // === PATHWAY 2: Medical/Expert Reviewer Attribution (YMYL Standard) ===
  // Industry-standard approach for health/financial content (universal + international)
  const reviewAttributionPatterns = [
    // English
    /\b(medically reviewed by|medical review by)\b/gi,
    /\b(reviewed by|fact[- ]checked by|verified by)\b/gi,
    /\b(expert review|professional review|technically reviewed by)\b/gi,

    // German
    /\b(geprüft von|überprüft von|fachlich geprüft von)\b/gi,

    // French
    /\b(revu par|vérifié par|examiné par)\b/gi,

    // Spanish
    /\b(revisado por|verificado por|examinado por)\b/gi,

    // Italian
    /\b(revisionato da|verificato da|esaminato da)\b/gi
  ]

  // BUG FIX (2025-01): Stop after first match to prevent over-counting
  // (e.g., "medically reviewed by" matches both pattern 1 AND pattern 2)
  let hasReviewAttribution = false
  for (const pattern of reviewAttributionPatterns) {
    if (hasReviewAttribution) break; // Already found, stop checking

    const matches = textSample.match(pattern)
    if (matches) {
      score += 1.0
      hasReviewAttribution = true
      evidence.push({
        type: 'snippet',
        value: matches[0],
        label: 'Review attribution found'
      })
      // Reset regex state
      pattern.lastIndex = 0
      break // BUG FIX: Only count first matching pattern
    }
  }

  // === PATHWAY 3: Expert Reviewer Present (Schema) ===
  // SCOPE FIX (2025-01): Detect PRESENCE of reviewer structure, NOT credential quality
  // Credential validation is X1/X2's responsibility, E2 only detects attribution structure
  //
  // BUG FIX (2025-01): Skip if review attribution already found in text (Pathway 2)
  // Prevents double-counting when reviewer exists in BOTH schema AND visible text

  // Check schema for reviewedBy or medicalReviewer
  let schemaReviewerFound = false

  // Only check schema if we haven't already found review attribution in text
  if (!hasReviewAttribution) {
    schema.forEach(s => {
      if (schemaReviewerFound) return; // Only count once

      const reviewerField = s.data?.reviewedBy || s.data?.medicalReviewer
      if (!reviewerField) return;

      // Normalize to array for consistent handling
      const reviewers = Array.isArray(reviewerField) ? reviewerField : [reviewerField]

      for (const reviewer of reviewers) {
        if (!reviewer) continue;

        const reviewerName = typeof reviewer === 'string' ? reviewer : reviewer?.name
        if (reviewerName && !schemaReviewerFound) {
          // BUG FIX (2025-01): Validate reviewer name is not generic placeholder
          // Generic names like "Staff", "Editor", "Team" should not count as reviewers
          const GENERIC_REVIEWER_NAMES = /\b(staff|editor|team|admin|content team|editorial team|content|editorial)\b/i

          if (GENERIC_REVIEWER_NAMES.test(reviewerName)) {
            // Skip generic placeholder names
            continue
          }

          score += 1.5
          schemaReviewerFound = true
          evidence.push({
            type: 'snippet',
            value: reviewerName,
            label: 'Expert reviewer in schema'
          })
          break // Only count first reviewer
        }
      }
    })
  }

  // === PATHWAY 4: Collaborative Authorship ===
  // SCOPE FIX (2025-01): Detect collaborative STRUCTURE only
  // E2 detects that multiple perspectives exist, X1/X2 validate credential QUALITY
  //
  // SCOPE VIOLATION REMOVED (2025-01): Removed credential checking
  // - E2 should NOT check author credentials (MD, RD, etc.) - this is X1's domain
  // - E2 should NOT validate reviewer quality - this is X2's domain
  // - E2 should ONLY detect that collaboration/multiple perspectives exist
  //
  // Award points for collaborative authorship (2+ authors = diverse perspectives)
  // Credential quality and reviewer appropriateness are scored separately by X1/X2

  if (!schemaReviewerFound && !hasReviewAttribution && authors.length >= 2) {
    // Multiple authors = collaborative perspective structure detected
    score += 1.0
    evidence.push({
      type: 'metric',
      value: `${authors.length} authors (collaborative perspective)`,
      label: 'Multiple author collaboration'
    })
  }

  // Cap at maxScore
  score = Math.min(score, config.maxScore)

  const status = getVariableStatus(score, config)

  // Dynamic recommendation based on what's missing
  let recommendation: string | undefined
  if (score < config.thresholds.good) {
    if (authors.length === 0) {
      recommendation = 'Add named author and expert reviewer to provide professional perspective validation'
    } else if (authors.length === 1 && !authors[0].credentials) {
      recommendation = 'Add medical/expert reviewer with credentials to validate content (e.g., "Medically reviewed by [Name, MD]")'
    } else if (authors.length >= 2 && evidence.length === 0) {
      recommendation = 'Highlight reviewer credentials and review process to demonstrate expert perspective validation'
    } else {
      recommendation = 'Add explicit perspective sections (e.g., "Expert Opinion", "Reviewer\'s Note") or medical review attribution'
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
 * E3: Original assets
 * Detect brand-owned images, charts, custom data, case studies (vs stock photos)
 *
 * SCOPE (2025-01): E3 detects ORIGINAL content creation signals ONLY
 * - Stock photos, generic illustrations → NO POINTS
 * - Must have EXPLICIT TEXTUAL SIGNALS: figures, data, case studies, tutorials, team photos
 * - Sites with embedded diagrams but NO text references → 0 points (strict approach)
 *
 * STRICT MODE (2025-01): Requires contextual phrases to avoid false positives
 * ✅ CORRECT: "Figure 1 shows our data" → +0.8pts (explicit reference)
 * ❌ WRONG: "see fig. 1" in discussion → 0pts (casual reference, not original asset)
 * ❌ WRONG: Embedded diagrams without text labels → 0pts (no explicit signal)
 *
 * 7 DETECTION PATHWAYS:
 * 1. Visual asset references (figures, diagrams, infographics, charts) - 0.8pts
 *    - Requires contextual verbs: "Figure 1 shows", "See diagram below"
 * 2. Original research & data (proprietary studies, surveys, custom analysis) - 0.8pts
 * 3. Case studies & examples (patient/client stories, real-world examples) - 0.7pts
 * 4. Before/after comparisons (progress photos, demonstrations) - 0.5pts
 * 5. Tutorial assets (screenshots, step-by-step guides) - 0.4pts
 *    - Requires structured signals: "Step 1:", "screenshot", "how-to guide"
 * 6. Team/facility photography (original photos, not stock) - 0.3pts
 * 7. Schema ImageObject with creator/copyrightHolder fields - 0.5pts
 *
 * Cross-vertical patterns (medical, tech, food, legal, business, etc.)
 * International support (German, French, Spanish, Italian)
 *
 * PATHWAY 8 REMOVED (2025-01): Visual content richness violated scope by awarding
 * points for ANY images, including stock photos. E3 now requires explicit original
 * asset signals to score.
 */
export function detectOriginalAssets(pageAnalysis: PageAnalysis): EEATVariable {
  const config = EEAT_VARIABLES.experience.find(v => v.id === 'E3')!
  const evidence: EEATEvidence[] = []
  let score = 0

  const images = pageAnalysis.images || { total: 0, withAlt: 0 }
  const text = pageAnalysis.contentText?.toLowerCase() || ''
  const schema = pageAnalysis.schemaMarkup || []

  // === PATHWAY 1: Visual Asset References (0.8 pts) ===
  // Detect references to custom figures, diagrams, infographics, charts
  // STRICT MODE (2025-01): Requires contextual phrases to avoid false positives
  // on casual references in discussions (e.g., "see fig. 1" in Stack Overflow)
  const visualAssetPatterns = [
    // STRICT: Require contextual verbs indicating original asset presentation
    /\b(figure|fig\.|diagram|chart|graph)\s+\d+\s+(shows|illustrates|demonstrates|depicts|displays)\b/gi,
    /\b(in|as\s+shown\s+in|as\s+seen\s+in)\s+(figure|fig\.|diagram|chart|graph)\s+\d+\b/gi,
    /\b(see|view|refer\s+to)\s+(the\s+)?(figure|diagram|chart|graph|infographic)\s+(below|above)\b/gi,
    /\b(illustrated in|shown in|depicted in)\s+(the\s+)?(image|figure|diagram|chart)\b/gi,
    // Explicit original asset terms (no ambiguity)
    /\b(infographic|data visualization|custom (chart|graph|diagram))\b/gi,
    // International (DE, FR, ES, IT) - strict with context
    /\b(abbildung|diagramm)\s+\d+\s+(zeigt|dargestellt)\b/gi, // DE: "Figure 1 shows"
    /\b(siehe|vergleiche)\s+(abbildung|diagramm)\b/gi, // DE: "See figure"
    /\b(figure|diagramme)\s+\d+\s+(montre|illustre)\b/gi, // FR: "Figure 1 shows"
    /\b(voir|consultez)\s+(la\s+)?(figure|diagramme)\b/gi, // FR: "See figure"
    /\b(figura|diagrama)\s+\d+\s+(muestra|ilustra)\b/gi, // ES: "Figure 1 shows"
    /\b(ver|consultar)\s+(la\s+)?(figura|diagrama)\b/gi, // ES: "See figure"
    /\b(figura|diagramma)\s+\d+\s+(mostra|illustra)\b/gi, // IT: "Figure 1 shows"
    /\b(vedi|consulta)\s+(la\s+)?(figura|diagramma)\b/gi  // IT: "See figure"
  ]

  let visualAssetFound = false
  for (const pattern of visualAssetPatterns) {
    const matches = text.match(pattern)
    pattern.lastIndex = 0 // Reset regex state

    if (matches && !visualAssetFound) {
      score += 0.8
      visualAssetFound = true
      evidence.push({
        type: 'snippet',
        value: matches.slice(0, 3).join(', '),
        label: 'Visual asset references (figures/diagrams/charts)'
      })
      break
    }
  }

  // === PATHWAY 2: Original Research & Data (0.8 pts) ===
  // Detect proprietary research, custom data, original studies
  const originalDataPatterns = [
    // Strong signals (first-party research)
    /\b(our (data|research|study|survey|analysis|findings|experiment))\b/gi,
    /\b((proprietary|original|exclusive) (data|research|study))\b/gi,
    /\b(we (analyzed|surveyed|tested|studied|examined|researched))\b/gi,
    /\b(based on our (data|research|analysis|study))\b/gi,
    // Softer signals (curated examples/data)
    /\b(sample (menu|meal plan|recipe|workout|routine))\b/gi,
    /\b(example (recipe|plan|routine|schedule))\b/gi,
    /\b(shopping list|grocery list|food list)\b/gi,
    /\b(here'?s? (a|an|the) (sample|example))\b/gi,
    // International (DE, FR, ES, IT)
    /\b(unsere (daten|forschung|studie|umfrage|analyse))\b/gi, // DE
    /\b(nos (données|recherches|étude|analyse))\b/gi, // FR
    /\b(nuestros (datos|investigación|estudio|análisis))\b/gi, // ES
    /\b(nostri (dati|ricerca|studio|analisi))\b/gi  // IT
  ]

  let originalDataFound = false
  for (const pattern of originalDataPatterns) {
    const matches = text.match(pattern)
    pattern.lastIndex = 0

    if (matches && !originalDataFound) {
      score += 0.8
      originalDataFound = true
      evidence.push({
        type: 'snippet',
        value: matches.slice(0, 3).join(', '),
        label: 'Original research/data indicators'
      })
      break
    }
  }

  // === PATHWAY 3: Case Studies & Examples (0.7 pts) ===
  // Detect real examples, patient/client stories, case studies
  const caseStudyPatterns = [
    // English
    /\b(case study|case example|real[- ]world example)\b/gi,
    /\b((patient|client|customer) (story|case|example))\b/gi,
    /\b(success story|real example|example case)\b/gi,
    /\b(testimonial with|story from our)\b/gi,
    // International (DE, FR, ES, IT)
    /\b(fallstudie|patientengeschichte|beispiel aus der praxis)\b/gi, // DE
    /\b(étude de cas|histoire de patient|exemple réel)\b/gi, // FR
    /\b(estudio de caso|historia de paciente|ejemplo real)\b/gi, // ES
    /\b(caso di studio|storia del paziente|esempio reale)\b/gi  // IT
  ]

  let caseStudyFound = false
  for (const pattern of caseStudyPatterns) {
    const matches = text.match(pattern)
    pattern.lastIndex = 0

    if (matches && !caseStudyFound) {
      score += 0.7
      caseStudyFound = true
      evidence.push({
        type: 'snippet',
        value: matches.slice(0, 2).join(', '),
        label: 'Case studies/examples found'
      })
      break
    }
  }

  // === PATHWAY 4: Before/After & Comparisons (0.5 pts) ===
  // Detect progress photos, before/after comparisons, demonstrations
  const comparisonPatterns = [
    /\b(before and after|before\/after|before & after)\b/gi,
    /\b(progress (photo|image|picture)s?)\b/gi,
    /\b((results|changes) shown in)\b/gi,
    /\b(comparison (photo|image|chart))\b/gi,
    // International
    /\b(vorher und nachher|vorher\/nachher)\b/gi, // DE
    /\b(avant et après|avant\/après)\b/gi, // FR
    /\b(antes y después|antes\/después)\b/gi, // ES
    /\b(prima e dopo|prima\/dopo)\b/gi  // IT
  ]

  let comparisonFound = false
  for (const pattern of comparisonPatterns) {
    const match = pattern.exec(text)
    pattern.lastIndex = 0

    if (match && !comparisonFound) {
      score += 0.5
      comparisonFound = true
      evidence.push({
        type: 'snippet',
        value: match[0],
        label: 'Before/after or comparison content'
      })
      break
    }
  }

  // === PATHWAY 5: Tutorial & Demo Assets (0.4 pts) ===
  // Detect screenshots, step-by-step images, how-to demonstrations, structured guides
  // STRICT MODE (2025-01): Avoid casual "demonstration" references in discussions
  const tutorialPatterns = [
    /\b(screenshot|screen shot|step[- ]by[- ]step (image|photo|guide))\b/gi,
    /\b(as shown (in|below)|follow these steps)\b/gi,
    /\b(interactive (demo|demonstration)|video (demo|demonstration))\b/gi,
    /\b(how[- ]to (guide|tutorial)|tutorial (image|photo|screenshot))\b/gi,
    // Structured how-to content (indicates original guidance)
    /\b(step \d+:|step \d+\.|step \d+ -)\b/gi, // Require punctuation after "Step 1"
    /\b((follow|try) (these|this) steps|here's how to)\b/gi
  ]

  let tutorialFound = false
  for (const pattern of tutorialPatterns) {
    const match = pattern.exec(text)
    pattern.lastIndex = 0

    if (match && !tutorialFound) {
      score += 0.4
      tutorialFound = true
      evidence.push({
        type: 'snippet',
        value: match[0],
        label: 'Tutorial/demonstration assets'
      })
      break
    }
  }

  // === PATHWAY 6: Team/Facility Photography (0.3 pts) ===
  // Detect original team photos, facility images, not stock
  const teamPhotoPatterns = [
    // Medical/health
    /\b((our|the) (team|staff|clinic|practice|facility|office))\b/gi,
    /\b(meet our|about our (team|practice|clinic))\b/gi,
    // Tech
    /\b((our|the) (engineering team|development team|office))\b/gi,
    // Food/restaurant
    /\b((our|the) (kitchen|restaurant|chef team))\b/gi,
    // Legal
    /\b((our|the) (law firm|legal team|attorneys))\b/gi,
    // Business
    /\b((our|the) (company|organization|headquarters))\b/gi,
    // International
    /\b(unser team|unsere praxis)\b/gi, // DE
    /\b(notre équipe|notre clinique)\b/gi, // FR
    /\b(nuestro equipo|nuestra clínica)\b/gi, // ES
    /\b(il nostro team|la nostra clinica)\b/gi  // IT
  ]

  let teamPhotoFound = false
  for (const pattern of teamPhotoPatterns) {
    const match = pattern.exec(text)
    pattern.lastIndex = 0

    if (match && !teamPhotoFound) {
      score += 0.3
      teamPhotoFound = true
      evidence.push({
        type: 'snippet',
        value: match[0],
        label: 'Team/facility photography indicators'
      })
      break
    }
  }

  // === PATHWAY 7: Schema ImageObject with Creator (0.5 pts) ===
  // Check for ImageObject schema with creator/copyrightHolder fields
  let schemaImageFound = false
  schema.forEach(s => {
    if (schemaImageFound) return

    if (s.type === 'ImageObject' && s.data) {
      const hasCreator = s.data.creator || s.data.copyrightHolder || s.data.author
      if (hasCreator) {
        score += 0.5
        schemaImageFound = true
        evidence.push({
          type: 'metric',
          value: `Creator: ${hasCreator.name || hasCreator}`,
          label: 'ImageObject with creator in schema'
        })
      }
    }
  })

  // === PATHWAY 8: Visual Content Richness ===
  // REMOVED (2025-01): Scope violation fix
  //
  // ISSUE: Pathway 8 awarded points for ALL images (stock photos, generic illustrations),
  // violating E3's scope: "Detect brand-owned images, charts, custom data, case studies"
  //
  // PROBLEM: Pages with 15+ stock photos scored 1.0/3 despite having ZERO original assets
  // - Healthline: 1.0/3 (17 stock images, no figures/data/case studies)
  // - Mayo Clinic: 0.2/3 (2 stock images, no original content)
  //
  // FIX: Removed Pathway 8 entirely. E3 now scores 0 if no original asset signals detected.
  // Pathways 1-7 correctly detect specific original assets (figures, data, case studies, tutorials)
  //
  // IMPACT:
  // - Sites with stock photos only: 1.0/3 → 0.0/3 (CORRECT: no original assets)
  // - Sites with original assets: Still score via Pathways 1-7 (no impact)

  // Cap at maxScore
  score = Math.min(score, config.maxScore)

  const status = getVariableStatus(score, config)

  // Dynamic recommendations based on what's missing
  let recommendation: string | undefined
  if (score < config.thresholds.good) {
    const missing: string[] = []

    if (!visualAssetFound) missing.push('custom diagrams/charts/infographics')
    if (!originalDataFound) missing.push('original research/data')
    if (!caseStudyFound) missing.push('case studies/real examples')
    if (!comparisonFound) missing.push('before/after comparisons')
    if (!tutorialFound) missing.push('step-by-step demonstrations')

    if (missing.length > 0) {
      recommendation = `Add original assets to demonstrate experience: ${missing.slice(0, 3).join(', ')}. Use custom visuals, real data, and authentic examples from your work.`
    } else {
      recommendation = 'Increase original visual content with custom diagrams, infographics, case studies, and data from your own research or practice'
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
