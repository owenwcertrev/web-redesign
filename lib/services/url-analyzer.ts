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
  url?: string
  photo?: string
  source: 'schema' | 'meta' | 'content' | 'rel-author' | 'html-class' | 'javascript'
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

  // Re-parse HTML for author extraction (workaround for script tag disappearing issue)
  const $fresh = cheerio.load(html)

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
    authors: extractAuthors($fresh), // Use fresh parse to preserve scripts
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
      const schemaAuthors = extractAuthorsFromSchema(schema)
      // Add all found authors, avoiding duplicates
      schemaAuthors.forEach(author => {
        if (!authors.some(a => a.name === author.name)) {
          authors.push(author)
        }
      })
      if (schemaAuthors.length > 0) {
        console.log('[extractAuthors] Found from schema:', schemaAuthors)
      }
    } catch (e) {
      // Invalid JSON, skip
    }
  })

  // Check meta tags (support both name="author" and name="article:author")
  const metaAuthor = $('meta[name="author"]').attr('content') || $('meta[name="article:author"]').attr('content')
  if (metaAuthor && !authors.some(a => a.name === metaAuthor)) {
    authors.push({
      name: metaAuthor,
      source: 'meta'
    })
    console.log('[extractAuthors] Found from meta tag:', metaAuthor)
  }

  // Check rel="author" links
  $('a[rel="author"], a[rel="author nofollow"]').each((_, el) => {
    const authorName = $(el).text().trim()
    if (authorName && !authors.some(a => a.name === authorName)) {
      authors.push({
        name: authorName,
        source: 'rel-author'
      })
    }
  })

  // Check common author class/id selectors
  const authorSelectors = [
    '.author-name',
    '.byline',
    '.by-author',
    '.post-author',
    '.article-author',
    '[itemprop="author"]',
    '[itemprop="author"] [itemprop="name"]',
    '.author .name',
    '.author-bio .name'
  ]

  for (const selector of authorSelectors) {
    const authorName = $(selector).first().text().trim()
    if (authorName && !authors.some(a => a.name === authorName)) {
      // Validate it looks like a name (not too long, has proper case)
      if (authorName.length < 60 && /^[A-Z]/.test(authorName)) {
        authors.push({
          name: authorName,
          source: 'html-class'
        })
        break // Only take first match to avoid duplicates
      }
    }
  }

  // Check common author patterns in content
  // Enhanced patterns for various byline formats
  const bylinePatterns = [
    /(?:^|\n)By\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})(?:\s|,|\.|\n|$)/,
    /(?:^|\n)Written by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})(?:\s|,|\.|\n|$)/,
    /(?:^|\n)Author:\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})(?:\s|,|\.|\n|$)/,
    /(?:^|\n)Authored by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})(?:\s|,|\.|\n|$)/,
    /(?:^|\n)Medically reviewed by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})(?:,\s*(?:MD|RN|PhD|PharmD|RD|MPH))?/i,
    /(?:^|\n)Reviewed by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})(?:,\s*(?:MD|RN|PhD|PharmD|RD|MPH))?/i,
    /(?:^|\n)Updated by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})(?:\s|,|\.|\n|$)/,
  ]

  const bodyText = $('body').text()
  for (const pattern of bylinePatterns) {
    const match = bodyText.match(pattern)
    if (match && match[1]) {
      const authorName = match[1].trim()
      // Validate it's a reasonable author name (2-4 words, not common false positives)
      const words = authorName.split(/\s+/)
      const invalidNames = ['talking to', 'according to', 'listen to', 'subscribe to', 'related to', 'refer to', 'up to date']

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

  // Check JavaScript data (e.g., window.dataLayer for Healthline)
  $('script').each((_, el) => {
    const scriptContent = $(el).html() || ''

    // Look for dataLayer with byline/medicalReviewers
    if (scriptContent.includes('window.dataLayer.push')) {
      try {
        // Look for medicalReviewers with full details in byline structure
        // Pattern matches: "medicalReviewers":[{"id":6848,"name":{"display":"Helen Chen MCMSc, PA-C"...
        const fullReviewerPattern = /"medicalReviewers"\s*:\s*\[([^\]]+)\]/
        const fullMatch = scriptContent.match(fullReviewerPattern)

        if (fullMatch) {
          const reviewersData = fullMatch[1]

          // Extract name
          const nameMatch = reviewersData.match(/"name"\s*:\s*\{\s*"display"\s*:\s*"([^"]+)"/)
          if (nameMatch && !authors.some(a => a.name === nameMatch[1])) {
            const fullName = nameMatch[1]

            // Extract bio page URL from "link" field
            const linkMatch = reviewersData.match(/"link"\s*:\s*"([^"]+)"/)
            const bioUrl = linkMatch ? linkMatch[1] : undefined

            // Extract photo URL from "avatar" field
            // Pattern: "avatar":{"src":"https://post.healthline.com/wp-content/uploads/2023/03/Helen-Chen-Headshot-500x500-Bio.png"}
            const photoMatch = reviewersData.match(/"avatar"\s*:\s*\{\s*"src"\s*:\s*"([^"]+)"/)
            const photoUrl = photoMatch ? photoMatch[1] : undefined

            // Extract credentials from name
            const credMatch = fullName.match(/^(.+?)\s+((?:MD|PhD|RN|MPH|DDS|PharmD|RD|CNE|COI|PA-C|MCMSc|BSc|MSc|MSN|MPH|MBA|JD|DO|NP|APRN)[,\s]*.*)$/i)

            const newAuthor = {
              name: fullName,
              credentials: credMatch ? credMatch[2].trim() : 'Medical Reviewer',
              url: bioUrl,
              photo: photoUrl,
              source: 'javascript' as const
            }
            authors.push(newAuthor)
            console.log('[extractAuthors] Found from JavaScript dataLayer:', newAuthor)
          }
        }

        // Also look for additional author info if not already found from meta tags
        const authorPattern = /"author"\s*:\s*"([^"]+)"/
        const authorMatch = scriptContent.match(authorPattern)
        if (authorMatch && !authors.some(a => a.name === authorMatch[1])) {
          authors.push({
            name: authorMatch[1],
            source: 'javascript'
          })
          console.log('[extractAuthors] Found author from JavaScript:', authorMatch[1])
        }
      } catch (e) {
        // Invalid format, skip
      }
    }
  })

  console.log(`[extractAuthors] Total authors found: ${authors.length}`, authors)
  return authors
}

