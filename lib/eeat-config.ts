/**
 * E-E-A-T Meter Configuration
 * Centralized configuration for scoring weights, API endpoints, and thresholds
 */

export const EEAT_CONFIG = {
  // Scoring weights (must total 100)
  weights: {
    domainAuthority: 15,      // Moz Domain Authority
    backlinks: 10,            // Quality and quantity of backlinks
    authorCredentials: 15,    // Detected author bylines and credentials
    schemaMarkup: 10,         // Structured data presence and quality
    security: 10,             // SSL, HTTPS, security headers
    contentQuality: 20,       // Content length, readability, originality
    userSignals: 10,          // Engagement metrics (if available)
    citations: 10,            // External citations and references
  },

  // E-E-A-T category distribution (each 0-25, total 100)
  categories: {
    experience: {
      weight: 25,
      factors: ['authorCredentials', 'contentQuality', 'citations']
    },
    expertise: {
      weight: 25,
      factors: ['authorCredentials', 'schemaMarkup', 'citations']
    },
    authoritativeness: {
      weight: 25,
      factors: ['domainAuthority', 'backlinks', 'citations']
    },
    trustworthiness: {
      weight: 25,
      factors: ['security', 'schemaMarkup', 'userSignals']
    }
  },

  // Score thresholds for color coding
  thresholds: {
    excellent: 80,  // Green
    good: 60,       // Yellow
    poor: 40,       // Orange
    // Below 40: Red
  },

  // API rate limits (requests per minute)
  rateLimits: {
    semrush: 10,
    moz: 10,
    internal: 100,
  },

  // Cache TTL (in seconds)
  cacheTTL: {
    analysis: 86400,      // 24 hours
    domainMetrics: 604800, // 7 days
    backlinks: 604800,    // 7 days
  },

  // Semrush API endpoints
  semrush: {
    baseUrl: 'https://api.semrush.com',
    endpoints: {
      domainOverview: '/analytics/v1/',
      backlinks: '/analytics/v1/backlinks',
      organicKeywords: '/analytics/v1/organic',
    },
    database: 'us', // Default database (can be changed per request)
  },

  // Moz API configuration
  moz: {
    baseUrl: 'https://lsapi.seomoz.com/v2',
    endpoints: {
      urlMetrics: '/url_metrics',
      linkMetrics: '/link_metrics',
    },
  },

  // Content analysis thresholds
  content: {
    minWordCount: 300,
    optimalWordCount: 1500,
    maxReadabilityScore: 80, // Flesch-Kincaid
    minHeadings: 3,
  },

  // Schema markup types to check for
  schemaTypes: [
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
  ],

  // Issue severity levels
  issueSeverity: {
    critical: ['noSSL', 'noAuthor', 'noSchema'],
    high: ['lowDA', 'fewBacklinks', 'shortContent'],
    medium: ['missingH1', 'lowReadability', 'fewCitations'],
    low: ['missingMetaDescription', 'noImageAlt'],
  },
}

// Helper function to calculate overall score from category scores
export function calculateOverallScore(scores: {
  experience: number
  expertise: number
  authoritativeness: number
  trustworthiness: number
}): number {
  return Math.round(
    scores.experience +
    scores.expertise +
    scores.authoritativeness +
    scores.trustworthiness
  )
}

// Helper function to get score color
export function getScoreColor(score: number): 'excellent' | 'good' | 'fair' | 'poor' {
  if (score >= EEAT_CONFIG.thresholds.excellent) return 'excellent'
  if (score >= EEAT_CONFIG.thresholds.good) return 'good'
  if (score >= EEAT_CONFIG.thresholds.poor) return 'fair'
  return 'poor'
}

// Helper function to get score label
export function getScoreLabel(score: number): string {
  const color = getScoreColor(score)
  const labels = {
    excellent: 'Excellent',
    good: 'Good',
    fair: 'Needs Improvement',
    poor: 'Poor'
  }
  return labels[color]
}
