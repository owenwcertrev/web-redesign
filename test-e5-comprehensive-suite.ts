/**
 * E5 Comprehensive Test Suite
 * Test E5 (Experience Markup) scoring accuracy across all scenarios
 */

import { detectExperienceMarkup } from './lib/services/eeat-detectors/experience-detectors'
import type { PageAnalysis } from './lib/services/url-analyzer'

interface TestCase {
  name: string
  schema: any[]
  headings: { h1: string[], h2: string[], h3: string[] }
  expectedScore: number
  expectedStatus: string
  notes: string
}

// Test cases covering all vertical schemas
const SCHEMA_TESTS: TestCase[] = [
  {
    name: 'MedicalWebPage (Health)',
    schema: [{ type: 'MedicalWebPage', data: {} }],
    headings: { h1: [], h2: [], h3: [] },
    expectedScore: 1,
    expectedStatus: 'needs-improvement',
    notes: 'Health vertical schema (+1)'
  },
  {
    name: 'Recipe (Food)',
    schema: [{ type: 'Recipe', data: {} }],
    headings: { h1: [], h2: [], h3: [] },
    expectedScore: 1,
    expectedStatus: 'needs-improvement',
    notes: 'Food vertical schema (+1)'
  },
  {
    name: 'HowTo (Tutorial)',
    schema: [{ type: 'HowTo', data: {} }],
    headings: { h1: [], h2: [], h3: [] },
    expectedScore: 1,
    expectedStatus: 'needs-improvement',
    notes: 'Tutorial vertical schema (+1)'
  },
  {
    name: 'Course (Education)',
    schema: [{ type: 'Course', data: {} }],
    headings: { h1: [], h2: [], h3: [] },
    expectedScore: 1,
    expectedStatus: 'needs-improvement',
    notes: 'Education vertical schema (+1)'
  },
  {
    name: 'Review (Reviews)',
    schema: [{ type: 'Review', data: {} }],
    headings: { h1: [], h2: [], h3: [] },
    expectedScore: 1,
    expectedStatus: 'needs-improvement',
    notes: 'Review vertical schema (+1)'
  },
  {
    name: 'Product (E-commerce)',
    schema: [{ type: 'Product', data: {} }],
    headings: { h1: [], h2: [], h3: [] },
    expectedScore: 1,
    expectedStatus: 'needs-improvement',
    notes: 'E-commerce vertical schema (+1)'
  },
  {
    name: 'Array @type (Recipe + NewsArticle)',
    schema: [{ type: ['Recipe', 'NewsArticle'], data: {} }],
    headings: { h1: [], h2: [], h3: [] },
    expectedScore: 1,
    expectedStatus: 'needs-improvement',
    notes: 'Array @type with vertical schema (+1)'
  },
  {
    name: 'Generic Article (should NOT count)',
    schema: [{ type: 'Article', data: {} }],
    headings: { h1: [], h2: [], h3: [] },
    expectedScore: 0,
    expectedStatus: 'poor',
    notes: 'Generic Article schema should not count'
  },
  {
    name: 'Generic WebPage (should NOT count)',
    schema: [{ type: 'WebPage', data: {} }],
    headings: { h1: [], h2: [], h3: [] },
    expectedScore: 0,
    expectedStatus: 'poor',
    notes: 'Generic WebPage schema should not count'
  },
  {
    name: 'No schema at all',
    schema: [],
    headings: { h1: [], h2: [], h3: [] },
    expectedScore: 0,
    expectedStatus: 'poor',
    notes: 'No schema = 0 points'
  }
]

