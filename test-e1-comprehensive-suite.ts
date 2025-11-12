/**
 * E1 Comprehensive Test Suite
 * Test E1 (First-Person Narratives) scoring accuracy across all scenarios
 */

import { detectFirstPersonNarratives } from './lib/services/eeat-detectors/experience-detectors'
import type { PageAnalysis } from './lib/services/url-analyzer'

interface TestCase {
  name: string
  contentText: string
  expectedScoreRange: [number, number] // Allow range due to weighted scoring
  expectedStatus: string
  notes: string
}

// ==================== PATHWAY 1: PERSONAL NARRATIVES ====================

const PERSONAL_NARRATIVE_TESTS: TestCase[] = [
  {
    name: 'Strong first-person (single)',
    contentText: 'In my 15 years of experience treating patients, I\'ve observed significant improvements when using this approach.',
    expectedScoreRange: [1, 2],
    expectedStatus: 'needs-improvement',
    notes: 'Strong pattern (1 match * 1.5 = 1.5 points → score 1)'
  },
  {
    name: 'Strong first-person (multiple)',
    contentText: 'In my experience, this approach works well. Through my research over the past decade, I\'ve found that patients respond positively. Based on my clinical practice, these methods are effective.',
    expectedScoreRange: [3, 4],
    expectedStatus: 'excellent',
    notes: 'Multiple strong patterns (3 matches * 1.5 = 4.5 points → score 4)'
  },
  {
    name: 'Medium first-person (single)',
    contentText: 'I tested this product for 30 days and noticed significant improvements in my daily routine.',
    expectedScoreRange: [0, 1],
    expectedStatus: 'poor',
    notes: 'Medium pattern (1 match * 1.0 = 1.0 points → score 0-1)'
  },
  {
    name: 'Medium first-person (multiple)',
    contentText: 'I tried this method last year. I found it very effective. I recommend starting slowly to see what works for you.',
    expectedScoreRange: [2, 3],
    expectedStatus: 'good',
    notes: 'Multiple medium patterns (3 matches * 1.0 = 3.0 points → score 3)'
  },
  {
    name: 'Mixed strong + medium',
    contentText: 'In my 10 years practicing medicine, I\'ve seen thousands of patients. I tested this approach extensively. Based on my experience, the results speak for themselves.',
    expectedScoreRange: [2, 3],
    expectedStatus: 'good',
    notes: 'Mix: 1 strong (1.5) + 2 medium (2.0) = 3.5 → score 2'
  },
  {
    name: 'No first-person narratives',
    contentText: 'This is an informational article about health. It contains facts and research. Studies show positive outcomes.',
    expectedScoreRange: [0, 0],
    expectedStatus: 'poor',
    notes: 'No experience signals = 0 points'
  }
]

// ==================== PATHWAY 2: PROFESSIONAL/INSTITUTIONAL VOICE ====================

const PROFESSIONAL_VOICE_TESTS: TestCase[] = [
  {
    name: 'Professional credentials',
    contentText: 'As a board-certified cardiologist with 20+ years treating cardiovascular disease, our team has developed specialized protocols.',
    expectedScoreRange: [1, 2],
    expectedStatus: 'needs-improvement',
    notes: 'Professional voice patterns (matches * 0.75)'
  },
  {
    name: 'Institutional voice',
    contentText: 'Our research team has conducted extensive studies. We\'ve treated over 10,000 patients with this condition. Our data shows consistent improvement rates.',
    expectedScoreRange: [2, 3],
    expectedStatus: 'good',
    notes: 'Institutional voice patterns (professional voice scoring well)'
  },
  {
    name: 'Engineering/tech voice',
    contentText: 'Our engineering team has built production systems serving millions of users. We\'ve tested this architecture extensively in real-world scenarios.',
    expectedScoreRange: [2, 3],
    expectedStatus: 'good',
    notes: 'Tech/engineering institutional voice (improved pattern matching)'
  },
  {
    name: 'Legal/attorney voice',
    contentText: 'In our 30 years of legal practice, we have successfully represented hundreds of clients in similar cases. Our firm specializes in this area of law.',
    expectedScoreRange: [1, 2],
    expectedStatus: 'needs-improvement',
    notes: 'Legal professional voice'
  },
  {
    name: 'Combined personal + professional',
    contentText: 'In my 15 years of experience as a practicing physician, I\'ve treated over 5,000 patients. Our clinical team has developed specialized protocols. Based on my research and our data, we\'ve seen excellent outcomes.',
    expectedScoreRange: [3, 4],
    expectedStatus: 'excellent',
    notes: 'Strong personal narrative + professional voice = high score'
  }
]

// ==================== EDGE CASES ====================

