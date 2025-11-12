/**
 * E1-E7 Real-World Comprehensive Test Script
 * Tests all Experience metrics across diverse website types
 * Focus: Accuracy, consistency, and recommendation quality
 */

import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { analyzeURL } from './lib/services/url-analyzer'
import { calculateEEATScores } from './lib/services/eeat-scorer'

interface TestSite {
  url: string
  category: string
  vertical: string
  description: string
  expectedE1Range: [number, number] // First-person narratives
  expectedE2Range: [number, number] // Perspective blocks
  expectedE3Range: [number, number] // Original assets
  expectedE4Range: [number, number] // Freshness
  expectedE5Range: [number, number] // Experience markup
  notes: string
}

// Comprehensive test matrix covering diverse website types
const TEST_SITES: TestSite[] = [
  // ==================== MEDICAL/HEALTH (YMYL) ====================
  {
    url: 'https://www.healthline.com/health/heart-disease',
    category: 'Medical',
    vertical: 'Health',
    description: 'Industry benchmark - medical reviewer, fresh, schema',
    expectedE1Range: [1, 3],
    expectedE2Range: [2, 3],
    expectedE3Range: [0, 1],
    expectedE4Range: [3, 5],
    expectedE5Range: [1, 2],
    notes: 'Explicit medical reviewer, MedicalWebPage schema, updated recently'
  },
  {
    url: 'https://www.mayoclinic.org/diseases-conditions/heart-disease/symptoms-causes/syc-20353118',
    category: 'Medical',
    vertical: 'Health',
    description: 'Institutional authority - conservative voice',
    expectedE1Range: [0, 2],
    expectedE2Range: [0, 2],
    expectedE3Range: [0, 2],
    expectedE4Range: [3, 5],
    expectedE5Range: [1, 2],
    notes: 'Institutional voice, may lack explicit first-person narratives'
  },
  {
    url: 'https://www.webmd.com/heart-disease/default.htm',
    category: 'Medical',
    vertical: 'Health',
    description: 'Medical information site with reviewers',
    expectedE1Range: [0, 2],
    expectedE2Range: [1, 3],
    expectedE3Range: [0, 1],
    expectedE4Range: [2, 5],
    expectedE5Range: [1, 2],
    notes: 'Medical reviewer schema, updated content'
  },
  {
    url: 'https://my.clevelandclinic.org/health/diseases/21493-high-cholesterol',
    category: 'Medical',
    vertical: 'Health',
    description: 'Academic medical center - professional voice',
    expectedE1Range: [0, 2],
    expectedE2Range: [0, 2],
    expectedE3Range: [0, 2],
    expectedE4Range: [3, 5],
    expectedE5Range: [1, 2],
    notes: 'Academic/institutional voice, may use passive voice'
  },

  // ==================== FOOD/CULINARY ====================
  {
    url: 'https://www.seriouseats.com/homemade-ricotta-cheese',
    category: 'Food',
    vertical: 'Culinary',
    description: 'Chef perspective, test kitchen, original photos',
    expectedE1Range: [2, 4],
    expectedE2Range: [0, 2],
    expectedE3Range: [1, 3],
    expectedE4Range: [2, 5],
    expectedE5Range: [1, 2],
    notes: 'Strong personal narrative, original assets (photos), Recipe schema'
  },
  {
    url: 'https://www.allrecipes.com/recipe/16354/easy-meatloaf/',
    category: 'Food',
    vertical: 'Culinary',
    description: 'Community recipe site',
    expectedE1Range: [0, 2],
    expectedE2Range: [0, 1],
    expectedE3Range: [0, 1],
    expectedE4Range: [1, 4],
    expectedE5Range: [1, 2],
    notes: 'Recipe schema, community content, may lack professional perspective'
  },

  // ==================== TECH/ENGINEERING ====================
  {
    url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/',
    category: 'Tech',
    vertical: 'Web Development',
    description: 'Tutorial with embedded diagrams',
    expectedE1Range: [1, 3],
    expectedE2Range: [0, 2],
    expectedE3Range: [0, 2],
    expectedE4Range: [1, 4],
    expectedE5Range: [0, 2],
    notes: 'E3 strict mode test - diagrams without explicit references'
  },
  {
    url: 'https://www.smashingmagazine.com/2021/03/css-generators/',
    category: 'Tech',
    vertical: 'Web Development',
    description: 'Professional tech article with author perspective',
    expectedE1Range: [1, 3],
    expectedE2Range: [1, 2],
    expectedE3Range: [0, 2],
    expectedE4Range: [2, 5],
    expectedE5Range: [0, 2],
    notes: 'Author voice, tutorial content, may have HowTo schema'
  },
  {
    url: 'https://stackoverflow.com/questions/11227809/why-is-processing-a-sorted-array-faster-than-processing-an-unsorted-array',
    category: 'Tech',
    vertical: 'Q&A',
    description: 'Q&A site - should score low on most metrics',
    expectedE1Range: [0, 1],
    expectedE2Range: [0, 1],
    expectedE3Range: [0, 1],
    expectedE4Range: [1, 4],
    expectedE5Range: [0, 1],
    notes: 'Negative test case - Q&A format lacks structured experience signals'
  },
  {
    url: 'https://dev.to/t/javascript',
    category: 'Tech',
    vertical: 'Developer Community',
    description: 'Developer community content',
    expectedE1Range: [1, 3],
    expectedE2Range: [0, 1],
    expectedE3Range: [0, 1],
    expectedE4Range: [3, 5],
    expectedE5Range: [0, 1],
    notes: 'Community content, varied quality, fresh updates'
  },

  // ==================== LEGAL/FINANCE ====================
  {
    url: 'https://www.investopedia.com/terms/c/cryptocurrency.asp',
    category: 'Finance',
    vertical: 'Financial Education',
    description: 'Financial expertise, reviewed content',
    expectedE1Range: [0, 2],
    expectedE2Range: [1, 3],
    expectedE3Range: [0, 2],
    expectedE4Range: [3, 5],
    expectedE5Range: [0, 1],
    notes: 'Reviewer attribution, financial expertise, updated regularly'
  },
  {
    url: 'https://www.nerdwallet.com/article/investing/what-is-cryptocurrency',
    category: 'Finance',
    vertical: 'Financial Analysis',
    description: 'Financial analysis with custom charts',
    expectedE1Range: [1, 3],
    expectedE2Range: [1, 2],
    expectedE3Range: [1, 3],
    expectedE4Range: [3, 5],
    expectedE5Range: [0, 1],
    notes: 'Original research, custom charts, fresh content'
  },

  // ==================== NEWS/EDITORIAL ====================
  {
    url: 'https://www.nytimes.com/section/health',
    category: 'News',
    vertical: 'Journalism',
    description: 'Journalistic standards, collaborative authorship',
    expectedE1Range: [0, 2],
    expectedE2Range: [0, 2],
    expectedE3Range: [0, 1],
    expectedE4Range: [4, 5],
    expectedE5Range: [0, 1],
    notes: 'Very fresh, institutional voice, journalistic standards'
  },
  {
    url: 'https://www.bbc.com/news/health',
    category: 'News',
    vertical: 'Journalism',
    description: 'Institutional authority, fresh news',
    expectedE1Range: [0, 1],
    expectedE2Range: [0, 1],
    expectedE3Range: [0, 1],
    expectedE4Range: [4, 5],
    expectedE5Range: [0, 1],
    notes: 'Very fresh, institutional BBC voice, news format'
  },

  // ==================== PERSONAL/BLOGS ====================
  {
    url: 'https://medium.com/@username',
    category: 'Personal',
    vertical: 'Blog Platform',
    description: 'Personal blog with first-person narrative',
    expectedE1Range: [2, 4],
    expectedE2Range: [0, 1],
    expectedE3Range: [0, 1],
    expectedE4Range: [2, 5],
    expectedE5Range: [0, 1],
    notes: 'Strong first-person narrative, personal experience'
  },

  // ==================== E-COMMERCE/BUSINESS ====================
  {
    url: 'https://www.shopify.com/blog/ecommerce-seo-beginners-guide',
    category: 'Business',
    vertical: 'E-commerce',
    description: 'Business blog from established platform',
    expectedE1Range: [1, 3],
    expectedE2Range: [0, 2],
    expectedE3Range: [0, 2],
    expectedE4Range: [2, 5],
    expectedE5Range: [0, 1],
    notes: 'Business expertise, HowTo content, fresh updates'
  },

  // ==================== EDUCATIONAL ====================
  {
    url: 'https://www.wikipedia.org/wiki/Cardiovascular_disease',
    category: 'Educational',
    vertical: 'Encyclopedia',
    description: 'Encyclopedic - should score low on experience',
    expectedE1Range: [0, 1],
    expectedE2Range: [0, 1],
    expectedE3Range: [0, 1],
    expectedE4Range: [2, 5],
    expectedE5Range: [0, 1],
    notes: 'Encyclopedic format, no personal narrative, many citations'
  }
]

