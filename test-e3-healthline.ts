/**
 * E3 Healthline Baseline Test
 * Test E3 (Original assets) on industry benchmark to establish expected behavior
 */

import { analyzeURL } from './lib/services/url-analyzer'
import { detectOriginalAssets } from './lib/services/eeat-detectors/experience-detectors'

const HEALTHLINE_URL = 'https://www.healthline.com/nutrition/how-much-water-should-you-drink-per-day'

async function testE3Healthline() {
  console.log('🧪 E3 Healthline Baseline Test\n')
  console.log(`Testing URL: ${HEALTHLINE_URL}\n`)
  console.log('⏳ Analyzing...\n')

  const pageAnalysis = await analyzeURL(HEALTHLINE_URL)
  const e3 = detectOriginalAssets(pageAnalysis)

  if (!e3) {
    console.error('❌ E3 metric not found in results')
    return
  }

  console.log('📊 E3 Results:')
  console.log(`Score: ${e3.actualScore.toFixed(2)}/${e3.maxScore} (${e3.status})`)
  console.log(`\nEvidence (${e3.evidence.length} items):`)

  e3.evidence.forEach((ev, idx) => {
    console.log(`${idx + 1}. [${ev.label}]`)
    console.log(`   ${ev.value}`)
  })

  // Analyze detection patterns
  console.log('\n🔍 Detection Analysis:')
  const pathwayDetection = {
    visualAssets: e3.evidence.some(ev => ev.label.includes('Visual asset')),
    originalData: e3.evidence.some(ev => ev.label.includes('Original research')),
    caseStudies: e3.evidence.some(ev => ev.label.includes('Case studies')),
    beforeAfter: e3.evidence.some(ev => ev.label.includes('Before/after')),
    tutorial: e3.evidence.some(ev => ev.label.includes('Tutorial')),
    teamPhotos: e3.evidence.some(ev => ev.label.includes('Team/facility')),
    schemaImage: e3.evidence.some(ev => ev.label.includes('ImageObject')),
    visualRichness: e3.evidence.some(ev => ev.label.includes('visual content'))
  }

  Object.entries(pathwayDetection).forEach(([pathway, detected]) => {
    console.log(`${detected ? '✅' : '❌'} ${pathway}`)
  })

  // Check for potential issues
  console.log('\n⚠️ Checking for potential issues:')

  // Issue 1: Tutorial pathway over-matching numbered lists?
  if (pathwayDetection.tutorial) {
    const tutorialEvidence = e3.evidence.find(ev => ev.label.includes('Tutorial'))
    console.log(`📝 Tutorial detected: "${tutorialEvidence?.value}"`)
    console.log('   → Check: Is this a real tutorial or just a numbered list?')
  }

  // Issue 2: Team photos - is there actual photography?
  if (pathwayDetection.teamPhotos) {
    const teamEvidence = e3.evidence.find(ev => ev.label.includes('Team/facility'))
    console.log(`📸 Team photo detected: "${teamEvidence?.value}"`)
    console.log('   → Check: Does the page actually have team/facility photos?')
  }

  // Issue 3: Visual richness - are these original or stock?
  if (pathwayDetection.visualRichness) {
    const visualEvidence = e3.evidence.find(ev => ev.label.includes('visual content'))
    console.log(`🖼️ Visual richness: ${visualEvidence?.value}`)
    console.log('   → Check: Are these original images or stock photos?')
  }

  console.log('\n✅ Test complete')
}

testE3Healthline().catch(console.error)
