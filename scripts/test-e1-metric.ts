/**
 * Test E1 Metric Specifically
 */
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { analyzeURL } from '../lib/services/url-analyzer'
import { calculateInstantEEATScores } from '../lib/services/eeat-scorer-v2'

const testUrl = process.argv[2] || 'https://www.healthline.com/health/diabetes'

async function testE1(url: string) {
  console.log(`\n🔍 Testing E1 on: ${url}\n`)
  console.log('='.repeat(80))

  // Analyze page
  const pageAnalysis = await analyzeURL(url)

  // Extract domain
  const domain = new URL(pageAnalysis.finalUrl || pageAnalysis.url).hostname.replace('www.', '')

  // Calculate E-E-A-T scores
  const scores = await calculateInstantEEATScores(pageAnalysis, domain)

  // Extract E1 variable
  const e1Variable = scores.categories.experience.variables.find(v => v.id === 'E1')

  if (!e1Variable) {
    console.log('❌ E1 variable not found!')
    return
  }

  // Display results
  console.log(`📊 E1: ${e1Variable.name}`)
  console.log(`   Score: ${e1Variable.actualScore}/${e1Variable.maxScore} (${Math.round((e1Variable.actualScore / e1Variable.maxScore) * 100)}%)`)
  console.log(`   Status: ${e1Variable.status.toUpperCase()}`)
  console.log(`   Detection: ${e1Variable.detectionMethod}`)

  console.log(`\n📝 Evidence (${e1Variable.evidence.length} items):`)
  e1Variable.evidence.forEach((ev, idx) => {
    if (ev.type === 'snippet') {
      console.log(`   ${idx + 1}. "${ev.value}"`)
    } else if (ev.type === 'metric') {
      console.log(`   ${idx + 1}. ${ev.label}: ${ev.value}`)
    } else if (ev.type === 'note') {
      console.log(`   ${idx + 1}. ℹ️  ${ev.value}`)
    }
  })

  if (e1Variable.recommendation) {
    console.log(`\n💡 Recommendation:`)
    console.log(`   ${e1Variable.recommendation}`)
  }

  console.log('\n' + '='.repeat(80))
  console.log(`\n📈 Overall Context:`)
  console.log(`   Experience Category: ${scores.categories.experience.totalScore}/${scores.categories.experience.maxScore}`)
  console.log(`   Overall E-E-A-T: ${scores.overall}/100`)
  console.log('\n')
}

testE1(testUrl).catch(console.error)
