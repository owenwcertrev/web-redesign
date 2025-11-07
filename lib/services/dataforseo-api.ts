/**
 * DataForSEO API Service
 * Provides domain authority, backlinks, organic traffic, and spam score metrics
 * Cost: ~$0.04-0.06 per analysis (vs $0.52 with Semrush+Moz)
 */

import { EEAT_CONFIG } from '../eeat-config'

const DATAFORSEO_LOGIN = process.env.DATAFORSEO_LOGIN
const DATAFORSEO_PASSWORD = process.env.DATAFORSEO_PASSWORD

export interface DataForSEOMetrics {
  domainRank: number // 0-100 scale (converted from 0-1000)
  pageRank: number // 0-100 scale
  backlinks: number
  referringDomains: number
  referringMainDomains: number
  followedBacklinks: number
  nofollowedBacklinks: number
  govBacklinks: number
  eduBacklinks: number
  spamScore: number // 0-100%
  organicKeywords: number
  organicTraffic: number
  organicTrafficValue: number
}

/**
 * Gets comprehensive domain metrics from DataForSEO
 * Combines backlinks summary + domain overview data
 */
export async function getDataForSEOMetrics(url: string): Promise<DataForSEOMetrics> {
  if (!DATAFORSEO_LOGIN || !DATAFORSEO_PASSWORD) {
    console.warn('DataForSEO credentials not configured, returning mock data')
    return getMockMetrics()
  }

  try {
    const cleanUrl = normalizeUrl(url)
    const domain = extractDomain(cleanUrl)

    // Run both API calls in parallel for speed
    const [backlinkData, domainData] = await Promise.all([
      getBacklinksSummary(domain),
      getDomainOverview(domain),
    ])

    return {
      // Authority scores (converted to 0-100 scale)
      domainRank: backlinkData.rank || 0,
      pageRank: backlinkData.pageRank || 0,

      // Backlink metrics
      backlinks: backlinkData.backlinks || 0,
      referringDomains: backlinkData.referringDomains || 0,
      referringMainDomains: backlinkData.referringMainDomains || 0,
      followedBacklinks: backlinkData.followedBacklinks || 0,
      nofollowedBacklinks: backlinkData.nofollowedBacklinks || 0,
      govBacklinks: backlinkData.govBacklinks || 0,
      eduBacklinks: backlinkData.eduBacklinks || 0,

      // Trust metrics
      spamScore: backlinkData.spamScore || 0,

      // Organic metrics
      organicKeywords: domainData.organicKeywords || 0,
      organicTraffic: domainData.organicTraffic || 0,
      organicTrafficValue: domainData.organicTrafficValue || 0,
    }
  } catch (error) {
    console.error('DataForSEO API error:', error)
    return getMockMetrics()
  }
}

/**
 * Gets backlinks summary data
 * Cost: $0.02 per request
 */
async function getBacklinksSummary(domain: string): Promise<any> {
  const url = EEAT_CONFIG.dataforseo.baseUrl + EEAT_CONFIG.dataforseo.endpoints.backlinksSummary

  const requestBody = [
    {
      target: domain,
      include_subdomains: false,
      backlinks_status_type: 'live',
      internal_list_limit: 10,
      // Request rank as 0-100 scale
      rank_scale: 'one_hundred',
    }
  ]

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${DATAFORSEO_LOGIN}:${DATAFORSEO_PASSWORD}`).toString('base64'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`DataForSEO Backlinks API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()

  if (data.status_code !== 20000) {
    throw new Error(`DataForSEO API error: ${data.status_message}`)
  }

  const result = data.tasks[0]?.result?.[0]

  if (!result) {
    return {}
  }

  // Extract TLD-specific backlink counts
  const tldBreakdown = result.referring_domains_tld || {}
  const govBacklinks = tldBreakdown['.gov'] || 0
  const eduBacklinks = tldBreakdown['.edu'] || 0

  return {
    rank: Math.round(result.rank || 0),
    pageRank: Math.round(result.page_rank || 0),
    backlinks: result.backlinks || 0,
    referringDomains: result.referring_domains || 0,
    referringMainDomains: result.referring_main_domains || 0,
    followedBacklinks: result.backlinks_dofollow || 0,
    nofollowedBacklinks: result.backlinks_nofollow || 0,
    govBacklinks,
    eduBacklinks,
    spamScore: Math.round((result.rank_absolute || 0) * 100), // Convert 0-1 to 0-100
  }
}

/**
 * Gets domain overview data (organic traffic, keywords)
 * Cost: ~$0.02 per request
 */
async function getDomainOverview(domain: string): Promise<any> {
  const url = EEAT_CONFIG.dataforseo.baseUrl + EEAT_CONFIG.dataforseo.endpoints.domainOverview

  const requestBody = [
    {
      target: domain,
      location_code: 2840, // USA
      language_code: 'en',
      include_clickstream_data: false, // Set to true to get more accurate data (costs 2x)
    }
  ]

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${DATAFORSEO_LOGIN}:${DATAFORSEO_PASSWORD}`).toString('base64'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`DataForSEO Domain Overview API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()

  if (data.status_code !== 20000) {
    throw new Error(`DataForSEO API error: ${data.status_message}`)
  }

  const result = data.tasks[0]?.result?.[0]?.metrics

  if (!result) {
    return {}
  }

  return {
    organicKeywords: result.organic?.count || 0,
    organicTraffic: result.organic?.etv || 0, // Estimated traffic value
    organicTrafficValue: result.organic?.estimated_paid_traffic_cost || 0,
  }
}

/**
 * Bulk check spam scores for multiple domains
 * Cost: $0.02 per request (can check up to 1,000 domains at once)
 */
export async function getBulkSpamScores(domains: string[]): Promise<Record<string, number>> {
  if (!DATAFORSEO_LOGIN || !DATAFORSEO_PASSWORD) {
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
      'Authorization': 'Basic ' + Buffer.from(`${DATAFORSEO_LOGIN}:${DATAFORSEO_PASSWORD}`).toString('base64'),
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
  if (!DATAFORSEO_LOGIN || !DATAFORSEO_PASSWORD) {
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
      'Authorization': 'Basic ' + Buffer.from(`${DATAFORSEO_LOGIN}:${DATAFORSEO_PASSWORD}`).toString('base64'),
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
 * Returns mock metrics for testing/fallback
 */
function getMockMetrics(): DataForSEOMetrics {
  return {
    domainRank: 65,
    pageRank: 58,
    backlinks: 12500,
    referringDomains: 850,
    referringMainDomains: 780,
    followedBacklinks: 8500,
    nofollowedBacklinks: 4000,
    govBacklinks: 15,
    eduBacklinks: 25,
    spamScore: 5,
    organicKeywords: 2500,
    organicTraffic: 15000,
    organicTrafficValue: 8500,
  }
}
