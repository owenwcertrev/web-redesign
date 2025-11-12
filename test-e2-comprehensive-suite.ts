/**
 * E2 Comprehensive Test Suite
 * Test E2 (Author Perspective Blocks) scoring accuracy across all scenarios
 */

import { detectAuthorPerspectiveBlocks } from './lib/services/eeat-detectors/experience-detectors'
import type { PageAnalysis } from './lib/services/url-analyzer'

interface TestCase {
  name: string
  contentText?: string
  headings?: { h1: string[], h2: string[], h3: string[] }
  schema?: any[]
  authors?: Array<{ name: string, bio?: string }>
  expectedScore: number
  expectedStatus: string
  notes: string
}

// ==================== PATHWAY 1: PERSPECTIVE SECTION HEADINGS ====================

const HEADING_TESTS: TestCase[] = [
  {
    name: 'Medical: "Reviewer\'s Note"',
    contentText: '',
    headings: { h1: [], h2: ['Reviewer\'s Note'], h3: [] },
    expectedScore: 1.5,
    expectedStatus: 'needs-improvement',
    notes: 'Perspective section heading (+1.5)'
  },
  {
    name: 'Medical: "Expert Opinion"',
    contentText: '',
    headings: { h1: [], h2: ['Expert Opinion'], h3: [] },
    expectedScore: 1.5,
    expectedStatus: 'needs-improvement',
    notes: 'Perspective section heading (+1.5)'
  },
  {
    name: 'Medical: "Clinical Perspective"',
    contentText: '',
    headings: { h1: [], h2: ['Clinical Perspective'], h3: [] },
    expectedScore: 1.5,
    expectedStatus: 'needs-improvement',
    notes: 'Medical perspective heading (+1.5)'
  },
  {
    name: 'Tech: "Developer Notes"',
    contentText: '',
    headings: { h1: [], h2: ['Developer Notes'], h3: [] },
    expectedScore: 1.5,
    expectedStatus: 'needs-improvement',
    notes: 'Tech perspective heading (+1.5)'
  },
  {
    name: 'Food: "Chef\'s Tips"',
    contentText: '',
    headings: { h1: [], h2: ['Chef\'s Tips'], h3: [] },
    expectedScore: 1.5,
    expectedStatus: 'needs-improvement',
    notes: 'Culinary perspective heading (+1.5)'
  },
  {
    name: 'Legal: "Attorney\'s Perspective"',
    contentText: '',
    headings: { h1: [], h2: ['Attorney\'s Perspective'], h3: [] },
    expectedScore: 1.5,
    expectedStatus: 'needs-improvement',
    notes: 'Legal perspective heading (+1.5)'
  },
  {
    name: 'Business: "Consultant\'s Analysis"',
    contentText: '',
    headings: { h1: [], h2: ['Consultant\'s Analysis'], h3: [] },
    expectedScore: 1.5,
    expectedStatus: 'needs-improvement',
    notes: 'Business perspective heading (+1.5)'
  },
  {
    name: 'Multiple perspective headings (capped)',
    contentText: '',
    headings: { h1: [], h2: ['Reviewer\'s Note', 'Expert Opinion', 'Clinical Perspective'], h3: [] },
    expectedScore: 3,
    expectedStatus: 'excellent',
    notes: 'Cap at 2 headings max (2 * 1.5 = 3.0 → score 3)'
  }
]

// ==================== PATHWAY 2: REVIEW ATTRIBUTION IN TEXT ====================

