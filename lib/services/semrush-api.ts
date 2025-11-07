/**
 * Semrush API Service
 * Provides domain authority, backlinks, and SEO metrics
 */

import { EEAT_CONFIG } from '../eeat-config'

const API_KEY = process.env.SEMRUSH_API_KEY

export interface SemrushDomainMetrics {
  domainRank: number
  organicKeywords: number
  organicTraffic: number
  organicCost: number
  backlinks: number
  referringDomains: number
  authorityScore: number
}

export interface SemrushBacklinkData {
  total: number
  follow: number
  nofollow: number
  government: number
  educational: number
  domains: number
}

/**
 * Gets domain overview metrics from Semrush
 */
export async function getDomainMetrics(domain: string): Promise<SemrushDomainMetrics> {
  if (!API_KEY) {
    console.warn('SEMRUSH_API_KEY not configured, returning mock data')
    return getMockDomainMetrics()
  }

  try {
    const cleanDomain = extractDomain(domain)

    // Semrush Domain Analytics API
    const url = `${EEAT_CONFIG.semrush.baseUrl}/?type=domain_ranks&key=${API_KEY}&export_columns=Dn,Rk,Or,Ot,Oc,Adv,At,Ac&domain=${cleanDomain}&database=${EEAT_CONFIG.semrush.database}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Semrush API error: ${response.status}`)
    }

    const text = await response.text()
    const data = parseSemrushCSV(text)

    // Get backlinks separately
    const backlinks = await getBacklinkMetrics(cleanDomain)

    return {
      domainRank: data.rank || 0,
      organicKeywords: data.organicKeywords || 0,
      organicTraffic: data.organicTraffic || 0,
      organicCost: data.organicCost || 0,
      backlinks: backlinks.total,
      referringDomains: backlinks.domains,
      // Semrush doesn't have a direct "authority score" in this API
      // We'll calculate it based on other metrics
      authorityScore: calculateAuthorityScore(data, backlinks),
    }
  } catch (error) {
    console.error('Semrush API error:', error)
    return getMockDomainMetrics()
  }
}

/**
 * Gets backlink metrics from Semrush
 */
export async function getBacklinkMetrics(domain: string): Promise<SemrushBacklinkData> {
  if (!API_KEY) {
    return getMockBacklinkData()
  }

  try {
    const cleanDomain = extractDomain(domain)

    // Semrush Backlinks API - Overview
    const url = `${EEAT_CONFIG.semrush.baseUrl}/?type=backlinks_overview&key=${API_KEY}&target=${cleanDomain}&target_type=root_domain&export_columns=total,domains_num,urls_num,ips_num,ipclassc_num,follows_num,nofollows_num,govs_num,edus_num`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Semrush Backlinks API error: ${response.status}`)
    }

    const text = await response.text()
    const data = parseBacklinksCSV(text)

    return {
      total: data.total || 0,
      follow: data.follow || 0,
      nofollow: data.nofollow || 0,
      government: data.government || 0,
      educational: data.educational || 0,
      domains: data.domains || 0,
    }
  } catch (error) {
    console.error('Semrush Backlinks API error:', error)
    return getMockBacklinkData()
  }
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
 * Parses Semrush CSV response into object
 */
function parseSemrushCSV(csv: string): any {
  const lines = csv.trim().split('\n')
  if (lines.length < 2) return {}

  const headers = lines[0].split(';')
  const values = lines[1].split(';')

  const data: any = {}

  headers.forEach((header, index) => {
    const key = header.trim()
    const value = values[index]?.trim()

    switch (key) {
      case 'Rk':
        data.rank = parseInt(value) || 0
        break
      case 'Or':
        data.organicKeywords = parseInt(value) || 0
        break
      case 'Ot':
        data.organicTraffic = parseInt(value) || 0
        break
      case 'Oc':
        data.organicCost = parseFloat(value) || 0
        break
    }
  })

  return data
}

/**
 * Parses backlinks CSV response
 */
function parseBacklinksCSV(csv: string): any {
  const lines = csv.trim().split('\n')
  if (lines.length < 2) return {}

  const headers = lines[0].split('\t')
  const values = lines[1].split('\t')

  const data: any = {}

  headers.forEach((header, index) => {
    const key = header.trim()
    const value = values[index]?.trim()

    switch (key) {
      case 'total':
        data.total = parseInt(value) || 0
        break
      case 'domains_num':
        data.domains = parseInt(value) || 0
        break
      case 'follows_num':
        data.follow = parseInt(value) || 0
        break
      case 'nofollows_num':
        data.nofollow = parseInt(value) || 0
        break
      case 'govs_num':
        data.government = parseInt(value) || 0
        break
      case 'edus_num':
        data.educational = parseInt(value) || 0
        break
    }
  })

  return data
}

/**
 * Calculates an authority score (0-100) based on Semrush metrics
 */
function calculateAuthorityScore(domainData: any, backlinkData: SemrushBacklinkData): number {
  let score = 0

  // Organic keywords (up to 25 points)
  if (domainData.organicKeywords > 100000) score += 25
  else if (domainData.organicKeywords > 50000) score += 20
  else if (domainData.organicKeywords > 10000) score += 15
  else if (domainData.organicKeywords > 1000) score += 10
  else if (domainData.organicKeywords > 100) score += 5

  // Organic traffic (up to 25 points)
  if (domainData.organicTraffic > 1000000) score += 25
  else if (domainData.organicTraffic > 500000) score += 20
  else if (domainData.organicTraffic > 100000) score += 15
  else if (domainData.organicTraffic > 10000) score += 10
  else if (domainData.organicTraffic > 1000) score += 5

  // Backlinks (up to 25 points)
  if (backlinkData.total > 1000000) score += 25
  else if (backlinkData.total > 100000) score += 20
  else if (backlinkData.total > 10000) score += 15
  else if (backlinkData.total > 1000) score += 10
  else if (backlinkData.total > 100) score += 5

  // Referring domains (up to 25 points)
  if (backlinkData.domains > 10000) score += 25
  else if (backlinkData.domains > 5000) score += 20
  else if (backlinkData.domains > 1000) score += 15
  else if (backlinkData.domains > 100) score += 10
  else if (backlinkData.domains > 10) score += 5

  // Bonus for .gov and .edu backlinks (up to 10 points)
  const authoritativeLinks = backlinkData.government + backlinkData.educational
  if (authoritativeLinks > 100) score += 10
  else if (authoritativeLinks > 50) score += 7
  else if (authoritativeLinks > 10) score += 5
  else if (authoritativeLinks > 0) score += 2

  return Math.min(100, score)
}

/**
 * Returns mock data for testing/fallback
 */
function getMockDomainMetrics(): SemrushDomainMetrics {
  return {
    domainRank: 1250000,
    organicKeywords: 2500,
    organicTraffic: 15000,
    organicCost: 8500,
    backlinks: 12500,
    referringDomains: 850,
    authorityScore: 65,
  }
}

/**
 * Returns mock backlink data for testing/fallback
 */
function getMockBacklinkData(): SemrushBacklinkData {
  return {
    total: 12500,
    follow: 8500,
    nofollow: 4000,
    government: 15,
    educational: 25,
    domains: 850,
  }
}
