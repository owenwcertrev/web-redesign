/**
 * E-E-A-T Meter Configuration
 * Variable-based scoring system aligned with SEO expert guidelines
 */

export interface VariableDefinition {
  id: string
  name: string
  description: string
  maxScore: number
  detectionMethod: 'automated' | 'external-api' | 'hybrid'
  thresholds: {
    excellent: number // Score >= this = excellent
    good: number // Score >= this = good
    needsImprovement: number // Score >= this = needs-improvement, else poor
  }
}

/**
 * E-E-A-T Variable Definitions
 * Each category has 5 core variables + blog metrics, totaling 25 points
 */
export const EEAT_VARIABLES = {
  experience: [
    {
      id: 'E1',
      name: 'First-person narratives',
      description: 'Experience signals IN THE CONTENT (not bylines): personal narratives ("In my practice..."), professional voice ("I\'ve found..."), or institutional voice ("Our research team..."). Does NOT measure author credentials (see X1) or domain authority (see A).',
      maxScore: 4,
      detectionMethod: 'automated' as const,
      thresholds: { excellent: 3.5, good: 2.5, needsImprovement: 1.5 }
    },
    {
      id: 'E2',
      name: 'Author perspective blocks',
      description: 'Reviewer or author insight sections providing personal professional perspective',
      maxScore: 3,
      detectionMethod: 'automated' as const,
      thresholds: { excellent: 2.5, good: 1.5, needsImprovement: 0.8 }
    },
    {
      id: 'E3',
      name: 'Original assets',
      description: 'Brand-owned images, charts, or datasets (not generic stock photos)',
      maxScore: 3,
      detectionMethod: 'automated' as const,
      thresholds: { excellent: 2.3, good: 1.5, needsImprovement: 0.7 }
    },
    {
      id: 'E4',
      name: 'Freshness',
      description: 'Visible dateModified or update notes within last 12 months',
      maxScore: 5,
      detectionMethod: 'automated' as const,
      thresholds: { excellent: 4.5, good: 3.5, needsImprovement: 2 }
    },
    {
      id: 'E5',
      name: 'Experience markup',
      description: 'Appropriate schema (e.g., MedicalWebPage) and clear "What we do" sections',
      maxScore: 2,
      detectionMethod: 'automated' as const,
      thresholds: { excellent: 1.8, good: 1.3, needsImprovement: 0.7 }
    },
    {
      id: 'E6',
      name: 'Publishing consistency',
      description: 'Regular content updates demonstrating ongoing experience',
      maxScore: 4,
      detectionMethod: 'automated' as const,
      thresholds: { excellent: 3.5, good: 2.5, needsImprovement: 1.5 }
    },
    {
      id: 'E7',
      name: 'Content freshness rate',
      description: 'Percentage of blog posts updated within last 12 months',
      maxScore: 4,
      detectionMethod: 'automated' as const,
      thresholds: { excellent: 3.5, good: 2.5, needsImprovement: 1.5 }
    }
  ],
  expertise: [
    {
      id: 'X1',
      name: 'Named authors with credentials',
      description: 'Author name with role/degree, headshot, and comprehensive bio page',
      maxScore: 6,
      detectionMethod: 'automated' as const,
      thresholds: { excellent: 5.5, good: 4, needsImprovement: 2 }
    },
    {
      id: 'X2',
      name: 'YMYL reviewer presence',
      description: 'Reviewed by [Name, Credentials] labels on health/financial content',
      maxScore: 5,
      detectionMethod: 'automated' as const,
      thresholds: { excellent: 4.5, good: 3.5, needsImprovement: 2 }
    },
    {
      id: 'X3',
      name: 'Credential verification links',
      description: 'Links from bios to LinkedIn, hospital/university, or license boards',
      maxScore: 4,
      detectionMethod: 'automated' as const,
      thresholds: { excellent: 3.5, good: 2.5, needsImprovement: 1.5 }
    },
    {
      id: 'X4',
      name: 'Citation quality',
      description: 'Proportion of .gov/.edu/peer-reviewed sources in citations',
      maxScore: 4,
      detectionMethod: 'automated' as const,
      thresholds: { excellent: 3.5, good: 2.5, needsImprovement: 1.5 }
    },
    {
      id: 'X5',
      name: 'Content depth & clarity',
      description: 'Strong heading structure, accurate definitions, helpful internal links',
      maxScore: 3,
      detectionMethod: 'automated' as const,
      thresholds: { excellent: 2.7, good: 2, needsImprovement: 1 }
    },
    {
      id: 'X6',
      name: 'Author consistency',
      description: 'Consistent author attribution across blog posts',
      maxScore: 3,
      detectionMethod: 'automated' as const,
      thresholds: { excellent: 2.7, good: 2, needsImprovement: 1 }
    }
  ],
  authoritativeness: [
    {
      id: 'A1',
      name: 'Editorial mentions',
      description: 'High-quality mentions in trade press, reputable orgs, .gov/.edu sites',
      maxScore: 5,
      detectionMethod: 'external-api' as const,
      thresholds: { excellent: 4.5, good: 3.5, needsImprovement: 2 }
    },
    {
      id: 'A2',
      name: 'Authors cited elsewhere',
      description: 'Author/reviewer presence on faculty pages, committees, society profiles',
      maxScore: 4,
      detectionMethod: 'external-api' as const,
      thresholds: { excellent: 3.5, good: 2.5, needsImprovement: 1.5 }
    },
    {
      id: 'A3',
      name: 'Entity clarity',
      description: 'Organization/Person schema with sameAs links; clear About page',
      maxScore: 4,
      detectionMethod: 'automated' as const,
      thresholds: { excellent: 3.5, good: 2.5, needsImprovement: 1.5 }
    },
    {
      id: 'A4',
      name: 'Independent references',
      description: 'Other sites citing or quoting your content (not ads/affiliates)',
      maxScore: 4,
      detectionMethod: 'external-api' as const,
      thresholds: { excellent: 3.5, good: 2.5, needsImprovement: 1.5 }
    },
    {
      id: 'A5',
      name: 'Quality patterns',
      description: 'Absence of site-reputation abuse or scaled thin pages',
      maxScore: 3,
      detectionMethod: 'automated' as const,
      thresholds: { excellent: 2.7, good: 2, needsImprovement: 1 }
    },
    {
      id: 'A6',
      name: 'Internal linking network',
      description: 'Strong internal link graph demonstrating topical authority',
      maxScore: 3,
      detectionMethod: 'automated' as const,
      thresholds: { excellent: 2.7, good: 2, needsImprovement: 1 }
    },
    {
      id: 'A7',
      name: 'Topic focus',
      description: 'Concentrated expertise vs scattered topics',
      maxScore: 2,
      detectionMethod: 'automated' as const,
      thresholds: { excellent: 1.8, good: 1.3, needsImprovement: 0.7 }
    }
  ],
  trustworthiness: [
    {
      id: 'T1',
      name: 'Editorial principles',
      description: 'Public editorial/corrections policy linked in footer',
      maxScore: 4,
      detectionMethod: 'automated' as const,
      thresholds: { excellent: 3.5, good: 2.5, needsImprovement: 1.5 }
    },
    {
      id: 'T2',
      name: 'YMYL disclaimers',
      description: 'Appropriate disclaimers on health/financial content',
      maxScore: 4,
      detectionMethod: 'automated' as const,
      thresholds: { excellent: 3.5, good: 2.5, needsImprovement: 1.5 }
    },
    {
      id: 'T3',
      name: 'Provenance signals',
      description: 'Bylines, dates (published/modified), reviewer labels visible',
      maxScore: 5,
      detectionMethod: 'automated' as const,
      thresholds: { excellent: 4.5, good: 3.5, needsImprovement: 2 }
    },
    {
      id: 'T4',
      name: 'Contact transparency',
      description: 'About/Team page, real contact info, Privacy/Terms policies',
      maxScore: 4,
      detectionMethod: 'automated' as const,
      thresholds: { excellent: 3.5, good: 2.5, needsImprovement: 1.5 }
    },
    {
      id: 'T5',
      name: 'Schema hygiene',
      description: 'Valid Article/WebPage/Person markup with key fields',
      maxScore: 4,
      detectionMethod: 'automated' as const,
      thresholds: { excellent: 3.5, good: 2.5, needsImprovement: 1.5 }
    },
    {
      id: 'T6',
      name: 'Schema adoption rate',
      description: 'Consistent schema markup across all blog content',
      maxScore: 2,
      detectionMethod: 'automated' as const,
      thresholds: { excellent: 1.8, good: 1.3, needsImprovement: 0.7 }
    },
    {
      id: 'T7',
      name: 'Quality consistency',
      description: 'Low variance in content quality across blog posts',
      maxScore: 2,
      detectionMethod: 'automated' as const,
      thresholds: { excellent: 1.8, good: 1.3, needsImprovement: 0.7 }
    }
  ]
}

