/**
 * Test E1 LLM Hybrid Detection
 */
import { analyzeURL } from './lib/services/url-analyzer'
import { detectFirstPersonNarratives } from './lib/services/eeat-detectors/experience-detectors'

async function testE1LLM() {
  console.log('🧪 Testing E1 LLM Hybrid Detection\n')
  console.log('ENABLE_LLM_SCORING:', process.env.ENABLE_LLM_SCORING || 'false')
  console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Not set')
  console.log('---\n')

  const testUrls = [
    {
      url: 'https://www.healthline.com/nutrition/is-dairy-bad-or-good',
      name: 'Healthline (Medical)',
      expectedCredentials: ['BSc', 'MBA', 'MS', 'RD']
    }
  ]

  for (const test of testUrls) {
    console.log(`\n📍 Testing: ${test.name}`)
    console.log(`   URL: ${test.url}`)
    console.log('   Expected credentials:', test.expectedCredentials.join(', '))

    try {
      // Analyze URL
      const pageAnalysis = await analyzeURL(test.url)

      console.log('\n   Authors found:', pageAnalysis.authors?.length || 0)
      pageAnalysis.authors?.forEach(a => {
        console.log(`     - ${a.name} ${a.credentials ? `(${a.credentials})` : ''}`)
      })

      // Detect E1 (will use LLM if ENABLE_LLM_SCORING=true)
      console.log('\n   Running E1 detection...')
      const startTime = Date.now()

      const e1Result = detectFirstPersonNarratives(pageAnalysis)
      const finalResult = e1Result instanceof Promise ? await e1Result : e1Result

      const duration = Date.now() - startTime

      console.log('\n   ✅ E1 Results:')
      console.log(`     Score: ${finalResult.actualScore}/${finalResult.maxScore} (${finalResult.status})`)
      console.log(`     Duration: ${duration}ms`)
      console.log(`     Evidence count: ${finalResult.evidence.length}`)

      console.log('\n   Evidence:')
      finalResult.evidence.forEach((e, i) => {
        console.log(`     ${i + 1}. [${e.label || e.type}]`)
        console.log(`        ${e.value}`)
        if (e.confidence) {
          console.log(`        Confidence: ${(e.confidence * 100).toFixed(0)}%`)
        }
      })

      if (finalResult.recommendation) {
        console.log('\n   Recommendation:')
        console.log(`     ${finalResult.recommendation}`)
      }

      // Check if LLM was used (by checking for "Experience analysis" label which is LLM-specific)
      const usedLLM = finalResult.evidence.some(e =>
        e.label === 'Experience analysis' || e.label === 'Assessment'
      )

      console.log('\n   Detection method:', usedLLM ? '🤖 LLM (seamless)' : '🔍 Regex patterns')

    } catch (error) {
      console.error(`\n   ❌ Error:`, error)
    }

    console.log('\n' + '='.repeat(80))
  }

  console.log('\n✅ Testing complete!')
}

testE1LLM().catch(console.error)
