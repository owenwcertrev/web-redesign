/**
 * Comprehensive Real-World E1-E7 Testing
 * Tests E1-E7 metrics across 15+ diverse websites spanning multiple verticals
 */

import { analyzeURL } from './lib/services/url-analyzer'
import {
  detectFirstPersonNarratives,
  detectAuthorPerspectiveBlocks,
  detectFreshness
} from './lib/services/eeat-detectors/experience-detectors'

interface TestSite {
  name: string
  url: string
  vertical: string
  expectedStrengths: string[]
  notes: string
}

const TEST_SITES: TestSite[] = [
  // === MEDICAL/HEALTH (High-quality YMYL) ===
  {
    name: 'Healthline',
    url: 'https://www.healthline.com/nutrition/vitamin-d-deficiency-symptoms',
    vertical: 'Medical/Health',
    expectedStrengths: ['E2 (reviewers)', 'E4 (fresh)', 'E2 schema'],
    notes: 'Industry benchmark - medical reviewers, strong freshness, schema'
  },
  {
    name: 'Mayo Clinic',
    url: 'https://www.mayoclinic.org/diseases-conditions/diabetes/symptoms-causes/syc-20371444',
    vertical: 'Medical/Health',
    expectedStrengths: ['E1 (institutional)', 'E2 (reviewers)', 'E4 (fresh)'],
    notes: 'Top-tier medical institution - professional voice, expert review'
  },
  {
    name: 'WebMD',
    url: 'https://www.webmd.com/diabetes/type-2-diabetes',
    vertical: 'Medical/Health',
    expectedStrengths: ['E2 (reviewers)', 'E4 (fresh)', 'E2 schema'],
    notes: 'Major health site - medical review attribution'
  },

  // === TECH/ENGINEERING ===
  {
    name: 'CSS-Tricks',
    url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/',
    vertical: 'Tech/Web Development',
    expectedStrengths: ['E1 (personal narrative)', 'E4 (updates)', 'E2 (author perspective)'],
    notes: 'Developer blog - first-person experience, frequent updates'
  },
  {
    name: 'Stack Overflow Blog',
    url: 'https://stackoverflow.blog/2023/12/18/community-is-the-future-of-ai/',
    vertical: 'Tech/Engineering',
    expectedStrengths: ['E1 (professional voice)', 'E4 (dates)', 'E2 (collaboration)'],
    notes: 'Tech thought leadership - professional perspectives'
  },
  {
    name: 'Mozilla Developer Network',
    url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox',
    vertical: 'Tech/Documentation',
    expectedStrengths: ['E4 (updates)', 'E2 (collaboration)', 'E1 (institutional)'],
    notes: 'Technical documentation - collaborative authorship, regular updates'
  },

  // === FINANCE/BUSINESS ===
  {
    name: 'Investopedia',
    url: 'https://www.investopedia.com/terms/i/investing.asp',
    vertical: 'Finance/YMYL',
    expectedStrengths: ['E2 (reviewers)', 'E4 (updates)', 'E1 (professional)'],
    notes: 'Financial content - expert reviewers, frequent updates'
  },
  {
    name: 'NerdWallet',
    url: 'https://www.nerdwallet.com/article/credit-cards/credit-cards-101',
    vertical: 'Finance/YMYL',
    expectedStrengths: ['E2 (reviewers)', 'E4 (fresh)', 'E1 (first-person)'],
    notes: 'Personal finance - reviewer attribution, user experience'
  },

  // === FOOD/CULINARY ===
  {
    name: 'Serious Eats',
    url: 'https://www.seriouseats.com/perfect-pan-seared-steaks-recipe',
    vertical: 'Food/Culinary',
    expectedStrengths: ['E1 (first-person)', 'E2 (author perspective)', 'E4 (dates)'],
    notes: 'Food science - strong first-person narrative, testing methodology'
  },
  {
    name: 'Bon Appétit',
    url: 'https://www.bonappetit.com/recipe/perfect-pan-seared-steak',
    vertical: 'Food/Culinary',
    expectedStrengths: ['E1 (personal)', 'E2 (author)', 'E4 (dates)'],
    notes: 'Culinary content - chef perspectives, personal experience'
  },

  // === LEGAL ===
  {
    name: 'Nolo',
    url: 'https://www.nolo.com/legal-encyclopedia/bankruptcy',
    vertical: 'Legal/YMYL',
    expectedStrengths: ['E2 (reviewers)', 'E4 (updates)', 'E1 (attorney voice)'],
    notes: 'Legal information - attorney reviewers, regular updates'
  },

  // === E-COMMERCE/PRODUCT REVIEWS ===
  {
    name: 'Wirecutter (NYT)',
    url: 'https://www.nytimes.com/wirecutter/reviews/best-coffee-maker/',
    vertical: 'Product Reviews',
    expectedStrengths: ['E1 (testing narrative)', 'E2 (author)', 'E4 (updates)'],
    notes: 'Product testing - first-person testing, author expertise'
  },

  // === TRAVEL ===
  {
    name: 'Lonely Planet',
    url: 'https://www.lonelyplanet.com/france/paris',
    vertical: 'Travel',
    expectedStrengths: ['E1 (first-person)', 'E2 (author)', 'E4 (dates)'],
    notes: 'Travel guides - personal experience, author perspectives'
  },

  // === NEWS/JOURNALISM ===
  {
    name: 'The Guardian',
    url: 'https://www.theguardian.com/technology/2024/jan/01/ai-benefits-risks-technology',
    vertical: 'News/Journalism',
    expectedStrengths: ['E2 (bylines)', 'E4 (dates)', 'E2 (collaboration)'],
    notes: 'News journalism - clear attribution, timestamps'
  },

  // === EDUCATION ===
  {
    name: 'Khan Academy',
    url: 'https://www.khanacademy.org/math/algebra',
    vertical: 'Education',
    expectedStrengths: ['E1 (institutional)', 'E2 (collaboration)', 'E4 (updates)'],
    notes: 'Educational content - institutional voice, collaborative team'
  },

  // === AI-GENERATED (Expected to score low) ===
  {
    name: 'Low-quality AI Content',
    url: 'https://www.example.com/ai-generated-article',
    vertical: 'AI-Generated',
    expectedStrengths: [],
    notes: 'Control - expect minimal E-signals (no real authors, no updates, generic)'
  }
]

