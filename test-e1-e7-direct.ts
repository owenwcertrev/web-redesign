/**
 * E1-E7 Direct Test Script (No External APIs)
 * Tests Experience metrics directly on PageAnalysis
 */

import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { analyzeURL } from './lib/services/url-analyzer'
import {
  detectFirstPersonNarratives,
  detectAuthorPerspectiveBlocks,
  detectOriginalAssets,
  detectFreshness,
  detectExperienceMarkup
} from './lib/services/eeat-detectors/experience-detectors'

interface TestSite {
  url: string
  category: string
  vertical: string
  description: string
}

const TEST_SITES: TestSite[] = [
  // High-performing sites (likely to score well)
  {
    url: 'https://www.healthline.com/health/heart-disease',
    category: 'Medical',
    vertical: 'Health',
    description: 'Industry benchmark - medical reviewer, fresh, schema'
  },
  {
    url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/',
    category: 'Tech',
    vertical: 'Web Development',
    description: 'Tutorial with diagrams and clear author voice'
  },
  {
    url: 'https://www.investopedia.com/terms/c/cryptocurrency.asp',
    category: 'Finance',
    vertical: 'Financial Education',
    description: 'Financial expertise with reviewer attribution'
  },
  {
    url: 'https://www.shopify.com/blog/ecommerce-seo-beginners-guide',
    category: 'Business',
    vertical: 'E-commerce',
    description: 'Business blog with HowTo content'
  },
  {
    url: 'https://stackoverflow.com/questions/11227809/why-is-processing-a-sorted-array-faster-than-processing-an-unsorted-array',
    category: 'Tech',
    vertical: 'Q&A',
    description: 'Q&A site (negative test case)'
  }
]

interface MetricResult {
  id: string
  name: string
  score: number
  maxScore: number
  status: string
  evidenceCount: number
  recommendation?: string
}

interface SiteResult {
  url: string
  category: string
  vertical: string
  description: string
  metrics: {
    E1: MetricResult
    E2: MetricResult
    E3: MetricResult
    E4: MetricResult
    E5: MetricResult
  }
  error?: string
}

async function testSite(site: TestSite): Promise<SiteResult | null> {
  console.log(`\n${'='.repeat(80)}`)
  console.log(`\n🔍 ${site.url}`)
  console.log(`📁 ${site.category} | ${site.vertical}`)
  console.log(`📋 ${site.description}\n`)

  try {
    const pageAnalysis = await analyzeURL(site.url)

    // Test E1-E5 directly (skip LLM for E1 to ensure consistency)
    const E1 = detectFirstPersonNarratives(pageAnalysis, undefined, true) as any
    const E2 = detectAuthorPerspectiveBlocks(pageAnalysis)
    const E3 = detectOriginalAssets(pageAnalysis)
    const E4 = detectFreshness(pageAnalysis)
    const E5 = detectExperienceMarkup(pageAnalysis)

    const result: SiteResult = {
      url: site.url,
      category: site.category,
      vertical: site.vertical,
      description: site.description,
      metrics: {
        E1: {
          id: E1.id,
          name: E1.name,
          score: E1.actualScore,
          maxScore: E1.maxScore,
          status: E1.status,
          evidenceCount: E1.evidence.length,
          recommendation: E1.recommendation
        },
        E2: {
          id: E2.id,
          name: E2.name,
          score: E2.actualScore,
          maxScore: E2.maxScore,
          status: E2.status,
          evidenceCount: E2.evidence.length,
          recommendation: E2.recommendation
        },
        E3: {
          id: E3.id,
          name: E3.name,
          score: E3.actualScore,
          maxScore: E3.maxScore,
          status: E3.status,
          evidenceCount: E3.evidence.length,
          recommendation: E3.recommendation
        },
        E4: {
          id: E4.id,
          name: E4.name,
          score: E4.actualScore,
          maxScore: E4.maxScore,
          status: E4.status,
          evidenceCount: E4.evidence.length,
          recommendation: E4.recommendation
        },
        E5: {
          id: E5.id,
          name: E5.name,
          score: E5.actualScore,
          maxScore: E5.maxScore,
          status: E5.status,
          evidenceCount: E5.evidence.length,
          recommendation: E5.recommendation
        }
      }
    }

    // Print results
    console.log('📊 SCORES:')
    console.log(`   E1 (First-Person Narratives): ${result.metrics.E1.score}/${result.metrics.E1.maxScore} (${result.metrics.E1.status})`)
    console.log(`      Evidence: ${result.metrics.E1.evidenceCount} items`)
    if (result.metrics.E1.recommendation) {
      console.log(`      💡 ${result.metrics.E1.recommendation.substring(0, 100)}...`)
    }

    console.log(`   E2 (Author Perspective Blocks): ${result.metrics.E2.score}/${result.metrics.E2.maxScore} (${result.metrics.E2.status})`)
    console.log(`      Evidence: ${result.metrics.E2.evidenceCount} items`)
    if (result.metrics.E2.recommendation) {
      console.log(`      💡 ${result.metrics.E2.recommendation.substring(0, 100)}...`)
    }

    console.log(`   E3 (Original Assets): ${result.metrics.E3.score}/${result.metrics.E3.maxScore} (${result.metrics.E3.status})`)
    console.log(`      Evidence: ${result.metrics.E3.evidenceCount} items`)
    if (result.metrics.E3.recommendation) {
      console.log(`      💡 ${result.metrics.E3.recommendation.substring(0, 100)}...`)
    }

    console.log(`   E4 (Freshness): ${result.metrics.E4.score}/${result.metrics.E4.maxScore} (${result.metrics.E4.status})`)
    console.log(`      Evidence: ${result.metrics.E4.evidenceCount} items`)
    if (result.metrics.E4.recommendation) {
      console.log(`      💡 ${result.metrics.E4.recommendation.substring(0, 100)}...`)
    }

    console.log(`   E5 (Experience Markup): ${result.metrics.E5.score}/${result.metrics.E5.maxScore} (${result.metrics.E5.status})`)
    console.log(`      Evidence: ${result.metrics.E5.evidenceCount} items`)
    if (result.metrics.E5.recommendation) {
      console.log(`      💡 ${result.metrics.E5.recommendation.substring(0, 100)}...`)
    }

    console.log(`\n✅ Analysis complete`)
    return result

  } catch (error: any) {
    console.error(`❌ ERROR: ${error.message}`)
    return {
      url: site.url,
      category: site.category,
      vertical: site.vertical,
      description: site.description,
      metrics: {
        E1: { id: 'E1', name: '', score: 0, maxScore: 4, status: 'error', evidenceCount: 0 },
        E2: { id: 'E2', name: '', score: 0, maxScore: 3, status: 'error', evidenceCount: 0 },
        E3: { id: 'E3', name: '', score: 0, maxScore: 3, status: 'error', evidenceCount: 0 },
        E4: { id: 'E4', name: '', score: 0, maxScore: 5, status: 'error', evidenceCount: 0 },
        E5: { id: 'E5', name: '', score: 0, maxScore: 2, status: 'error', evidenceCount: 0 }
      },
      error: error.message
    }
  }
}

