/**
 * Quick Real-World E1-E7 Testing
 * Tests E1-E7 metrics across 6 representative websites
 */

import { analyzeURL } from './lib/services/url-analyzer'
import {
  detectFirstPersonNarratives,
  detectAuthorPerspectiveBlocks,
  detectFreshness
} from './lib/services/eeat-detectors/experience-detectors'

interface TestSite {
  name: string
  url: string
  vertical: string
  expectedStrengths: string[]
}

const TEST_SITES: TestSite[] = [
  {
    name: 'Healthline',
    url: 'https://www.healthline.com/nutrition/vitamin-d-deficiency-symptoms',
    vertical: 'Medical/Health',
    expectedStrengths: ['E2 (reviewers)', 'E4 (fresh)', 'E2 schema']
  },
  {
    name: 'CSS-Tricks',
    url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/',
    vertical: 'Tech/Web Development',
    expectedStrengths: ['E1 (personal narrative)', 'E4 (updates)', 'E2 (author perspective)']
  },
  {
    name: 'Investopedia',
    url: 'https://www.investopedia.com/terms/i/investing.asp',
    vertical: 'Finance/YMYL',
    expectedStrengths: ['E2 (reviewers)', 'E4 (updates)', 'E1 (professional)']
  },
  {
    name: 'Serious Eats',
    url: 'https://www.seriouseats.com/homemade-mayo',
    vertical: 'Food/Culinary',
    expectedStrengths: ['E1 (first-person)', 'E2 (author perspective)', 'E4 (dates)']
  },
  {
    name: 'Shopify Blog',
    url: 'https://www.shopify.com/blog/how-to-start-an-online-store',
    vertical: 'Business/Ecommerce',
    expectedStrengths: ['E1 (first-person)', 'E2 (author)', 'E4 (dates)']
  },
  {
    name: 'Besteverbaby',
    url: 'https://www.besteverbaby.com/',
    vertical: 'E-commerce',
    expectedStrengths: ['E1 (personal)', 'E4 (dates)']
  }
]

async function runRealWorldTests() {
  console.log('🌐 QUICK REAL-WORLD E1-E7 VALIDATION\\n')
  console.log(`Testing ${TEST_SITES.length} representative websites`)
  console.log('Focus: Validate E1, E2, E4 fixes in production\\n')
  console.log('='.repeat(80) + '\\n')

  const results: any[] = []

  for (const site of TEST_SITES) {
    console.log(`📍 ${site.name} (${site.vertical})`)

    try {
      const pageAnalysis = await analyzeURL(site.url)

      // Run E1, E2, E4 detectors (skip LLM for speed)
      const e1 = detectFirstPersonNarratives(pageAnalysis, undefined, true) as any
      const e2 = detectAuthorPerspectiveBlocks(pageAnalysis)
      const e4 = detectFreshness(pageAnalysis)

      results.push({
        name: site.name,
        vertical: site.vertical,
        e1: { score: e1.actualScore, status: e1.status, evidence: e1.evidence.length },
        e2: { score: e2.actualScore, status: e2.status, evidence: e2.evidence.length },
        e4: { score: e4.actualScore, status: e4.status, evidence: e4.evidence.length }
      })

      console.log(`   E1: ${e1.actualScore}/4 (${e1.status}) [${e1.evidence.length} evidence]`)
      console.log(`   E2: ${e2.actualScore}/3 (${e2.status}) [${e2.evidence.length} evidence]`)
      console.log(`   E4: ${e4.actualScore}/5 (${e4.status}) [${e4.evidence.length} evidence]`)

      // Show key evidence
      if (e1.evidence.length > 0) {
        const sample = e1.evidence[0].value.slice(0, 60)
        console.log(`   E1 sample: "${sample}..."`)
      }
      if (e2.evidence.length > 0) {
        console.log(`   E2 sample: "${e2.evidence[0].label}"`)
      }
      if (e4.evidence.length > 0) {
        console.log(`   E4 sample: "${e4.evidence[0].label}"`)
      }

      console.log(`   ✅ Success\\n`)

    } catch (error: any) {
      console.log(`   ❌ Error: ${error.message}\\n`)
      results.push({
        name: site.name,
        vertical: site.vertical,
        error: error.message
      })
    }
  }

  // Summary
  console.log('='.repeat(80) + '\\n')
  console.log('📊 SUMMARY\\n')

  const successfulTests = results.filter(r => !r.error)

  if (successfulTests.length > 0) {
    // E1 stats
    const e1Scores = successfulTests.map(r => r.e1.score)
    const e1Avg = (e1Scores.reduce((a, b) => a + b, 0) / e1Scores.length).toFixed(2)
    const e1ByStatus = {
      excellent: successfulTests.filter(r => r.e1.status === 'excellent').length,
      good: successfulTests.filter(r => r.e1.status === 'good').length,
      needs: successfulTests.filter(r => r.e1.status === 'needs-improvement').length,
      poor: successfulTests.filter(r => r.e1.status === 'poor').length
    }

    // E2 stats
    const e2Scores = successfulTests.map(r => r.e2.score)
    const e2Avg = (e2Scores.reduce((a, b) => a + b, 0) / e2Scores.length).toFixed(2)
    const e2ByStatus = {
      excellent: successfulTests.filter(r => r.e2.status === 'excellent').length,
      good: successfulTests.filter(r => r.e2.status === 'good').length,
      needs: successfulTests.filter(r => r.e2.status === 'needs-improvement').length,
      poor: successfulTests.filter(r => r.e2.status === 'poor').length
    }

    // E4 stats
    const e4Scores = successfulTests.map(r => r.e4.score)
    const e4Avg = (e4Scores.reduce((a, b) => a + b, 0) / e4Scores.length).toFixed(2)
    const e4ByStatus = {
      excellent: successfulTests.filter(r => r.e4.status === 'excellent').length,
      good: successfulTests.filter(r => r.e4.status === 'good').length,
      needs: successfulTests.filter(r => r.e4.status === 'needs-improvement').length,
      poor: successfulTests.filter(r => r.e4.status === 'poor').length
    }

    console.log(`E1 (First-Person Narratives): Avg ${e1Avg}/4`)
    console.log(`   ${e1ByStatus.excellent} excellent, ${e1ByStatus.good} good, ${e1ByStatus.needs} needs-improvement, ${e1ByStatus.poor} poor`)
    console.log()

    console.log(`E2 (Author Perspective): Avg ${e2Avg}/3`)
    console.log(`   ${e2ByStatus.excellent} excellent, ${e2ByStatus.good} good, ${e2ByStatus.needs} needs-improvement, ${e2ByStatus.poor} poor`)
    console.log()

    console.log(`E4 (Freshness): Avg ${e4Avg}/5`)
    console.log(`   ${e4ByStatus.excellent} excellent, ${e4ByStatus.good} good, ${e4ByStatus.needs} needs-improvement, ${e4ByStatus.poor} poor`)
    console.log()

    console.log(`✅ Successfully tested: ${successfulTests.length}/${TEST_SITES.length}`)

    if (results.length - successfulTests.length > 0) {
      console.log(`❌ Errors: ${results.length - successfulTests.length}`)
    }
  }

  console.log('\\n✅ Real-world validation complete')
}

runRealWorldTests().catch(console.error)