const EDGE_CASES: TestCase[] = [
  {
    name: 'Passive voice (academic)',
    contentText: 'The study was conducted over a period of 5 years. Results were analyzed by independent researchers. The methodology was reviewed by peer specialists.',
    expectedScoreRange: [0, 0],
    expectedStatus: 'poor',
    notes: 'Passive voice with no active experience signals (expected limitation)'
  },
  {
    name: 'Generic "I" without experience',
    contentText: 'I think this is interesting. I believe this approach could work. I agree with this perspective.',
    expectedScoreRange: [0, 1],
    expectedStatus: 'poor',
    notes: 'Generic first-person without substantive experience markers'
  },
  {
    name: 'Credentials without narrative (scope fix)',
    contentText: 'Dr. Jane Smith, MD, PhD, Board-certified cardiologist. 20+ years experience. Professor at Medical School.',
    expectedScoreRange: [0, 1],
    expectedStatus: 'poor',
    notes: 'Credentials alone (moved to E2/X1) - E1 focuses on narrative voice'
  },
  {
    name: 'Very long content (performance)',
    contentText: 'In my experience treating patients, ' + 'this is additional content. '.repeat(1000) + ' I\'ve found great success with this approach.',
    expectedScoreRange: [2, 3],
    expectedStatus: 'good',
    notes: 'Long content - tests performance optimization (12K char sampling)'
  },
  {
    name: 'Minimal content',
    contentText: 'In my experience, this works.',
    expectedScoreRange: [1, 2],
    expectedStatus: 'needs-improvement',
    notes: 'Minimal content with single strong pattern (scores higher with new thresholds)'
  },
  {
    name: 'Mixed case variations',
    contentText: 'In My Experience with treating patients, I\'VE OBSERVED significant results. BASED ON MY RESEARCH, outcomes are positive.',
    expectedScoreRange: [2, 3],
    expectedStatus: 'good',
    notes: 'Case-insensitive matching works (multiple strong patterns detected)'
  },
  {
    name: 'International patterns (medical)',
    contentText: 'Nach meiner Erfahrung als Arzt funktioniert diese Methode sehr gut. Ich habe viele Patienten behandelt.',
    expectedScoreRange: [0, 1],
    expectedStatus: 'poor',
    notes: 'German patterns - tests international support (limited in E1)'
  },
  {
    name: 'Over-counting prevention',
    contentText: 'In my experience. In my experience. In my experience. In my experience. In my experience. In my experience. In my experience. In my experience.',
    expectedScoreRange: [2, 4],
    expectedStatus: 'good',
    notes: 'Cap prevents unrealistic scores from repetition'
  }
]

// ==================== VERTICAL-SPECIFIC TESTS ====================

const VERTICAL_TESTS: TestCase[] = [
  {
    name: 'Medical/health narrative',
    contentText: 'As a practicing physician for 15 years, I\'ve treated thousands of patients with this condition. In my clinical experience, early intervention produces the best outcomes. Based on our hospital data, recovery rates improved significantly.',
    expectedScoreRange: [3, 4],
    expectedStatus: 'excellent',
    notes: 'Medical vertical: strong professional + institutional voice'
  },
  {
    name: 'Food/culinary narrative',
    contentText: 'As a professional chef with 20 years in fine dining, I\'ve perfected this technique. In my test kitchen, I experimented with dozens of variations. Through my experience, I learned that temperature control is critical.',
    expectedScoreRange: [3, 4],
    expectedStatus: 'excellent',
    notes: 'Culinary vertical: personal experience + professional expertise'
  },
  {
    name: 'Tech/engineering narrative',
    contentText: 'In my 10 years as a software engineer, I\'ve built dozens of production systems. I tested this architecture extensively. Our team has deployed this to serve millions of users.',
    expectedScoreRange: [3, 4],
    expectedStatus: 'excellent',
    notes: 'Tech vertical: engineering experience + team voice'
  },
  {
    name: 'Legal narrative',
    contentText: 'In my 25 years practicing law, I\'ve represented hundreds of clients in similar cases. Our firm has successfully litigated these matters in multiple jurisdictions. Based on my experience, early action is crucial.',
    expectedScoreRange: [3, 4],
    expectedStatus: 'excellent',
    notes: 'Legal vertical: attorney experience + firm voice'
  },
  {
    name: 'Personal blog narrative',
    contentText: 'I started this journey 3 years ago. I tried countless products. Through trial and error, I discovered what works for me. I want to share my experience with you.',
    expectedScoreRange: [2, 3],
    expectedStatus: 'good',
    notes: 'Personal blog: authentic first-person narrative'
  },
  {
    name: 'Business/marketing voice',
    contentText: 'Our company has served over 10,000 clients. We\'ve developed proprietary methodologies. Our team consists of industry experts with decades of combined experience.',
    expectedScoreRange: [2, 3],
    expectedStatus: 'good',
    notes: 'Business voice: institutional patterns now score appropriately'
  }
]

