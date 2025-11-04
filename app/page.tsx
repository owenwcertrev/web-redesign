'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Button from '@/components/Button'
import TierCard from '@/components/TierCard'
import NewsletterSignup from '@/components/NewsletterSignup'
import FadeIn from '@/components/animations/FadeIn'
import DepthHero from '@/components/cards3d/DepthHero'
import FlipStatCard from '@/components/cards3d/FlipStatCard'
import StackedCards from '@/components/cards3d/StackedCards'
import CardDeck from '@/components/cards3d/CardDeck'
import TiltCard from '@/components/cards3d/TiltCard'
import Carousel3D from '@/components/cards3d/Carousel3D'
import { TrendingUp, Users, AlertCircle, ShoppingBag, ArrowRight, Shield, CheckCircle2, Eye, Upload, FileCheck, Search } from 'lucide-react'

export default function Home() {
  // Stacked cards content for the process
  const processCards = [
    {
      id: 'submit',
      content: (
        <div className="bg-gradient-to-br from-primary/20 to-verification/20 backdrop-blur-sm p-10 rounded-2xl border border-white/20">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/30 flex items-center justify-center">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-charcoal mb-3">Submit Content</h3>
              <p className="text-charcoal/70 text-lg leading-relaxed">
                Upload your articles, blog posts, or landing pages through our dashboard. Our AI performs initial screening to identify claims that need expert validation.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'review',
      content: (
        <div className="bg-gradient-to-br from-verification/20 to-alert/20 backdrop-blur-sm p-10 rounded-2xl border border-white/20">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-verification/30 flex items-center justify-center">
              <Search className="w-6 h-6 text-verification-dark" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-charcoal mb-3">Expert Review</h3>
              <p className="text-charcoal/70 text-lg leading-relaxed">
                Credentialed professionals verify claims, check sources, validate accuracy against current research, and ensure regulatory compliance.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'certify',
      content: (
        <div className="bg-gradient-to-br from-alert/20 to-primary/20 backdrop-blur-sm p-10 rounded-2xl border border-white/20">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-alert/30 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-alert" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-charcoal mb-3">Get Certified</h3>
              <p className="text-charcoal/70 text-lg leading-relaxed">
                Receive verification badges, expert signatures, and structured data markup that boost credibility with consumers and search engines alike.
              </p>
            </div>
          </div>
        </div>
      )
    },
  ]

  // Card deck content for detailed workflow
  const workflowCards = [
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
    <div className="overflow-hidden">
      {/* Hero Section with Depth */}
      <DepthHero
        backgroundLayers={[
          <div key="1" className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-primary/10 to-verification/10 rounded-full blur-3xl" />,
          <div key="2" className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-verification/10 to-alert/10 rounded-full blur-3xl" />,
        ]}
      >
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-6 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full border border-primary/20"
            >
              <span className="text-sm font-medium text-primary">EXPERT VERIFICATION PLATFORM</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-6xl md:text-8xl font-bold mb-8 leading-tight"
            >
              <span className="bg-gradient-to-br from-charcoal to-charcoal/70 bg-clip-text text-transparent">
                Trust in
              </span>
              <br />
              <span className="bg-gradient-to-br from-primary to-verification bg-clip-text text-transparent">
                Three Dimensions
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl md:text-2xl text-charcoal/70 mb-12 max-w-2xl mx-auto"
            >
              Expert fact-checking infrastructure for health, wellness, and professional service brands navigating the AI content era
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button size="lg" asChild className="shadow-2xl">
                <Link href="/eeat-meter">
                  Analyze Your Content
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="ghost" asChild>
                <Link href="#verification-process">Explore the Platform</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </DepthHero>

      {/* Flip Stat Cards - Why Expert Validation Matters */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-charcoal">
                Why Expert Validation Matters
              </h2>
              <p className="text-xl text-charcoal/70 max-w-2xl mx-auto">
                The data behind expert verification
              </p>
            </div>
          </FadeIn>

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

      {/* Stacked Cards - Layered Process */}
      <section id="verification-process" className="py-32 px-4 bg-gradient-to-b from-white to-cream">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-20">
              <div className="inline-block mb-6 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full border border-verification/20">
                <span className="text-sm font-medium text-verification-dark">LAYERED PROCESS</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-charcoal">
                Verification in Layers
              </h2>
              <p className="text-xl text-charcoal/70 max-w-2xl mx-auto">
                Three steps to expert-validated content
              </p>
            </div>
          </FadeIn>

          <StackedCards cards={processCards} />
        </div>
      </section>

      {/* Card Deck - Interactive Workflow */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-20">
              <div className="inline-block mb-6 px-6 py-3 bg-cream rounded-full border border-primary/20">
                <span className="text-sm font-medium text-primary">INTERACTIVE DECK</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-charcoal">
                The Complete Workflow
              </h2>
              <p className="text-xl text-charcoal/70 max-w-2xl mx-auto">
                From content analysis to expert certification
              </p>
            </div>
          </FadeIn>

          <CardDeck cards={workflowCards} />
        </div>
      </section>

      {/* Expert Tiers Carousel */}
      <section className="relative bg-gradient-to-b from-white to-cream py-32 px-4 overflow-visible">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="inline-block mb-6 px-6 py-3 bg-white rounded-full border border-primary/20 shadow-sm">
                <span className="text-sm font-medium text-primary">6 EXPERT LEVELS</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-charcoal">
                Expert Credential Tiers
              </h2>
              <p className="text-xl text-charcoal/70 max-w-3xl mx-auto mb-4">
                From certified coaches to medical doctors, financial advisors to attorneys — we have the right expert for your content
              </p>
              <p className="text-sm text-charcoal/40">
                ← Navigate to explore all tiers →
              </p>
            </div>
          </FadeIn>

          <Carousel3D
            items={[
              <TierCard
                key="tier-1"
                tierNumber={1}
                tierName="Certified Professional"
                credits={1}
                credentials={[
                  'Health & Wellness Coach (NBHWC)',
                  'Nutrition Coach (CNC)',
                  'Personal Trainer (NASM)',
                  'Pilates Instructor (PMI)',
                  'Digital Marketing Professional (OMCP)',
                ]}
              />,
              <TierCard
                key="tier-2"
                tierNumber={2}
                tierName="Licensed Practitioner"
                credits={2}
                credentials={[
                  'Registered Nurse (RN)',
                  'Licensed Esthetician (LE)',
                  'Massage Therapist (LMT)',
                  'Makeup Artist (MUA)',
                  'Enrolled Agent (IRS-licensed)',
                ]}
              />,
              <TierCard
                key="tier-3"
                tierNumber={3}
                tierName="Credentialed Specialist"
                credits={3}
                credentials={[
                  'Nurse Practitioner (NP)',
                  'Physician Assistant (PA-C)',
                  'Dietitian Nutritionist (RDN)',
                  'Physical Therapist (DPT)',
                  'Public Accountant (CPA)',
                ]}
              />,
              <TierCard
                key="tier-4"
                tierNumber={4}
                tierName="Senior Credentialed Specialist"
                credits={4}
                credentials={[
                  'Doctor of Pharmacy (PharmD)',
                  'Senior RDN (CNSC, CSSD)',
                  'Behavior Analyst (BCBA-D)',
                  'Chartered Financial Analyst (CFA)',
                  'Certified Financial Planner (CFP)',
                ]}
              />,
              <TierCard
                key="tier-5"
                tierNumber={5}
                tierName="Practice Leader"
                credits={5}
                credentials={[
                  'Clinical PhD (Nutrition, Psych)',
                  'Doctor of Nursing Practice (DNP)',
                  'Senior Epidemiologist',
                  'Bar-Admitted Attorney (JD)',
                  'Managing CPA / Controller',
                ]}
              />,
              <TierCard
                key="tier-6"
                tierNumber={6}
                tierName="Industry Authority"
                credits={6}
                credentials={[
                  'Medical Doctor (MD/DO)',
                  'Board-Certified Surgeon',
                  'Board-Certified Specialist',
                  'Tenured Professor (PhD)',
                  'Chief Medical Officer',
                ]}
              />,
            ]}
          />
        </div>
      </section>

      {/* Tilt Card Grid - Trust Principles */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-charcoal">
                Built on Trust Principles
              </h2>
              <p className="text-xl text-charcoal/70 max-w-2xl mx-auto">
                Expert verification, FTC compliance, and complete transparency
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Expert Verified',
                description: 'Every piece of content reviewed by credentialed professionals',
                color: 'rgba(119, 171, 149, 0.2)'
              },
              {
                icon: CheckCircle2,
                title: 'FTC Compliant',
                description: 'Ensures all claims meet regulatory standards and requirements',
                color: 'rgba(91, 141, 239, 0.2)'
              },
              {
                icon: Eye,
                title: 'Fully Transparent',
                description: 'Complete audit trail from submission to certification',
                color: 'rgba(241, 130, 57, 0.2)'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <TiltCard intensity={0.8} glowColor={item.color}>
                  <div className="bg-gradient-to-br from-white to-cream backdrop-blur-sm rounded-2xl p-10 h-80 flex flex-col justify-center items-center text-center border border-charcoal/10 shadow-xl">
                    <item.icon className="w-20 h-20 text-primary mb-6" />
                    <h3 className="text-2xl font-bold text-charcoal mb-4">{item.title}</h3>
                    <p className="text-charcoal/70 leading-relaxed">{item.description}</p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Human Layer - Insights & Newsletter */}
      <section className="relative bg-gradient-to-b from-white to-cream py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-charcoal">
                The Human Layer
              </h2>
              <p className="text-xl md:text-2xl font-light italic text-charcoal/70 max-w-3xl mx-auto leading-relaxed">
                In a world where AI writes faster than we can fact-check, CertREV brings real experts back into the conversation
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {[
              {
                category: 'Trust & AI',
                title: 'Why 60% of Consumers Doubt AI-Generated Content',
                excerpt: 'Stanford\'s latest research reveals a growing trust gap. Here\'s what brands need to know about maintaining credibility in the AI age.',
                gradient: 'from-primary/20 to-verification/20'
              },
              {
                category: 'SEO Strategy',
                title: 'Google\'s E-E-A-T Update: What Changed in 2024',
                excerpt: 'The extra \'E\' for Experience changed everything. Learn how expert validation protects your organic traffic from algorithm updates.',
                gradient: 'from-verification/20 to-alert/20'
              }
            ].map((article, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group"
              >
                <Link href="/human-layer" className="block">
                  <div className="bg-white rounded-3xl overflow-hidden shadow-base hover:shadow-xl transition-all duration-500 hover:scale-[1.02] border border-charcoal/5">
                    <div className={`h-56 bg-gradient-to-br ${article.gradient}`} />
                    <div className="p-8">
                      <span className="text-sm text-primary font-medium uppercase tracking-wide">{article.category}</span>
                      <h3 className="text-2xl font-semibold mt-3 mb-4 text-charcoal group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-charcoal/70 mb-6 leading-relaxed">
                        {article.excerpt}
                      </p>
                      <div className="inline-flex items-center gap-2 text-primary font-medium group-hover:gap-4 transition-all">
                        Read More <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          <FadeIn delay={0.4}>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl text-center border border-verification/20">
              <h3 className="text-3xl font-bold mb-4 text-charcoal">Stay Informed</h3>
              <p className="text-charcoal/70 mb-8 text-lg max-w-2xl mx-auto">
                Get insights on trust, expertise, and content strategy delivered to your inbox
              </p>
              <NewsletterSignup />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative bg-gradient-to-br from-cream via-white to-cream py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-6xl md:text-7xl font-bold mb-8 text-charcoal leading-tight">
              Ready to Build Trust?
            </h2>
            <p className="text-xl md:text-2xl text-charcoal/70 mb-12 max-w-2xl mx-auto font-light">
              Get your free content analysis and see how expert validation can transform your brand credibility
            </p>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Button size="lg" asChild className="text-lg px-12 py-6 shadow-2xl hover:shadow-3xl">
                <Link href="/eeat-meter">
                  Get Your Free Analysis
                  <ArrowRight className="w-6 h-6" />
                </Link>
              </Button>
            </motion.div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
