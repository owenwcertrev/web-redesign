/**
 * E7 Comprehensive Test Suite
 * Test E7 (Content Freshness Rate) scoring accuracy across all scenarios
 */

import { detectContentFreshnessRate } from './lib/services/eeat-detectors/experience-detectors'
import type { PageAnalysis } from './lib/services/url-analyzer'

interface TestCase {
  name: string
  totalPosts: number
  freshPosts: number // Posts updated in last 12 months
  expectedFreshnessRate: number
  expectedScore: number
  expectedStatus: string
  notes: string
}

// Test cases covering all freshness rate ranges
const FRESHNESS_RATE_TESTS: TestCase[] = [
  {
    name: 'Excellent freshness (100% fresh)',
    totalPosts: 10,
    freshPosts: 10,
    expectedFreshnessRate: 100,
    expectedScore: 4,
    expectedStatus: 'excellent',
    notes: '100% of posts updated = 4pts'
  },
  {
    name: 'Excellent freshness (70% fresh)',
    totalPosts: 10,
    freshPosts: 7,
    expectedFreshnessRate: 70,
    expectedScore: 4,
    expectedStatus: 'excellent',
    notes: '70% threshold = 4pts'
  },
  {
    name: 'Good freshness (60% fresh)',
    totalPosts: 10,
    freshPosts: 6,
    expectedFreshnessRate: 60,
    expectedScore: 3,
    expectedStatus: 'good',
    notes: '50-70% range = 3pts'
  },
  {
    name: 'Good freshness (50% fresh)',
    totalPosts: 10,
    freshPosts: 5,
    expectedFreshnessRate: 50,
    expectedScore: 3,
    expectedStatus: 'good',
    notes: '50% threshold = 3pts'
  },
  {
    name: 'Needs improvement (40% fresh)',
    totalPosts: 10,
    freshPosts: 4,
    expectedFreshnessRate: 40,
    expectedScore: 2,
    expectedStatus: 'needs-improvement',
    notes: '30-50% range = 2pts'
  },
  {
    name: 'Needs improvement (30% fresh)',
    totalPosts: 10,
    freshPosts: 3,
    expectedFreshnessRate: 30,
    expectedScore: 2,
    expectedStatus: 'needs-improvement',
    notes: '30% threshold = 2pts'
  },
  {
    name: 'Poor freshness (20% fresh)',
    totalPosts: 10,
    freshPosts: 2,
    expectedFreshnessRate: 20,
    expectedScore: 1,
    expectedStatus: 'poor',
    notes: '10-30% range = 1pt'
  },
  {
    name: 'Poor freshness (10% fresh)',
    totalPosts: 10,
    freshPosts: 1,
    expectedFreshnessRate: 10,
    expectedScore: 1,
    expectedStatus: 'poor',
    notes: '10% threshold = 1pt'
  },
  {
    name: 'Very poor freshness (5% fresh)',
    totalPosts: 20,
    freshPosts: 1,
    expectedFreshnessRate: 5,
    expectedScore: 0.5,
    expectedStatus: 'poor',
    notes: '<10% = 0.5pts'
  },
  {
    name: 'No fresh posts (0% fresh)',
    totalPosts: 10,
    freshPosts: 0,
    expectedFreshnessRate: 0,
    expectedScore: 0.5,
    expectedStatus: 'poor',
    notes: '0% = 0.5pts'
  }
]

const EDGE_CASES: TestCase[] = [
  {
    name: 'Single post (100% fresh)',
    totalPosts: 1,
    freshPosts: 1,
    expectedFreshnessRate: 100,
    expectedScore: 4,
    expectedStatus: 'excellent',
    notes: 'Edge case: 1/1 = 100%'
  },
  {
    name: 'Single post (0% fresh)',
    totalPosts: 1,
    freshPosts: 0,
    expectedFreshnessRate: 0,
    expectedScore: 0.5,
    expectedStatus: 'poor',
    notes: 'Edge case: 0/1 = 0%'
  },
  {
    name: 'Large blog (150 posts, 80% fresh)',
    totalPosts: 150,
    freshPosts: 120,
    expectedFreshnessRate: 80,
    expectedScore: 4,
    expectedStatus: 'excellent',
    notes: 'Large blog with excellent freshness'
  },
  {
    name: 'Exact 69% (just below excellent)',
    totalPosts: 100,
    freshPosts: 69,
    expectedFreshnessRate: 69,
    expectedScore: 3,
    expectedStatus: 'good',
    notes: 'Just below 70% threshold'
  }
]

