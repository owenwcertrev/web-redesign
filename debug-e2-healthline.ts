/**
 * Debug Healthline E2 - Should detect medical reviewer "Reviewed by" blocks
 */
import { analyzeURL } from './lib/services/url-analyzer'
import { detectAuthorPerspectiveBlocks } from './lib/services/eeat-detectors/experience-detectors'

async function debugHealthlineE2() {
  console.log('🔍 DEBUGGING: Healthline E2 (Author Perspective Blocks)\n')
  console.log('Expected: HIGH E2 score - Healthline is famous for "Medically reviewed by" attribution\n')

  const url = 'https://www.healthline.com/nutrition/vitamin-d-deficiency-symptoms'
  console.log(`Analyzing: ${url}\n`)

  try {
    const pageAnalysis = await analyzeURL(url)

    console.log('👥 AUTHORS DETECTED:')
    pageAnalysis.authors.forEach((author, i) => {
      console.log(`   [${i + 1}] ${author.name}`)
      console.log(`       Credentials: ${author.credentials || 'none'}`)
      console.log(`       Source: ${author.source}`)
    })
    console.log()

    console.log('📊 SCHEMA MARKUP (looking for reviewers):')
    pageAnalysis.schemaMarkup.forEach((schema, i) => {
      console.log(`   [${i + 1}] Type: ${schema.type}`)
      if (schema.data.author) {
        console.log(`       author: ${JSON.stringify(schema.data.author, null, 8).substring(0, 200)}`)
      }
      if (schema.data.reviewedBy) {
        console.log(`       ✅ reviewedBy: ${JSON.stringify(schema.data.reviewedBy, null, 8)}`)
      }
      if (schema.data.medicalReviewer) {
        console.log(`       ✅ medicalReviewer: ${JSON.stringify(schema.data.medicalReviewer, null, 8)}`)
      }
    })
    console.log()

    console.log('📝 CONTENT SAMPLE (looking for "reviewed by" text):')
    const contentSample = pageAnalysis.contentText.substring(0, 2000).toLowerCase()
    const hasReviewedBy = contentSample.includes('reviewed by') || contentSample.includes('medically reviewed')
    console.log(`   Contains "reviewed by": ${hasReviewedBy ? '✅ YES' : '❌ NO'}`)
    if (hasReviewedBy) {
      const reviewedByIndex = contentSample.indexOf('reviewed')
      console.log(`   Sample: "${pageAnalysis.contentText.substring(reviewedByIndex, reviewedByIndex + 100)}"`)
    }
    console.log()

    const e2 = detectAuthorPerspectiveBlocks(pageAnalysis)
    console.log('📊 E2 SCORE:')
    console.log(`   Score: ${e2.actualScore}/${e2.maxScore}`)
    console.log(`   Status: ${e2.status}`)
    console.log(`   Evidence (${e2.evidence.length} items):`)
    e2.evidence.forEach((ev, i) => {
      console.log(`      [${i + 1}] ${ev.type}: ${ev.value}`)
    })
    console.log()
    console.log(`   Recommendation: ${e2.recommendation}`)

  } catch (error: any) {
    console.error('❌ Error:', error.message)
  }
}

debugHealthlineE2().catch(console.error)