const HEADING_TESTS: TestCase[] = [
  {
    name: '"What we do" section',
    schema: [],
    headings: { h1: [], h2: ['What We Do'], h3: [] },
    expectedScore: 0.5,
    expectedStatus: 'poor',
    notes: 'Experience section heading (+0.5)'
  },
  {
    name: '"Who we are" section',
    schema: [],
    headings: { h1: [], h2: ['Who We Are'], h3: [] },
    expectedScore: 0.5,
    expectedStatus: 'poor',
    notes: 'Experience section heading (+0.5)'
  },
  {
    name: '"Our approach" section',
    schema: [],
    headings: { h1: [], h2: ['Our Approach to Treatment'], h3: [] },
    expectedScore: 0.5,
    expectedStatus: 'poor',
    notes: 'Experience section heading (+0.5)'
  },
  {
    name: 'Schema + "What we do" section',
    schema: [{ type: 'MedicalWebPage', data: {} }],
    headings: { h1: [], h2: ['What We Do'], h3: [] },
    expectedScore: 1.5,
    expectedStatus: 'good',
    notes: 'Vertical schema (+1) + heading (+0.5)'
  },
  {
    name: 'Full score (schema + multiple headings)',
    schema: [{ type: 'MedicalWebPage', data: {} }],
    headings: { h1: [], h2: ['What We Do', 'Our Approach'], h3: [] },
    expectedScore: 2,
    expectedStatus: 'excellent',
    notes: 'Vertical schema (+1) + 2 headings (+1), capped at max 2'
  }
]

const EDGE_CASES: TestCase[] = [
  {
    name: 'Multiple vertical schemas',
    schema: [
      { type: 'MedicalWebPage', data: {} },
      { type: 'Recipe', data: {} }
    ],
    headings: { h1: [], h2: [], h3: [] },
    expectedScore: 2,
    expectedStatus: 'excellent',
    notes: 'Two vertical schemas (+2), capped at max 2'
  },
  {
    name: 'Mixed generic + vertical schemas',
    schema: [
      { type: 'Article', data: {} },
      { type: 'FAQPage', data: {} },
      { type: 'Recipe', data: {} }
    ],
    headings: { h1: [], h2: [], h3: [] },
    expectedScore: 1,
    expectedStatus: 'needs-improvement',
    notes: 'Only Recipe counts (+1), generic schemas ignored'
  },
  {
    name: 'Case insensitive headings',
    schema: [],
    headings: { h1: [], h2: ['WHAT WE DO'], h3: [] },
    expectedScore: 0.5,
    expectedStatus: 'poor',
    notes: 'Case insensitive matching works'
  },
  {
    name: 'Heading in H3',
    schema: [],
    headings: { h1: [], h2: [], h3: ['What we do'] },
    expectedScore: 0.5,
    expectedStatus: 'poor',
    notes: 'Detects headings in H1, H2, and H3'
  }
]

