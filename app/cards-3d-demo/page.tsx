'use client'

import Link from 'next/link'
import Button from '@/components/Button'
import TiltCard from '@/components/cards3d/TiltCard'
import StackedCards from '@/components/cards3d/StackedCards'
import FlipStatCard from '@/components/cards3d/FlipStatCard'
import Carousel3D from '@/components/cards3d/Carousel3D'
import DepthHero from '@/components/cards3d/DepthHero'
import CardDeck from '@/components/cards3d/CardDeck'
import { TrendingUp, Users, AlertCircle, ShoppingBag, ArrowRight, Shield, CheckCircle2, Eye } from 'lucide-react'

export default function Cards3DDemo() {
  const stackCards = [
    {
      id: '1',
      content: (
        <div className="bg-gradient-to-br from-primary/20 to-verification/20 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
          <h3 className="text-2xl font-bold text-charcoal mb-4">Submit Content</h3>
          <p className="text-charcoal/70">Upload your articles, blog posts, or landing pages for expert verification.</p>
        </div>
      )
    },
    {
      id: '2',
      content: (
        <div className="bg-gradient-to-br from-verification/20 to-alert/20 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
          <h3 className="text-2xl font-bold text-charcoal mb-4">Expert Review</h3>
          <p className="text-charcoal/70">Credentialed professionals verify claims, check sources, and validate accuracy.</p>
        </div>
      )
    },
    {
      id: '3',
      content: (
        <div className="bg-gradient-to-br from-alert/20 to-primary/20 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
          <h3 className="text-2xl font-bold text-charcoal mb-4">Get Certified</h3>
          <p className="text-charcoal/70">Receive verification badges and expert signatures that boost credibility.</p>
        </div>
      )
    },
  ]

  const carouselItems = [
    <div key="1" className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-8 h-[400px] flex flex-col justify-between text-white">
      <div>
        <div className="text-sm font-mono mb-4 opacity-80">TIER 1</div>
        <h3 className="text-3xl font-bold mb-4">Certified Professional</h3>
        <div className="text-lg mb-2">1 CertCredit</div>
        <ul className="space-y-2 opacity-90">
          <li>• Health & Wellness Coach</li>
          <li>• Nutrition Coach (CNC)</li>
          <li>• Personal Trainer (NASM)</li>
        </ul>
      </div>
    </div>,
    <div key="2" className="bg-gradient-to-br from-verification to-verification-dark rounded-2xl p-8 h-[400px] flex flex-col justify-between text-white">
      <div>
        <div className="text-sm font-mono mb-4 opacity-80">TIER 2</div>
        <h3 className="text-3xl font-bold mb-4">Licensed Practitioner</h3>
        <div className="text-lg mb-2">2 CertCredits</div>
        <ul className="space-y-2 opacity-90">
          <li>• Registered Nurse (RN)</li>
          <li>• Licensed Esthetician</li>
          <li>• Enrolled Agent (IRS)</li>
        </ul>
      </div>
    </div>,
    <div key="3" className="bg-gradient-to-br from-alert to-amber-600 rounded-2xl p-8 h-[400px] flex flex-col justify-between text-white">
      <div>
        <div className="text-sm font-mono mb-4 opacity-80">TIER 3</div>
        <h3 className="text-3xl font-bold mb-4">Credentialed Specialist</h3>
        <div className="text-lg mb-2">3 CertCredits</div>
        <ul className="space-y-2 opacity-90">
          <li>• Nurse Practitioner (NP)</li>
          <li>• Dietitian Nutritionist (RDN)</li>
          <li>• Public Accountant (CPA)</li>
        </ul>
      </div>
    </div>,
    <div key="4" className="bg-gradient-to-br from-charcoal to-charcoal/80 rounded-2xl p-8 h-[400px] flex flex-col justify-between text-white">
      <div>
        <div className="text-sm font-mono mb-4 opacity-80">TIER 6</div>
        <h3 className="text-3xl font-bold mb-4">Industry Authority</h3>
        <div className="text-lg mb-2">6 CertCredits</div>
        <ul className="space-y-2 opacity-90">
          <li>• Medical Doctor (MD)</li>
          <li>• Board-Certified Specialist</li>
          <li>• Chief Medical Officer</li>
        </ul>
      </div>
    </div>,
  ]

  const deckCards = [
    {
      id: 'analysis',
      title: 'Content Analysis',
      color: 'bg-gradient-to-br from-primary to-primary-dark',
      content: (
        <div className="space-y-4">
          <p>Our AI-powered system performs an initial scan of your content, identifying claims that need verification and checking for potential compliance issues.</p>
          <ul className="list-disc list-inside space-y-2 opacity-90">
            <li>Automated claim detection</li>
            <li>Source credibility check</li>
            <li>FTC compliance screening</li>
            <li>E-E-A-T score estimation</li>
          </ul>
        </div>
      )
    },
    {
      id: 'matching',
      title: 'Expert Matching',
      color: 'bg-gradient-to-br from-verification to-verification-dark',
      content: (
        <div className="space-y-4">
          <p>We match your content with the most qualified expert based on their credentials, specialization, and experience level.</p>
          <ul className="list-disc list-inside space-y-2 opacity-90">
            <li>Credential verification</li>
            <li>Subject matter expertise</li>
            <li>Track record review</li>
            <li>Availability confirmation</li>
          </ul>
        </div>
      )
    },
    {
      id: 'review',
      title: 'Human Verification',
      color: 'bg-gradient-to-br from-alert to-amber-600',
      content: (
        <div className="space-y-4">
          <p>A credentialed expert thoroughly reviews your content, fact-checks claims against current research, and validates all sources.</p>
          <ul className="list-disc list-inside space-y-2 opacity-90">
            <li>Claim-by-claim verification</li>
            <li>Source validation</li>
            <li>Current research check</li>
            <li>Expert recommendations</li>
          </ul>
        </div>
      )
    },
    {
      id: 'certification',
      title: 'Certification',
      color: 'bg-gradient-to-br from-charcoal to-charcoal/80',
      content: (
        <div className="space-y-4">
          <p>Once verified, your content receives an expert signature, verification badge, and structured data markup for search engines.</p>
          <ul className="list-disc list-inside space-y-2 opacity-90">
            <li>Expert attribution</li>
            <li>Verification badge</li>
            <li>Schema markup</li>
            <li>Immutable record</li>
          </ul>
        </div>
      )
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream via-white to-cream">
      {/* Depth Hero */}
      <DepthHero
        backgroundLayers={[
          <div key="1" className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-primary/10 to-verification/10 rounded-full blur-3xl" />,
          <div key="2" className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-verification/10 to-alert/10 rounded-full blur-3xl" />,
        ]}
      >
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full border border-primary/20">
              <span className="text-sm font-medium text-primary">3D CARD DESIGN SYSTEM</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-br from-charcoal to-charcoal/70 bg-clip-text text-transparent">
                Trust in
              </span>
              <br />
              <span className="bg-gradient-to-br from-primary to-verification bg-clip-text text-transparent">
                Three Dimensions
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-charcoal/70 mb-12 max-w-2xl mx-auto">
              A sophisticated card-based design language that makes verification tangible through depth, tilt, and interactive reveals
            </p>

            <Button size="lg" className="shadow-2xl">
              Explore Components
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </DepthHero>

      {/* Flip Stat Cards */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 text-charcoal">Flip to Reveal Stats</h2>
            <p className="text-xl text-charcoal/70 max-w-2xl mx-auto">
              Click any card to flip and see detailed verification information
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FlipStatCard
              stat="88%"
              label="Traffic Drop"
              description="Organic traffic lost by major publishers without E-E-A-T"
              backTitle="The Cost of Unverified Content"
              backDetails={[
                'HubSpot lost 88% organic traffic after Google updates',
                'Affects brands without expert validation',
                'Reversible with proper verification',
                'Expert attribution prevents penalties'
              ]}
              icon={TrendingUp}
              gradient="from-primary/10 to-primary/20"
            />

            <FlipStatCard
              stat="60%"
              label="Consumer Doubt"
              description="People who distrust AI-generated content without expert review"
              backTitle="Trust Gap Analysis"
              backDetails={[
                'Stanford study of 10,000+ consumers',
                'Highest among health/finance content',
                'Expert badges increase trust 3x',
                'Verified content drives conversions'
              ]}
              icon={Users}
              gradient="from-verification/10 to-verification/20"
            />

            <FlipStatCard
              stat="$51,744"
              label="Per Violation"
              description="Average FTC fine for deceptive or unsubstantiated claims"
              backTitle="Compliance Protection"
              backDetails={[
                'FTC enforcement up 400% in 2024',
                'Expert review ensures compliance',
                'Protects against costly penalties',
                'Demonstrates due diligence'
              ]}
              icon={AlertCircle}
              gradient="from-alert/10 to-alert/20"
            />

            <FlipStatCard
              stat="↑40%"
              label="Purchase Intent"
              description="Lift from expert-verified content vs brand copy alone"
              backTitle="Conversion Impact"
              backDetails={[
                'Nielsen x inPowered meta-analysis',
                'Expert content outperforms ads',
                'Builds long-term brand trust',
                'Compound effect over time'
              ]}
              icon={ShoppingBag}
              gradient="from-charcoal/10 to-charcoal/20"
            />
          </div>
        </div>
      </section>

      {/* Stacked Cards */}
      <section className="py-32 px-4 bg-gradient-to-b from-white to-cream">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 text-charcoal">Layered Process</h2>
            <p className="text-xl text-charcoal/70 max-w-2xl mx-auto">
              Click cards to expand and see the verification workflow
            </p>
          </div>

          <StackedCards cards={stackCards} />
        </div>
      </section>

      {/* 3D Carousel */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 text-charcoal">Expert Tiers Carousel</h2>
            <p className="text-xl text-charcoal/70 max-w-2xl mx-auto">
              Navigate through our expert credential tiers in 3D
            </p>
          </div>

          <Carousel3D items={carouselItems} />
        </div>
      </section>

      {/* Card Deck */}
      <section className="py-32 px-4 bg-gradient-to-b from-white to-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 text-charcoal">Interactive Card Deck</h2>
            <p className="text-xl text-charcoal/70 max-w-2xl mx-auto">
              Our verification process as a deck of cards - hover and click to explore
            </p>
          </div>

          <CardDeck cards={deckCards} />
        </div>
      </section>

      {/* Tilt Card Grid */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 text-charcoal">Hover-Tilt Cards</h2>
            <p className="text-xl text-charcoal/70 max-w-2xl mx-auto">
              Move your mouse over cards to see subtle 3D tilting effects
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Expert Verified', color: 'rgba(119, 171, 149, 0.2)' },
              { icon: CheckCircle2, title: 'FTC Compliant', color: 'rgba(91, 141, 239, 0.2)' },
              { icon: Eye, title: 'Fully Transparent', color: 'rgba(241, 130, 57, 0.2)' }
            ].map((item, i) => (
              <TiltCard key={i} intensity={0.8} glowColor={item.color}>
                <div className="bg-gradient-to-br from-white to-cream backdrop-blur-sm rounded-2xl p-8 h-64 flex flex-col justify-center items-center text-center border border-charcoal/10 shadow-xl">
                  <item.icon className="w-16 h-16 text-primary mb-4" />
                  <h3 className="text-2xl font-bold text-charcoal">{item.title}</h3>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-4 bg-gradient-to-b from-white to-cream">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-8 text-charcoal">
            Ready to Experience 3D Trust?
          </h2>
          <p className="text-xl text-charcoal/70 mb-12">
            See how depth and interaction make verification more engaging
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg">
              Start Verifying
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
