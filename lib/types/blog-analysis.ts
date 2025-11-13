/**
 * Blog Analysis Types
 * Comprehensive types for multi-page blog strategy analysis
 */

import type { PageAnalysis } from '../services/url-analyzer'
import type { DataForSEOMetrics } from '../services/dataforseo-api'
import type { NLPAnalysisResult } from '../services/nlp-analyzer'

/**
 * E-E-A-T Variable Definition
 * Represents a single measurable variable within an E-E-A-T category
 */
export interface EEATVariable {
  id: string // e.g., 'E1', 'X2', 'T5'
  name: string // e.g., 'First-person narratives'
  description: string
  maxScore: number // Maximum points this variable can contribute
  actualScore: number // Points earned (0 to maxScore)
  status: 'excellent' | 'good' | 'needs-improvement' | 'poor'
  evidence: EEATEvidence[]
  recommendation?: string
  detectionMethod: 'automated' | 'external-api' | 'hybrid'
  isEstimated?: boolean // True if score is estimated due to API failure/timeout
  estimationNote?: string // Explanation of why/how score was estimated
}

/**
 * Evidence supporting a variable score
 */
export interface EEATEvidence {
  type: 'url' | 'snippet' | 'metric' | 'note' | 'estimation'
  value: string
  label?: string
  confidence?: number // 0-1
  isEstimate?: boolean // True if this evidence is based on estimation
}

/**
 * E-E-A-T Category Score (Experience, Expertise, Authoritativeness, Trust)
 */
export interface EEATCategoryScore {
  category: 'experience' | 'expertise' | 'authoritativeness' | 'trustworthiness'
  displayName: string
  totalScore: number // Sum of all variable actualScores
  maxScore: number // Sum of all variable maxScores (should equal 25)
  percentage: number // (totalScore / maxScore) * 100
  variables: EEATVariable[]
  overallStatus: 'excellent' | 'good' | 'fair' | 'poor'
  singlePageLimitation?: {
    unavailableVariables: string[] // IDs of variables that can't be scored (e.g., ['E6', 'E7'])
    missedPoints: number // Total max points from unavailable variables
  }
}

/**
 * Complete E-E-A-T Score with variable-based breakdown
 */
export interface EEATScore {
  overall: number // 0-100 (sum of all 4 category totalScores)
  categories: {
    experience: EEATCategoryScore
    expertise: EEATCategoryScore
    authoritativeness: EEATCategoryScore
    trustworthiness: EEATCategoryScore
  }
  status: 'excellent' | 'good' | 'fair' | 'poor'
  benchmarkComparison?: {
    fortune500: string // e.g., '75-85'
    midMarket: string
    startup: string
  }
  postsAnalyzed?: number // For blog-level analysis
  isSinglePageAnalysis?: boolean // True if only analyzing a single page (limits blog-level metrics)
  singlePageNote?: string // Explanation of single-page limitations
}

/**
 * Issues and Suggestions (legacy support)
 */
export interface Issue {
  severity: 'high' | 'medium' | 'low'
  category: string
  description: string
  affectedUrls?: string[]
}

export interface Suggestion {
  category: string
  priority: 'high' | 'medium' | 'low'
  action: string
  expectedImpact: string
  effort: 'low' | 'medium' | 'high'
}

/**
 * Complete blog analysis result
 */
export interface BlogAnalysis {
  domain: string
  analyzedAt: Date
  postsAnalyzed: BlogPostAnalysis[]
  totalPostsFound: number
  blogInsights: BlogInsights
  aggregateScores: EEATScore
  topIssues: Issue[]
  topSuggestions: Suggestion[]
  comprehensiveAnalysis?: BlogComprehensiveAnalysis
}

/**
 * Individual blog post analysis with scores
 */
export interface BlogPostAnalysis {
  url: string
  title: string
  publishedDate?: Date
  pageAnalysis: PageAnalysis
  scores: EEATScore
  wordCount: number
  authorName?: string
  topics: string[]
}

/**
 * Aggregate blog-level insights and strategy metrics
 */
export interface BlogInsights {
  publishingFrequency: PublishingFrequencyInsight
  contentDepth: ContentDepthInsight
  topicDiversity: TopicDiversityInsight
  authorConsistency: AuthorConsistencyInsight
  schemaAdoption: SchemaAdoptionInsight
  internalLinking: InternalLinkingInsight
  overallBlogScore: number // 0-100 aggregate blog strategy score
}

/**
 * Publishing frequency analysis
 */
