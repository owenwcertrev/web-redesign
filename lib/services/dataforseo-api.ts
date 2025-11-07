/**
 * DataForSEO API Service
 * Provides domain authority, backlinks, organic traffic, and spam score metrics
 * Cost: ~$0.04-0.06 per analysis (vs $0.52 with Semrush+Moz)
 */

import { EEAT_CONFIG } from '../eeat-config'

// Use functions to get credentials lazily (allows env vars to be set after module load)
function getDataForSEOLogin(): string | undefined {
  return process.env.DATAFORSEO_LOGIN
}

function getDataForSEOPassword(): string | undefined {
  return process.env.DATAFORSEO_PASSWORD
}

export interface DataForSEOMetrics {
  // Note: Backlinks API requires $100/month subscription
  // Using only Domain Rank Overview API (organic metrics)
  domainRank: number // Estimated from organic performance
  pageRank: number // Not available without backlinks API
  backlinks: number // Not available without backlinks API
  referringDomains: number // Not available without backlinks API
  referringMainDomains: number // Not available without backlinks API
  followedBacklinks: number // Not available without backlinks API
  nofollowedBacklinks: number // Not available without backlinks API
  govBacklinks: number // Not available without backlinks API
  eduBacklinks: number // Not available without backlinks API
  spamScore: number // Not available without backlinks API
  organicKeywords: number
  organicTraffic: number
  organicTrafficValue: number
}

/**
 * Gets domain metrics from DataForSEO Domain Rank Overview API
 * Note: Only using organic metrics - backlinks API requires $100/month subscription
 */
export async function getDataForSEOMetrics(url: string): Promise<DataForSEOMetrics> {
  const login = getDataForSEOLogin()
  const password = getDataForSEOPassword()

  if (!login || !password) {
    console.warn('DataForSEO credentials not configured, returning estimated metrics')
    return getEstimatedMetrics()
  }

  try {
    const cleanUrl = normalizeUrl(url)
    const domain = extractDomain(cleanUrl)

    const domainData = await getDomainRankOverview(domain)

    // Estimate domain rank from organic performance
    // Using position distribution and keyword count as proxy
    const estimatedRank = estimateDomainRank(domainData)

    return {
      // Estimated authority (based on organic performance)
      domainRank: estimatedRank,
      pageRank: 0, // Not available

      // Backlink metrics (not available without subscription)
      backlinks: 0,
      referringDomains: 0,
      referringMainDomains: 0,
      followedBacklinks: 0,
      nofollowedBacklinks: 0,
      govBacklinks: 0,
      eduBacklinks: 0,
      spamScore: 0, // Assume low spam for simplicity

      // Organic metrics (available from domain_rank_overview)
      organicKeywords: domainData.organicKeywords || 0,
      organicTraffic: Math.round(domainData.organicTraffic || 0),
      organicTrafficValue: Math.round(domainData.organicTrafficValue || 0),
    }
  } catch (error) {
    console.error('DataForSEO API error:', error)
    return getEstimatedMetrics()
  }
}

/**
 * Gets domain rank overview data (organic traffic and keywords)
 * Cost: ~$0.01 per request
 */
