/**
 * Debug E4 Schema Extraction
 * Investigate why E4 scores 0 despite evidence being present
 */

import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { analyzeURL } from './lib/services/url-analyzer'
import { detectFreshness } from './lib/services/eeat-detectors/experience-detectors'

async function debugE4(url: string) {
  console.log(`\n🔍 Debugging E4 for: ${url}\n`)

  try {
    const pageAnalysis = await analyzeURL(url)

    console.log('📦 Schema Markup Found:')
    console.log(`   Total schemas: ${pageAnalysis.schemaMarkup.length}`)

    pageAnalysis.schemaMarkup.forEach((schema, i) => {
      console.log(`\n   Schema ${i + 1}:`)
      console.log(`     Type: ${schema.type}`)
      console.log(`     dateModified: ${schema.data?.dateModified || 'NOT FOUND'}`)
      console.log(`     datePublished: ${schema.data?.datePublished || 'NOT FOUND'}`)
      console.log(`     dateUpdated: ${schema.data?.dateUpdated || 'NOT FOUND'}`)

      // Show all date-related fields
      const allKeys = Object.keys(schema.data || {})
      const dateKeys = allKeys.filter(k => k.toLowerCase().includes('date'))
      if (dateKeys.length > 0) {
        console.log(`     All date fields found:`)
        dateKeys.forEach(key => {
          console.log(`       ${key}: ${schema.data[key]}`)
        })
      }
    })

    console.log('\n\n🎯 Running E4 Detection:')
    const result = detectFreshness(pageAnalysis)

    console.log(`   Score: ${result.actualScore}/${result.maxScore}`)
    console.log(`   Status: ${result.status}`)
    console.log(`   Evidence items: ${result.evidence.length}`)

    result.evidence.forEach((ev, i) => {
      console.log(`\n   Evidence ${i + 1}:`)
      console.log(`     Type: ${ev.type}`)
      console.log(`     Value: ${ev.value}`)
      console.log(`     Label: ${ev.label || 'N/A'}`)
    })

    if (result.recommendation) {
      console.log(`\n   💡 Recommendation: ${result.recommendation}`)
    }

  } catch (error: any) {
    console.error(`❌ ERROR: ${error.message}`)
  }
}

async function runDebug() {
  console.log('🐛 E4 SCHEMA EXTRACTION DEBUG\n')
  console.log('Testing sites that should have recent dates:\n')
  console.log('='.repeat(80))

  await debugE4('https://www.healthline.com/health/heart-disease')

  console.log('\n' + '='.repeat(80))

  await debugE4('https://www.investopedia.com/terms/c/cryptocurrency.asp')

  console.log('\n' + '='.repeat(80))

  await debugE4('https://www.shopify.com/blog/ecommerce-seo-beginners-guide')

  console.log('\n✅ Debug complete')
}

runDebug().catch(console.error)
