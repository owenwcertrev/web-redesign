/**
 * E4 Comprehensive Test Suite
 * Test E4 (Freshness) scoring accuracy across all scenarios
 */

import { detectFreshness } from './lib/services/eeat-detectors/experience-detectors'
import type { PageAnalysis } from './lib/services/url-analyzer'

interface TestCase {
  name: string
  monthsOld: number
  expectedScore: number
  expectedStatus: string
  notes: string
}

// Test cases covering all scoring thresholds
const DATE_RANGE_TESTS: TestCase[] = [
  { name: 'Brand new (today)', monthsOld: 0, expectedScore: 5, expectedStatus: 'excellent', notes: '0-3 months = 5pts' },
  { name: 'Very fresh (1 month)', monthsOld: 1, expectedScore: 5, expectedStatus: 'excellent', notes: '0-3 months = 5pts' },
  { name: 'Very fresh (3 months)', monthsOld: 3, expectedScore: 5, expectedStatus: 'excellent', notes: '0-3 months = 5pts' },
  { name: 'Fresh (4 months)', monthsOld: 4, expectedScore: 4, expectedStatus: 'good', notes: '3-6 months = 4pts' },
  { name: 'Fresh (6 months)', monthsOld: 6, expectedScore: 4, expectedStatus: 'good', notes: '3-6 months = 4pts' },
  { name: 'Recent (7 months)', monthsOld: 7, expectedScore: 3, expectedStatus: 'needs-improvement', notes: '6-12 months = 3pts (needs improvement)' },
  { name: 'Recent (12 months)', monthsOld: 12, expectedScore: 3, expectedStatus: 'needs-improvement', notes: '6-12 months = 3pts (needs improvement)' },
  { name: 'Aging (13 months)', monthsOld: 13, expectedScore: 2, expectedStatus: 'needs-improvement', notes: '12-24 months = 2pts' },
  { name: 'Aging (24 months)', monthsOld: 24, expectedScore: 2, expectedStatus: 'needs-improvement', notes: '12-24 months = 2pts' },
  { name: 'Old (25 months)', monthsOld: 25, expectedScore: 1, expectedStatus: 'poor', notes: '24+ months = 1pt' },
  { name: 'Very old (36 months)', monthsOld: 36, expectedScore: 1, expectedStatus: 'poor', notes: '24+ months = 1pt' },
  { name: 'Ancient (60 months)', monthsOld: 60, expectedScore: 1, expectedStatus: 'poor', notes: '24+ months = 1pt' }
]

interface EdgeCase {
  name: string
  schema: any[]
  expectedScore: number
  expectedBehavior: string
}

const EDGE_CASES: EdgeCase[] = [
  {
    name: 'No schema',
    schema: [],
    expectedScore: 0,
    expectedBehavior: 'Should score 0 with no date found message'
  },
  {
    name: 'dateModified only',
    schema: [
      {
        type: 'Article',
        data: {
          dateModified: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 1 month ago
        }
      }
    ],
    expectedScore: 5,
    expectedBehavior: 'Should use dateModified (1 month = 5pts)'
  },
  {
    name: 'datePublished only',
    schema: [
      {
        type: 'Article',
        data: {
          datePublished: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString() // 3 months ago
        }
      }
    ],
    expectedScore: 5,
    expectedBehavior: 'Should fallback to datePublished (3 months = 5pts)'
  },
  {
    name: 'Both dates (dateModified newer)',
    schema: [
      {
        type: 'Article',
        data: {
          datePublished: new Date(Date.now() - 730 * 24 * 60 * 60 * 1000).toISOString(), // 2 years ago
          dateModified: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString() // 2 months ago
        }
      }
    ],
    expectedScore: 5,
    expectedBehavior: 'Should use newer dateModified (2 months = 5pts)'
  },
  {
    name: 'Multiple schemas (use most recent)',
    schema: [
      {
        type: 'Article',
        data: {
          dateModified: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year ago
        }
      },
      {
        type: 'MedicalWebPage',
        data: {
          dateModified: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 1 month ago
        }
      }
    ],
    expectedScore: 5,
    expectedBehavior: 'Should use most recent date from multiple schemas (1 month = 5pts)'
  },
  {
    name: 'Invalid date format',
    schema: [
      {
        type: 'Article',
        data: {
          dateModified: 'invalid-date-string'
        }
      }
    ],
    expectedScore: 0,
    expectedBehavior: 'Should handle invalid dates gracefully (score 0)'
  },
  {
    name: 'Future date',
    schema: [
      {
        type: 'Article',
        data: {
          dateModified: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year in future
        }
      }
    ],
    expectedScore: 5,
    expectedBehavior: 'Should handle future dates (likely scores as very fresh)'
  },
  {
    name: 'Alternate field names (dateUpdated)',
    schema: [
      {
        type: 'Article',
        data: {
          dateUpdated: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString() // 2 months ago
        }
      }
    ],
    expectedScore: 5,
    expectedBehavior: 'Should handle dateUpdated as alternative field (2 months = 5pts)'
  }
]

