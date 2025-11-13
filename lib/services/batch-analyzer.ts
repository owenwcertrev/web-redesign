/**
 * Batch Analyzer Service
 * Analyzes multiple blog posts in parallel with concurrency control
 */

import { analyzeURL, type PageAnalysis } from './url-analyzer'
import { calculateInstantEEATScores } from './eeat-scorer-v2'
import type { BlogPostAnalysis, BlogAnalysisProgress, EEATScore } from '../types/blog-analysis'

export interface BatchAnalysisOptions {
  posts: Array<{ url: string; lastmod?: Date }> // BUG FIX (2025-11-12): Changed from urls to posts
  maxConcurrent?: number // Default: 3
  timeout?: number // Timeout per URL in ms (default: 30000)
  onProgress?: (progress: BlogAnalysisProgress) => void
}

export interface BatchAnalysisResult {
  successful: BlogPostAnalysis[]
  failed: FailedAnalysis[]
  totalAnalyzed: number
  totalFailed: number
  duration: number // milliseconds
}

export interface FailedAnalysis {
  url: string
  error: string
  timestamp: Date
}

/**
 * Batch analyzer for analyzing multiple blog posts
 */
export class BatchAnalyzer {
  private maxConcurrent: number
  private timeout: number
  private onProgress?: (progress: BlogAnalysisProgress) => void

  constructor(options: {
    maxConcurrent?: number
    timeout?: number
    onProgress?: (progress: BlogAnalysisProgress) => void
  } = {}) {
    this.maxConcurrent = options.maxConcurrent || 3
    this.timeout = options.timeout || 30000 // 30 seconds
    this.onProgress = options.onProgress
  }

  /**
   * Analyze a single blog post with timeout
   * BUG FIX (2025-11-12): Now accepts BlogPost object to preserve sitemap lastmod
   */
  private async analyzeSinglePost(post: { url: string; lastmod?: Date }): Promise<BlogPostAnalysis> {
    const { url, lastmod } = post

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Analysis timeout')), this.timeout)
    )

    const analysisPromise = async () => {
      // Analyze the page
      const pageAnalysis = await analyzeURL(url)

      // Extract domain for scoring
      const domain = new URL(pageAnalysis.finalUrl || pageAnalysis.url).hostname.replace('www.', '')

      // Calculate instant EEAT scores (async with API calls)
      const scores = await calculateInstantEEATScores(pageAnalysis, domain)

      // Extract topics from headings and title
      const topics = this.extractTopics(pageAnalysis)

      // Try to extract author name
      const authorName = pageAnalysis.authors[0]?.name

      // BUG FIX (2025-11-12): Pass sitemap lastmod as fallback
      const publishedDate = this.extractPublishedDate(url, pageAnalysis, lastmod)

      return {
        url,
        title: pageAnalysis.title,
        publishedDate,
        pageAnalysis,
        scores,
        wordCount: pageAnalysis.wordCount,
        authorName,
        topics,
      }
    }

