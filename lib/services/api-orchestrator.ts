/**
 * API Orchestrator
 * Handles parallel API calls with timeouts and graceful degradation
 */

import type { DataForSEOMetrics } from './dataforseo-api'
import type { ReputationResult } from './reputation-checker'
import { getDataForSEOMetrics } from './dataforseo-api'
import { checkAuthorReputation } from './reputation-checker'

export interface InstantAPIResults {
  domainMetrics?: DataForSEOMetrics
  domainMetricsError?: string
  authorReputation?: ReputationResult
  authorReputationError?: string
}

/**
 * Execute a promise with a timeout
 */
async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage: string
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs)
    )
  ])
}

/**
 * Execute a function with exponential backoff retry
 * @param fn Function to execute
 * @param maxRetries Maximum number of retries (default: 2)
 * @param initialDelayMs Initial delay in milliseconds (default: 1000)
 * @param maxDelayMs Maximum delay in milliseconds (default: 8000)
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 2,
  initialDelayMs: number = 1000,
  maxDelayMs: number = 8000
): Promise<T> {
  let lastError: Error | undefined

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error: any) {
      lastError = error

      // Don't retry on timeout errors (already waited long enough)
      if (error.message?.includes('timed out')) {
        throw error
      }

      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        throw error
      }

      // Calculate exponential backoff delay: initialDelay * 2^attempt
      const delay = Math.min(initialDelayMs * Math.pow(2, attempt), maxDelayMs)

      console.warn(`API call failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms...`, error.message)

      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError || new Error('Max retries exceeded')
}

/**
 * Fetch instant API data in parallel with timeouts
 * - DataForSEO domain metrics (20s timeout)
 * - Basic author reputation check (20s timeout)
 * Returns partial results even if some APIs fail
 */
export async function fetchInstantAPIs(
  domain: string,
  authorName?: string
): Promise<InstantAPIResults> {
  const results: InstantAPIResults = {}

  // Fetch DataForSEO domain metrics with timeout and retry
  const domainMetricsPromise = withRetry(
    () => withTimeout(
      getDataForSEOMetrics(`https://${domain}`),
      20000,
      'DataForSEO domain metrics timed out after 20 seconds'
    ),
    2, // 2 retries = 3 total attempts
    1000 // Start with 1s delay
  )
    .then(metrics => {
      results.domainMetrics = metrics
    })
    .catch(error => {
      results.domainMetricsError = error.message || 'Failed to fetch domain metrics'
      console.warn('DataForSEO domain metrics failed after retries:', error)
    })

  // Fetch author reputation with timeout (only if author name provided)
  let authorReputationPromise: Promise<void> | undefined

  if (authorName) {
    // Create minimal Author object for reputation check
    const authorObject = {
      name: authorName,
      source: 'meta' as const
    }

    authorReputationPromise = withRetry(
      () => withTimeout(
        checkAuthorReputation(authorObject),
        20000,
        'Author reputation check timed out after 20 seconds'
      ),
      2, // 2 retries = 3 total attempts
      1000 // Start with 1s delay
    )
      .then(reputation => {
        // Convert null to undefined for interface compatibility
        results.authorReputation = reputation ?? undefined
      })
      .catch(error => {
        results.authorReputationError = error.message || 'Failed to check author reputation'
        console.warn('Author reputation check failed after retries:', error)
      })
  }

  // Wait for all API calls to complete (or fail)
  await Promise.allSettled([
    domainMetricsPromise,
    authorReputationPromise
  ].filter(Boolean))

  return results
}

/**
 * Fetch comprehensive API data (no strict timeouts - background job)
 * Includes all instant APIs plus LLM-based analysis
 */
export async function fetchComprehensiveAPIs(
  domain: string,
  authorName?: string,
  contentText?: string
): Promise<{
  domainMetrics?: DataForSEOMetrics
  authorReputation?: ReputationResult
  nlpAnalysis?: any // Will add NLP analysis later
  errors: string[]
}> {
  const errors: string[] = []
  const results: any = {}

  // Fetch domain metrics
  try {
    results.domainMetrics = await getDataForSEOMetrics(`https://${domain}`)
  } catch (error: any) {
    errors.push(`Domain metrics: ${error.message}`)
    console.error('Failed to fetch domain metrics:', error)
  }

  // Fetch author reputation (deep search)
  if (authorName) {
    try {
      // Create minimal Author object for reputation check
      const authorObject = {
        name: authorName,
        source: 'meta' as const
      }
      const reputation = await checkAuthorReputation(authorObject)
      // Convert null to undefined for interface compatibility
      results.authorReputation = reputation ?? undefined
    } catch (error: any) {
      errors.push(`Author reputation: ${error.message}`)
      console.error('Failed to check author reputation:', error)
    }
  }

  // TODO: Add NLP analysis when implemented
  // if (contentText) {
  //   try {
  //     results.nlpAnalysis = await analyzeContentWithNLP(contentText)
  //   } catch (error: any) {
  //     errors.push(`NLP analysis: ${error.message}`)
  //   }
  // }

  return { ...results, errors }
}

/**
 * Create estimation note for failed API calls
 */
export function createEstimationNote(
  apiName: string,
  error: string,
  estimationMethod: string
): string {
  return `Couldn't fetch ${apiName} (${error}). Estimating based on ${estimationMethod}.`
}

/**
 * Create estimation note for unavailable data
 */
export function createUnavailableNote(
  dataName: string,
  reason: string = 'not available in current plan'
): string {
  return `${dataName} ${reason}. See comprehensive report for full analysis.`
}
