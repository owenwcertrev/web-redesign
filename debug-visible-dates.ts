/**
 * Debug Visible Date Extraction
 * Check if pages have visible "Updated:" dates we can parse
 */

import * as dotenv from 'dotenv'
import * as path from 'path'
import * as cheerio from 'cheerio'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

async function debugVisibleDates(url: string) {
  console.log(`\n🔍 ${url}\n`)

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    const html = await response.text()
    const $ = cheerio.load(html)

    // Look for common date patterns in text
    const datePatterns = [
      /updated[:\s]+([a-z]+\s+\d{1,2},?\s+\d{4})/i,
      /modified[:\s]+([a-z]+\s+\d{1,2},?\s+\d{4})/i,
      /published[:\s]+([a-z]+\s+\d{1,2},?\s+\d{4})/i,
      /last\s+updated[:\s]+([a-z]+\s+\d{1,2},?\s+\d{4})/i,
      /(\d{1,2}\/\d{1,2}\/\d{4})/,
      /(\d{4}-\d{2}-\d{2})/
    ]

    // Look for meta tags
    console.log('📅 Meta Tags:')
    const articleModified = $('meta[property="article:modified_time"]').attr('content')
    const articlePublished = $('meta[property="article:published_time"]').attr('content')
    const dcDate = $('meta[name="DC.date"]').attr('content')
    const lastModified = $('meta[name="last-modified"]').attr('content')

    if (articleModified) console.log(`   article:modified_time: ${articleModified}`)
    if (articlePublished) console.log(`   article:published_time: ${articlePublished}`)
    if (dcDate) console.log(`   DC.date: ${dcDate}`)
    if (lastModified) console.log(`   last-modified: ${lastModified}`)

    if (!articleModified && !articlePublished && !dcDate && !lastModified) {
      console.log('   No date meta tags found')
    }

    // Look for visible date text
    console.log('\n📝 Visible Date Text (first 5 matches):')
    const bodyText = $('body').text()
    let found = 0

    for (const pattern of datePatterns) {
      const matches = bodyText.match(new RegExp(pattern.source, 'gi'))
      if (matches) {
        matches.slice(0, 2).forEach(match => {
          if (found < 5) {
            console.log(`   "${match}"`)
            found++
          }
        })
      }
    }

    if (found === 0) {
      console.log('   No visible date patterns found')
    }

    // Look for time elements
    console.log('\n⏰ <time> Elements:')
    const timeElements = $('time')
    if (timeElements.length > 0) {
      timeElements.slice(0, 3).each((i, el) => {
        const datetime = $(el).attr('datetime')
        const text = $(el).text().trim()
        console.log(`   <time datetime="${datetime}">${text}</time>`)
      })
    } else {
      console.log('   No <time> elements found')
    }

  } catch (error: any) {
    console.error(`❌ ERROR: ${error.message}`)
  }
}

async function runDebug() {
  console.log('🐛 VISIBLE DATE EXTRACTION DEBUG\n')
  console.log('Checking for visible dates on pages that lack schema dates:\n')
  console.log('='.repeat(80))

  await debugVisibleDates('https://www.investopedia.com/terms/c/cryptocurrency.asp')

  console.log('\n' + '='.repeat(80))

  await debugVisibleDates('https://www.shopify.com/blog/ecommerce-seo-beginners-guide')

  console.log('\n' + '='.repeat(80))

  await debugVisibleDates('https://css-tricks.com/snippets/css/a-guide-to-flexbox/')

  console.log('\n✅ Debug complete')
}

runDebug().catch(console.error)
