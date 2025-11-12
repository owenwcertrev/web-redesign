/**
 * E6 Comprehensive Test Suite
 * Test E6 (Publishing Consistency) scoring accuracy across all scenarios
 */

import { detectPublishingConsistency } from './lib/services/eeat-detectors/experience-detectors'
import type { BlogInsights } from './lib/types/blog-analysis'

interface TestCase {
  name: string
  postsPerMonth: number
  trend: 'increasing' | 'decreasing' | 'stable' | 'irregular' | 'unknown'
  totalPosts: number
  spanMonths: number
  expectedScore: number
  expectedStatus: string
  notes: string
}

// Test cases covering all frequency ranges
const FREQUENCY_TESTS: TestCase[] = [
  {
    name: 'Optimal frequency (5 posts/month, stable)',
    postsPerMonth: 5,
    trend: 'stable',
    totalPosts: 60,
    spanMonths: 12,
    expectedScore: 4,
    expectedStatus: 'excellent',
    notes: '4-8 posts/month = 4pts (optimal)'
  },
  {
    name: 'Optimal frequency (4 posts/month, stable)',
    postsPerMonth: 4,
    trend: 'stable',
    totalPosts: 48,
    spanMonths: 12,
    expectedScore: 4,
    expectedStatus: 'excellent',
    notes: 'Lower bound of optimal range'
  },
  {
    name: 'Optimal frequency (8 posts/month, stable)',
    postsPerMonth: 8,
    trend: 'stable',
    totalPosts: 96,
    spanMonths: 12,
    expectedScore: 4,
    expectedStatus: 'excellent',
    notes: 'Upper bound of optimal range'
  },
  {
    name: 'Good frequency (2 posts/month, stable)',
    postsPerMonth: 2,
    trend: 'stable',
    totalPosts: 24,
    spanMonths: 12,
    expectedScore: 3,
    expectedStatus: 'good',
    notes: '2-12 posts/month = 3pts (good)'
  },
  {
    name: 'Good frequency (12 posts/month, stable)',
    postsPerMonth: 12,
    trend: 'stable',
    totalPosts: 144,
    spanMonths: 12,
    expectedScore: 3,
    expectedStatus: 'good',
    notes: 'Upper bound of good range'
  },
  {
    name: 'Acceptable frequency (1 post/month, stable)',
    postsPerMonth: 1,
    trend: 'stable',
    totalPosts: 12,
    spanMonths: 12,
    expectedScore: 2,
    expectedStatus: 'needs-improvement',
    notes: '≥1 post/month = 2pts (acceptable)'
  },
  {
    name: 'Infrequent (0.5 posts/month, stable)',
    postsPerMonth: 0.5,
    trend: 'stable',
    totalPosts: 6,
    spanMonths: 12,
    expectedScore: 1,
    expectedStatus: 'poor',
    notes: '≥0.5 posts/month = 1pt (infrequent)'
  },
  {
    name: 'Abandoned (<0.5 posts/month)',
    postsPerMonth: 0.3,
    trend: 'stable',
    totalPosts: 4,
    spanMonths: 12,
    expectedScore: 0,
    expectedStatus: 'poor',
    notes: '<0.5 posts/month = 0pts (abandoned)'
  }
]

const TREND_TESTS: TestCase[] = [
  {
    name: 'Increasing trend (good frequency)',
    postsPerMonth: 3,
    trend: 'increasing',
    totalPosts: 36,
    spanMonths: 12,
    expectedScore: 3.5,
    expectedStatus: 'excellent',
    notes: '3pts base + 0.5 increasing bonus = 3.5pts'
  },
  {
    name: 'Decreasing trend (good frequency)',
    postsPerMonth: 3,
    trend: 'decreasing',
    totalPosts: 36,
    spanMonths: 12,
    expectedScore: 2.5,
    expectedStatus: 'good',
    notes: '3pts base - 0.5 decreasing penalty = 2.5pts'
  },
  {
    name: 'Increasing trend (optimal frequency, capped)',
    postsPerMonth: 5,
    trend: 'increasing',
    totalPosts: 60,
    spanMonths: 12,
    expectedScore: 4,
    expectedStatus: 'excellent',
    notes: '4pts base + 0.5 bonus = 4.5, capped at maxScore 4'
  },
  {
    name: 'Decreasing trend (infrequent)',
    postsPerMonth: 0.5,
    trend: 'decreasing',
    totalPosts: 6,
    spanMonths: 12,
    expectedScore: 0.5,
    expectedStatus: 'poor',
    notes: '1pt base - 0.5 decreasing penalty = 0.5pts'
  },
  {
    name: 'Stable trend (no modifier)',
    postsPerMonth: 5,
    trend: 'stable',
    totalPosts: 60,
    spanMonths: 12,
    expectedScore: 4,
    expectedStatus: 'excellent',
    notes: 'Stable trend = no bonus/penalty'
  },
  {
    name: 'Irregular trend (should be neutral)',
    postsPerMonth: 5,
    trend: 'irregular',
    totalPosts: 60,
    spanMonths: 12,
    expectedScore: 4,
    expectedStatus: 'excellent',
    notes: 'Irregular trend currently treated as stable (no modifier)'
  },
  {
    name: 'Unknown trend (should be neutral)',
    postsPerMonth: 5,
    trend: 'unknown',
    totalPosts: 60,
    spanMonths: 12,
    expectedScore: 4,
    expectedStatus: 'excellent',
    notes: 'Unknown trend currently treated as stable (no modifier)'
  }
]

