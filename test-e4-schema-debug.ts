/**
 * E4 Schema Extraction Debug
 * Investigate why Healthline schema isn't being extracted
 */

import * as cheerio from 'cheerio'

async function debugHealthlineSchema() {
  console.log('🔍 Debugging Healthline Schema Extraction\n')

  const url = 'https://www.healthline.com/nutrition/how-much-water-should-you-drink-per-day'

  // Fetch page
  const response = await fetch(url)
  const html = await response.text()
  const $ = cheerio.load(html)

  console.log('📋 JSON-LD Script Tags Found:')
  const scripts = $('script[type="application/ld+json"]')
  console.log(`Total: ${scripts.length}\n`)

  scripts.each((idx, el) => {
    console.log(`\n--- Script ${idx + 1} ---`)
    const content = $(el).html()
    console.log(`Length: ${content?.length || 0} characters`)

    if (content) {
      try {
        const data = JSON.parse(content)
        console.log(`Parsed successfully!`)
        console.log(`@type: ${data['@type'] || data[0]?.['@type'] || '(not found)'}`)

        // Check for dates
        console.log(`\nDate fields:`)
        console.log(`  datePublished: ${data.datePublished || '(not found)'}`)
        console.log(`  dateModified: ${data.dateModified || '(not found)'}`)

        // Check if it's an array
        if (Array.isArray(data)) {
          console.log(`\n⚠️ Schema is an ARRAY with ${data.length} items`)
          data.forEach((item, i) => {
            console.log(`  Item ${i}: @type = ${item?.['@type']}`)
            if (item?.datePublished) console.log(`    datePublished: ${item.datePublished}`)
            if (item?.dateModified) console.log(`    dateModified: ${item.dateModified}`)
          })
        }

        // Show first 200 chars of JSON
        console.log(`\nJSON preview:`)
        console.log(JSON.stringify(data, null, 2).substring(0, 400) + '...')

      } catch (e: any) {
        console.log(`❌ JSON parse error: ${e.message}`)
        console.log(`Content preview: ${content.substring(0, 200)}...`)
      }
    }
  })

  console.log('\n\n='.repeat(80))
  console.log('✅ Debug complete')
}

debugHealthlineSchema().catch(console.error)
