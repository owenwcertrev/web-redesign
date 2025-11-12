/**
 * Test script to verify E1 scoring improvements for Healthline
 */

import { analyzeURL } from './lib/services/url-analyzer'
import { detectNamedAuthorsWithCredentials } from './lib/services/eeat-detectors/expertise-detectors'

const testUrls = [
  'https://www.healthline.com/health/baby/best-baby-probiotics',
  'https://www.healthline.com/health/pregnancy/pregnancy-glow',
  'https://www.healthline.com/nutrition/how-long-does-it-take-to-digest-food'
]

async function testHealthlineE1() {
  console.log('='.repeat(80))
  console.log('TESTING HEALTHLINE E1 SCORING')
  console.log('='.repeat(80))
  console.log()

  for (const url of testUrls) {
    console.log('\n' + '='.repeat(80))
    console.log(`Testing: ${url}`)
    console.log('='.repeat(80))

    try {
      // Analyze the URL
      const analysis = await analyzeURL(url)

      console.log('\n📊 Page Analysis Results:')
      console.log(`  Title: ${analysis.title}`)
      console.log(`  Authors found: ${analysis.authors.length}`)
      analysis.authors.forEach((author, i) => {
        console.log(`    ${i + 1}. ${author.name}`)
        console.log(`       Credentials: ${author.credentials || 'none'}`)
        console.log(`       URL: ${author.url || 'none'}`)
        console.log(`       Photo: ${author.photo || 'none'}`)
        console.log(`       Source: ${author.source}`)
      })

      // Calculate E1 score
      const e1Result = detectNamedAuthorsWithCredentials(analysis)

      console.log('\n🎯 E1 (Named Authors with Credentials) Score:')
      console.log(`  Score: ${e1Result.actualScore}/${e1Result.maxScore}`)
      console.log(`  Percentage: ${((e1Result.actualScore / e1Result.maxScore) * 100).toFixed(1)}%`)
      console.log(`  Status: ${e1Result.status}`)
      console.log(`  Evidence count: ${e1Result.evidence.length}`)

      console.log('\n📝 Evidence:')
      e1Result.evidence.forEach((ev, i) => {
        console.log(`  ${i + 1}. [${ev.type}] ${ev.label || ''}: ${ev.value}`)
      })

      // Expected vs Actual
      const expectedMin = 4.5
      const expectedMax = 5.5
      console.log('\n✅ Score Analysis:')
      if (e1Result.actualScore >= expectedMin && e1Result.actualScore <= expectedMax) {
        console.log(`  ✅ PASS: Score ${e1Result.actualScore} is within expected range ${expectedMin}-${expectedMax}`)
      } else if (e1Result.actualScore < expectedMin) {
        console.log(`  ⚠️  LOW: Score ${e1Result.actualScore} is below expected minimum ${expectedMin}`)
      } else {
        console.log(`  ℹ️  HIGH: Score ${e1Result.actualScore} exceeds expected maximum ${expectedMax}`)
      }

    } catch (error) {
      console.error(`❌ Error analyzing ${url}:`, error)
    }
  }

  console.log('\n' + '='.repeat(80))
  console.log('TEST COMPLETE')
  console.log('='.repeat(80))
}

testHealthlineE1().catch(console.error)
