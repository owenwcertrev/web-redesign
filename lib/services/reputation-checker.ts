/**
 * Author Reputation Checker
 *
 * Checks author web presence and reputation using search APIs
 * - Professional profiles (LinkedIn, university pages, company sites)
 * - Media mentions (news articles, interviews)
 * - Publications and research
 * - Negative signals (scandals, retractions)
 */

import type { Author } from './url-analyzer'

export interface ReputationResult {
  authorName: string
  reputationScore: number // 0-100: Overall reputation score
  signals: ReputationSignal[]
  summary: string
}

export interface ReputationSignal {
  type: 'professional_profile' | 'media_mention' | 'publication' | 'credential' | 'negative'
  source: string
  url?: string
  authority: 'high' | 'medium' | 'low' // Authority of the source
  description: string
}

/**
 * Checks author reputation using web search
 */
export async function checkAuthorReputation(author: Author): Promise<ReputationResult | null> {
  // Skip if no search API configured
  if (!process.env.BRAVE_SEARCH_API_KEY && !process.env.SERPAPI_KEY) {
    console.warn('[Reputation Checker] No search API key configured, skipping reputation check')
    return null
  }

  try {
    // Use Brave Search API if available (free tier: 2000 queries/month)
    if (process.env.BRAVE_SEARCH_API_KEY) {
      return await checkWithBraveSearch(author)
    }

    // Fallback to SerpAPI if configured
    if (process.env.SERPAPI_KEY) {
      return await checkWithSerpAPI(author)
    }

    return null
  } catch (error) {
    console.error('[Reputation Checker] Error during reputation check:', error)
    return null // Graceful fallback
  }
}

/**
 * Checks reputation using Brave Search API
 */
