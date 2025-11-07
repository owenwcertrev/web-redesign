/**
 * URL Analyzer Service
 * Crawls and analyzes web pages for E-E-A-T scoring
 */

import * as cheerio from 'cheerio'
import { EEAT_CONFIG } from '../eeat-config'

export interface PageAnalysis {
  url: string
  title: string
  metaDescription: string
  wordCount: number
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

  // Fetch the page
  const html = await fetchPage(normalizedUrl)

  // Parse with Cheerio
  const $ = cheerio.load(html)

  // Extract all data
  const analysis: PageAnalysis = {
    url: normalizedUrl,
    title: extractTitle($),
    metaDescription: extractMetaDescription($),
    wordCount: countWords($),
    headings: extractHeadings($),
    hasSSL: normalizedUrl.startsWith('https://'),
    authors: extractAuthors($),
    schemaMarkup: extractSchemaMarkup($),
    images: analyzeImages($),
    links: analyzeLinks($, normalizedUrl),
    citations: countCitations($),
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
 * Fetches HTML content from a URL
 */
async function fetchPage(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'CertREV E-E-A-T Analyzer/1.0 (https://certrev.com)',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`)
  }

  return await response.text()
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
  const bylinePatterns = [
    /by\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/i,
    /written by\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/i,
    /author:\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/i,
  ]

  const bodyText = $('body').text()
  for (const pattern of bylinePatterns) {
    const match = bodyText.match(pattern)
    if (match && match[1] && !authors.some(a => a.name === match[1])) {
      authors.push({
        name: match[1],
        source: 'content'
      })
      break // Only take first match
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
  const withAlt = images.filter((_, el) => $(el).attr('alt')).length

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
 * Counts citations/references in the content
 */
function countCitations($: cheerio.CheerioAPI): number {
  // Look for common citation patterns
  let count = 0

  // Superscript references
  count += $('sup a').length

  // Numbered references like [1], [2]
  const text = $('body').text()
  const numberedRefs = text.match(/\[\d+\]/g)
  if (numberedRefs) count += numberedRefs.length

  // Links to authoritative domains
  const authoritativeDomains = [
    '.gov',
    '.edu',
    'nih.gov',
    'cdc.gov',
    'who.int',
    'ncbi.nlm.nih.gov',
    'pubmed',
  ]

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || ''
    if (authoritativeDomains.some(domain => href.includes(domain))) {
      count++
    }
  })

  return count
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