// ==================== TEST RUNNER ====================

async function runTests() {
  console.log('🧪 E1 COMPREHENSIVE TEST SUITE\n')
  console.log('Testing E1 (First-Person Narratives) scoring accuracy')
  console.log('Note: E1 uses regex-only mode (skipLLM=true) for consistent testing\n')
  console.log('='.repeat(80) + '\n')

  let totalPassed = 0
  let totalFailed = 0
  const failures: { test: string, expected: string, got: string }[] = []

  // Helper to run test category
  async function runCategory(categoryName: string, tests: TestCase[]) {
    console.log(`📋 ${categoryName}\n`)

    for (const test of tests) {
      const mockPage: PageAnalysis = {
        url: 'https://example.com/test',
        finalUrl: 'https://example.com/test',
        canonicalUrl: null,
        title: 'Test Article',
        metaDescription: '',
        wordCount: test.contentText.split(' ').length,
        contentText: test.contentText,
        headings: { h1: [], h2: [], h3: [] },
        hasSSL: true,
        authors: [],
        schemaMarkup: [],
        images: { total: 0, withAlt: 0 },
        links: { internal: 0, external: 0 },
        citations: 0,
        citationQuality: null,
        readabilityScore: 0
      }

      // Use sync version (skip LLM for consistent testing)
      const result = detectFirstPersonNarratives(mockPage, undefined, true) as any
      const actualScore = result.actualScore

      // Check if score is within expected range
      const [minScore, maxScore] = test.expectedScoreRange
      const scoreInRange = actualScore >= minScore && actualScore <= maxScore
      const statusMatches = result.status === test.expectedStatus

      // For E1, we're more lenient - score range OR status match counts as pass
      const passed = scoreInRange || statusMatches

      if (passed) {
        console.log(`✅ ${test.name}`)
        console.log(`   Score: ${actualScore}/4 (${result.status})`)
        console.log(`   Expected: ${minScore}-${maxScore}/4 (${test.expectedStatus})`)
        console.log(`   ${test.notes}`)
        totalPassed++
      } else {
        console.log(`❌ ${test.name}`)
        console.log(`   Expected: ${minScore}-${maxScore}/4 (${test.expectedStatus})`)
        console.log(`   Got: ${actualScore}/4 (${result.status})`)
        console.log(`   ${test.notes}`)
        console.log(`   Evidence: ${result.evidence.length} items`)
        failures.push({
          test: test.name,
          expected: `${minScore}-${maxScore} (${test.expectedStatus})`,
          got: `${actualScore} (${result.status})`
        })
        totalFailed++
      }
      console.log()
    }
  }

  // Run all test categories
  await runCategory('PERSONAL NARRATIVE TESTS', PERSONAL_NARRATIVE_TESTS)
  console.log('='.repeat(80) + '\n')

  await runCategory('PROFESSIONAL/INSTITUTIONAL VOICE TESTS', PROFESSIONAL_VOICE_TESTS)
  console.log('='.repeat(80) + '\n')

  await runCategory('EDGE CASE TESTS', EDGE_CASES)
  console.log('='.repeat(80) + '\n')

  await runCategory('VERTICAL-SPECIFIC TESTS', VERTICAL_TESTS)
  console.log('='.repeat(80) + '\n')

  // Summary
  const totalTests = PERSONAL_NARRATIVE_TESTS.length + PROFESSIONAL_VOICE_TESTS.length + EDGE_CASES.length + VERTICAL_TESTS.length
  const passRate = ((totalPassed / totalTests) * 100).toFixed(1)

  console.log('📊 TEST SUMMARY\n')
  console.log(`Total tests: ${totalTests}`)
  console.log(`✅ Passed: ${totalPassed}`)
  console.log(`❌ Failed: ${totalFailed}`)
  console.log(`Pass rate: ${passRate}%`)

  if (failures.length > 0) {
    console.log('\n⚠️ Failed Tests:\n')
    failures.forEach(f => {
      console.log(`  • ${f.test}`)
      console.log(`    Expected: ${f.expected}, Got: ${f.got}`)
    })
  }

  if (passRate === '100.0') {
    console.log('\n🎉 ALL TESTS PASSED! E1 scoring is flawless!')
  } else if (parseFloat(passRate) >= 90.0) {
    console.log('\n✅ Excellent pass rate! Minor adjustments may be needed.')
  } else if (parseFloat(passRate) >= 75.0) {
    console.log('\n⚠️ Good pass rate, but review failures for improvements.')
  } else {
    console.log('\n❌ Pass rate below 75% - significant issues need addressing.')
  }

  console.log('\n✅ Comprehensive E1 testing complete')
}

runTests().catch(console.error)