const TEXT_ATTRIBUTION_TESTS: TestCase[] = [
  {
    name: 'Medical: "Medically reviewed by"',
    contentText: 'This article was medically reviewed by Dr. Jane Smith, a board-certified cardiologist.',
    expectedScore: 1,
    expectedStatus: 'poor',
    notes: 'Review attribution (+1.0)'
  },
  {
    name: 'Medical: "Reviewed by [Name], MD"',
    contentText: 'Reviewed by John Doe, MD, PhD. Updated March 2024.',
    expectedScore: 1,
    expectedStatus: 'poor',
    notes: 'Review attribution with credentials (+1.0)'
  },
  {
    name: 'Tech: "Reviewed by"',
    contentText: 'This code was reviewed by senior engineers on our team.',
    expectedScore: 1,
    expectedStatus: 'poor',
    notes: 'Tech review attribution (+1.0)'
  },
  {
    name: 'Generic: "Fact-checked by"',
    contentText: 'Fact-checked by our editorial team.',
    expectedScore: 1,
    expectedStatus: 'poor',
    notes: 'Fact-check attribution (+1.0)'
  },
  {
    name: 'No attribution',
    contentText: 'This is an article about health topics.',
    expectedScore: 0,
    expectedStatus: 'poor',
    notes: 'No reviewer attribution = 0 points'
  },
  {
    name: 'Generic placeholder reviewer (filtered)',
    contentText: 'Medically reviewed by Staff.',
    expectedScore: 0,
    expectedStatus: 'poor',
    notes: 'Generic "Staff" filtered out = 0 points'
  },
  {
    name: 'Generic "Editor" (filtered)',
    contentText: 'Reviewed by Editor.',
    expectedScore: 0,
    expectedStatus: 'poor',
    notes: 'Generic "Editor" filtered out = 0 points'
  },
  {
    name: 'Generic "Team" (filtered)',
    contentText: 'Reviewed by Team.',
    expectedScore: 0,
    expectedStatus: 'poor',
    notes: 'Generic "Team" filtered out = 0 points'
  }
]

// ==================== PATHWAY 3: SCHEMA REVIEWER ====================

const SCHEMA_TESTS: TestCase[] = [
  {
    name: 'Schema: reviewedBy field',
    contentText: '',
    schema: [{
      type: 'MedicalWebPage',
      data: {
        reviewedBy: {
          '@type': 'Person',
          name: 'Dr. Jane Smith',
          jobTitle: 'Cardiologist'
        }
      }
    }],
    expectedScore: 1.5,
    expectedStatus: 'needs-improvement',
    notes: 'Schema reviewedBy (+1.5)'
  },
  {
    name: 'Schema: medicalReviewer field',
    contentText: '',
    schema: [{
      type: 'MedicalWebPage',
      data: {
        medicalReviewer: {
          '@type': 'Person',
          name: 'Dr. John Doe'
        }
      }
    }],
    expectedScore: 1.5,
    expectedStatus: 'needs-improvement',
    notes: 'Schema medicalReviewer (+1.5)'
  },
  {
    name: 'Schema: reviewer array',
    contentText: '',
    schema: [{
      type: 'Article',
      data: {
        reviewedBy: [
          { '@type': 'Person', name: 'Reviewer One' },
          { '@type': 'Person', name: 'Reviewer Two' }
        ]
      }
    }],
    expectedScore: 1.5,
    expectedStatus: 'needs-improvement',
    notes: 'Multiple reviewers in schema (+1.5)'
  },
  {
    name: 'Schema: generic placeholder (filtered)',
    contentText: '',
    schema: [{
      type: 'Article',
      data: {
        reviewedBy: {
          '@type': 'Person',
          name: 'Staff'
        }
      }
    }],
    expectedScore: 0,
    expectedStatus: 'poor',
    notes: 'Generic "Staff" in schema filtered out = 0 points'
  },
  {
    name: 'No schema reviewer',
    contentText: '',
    schema: [{
      type: 'Article',
      data: {
        author: { '@type': 'Person', name: 'Author Name' }
      }
    }],
    expectedScore: 0,
    expectedStatus: 'poor',
    notes: 'No reviewer in schema = 0 points'
  }
]

// ==================== PATHWAY 4: COLLABORATIVE AUTHORSHIP ====================

const COLLABORATIVE_AUTHORSHIP_TESTS: TestCase[] = [
  {
    name: '2+ authors (collaborative)',
    contentText: '',
    authors: [
      { name: 'Jane Smith', bio: 'Cardiologist' },
      { name: 'John Doe', bio: 'Researcher' }
    ],
    expectedScore: 1,
    expectedStatus: 'poor',
    notes: '2+ authors = diverse perspectives (+1.0)'
  },
  {
    name: 'Single author',
    contentText: '',
    authors: [
      { name: 'Jane Smith', bio: 'Author' }
    ],
    expectedScore: 0,
    expectedStatus: 'poor',
    notes: 'Single author = 0 points (no collaboration)'
  },
  {
    name: 'No authors',
    contentText: '',
    authors: [],
    expectedScore: 0,
    expectedStatus: 'poor',
    notes: 'No authors = 0 points'
  }
]