async function checkWithBraveSearch(author: Author): Promise<ReputationResult> {
  const authorName = author.name
  const query = `"${authorName}"${author.credentials ? ` ${author.credentials}` : ''}`

  // Call Brave Search API
  const response = await fetch(
    `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=10`,
    {
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip',
        'X-Subscription-Token': process.env.BRAVE_SEARCH_API_KEY!,
      },
    }
  )

  if (!response.ok) {
    throw new Error(`Brave Search API failed: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  const results = data.web?.results || []

  // Analyze search results
  const signals = analyzeSearchResults(results, authorName)
  const reputationScore = calculateReputationScore(signals)
  const summary = generateReputationSummary(authorName, signals, reputationScore)

  return {
    authorName,
    reputationScore,
    signals,
    summary,
  }
}

/**
 * Checks reputation using SerpAPI (fallback)
 */
async function checkWithSerpAPI(author: Author): Promise<ReputationResult> {
  const authorName = author.name
  const query = `"${authorName}"${author.credentials ? ` ${author.credentials}` : ''}`

  // Call SerpAPI
  const response = await fetch(
    `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&num=10&api_key=${process.env.SERPAPI_KEY}`
  )

  if (!response.ok) {
    throw new Error(`SerpAPI failed: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  const results = data.organic_results || []

  // Convert SerpAPI results to common format
  const normalizedResults = results.map((r: any) => ({
    title: r.title,
    url: r.link,
    description: r.snippet,
  }))

  // Analyze search results
  const signals = analyzeSearchResults(normalizedResults, authorName)
  const reputationScore = calculateReputationScore(signals)
  const summary = generateReputationSummary(authorName, signals, reputationScore)

  return {
    authorName,
    reputationScore,
    signals,
    summary,
  }
}

/**
 * Analyzes search results to identify reputation signals
 */
function analyzeSearchResults(results: any[], authorName: string): ReputationSignal[] {
  const signals: ReputationSignal[] = []

  for (const result of results) {
    const url = result.url || result.link || ''
    const title = result.title || ''
    const description = result.description || result.snippet || ''
    const lowerUrl = url.toLowerCase()
    const lowerTitle = title.toLowerCase()
    const lowerDesc = description.toLowerCase()

    // Check for professional profiles
    if (lowerUrl.includes('linkedin.com/in/')) {
      signals.push({
        type: 'professional_profile',
        source: 'LinkedIn',
        url,
        authority: 'high',
        description: `LinkedIn profile found`,
      })
    } else if (lowerUrl.match(/\.(edu|ac\.uk|edu\.au)/)) {
      signals.push({
        type: 'professional_profile',
        source: 'Educational Institution',
        url,
        authority: 'high',
        description: `Profile at educational institution: ${extractDomain(url)}`,
      })
    } else if (
      lowerUrl.includes('researchgate.net') ||
      lowerUrl.includes('scholar.google.com') ||
      lowerUrl.includes('orcid.org')
    ) {
      signals.push({
        type: 'professional_profile',
        source: 'Research Platform',
        url,
        authority: 'high',
        description: `Research profile found on ${extractDomain(url)}`,
      })
    }

    // Check for media mentions
    const majorNewsOutlets = [
      'nytimes.com', 'wsj.com', 'washingtonpost.com', 'ft.com', 'bloomberg.com',
      'reuters.com', 'apnews.com', 'bbc.com', 'bbc.co.uk', 'theguardian.com',
      'forbes.com', 'fortune.com', 'economist.com', 'npr.org', 'pbs.org',
    ]

    for (const outlet of majorNewsOutlets) {
      if (lowerUrl.includes(outlet)) {
        signals.push({
          type: 'media_mention',
          source: extractDomain(url),
          url,
          authority: 'high',
          description: `Mentioned in ${extractDomain(url)}: ${title}`,
        })
        break
      }
    }

    // Check for publications/research
    if (
      lowerUrl.includes('pubmed') ||
      lowerUrl.includes('ncbi.nlm.nih.gov') ||
      lowerUrl.includes('nature.com') ||
      lowerUrl.includes('science.org') ||
      lowerUrl.includes('springer.com') ||
      lowerUrl.includes('sciencedirect.com')
    ) {
      signals.push({
        type: 'publication',
        source: extractDomain(url),
        url,
        authority: 'high',
        description: `Publication found: ${title}`,
      })
    }

    // Check for negative signals
    const negativeKeywords = [
      'scandal', 'retraction', 'fraud', 'misconduct', 'fired', 'resigned', 'lawsuit',
      'controversy', 'accused', 'investigation', 'suspended', 'disciplined',
    ]

    for (const keyword of negativeKeywords) {
      if (lowerTitle.includes(keyword) || lowerDesc.includes(keyword)) {
        signals.push({
          type: 'negative',
          source: extractDomain(url),
          url,
          authority: getSourceAuthority(url),
          description: `Potential negative signal: ${title}`,
        })
        break
      }
    }
  }

  return signals
}

/**
 * Calculates overall reputation score from signals
 */
function calculateReputationScore(signals: ReputationSignal[]): number {
  if (signals.length === 0) return 0

  let score = 0

  // Professional profiles (up to 40 points)
  const professionalProfiles = signals.filter(s => s.type === 'professional_profile')
  if (professionalProfiles.length > 0) {
    score += Math.min(40, professionalProfiles.length * 15)
  }

  // Media mentions (up to 30 points)
  const mediaMentions = signals.filter(s => s.type === 'media_mention')
  const highAuthorityMentions = mediaMentions.filter(s => s.authority === 'high').length
  if (highAuthorityMentions > 0) {
    score += Math.min(30, highAuthorityMentions * 15)
  } else if (mediaMentions.length > 0) {
    score += Math.min(15, mediaMentions.length * 5)
  }

  // Publications (up to 30 points)
  const publications = signals.filter(s => s.type === 'publication')
  if (publications.length > 0) {
    score += Math.min(30, publications.length * 10)
  }

  // Negative signals (deduct up to 40 points)
  const negativeSignals = signals.filter(s => s.type === 'negative')
  const highAuthorityNegatives = negativeSignals.filter(s => s.authority === 'high').length
  if (highAuthorityNegatives > 0) {
    score -= highAuthorityNegatives * 20 // Major negative signal
  } else if (negativeSignals.length > 0) {
    score -= negativeSignals.length * 10 // Minor negative signal
  }

  // Clamp between 0-100
  return Math.max(0, Math.min(100, score))
}

/**
 * Generates human-readable summary
 */
function generateReputationSummary(
  authorName: string,
  signals: ReputationSignal[],
  score: number
): string {
  if (signals.length === 0) {
    return `No significant web presence found for ${authorName}.`
  }

  const hasNegative = signals.some(s => s.type === 'negative')
  const profileCount = signals.filter(s => s.type === 'professional_profile').length
  const mentionCount = signals.filter(s => s.type === 'media_mention').length
  const pubCount = signals.filter(s => s.type === 'publication').length

  let summary = ''

  if (score >= 70) {
    summary = `${authorName} has a strong professional reputation`
  } else if (score >= 40) {
    summary = `${authorName} has a moderate professional presence`
  } else {
    summary = `${authorName} has limited professional presence`
  }

  const parts = []
  if (profileCount > 0) parts.push(`${profileCount} professional profile${profileCount > 1 ? 's' : ''}`)
  if (mentionCount > 0) parts.push(`${mentionCount} media mention${mentionCount > 1 ? 's' : ''}`)
  if (pubCount > 0) parts.push(`${pubCount} publication${pubCount > 1 ? 's' : ''}`)

  if (parts.length > 0) {
    summary += ` with ${parts.join(', ')}`
  }

  if (hasNegative) {
    summary += '. Warning: Negative signals detected'
  }

  return summary + '.'
}

/**
 * Determines source authority from URL
 */
function getSourceAuthority(url: string): 'high' | 'medium' | 'low' {
  const lowerUrl = url.toLowerCase()

  // High authority domains
  const highAuthority = [
    '.gov', '.edu', 'nytimes.com', 'wsj.com', 'washingtonpost.com',
    'reuters.com', 'apnews.com', 'bbc.com', 'bloomberg.com', 'nature.com',
    'science.org', 'pubmed', 'scholar.google.com', 'linkedin.com',
  ]

  for (const domain of highAuthority) {
    if (lowerUrl.includes(domain)) return 'high'
  }

  // Medium authority (established news/tech sites)
  const mediumAuthority = [
    'forbes.com', 'techcrunch.com', 'wired.com', 'arstechnica.com',
    'businessinsider.com', 'cnn.com', 'nbcnews.com', 'cbsnews.com',
  ]

  for (const domain of mediumAuthority) {
    if (lowerUrl.includes(domain)) return 'medium'
  }

  return 'low'
}

/**
 * Extracts clean domain name from URL
 */
function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.replace('www.', '')
  } catch {
    return url
  }
}

/**
 * Gets human-readable reputation quality description
 */
export function getReputationDescription(score: number): string {
  if (score >= 80) {
    return 'Excellent reputation with strong professional presence'
  } else if (score >= 60) {
    return 'Good reputation with verified professional credentials'
  } else if (score >= 40) {
    return 'Moderate reputation with some professional presence'
  } else if (score >= 20) {
    return 'Limited professional presence online'
  } else {
    return 'No significant professional reputation found'
  }
}
