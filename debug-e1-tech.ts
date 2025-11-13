/**
 * Debug E1 Tech/Engineering Test Case
 */

import { detectFirstPersonNarratives } from './lib/services/eeat-detectors/experience-detectors'
import type { PageAnalysis } from './lib/services/url-analyzer'

const techContent = "In my 10 years as a software engineer, I've built dozens of production systems. I tested this architecture extensively. Our team has deployed this to serve millions of users."

const mockPage: PageAnalysis = {
  url: 'https://example.com/test',
  finalUrl: 'https://example.com/test',
  canonicalUrl: null,
  title: 'Test',
  metaDescription: '',
  wordCount: 100,
  contentText: techContent,
  headings: { h1: [], h2: [], h3: [] },
  hasSSL: true,
  authors: [],
  schemaMarkup: [],
  dates: { published: null, modified: null, source: 'none' },
  images: { total: 0, withAlt: 0 },
  links: { internal: 0, external: 0 },
  citations: 0,
  citationQuality: null,
  readabilityScore: 0
}

console.log('🐛 E1 Tech/Engineering Debug\n')
console.log('Content:', techContent)
console.log('\n' + '='.repeat(80) + '\n')

const result = detectFirstPersonNarratives(mockPage, undefined, true) as any

console.log('📊 Results:')
console.log(`Score: ${result.actualScore}/4 (${result.status})`)
console.log(`\nEvidence (${result.evidence.length} items):`)
result.evidence.forEach((ev: any, i: number) => {
  console.log(`\n${i + 1}. ${ev.label || ev.type}:`)
  console.log(`   ${ev.value}`)
})

// Manual pattern matching debug
console.log('\n\n🔍 Manual Pattern Check:\n')

const text = techContent.toLowerCase()

// Check strong patterns
console.log('Strong patterns:')
const strongPatterns = [
  /\b(i've seen|we've seen|i've found|we've found|i've worked with|we've worked with)\b/gi,
  /\b(i've built)\b/gi
]
strongPatterns.forEach((p, i) => {
  const matches = text.match(p)
  p.lastIndex = 0
  console.log(`  Pattern ${i + 1}: ${matches ? `✓ Matched: ${matches.join(', ')}` : '✗ No match'}`)
})

// Check medium patterns
console.log('\nMedium patterns:')
const mediumPatterns = [
  /\b(i tried|we tried|i tested|we tested)\b/gi
]
mediumPatterns.forEach((p, i) => {
  const matches = text.match(p)
  p.lastIndex = 0
  console.log(`  Pattern ${i + 1}: ${matches ? `✓ Matched: ${matches.join(', ')}` : '✗ No match'}`)
})

// Check professional patterns
console.log('\nProfessional patterns:')
const professionalPatterns = [
  { name: '10 years as', pattern: /\b(\d+\+?\s*years?.*(experience|practicing|working in|specializing in|as a|in))\b/gi },
  { name: 'built production', pattern: /\b(built|developed|engineered|deployed|shipped)\s+(production|systems?|applications?|platforms?|products?)\b/gi },
  { name: 'we have deployed', pattern: /\b((we've|we have) (built|deployed|shipped|tested|released|maintained))\b/gi },
  { name: 'our team', pattern: /\b(our team)\b/gi },
  { name: 'serving millions', pattern: /\b(in production|at scale|serving (millions|thousands) of users)\b/gi }
]
professionalPatterns.forEach(({name, pattern}) => {
  const matches = text.match(pattern)
  pattern.lastIndex = 0
  console.log(`  ${name}: ${matches ? `✓ Matched: ${matches.join(', ')}` : '✗ No match'}`)
})

console.log('\n✅ Debug complete')
