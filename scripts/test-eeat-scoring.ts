/**
 * E-E-A-T Scoring Test Script
 * Tests scoring accuracy and consistency across diverse websites
 */

import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

// Verify credentials loaded
console.log('Environment check:')
console.log('DATAFORSEO_LOGIN:', process.env.DATAFORSEO_LOGIN ? '✓ Loaded' : '✗ Missing')
console.log('DATAFORSEO_PASSWORD:', process.env.DATAFORSEO_PASSWORD ? '✓ Loaded' : '✗ Missing')
console.log()

import { analyzeURL } from '../lib/services/url-analyzer'
import { getDataForSEOMetrics } from '../lib/services/dataforseo-api'
import { calculateEEATScores, identifyIssues } from '../lib/services/eeat-scorer'

interface TestCase {
  url: string
  category: string
  expectedRange: [number, number] // [min, max] expected score
  description: string
}

const TEST_CASES: TestCase[] = [
  // High Authority Sites (Expected 70-100)
  {
    url: 'https://www.mayoclinic.org/diseases-conditions/heart-disease/symptoms-causes/syc-20353118',
    category: 'High Authority',
    expectedRange: [75, 100],
    description: 'Medical authority with expert authors and citations'
  },
  {
    url: 'https://www.healthline.com/health/heart-disease',
    category: 'High Authority',
    expectedRange: [75, 100],
    description: 'Health content with medical review'
  },
  {
    url: 'https://www.nytimes.com',
    category: 'High Authority',
    expectedRange: [75, 100],
    description: 'News site with journalistic standards'
  },
  {
    url: 'https://www.webmd.com/heart-disease/default.htm',
    category: 'High Authority',
    expectedRange: [70, 100],
    description: 'Medical information site'
  },

  // Medium Authority Sites (Expected 45-75)
  {
    url: 'https://www.wikihow.com/Improve-Your-Health',
    category: 'Medium Authority',
    expectedRange: [45, 75],
    description: 'How-to content with some structure'
  },
  {
    url: 'https://www.shopify.com/blog/ecommerce-seo',
    category: 'Medium Authority',
    expectedRange: [50, 75],
    description: 'Business blog from established platform'
  },
  {
    url: 'https://www.forbes.com/sites/forbestechcouncil',
    category: 'Medium Authority',
    expectedRange: [55, 80],
    description: 'Business content with contributor network'
  },

  // Lower Authority Sites (Expected 25-50)
  {
    url: 'https://dev.to/t/webdev',
    category: 'Medium/Low Authority',
    expectedRange: [35, 60],
    description: 'Developer community content'
  },
  {
    url: 'https://www.reddit.com/r/programming',
    category: 'Low Authority',
    expectedRange: [25, 50],
    description: 'Community discussion forum'
  },

  // Edge Cases
  {
    url: 'https://github.com/vercel/next.js',
    category: 'Edge Case',
    expectedRange: [30, 60],
    description: 'Technical repository with documentation'
  },
  {
    url: 'https://en.wikipedia.org/wiki/E-A-T',
    category: 'Edge Case',
    expectedRange: [40, 70],
    description: 'Wikipedia - many citations but no author bylines'
  },
  {
    url: 'https://stackoverflow.com/questions/tagged/javascript',
    category: 'Edge Case',
    expectedRange: [30, 55],
    description: 'Q&A site with technical content'
  },

  // Test Site (Our Own)
  {
    url: 'https://certrev.com',
    category: 'Test Site',
    expectedRange: [20, 50],
    description: 'CertREV homepage (baseline)'
  },
]

interface TestResult {
  url: string
  category: string
  score: number
  breakdown: {
    experience: number
    expertise: number
    authoritativeness: number
    trustworthiness: number
  }
  expectedRange: [number, number]
  passed: boolean
  issues: string[]
  error?: string
  duration: number
}