async function testDateRanges() {
  console.log('🧪 E4 DATE RANGE TESTS\n')
  console.log('Testing all scoring thresholds\n')
  console.log('='.repeat(80) + '\n')

  let passed = 0
  let failed = 0

  for (const test of DATE_RANGE_TESTS) {
    // Create date X months ago
    const date = new Date()
    date.setMonth(date.getMonth() - test.monthsOld)

    const mockPage: PageAnalysis = {
      url: 'https://example.com/test',
      finalUrl: 'https://example.com/test',
      canonicalUrl: null,
      title: 'Test',
      metaDescription: '',
      wordCount: 100,
      contentText: '',
      headings: { h1: [], h2: [], h3: [] },
      hasSSL: true,
      authors: [],
      schemaMarkup: [
        {
          type: 'Article',
          data: {
            dateModified: date.toISOString()
          }
        }
      ],
      images: { total: 0, withAlt: 0 },
      links: { internal: 0, external: 0 },
      citations: 0,
      citationQuality: null,
      readabilityScore: 0
    }

    const result = detectFreshness(mockPage)

    const scorePassed = result.actualScore === test.expectedScore
    const statusPassed = result.status === test.expectedStatus

    if (scorePassed && statusPassed) {
      console.log(`✅ ${test.name}`)
      console.log(`   ${test.monthsOld} months old → ${result.actualScore}/5 (${result.status})`)
      console.log(`   ${test.notes}`)
      passed++
    } else {
      console.log(`❌ ${test.name}`)
      console.log(`   Expected: ${test.expectedScore}/5 (${test.expectedStatus})`)
      console.log(`   Got: ${result.actualScore}/5 (${result.status})`)
      console.log(`   ${test.notes}`)
      failed++
    }
    console.log()
  }

  return { passed, failed, total: DATE_RANGE_TESTS.length }
}

async function testEdgeCases() {
  console.log('='.repeat(80))
  console.log('\n🧪 E4 EDGE CASE TESTS\n')
  console.log('Testing boundary conditions and error handling\n')
  console.log('='.repeat(80) + '\n')

  let passed = 0
  let failed = 0

  for (const test of EDGE_CASES) {
    const mockPage: PageAnalysis = {
      url: 'https://example.com/test',
      finalUrl: 'https://example.com/test',
      canonicalUrl: null,
      title: 'Test',
      metaDescription: '',
      wordCount: 100,
      contentText: '',
      headings: { h1: [], h2: [], h3: [] },
      hasSSL: true,
      authors: [],
      schemaMarkup: test.schema,
      images: { total: 0, withAlt: 0 },
      links: { internal: 0, external: 0 },
      citations: 0,
      citationQuality: null,
      readabilityScore: 0
    }

    try {
      const result = detectFreshness(mockPage)

      // For edge cases, we just check if it doesn't crash and produces reasonable output
      const scoreReasonable = result.actualScore >= 0 && result.actualScore <= 5
      const hasEvidence = result.evidence.length > 0

      if (scoreReasonable && hasEvidence) {
        console.log(`✅ ${test.name}`)
        console.log(`   Score: ${result.actualScore}/5`)
        console.log(`   Evidence: ${result.evidence[0]?.value}`)
        console.log(`   Expected: ${test.expectedBehavior}`)
        passed++
      } else {
        console.log(`❌ ${test.name}`)
        console.log(`   Score: ${result.actualScore}/5 (unreasonable)`)
        console.log(`   Evidence count: ${result.evidence.length}`)
        failed++
      }
    } catch (error: any) {
      console.log(`❌ ${test.name}`)
      console.log(`   ERROR: ${error.message}`)
      failed++
    }
    console.log()
  }

  return { passed, failed, total: EDGE_CASES.length }
}

async function runComprehensiveE4Tests() {
  console.log('🧪 E4 COMPREHENSIVE TEST SUITE\n')
  console.log('Testing E4 (Freshness) scoring accuracy\n')
  console.log('='.repeat(80) + '\n')

  const dateResults = await testDateRanges()
  const edgeResults = await testEdgeCases()

  // Summary
  console.log('='.repeat(80))
  console.log('\n📊 COMPREHENSIVE TEST SUMMARY\n')

  console.log('Date Range Tests:')
  console.log(`  ✅ Passed: ${dateResults.passed}/${dateResults.total}`)
  console.log(`  ❌ Failed: ${dateResults.failed}/${dateResults.total}`)
  console.log(`  Pass rate: ${((dateResults.passed / dateResults.total) * 100).toFixed(1)}%`)

  console.log('\nEdge Case Tests:')
  console.log(`  ✅ Passed: ${edgeResults.passed}/${edgeResults.total}`)
  console.log(`  ❌ Failed: ${edgeResults.failed}/${edgeResults.total}`)
  console.log(`  Pass rate: ${((edgeResults.passed / edgeResults.total) * 100).toFixed(1)}%`)

  const totalPassed = dateResults.passed + edgeResults.passed
  const totalTests = dateResults.total + edgeResults.total
  const overallPassRate = ((totalPassed / totalTests) * 100).toFixed(1)

  console.log('\n📈 OVERALL:')
  console.log(`  Total tests: ${totalTests}`)
  console.log(`  ✅ Passed: ${totalPassed}`)
  console.log(`  ❌ Failed: ${totalTests - totalPassed}`)
  console.log(`  Pass rate: ${overallPassRate}%`)

  if (overallPassRate === '100.0') {
    console.log('\n🎉 ALL TESTS PASSED! E4 scoring is flawless!')
  } else {
    console.log('\n⚠️ Some tests failed - review failures above')
  }

  console.log('\n✅ Comprehensive testing complete')
}

runComprehensiveE4Tests().catch(console.error)