async function runRealWorldTests() {
  console.log('🌐 COMPREHENSIVE REAL-WORLD E1-E7 TESTING\\n')
  console.log(`Testing ${TEST_SITES.length} websites across diverse verticals`)
  console.log('Focus: Validate E1-E7 improvements in production scenarios\\n')
  console.log('='.repeat(90) + '\\n')

  const results: any[] = []

  for (const site of TEST_SITES) {
    console.log(`📍 ${site.name} (${site.vertical})`)
    console.log(`   URL: ${site.url}`)
    console.log(`   Expected: ${site.expectedStrengths.join(', ')}`)

    try {
      // Skip example.com (doesn't exist)
      if (site.url.includes('example.com')) {
        console.log('   ⏭️  Skipped (example URL)\\n')
        continue
      }

      // Analyze page
      const pageAnalysis = await analyzeURL(site.url)

      // Run E1-E3 detectors (skip LLM for speed)
      const e1 = detectFirstPersonNarratives(pageAnalysis, undefined, true) as any
      const e2 = detectAuthorPerspectiveBlocks(pageAnalysis)
      const e4 = detectFreshness(pageAnalysis)

      results.push({
        name: site.name,
        vertical: site.vertical,
        e1: { score: e1.actualScore, status: e1.status },
        e2: { score: e2.actualScore, status: e2.status },
        e4: { score: e4.actualScore, status: e4.status },
        notes: site.notes
      })

      console.log(`   E1 (First-Person): ${e1.actualScore}/4 (${e1.status})`)
      console.log(`   E2 (Perspective): ${e2.actualScore}/3 (${e2.status})`)
      console.log(`   E4 (Freshness): ${e4.actualScore}/5 (${e4.status})`)
      console.log(`   ✅ Analyzed successfully\\n`)

    } catch (error: any) {
      console.log(`   ❌ Error: ${error.message}\\n`)
      results.push({
        name: site.name,
        vertical: site.vertical,
        error: error.message
      })
    }
  }

  // Summary statistics
  console.log('='.repeat(90) + '\\n')
  console.log('📊 SUMMARY STATISTICS\\n')

  const successfulTests = results.filter(r => !r.error)

  if (successfulTests.length > 0) {
    // E1 stats
    const e1Scores = successfulTests.map(r => r.e1.score)
    const e1Avg = (e1Scores.reduce((a, b) => a + b, 0) / e1Scores.length).toFixed(2)
    const e1Excellent = successfulTests.filter(r => r.e1.status === 'excellent').length
    const e1Good = successfulTests.filter(r => r.e1.status === 'good').length

    // E2 stats
    const e2Scores = successfulTests.map(r => r.e2.score)
    const e2Avg = (e2Scores.reduce((a, b) => a + b, 0) / e2Scores.length).toFixed(2)
    const e2Excellent = successfulTests.filter(r => r.e2.status === 'excellent').length
    const e2Good = successfulTests.filter(r => r.e2.status === 'good').length

    // E4 stats
    const e4Scores = successfulTests.map(r => r.e4.score)
    const e4Avg = (e4Scores.reduce((a, b) => a + b, 0) / e4Scores.length).toFixed(2)
    const e4Excellent = successfulTests.filter(r => r.e4.status === 'excellent').length
    const e4Good = successfulTests.filter(r => r.e4.status === 'good').length

    console.log(`E1 (First-Person Narratives):`)
    console.log(`   Average: ${e1Avg}/4`)
    console.log(`   Status: ${e1Excellent} excellent, ${e1Good} good, ${successfulTests.length - e1Excellent - e1Good} needs work`)
    console.log()

    console.log(`E2 (Author Perspective):`)
    console.log(`   Average: ${e2Avg}/3`)
    console.log(`   Status: ${e2Excellent} excellent, ${e2Good} good, ${successfulTests.length - e2Excellent - e2Good} needs work`)
    console.log()

    console.log(`E4 (Freshness):`)
    console.log(`   Average: ${e4Avg}/5`)
    console.log(`   Status: ${e4Excellent} excellent, ${e4Good} good, ${successfulTests.length - e4Excellent - e4Good} needs work`)
    console.log()

    console.log(`Sites tested: ${successfulTests.length}`)
    console.log(`Errors: ${results.length - successfulTests.length}`)
  }

  console.log('\\n✅ Real-world testing complete')
}

runRealWorldTests().catch(console.error)