const EDGE_CASES: TestCase[] = [
  {
    name: 'Very high frequency (20 posts/month)',
    postsPerMonth: 20,
    trend: 'stable',
    totalPosts: 240,
    spanMonths: 12,
    expectedScore: 2,
    expectedStatus: 'needs-improvement',
    notes: 'Above optimal range (>12) = acceptable (2pts) - may indicate thin content'
  },
  {
    name: 'Decreasing from abandoned (cannot go below 0)',
    postsPerMonth: 0.3,
    trend: 'decreasing',
    totalPosts: 4,
    spanMonths: 12,
    expectedScore: 0,
    expectedStatus: 'poor',
    notes: '0 base - 0.5 penalty = -0.5, floored at 0'
  },
  {
    name: 'Single post over 12 months',
    postsPerMonth: 0.083,
    trend: 'stable',
    totalPosts: 1,
    spanMonths: 12,
    expectedScore: 0,
    expectedStatus: 'poor',
    notes: 'Very infrequent = 0pts'
  },
  {
    name: 'New blog (3 posts in 1 month)',
    postsPerMonth: 3,
    trend: 'stable',
    totalPosts: 3,
    spanMonths: 1,
    expectedScore: 3,
    expectedStatus: 'good',
    notes: 'postsPerMonth is what matters, not total posts'
  }
]

function createMockBlogInsights(
  postsPerMonth: number,
  trend: 'increasing' | 'decreasing' | 'stable' | 'irregular' | 'unknown',
  totalPosts: number,
  spanMonths: number
): BlogInsights {
  return {
    publishingFrequency: {
      postsPerMonth,
      totalPosts,
      dateRange: {
        earliest: new Date(Date.now() - spanMonths * 30 * 24 * 60 * 60 * 1000),
        latest: new Date(),
        spanMonths
      },
      trend,
      score: 0,
      recommendation: ''
    },
    contentDepth: {
      avgWordCount: 1000,
      medianWordCount: 900,
      distribution: { short: 0, medium: 0, long: 0 },
      score: 0,
      recommendation: ''
    },
    topicDiversity: {
      uniqueTopics: 5,
      topicClusters: [],
      dominantTopic: null,
      score: 0,
      recommendation: ''
    },
    authorConsistency: {
      postsWithAuthors: 10,
      totalPosts: 10,
      percentageWithAuthors: 100,
      uniqueAuthors: 1,
      score: 0,
      recommendation: ''
    },
    schemaAdoption: {
      postsWithSchema: 10,
      totalPosts: 10,
      percentageWithSchema: 100,
      score: 0,
      recommendation: ''
    },
    internalLinking: {
      avgLinksPerPost: 5,
      topicClusters: [],
      score: 0,
      recommendation: ''
    },
    overallBlogScore: 0
  }
}

async function runTests() {
  console.log('🧪 E6 COMPREHENSIVE TEST SUITE\n')
  console.log('Testing E6 (Publishing Consistency) scoring accuracy\n')
  console.log('='.repeat(80) + '\n')

  let totalPassed = 0
  let totalFailed = 0

  // Run frequency tests
  console.log('📋 FREQUENCY RANGE TESTS\n')
  for (const test of FREQUENCY_TESTS) {
    const blogInsights = createMockBlogInsights(
      test.postsPerMonth,
      test.trend,
      test.totalPosts,
      test.spanMonths
    )

    const result = detectPublishingConsistency(blogInsights)
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
      console.log(`   ${test.notes}`)
      totalFailed++
    }
    console.log()
  }

  // Run trend tests
  console.log('='.repeat(80))
  console.log('\n📋 TREND MODIFIER TESTS\n')
  for (const test of TREND_TESTS) {
    const blogInsights = createMockBlogInsights(
      test.postsPerMonth,
      test.trend,
      test.totalPosts,
      test.spanMonths
    )

    const result = detectPublishingConsistency(blogInsights)
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
      console.log(`   ${test.notes}`)
      totalFailed++
    }
    console.log()
  }

  // Run edge case tests
  console.log('='.repeat(80))
  console.log('\n📋 EDGE CASE TESTS\n')
  for (const test of EDGE_CASES) {
    const blogInsights = createMockBlogInsights(
      test.postsPerMonth,
      test.trend,
      test.totalPosts,
      test.spanMonths
    )

    const result = detectPublishingConsistency(blogInsights)
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
      console.log(`   ${test.notes}`)
      totalFailed++
    }
    console.log()
  }

  // Test no blog insights
  console.log('='.repeat(80))
  console.log('\n📋 NO DATA TEST\n')

  const noBlogResult = detectPublishingConsistency(undefined)
  if (noBlogResult.actualScore === 0 && noBlogResult.evidence.length > 0) {
    console.log('✅ No blog insights (undefined)')
    console.log(`   Score: ${noBlogResult.actualScore}/4 (${noBlogResult.status})`)
    console.log(`   Evidence: ${noBlogResult.evidence[0].value}`)
    totalPassed++
  } else {
    console.log('❌ No blog insights (undefined)')
    console.log(`   Expected: 0/4 with evidence`)
    console.log(`   Got: ${noBlogResult.actualScore}/4`)
    totalFailed++
  }
  console.log()

  // Summary
  const totalTests = FREQUENCY_TESTS.length + TREND_TESTS.length + EDGE_CASES.length + 1
  const passRate = ((totalPassed / totalTests) * 100).toFixed(1)

  console.log('='.repeat(80))
  console.log('\n📊 TEST SUMMARY\n')
  console.log(`Total tests: ${totalTests}`)
  console.log(`✅ Passed: ${totalPassed}`)
  console.log(`❌ Failed: ${totalFailed}`)
  console.log(`Pass rate: ${passRate}%`)

  if (passRate === '100.0') {
    console.log('\n🎉 ALL TESTS PASSED! E6 scoring is flawless!')
  } else {
    console.log('\n⚠️ Some tests failed - review failures above')
  }

  console.log('\n✅ Comprehensive E6 testing complete')
}

runTests().catch(console.error)