/**
 * Calculate total max score for a category
 */
export function getCategoryMaxScore(category: keyof typeof EEAT_VARIABLES): number {
  return EEAT_VARIABLES[category].reduce((sum, v) => sum + v.maxScore, 0)
}

/**
 * Get variable definition by ID
 */
export function getVariableDefinition(id: string): VariableDefinition | undefined {
  for (const category of Object.values(EEAT_VARIABLES)) {
    const variable = category.find(v => v.id === id)
    if (variable) return variable
  }
  return undefined
}

/**
 * Overall score thresholds (0-100)
 */
export const SCORE_THRESHOLDS = {
  excellent: 80,
  good: 60,
  fair: 40
}

/**
 * Get status from score
 */
export function getScoreStatus(score: number, maxScore: number): 'excellent' | 'good' | 'needs-improvement' | 'poor' {
  const percentage = (score / maxScore) * 100
  if (percentage >= 85) return 'excellent'
  if (percentage >= 65) return 'good'
  if (percentage >= 40) return 'needs-improvement'
  return 'poor'
}

/**
 * Get overall status label
 */
export function getOverallStatus(overallScore: number): 'excellent' | 'good' | 'fair' | 'poor' {
  if (overallScore >= SCORE_THRESHOLDS.excellent) return 'excellent'
  if (overallScore >= SCORE_THRESHOLDS.good) return 'good'
  if (overallScore >= SCORE_THRESHOLDS.fair) return 'fair'
  return 'poor'
}

