/**
 * E3 Comprehensive Test
 * Test E3 across diverse sites to identify bugs and scope violations
 */

import { analyzeURL } from './lib/services/url-analyzer'
import { detectOriginalAssets } from './lib/services/eeat-detectors/experience-detectors'

const TEST_URLS = [
  // BASELINE: Medical content (Healthline)
  {
    url: 'https://www.healthline.com/nutrition/how-much-water-should-you-drink-per-day',
    expected: 'Medical article with illustrations',
    label: 'Healthline (medical)'
  },

  // POSITIVE DETECTION: Sites with strong original assets
  {
    url: 'https://www.healthline.com/health/food-nutrition/benefits-of-honey',
    expected: 'Medical article with potential original assets',
    label: 'Healthline 2 (medical)'
  },

  // NEGATIVE DETECTION: Sites with minimal visual content
  {
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference',
    expected: 'Technical documentation, code examples',
    label: 'MDN (tech docs)'
  },

  // EDGE CASE: Mayo Clinic (medical, likely conservative with images)
  {
    url: 'https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/water/art-20044256',
    expected: 'Medical content with conservative image use',
    label: 'Mayo Clinic'
  },

  // EDGE CASE: WebMD (medical, typically many images)
  {
    url: 'https://www.webmd.com/diet/what-to-know-about-drinking-water',
    expected: 'Medical article with stock images',
    label: 'WebMD'
  }
]

async function testE3Comprehensive() {
  console.log('🧪 E3 Comprehensive Test - Diverse Sites\n')
  console.log('Testing E3 across different content types to identify bugs\n')
  console.log('=' .repeat(80) + '\n')

  const results: any[] = []

  for (const test of TEST_URLS) {
    console.log(`📝 Testing: ${test.label}`)
    console.log(`URL: ${test.url}`)
    console.log(`Expected: ${test.expected}\n`)

    try {
      const pageAnalysis = await analyzeURL(test.url)
      const e3 = detectOriginalAssets(pageAnalysis)

      console.log(`Score: ${e3.actualScore.toFixed(2)}/${e3.maxScore} (${e3.status})`)
      console.log(`Evidence count: ${e3.evidence.length}`)

      if (e3.evidence.length > 0) {
        console.log('Evidence:')
        e3.evidence.forEach(ev => {
          console.log(`  • [${ev.label}] ${ev.value}`)
        })
      } else {
        console.log('  (No evidence)')
      }

      results.push({
        label: test.label,
        url: test.url,
        score: e3.actualScore,
        status: e3.status,
        evidenceCount: e3.evidence.length,
        evidence: e3.evidence,
        imageCount: pageAnalysis.images.total
      })

      console.log('\n' + '-'.repeat(80) + '\n')
    } catch (error: any) {
      console.error(`❌ Error: ${error.message}\n`)
      console.log('-'.repeat(80) + '\n')
    }
  }

  // Analysis
  console.log('\n' + '='.repeat(80))
  console.log('📊 ANALYSIS\n')

  // Check for visual richness over-scoring
  console.log('🔍 Issue 1: Visual richness over-scoring (stock photos)?')
  const visualRichnessScores = results.filter(r =>
    r.evidence.some(ev => ev.label.includes('visual content'))
  )

  if (visualRichnessScores.length > 0) {
    console.log(`  Found ${visualRichnessScores.length} sites scoring from visual richness:`)
    visualRichnessScores.forEach(r => {
      const visualEv = r.evidence.find(ev => ev.label.includes('visual content'))
      console.log(`  • ${r.label}: ${visualEv.value} → ${r.score.toFixed(2)}/${r.evidenceCount - 1} pts from other pathways`)
    })
    console.log('  ⚠️ CONCERN: Pathway 8 awards points for ALL images, not just original assets')
  } else {
    console.log('  ✅ No sites scored from visual richness alone')
  }

  console.log('\n🔍 Issue 2: Tutorial pathway over-matching?')
  const tutorialScores = results.filter(r =>
    r.evidence.some(ev => ev.label.includes('Tutorial'))
  )

  if (tutorialScores.length > 0) {
    console.log(`  Found ${tutorialScores.length} sites with tutorial detection:`)
    tutorialScores.forEach(r => {
      const tutorialEv = r.evidence.find(ev => ev.label.includes('Tutorial'))
      console.log(`  • ${r.label}: "${tutorialEv.value}"`)
    })
  } else {
    console.log('  ✅ No false positives from tutorial patterns')
  }

  console.log('\n🔍 Issue 3: Team photo false positives?')
  const teamPhotoScores = results.filter(r =>
    r.evidence.some(ev => ev.label.includes('Team/facility'))
  )

  if (teamPhotoScores.length > 0) {
    console.log(`  Found ${teamPhotoScores.length} sites with team photo detection:`)
    teamPhotoScores.forEach(r => {
      const teamEv = r.evidence.find(ev => ev.label.includes('Team/facility'))
      console.log(`  • ${r.label}: "${teamEv.value}"`)
    })
  } else {
    console.log('  ✅ No team photo detections')
  }

  console.log('\n📈 Score Distribution:')
  results.forEach(r => {
    console.log(`  ${r.label.padEnd(30)} ${r.score.toFixed(2)}/${r.imageCount} images`)
  })

  console.log('\n✅ Test complete')
}

testE3Comprehensive().catch(console.error)