export interface PublishingFrequencyInsight {
  postsPerMonth: number
  totalPosts: number // BUG FIX (2025-11-12): Posts WITH dates (used in calculation)
  totalPostsAnalyzed?: number // Total posts analyzed (including those without dates)
  postsWithoutDates?: number // Posts missing date information
  dateRange: {
    earliest?: Date
    latest?: Date
    spanMonths: number
  }
  trend: 'increasing' | 'decreasing' | 'stable' | 'irregular' | 'unknown'
  score: number // 0-100
  recommendation: string
}

/**
 * Content depth and quality distribution
 */
export interface ContentDepthInsight {
  avgWordCount: number
  medianWordCount: number
  distribution: {
    short: number // < 500 words
    medium: number // 500-1500 words
    long: number // 1500-3000 words
    comprehensive: number // > 3000 words
  }
  avgCitations: number
  avgReadability: number
  score: number // 0-100
  recommendation: string
}

/**
 * Topic diversity and keyword analysis
 */
export interface TopicDiversityInsight {
  uniqueTopics: number
  topKeywords: KeywordCluster[]
  topicClusters: number
  focusScore: number // How well topics align vs scattered
  coverage: 'narrow' | 'focused' | 'diverse' | 'scattered'
  score: number // 0-100
  recommendation: string
}

export interface KeywordCluster {
  keyword: string
  frequency: number
  relatedPosts: number
}

/**
 * Author attribution and consistency
 */
export interface AuthorConsistencyInsight {
  totalAuthors: number
  primaryAuthors: AuthorStats[]
  postsWithAuthor: number
  postsWithoutAuthor: number
  attributionRate: number // Percentage
  consistency: 'single' | 'consistent-team' | 'varied' | 'inconsistent' | 'missing'
  score: number // 0-100
  recommendation: string
}

export interface AuthorStats {
  name: string
  postCount: number
  percentage: number
  hasCredentials: boolean
}

/**
 * Schema markup adoption across blog
 */
export interface SchemaAdoptionInsight {
  adoptionRate: number // Percentage of posts with schema
  postsWithSchema: number
  postsWithoutSchema: number
  commonSchemaTypes: SchemaTypeStats[]
  hasArticleSchema: number
  hasBreadcrumbSchema: number
  hasAuthorSchema: number
  score: number // 0-100
  recommendation: string
}

export interface SchemaTypeStats {
  type: string
  count: number
  percentage: number
}

/**
 * Internal linking strategy analysis
 */
export interface InternalLinkingInsight {
  avgInternalLinksPerPost: number
  postsWithNoInternalLinks: number
  postsWithGoodLinking: number // >= 3 internal links
  linkDensity: number // Links per 1000 words
  networkStrength: 'strong' | 'moderate' | 'weak' | 'isolated'
  score: number // 0-100
  recommendation: string
}

/**
 * Comprehensive analysis (from background job with external APIs)
 */
export interface BlogComprehensiveAnalysis {
  status: 'processing' | 'completed' | 'failed'
  jobId?: string
  aggregateNLPAnalysis?: AggregateNLPAnalysis
  domainMetrics?: DataForSEOMetrics
  competitorComparison?: CompetitorComparison
  contentGaps?: ContentGap[]
}

/**
 * Aggregate NLP analysis across all posts
 */
export interface AggregateNLPAnalysis {
  avgToneScore: number
  avgExperienceSignals: number
  avgExpertiseDepth: number
  avgAIContentProbability: number
  overallContentQuality: 'excellent' | 'good' | 'average' | 'poor'
  commonThemes: string[]
}

/**
 * Competitor comparison data
 */
export interface CompetitorComparison {
  userBlogScore: number
  industryAverage: number
  topCompetitorScore: number
  ranking: 'above-average' | 'average' | 'below-average'
}

/**
 * Content gap identification
 */
export interface ContentGap {
  topic: string
  opportunity: string
  priority: 'high' | 'medium' | 'low'
  suggestedKeywords: string[]
}

/**
 * Blog discovery result (from sitemap parsing)
 */
export interface BlogDiscoveryResult {
  posts: BlogPost[]
  totalFound: number
  source: 'sitemap' | 'rss' | 'manual'
  error?: string
}

export interface BlogPost {
  url: string
  lastmod?: Date
  priority?: number
  changefreq?: string
}

/**
 * Progress tracking for batch analysis
 */
export interface BlogAnalysisProgress {
  totalPosts: number
  analyzedPosts: number
  currentPost?: string
  percentage: number
  estimatedTimeRemaining?: number // seconds
  errors: string[]
}

/**
 * API request/response types
 */
export interface AnalyzeBlogRequest {
  domain: string
  email?: string
  limit?: number // Max posts to analyze (default 20)
}

export interface AnalyzeBlogResponse {
  success: boolean
  instantAnalysis?: BlogAnalysis
  comprehensiveAnalysis?: {
    jobId: string
    status: 'queued' | 'processing'
    estimatedCompletionTime: number // seconds
  }
  error?: string
}
