/**
 * E3 Comprehensive Site Testing
 * Test E3 across 15-20 diverse sites to validate detection accuracy
 */

import { analyzeURL } from './lib/services/url-analyzer'
import { detectOriginalAssets } from './lib/services/eeat-detectors/experience-detectors'

interface TestSite {
  url: string
  label: string
  category: 'positive' | 'negative' | 'edge-case'
  expectedScore: 'zero' | 'low' | 'medium' | 'high'
  expectedPathways: string[]
  notes: string
}

const TEST_SITES: TestSite[] = [
  // ========================================
  // GROUP A: POSITIVE DETECTION (E3 > 0)
  // ========================================
  {
    url: 'https://www.healthline.com/nutrition/how-much-water-should-you-drink-per-day',
    label: 'Healthline (medical)',
    category: 'positive',
    expectedScore: 'zero',
    expectedPathways: [],
    notes: 'Stock photos only, no original assets (baseline test)'
  },
  {
    url: 'https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/water/art-20044256',
    label: 'Mayo Clinic (medical)',
    category: 'positive',
    expectedScore: 'zero',
    expectedPathways: [],
    notes: 'Conservative medical content, likely no original assets'
  },
  {
    url: 'https://www.nih.gov/news-events/nih-research-matters/drinking-caffeinated-beverages',
    label: 'NIH (medical research)',
    category: 'positive',
    expectedScore: 'medium',
    expectedPathways: ['Original research', 'Visual assets'],
    notes: 'Government research institution, expect original studies/data'
  },
  {
    url: 'https://www.nerdwallet.com/article/credit-cards/credit-score-range',
    label: 'NerdWallet (finance)',
    category: 'positive',
    expectedScore: 'high',
    expectedPathways: ['Visual assets', 'Original research'],
    notes: 'Finance content with custom charts/infographics'
  },
  {
    url: 'https://www.investopedia.com/terms/c/creditrating.asp',
    label: 'Investopedia (finance)',
    category: 'positive',
    expectedScore: 'low',
    expectedPathways: ['Visual assets'],
    notes: 'Educational finance, may have some original diagrams'
  },
  {
    url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/',
    label: 'CSS-Tricks (tech tutorial)',
    category: 'edge-case',
    expectedScore: 'zero',
    expectedPathways: [],
    notes: 'Has embedded SVG diagrams but NO explicit text references - E3 strict mode scores 0 (correct)'
  },
  {
    url: 'https://www.smashingmagazine.com/2023/01/guide-keyboard-accessibility-html-css-part1/',
    label: 'Smashing Magazine (tech)',
    category: 'positive',
    expectedScore: 'medium',
    expectedPathways: ['Tutorial', 'Visual assets'],
    notes: 'Tech articles with screenshots and examples'
  },

  // ========================================
  // GROUP B: NEGATIVE DETECTION (E3 = 0)
  // ========================================
  {
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference',
    label: 'MDN (documentation)',
    category: 'negative',
    expectedScore: 'zero',
    expectedPathways: [],
    notes: 'Documentation aggregator, no original assets'
  },
  {
    url: 'https://en.wikipedia.org/wiki/JavaScript',
    label: 'Wikipedia (encyclopedia)',
    category: 'negative',
    expectedScore: 'zero',
    expectedPathways: [],
    notes: 'Encyclopedia entry, synthesized information'
  },
  {
    url: 'https://news.ycombinator.com/',
    label: 'Hacker News (aggregator)',
    category: 'negative',
    expectedScore: 'zero',
    expectedPathways: [],
    notes: 'News aggregator, minimal visual content'
  },
  {
    url: 'https://www.reddit.com/r/programming/',
    label: 'Reddit (forum)',
    category: 'negative',
    expectedScore: 'zero',
    expectedPathways: [],
    notes: 'Discussion forum, user-generated content'
  },

  // ========================================
  // GROUP C: EDGE CASES
  // ========================================
  {
    url: 'https://www.webmd.com/diet/ss/slideshow-health-benefits-of-water',
    label: 'WebMD (slideshow)',
    category: 'edge-case',
    expectedScore: 'zero',
    expectedPathways: [],
    notes: 'Stock photos in slideshow format, test for false positives'
  },
  {
    url: 'https://www.google.com/search?q=water+intake+recommendations',
    label: 'Google Search (SERP)',
    category: 'edge-case',
    expectedScore: 'zero',
    expectedPathways: [],
    notes: 'Search results page, aggregated content'
  },
  {
    url: 'https://stackoverflow.com/questions/11227809/why-is-processing-a-sorted-array-faster-than-processing-an-unsorted-array',
    label: 'Stack Overflow (Q&A)',
    category: 'edge-case',
    expectedScore: 'zero',
    expectedPathways: [],
    notes: 'Q&A site, code examples but no original assets'
  }
]

