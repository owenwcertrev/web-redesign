/**
 * Test date extraction from Healthline blog posts
 * Diagnose why only 2/16 posts have dates extracted
 */
import { analyzeURL } from './lib/services/url-analyzer'

async function testHealthlineDateExtraction() {
  console.log('🔍 TESTING: Healthline Date Extraction\n')
  console.log('Issue: Only 2/16 posts have dates extracted')
  console.log('Testing sample Healthline URLs to understand date extraction\n')

  const testUrls = [
    'https://www.healthline.com/nutrition/vitamin-d-deficiency-symptoms',
    'https://www.healthline.com/health/type-2-diabetes',
    'https://www.healthline.com/nutrition/foods-high-in-vitamin-d',
  ]

  for (const url of testUrls) {
    console.log(`\n📄 Testing: ${url}`)
    console.log('='.repeat(80))

    try {
      const analysis = await analyzeURL(url)

      console.log(`✅ URL analyzed successfully`)
      console.log(`   Published: ${analysis.dates.published || 'NOT FOUND'}`)
      console.log(`   Modified: ${analysis.dates.modified || 'NOT FOUND'}`)
      console.log(`   Source: ${analysis.dates.source}`)

      if (!analysis.dates.published && !analysis.dates.modified) {
        console.log(`   ❌ NO DATES EXTRACTED`)

        // Check schema
        console.log(`\n   📊 Schema types found:`)
        analysis.schemaMarkup.forEach(s => {
          console.log(`      - ${s.type}`)
          if (s.data.datePublished) console.log(`        datePublished: ${s.data.datePublished}`)
          if (s.data.dateModified) console.log(`        dateModified: ${s.data.dateModified}`)
        })
      } else {
        console.log(`   ✅ Dates extracted successfully`)
      }

    } catch (error: any) {
      console.log(`   ❌ Error: ${error.message}`)
    }
  }

  console.log('\n\n📋 SUMMARY:')
  console.log('If dates are NOT being extracted, possible causes:')
  console.log('1. Schema markup missing datePublished/dateModified')
  console.log('2. Meta tags not present')
  console.log('3. Time elements not detected')
  console.log('4. Date extraction fallback logic failing')
}

testHealthlineDateExtraction().catch(console.error)
