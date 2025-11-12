/**
 * E3 Issue Investigation
 * Debug Stack Overflow false positive and CSS-Tricks false negative
 */

import { analyzeURL } from './lib/services/url-analyzer'
import { detectOriginalAssets } from './lib/services/eeat-detectors/experience-detectors'

async function debugStackOverflow() {
  console.log('🔍 DEBUGGING: Stack Overflow False Positive\n')
  console.log('Expected: 0.00/3 (Q&A site, no original assets)')
  console.log('Actual: 1.20/3\n')

  const url = 'https://stackoverflow.com/questions/11227809/why-is-processing-a-sorted-array-faster-than-processing-an-unsorted-array'

  const pageAnalysis = await analyzeURL(url)
  const e3 = detectOriginalAssets(pageAnalysis)

  console.log(`Score: ${e3.actualScore.toFixed(2)}/3`)
  console.log(`\nEvidence:`)
  e3.evidence.forEach((ev, idx) => {
    console.log(`${idx + 1}. [${ev.label}]`)
    console.log(`   Value: "${ev.value}"`)
  })

  // Search content for the detected patterns
  console.log('\n📝 Content Analysis:')
  console.log(`Word count: ${pageAnalysis.wordCount}`)
  console.log(`Image count: ${pageAnalysis.images.total}`)

  // Check for "fig. 1" context
  const content = pageAnalysis.contentText.toLowerCase()
  const figMatch = content.match(/.{0,100}fig\.\s*\d.{0,100}/i)
  if (figMatch) {
    console.log(`\n"fig. 1" context:`)
    console.log(`"${figMatch[0]}"`)
  }

  // Check for "demonstration" context
  const demoMatch = content.match(/.{0,100}demonstration.{0,100}/i)
  if (demoMatch) {
    console.log(`\n"demonstration" context:`)
    console.log(`"${demoMatch[0]}"`)
  }

  console.log('\n⚠️ ISSUE: Detecting references in Q&A discussions as original assets')
  console.log('These are user-generated content, NOT brand-owned original assets\n')
}

async function debugCSSTricks() {
  console.log('='.repeat(100))
  console.log('\n🔍 DEBUGGING: CSS-Tricks False Negative\n')
  console.log('Expected: 2.0+/3 (tutorial with diagrams)')
  console.log('Actual: 0.00/3\n')

  const url = 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/'

  const pageAnalysis = await analyzeURL(url)
  const e3 = detectOriginalAssets(pageAnalysis)

  console.log(`Score: ${e3.actualScore.toFixed(2)}/3`)
  console.log(`Evidence count: ${e3.evidence.length}`)

  if (e3.evidence.length > 0) {
    console.log(`\nEvidence:`)
    e3.evidence.forEach((ev, idx) => {
      console.log(`${idx + 1}. [${ev.label}] ${ev.value}`)
    })
  }

  // Analyze page structure
  console.log('\n📝 Page Analysis:')
  console.log(`Word count: ${pageAnalysis.wordCount}`)
  console.log(`Image count: ${pageAnalysis.images.total}`)
  console.log(`H1 headings: ${pageAnalysis.headings.h1.join(', ')}`)
  console.log(`H2 headings: ${pageAnalysis.headings.h2.slice(0, 5).join(', ')}...`)

  // Check if patterns should match
  const content = pageAnalysis.contentText.toLowerCase()

  console.log('\n🔍 Pattern Matching Test:')
  console.log(`Contains "figure": ${content.includes('figure')}`)
  console.log(`Contains "diagram": ${content.includes('diagram')}`)
  console.log(`Contains "screenshot": ${content.includes('screenshot')}`)
  console.log(`Contains "example": ${content.includes('example')}`)
  console.log(`Contains "follow": ${content.includes('follow')}`)

  // Sample content
  const sampleWords = pageAnalysis.contentText.split(/\s+/).slice(0, 200).join(' ')
  console.log(`\nContent sample (first 200 words):`)
  console.log(`"${sampleWords}..."`)

  console.log('\n⚠️ ISSUE: Tutorial site with visual content not being detected')
  console.log('Possible causes: Page structure, content extraction, or pattern mismatch\n')
}

async function runDebugTests() {
  try {
    await debugStackOverflow()
    await debugCSSTricks()

    console.log('='.repeat(100))
    console.log('\n✅ Debug investigation complete')
  } catch (error) {
    console.error('Error during debug:', error)
  }
}

runDebugTests().catch(console.error)