async function testURL(testCase: TestCase): Promise<TestResult> {
  const startTime = Date.now()

  try {
    console.log(`\n🔍 Testing: ${testCase.url}`)

    // Analyze the URL
    const [pageAnalysis, dataforSEOMetrics] = await Promise.all([
      analyzeURL(testCase.url),
      getDataForSEOMetrics(testCase.url).catch(() => null)
    ])

    // Use estimated metrics if API fails
    const metricsToUse = dataforSEOMetrics || await getDataForSEOMetrics(testCase.url)

    // Calculate scores
    const scores = calculateEEATScores(pageAnalysis, metricsToUse)
    const issues = identifyIssues(pageAnalysis, metricsToUse, scores)

    const duration = Date.now() - startTime
    const passed = scores.overall >= testCase.expectedRange[0] && scores.overall <= testCase.expectedRange[1]

    console.log(`   Score: ${scores.overall}/100 (${passed ? '✓' : '✗'})`)
    console.log(`   Time: ${duration}ms`)

    return {
      url: testCase.url,
      category: testCase.category,
      score: scores.overall,
      breakdown: {
        experience: scores.experience,
        expertise: scores.expertise,
        authoritativeness: scores.authoritativeness,
        trustworthiness: scores.trustworthiness,
      },
      expectedRange: testCase.expectedRange,
      passed,
      issues: issues.map(i => i.title),
      duration,
    }
  } catch (error) {
    const duration = Date.now() - startTime
    console.log(`   ✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)

    return {
      url: testCase.url,
      category: testCase.category,
      score: 0,
      breakdown: { experience: 0, expertise: 0, authoritativeness: 0, trustworthiness: 0 },
      expectedRange: testCase.expectedRange,
      passed: false,
      issues: [],
      error: error instanceof Error ? error.message : 'Unknown error',
      duration,
    }
  }
}

async function testConsistency(url: string, runs: number = 3): Promise<{ consistent: boolean, scores: number[], variance: number }> {
  console.log(`\n🔄 Testing consistency for: ${url} (${runs} runs)`)

  const scores: number[] = []

  for (let i = 0; i < runs; i++) {
    try {
      const pageAnalysis = await analyzeURL(url)
      const dataforSEOMetrics = await getDataForSEOMetrics(url).catch(() => null) || await getDataForSEOMetrics(url)
      const result = calculateEEATScores(pageAnalysis, dataforSEOMetrics)
      scores.push(result.overall)
      console.log(`   Run ${i + 1}: ${result.overall}`)
    } catch (error) {
      console.log(`   Run ${i + 1}: Error`)
    }
  }

  const variance = scores.length > 1
    ? Math.max(...scores) - Math.min(...scores)
    : 0

  const consistent = variance <= 2 // Allow up to 2 point variance

  console.log(`   Variance: ${variance} points (${consistent ? '✓ Consistent' : '✗ Inconsistent'})`)

  return { consistent, scores, variance }
}

function printSummaryTable(results: TestResult[]) {
  console.log('\n\n' + '='.repeat(120))
  console.log('📊 TEST RESULTS SUMMARY')
  console.log('='.repeat(120))

  // Header
  console.log(
    '\n' +
    'URL'.padEnd(50) +
    'Category'.padEnd(20) +
    'Score'.padEnd(10) +
    'Expected'.padEnd(15) +
    'Status'.padEnd(10) +
    'Time'
  )
  console.log('-'.repeat(120))

  // Results
  results.forEach(result => {
    const urlShort = result.url.length > 48
      ? result.url.substring(0, 45) + '...'
      : result.url

    const status = result.error
      ? '❌ ERROR'
      : result.passed
        ? '✅ PASS'
        : '⚠️  FAIL'

    const expectedStr = `${result.expectedRange[0]}-${result.expectedRange[1]}`

    console.log(
      urlShort.padEnd(50) +
      result.category.padEnd(20) +
      `${result.score}/100`.padEnd(10) +
      expectedStr.padEnd(15) +
      status.padEnd(10) +
      `${result.duration}ms`
    )
  })

  console.log('-'.repeat(120))

  // Statistics
  const passed = results.filter(r => r.passed && !r.error).length
  const failed = results.filter(r => !r.passed && !r.error).length
  const errors = results.filter(r => r.error).length
  const avgScore = results.filter(r => !r.error).reduce((sum, r) => sum + r.score, 0) / (results.length - errors)
  const avgTime = results.reduce((sum, r) => sum + r.duration, 0) / results.length

  console.log(`\n✅ Passed: ${passed}/${results.length}`)
  console.log(`⚠️  Failed: ${failed}/${results.length}`)
  console.log(`❌ Errors: ${errors}/${results.length}`)
  console.log(`📈 Average Score: ${avgScore.toFixed(1)}/100`)
  console.log(`⏱️  Average Time: ${avgTime.toFixed(0)}ms`)

  // Category breakdown
  console.log('\n📊 Score by Category:')
  const categories = [...new Set(results.map(r => r.category))]
  categories.forEach(cat => {
    const catResults = results.filter(r => r.category === cat && !r.error)
    if (catResults.length > 0) {
      const catAvg = catResults.reduce((sum, r) => sum + r.score, 0) / catResults.length
      console.log(`   ${cat}: ${catAvg.toFixed(1)}/100`)
    }
  })

  // Anomalies
  const anomalies = results.filter(r => !r.passed && !r.error)
  if (anomalies.length > 0) {
    console.log('\n⚠️  ANOMALIES DETECTED:')
    anomalies.forEach(a => {
      console.log(`   ${a.url}`)
      console.log(`      Expected: ${a.expectedRange[0]}-${a.expectedRange[1]}, Got: ${a.score}`)
      console.log(`      Breakdown: E:${a.breakdown.experience} Ex:${a.breakdown.expertise} A:${a.breakdown.authoritativeness} T:${a.breakdown.trustworthiness}`)
    })
  }

  console.log('\n' + '='.repeat(120) + '\n')
}

async function main() {
  console.log('🚀 Starting E-E-A-T Scoring Tests...\n')

  // Run all tests
  const results: TestResult[] = []
  for (const testCase of TEST_CASES) {
    const result = await testURL(testCase)
    results.push(result)

    // Small delay between tests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  // Print summary
  printSummaryTable(results)

  // Test consistency on a few URLs
  console.log('\n🔄 CONSISTENCY TESTS')
  console.log('='.repeat(120))

  const consistencyTests = [
    'https://certrev.com',
    'https://www.healthline.com/health/heart-disease',
  ]

  for (const url of consistencyTests) {
    await testConsistency(url, 3)
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  console.log('\n✅ Testing complete!\n')
}

// Run tests
main().catch(console.error)