interface TestResult {
  url: string
  category: string
  vertical: string
  scores: {
    E1: { actual: number, expected: [number, number], passed: boolean }
    E2: { actual: number, expected: [number, number], passed: boolean }
    E3: { actual: number, expected: [number, number], passed: boolean }
    E4: { actual: number, expected: [number, number], passed: boolean }
    E5: { actual: number, expected: [number, number], passed: boolean }
  }
  recommendations: {
    E1?: string
    E2?: string
    E3?: string
    E4?: string
    E5?: string
  }
  overallPass: boolean
  notes: string
  error?: string
}

async function testSite(site: TestSite): Promise<TestResult> {
  console.log(`\n🔍 Testing: ${site.url}`)
  console.log(`   Category: ${site.category} | Vertical: ${site.vertical}`)

  try {
    const pageAnalysis = await analyzeURL(site.url)
    const eeatScores = calculateEEATScores(pageAnalysis, null, {})

    // Extract E1-E5 scores
    const E1 = eeatScores.experience.variables.find(v => v.id === 'E1')
    const E2 = eeatScores.experience.variables.find(v => v.id === 'E2')
    const E3 = eeatScores.experience.variables.find(v => v.id === 'E3')
    const E4 = eeatScores.experience.variables.find(v => v.id === 'E4')
    const E5 = eeatScores.experience.variables.find(v => v.id === 'E5')

    // Check if scores are in expected ranges
    const E1Passed = E1 ? (E1.actualScore >= site.expectedE1Range[0] && E1.actualScore <= site.expectedE1Range[1]) : false
    const E2Passed = E2 ? (E2.actualScore >= site.expectedE2Range[0] && E2.actualScore <= site.expectedE2Range[1]) : false
    const E3Passed = E3 ? (E3.actualScore >= site.expectedE3Range[0] && E3.actualScore <= site.expectedE3Range[1]) : false
    const E4Passed = E4 ? (E4.actualScore >= site.expectedE4Range[0] && E4.actualScore <= site.expectedE4Range[1]) : false
    const E5Passed = E5 ? (E5.actualScore >= site.expectedE5Range[0] && E5.actualScore <= site.expectedE5Range[1]) : false

    const result: TestResult = {
      url: site.url,
      category: site.category,
      vertical: site.vertical,
      scores: {
        E1: { actual: E1?.actualScore || 0, expected: site.expectedE1Range, passed: E1Passed },
        E2: { actual: E2?.actualScore || 0, expected: site.expectedE2Range, passed: E2Passed },
        E3: { actual: E3?.actualScore || 0, expected: site.expectedE3Range, passed: E3Passed },
        E4: { actual: E4?.actualScore || 0, expected: site.expectedE4Range, passed: E4Passed },
        E5: { actual: E5?.actualScore || 0, expected: site.expectedE5Range, passed: E5Passed }
      },
      recommendations: {
        E1: E1?.recommendation,
        E2: E2?.recommendation,
        E3: E3?.recommendation,
        E4: E4?.recommendation,
        E5: E5?.recommendation
      },
      overallPass: E1Passed && E2Passed && E3Passed && E4Passed && E5Passed,
      notes: site.notes
    }

    // Print results
    console.log(`   E1 (First-Person): ${result.scores.E1.actual}/4 ${result.scores.E1.passed ? '✅' : '❌'} (expected: ${site.expectedE1Range[0]}-${site.expectedE1Range[1]})`)
    console.log(`   E2 (Perspective): ${result.scores.E2.actual}/3 ${result.scores.E2.passed ? '✅' : '❌'} (expected: ${site.expectedE2Range[0]}-${site.expectedE2Range[1]})`)
    console.log(`   E3 (Original Assets): ${result.scores.E3.actual}/3 ${result.scores.E3.passed ? '✅' : '❌'} (expected: ${site.expectedE3Range[0]}-${site.expectedE3Range[1]})`)
    console.log(`   E4 (Freshness): ${result.scores.E4.actual}/5 ${result.scores.E4.passed ? '✅' : '❌'} (expected: ${site.expectedE4Range[0]}-${site.expectedE4Range[1]})`)
    console.log(`   E5 (Markup): ${result.scores.E5.actual}/2 ${result.scores.E5.passed ? '✅' : '❌'} (expected: ${site.expectedE5Range[0]}-${site.expectedE5Range[1]})`)
    console.log(`   Overall: ${result.overallPass ? '✅ PASS' : '❌ FAIL'}`)

    return result

  } catch (error: any) {
    console.error(`   ❌ ERROR: ${error.message}`)
    return {
      url: site.url,
      category: site.category,
      vertical: site.vertical,
      scores: {
        E1: { actual: 0, expected: site.expectedE1Range, passed: false },
        E2: { actual: 0, expected: site.expectedE2Range, passed: false },
        E3: { actual: 0, expected: site.expectedE3Range, passed: false },
        E4: { actual: 0, expected: site.expectedE4Range, passed: false },
        E5: { actual: 0, expected: site.expectedE5Range, passed: false }
      },
      recommendations: {},
      overallPass: false,
      notes: site.notes,
      error: error.message
    }
  }
}