async function runTests() {
  console.log('🧪 E1-E7 DIRECT TEST SCRIPT\n')
  console.log('Testing Experience metrics directly on PageAnalysis')
  console.log('No external API dependencies (DataForSEO not required)\n')

  const results: SiteResult[] = []

  for (const site of TEST_SITES) {
    const result = await testSite(site)
    if (result) results.push(result)
  }

  // Summary
  console.log('\n' + '='.repeat(80))
  console.log('\n📊 SUMMARY\n')

  // Average scores by metric
  const avgScores = {
    E1: 0,
    E2: 0,
    E3: 0,
    E4: 0,
    E5: 0
  }

  const validResults = results.filter(r => !r.error)
  validResults.forEach(r => {
    avgScores.E1 += r.metrics.E1.score
    avgScores.E2 += r.metrics.E2.score
    avgScores.E3 += r.metrics.E3.score
    avgScores.E4 += r.metrics.E4.score
    avgScores.E5 += r.metrics.E5.score
  })

  if (validResults.length > 0) {
    avgScores.E1 /= validResults.length
    avgScores.E2 /= validResults.length
    avgScores.E3 /= validResults.length
    avgScores.E4 /= validResults.length
    avgScores.E5 /= validResults.length

    console.log('Average Scores:')
    console.log(`  E1: ${avgScores.E1.toFixed(2)}/4.0`)
    console.log(`  E2: ${avgScores.E2.toFixed(2)}/3.0`)
    console.log(`  E3: ${avgScores.E3.toFixed(2)}/3.0`)
    console.log(`  E4: ${avgScores.E4.toFixed(2)}/5.0`)
    console.log(`  E5: ${avgScores.E5.toFixed(2)}/2.0`)
  }

  // Category breakdown
  console.log('\n\nResults by Category:')
  const categories = [...new Set(results.map(r => r.category))]
  for (const category of categories) {
    const categoryResults = validResults.filter(r => r.category === category)
    if (categoryResults.length > 0) {
      const avgE1 = categoryResults.reduce((sum, r) => sum + r.metrics.E1.score, 0) / categoryResults.length
      const avgE2 = categoryResults.reduce((sum, r) => sum + r.metrics.E2.score, 0) / categoryResults.length
      console.log(`  ${category}: E1=${avgE1.toFixed(1)} E2=${avgE2.toFixed(1)}`)
    }
  }

  // Recommendations generated
  console.log('\n\nRecommendations Generated:')
  let totalRecs = 0
  validResults.forEach(r => {
    Object.values(r.metrics).forEach(m => {
      if (m.recommendation) totalRecs++
    })
  })
  console.log(`  Total: ${totalRecs} recommendations across ${validResults.length} sites`)

  console.log('\n✅ Testing complete')
}

runTests().catch(console.error)
