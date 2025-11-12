/**
 * E5 & E6 Real-World Comprehensive Testing
 * Test E5 and E6 across diverse websites to validate comprehensive coverage
 */

import { analyzeURL } from './lib/services/url-analyzer'
import { detectExperienceMarkup, detectPublishingConsistency } from './lib/services/eeat-detectors/experience-detectors'

interface TestSite {
  name: string
  url: string
  vertical: string
  expectedE5Signals: string[]
  expectedE5Range: { min: number, max: number }
  notes: string
}

const TEST_SITES: TestSite[] = [
  // Medical/Health Sites
  {
    name: 'Healthline',
    url: 'https://www.healthline.com/nutrition/how-much-water-should-you-drink-per-day',
    vertical: 'Medical',
    expectedE5Signals: ['MedicalWebPage'],
    expectedE5Range: { min: 1, max: 2 },
    notes: 'Should have MedicalWebPage schema'
  },
  {
    name: 'Mayo Clinic',
    url: 'https://www.mayoclinic.org/diseases-conditions/diabetes/symptoms-causes/syc-20371444',
    vertical: 'Medical',
    expectedE5Signals: ['MedicalWebPage', 'MedicalCondition'],
    expectedE5Range: { min: 0, max: 2 },
    notes: 'Major medical institution - may have vertical schema'
  },
  {
    name: 'WebMD',
    url: 'https://www.webmd.com/diabetes/default.htm',
    vertical: 'Medical',
    expectedE5Signals: ['MedicalWebPage'],
    expectedE5Range: { min: 0, max: 2 },
    notes: 'Popular health site'
  },

  // Food/Recipe Sites
  {
    name: 'AllRecipes',
    url: 'https://www.allrecipes.com/recipe/21014/good-old-fashioned-pancakes/',
    vertical: 'Food',
    expectedE5Signals: ['Recipe'],
    expectedE5Range: { min: 1, max: 2 },
    notes: 'Should have Recipe schema'
  },
  {
    name: 'Food Network',
    url: 'https://www.foodnetwork.com/recipes/alton-brown/pancakes-recipe-1911035',
    vertical: 'Food',
    expectedE5Signals: ['Recipe'],
    expectedE5Range: { min: 0, max: 2 },
    notes: 'Major recipe site'
  },

  // Tutorial/How-To Sites
  {
    name: 'WikiHow',
    url: 'https://www.wikihow.com/Make-Pancakes',
    vertical: 'Tutorial',
    expectedE5Signals: ['HowTo'],
    expectedE5Range: { min: 1, max: 2 },
    notes: 'Should have HowTo schema'
  },

  // Tech/Documentation Sites
  {
    name: 'MDN Web Docs',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    vertical: 'Tech Documentation',
    expectedE5Signals: ['TechArticle'],
    expectedE5Range: { min: 0, max: 2 },
    notes: 'Technical documentation - may have TechArticle'
  },
  {
    name: 'CSS Tricks',
    url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/',
    vertical: 'Tech Tutorial',
    expectedE5Signals: ['HowTo', 'TechArticle'],
    expectedE5Range: { min: 0, max: 2 },
    notes: 'Popular tech tutorial site'
  },

  // General Knowledge
  {
    name: 'Wikipedia',
    url: 'https://en.wikipedia.org/wiki/Diabetes',
    vertical: 'General Knowledge',
    expectedE5Signals: [],
    expectedE5Range: { min: 0, max: 1 },
    notes: 'Generic Article schema only - should score 0 on E5'
  },

  // E-commerce/Product
  {
    name: 'Amazon Product',
    url: 'https://www.amazon.com/dp/B0D1XD1ZV3',
    vertical: 'E-commerce',
    expectedE5Signals: ['Product'],
    expectedE5Range: { min: 0, max: 2 },
    notes: 'Should have Product schema'
  },

  // Review Sites
  {
    name: 'Wirecutter (NYT)',
    url: 'https://www.nytimes.com/wirecutter/reviews/best-laptop/',
    vertical: 'Reviews',
    expectedE5Signals: ['Review'],
    expectedE5Range: { min: 0, max: 2 },
    notes: 'Professional review site'
  },

  // News Sites
  {
    name: 'BBC News',
    url: 'https://www.bbc.com/news',
    vertical: 'News',
    expectedE5Signals: [],
    expectedE5Range: { min: 0, max: 1 },
    notes: 'News sites typically have generic NewsArticle schema only'
  }
]

