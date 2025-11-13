/**
 * Debug Mayo Clinic E4 Freshness - Should score high
 */
import { analyzeURL } from './lib/services/url-analyzer'
import { detectFreshness } from './lib/services/eeat-detectors/experience-detectors'

async function debugMayoClinic() {
  console.log('🔍 DEBUGGING: Mayo Clinic - E4 Freshness Detection\n')
  console.log('Expected: High E4 score (institutional medical site with regular updates)\n')

  const url = 'https://www.mayoclinic.org/diseases-conditions/diabetes/symptoms-causes/syc-20371444'
  console.log(`Analyzing: ${url}\n`)

  try {
    const pageAnalysis = await analyzeURL(url)

    console.log('📅 DATES EXTRACTED:')
    console.log(`   Published: ${pageAnalysis.dates.published}`)
    console.log(`   Modified: ${pageAnalysis.dates.modified}`)
    console.log(`   Source: ${pageAnalysis.dates.source}`)
    console.log()

    console.log('📝 SCHEMA MARKUP:')
    pageAnalysis.schemaMarkup.forEach((schema, i) => {
      console.log(`   [${i + 1}] Type: ${schema.type}`)
      if (schema.data.datePublished) console.log(`       datePublished: ${schema.data.datePublished}`)
      if (schema.data.dateModified) console.log(`       dateModified: ${schema.data.dateModified}`)
    })
    console.log()

    console.log('🏥 META TAGS:')
    console.log(`   Title: ${pageAnalysis.title}`)
    console.log(`   Description: ${pageAnalysis.metaDescription?.substring(0, 100)}...`)
    console.log()

    const e4 = detectFreshness(pageAnalysis)
    console.log('📊 E4 FRESHNESS SCORE:')
    console.log(`   Score: ${e4.actualScore}/${e4.maxScore}`)
    console.log(`   Status: ${e4.status}`)
    console.log(`   Evidence:`)
    e4.evidence.forEach(ev => {
      console.log(`      - ${ev.type}: ${ev.value}`)
    })
    console.log(`   Recommendation: ${e4.recommendation}`)

  } catch (error: any) {
    console.error('❌ Error:', error.message)
  }
}

debugMayoClinic().catch(console.error)
