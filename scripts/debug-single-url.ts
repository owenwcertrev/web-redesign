/**
 * Debug Single URL - Detailed analysis
 */

import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { analyzeURL, getAuthoritativeDomain } from '../lib/services/url-analyzer'
import { getDataForSEOMetrics } from '../lib/services/dataforseo-api'
import { calculateEEATScores, identifyIssues } from '../lib/services/eeat-scorer'

const testUrl = process.argv[2] || 'https://www.mayoclinic.org/diseases-conditions/heart-disease/symptoms-causes/syc-20353118'

async function debugURL(url: string) {
  console.log(`\n🔍 Debugging: ${url}\n`)

  // Page Analysis
  console.log('📄 PAGE ANALYSIS')
  console.log('='.repeat(80))
  const pageAnalysis = await analyzeURL(url)

  console.log(`Title: ${pageAnalysis.title}`)
  console.log(`Original URL: ${pageAnalysis.url}`)
  console.log(`Final URL (after redirects): ${pageAnalysis.finalUrl}`)
  console.log(`Canonical URL: ${pageAnalysis.canonicalUrl || 'None'}`)
  console.log(`Word Count: ${pageAnalysis.wordCount}`)
  console.log(`Readability Score: ${pageAnalysis.readabilityScore}`)
  console.log(`Has SSL: ${pageAnalysis.hasSSL}`)
  console.log(`\nAuthors (${pageAnalysis.authors.length}):`)
  pageAnalysis.authors.forEach(a => {
    console.log(`  - ${a.name} [${a.source}]${a.credentials ? ` - ${a.credentials}` : ''}`)
  })
  console.log(`\nSchema Markup (${pageAnalysis.schemaMarkup.length}):`)
  pageAnalysis.schemaMarkup.forEach(s => {
    console.log(`  - ${s.type}`)
  })
  console.log(`\nHeadings:`)
  console.log(`  H1 (${pageAnalysis.headings.h1.length}): ${pageAnalysis.headings.h1.slice(0, 3).join(', ')}`)
  console.log(`  H2 (${pageAnalysis.headings.h2.length}): ${pageAnalysis.headings.h2.slice(0, 3).join(', ')}`)
  console.log(`  H3 (${pageAnalysis.headings.h3.length})`)
  console.log(`\nImages: ${pageAnalysis.images.withAlt}/${pageAnalysis.images.total} with alt text`)
  console.log(`Links: ${pageAnalysis.links.internal} internal, ${pageAnalysis.links.external} external`)
  console.log(`Citations: ${pageAnalysis.citations}`)

  // Get authoritative domain for DataForSEO
  const authoritativeDomain = getAuthoritativeDomain(pageAnalysis)
  console.log(`\nAuthoritative Domain: ${authoritativeDomain}`)

  // DataForSEO Analysis
  console.log(`\n\n🌐 DATAFORSEO METRICS`)
  console.log('='.repeat(80))
  const dataforSEOMetrics = await getDataForSEOMetrics(`https://${authoritativeDomain}`)

  console.log(`Domain Rank: ${dataforSEOMetrics.domainRank}/100`)
  console.log(`Organic Keywords: ${dataforSEOMetrics.organicKeywords.toLocaleString()}`)
  console.log(`Organic Traffic: ${Math.round(dataforSEOMetrics.organicTraffic).toLocaleString()} visits/month`)
  console.log(`Traffic Value: $${Math.round(dataforSEOMetrics.organicTrafficValue).toLocaleString()}/month`)

  // E-E-A-T Scores
  console.log(`\n\n📊 E-E-A-T SCORES`)
  console.log('='.repeat(80))
  const scores = calculateEEATScores(pageAnalysis, dataforSEOMetrics)

  console.log(`Overall: ${scores.overall}/100`)
  console.log(`Experience: ${scores.experience}/25`)
  console.log(`Expertise: ${scores.expertise}/25`)
  console.log(`Authoritativeness: ${scores.authoritativeness}/25`)
  console.log(`Trustworthiness: ${scores.trustworthiness}/25`)

  // Issues
  console.log(`\n\n⚠️  ISSUES DETECTED`)
  console.log('='.repeat(80))
  const issues = identifyIssues(pageAnalysis, dataforSEOMetrics, scores)

  issues.forEach(issue => {
    console.log(`\n[${issue.severity.toUpperCase()}] ${issue.title}`)
    console.log(`  ${issue.description}`)
  })

  console.log('\n')
}

debugURL(testUrl).catch(console.error)