/**
 * Benchmark comparison ranges
 */
export const BENCHMARKS = {
  fortune500: { min: 75, max: 85 },
  midMarket: { min: 55, max: 70 },
  startup: { min: 30, max: 50 },
  aiGenerated: { min: 15, max: 25 }
}

/**
 * DataForSEO API configuration
 */
export const DATAFORSEO_CONFIG = {
  baseUrl: 'https://api.dataforseo.com/v3',
  endpoints: {
    backlinksSummary: '/backlinks/summary/live',
    backlinksDetail: '/backlinks/backlinks/live',
    bulkRanks: '/backlinks/bulk_ranks/live',
    bulkSpamScore: '/backlinks/bulk_spam_score/live',
    domainOverview: '/dataforseo_labs/google/domain_metrics/live',
  },
  rateLimit: 2000, // requests per minute
}

/**
 * Content analysis thresholds
 */
export const CONTENT_THRESHOLDS = {
  minWordCount: 300,
  optimalWordCount: 1500,
  maxReadabilityScore: 80,
  minHeadings: 3,
  optimalCitations: 5,
}

/**
 * Schema types to detect
 */
export const SCHEMA_TYPES = [
  'MedicalWebPage',
  'HealthTopicContent',
  'Article',
  'BlogPosting',
  'Person',
  'Organization',
  'WebPage',
  'Review',
  'Product',
  'FAQPage',
  'HowTo',
]

/**
 * YMYL content indicators (for detecting health/financial content)
 */
export const YMYL_INDICATORS = [
  'medical', 'health', 'treatment', 'disease', 'symptoms', 'diagnosis',
  'financial', 'investment', 'tax', 'insurance', 'mortgage', 'legal'
]

/**
 * Cache TTL (in seconds)
 */
export const CACHE_TTL = {
  analysis: 86400, // 24 hours
  domainMetrics: 604800, // 7 days
  backlinks: 604800, // 7 days
}

/**
 * Backward-compatible EEAT_CONFIG export for legacy code
 * @deprecated Use individual exports (DATAFORSEO_CONFIG, CONTENT_THRESHOLDS, etc.) instead
 */
export const EEAT_CONFIG = {
  dataforseo: DATAFORSEO_CONFIG,
  content: CONTENT_THRESHOLDS,
  schemaTypes: SCHEMA_TYPES,
  ymylIndicators: YMYL_INDICATORS,
  cache: CACHE_TTL,
}

/**
 * Calculate overall E-E-A-T score from category scores (legacy function)
 * @deprecated Use getOverallStatus() instead for consistency with new variable-based system
 */
export function calculateOverallScore(scores: {
  experience: number
  expertise: number
  authoritativeness: number
  trustworthiness: number
}): number {
  return scores.experience + scores.expertise + scores.authoritativeness + scores.trustworthiness
}
