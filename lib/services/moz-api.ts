/**
 * Moz API Service
 * Provides Domain Authority, Page Authority, and spam scores
 */

import crypto from 'crypto'
import { EEAT_CONFIG } from '../eeat-config'

const MOZ_ACCESS_ID = process.env.MOZ_ACCESS_ID
const MOZ_SECRET_KEY = process.env.MOZ_SECRET_KEY

export interface MozMetrics {
  domainAuthority: number
  pageAuthority: number
  spamScore: number
  linkingDomains: number
  externalLinks: number
  mozRank: number
  mozTrust: number
}

/**
 * Gets Moz URL metrics (DA, PA, spam score)
 */
export async function getMozMetrics(url: string): Promise<MozMetrics> {
  if (!MOZ_ACCESS_ID || !MOZ_SECRET_KEY) {
    console.warn('Moz API credentials not configured, returning mock data')
    return getMockMozMetrics()
  }

  try {
    const cleanUrl = normalizeUrl(url)

    // Moz Links API v2 - URL Metrics
    const endpoint = `${EEAT_CONFIG.moz.baseUrl}/url_metrics`

    // Generate authentication signature
    const expires = Math.floor(Date.now() / 1000) + 300 // 5 minutes from now
    const stringToSign = `${MOZ_ACCESS_ID}\n${expires}`
    const signature = crypto
      .createHmac('sha1', MOZ_SECRET_KEY)
      .update(stringToSign)
      .digest('base64')

    // Request body
    const body = {
      targets: [cleanUrl]
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${MOZ_ACCESS_ID}:${signature}`).toString('base64')}`,
        'moz-expires': expires.toString(),
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Moz API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()

    if (!data.results || data.results.length === 0) {
      throw new Error('No results from Moz API')
    }

    const metrics = data.results[0]

    return {
      domainAuthority: Math.round(metrics.domain_authority || 0),
      pageAuthority: Math.round(metrics.page_authority || 0),
      spamScore: Math.round((metrics.spam_score || 0) * 100), // Convert to percentage
      linkingDomains: metrics.linking_domains || 0,
      externalLinks: metrics.external_links || 0,
      mozRank: metrics.mozrank || 0,
      mozTrust: metrics.moztrust || 0,
    }
  } catch (error) {
    console.error('Moz API error:', error)
    return getMockMozMetrics()
  }
}

/**
 * Gets link metrics for a domain
 */
export async function getMozLinkMetrics(domain: string): Promise<{
  totalLinks: number
  followedLinks: number
  nofollowedLinks: number
  linkingDomains: number
}> {
  if (!MOZ_ACCESS_ID || !MOZ_SECRET_KEY) {
    return {
      totalLinks: 5000,
      followedLinks: 3500,
      nofollowedLinks: 1500,
      linkingDomains: 850,
    }
  }

  try {
    const cleanUrl = normalizeUrl(domain)

    // Moz Links API v2 - Link Metrics
    const endpoint = `${EEAT_CONFIG.moz.baseUrl}/link_metrics`

    // Generate authentication signature
    const expires = Math.floor(Date.now() / 1000) + 300
    const stringToSign = `${MOZ_ACCESS_ID}\n${expires}`
    const signature = crypto
      .createHmac('sha1', MOZ_SECRET_KEY)
      .update(stringToSign)
      .digest('base64')

    const body = {
      target: cleanUrl,
      scope: 'root_domain',
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${MOZ_ACCESS_ID}:${signature}`).toString('base64')}`,
        'moz-expires': expires.toString(),
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`Moz Link Metrics API error: ${response.status}`)
    }

    const data = await response.json()

    return {
      totalLinks: data.pages || 0,
      followedLinks: data.followed_pages || 0,
      nofollowedLinks: (data.pages || 0) - (data.followed_pages || 0),
      linkingDomains: data.linking_domains || 0,
    }
  } catch (error) {
    console.error('Moz Link Metrics API error:', error)
    return {
      totalLinks: 5000,
      followedLinks: 3500,
      nofollowedLinks: 1500,
      linkingDomains: 850,
    }
  }
}

/**
 * Normalizes URL for Moz API
 */
function normalizeUrl(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url
  }
  return url
}

/**
 * Returns mock Moz metrics for testing/fallback
 */
function getMockMozMetrics(): MozMetrics {
  return {
    domainAuthority: 65,
    pageAuthority: 58,
    spamScore: 5,
    linkingDomains: 850,
    externalLinks: 5000,
    mozRank: 5.5,
    mozTrust: 5.2,
  }
}
