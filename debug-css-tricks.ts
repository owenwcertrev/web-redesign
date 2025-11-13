/**
 * Debug CSS-Tricks E1 Scoring Issue
 */

import { analyzeURL } from './lib/services/url-analyzer'
import { detectFirstPersonNarratives } from './lib/services/eeat-detectors/experience-detectors'

async function debugCSSTricks() {
  console.log('🐛 DEBUG: CSS-Tricks E1 Detection\n')
  console.log('='.repeat(80) + '\n')

  const url = 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/'

  try {
    const pageAnalysis = await analyzeURL(url)

    console.log('📄 Page Analysis:')
    console.log(`   URL: ${pageAnalysis.url}`)
    console.log(`   Title: ${pageAnalysis.title}`)
    console.log(`   Word count: ${pageAnalysis.wordCount}`)
    console.log(`   Content length: ${pageAnalysis.contentText.length} chars`)
    console.log(`   Authors: ${pageAnalysis.authors.length} (${pageAnalysis.authors.map(a => a.name).join(', ')})`)
    console.log()

    // Show content sample
    console.log('📝 Content Sample (first 500 chars):')
    console.log(pageAnalysis.contentText.slice(0, 500))
    console.log()

    // Test E1 detection
    const e1 = detectFirstPersonNarratives(pageAnalysis, undefined, true) as any

    console.log('🔍 E1 Detection Result:')
    console.log(`   Score: ${e1.actualScore}/4 (${e1.status})`)
    console.log(`   Evidence: ${e1.evidence.length} items`)
    console.log()

    if (e1.evidence.length > 0) {
      console.log('Evidence items:')
      e1.evidence.forEach((ev: any, i: number) => {
        console.log(`   ${i + 1}. ${ev.label}: "${ev.value.slice(0, 80)}..."`)
      })
    } else {
      console.log('⚠️ No evidence found!')
      console.log()
      console.log('Testing patterns manually on content sample:')

      const sample = pageAnalysis.contentText.toLowerCase()

      // Test strong patterns
      const strongPatterns = [
        { name: 'in my experience', pattern: /in my experience/gi },
        { name: 'I\'ve found', pattern: /i'?ve found/gi },
        { name: 'I recommend', pattern: /i recommend/gi },
        { name: 'our team', pattern: /our team/gi }
      ]

      strongPatterns.forEach(({ name, pattern }) => {
        const matches = sample.match(pattern)
        console.log(`   ${name}: ${matches ? `✓ ${matches.length} matches` : '✗ none'}`)
      })
    }

    console.log('\n✅ Debug complete')

  } catch (error: any) {
    console.error('❌ Error:', error.message)
  }
}

debugCSSTricks().catch(console.error)
