/**
 * E3 Edge Case Tests
 * Test specific E3 pathways with mock content to validate detection accuracy
 */

import { detectOriginalAssets } from './lib/services/eeat-detectors/experience-detectors'
import type { PageAnalysis } from './lib/services/url-analyzer'

const EDGE_CASES = [
  {
    name: 'Visual asset references (Pathway 1)',
    mockContent: `
      As shown in Figure 1, the water intake recommendations vary by age.
      See the diagram below for detailed guidelines. Chart 2 illustrates the hydration levels.
      The infographic shows our custom analysis.
    `,
    images: { total: 3, withAlt: 2 },
    expectedPathways: ['Visual asset references'],
    expectedScore: 0.8 // visual assets only (Pathway 8 removed)
  },

  {
    name: 'Original research/data (Pathway 2)',
    mockContent: `
      Our study analyzed 10,000 patients over 5 years. Based on our data, we found significant improvements.
      We surveyed 500 nutrition experts. Our research team examined the effects.
      Sample meal plan: Breakfast includes oatmeal, lunch features grilled chicken.
    `,
    images: { total: 1, withAlt: 1 },
    expectedPathways: ['Original research/data'],
    expectedScore: 0.8
  },

  {
    name: 'Case studies (Pathway 3)',
    mockContent: `
      Case study: Maria, a 45-year-old patient, experienced significant improvements.
      Patient story: John's journey with nutrition. Real-world example from our clinic.
      Success story from our practice shows the effectiveness of this approach.
    `,
    images: { total: 5, withAlt: 3 },
    expectedPathways: ['Case studies', 'Team/facility'],
    expectedScore: 0.7 + 0.3 // case study + team ("our clinic")
  },

  {
    name: 'Before/after (Pathway 4)',
    mockContent: `
      Before and after photos show the transformation. Progress photos demonstrate the results.
      The comparison chart illustrates the changes over 6 months.
    `,
    images: { total: 10, withAlt: 8 },
    expectedPathways: ['Before/after'],
    expectedScore: 0.5 // before/after only (Pathway 8 removed)
  },

  {
    name: 'Tutorial/demo (Pathway 5)',
    mockContent: `
      Screenshot shows the interface. Follow these steps to complete the setup.
      Step 1: Open the application. Step 2: Click settings. Step 3: Configure options.
      Here's how to get started with the process. Try these steps for best results.
    `,
    images: { total: 4, withAlt: 4 },
    expectedPathways: ['Tutorial/demo'],
    expectedScore: 0.4 // tutorial only (Pathway 8 removed)
  },

  {
    name: 'Team/facility photos (Pathway 6)',
    mockContent: `
      Meet our team of nutrition experts at our clinic. Our practice has been serving
      the community for 20 years. About our team: Dr. Smith leads our research division.
      Our facility features state-of-the-art equipment.
    `,
    images: { total: 15, withAlt: 12 },
    expectedPathways: ['Original research', 'Team/facility'],
    expectedScore: 0.8 + 0.3 // research ("our research") + team (Pathway 8 removed)
  },

  {
    name: 'Multiple pathways combined',
    mockContent: `
      Figure 1 shows our study results. Our research analyzed 5,000 participants.
      Case study: Patient Sarah saw remarkable improvements. Before and after photos demonstrate progress.
      Screenshot of our custom tool. Meet our research team at the clinic.
    `,
    images: { total: 20, withAlt: 18 },
    expectedPathways: ['Visual assets', 'Original research', 'Case studies', 'Before/after', 'Tutorial', 'Team'],
    expectedScore: 3.0 // Should cap at maxScore (Pathway 8 removed)
  },

  {
    name: 'Generic numbered list (should NOT trigger tutorial)',
    mockContent: `
      Benefits of proper hydration include:
      First, improved energy levels.
      Second, better skin health.
      Third, enhanced cognitive function.
      Finally, optimal physical performance.
    `,
    images: { total: 8, withAlt: 6 },
    expectedPathways: [],
    expectedScore: 0.0 // Should NOT get ANY points (Pathway 8 removed, no original assets)
  },

  {
    name: 'Generic "our" mentions (should NOT trigger team)',
    mockContent: `
      Our website provides comprehensive nutrition information.
      Our articles are written by experts. Our mission is to educate readers.
      Our content undergoes rigorous fact-checking.
    `,
    images: { total: 3, withAlt: 2 },
    expectedPathways: [],
    expectedScore: 0.0 // Should NOT get ANY points (Pathway 8 removed, generic "our")
  },

  {
    name: 'Stock photos only (BUG FIX VALIDATION)',
    mockContent: `
      Water is essential for health. Drinking adequate amounts supports bodily functions.
      Stay hydrated throughout the day. Carry a water bottle with you.
    `,
    images: { total: 16, withAlt: 14 },
    expectedPathways: [],
    expectedScore: 0.0 // FIXED: Now scores 0 (no original assets detected)
  }
]

