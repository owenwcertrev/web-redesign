/**
 * Debug E6 (Publishing Consistency) for Healthline
 * Expected: High publishing rate (major health site)
 * Reported: 0.1 posts/month (wrong!)
 */
import { analyzeURL } from './lib/services/url-analyzer'
import { detectPublishingConsistency } from './lib/services/eeat-detectors/experience-detectors'

async function debugE6Healthline() {
  console.log('🔍 DEBUGGING: Healthline E6 (Publishing Consistency)\n')
  console.log('Expected: HIGH publishing rate (major health publisher)')
  console.log('User report: 0.1 posts/month (WRONG!)\n')

  const url = 'https://www.healthline.com/nutrition/vitamin-d-deficiency-symptoms'
  console.log(`Analyzing: ${url}\n`)

  try {
    const pageAnalysis = await analyzeURL(url)

    console.log('📊 PAGE ANALYSIS:')
    console.log(`   Domain: ${new URL(pageAnalysis.url).hostname}`)
    console.log(`   Final URL: ${pageAnalysis.finalUrl}`)
    console.log(`   Canonical: ${pageAnalysis.canonicalUrl}`)
    console.log()

    console.log('📅 DATES:')
    console.log(`   Published: ${pageAnalysis.dates.published}`)
    console.log(`   Modified: ${pageAnalysis.dates.modified}`)
    console.log(`   Source: ${pageAnalysis.dates.source}`)
    console.log()

    // Need to get blog insights
    console.log('⚠️  E6 requires BLOG ANALYSIS (aggregating multiple posts)')
    console.log('   E6 cannot be tested on a single article URL')
    console.log('   E6 needs to crawl blog index to find recent posts')
    console.log()

    console.log('🔧 TO PROPERLY TEST E6:')
    console.log('   1. We need the blog index URL (e.g., /blog or /health-news)')
    console.log('   2. E6 will crawl it to find recent post dates')
    console.log('   3. Calculate publishing rate from those dates')
    console.log()

    console.log('❓ QUESTION: What is Healthline\'s blog index URL?')
    console.log('   Possibilities:')
    console.log('   - https://www.healthline.com/health-news')
    console.log('   - https://www.healthline.com/nutrition')
    console.log('   - https://www.healthline.com/ (homepage)')

  } catch (error: any) {
    console.error('❌ Error:', error.message)
  }
}

debugE6Healthline().catch(console.error)
