/**
 * E4 Healthline Baseline Test
 * Test E4 (Freshness) on industry benchmark
 */

import { analyzeURL } from './lib/services/url-analyzer'
import { detectFreshness } from './lib/services/eeat-detectors/experience-detectors'

const HEALTHLINE_URL = 'https://www.healthline.com/nutrition/how-much-water-should-you-drink-per-day'

async function testE4Healthline() {
  console.log('🧪 E4 Healthline Baseline Test\n')
  console.log(`Testing URL: ${HEALTHLINE_URL}\n`)
  console.log('⏳ Analyzing...\n')

  const pageAnalysis = await analyzeURL(HEALTHLINE_URL)
  const e4 = detectFreshness(pageAnalysis)

  console.log('📊 E4 Results:')
  console.log(`Score: ${e4.actualScore.toFixed(2)}/${e4.maxScore} (${e4.status})`)
  console.log(`\nEvidence (${e4.evidence.length} items):`)

  e4.evidence.forEach((ev, idx) => {
    console.log(`${idx + 1}. [${ev.label || ev.type}]`)
    console.log(`   ${ev.value}`)
  })

  // Check schema dates
  console.log('\n📝 Schema Analysis:')
  const articleSchema = pageAnalysis.schemaMarkup.find(s =>
    s.type === 'Article' || s.type === 'MedicalWebPage'
  )

  if (articleSchema) {
    console.log(`Schema type: ${articleSchema.type}`)
    console.log(`datePublished: ${articleSchema.data?.datePublished || '(not found)'}`)
    console.log(`dateModified: ${articleSchema.data?.dateModified || '(not found)'}`)
  } else {
    console.log('No Article/MedicalWebPage schema found')
  }

  // Check for visible update notes
  const content = pageAnalysis.contentText.toLowerCase()
  const updatePatterns = [
    /updated:?\s+\w+\s+\d{1,2},?\s+\d{4}/gi,
    /last updated:?\s+\w+\s+\d{1,2},?\s+\d{4}/gi,
    /medically reviewed on:?\s+\w+\s+\d{1,2},?\s+\d{4}/gi
  ]

  console.log('\n🔍 Visible Update Notes Check:')
  let foundVisibleDate = false
  for (const pattern of updatePatterns) {
    const match = content.match(pattern)
    if (match) {
      console.log(`✅ Found: "${match[0]}"`)
      foundVisibleDate = true
    }
  }
  if (!foundVisibleDate) {
    console.log('❌ No visible update notes detected')
  }

  console.log('\n⚠️ Scope Gaps:')
  console.log('- Visible update notes: NOT implemented')
  console.log('- Fact-check dates: NOT implemented')

  console.log('\n✅ Test complete')
}

testE4Healthline().catch(console.error)