interface TestResult {
  site: TestSite
  actualScore: number
  actualPathways: string[]
  evidence: any[]
  passed: boolean
  errors: string[]
}

async function runComprehensiveE3Tests() {
  console.log('🧪 E3 COMPREHENSIVE SITE TESTING\n')
  console.log(`Testing ${TEST_SITES.length} diverse sites across 3 categories\n`)
  console.log('='.repeat(100) + '\n')

  const results: TestResult[] = []
  let testCount = 0
  let passCount = 0
  let failCount = 0

  for (const site of TEST_SITES) {
    testCount++
    console.log(`[${testCount}/${TEST_SITES.length}] Testing: ${site.label}`)
    console.log(`URL: ${site.url}`)
    console.log(`Category: ${site.category} | Expected: ${site.expectedScore}`)
    console.log(`Notes: ${site.notes}\n`)

    const errors: string[] = []
    let actualScore = 0
    let actualPathways: string[] = []
    let evidence: any[] = []

    try {
      const pageAnalysis = await analyzeURL(site.url)
      const e3Result = detectOriginalAssets(pageAnalysis)

      actualScore = e3Result.actualScore
      evidence = e3Result.evidence
      actualPathways = evidence.map(ev => ev.label)

      console.log(`Score: ${actualScore.toFixed(2)}/3`)
      console.log(`Evidence count: ${evidence.length}`)

      if (evidence.length > 0) {
        console.log('Evidence:')
        evidence.forEach(ev => {
          console.log(`  • [${ev.label}] ${ev.value}`)
        })
      } else {
        console.log('  (No evidence)')
      }

      // Validate expectations
      let passed = true

      // Check score expectation
      if (site.expectedScore === 'zero' && actualScore !== 0) {
        errors.push(`Expected 0 score, got ${actualScore.toFixed(2)}`)
        passed = false
      } else if (site.expectedScore === 'low' && (actualScore < 0.3 || actualScore > 1.0)) {
        errors.push(`Expected low score (0.3-1.0), got ${actualScore.toFixed(2)}`)
        passed = false
      } else if (site.expectedScore === 'medium' && (actualScore < 1.0 || actualScore > 2.0)) {
        errors.push(`Expected medium score (1.0-2.0), got ${actualScore.toFixed(2)}`)
        passed = false
      } else if (site.expectedScore === 'high' && actualScore < 2.0) {
        errors.push(`Expected high score (2.0+), got ${actualScore.toFixed(2)}`)
        passed = false
      }

      // Check pathway expectations
      for (const expectedPathway of site.expectedPathways) {
        const found = actualPathways.some(ap =>
          ap.toLowerCase().includes(expectedPathway.toLowerCase())
        )
        if (!found) {
          errors.push(`Expected pathway "${expectedPathway}" not detected`)
          passed = false
        }
      }

      if (passed) {
        console.log('✅ PASS')
        passCount++
      } else {
        console.log('❌ FAIL')
        errors.forEach(err => console.log(`   ⚠️ ${err}`))
        failCount++
      }

      results.push({
        site,
        actualScore,
        actualPathways,
        evidence,
        passed,
        errors
      })

    } catch (error: any) {
      console.log(`❌ ERROR: ${error.message}`)
      errors.push(`Fetch error: ${error.message}`)
      failCount++

      results.push({
        site,
        actualScore: 0,
        actualPathways: [],
        evidence: [],
        passed: false,
        errors
      })
    }

    console.log('\n' + '-'.repeat(100) + '\n')
  }

  // ========================================
  // ANALYSIS & SUMMARY
  // ========================================
  console.log('='.repeat(100))
  console.log('📊 COMPREHENSIVE ANALYSIS\n')

  // Overall stats
  console.log('📈 OVERALL RESULTS:')
  console.log(`Total sites tested: ${testCount}`)
  console.log(`✅ Passed: ${passCount} (${((passCount / testCount) * 100).toFixed(1)}%)`)
  console.log(`❌ Failed: ${failCount} (${((failCount / testCount) * 100).toFixed(1)}%)`)

  // Category breakdown
  console.log('\n📊 BY CATEGORY:')
  const categories = ['positive', 'negative', 'edge-case'] as const
  categories.forEach(cat => {
    const catResults = results.filter(r => r.site.category === cat)
    const catPass = catResults.filter(r => r.passed).length
    const catTotal = catResults.length
    console.log(`${cat.toUpperCase()}: ${catPass}/${catTotal} passed (${((catPass / catTotal) * 100).toFixed(1)}%)`)
  })

  // Pathway detection accuracy
  console.log('\n🎯 PATHWAY DETECTION ACCURACY:')
  const pathwayStats = {
    'Visual assets': 0,
    'Original research': 0,
    'Case studies': 0,
    'Before/after': 0,
    'Tutorial': 0,
    'Team/facility': 0,
    'Schema': 0
  }

  results.forEach(r => {
    r.actualPathways.forEach(ap => {
      if (ap.includes('Visual asset')) pathwayStats['Visual assets']++
      if (ap.includes('Original research')) pathwayStats['Original research']++
      if (ap.includes('Case studies')) pathwayStats['Case studies']++
      if (ap.includes('Before/after')) pathwayStats['Before/after']++
      if (ap.includes('Tutorial')) pathwayStats['Tutorial']++
      if (ap.includes('Team/facility')) pathwayStats['Team/facility']++
      if (ap.includes('ImageObject')) pathwayStats['Schema']++
    })
  })

  Object.entries(pathwayStats).forEach(([pathway, count]) => {
    console.log(`  ${pathway}: ${count} detections`)
  })

  // False positives check
  console.log('\n⚠️ FALSE POSITIVE ANALYSIS:')
  const negativeResults = results.filter(r =>
    r.site.category === 'negative' ||
    (r.site.category === 'edge-case' && r.site.expectedScore === 'zero')
  )
  const falsePositives = negativeResults.filter(r => r.actualScore > 0)

  if (falsePositives.length > 0) {
    console.log(`❌ Found ${falsePositives.length} false positives:`)
    falsePositives.forEach(fp => {
      console.log(`  • ${fp.site.label}: ${fp.actualScore.toFixed(2)}/3`)
      fp.actualPathways.forEach(ap => console.log(`    - ${ap}`))
    })
  } else {
    console.log('✅ No false positives detected')
  }

  // Failed tests
  if (failCount > 0) {
    console.log('\n❌ FAILED TESTS:')
    results.filter(r => !r.passed).forEach(r => {
      console.log(`\n${r.site.label}:`)
      r.errors.forEach(err => console.log(`  • ${err}`))
    })
  }

  // Score distribution
  console.log('\n📊 SCORE DISTRIBUTION:')
  const scoreRanges = {
    '0.0': results.filter(r => r.actualScore === 0).length,
    '0.1-1.0': results.filter(r => r.actualScore > 0 && r.actualScore <= 1.0).length,
    '1.1-2.0': results.filter(r => r.actualScore > 1.0 && r.actualScore <= 2.0).length,
    '2.1-3.0': results.filter(r => r.actualScore > 2.0).length
  }

  Object.entries(scoreRanges).forEach(([range, count]) => {
    const bar = '█'.repeat(count)
    console.log(`  ${range.padEnd(10)} ${bar} (${count})`)
  })

  console.log('\n✅ Comprehensive testing complete')
}

runComprehensiveE3Tests().catch(console.error)
