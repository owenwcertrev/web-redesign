/**
 * Batch Analyzer Service
 * Analyzes multiple blog posts in parallel with concurrency control
 */

import { analyzeURL, type PageAnalysis } from './url-analyzer'
import { calculateInstantEEATScores, type EEATScore } from './eeat-scorer'
import type { BlogPostAnalysis, BlogAnalysisProgress } from '../types/blog-analysis'

export interface BatchAnalysisOptions {
  urls: string[]
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
   */
  private async analyzeSinglePost(url: string): Promise<BlogPostAnalysis> {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Analysis timeout')), this.timeout)
    )

    const analysisPromise = async () => {
      // Analyze the page
      const pageAnalysis = await analyzeURL(url)

      // Calculate instant EEAT scores
      const scores = calculateInstantEEATScores(pageAnalysis)

      // Extract topics from headings and title
      const topics = this.extractTopics(pageAnalysis)

      // Try to extract author name
      const authorName = pageAnalysis.authors[0]?.name

      // Try to extract published date from URL or schema
      const publishedDate = this.extractPublishedDate(url, pageAnalysis)

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
    return [...new Set(topics)].slice(0, 10)
  }

  /**
   * Try to extract published date from URL patterns or schema
   */
  private extractPublishedDate(url: string, page: PageAnalysis): Date | undefined {
    // Try to extract from URL (e.g., /2024/01/15/post-title)
    const datePattern = /\/(\d{4})\/(\d{1,2})\/(\d{1,2})\//
    const match = url.match(datePattern)

    if (match) {
      const [, year, month, day] = match
      return new Date(`${year}-${month}-${day}`)
    }

    // Try to extract from schema markup
    const articleSchema = page.schemaMarkup.find(
      schema => schema.type === 'Article' || schema.type === 'BlogPosting'
    )

    if (articleSchema?.data?.datePublished) {
      return new Date(articleSchema.data.datePublished)
    }

    return undefined
  }

  /**
   * Analyze multiple blog posts in batches with concurrency control
   */
  async analyzeBatch(urls: string[]): Promise<BatchAnalysisResult> {
    const startTime = Date.now()
    const successful: BlogPostAnalysis[] = []
    const failed: FailedAnalysis[] = []

    console.log(`Starting batch analysis of ${urls.length} URLs (max ${this.maxConcurrent} concurrent)`)

    // Process in chunks to control concurrency
    for (let i = 0; i < urls.length; i += this.maxConcurrent) {
      const chunk = urls.slice(i, i + this.maxConcurrent)
      const chunkPromises = chunk.map(async url => {
        try {
          const result = await this.analyzeSinglePost(url)
          successful.push(result)
          return { success: true, url }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          failed.push({
            url,
            error: errorMessage,
            timestamp: new Date(),
          })
          console.error(`Failed to analyze ${url}:`, errorMessage)
          return { success: false, url }
        }
      })

      // Wait for current chunk to complete
      await Promise.all(chunkPromises)

      // Report progress
      if (this.onProgress) {
        const totalProcessed = successful.length + failed.length
        const percentage = (totalProcessed / urls.length) * 100
        const elapsed = Date.now() - startTime
        const estimatedTotal = (elapsed / totalProcessed) * urls.length
        const estimatedRemaining = Math.round((estimatedTotal - elapsed) / 1000)

        this.onProgress({
          totalPosts: urls.length,
          analyzedPosts: totalProcessed,
          currentPost: chunk[chunk.length - 1],
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
   */
  static async analyze(options: BatchAnalysisOptions): Promise<BatchAnalysisResult> {
    const analyzer = new BatchAnalyzer({
      maxConcurrent: options.maxConcurrent,
      timeout: options.timeout,
      onProgress: options.onProgress,
    })

    return analyzer.analyzeBatch(options.urls)
  }
}

/**
 * Convenience function for simple batch analysis
 */
export async function analyzeBlogPosts(
  urls: string[],
  options: {
    maxConcurrent?: number
    onProgress?: (progress: BlogAnalysisProgress) => void
  } = {}
): Promise<BatchAnalysisResult> {
  return BatchAnalyzer.analyze({
    urls,
    maxConcurrent: options.maxConcurrent,
    onProgress: options.onProgress,
  })
}
