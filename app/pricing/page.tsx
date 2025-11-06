'use client'

import { useState, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, Sparkles } from 'lucide-react'
import DepthHero from '@/components/cards3d/DepthHero'
import TextureOverlay from '@/components/TextureOverlay'
import OrganicShape from '@/components/OrganicShape'
import PricingSlider from '@/components/PricingSlider'
import PricingCard, { PricingTier } from '@/components/PricingCard'
import FadeIn from '@/components/animations/FadeIn'
import Accordion from '@/components/Accordion'
import TierCard from '@/components/TierCard'

// Define all 6 pricing tiers
const pricingTiers: PricingTier[] = [
  {
    id: 'mini',
    name: 'Mini',
    price: 480,
    credits: 6,
    pricePerCredit: 80,
    description: 'Perfect for occasional updates and content refreshes',
    examples: [
      '6 Tier 1 reviews (basic wellness content)',
      '3 Tier 2 reviews (licensed practitioners)',
      '2 Tier 3 reviews (credentialed specialists)',
      '1 Tier 6 review (industry authority)'
    ]
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 1120,
    credits: 14,
    pricePerCredit: 80,
    description: 'Build a steady content presence with weekly expert reviews',
    examples: [
      '14 Tier 1 reviews (2-4 posts/week)',
      '7 Tier 2 reviews (weekly licensed expert)',
      '4 Tier 3 + 1 Tier 2 review (mixed credentialing)',
      '2 Tier 4 + 3 Tier 2 reviews (senior specialists)'
    ]
  },
  {
    id: 'core-seo',
    name: 'Core SEO',
    price: 2133,
    credits: 27,
    pricePerCredit: 79,
    description: 'The growth baseline for serious content marketing teams',
    examples: [
      '27 Tier 1 reviews (daily content)',
      '13 Tier 2 + 1 Tier 1 review (3-5 posts/week)',
      '9 Tier 2 + 3 Tier 3 reviews (mixed tiers)',
      '6 Tier 3 + 3 Tier 2 + 3 Tier 1 reviews (balanced portfolio)'
    ],
    isPopular: true
  },
  {
    id: 'accelerate',
    name: 'Accelerate',
    price: 3773,
    credits: 49,
    pricePerCredit: 77,
    description: 'Fast-track your authority with high-volume expert validation',
    examples: [
      '24 Tier 2 + 1 Tier 1 review (4-7 posts/week)',
      '16 Tier 2 + 5 Tier 3 + 2 Tier 1 reviews',
      '12 Tier 3 + 7 Tier 2 reviews (specialist-heavy)',
      '8 Tier 4 + 8 Tier 2 + 1 Tier 1 review (senior focus)'
    ]
  },
  {
    id: 'authority',
    name: 'Authority Builder',
    price: 5700,
    credits: 75,
    pricePerCredit: 76,
    description: 'Establish market leadership with premium expert access',
    examples: [
      '37 Tier 2 + 1 Tier 1 review (daily+ publishing)',
      '25 Tier 2 + 8 Tier 3 + 1 Tier 1 review',
      '15 Tier 3 + 10 Tier 2 + 5 Tier 1 reviews',
      '12 Tier 4 + 9 Tier 3 reviews (high-tier heavy)'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 9675,
    credits: 129,
    pricePerCredit: 75,
    description: 'High-velocity publishing with maximum flexibility',
    examples: [
      '64 Tier 2 + 1 Tier 1 review (6-12 posts/week)',
      '43 Tier 2 + 14 Tier 3 reviews',
      '32 Tier 2 + 21 Tier 3 reviews (specialist focus)',
      '21 Tier 4 + 16 Tier 3 + 5 Tier 1 reviews (premium tier mix)'
    ]
  }
]

// Define expert tier reference data
const expertTiers = [
  {
    tierNumber: 1,
    tierName: 'Certified Professional',
    credits: 1,
    credentials: ['Certified Wellness Coach', 'Personal Trainer', 'Nutrition Coach']
  },
  {
    tierNumber: 2,
    tierName: 'Licensed Practitioner',
    credits: 2,
    credentials: ['RN', 'IBCLC', 'Licensed Therapist', 'Doula']
  },
  {
    tierNumber: 3,
    tierName: 'Credentialed Specialist',
    credits: 3,
    credentials: ['RD', 'NP', 'PharmD', 'CPA']
  },
  {
    tierNumber: 4,
    tierName: 'Senior Specialist',
    credits: 4,
    credentials: ['Senior NP', 'Clinical Specialist', 'MBA']
  },
  {
    tierNumber: 5,
    tierName: 'Practice Leader',
    credits: 5,
    credentials: ['PhD', 'JD', 'Practice Owner']
  },
  {
    tierNumber: 6,
    tierName: 'Industry Authority',
    credits: 6,
    credentials: ['MD', 'PhD (Research)', 'C-Suite Executive']
  }
]

// Pricing FAQs
const pricingFAQs = [
  {
    question: 'How does pricing work at CertREV?',
    answer: 'You purchase a monthly credit bundle. Each review deducts a preset number of credits based on the reviewer tier you choose.'
  },
  {
    question: 'What\'s included in the cost of a credit?',
    answer: 'Reviewer time, light editorial and compliance edits, the signed signature block with name/title/credentials, JSON-LD schema, managed project delivery, and platform QA.'
  },
  {
    question: 'Do I have to commit to a long-term contract?',
    answer: 'No. Bundles renew month-to-month and can be changed or cancelled any time.'
  },
  {
    question: 'Do unused credits expire or roll over?',
    answer: 'Credits roll over for 90 days to accommodate campaign spikes or seasonal slowdowns.'
  },
  {
    question: 'Can I mix and match expert levels in my bundle?',
    answer: 'Yes—allocate credits across any tier, specialty, or content type.'
  },
  {
    question: 'What happens if I need more credits than my bundle includes?',
    answer: 'Add-on credits are billed at your current bundle\'s per-credit rate and appear on the next invoice.'
  }
]

export default function PricingPage() {
  const [postsPerMonth, setPostsPerMonth] = useState(9) // Start at Core SEO range
  const comparisonRef = useRef<HTMLElement>(null)

  // Map slider value to appropriate pricing tier
  // Ranges aligned to ~3 credits per review average
  const currentTier = useMemo(() => {
    if (postsPerMonth <= 3) return pricingTiers[0] // Mini (6 credits ÷ 3 = 2 posts)
    if (postsPerMonth <= 6) return pricingTiers[1] // Starter (14 credits ÷ 3 ≈ 4-5 posts)
    if (postsPerMonth <= 12) return pricingTiers[2] // Core SEO (27 credits ÷ 3 = 9 posts)
    if (postsPerMonth <= 20) return pricingTiers[3] // Accelerate (49 credits ÷ 3 ≈ 16 posts)
    if (postsPerMonth <= 30) return pricingTiers[4] // Authority (75 credits ÷ 3 = 25 posts)
    return pricingTiers[5] // Enterprise (129 credits ÷ 3 = 43 posts)
  }, [postsPerMonth])

  const scrollToComparison = () => {
    comparisonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div>
      {/* Hero Section */}
      <DepthHero
        backgroundLayers={[
          <div key="bg" className="absolute inset-0 bg-beige" />,
          <TextureOverlay key="texture" type="paper" opacity={0.3} />,
          <OrganicShape key="shape1" variant="blob2" color="lime" className="absolute top-1/4 right-1/4 w-96 h-96" opacity={0.08} />,
          <OrganicShape key="shape2" variant="blob1" color="coral" className="absolute bottom-1/4 left-1/4 w-80 h-80" opacity={0.06} />
        ]}
      >
        <div className="min-h-[50vh] flex items-center justify-center px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-6 px-6 py-3 bg-white rounded-full border-2 border-coral/20 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-coral" />
                <span className="text-sm font-semibold text-navy tracking-wide">SIMPLE, TRANSPARENT PRICING</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight font-serif"
            >
              <span className="text-navy">Clear Pricing for</span>
              <br />
              <span className="text-coral">Credible Content</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-black/70 max-w-2xl mx-auto"
            >
              Pay only for the expert reviews you need. No contracts, no surprises—just credible content at scale.
            </motion.p>
          </div>
        </div>
      </DepthHero>

      {/* Interactive Pricing Section */}
      <section className="bg-white py-20 px-4 relative overflow-hidden">
        <TextureOverlay type="paper" opacity={0.15} />
        <OrganicShape variant="blob3" color="beige" className="absolute -top-40 -left-40 w-96 h-96" opacity={0.5} />

        <div className="max-w-6xl mx-auto relative z-10">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-navy font-serif">
                Find Your Perfect Plan
              </h2>
              <p className="text-lg text-black/70 max-w-2xl mx-auto">
                Adjust the slider to match your publishing frequency and see the plan that fits your needs
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="mb-12">
              <PricingSlider value={postsPerMonth} onChange={setPostsPerMonth} />
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="max-w-5xl mx-auto">
              <PricingCard tier={currentTier} />
            </div>
          </FadeIn>

          {/* View All Plans Link */}
          <FadeIn delay={0.4}>
            <div className="text-center mt-8">
              <p className="text-sm text-navy/60">
                Want to see all plans side-by-side?{' '}
                <button onClick={scrollToComparison} className="text-coral font-semibold hover:underline">
                  View comparison table
                </button>
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* How Credits Work Section */}
      <section className="bg-beige py-20 px-4 relative overflow-hidden">
        <TextureOverlay type="paper" opacity={0.2} />
        <OrganicShape variant="blob1" color="lime" className="absolute -top-20 -right-20 w-96 h-96" opacity={0.05} />

        <div className="max-w-6xl mx-auto relative z-10">
          <FadeIn>
            <div className="text-center mb-12">
              <div className="inline-block mb-4 px-6 py-3 bg-white rounded-full border-2 border-lime/20 shadow-sm">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-lime" />
                  <span className="text-sm font-semibold text-navy tracking-wide">EXPERT TIERS</span>
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-navy font-serif">
                How Credits Work
              </h2>
              <p className="text-lg text-black/70 max-w-2xl mx-auto">
                Each expert tier costs a different number of credits based on their credentials and expertise level
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expertTiers.map((tier, idx) => (
              <FadeIn key={tier.tierNumber} delay={0.1 * idx}>
                <TierCard
                  tierNumber={tier.tierNumber}
                  tierName={tier.tierName}
                  credits={tier.credits}
                  credentials={tier.credentials}
                />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section ref={comparisonRef} className="bg-white py-20 px-4 relative overflow-hidden">
        <TextureOverlay type="paper" opacity={0.15} />
        <OrganicShape variant="blob1" color="coral" className="absolute -top-40 -right-40 w-96 h-96" opacity={0.05} />

        <div className="max-w-7xl mx-auto relative z-10">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-navy font-serif">
                Compare All Plans
              </h2>
              <p className="text-lg text-black/70">
                Choose the perfect plan for your content marketing needs
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full bg-white rounded-2xl shadow-lg border-2 border-navy/10">
                <thead>
                  <tr className="border-b-2 border-navy/10">
                    <th className="p-3 sm:p-4 md:p-6 text-left text-xs sm:text-sm font-semibold text-navy/60 uppercase tracking-wide bg-beige/30">
                      Features
                    </th>
                    {pricingTiers.map((tier) => (
                      <th key={tier.id} className="p-3 sm:p-4 md:p-6 text-center min-w-[140px] sm:min-w-[160px] md:min-w-[180px]">
                        <div className="flex flex-col items-center gap-1 sm:gap-2">
                          {tier.isPopular && (
                            <span className="inline-block bg-lime text-navy px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold">
                              Popular
                            </span>
                          )}
                          <span className="text-sm sm:text-base md:text-lg font-bold text-navy font-serif">{tier.name}</span>
                          <span className="text-lg sm:text-xl md:text-2xl font-bold text-coral font-serif">
                            ${tier.price.toLocaleString()}
                          </span>
                          <span className="text-xs text-navy/50">/mo</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-navy/10">
                    <td className="p-3 sm:p-4 md:p-6 text-xs sm:text-sm font-medium text-navy">Credits Included</td>
                    {pricingTiers.map((tier) => (
                      <td key={tier.id} className="p-3 sm:p-4 md:p-6 text-center text-xs sm:text-sm text-navy/70">
                        {tier.credits} credits
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-navy/10 bg-beige/20">
                    <td className="p-3 sm:p-4 md:p-6 text-xs sm:text-sm font-medium text-navy">Price Per Credit</td>
                    {pricingTiers.map((tier) => (
                      <td key={tier.id} className="p-3 sm:p-4 md:p-6 text-center text-xs sm:text-sm text-navy/70">
                        ${tier.pricePerCredit}/credit
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-navy/10">
                    <td className="p-3 sm:p-4 md:p-6 text-xs sm:text-sm font-medium text-navy">Ideal Monthly Posts</td>
                    {pricingTiers.map((tier) => (
                      <td key={tier.id} className="p-3 sm:p-4 md:p-6 text-center text-xs sm:text-sm text-navy/70">
                        {tier.id === 'mini' && '2-3 posts'}
                        {tier.id === 'starter' && '4-6 posts'}
                        {tier.id === 'core-seo' && '7-12 posts'}
                        {tier.id === 'accelerate' && '13-20 posts'}
                        {tier.id === 'authority' && '21-30 posts'}
                        {tier.id === 'enterprise' && '31+ posts'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-navy/10 bg-beige/20">
                    <td className="p-3 sm:p-4 md:p-6 text-xs sm:text-sm font-medium text-navy">90-Day Credit Rollover</td>
                    {pricingTiers.map((tier) => (
                      <td key={tier.id} className="p-3 sm:p-4 md:p-6 text-center">
                        <span className="text-navy text-base sm:text-lg">✓</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-navy/10">
                    <td className="p-3 sm:p-4 md:p-6 text-xs sm:text-sm font-medium text-navy">All 6 Credential Tiers</td>
                    {pricingTiers.map((tier) => (
                      <td key={tier.id} className="p-3 sm:p-4 md:p-6 text-center">
                        <span className="text-navy text-base sm:text-lg">✓</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-navy/10 bg-beige/20">
                    <td className="p-3 sm:p-4 md:p-6 text-xs sm:text-sm font-medium text-navy">JSON-LD Schema & EEAT Badges</td>
                    {pricingTiers.map((tier) => (
                      <td key={tier.id} className="p-3 sm:p-4 md:p-6 text-center">
                        <span className="text-navy text-base sm:text-lg">✓</span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 sm:p-4 md:p-6 text-xs sm:text-sm font-medium text-navy">SOC-2 Compliant Platform</td>
                    {pricingTiers.map((tier) => (
                      <td key={tier.id} className="p-3 sm:p-4 md:p-6 text-center">
                        <span className="text-navy text-base sm:text-lg">✓</span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="text-center text-sm text-navy/40 mt-8">
              All plans include month-to-month billing • Cancel anytime • No long-term contracts
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Pricing FAQ Section */}
      <section className="bg-white py-20 px-4 relative overflow-hidden">
        <TextureOverlay type="paper" opacity={0.15} />

        <div className="max-w-3xl mx-auto relative z-10">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-navy font-serif">
                Pricing Questions?
              </h2>
              <p className="text-lg text-black/70">
                Everything you need to know about credits, billing, and flexibility
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <Accordion items={pricingFAQs} />
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="text-center mt-8">
              <a href="/faq" className="text-coral font-semibold hover:underline">
                View all frequently asked questions →
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-beige py-20 px-4 relative overflow-hidden">
        <TextureOverlay type="paper" opacity={0.2} />
        <OrganicShape variant="blob2" color="coral" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]" opacity={0.04} />

        <div className="max-w-4xl mx-auto relative z-10">
          <FadeIn>
            <div className="bg-white rounded-3xl p-8 md:p-12 text-center border-2 border-navy/10 shadow-xl relative overflow-hidden">
              <TextureOverlay type="paper" opacity={0.2} />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-navy font-serif">
                  Ready to Get Started?
                </h2>
                <p className="text-black/70 mb-8 text-lg max-w-2xl mx-auto">
                  Join brands that are scaling credible content with expert validation
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center max-w-2xl mx-auto">
                  <a
                    href="https://dashboard.certrev.com/auth/signup?tab=brand"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-coral text-white font-semibold rounded-full hover:bg-coral/90 transition-all shadow-md hover:shadow-lg"
                  >
                    Start Today
                  </a>
                  <a
                    href="/contact"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-navy font-semibold rounded-full border-2 border-navy/20 hover:border-navy/30 transition-all"
                  >
                    Schedule Demo
                  </a>
                </div>
                <p className="text-xs text-navy/40 mt-6">
                  No credit card required • Cancel anytime • 90-day credit rollover
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