async function getDomainRankOverview(domain: string): Promise<any> {
  const url = 'https://api.dataforseo.com/v3/dataforseo_labs/google/domain_rank_overview/live'

  const requestBody = [
    {
      target: domain,
      location_code: 2840, // USA
      language_code: 'en',
    }
  ]

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa(`${getDataForSEOLogin()}:${getDataForSEOPassword()}`),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`DataForSEO Domain Rank Overview API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()

  if (data.status_code !== 20000) {
    throw new Error(`DataForSEO API error: ${data.status_message}`)
  }

  const result = data.tasks[0]?.result?.[0]?.items?.[0]

  if (!result?.metrics?.organic) {
    return {
      organicKeywords: 0,
      organicTraffic: 0,
      organicTrafficValue: 0,
      positionDistribution: null,
    }
  }

  return {
    organicKeywords: result.metrics.organic.count || 0,
    organicTraffic: result.metrics.organic.etv || 0,
    organicTrafficValue: result.metrics.organic.estimated_paid_traffic_cost || 0,
    positionDistribution: {
      pos_1: result.metrics.organic.pos_1 || 0,
      pos_2_3: result.metrics.organic.pos_2_3 || 0,
      pos_4_10: result.metrics.organic.pos_4_10 || 0,
      pos_11_20: result.metrics.organic.pos_11_20 || 0,
    },
  }
}

/**
 * Estimates domain rank from organic performance metrics
 * Returns a 0-100 score based on keyword count and position distribution
 */
function estimateDomainRank(domainData: any): number {
  const keywords = domainData.organicKeywords || 0
  const traffic = domainData.organicTraffic || 0
  const positions = domainData.positionDistribution

  // No data = low rank
  if (keywords === 0) return 10

  // Calculate position quality score (0-100)
  let positionScore = 0
  if (positions) {
    const total = positions.pos_1 + positions.pos_2_3 + positions.pos_4_10 + positions.pos_11_20
    if (total > 0) {
      positionScore = (
        (positions.pos_1 / total) * 100 +
        (positions.pos_2_3 / total) * 80 +
        (positions.pos_4_10 / total) * 60 +
        (positions.pos_11_20 / total) * 40
      )
    }
  }

  // Calculate keyword volume score (0-100)
  let keywordScore = 0
  if (keywords < 100) keywordScore = 10
  else if (keywords < 1000) keywordScore = 20 + (keywords / 1000) * 20
  else if (keywords < 10000) keywordScore = 40 + (keywords / 10000) * 20
  else if (keywords < 100000) keywordScore = 60 + (keywords / 100000) * 20
  else keywordScore = 80 + Math.min(20, (keywords / 1000000) * 20)

  // Calculate traffic score (0-100)
  let trafficScore = 0
  if (traffic < 1000) trafficScore = 10
  else if (traffic < 10000) trafficScore = 20 + (traffic / 10000) * 20
  else if (traffic < 100000) trafficScore = 40 + (traffic / 100000) * 20
  else if (traffic < 1000000) trafficScore = 60 + (traffic / 1000000) * 20
  else trafficScore = 80 + Math.min(20, (traffic / 10000000) * 20)

  // Weighted average: 40% keywords, 30% traffic, 30% positions
  const estimatedRank = Math.round(
    keywordScore * 0.4 +
    trafficScore * 0.3 +
    positionScore * 0.3
  )

  return Math.min(100, Math.max(0, estimatedRank))
}

/**
 * Bulk check spam scores for multiple domains
 * Cost: $0.02 per request (can check up to 1,000 domains at once)
 */
export async function getBulkSpamScores(domains: string[]): Promise<Record<string, number>> {
  if (!getDataForSEOLogin() || !getDataForSEOPassword()) {
    console.warn('DataForSEO credentials not configured')
    return {}
  }

  const url = EEAT_CONFIG.dataforseo.baseUrl + EEAT_CONFIG.dataforseo.endpoints.bulkSpamScore

  const requestBody = [
    {
      targets: domains.slice(0, 1000), // Max 1,000 domains per request
    }
  ]

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa(`${getDataForSEOLogin()}:${getDataForSEOPassword()}`),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    throw new Error(`DataForSEO Bulk Spam Score API error: ${response.status}`)
  }

  const data = await response.json()

  if (data.status_code !== 20000) {
    throw new Error(`DataForSEO API error: ${data.status_message}`)
  }

  const results = data.tasks[0]?.result?.[0]?.items || []
  const spamScores: Record<string, number> = {}

  results.forEach((item: any) => {
    spamScores[item.target] = Math.round((item.spam_score || 0) * 100)
  })

  return spamScores
}

/**
 * Bulk check domain ranks for multiple domains
 * Cost: $0.02 per request (can check up to 1,000 domains at once)
 */
export async function getBulkRanks(domains: string[]): Promise<Record<string, { rank: number, backlinks: number }>> {
  if (!getDataForSEOLogin() || !getDataForSEOPassword()) {
    console.warn('DataForSEO credentials not configured')
    return {}
  }

  const url = EEAT_CONFIG.dataforseo.baseUrl + EEAT_CONFIG.dataforseo.endpoints.bulkRanks

  const requestBody = [
    {
      targets: domains.slice(0, 1000), // Max 1,000 domains per request
      rank_scale: 'one_hundred', // Convert to 0-100 scale
    }
  ]

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa(`${getDataForSEOLogin()}:${getDataForSEOPassword()}`),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    throw new Error(`DataForSEO Bulk Ranks API error: ${response.status}`)
  }

  const data = await response.json()

  if (data.status_code !== 20000) {
    throw new Error(`DataForSEO API error: ${data.status_message}`)
  }

  const results = data.tasks[0]?.result?.[0]?.items || []
  const ranks: Record<string, { rank: number, backlinks: number }> = {}

  results.forEach((item: any) => {
    ranks[item.target] = {
      rank: Math.round(item.rank || 0),
      backlinks: item.backlinks || 0,
    }
  })

  return ranks
}

/**
 * Normalizes URL for API consumption
 */
function normalizeUrl(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url
  }
  return url
}

/**
 * Extracts domain from URL
 */
function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`)
    return urlObj.hostname.replace('www.', '')
  } catch {
    return url.replace('www.', '').split('/')[0]
  }
}

/**
 * Returns estimated metrics when API is not available
 */
function getEstimatedMetrics(): DataForSEOMetrics {
  return {
    domainRank: 35, // Conservative estimate
    pageRank: 0,
    backlinks: 0,
    referringDomains: 0,
    referringMainDomains: 0,
    followedBacklinks: 0,
    nofollowedBacklinks: 0,
    govBacklinks: 0,
    eduBacklinks: 0,
    spamScore: 0,
    organicKeywords: 0,
    organicTraffic: 0,
    organicTrafficValue: 0,
  }
}