async function runTests() {
  console.log('🧪 E5 COMPREHENSIVE TEST SUITE\n')
  console.log('Testing E5 (Experience Markup) scoring accuracy\n')
  console.log('='.repeat(80) + '\n')

  let totalPassed = 0
  let totalFailed = 0

  // Run schema tests
  console.log('📋 VERTICAL SCHEMA TESTS\n')
  for (const test of SCHEMA_TESTS) {
    const mockPage: PageAnalysis = {
      url: 'https://example.com/test',
      finalUrl: 'https://example.com/test',
      canonicalUrl: null,
      title: 'Test',
      metaDescription: '',
      wordCount: 100,
      contentText: '',
      headings: test.headings,
      hasSSL: true,
      authors: [],
      schemaMarkup: test.schema,
      images: { total: 0, withAlt: 0 },
      links: { internal: 0, external: 0 },
      citations: 0,
      citationQuality: null,
      readabilityScore: 0
    }

    const result = detectExperienceMarkup(mockPage)
    const passed = result.actualScore === test.expectedScore && result.status === test.expectedStatus

    if (passed) {
      console.log(`✅ ${test.name}`)
      console.log(`   Score: ${result.actualScore}/2 (${result.status})`)
      console.log(`   ${test.notes}`)
      totalPassed++
    } else {
      console.log(`❌ ${test.name}`)
      console.log(`   Expected: ${test.expectedScore}/2 (${test.expectedStatus})`)
      console.log(`   Got: ${result.actualScore}/2 (${result.status})`)
      console.log(`   ${test.notes}`)
      totalFailed++
    }
    console.log()
  }

  // Run heading tests
  console.log('='.repeat(80))
  console.log('\n📋 HEADING DETECTION TESTS\n')
  for (const test of HEADING_TESTS) {
    const mockPage: PageAnalysis = {
      url: 'https://example.com/test',
      finalUrl: 'https://example.com/test',
      canonicalUrl: null,
      title: 'Test',
      metaDescription: '',
      wordCount: 100,
      contentText: '',
      headings: test.headings,
      hasSSL: true,
      authors: [],
      schemaMarkup: test.schema,
      images: { total: 0, withAlt: 0 },
      links: { internal: 0, external: 0 },
      citations: 0,
      citationQuality: null,
      readabilityScore: 0
    }

    const result = detectExperienceMarkup(mockPage)
    const passed = result.actualScore === test.expectedScore && result.status === test.expectedStatus

    if (passed) {
      console.log(`✅ ${test.name}`)
      console.log(`   Score: ${result.actualScore}/2 (${result.status})`)
      console.log(`   ${test.notes}`)
      totalPassed++
    } else {
      console.log(`❌ ${test.name}`)
      console.log(`   Expected: ${test.expectedScore}/2 (${test.expectedStatus})`)
      console.log(`   Got: ${result.actualScore}/2 (${result.status})`)
      console.log(`   ${test.notes}`)
      totalFailed++
    }
    console.log()
  }

  // Run edge case tests
  console.log('='.repeat(80))
  console.log('\n📋 EDGE CASE TESTS\n')
  for (const test of EDGE_CASES) {
    const mockPage: PageAnalysis = {
      url: 'https://example.com/test',
      finalUrl: 'https://example.com/test',
      canonicalUrl: null,
      title: 'Test',
      metaDescription: '',
      wordCount: 100,
      contentText: '',
      headings: test.headings,
      hasSSL: true,
      authors: [],
      schemaMarkup: test.schema,
      images: { total: 0, withAlt: 0 },
      links: { internal: 0, external: 0 },
      citations: 0,
      citationQuality: null,
      readabilityScore: 0
    }

    const result = detectExperienceMarkup(mockPage)
    const passed = result.actualScore === test.expectedScore && result.status === test.expectedStatus

    if (passed) {
      console.log(`✅ ${test.name}`)
      console.log(`   Score: ${result.actualScore}/2 (${result.status})`)
      console.log(`   ${test.notes}`)
      totalPassed++
    } else {
      console.log(`❌ ${test.name}`)
      console.log(`   Expected: ${test.expectedScore}/2 (${test.expectedStatus})`)
      console.log(`   Got: ${result.actualScore}/2 (${result.status})`)
      console.log(`   ${test.notes}`)
      totalFailed++
    }
    console.log()
  }

  // Summary
  const totalTests = SCHEMA_TESTS.length + HEADING_TESTS.length + EDGE_CASES.length
  const passRate = ((totalPassed / totalTests) * 100).toFixed(1)

  console.log('='.repeat(80))
  console.log('\n📊 TEST SUMMARY\n')
  console.log(`Total tests: ${totalTests}`)
  console.log(`✅ Passed: ${totalPassed}`)
  console.log(`❌ Failed: ${totalFailed}`)
  console.log(`Pass rate: ${passRate}%`)

  if (passRate === '100.0') {
    console.log('\n🎉 ALL TESTS PASSED! E5 scoring is flawless!')
  } else {
    console.log('\n⚠️ Some tests failed - review failures above')
  }

  console.log('\n✅ Comprehensive E5 testing complete')
}

runTests().catch(console.error)
