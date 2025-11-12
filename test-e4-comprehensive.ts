/**
 * E4 Comprehensive Testing
 * Test E4 (Freshness) across diverse sites
 */

import { analyzeURL } from './lib/services/url-analyzer'
import { detectFreshness } from './lib/services/eeat-detectors/experience-detectors'

const TEST_SITES = [
  {
    url: 'https://www.healthline.com/nutrition/how-much-water-should-you-drink-per-day',
    label: 'Healthline (medical)',
    expectedBehavior: 'Medical site - should have date schema'
  },
  {
    url: 'https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/water/art-20044256',
    label: 'Mayo Clinic (medical)',
    expectedBehavior: 'Medical site - should have date schema'
  },
  {
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference',
    label: 'MDN (tech docs)',
    expectedBehavior: 'Documentation - may or may not have dates'
  },
  {
    url: 'https://en.wikipedia.org/wiki/JavaScript',
    label: 'Wikipedia',
    expectedBehavior: 'Encyclopedia - likely has revision dates'
  },
  {
    url: 'https://stackoverflow.com/questions/11227809/why-is-processing-a-sorted-array-faster-than-processing-an-unsorted-array',
    label: 'Stack Overflow',
    expectedBehavior: 'Q&A - has timestamps'
  }
]

async function testE4Comprehensive() {
  console.log('🧪 E4 COMPREHENSIVE TESTING\n')
  console.log(`Testing ${TEST_SITES.length} diverse sites\n`)
  console.log('='.repeat(80) + '\n')

  for (const site of TEST_SITES) {
    console.log(`📝 Testing: ${site.label}`)
    console.log(`URL: ${site.url}`)
    console.log(`Expected: ${site.expectedBehavior}\n`)

    try {
      const pageAnalysis = await analyzeURL(site.url)
      const e4 = detectFreshness(pageAnalysis)

      console.log(`Score: ${e4.actualScore.toFixed(2)}/${e4.maxScore} (${e4.status})`)
      console.log(`Evidence:`)
      e4.evidence.forEach(ev => {
        console.log(`  • [${ev.label || ev.type}] ${ev.value}`)
      })

      // Schema analysis
      const hasDateSchema = pageAnalysis.schemaMarkup.some(s =>
        s.data?.dateModified || s.data?.datePublished
      )
      console.log(`\nSchema with dates: ${hasDateSchema ? 'YES' : 'NO'}`)
      console.log(`Total schema items: ${pageAnalysis.schemaMarkup.length}`)

      if (hasDateSchema) {
        pageAnalysis.schemaMarkup.forEach(s => {
          if (s.data?.dateModified || s.data?.datePublished) {
            console.log(`  → ${s.type}: ${s.data?.dateModified || s.data?.datePublished}`)
          }
        })
      }

    } catch (error: any) {
      console.log(`❌ Error: ${error.message}`)
    }

    console.log('\n' + '-'.repeat(80) + '\n')
  }

  console.log('✅ Comprehensive testing complete')
}

testE4Comprehensive().catch(console.error)