// ==================== COMBINED PATHWAYS ====================

const COMBINED_TESTS: TestCase[] = [
  {
    name: 'Heading + Text attribution (no double-count)',
    contentText: 'Medically reviewed by Dr. Smith.',
    headings: { h1: [], h2: ['Reviewer\'s Note'], h3: [] },
    expectedScore: 2.5,
    expectedStatus: 'excellent',
    notes: 'Pathway 1 (1.5) + Pathway 2 (1.0) = 2.5 (83% = excellent)'
  },
  {
    name: 'Heading + Schema reviewer',
    contentText: '',
    headings: { h1: [], h2: ['Expert Opinion'], h3: [] },
    schema: [{
      type: 'MedicalWebPage',
      data: {
        reviewedBy: { '@type': 'Person', name: 'Dr. Jane Smith' }
      }
    }],
    expectedScore: 3,
    expectedStatus: 'excellent',
    notes: 'Pathway 1 (1.5) + Pathway 3 (1.5) = 3.0 (capped at max)'
  },
  {
    name: 'Text + Schema (no double-count)',
    contentText: 'Medically reviewed by Dr. Jane Smith.',
    schema: [{
      type: 'MedicalWebPage',
      data: {
        reviewedBy: { '@type': 'Person', name: 'Dr. Jane Smith' }
      }
    }],
    expectedScore: 1,
    expectedStatus: 'poor',
    notes: 'Pathway 2 (1.0) only - Pathway 3 skipped to prevent double-counting same reviewer'
  },
  {
    name: 'All pathways combined',
    contentText: 'Medically reviewed by Dr. Smith.',
    headings: { h1: [], h2: ['Reviewer\'s Note'], h3: [] },
    schema: [{
      type: 'MedicalWebPage',
      data: {
        reviewedBy: { '@type': 'Person', name: 'Dr. Jane Smith' }
      }
    }],
    authors: [
      { name: 'Author One' },
      { name: 'Author Two' }
    ],
    expectedScore: 2.5,
    expectedStatus: 'excellent',
    notes: 'Pathway 1 (1.5) + Pathway 2 (1.0) = 2.5 (Schema and collaboration skipped due to anti-double-count)'
  },
  {
    name: 'Schema + Collaborative authorship',
    contentText: '',
    schema: [{
      type: 'MedicalWebPage',
      data: {
        reviewedBy: { '@type': 'Person', name: 'Dr. Smith' }
      }
    }],
    authors: [
      { name: 'Author One' },
      { name: 'Author Two' }
    ],
    expectedScore: 1.5,
    expectedStatus: 'needs-improvement',
    notes: 'Pathway 3 (1.5) only - Collaboration not counted when expert reviewer exists'
  }
]

// ==================== EDGE CASES ====================

const EDGE_CASES: TestCase[] = [
  {
    name: 'Case insensitive heading',
    contentText: '',
    headings: { h1: [], h2: ['REVIEWER\'S NOTE'], h3: [] },
    expectedScore: 1.5,
    expectedStatus: 'needs-improvement',
    notes: 'Case insensitive matching works'
  },
  {
    name: 'Heading in H3',
    contentText: '',
    headings: { h1: [], h2: [], h3: ['Expert Opinion'] },
    expectedScore: 1.5,
    expectedStatus: 'needs-improvement',
    notes: 'Detects headings in H1, H2, and H3'
  },
  {
    name: 'International: German "Medizinisch überprüft von"',
    contentText: 'Medizinisch überprüft von Dr. Müller.',
    expectedScore: 1,
    expectedStatus: 'poor',
    notes: 'German medical reviewer attribution (+1.0)'
  },
  {
    name: 'International: French "Révisé par"',
    contentText: 'Révisé par Dr. Dubois.',
    expectedScore: 1,
    expectedStatus: 'poor',
    notes: 'French reviewer attribution (+1.0)'
  },
  {
    name: 'International: Spanish "Revisado por"',
    contentText: 'Revisado por Dr. García.',
    expectedScore: 1,
    expectedStatus: 'poor',
    notes: 'Spanish reviewer attribution (+1.0)'
  },
  {
    name: 'Schema author vs reviewer (SCOPE: E2 only checks structure)',
    contentText: '',
    schema: [{
      type: 'Article',
      data: {
        author: { '@type': 'Person', name: 'Jane Smith', credentials: 'MD, PhD' }
      }
    }],
    expectedScore: 0,
    expectedStatus: 'poor',
    notes: 'Author credentials are X1/X2 scope, not E2'
  },
  {
    name: 'Empty reviewer name (invalid)',
    contentText: 'Reviewed by .',
    expectedScore: 0,
    expectedStatus: 'poor',
    notes: 'Empty reviewer name filtered out'
  }
]

