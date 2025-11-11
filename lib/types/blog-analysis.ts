/**
 * Blog Analysis Types
 * Comprehensive types for multi-page blog strategy analysis
 */

import type { PageAnalysis } from '../services/url-analyzer'
import type { EEATScore, Issue, Suggestion } from '../services/eeat-scorer'
import type { DataForSEOMetrics } from '../services/dataforseo-api'
import type { NLPAnalysisResult } from '../services/nlp-analyzer'

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
  totalPosts: number
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