async function testE3EdgeCases() {
  console.log('🧪 E3 Edge Case Tests\n')
  console.log('Testing individual pathways with mock content\n')
  console.log('='.repeat(80) + '\n')

  let totalTests = 0
  let passedTests = 0
  let failedTests = 0
  const bugs: string[] = []

  for (const test of EDGE_CASES) {
    totalTests++

    const mockPageAnalysis: PageAnalysis = {
      url: 'https://example.com/test',
      finalUrl: 'https://example.com/test',
      canonicalUrl: null,
      title: 'Test Page',
      metaDescription: '',
      wordCount: test.mockContent.split(/\s+/).length,
      contentText: test.mockContent,
      headings: { h1: [], h2: [], h3: [] },
      hasSSL: true,
      authors: [],
      schemaMarkup: [],
      images: test.images,
      links: { internal: 0, external: 0 },
      citations: 0,
      citationQuality: null,
      readabilityScore: 0
    }

    const result = detectOriginalAssets(mockPageAnalysis)

    console.log(`📝 Test: ${test.name}`)
    console.log(`Score: ${result.actualScore.toFixed(2)}/3 (expected ~${test.expectedScore.toFixed(2)})`)
    console.log(`Evidence count: ${result.evidence.length}`)

    if (result.evidence.length > 0) {
      console.log('Evidence:')
      result.evidence.forEach(ev => {
        console.log(`  • [${ev.label}] ${ev.value}`)
      })
    }

    // Check if expected pathways were detected
    const detectedLabels = result.evidence.map(ev => ev.label).join(', ')
    console.log(`\nExpected: ${test.expectedPathways.join(', ')}`)
    console.log(`Detected: ${detectedLabels || '(none)'}`)

    // Simple pass/fail based on score proximity (within 0.3 points)
    const scoreDiff = Math.abs(result.actualScore - test.expectedScore)
    const passed = scoreDiff <= 0.3

    if (passed) {
      console.log('✅ PASS')
      passedTests++
    } else {
      console.log(`❌ FAIL (score difference: ${scoreDiff.toFixed(2)})`)
      failedTests++
    }

    if (test.bug) {
      console.log(`⚠️ BUG: ${test.bug}`)
      bugs.push(`${test.name}: ${test.bug}`)
    }

    console.log('\n' + '-'.repeat(80) + '\n')
  }

  // Summary
  console.log('='.repeat(80))
  console.log('📊 SUMMARY\n')
  console.log(`Total tests: ${totalTests}`)
  console.log(`✅ Passed: ${passedTests}`)
  console.log(`❌ Failed: ${failedTests}`)
  console.log(`Pass rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`)

  if (bugs.length > 0) {
    console.log('\n⚠️ BUGS IDENTIFIED:')
    bugs.forEach((bug, idx) => {
      console.log(`${idx + 1}. ${bug}`)
    })
  }

  console.log('\n✅ Test complete')
}

testE3EdgeCases().catch(console.error)