// ==================== TEST RUNNER ====================

async function runTests() {
  console.log('🧪 E2 COMPREHENSIVE TEST SUITE\n')
  console.log('Testing E2 (Author Perspective Blocks) scoring accuracy')
  console.log('Scope: E2 detects STRUCTURE (reviewer exists), NOT credential quality\n')
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
        wordCount: test.contentText ? test.contentText.split(' ').length : 100,
        contentText: test.contentText || '',
        headings: test.headings || { h1: [], h2: [], h3: [] },
        hasSSL: true,
        authors: test.authors || [],
        schemaMarkup: test.schema || [],
        images: { total: 0, withAlt: 0 },
        links: { internal: 0, external: 0 },
        citations: 0,
        citationQuality: null,
        readabilityScore: 0
      }

      const result = detectAuthorPerspectiveBlocks(mockPage)
      const actualScore = result.actualScore

      const passed = actualScore === test.expectedScore && result.status === test.expectedStatus

      if (passed) {
        console.log(`✅ ${test.name}`)
        console.log(`   Score: ${actualScore}/3 (${result.status})`)
        console.log(`   ${test.notes}`)
        totalPassed++
      } else {
        console.log(`❌ ${test.name}`)
        console.log(`   Expected: ${test.expectedScore}/3 (${test.expectedStatus})`)
        console.log(`   Got: ${actualScore}/3 (${result.status})`)
        console.log(`   ${test.notes}`)
        console.log(`   Evidence: ${result.evidence.length} items`)
        failures.push({
          test: test.name,
          expected: `${test.expectedScore} (${test.expectedStatus})`,
          got: `${actualScore} (${result.status})`
        })
        totalFailed++
      }
      console.log()
    }
  }

  // Run all test categories
  await runCategory('PATHWAY 1: PERSPECTIVE SECTION HEADINGS', HEADING_TESTS)
  console.log('='.repeat(80) + '\n')

  await runCategory('PATHWAY 2: REVIEW ATTRIBUTION IN TEXT', TEXT_ATTRIBUTION_TESTS)
  console.log('='.repeat(80) + '\n')

  await runCategory('PATHWAY 3: SCHEMA REVIEWER', SCHEMA_TESTS)
  console.log('='.repeat(80) + '\n')

  await runCategory('PATHWAY 4: COLLABORATIVE AUTHORSHIP', COLLABORATIVE_AUTHORSHIP_TESTS)
  console.log('='.repeat(80) + '\n')

  await runCategory('COMBINED PATHWAYS', COMBINED_TESTS)
  console.log('='.repeat(80) + '\n')

  await runCategory('EDGE CASES', EDGE_CASES)
  console.log('='.repeat(80) + '\n')

  // Summary
  const totalTests = HEADING_TESTS.length + TEXT_ATTRIBUTION_TESTS.length + SCHEMA_TESTS.length +
                     COLLABORATIVE_AUTHORSHIP_TESTS.length + COMBINED_TESTS.length + EDGE_CASES.length
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
    console.log('\n🎉 ALL TESTS PASSED! E2 scoring is flawless!')
  } else if (parseFloat(passRate) >= 90.0) {
    console.log('\n✅ Excellent pass rate! Minor adjustments may be needed.')
  } else if (parseFloat(passRate) >= 75.0) {
    console.log('\n⚠️ Good pass rate, but review failures for improvements.')
  } else {
    console.log('\n❌ Pass rate below 75% - significant issues need addressing.')
  }

  console.log('\n✅ Comprehensive E2 testing complete')
}

runTests().catch(console.error)
