/**
 * URL Analyzer Service
 * Crawls and analyzes web pages for E-E-A-T scoring
 */

import * as cheerio from 'cheerio'
import { EEAT_CONFIG } from '../eeat-config'
import {
  calculateCitationQuality,
  type CitationQualityResult,
} from './citation-quality-scorer'

export interface PageAnalysis {
  url: string
  finalUrl: string // URL after following redirects
  canonicalUrl: string | null // Canonical URL from <link rel="canonical">
  title: string
  metaDescription: string
  wordCount: number
  contentText: string // Full page text content for NLP analysis
  headings: {
    h1: string[]
    h2: string[]
    h3: string[]
  }
  hasSSL: boolean
  authors: Author[]
  schemaMarkup: SchemaMarkup[]
  images: {
    total: number
    withAlt: number
  }
  links: {
    internal: number
    external: number
  }
  citations: number
  citationQuality: CitationQualityResult | null
  readabilityScore: number
}

export interface Author {
  name: string
  credentials?: string
  source: 'schema' | 'meta' | 'content'
}

export interface SchemaMarkup {
  type: string
  data: any
}

/**
 * Fetches and analyzes a URL
 */
export async function analyzeURL(url: string): Promise<PageAnalysis> {
  // Validate and normalize URL
  const normalizedUrl = normalizeURL(url)

  // Fetch the page (follows redirects automatically)
  const { html, finalUrl } = await fetchPage(normalizedUrl)

  // Parse with Cheerio
  const $ = cheerio.load(html)

  // Extract canonical URL from HTML
  const canonicalUrl = extractCanonicalUrl($)

  // Extract all data
  // Extract citations and calculate quality
  const citationUrls = extractCitations($)
  const citationQuality = calculateCitationQuality(citationUrls)

  // Extract content text for NLP analysis
  const contentText = extractContentText($)

  const analysis: PageAnalysis = {
    url: normalizedUrl,
    finalUrl: finalUrl,
    canonicalUrl: canonicalUrl,
    title: extractTitle($),
    metaDescription: extractMetaDescription($),
    wordCount: countWords($),
    contentText: contentText, // Full text for NLP analysis
    headings: extractHeadings($),
    hasSSL: finalUrl.startsWith('https://'), // Use final URL for SSL check
    authors: extractAuthors($),
    schemaMarkup: extractSchemaMarkup($),
    images: analyzeImages($),
    links: analyzeLinks($, finalUrl), // Use final URL for link analysis
    citations: citationUrls.length, // Total count
    citationQuality: citationQuality, // Quality breakdown
    readabilityScore: calculateReadability($),
  }

  return analysis
}

/**
 * Normalizes a URL to ensure it's valid
 */
function normalizeURL(url: string): string {
  // Add protocol if missing
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url
  }

  // Remove trailing slash
  url = url.replace(/\/$/, '')

  return url
}

/**
 * Fetches HTML content from a URL, following redirects
 * Returns both the HTML and the final URL after redirects
 */