function createMockPost(monthsOld: number): any {
  const date = new Date()
  date.setMonth(date.getMonth() - monthsOld)

  const pageAnalysis: PageAnalysis = {
    url: 'https://example.com/post',
    finalUrl: 'https://example.com/post',
    canonicalUrl: null,
    title: 'Test Post',
    metaDescription: '',
    wordCount: 1000,
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

  return { pageAnalysis }
}

function createMockPosts(totalPosts: number, freshPosts: number): any[] {
  const posts = []

  // Create fresh posts (0-11 months old)
  for (let i = 0; i < freshPosts; i++) {
    const monthsOld = Math.floor(Math.random() * 12) // 0-11 months
    posts.push(createMockPost(monthsOld))
  }

  // Create old posts (13+ months old)
  for (let i = 0; i < totalPosts - freshPosts; i++) {
    const monthsOld = 13 + Math.floor(Math.random() * 24) // 13-36 months
    posts.push(createMockPost(monthsOld))
  }

  return posts
}

async function runTests() {
  console.log('🧪 E7 COMPREHENSIVE TEST SUITE\n')
  console.log('Testing E7 (Content Freshness Rate) scoring accuracy\n')
  console.log('='.repeat(80) + '\n')

  let totalPassed = 0
  let totalFailed = 0

  // Run freshness rate tests
  console.log('📋 FRESHNESS RATE TESTS\n')
  for (const test of FRESHNESS_RATE_TESTS) {
    const posts = createMockPosts(test.totalPosts, test.freshPosts)
    const result = detectContentFreshnessRate(undefined, posts)

    const passed = result.actualScore === test.expectedScore && result.status === test.expectedStatus

    if (passed) {
      console.log(`✅ ${test.name}`)
      console.log(`   Score: ${result.actualScore}/4 (${result.status})`)
      console.log(`   ${test.notes}`)
      totalPassed++
    } else {
      console.log(`❌ ${test.name}`)
      console.log(`   Expected: ${test.expectedScore}/4 (${test.expectedStatus})`)
      console.log(`   Got: ${result.actualScore}/4 (${result.status})`)
      console.log(`   Evidence: ${result.evidence[0]?.value}`)
      console.log(`   ${test.notes}`)
      totalFailed++
    }
    console.log()
  }

  // Run edge case tests
  console.log('='.repeat(80))
  console.log('\n📋 EDGE CASE TESTS\n')
  for (const test of EDGE_CASES) {
    const posts = createMockPosts(test.totalPosts, test.freshPosts)
    const result = detectContentFreshnessRate(undefined, posts)

    const passed = result.actualScore === test.expectedScore && result.status === test.expectedStatus

    if (passed) {
      console.log(`✅ ${test.name}`)
      console.log(`   Score: ${result.actualScore}/4 (${result.status})`)
      console.log(`   ${test.notes}`)
      totalPassed++
    } else {
      console.log(`❌ ${test.name}`)
      console.log(`   Expected: ${test.expectedScore}/4 (${test.expectedStatus})`)
      console.log(`   Got: ${result.actualScore}/4 (${result.status})`)
      console.log(`   Evidence: ${result.evidence[0]?.value}`)
      console.log(`   ${test.notes}`)
      totalFailed++
    }
    console.log()
  }

  // Test no posts
  console.log('='.repeat(80))
  console.log('\n📋 NO DATA TEST\n')

  const noPostsResult = detectContentFreshnessRate(undefined, [])
  if (noPostsResult.actualScore === 0 && noPostsResult.evidence.length > 0) {
    console.log('✅ No posts (empty array)')
    console.log(`   Score: ${noPostsResult.actualScore}/4 (${noPostsResult.status})`)
    console.log(`   Evidence: ${noPostsResult.evidence[0].value}`)
    totalPassed++
  } else {
    console.log('❌ No posts (empty array)')
    console.log(`   Expected: 0/4 with evidence`)
    console.log(`   Got: ${noPostsResult.actualScore}/4`)
    totalFailed++
  }
  console.log()

  const undefinedResult = detectContentFreshnessRate(undefined, undefined)
  if (undefinedResult.actualScore === 0 && undefinedResult.evidence.length > 0) {
    console.log('✅ No posts (undefined)')
    console.log(`   Score: ${undefinedResult.actualScore}/4 (${undefinedResult.status})`)
    console.log(`   Evidence: ${undefinedResult.evidence[0].value}`)
    totalPassed++
  } else {
    console.log('❌ No posts (undefined)')
    console.log(`   Expected: 0/4 with evidence`)
    console.log(`   Got: ${undefinedResult.actualScore}/4`)
    totalFailed++
  }
  console.log()

  // Test multiple schemas per post (potential double-counting bug)
  console.log('='.repeat(80))
  console.log('\n📋 SPECIAL CASE: Multiple Schemas Per Post\n')

  const multiSchemaPost = createMockPost(1) // 1 month old (fresh)
  multiSchemaPost.pageAnalysis.schemaMarkup.push({
    type: 'MedicalWebPage',
    data: {
      dateModified: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    }
  })
  multiSchemaPost.pageAnalysis.schemaMarkup.push({
    type: 'FAQPage',
    data: {
      dateModified: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    }
  })

  const multiSchemaPosts = [multiSchemaPost, createMockPost(24)] // 1 fresh, 1 old
  const multiSchemaResult = detectContentFreshnessRate(undefined, multiSchemaPosts)

  // Should be 50% (1 of 2 posts), NOT 150% (3 of 2 schemas)
  const expectedRate = 50
  const actualRate = parseInt(multiSchemaResult.evidence[0]?.value || '0')

  if (actualRate === expectedRate) {
    console.log(`✅ Multiple schemas per post (no double-counting)`)
    console.log(`   Evidence: ${multiSchemaResult.evidence[0]?.value}`)
    console.log(`   Score: ${multiSchemaResult.actualScore}/4`)
    console.log(`   Note: 1 post with 3 schemas should count as 1 fresh post, not 3`)
    totalPassed++
  } else {
    console.log(`❌ Multiple schemas per post (DOUBLE-COUNTING BUG!)`)
    console.log(`   Expected: 50% (1 of 2 posts)`)
    console.log(`   Got: ${multiSchemaResult.evidence[0]?.value}`)
    console.log(`   Score: ${multiSchemaResult.actualScore}/4`)
    console.log(`   BUG: Counting each schema instead of each post!`)
    totalFailed++
  }
  console.log()

  // Summary
  const totalTests = FRESHNESS_RATE_TESTS.length + EDGE_CASES.length + 2 + 1 // +2 for no data, +1 for multi-schema
  const passRate = ((totalPassed / totalTests) * 100).toFixed(1)

  console.log('='.repeat(80))
  console.log('\n📊 TEST SUMMARY\n')
  console.log(`Total tests: ${totalTests}`)
  console.log(`✅ Passed: ${totalPassed}`)
  console.log(`❌ Failed: ${totalFailed}`)
  console.log(`Pass rate: ${passRate}%`)

  if (passRate === '100.0') {
    console.log('\n🎉 ALL TESTS PASSED! E7 scoring is flawless!')
  } else {
    console.log('\n⚠️ Some tests failed - review failures above')
  }

  console.log('\n✅ Comprehensive E7 testing complete')
}

runTests().catch(console.error)