/**
 * Extracts all authors from schema markup (including reviewers)
 */
function extractAuthorsFromSchema(schema: any): Author[] {
  const authors: Author[] = []

  if (!schema) return authors

  // Handle arrays - recursively collect all authors
  if (Array.isArray(schema)) {
    for (const item of schema) {
      authors.push(...extractAuthorsFromSchema(item))
    }
    return authors
  }

  // Check for author property
  if (schema.author) {
    const authorData = Array.isArray(schema.author) ? schema.author : [schema.author]

    for (const author of authorData) {
      if (typeof author === 'string') {
        authors.push({
          name: author,
          source: 'schema'
        })
      } else if (author.name) {
        authors.push({
          name: author.name,
          credentials: author.jobTitle || author.description,
          url: author.url,
          photo: author.image,
          source: 'schema'
        })
      }
    }
  }

  // Check for reviewedBy property (medical/health content)
  if (schema.reviewedBy) {
    const reviewerData = Array.isArray(schema.reviewedBy) ? schema.reviewedBy : [schema.reviewedBy]

    for (const reviewer of reviewerData) {
      if (typeof reviewer === 'string') {
        // Extract credentials from name string (e.g., "Helen Chen MCMSc, PA-C")
        const credMatch = reviewer.match(/^(.+?)\s+((?:MD|PhD|RN|MPH|DDS|PharmD|RD|CNE|COI|PA-C|MCMSc|BSc|MSc|MSN|MPH|MBA|JD|DO|NP|APRN)[,\s]*.*)$/i)

        if (credMatch) {
          authors.push({
            name: reviewer, // Keep full name
            credentials: credMatch[2].trim(),
            source: 'schema'
          })
        } else {
          authors.push({
            name: reviewer,
            credentials: 'Medical Reviewer',
            source: 'schema'
          })
        }
      } else if (reviewer.name) {
        authors.push({
          name: reviewer.name,
          credentials: reviewer.jobTitle || reviewer.description || 'Medical Reviewer',
          url: reviewer.url,
          photo: reviewer.image,
          source: 'schema'
        })
      }
    }
  }

  // Check for medicalReviewer property (alternate naming)
  if (schema.medicalReviewer) {
    const reviewerData = Array.isArray(schema.medicalReviewer) ? schema.medicalReviewer : [schema.medicalReviewer]

    for (const reviewer of reviewerData) {
      if (typeof reviewer === 'string') {
        authors.push({
          name: reviewer,
          credentials: 'Medical Reviewer',
          source: 'schema'
        })
      } else if (reviewer.name) {
        authors.push({
          name: reviewer.name,
          credentials: reviewer.jobTitle || reviewer.description || 'Medical Reviewer',
          url: reviewer.url,
          photo: reviewer.image,
          source: 'schema'
        })
      }
    }
  }

  return authors
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
  const addUnique = (href: string) => {
    if (href && href.startsWith('http') && !citations.includes(href)) {
      citations.push(href)
    }
  }

  // 1. Superscript references with links (highest priority - definite citations)
  $('sup a[href], sup[id*="ref"] a[href]').each((_, el) => {
    addUnique($(el).attr('href') || '')
  })

  // 2. Links with citation-related IDs or classes
  $('a[id*="cite"], a[class*="citation"], a[class*="reference"], a[href*="#cite"], a[href*="#ref"]').each((_, el) => {
    const href = $(el).attr('href') || ''
    if (!href.startsWith('#')) { // Skip internal anchor links
      addUnique(href)
    }
  })

  // 3. Find reference sections by heading text
  const referenceHeadings = $('h2, h3, h4').filter((_, el) => {
    const text = $(el).text().toLowerCase()
    return /^(references?|citations?|sources?|bibliography|further reading|notes|footnotes)$/i.test(text.trim())
  })

  // Extract links from reference sections
  referenceHeadings.each((_, heading) => {
    let currentEl = $(heading).next()
    // Traverse siblings until next heading or end
    while (currentEl.length && !currentEl.is('h1, h2, h3, h4')) {
      currentEl.find('a[href]').each((_, link) => {
        addUnique($(link).attr('href') || '')
      })
      currentEl = currentEl.next()
    }
  })

  // 4. Look for common reference list patterns
  $('ol.references li a[href], ul.references li a[href], .reference-list a[href], .citations a[href]').each((_, el) => {
    addUnique($(el).attr('href') || '')
  })

  // 5. Numbered citation patterns in content linked to references
  $('a[href^="#ref"], a[href^="#cite"], a[href^="#note"]').each((_, el) => {
    const href = $(el).attr('href') || ''
    const targetId = href.substring(1) // Remove #
    // Find the target element and extract links from it
    $(`#${targetId}`).find('a[href]').each((_, targetLink) => {
      addUnique($(targetLink).attr('href') || '')
    })
  })

  // 6. Links in footer/endnotes (often contain citations)
  $('footer a[href], .footnotes a[href], .endnotes a[href]').each((_, el) => {
    const href = $(el).attr('href') || ''
    if (!href.startsWith('#')) { // Skip internal anchors
      addUnique(href)
    }
  })

  // 7. All other external links (lower priority - may include citations)
  // Only add if we haven't found many citations yet
  if (citations.length < 5) {
    $('article a[href], main a[href], .content a[href]').each((_, el) => {
      const href = $(el).attr('href') || ''
      // Filter out navigation, social media, and obvious non-citation links
      const text = $(el).text().toLowerCase()
      const isLikelyCitation =
        !href.includes('facebook.com') &&
        !href.includes('twitter.com') &&
        !href.includes('instagram.com') &&
        !href.includes('linkedin.com') &&
        !text.includes('share') &&
        !text.includes('subscribe') &&
        !text.includes('sign up') &&
        !text.includes('login')

      if (isLikelyCitation) {
        addUnique(href)
      }
    })
  }

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