async function fetchPage(url: string): Promise<{ html: string, finalUrl: string }> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'CertREV E-E-A-T Analyzer/1.0 (https://certrev.com)',
      },
      redirect: 'follow', // Follow redirects automatically (up to 20 by default)
      signal: AbortSignal.timeout(15000), // 15 second timeout
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`)
    }

    const html = await response.text()
    const finalUrl = response.url // This contains the final URL after redirects

    return { html, finalUrl }
  } catch (err) {
    // Handle network errors
    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        throw new Error(`Failed to fetch ${url}: timeout - The website took too long to respond`)
      } else if (err.message.includes('fetch failed') || err.message.includes('ENOTFOUND')) {
        throw new Error(`Failed to fetch ${url}: Unable to connect - Check if the domain is correct`)
      }
    }
    throw err
  }
}

/**
 * Extracts page title
 */
function extractTitle($: cheerio.CheerioAPI): string {
  return $('title').text().trim() || $('h1').first().text().trim() || ''
}

/**
 * Extracts meta description
 */
function extractMetaDescription($: cheerio.CheerioAPI): string {
  return $('meta[name="description"]').attr('content') || ''
}

/**
 * Extracts canonical URL from HTML
 */
function extractCanonicalUrl($: cheerio.CheerioAPI): string | null {
  const canonical = $('link[rel="canonical"]').attr('href')
  return canonical || null
}

/**
 * Gets the authoritative domain for a page
 * Priority: canonical URL > final URL after redirects > original URL
 */
export function getAuthoritativeDomain(analysis: PageAnalysis): string {
  // Try canonical URL first
  if (analysis.canonicalUrl) {
    try {
      const url = new URL(analysis.canonicalUrl)
      return url.hostname.replace('www.', '')
    } catch {
      // Invalid canonical URL, fall through
    }
  }

  // Try final URL after redirects
  try {
    const url = new URL(analysis.finalUrl)
    return url.hostname.replace('www.', '')
  } catch {
    // Fall back to original URL
    try {
      const url = new URL(analysis.url)
      return url.hostname.replace('www.', '')
    } catch {
      // Last resort: return the URL as-is
      return analysis.url.replace('www.', '').split('/')[0]
    }
  }
}

/**
 * Extracts main content text for NLP analysis
 */
function extractContentText($: cheerio.CheerioAPI): string {
  // Clone the DOM to avoid modifying the original
  const $clone = cheerio.load($.html())

  // Remove non-content elements
  $clone('script, style, nav, header, footer, aside, .menu, .navigation, .sidebar').remove()

  // Get text from main content areas
  let text = ''

  // Try to find main content container first
  const mainContent = $clone('main, article, [role="main"], .content, .post-content').first()
  if (mainContent.length > 0) {
    text = mainContent.text()
  } else {
    // Fall back to body text
    text = $clone('body').text()
  }

  // Clean up whitespace
  text = text.replace(/\s+/g, ' ').trim()

  return text
}

/**
 * Counts words in main content
 */
function countWords($: cheerio.CheerioAPI): number {
  // Remove script and style tags
  $('script, style, nav, header, footer').remove()

  // Get text content
  const text = $('body').text()

  // Count words
  const words = text.trim().split(/\s+/).filter(word => word.length > 0)
  return words.length
}

/**
 * Extracts all headings
 */
function extractHeadings($: cheerio.CheerioAPI): PageAnalysis['headings'] {
  return {
    h1: $('h1').map((_, el) => $(el).text().trim()).get(),
    h2: $('h2').map((_, el) => $(el).text().trim()).get(),
    h3: $('h3').map((_, el) => $(el).text().trim()).get(),
  }
}

/**
 * Extracts author information from various sources
 */
function extractAuthors($: cheerio.CheerioAPI): Author[] {
  const authors: Author[] = []

  // Check schema markup for author
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const schema = JSON.parse($(el).html() || '{}')
      const author = extractAuthorFromSchema(schema)
      if (author) authors.push(author)
    } catch (e) {
      // Invalid JSON, skip
    }
  })

  // Check meta tags
  const metaAuthor = $('meta[name="author"]').attr('content')
  if (metaAuthor && !authors.some(a => a.name === metaAuthor)) {
    authors.push({
      name: metaAuthor,
      source: 'meta'
    })
  }

  // Check common author patterns in content
  // More strict patterns to avoid false positives
  const bylinePatterns = [
    /(?:^|\n|\.\s+)(?:By|Written by|Author:)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)(?:\s|,|\.|$)/,
  ]

  const bodyText = $('body').text()
  for (const pattern of bylinePatterns) {
    const match = bodyText.match(pattern)
    if (match && match[1]) {
      const authorName = match[1].trim()
      // Validate it's a reasonable author name (2-4 words, not common false positives)
      const words = authorName.split(/\s+/)
      const invalidNames = ['talking to', 'according to', 'listen to', 'subscribe to', 'related to']

      if (words.length >= 2 && words.length <= 4 &&
          !invalidNames.some(invalid => authorName.toLowerCase().includes(invalid)) &&
          !authors.some(a => a.name === authorName)) {
        authors.push({
          name: authorName,
          source: 'content'
        })
        break // Only take first match
      }
    }
  }

  return authors
}

/**
 * Extracts author from schema markup
 */
function extractAuthorFromSchema(schema: any): Author | null {
  if (!schema) return null

  // Handle arrays
  if (Array.isArray(schema)) {
    for (const item of schema) {
      const author = extractAuthorFromSchema(item)
      if (author) return author
    }
    return null
  }

  // Check for author property
  if (schema.author) {
    const author = schema.author
    if (typeof author === 'string') {
      return { name: author, source: 'schema' }
    }
    if (author.name) {
      return {
        name: author.name,
        credentials: author.jobTitle || author.description,
        source: 'schema'
      }
    }
  }

  return null
}

/**
 * Extracts all schema markup from the page
 */
function extractSchemaMarkup($: cheerio.CheerioAPI): SchemaMarkup[] {
  const schemas: SchemaMarkup[] = []

  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).html() || '{}')
      const type = data['@type'] || (Array.isArray(data) && data[0]?.['@type'])

      if (type) {
        schemas.push({ type, data })
      }
    } catch (e) {
      // Invalid JSON, skip
    }
  })

  return schemas
}

/**
 * Analyzes images on the page
 */
function analyzeImages($: cheerio.CheerioAPI): PageAnalysis['images'] {
  const images = $('img')
  const total = images.length
  const withAlt = images.filter((_, el) => {
    const alt = $(el).attr('alt')
    return alt !== undefined && alt !== ''
  }).length

  return { total, withAlt }
}

/**
 * Analyzes links on the page
 */
function analyzeLinks($: cheerio.CheerioAPI, baseUrl: string): PageAnalysis['links'] {
  const links = $('a[href]')
  const domain = new URL(baseUrl).hostname

  let internal = 0
  let external = 0

  links.each((_, el) => {
    const href = $(el).attr('href')
    if (!href) return

    try {
      if (href.startsWith('/') || href.includes(domain)) {
        internal++
      } else if (href.startsWith('http')) {
        external++
      }
    } catch (e) {
      // Invalid URL, skip
    }
  })

  return { internal, external }
}

/**
 * Extracts citations/references from the content
 * Returns array of citation URLs/domains for quality analysis
 */
function extractCitations($: cheerio.CheerioAPI): string[] {
  const citations: string[] = []

  // Superscript references with links
  $('sup a[href]').each((_, el) => {
    const href = $(el).attr('href') || ''
    if (href && href.startsWith('http')) {
      citations.push(href)
    }
  })

  // All external links (potential citations)
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || ''
    if (href && href.startsWith('http')) {
      // Avoid duplicates and internal links
      if (!citations.includes(href)) {
        citations.push(href)
      }
    }
  })

  return citations
}

/**
 * Calculates readability score (simplified Flesch-Kincaid)
 */
function calculateReadability($: cheerio.CheerioAPI): number {
  // Remove non-content elements
  $('script, style, nav, header, footer').remove()

  const text = $('body').text()
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const words = text.split(/\s+/).filter(w => w.length > 0)
  const syllables = words.reduce((sum, word) => sum + countSyllables(word), 0)

  if (sentences.length === 0 || words.length === 0) return 0

  // Flesch Reading Ease formula
  const score = 206.835 - 1.015 * (words.length / sentences.length) - 84.6 * (syllables / words.length)

  // Return score clamped between 0-100
  return Math.max(0, Math.min(100, Math.round(score)))
}

/**
 * Counts syllables in a word (simplified)
 */
function countSyllables(word: string): number {
  word = word.toLowerCase()
  if (word.length <= 3) return 1

  const vowels = 'aeiouy'
  let count = 0
  let previousWasVowel = false

  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i])
    if (isVowel && !previousWasVowel) {
      count++
    }
    previousWasVowel = isVowel
  }

  // Adjust for silent 'e'
  if (word.endsWith('e')) count--

  return Math.max(1, count)
}