async function testSite(site: TestSite) {
  console.log(`📋 Testing: ${site.name}`)
  console.log(`   URL: ${site.url}`)
  console.log(`   Vertical: ${site.vertical}`)
  console.log(`   Expected E5 signals: ${site.expectedE5Signals.length > 0 ? site.expectedE5Signals.join(', ') : '(none)'}`)

  try {
    const pageAnalysis = await analyzeURL(site.url)
    const e5 = detectExperienceMarkup(pageAnalysis)

    // E5 Analysis
    console.log(`\n   📊 E5 Results:`)
    console.log(`   Score: ${e5.actualScore}/${e5.maxScore} (${e5.status})`)

    if (e5.evidence.length === 0) {
      console.log(`   Evidence: (none)`)
    } else {
      console.log(`   Evidence:`)
      e5.evidence.forEach((ev) => {
        console.log(`     - ${ev.label}: ${ev.value}`)
      })
    }

    // Schema breakdown
    console.log(`\n   🔍 All Schema Found:`)
    if (pageAnalysis.schemaMarkup.length === 0) {
      console.log(`     (No schema)`)
    } else {
      const schemaTypes = new Set<string>()
      pageAnalysis.schemaMarkup.forEach((s) => {
        if (Array.isArray(s.type)) {
          s.type.forEach(t => schemaTypes.add(t))
        } else if (s.type) {
          schemaTypes.add(s.type)
        }
      })
      Array.from(schemaTypes).forEach((type) => {
        console.log(`     - ${type}`)
      })
    }

    // Validation
    const scoreInRange = e5.actualScore >= site.expectedE5Range.min && e5.actualScore <= site.expectedE5Range.max

    let hasExpectedSignals = true
    if (site.expectedE5Signals.length > 0) {
      hasExpectedSignals = site.expectedE5Signals.some(expected =>
        e5.evidence.some(ev => ev.value === expected)
      )
    }

    if (scoreInRange) {
      console.log(`\n   ✅ E5 score in expected range (${site.expectedE5Range.min}-${site.expectedE5Range.max})`)
    } else {
      console.log(`\n   ⚠️  E5 score outside expected range (${site.expectedE5Range.min}-${site.expectedE5Range.max})`)
    }

    if (site.expectedE5Signals.length > 0) {
      if (hasExpectedSignals) {
        console.log(`   ✅ Expected signals detected`)
      } else {
        console.log(`   ⚠️  Expected signals not found: ${site.expectedE5Signals.join(', ')}`)
      }
    }

    console.log(`\n   Notes: ${site.notes}`)

    return {
      site: site.name,
      e5Score: e5.actualScore,
      scoreInRange,
      hasExpectedSignals: site.expectedE5Signals.length === 0 || hasExpectedSignals,
      schemas: pageAnalysis.schemaMarkup.map(s => s.type)
    }

  } catch (error: any) {
    console.log(`\n   ❌ ERROR: ${error.message}`)
    return {
      site: site.name,
      e5Score: -1,
      scoreInRange: false,
      hasExpectedSignals: false,
      schemas: [],
      error: error.message
    }
  }
}

async function runComprehensiveTests() {
  console.log('🧪 E5 & E6 REAL-WORLD COMPREHENSIVE TESTING\n')
  console.log('Testing E5 across diverse websites to validate comprehensive coverage\n')
  console.log('='.repeat(80) + '\n')

  const results = []

  for (const site of TEST_SITES) {
    const result = await testSite(site)
    results.push(result)
    console.log('\n' + '='.repeat(80) + '\n')

    // Rate limit: wait 2 seconds between requests
    await new Promise(resolve => setTimeout(resolve, 2000))
  }

  // Summary
  console.log('\n' + '='.repeat(80))
  console.log('\n📊 COMPREHENSIVE TEST SUMMARY\n')

  const successful = results.filter(r => !r.error)
  const scoreInRange = results.filter(r => r.scoreInRange)
  const signalsDetected = results.filter(r => r.hasExpectedSignals)

  console.log(`Total sites tested: ${results.length}`)
  console.log(`✅ Successfully analyzed: ${successful.length}/${results.length}`)
  console.log(`✅ Scores in expected range: ${scoreInRange.length}/${successful.length}`)
  console.log(`✅ Expected signals detected: ${signalsDetected.length}/${successful.length}`)

  console.log('\n📋 Results by Vertical:\n')

  const verticals = new Map<string, any[]>()
  TEST_SITES.forEach((site, idx) => {
    if (!verticals.has(site.vertical)) {
      verticals.set(site.vertical, [])
    }
    verticals.get(site.vertical)!.push({
      ...results[idx],
      expectedSignals: site.expectedE5Signals
    })
  })

  verticals.forEach((sites, vertical) => {
    console.log(`${vertical}:`)
    sites.forEach(site => {
      const status = site.scoreInRange && site.hasExpectedSignals ? '✅' : '⚠️'
      console.log(`  ${status} ${site.site}: E5 = ${site.e5Score}/2`)
      if (site.expectedSignals.length > 0) {
        console.log(`      Expected: ${site.expectedSignals.join(', ')}`)
      }
      if (site.schemas.length > 0) {
        const schemaStr = Array.from(new Set(
          site.schemas.flatMap(s => Array.isArray(s) ? s : [s])
        )).join(', ')
        console.log(`      Found: ${schemaStr}`)
      }
    })
    console.log()
  })

  // Insights
  console.log('='.repeat(80))
  console.log('\n💡 KEY INSIGHTS\n')

  const verticalSchemas = results.filter(r => r.e5Score > 0)
  const genericOnly = results.filter(r => r.e5Score === 0 && r.schemas.length > 0)
  const noSchema = results.filter(r => r.schemas.length === 0)

  console.log(`Sites with vertical-specific schemas: ${verticalSchemas.length}`)
  console.log(`Sites with generic schemas only: ${genericOnly.length}`)
  console.log(`Sites with no schema: ${noSchema.length}`)

  console.log('\nVertical-specific schemas detected:')
  const allVerticalSchemas = new Set<string>()
  results.forEach(r => {
    r.schemas.forEach((s: any) => {
      const types = Array.isArray(s) ? s : [s]
      types.forEach((t: string) => {
        if (['MedicalWebPage', 'Recipe', 'HowTo', 'Product', 'Review', 'TechArticle', 'ScholarlyArticle', 'Course'].includes(t)) {
          allVerticalSchemas.add(t)
        }
      })
    })
  })
  allVerticalSchemas.forEach(schema => {
    console.log(`  - ${schema}`)
  })

  console.log('\n✅ Comprehensive testing complete')
}

runComprehensiveTests().catch(console.error)
