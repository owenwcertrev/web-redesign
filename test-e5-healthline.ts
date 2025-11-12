/**
 * E5 Test on Healthline
 * Test current E5 implementation
 */

import { analyzeURL } from './lib/services/url-analyzer'
import { detectExperienceMarkup } from './lib/services/eeat-detectors/experience-detectors'

async function testE5Healthline() {
  console.log('🧪 Testing E5 on Healthline\n')

  const url = 'https://www.healthline.com/nutrition/how-much-water-should-you-drink-per-day'

  console.log(`URL: ${url}\n`)

  const pageAnalysis = await analyzeURL(url)
  const e5 = detectExperienceMarkup(pageAnalysis)

  console.log('📊 E5 Results:')
  console.log(`Score: ${e5.actualScore}/${e5.maxScore}`)
  console.log(`Status: ${e5.status}`)
  console.log('\n🔍 Evidence:')
  e5.evidence.forEach((ev, idx) => {
    console.log(`${idx + 1}. ${ev.label}: ${ev.value}`)
  })

  console.log('\n📋 Schema Found:')
  pageAnalysis.schemaMarkup.forEach((s, idx) => {
    console.log(`${idx + 1}. @type: ${s.type}`)
  })

  console.log('\n✅ Test complete')
}

testE5Healthline().catch(console.error)