    return Promise.race([analysisPromise(), timeoutPromise])
  }

  /**
   * Extract topics from page content
   */
  private extractTopics(page: PageAnalysis): string[] {
    const topics: string[] = []

    // Extract from H1 and H2 headings
    const allHeadings = [...page.headings.h1, ...page.headings.h2]

    // Extract significant words (> 4 characters, not common words)
    const stopWords = new Set([
      'the',
      'and',
      'for',
      'are',
      'but',
      'not',
      'you',
      'with',
      'this',
      'that',
      'from',
      'have',
      'what',
      'your',
      'how',
      'about',
      'more',
      'when',
      'best',
      'guide',
    ])

    for (const heading of allHeadings) {
      const words = heading
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 4 && !stopWords.has(word))

      topics.push(...words)
    }

    // Return unique topics, limit to 10
    return Array.from(new Set(topics)).slice(0, 10)
  }

  /**
   * Try to extract published date from URL patterns or schema
   * BUG FIX (2025-11-12): Added sitemapLastmod parameter as fallback
   */
  private extractPublishedDate(url: string, page: PageAnalysis, sitemapLastmod?: Date): Date | undefined {
    // Try 1: Extract from URL (e.g., /2024/01/15/post-title)
    const datePattern = /\/(\d{4})\/(\d{1,2})\/(\d{1,2})\//
    const match = url.match(datePattern)

    if (match) {
      const [, year, month, day] = match
      return new Date(`${year}-${month}-${day}`)
    }

    // Try 2: Extract from standard schema markup
    const articleSchema = page.schemaMarkup.find(
      schema => schema.type === 'Article' || schema.type === 'BlogPosting'
    )

    if (articleSchema?.data?.datePublished) {
      return new Date(articleSchema.data.datePublished)
    }

    // Try 3: Check for custom schema formats (e.g., Healthline's published.date)
    if (articleSchema?.data?.published) {
      // Unix timestamp (in seconds)
      if (typeof articleSchema.data.published.date === 'number') {
        return new Date(articleSchema.data.published.date * 1000)
      }
      // Date string (e.g., "October 16, 2020")
      if (typeof articleSchema.data.published.display === 'string') {
        const date = new Date(articleSchema.data.published.display)
        if (!isNaN(date.getTime())) {
          return date
        }
      }
    }

    // Try 4: Check for other common schema date fields
    if (articleSchema?.data?.dateCreated) {
      return new Date(articleSchema.data.dateCreated)
    }

    if (articleSchema?.data?.dateModified) {
      return new Date(articleSchema.data.dateModified)
    }

    // BUG FIX (2025-11-12): Try 5: Use sitemap lastmod as fallback
    // This fixes the issue where only 2/16 Healthline posts had dates
    if (sitemapLastmod) {
      console.log(`[extractPublishedDate] Using sitemap lastmod as fallback: ${sitemapLastmod.toISOString()} for ${url}`)
      return sitemapLastmod
    }

    return undefined
  }

  /**
   * Analyze multiple blog posts in batches with concurrency control
   * BUG FIX (2025-11-12): Now accepts BlogPost objects to preserve sitemap dates
   */
  async analyzeBatch(posts: Array<{ url: string; lastmod?: Date }>): Promise<BatchAnalysisResult> {
    const startTime = Date.now()
    const successful: BlogPostAnalysis[] = []
    const failed: FailedAnalysis[] = []

    console.log(`Starting batch analysis of ${posts.length} URLs (max ${this.maxConcurrent} concurrent)`)

    // Process in chunks to control concurrency
    for (let i = 0; i < posts.length; i += this.maxConcurrent) {
      const chunk = posts.slice(i, i + this.maxConcurrent)
      const chunkPromises = chunk.map(async post => {
        try {
          const result = await this.analyzeSinglePost(post)
          successful.push(result)
          return { success: true, url: post.url }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          failed.push({
            url: post.url,
            error: errorMessage,
            timestamp: new Date(),
          })
          console.error(`Failed to analyze ${post.url}:`, errorMessage)
          return { success: false, url: post.url }
        }
      })

      // Wait for current chunk to complete
      await Promise.all(chunkPromises)

      // Report progress
      if (this.onProgress) {
        const totalProcessed = successful.length + failed.length
        const percentage = (totalProcessed / posts.length) * 100
        const elapsed = Date.now() - startTime
        const estimatedTotal = (elapsed / totalProcessed) * posts.length
        const estimatedRemaining = Math.round((estimatedTotal - elapsed) / 1000)

        this.onProgress({
          totalPosts: posts.length,
          analyzedPosts: totalProcessed,
          currentPost: chunk[chunk.length - 1].url,
          percentage: Math.round(percentage),
          estimatedTimeRemaining: estimatedRemaining,
          errors: failed.map(f => `${f.url}: ${f.error}`),
        })
      }
    }

    const duration = Date.now() - startTime

    console.log(
      `Batch analysis complete: ${successful.length} successful, ${failed.length} failed in ${duration}ms`
    )

    return {
      successful,
      failed,
      totalAnalyzed: successful.length,
      totalFailed: failed.length,
      duration,
    }
  }

  /**
   * Static helper to analyze multiple URLs
   * BUG FIX (2025-11-12): Now accepts BlogPost objects to preserve sitemap dates
   */
  static async analyze(options: BatchAnalysisOptions): Promise<BatchAnalysisResult> {
    const analyzer = new BatchAnalyzer({
      maxConcurrent: options.maxConcurrent,
      timeout: options.timeout,
      onProgress: options.onProgress,
    })

    return analyzer.analyzeBatch(options.posts)
  }
}

/**
 * Convenience function for simple batch analysis
 * BUG FIX (2025-11-12): Now accepts BlogPost objects to preserve sitemap dates
 */
export async function analyzeBlogPosts(
  posts: Array<{ url: string; lastmod?: Date }>,
  options: {
    maxConcurrent?: number
    onProgress?: (progress: BlogAnalysisProgress) => void
  } = {}
): Promise<BatchAnalysisResult> {
  return BatchAnalyzer.analyze({
    posts,
    maxConcurrent: options.maxConcurrent,
    onProgress: options.onProgress,
  })
}