async function runTests() {
  console.log('🧪 E1-E7 REAL-WORLD COMPREHENSIVE TEST SUITE\n')
  console.log('Testing Experience metrics across diverse website types')
  console.log('Focus: Accuracy, consistency, recommendation quality\n')
  console.log('='.repeat(80))

  const results: TestResult[] = []
  const metricStats = {
    E1: { passed: 0, failed: 0, total: 0 },
    E2: { passed: 0, failed: 0, total: 0 },
    E3: { passed: 0, failed: 0, total: 0 },
    E4: { passed: 0, failed: 0, total: 0 },
    E5: { passed: 0, failed: 0, total: 0 }
  }

  // Test all sites
  for (const site of TEST_SITES) {
    const result = await testSite(site)
    results.push(result)

    // Update stats
    metricStats.E1.total++
    metricStats.E2.total++
    metricStats.E3.total++
    metricStats.E4.total++
    metricStats.E5.total++

    if (result.scores.E1.passed) metricStats.E1.passed++; else metricStats.E1.failed++
    if (result.scores.E2.passed) metricStats.E2.passed++; else metricStats.E2.failed++
    if (result.scores.E3.passed) metricStats.E3.passed++; else metricStats.E3.failed++
    if (result.scores.E4.passed) metricStats.E4.passed++; else metricStats.E4.failed++
    if (result.scores.E5.passed) metricStats.E5.passed++; else metricStats.E5.failed++
  }

  // Summary
  console.log('\n' + '='.repeat(80))
  console.log('\n📊 COMPREHENSIVE TEST SUMMARY\n')

  console.log('Per-Metric Pass Rates:\n')
  for (const [metric, stats] of Object.entries(metricStats)) {
    const passRate = ((stats.passed / stats.total) * 100).toFixed(1)
    const status = parseFloat(passRate) >= 75 ? '✅' : '❌'
    console.log(`${status} ${metric}: ${stats.passed}/${stats.total} passed (${passRate}%)`)
  }

  console.log('\n\nResults by Category:\n')
  const categories = [...new Set(results.map(r => r.category))]
  for (const category of categories) {
    const categoryResults = results.filter(r => r.category === category)
    const categoryPassed = categoryResults.filter(r => r.overallPass).length
    console.log(`${category}: ${categoryPassed}/${categoryResults.length} sites passed`)
  }

  const overallPassed = results.filter(r => r.overallPass).length
  const overallPassRate = ((overallPassed / results.length) * 100).toFixed(1)

  console.log(`\n\n🎯 Overall Pass Rate: ${overallPassed}/${results.length} (${overallPassRate}%)`)

  if (parseFloat(overallPassRate) >= 75) {
    console.log('✅ Good overall accuracy across diverse sites!')
  } else {
    console.log('⚠️ Below 75% - review failures and adjust expectations or implementations')
  }

  // Recommendation quality check
  console.log('\n\n📝 RECOMMENDATION QUALITY CHECK\n')
  let totalRecommendations = 0
  let helpfulRecommendations = 0

  for (const result of results) {
    Object.values(result.recommendations).forEach(rec => {
      if (rec) {
        totalRecommendations++
        // Basic check: recommendation should be >50 chars and actionable
        if (rec.length > 50 && (rec.toLowerCase().includes('add') || rec.toLowerCase().includes('include') || rec.toLowerCase().includes('provide'))) {
          helpfulRecommendations++
        }
      }
    })
  }

  console.log(`Total recommendations generated: ${totalRecommendations}`)
  console.log(`Helpful recommendations: ${helpfulRecommendations}/${totalRecommendations}`)
  console.log(`Recommendation quality: ${((helpfulRecommendations / Math.max(totalRecommendations, 1)) * 100).toFixed(1)}%`)

  console.log('\n✅ Comprehensive real-world testing complete')
}

runTests().catch(console.error)
