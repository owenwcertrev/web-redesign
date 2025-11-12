/**
 * E5 Comprehensive Test
 * Test E5 across multiple sites with different vertical schemas
 */

import { analyzeURL } from './lib/services/url-analyzer'
import { detectExperienceMarkup } from './lib/services/eeat-detectors/experience-detectors'

interface TestSite {
  name: string
  url: string
  expectedVertical: string
  expectedSchemas: string[]
}

const TEST_SITES: TestSite[] = [
  {
    name: 'Healthline (Medical)',
    url: 'https://www.healthline.com/nutrition/how-much-water-should-you-drink-per-day',
    expectedVertical: 'Health',
    expectedSchemas: ['MedicalWebPage']
  },
  {
    name: 'AllRecipes (Food)',
    url: 'https://www.allrecipes.com/recipe/21014/good-old-fashioned-pancakes/',
    expectedVertical: 'Food/Recipe',
    expectedSchemas: ['Recipe']
  },
  {
    name: 'WikiHow (Tutorial)',
    url: 'https://www.wikihow.com/Make-Pancakes',
    expectedVertical: 'Tutorial',
    expectedSchemas: ['HowTo']
  }
]

async function testE5Comprehensive() {
  console.log('🧪 E5 COMPREHENSIVE TEST - VERTICAL SCHEMAS\n')
  console.log('Testing E5 across different content verticals\n')
  console.log('='.repeat(80) + '\n')

  for (const site of TEST_SITES) {
    console.log(`📋 Testing: ${site.name}`)
    console.log(`URL: ${site.url}`)
    console.log(`Expected vertical: ${site.expectedVertical}`)
    console.log(`Expected schemas: ${site.expectedSchemas.join(', ')}`)

    try {
      const pageAnalysis = await analyzeURL(site.url)
      const e5 = detectExperienceMarkup(pageAnalysis)

      console.log(`\n📊 E5 Results:`)
      console.log(`Score: ${e5.actualScore}/${e5.maxScore}`)
      console.log(`Status: ${e5.status}`)

      console.log(`\n🔍 Evidence:`)
      if (e5.evidence.length === 0) {
        console.log('  (No evidence found)')
      } else {
        e5.evidence.forEach((ev, idx) => {
          console.log(`  ${idx + 1}. ${ev.label}: ${ev.value}`)
        })
      }

      console.log(`\n📋 All Schema Found:`)
      if (pageAnalysis.schemaMarkup.length === 0) {
        console.log('  (No schema found)')
      } else {
        pageAnalysis.schemaMarkup.forEach((s, idx) => {
          console.log(`  ${idx + 1}. @type: ${s.type}`)
        })
      }

      const hasExpectedSchema = site.expectedSchemas.some(expected =>
        pageAnalysis.schemaMarkup.some(s => s.type === expected)
      )

      if (hasExpectedSchema && e5.actualScore > 0) {
        console.log(`\n✅ PASS: Detected ${site.expectedVertical} schema and scored > 0`)
      } else if (!hasExpectedSchema) {
        console.log(`\n⚠️ INFO: Expected schema not found on page (may have changed)`)
      } else {
        console.log(`\n❌ FAIL: Schema found but not scored`)
      }

    } catch (error: any) {
      console.log(`\n❌ ERROR: ${error.message}`)
    }

    console.log('\n' + '='.repeat(80) + '\n')
  }

  console.log('✅ Comprehensive E5 testing complete')
}

testE5Comprehensive().catch(console.error)
