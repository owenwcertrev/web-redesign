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
import TiltCard from '@/components/cards3d/TiltCard'
import Carousel3D from '@/components/cards3d/Carousel3D'
import { TrendingUp, Users, AlertCircle, ShoppingBag, ArrowRight, Upload, FileCheck, Search, CheckCircle2, Shield, Eye } from 'lucide-react'
import CitationMarker from '@/components/trust/CitationMarker'
import ConfidenceMeter from '@/components/trust/ConfidenceMeter'
import TrustIndicator from '@/components/trust/TrustIndicator'
import ParticleNetwork from '@/components/radical/ParticleNetwork'

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


  return (
    <div className="overflow-hidden">
      {/* Hero Section with Depth */}
      <DepthHero
        backgroundLayers={[
          <ParticleNetwork key="particles" particleCount={25} className="opacity-30" />,
          <div key="1" className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-primary/10 to-verification/10 rounded-full blur-3xl" />,
          <div key="2" className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-verification/10 to-alert/10 rounded-full blur-3xl" />,
          <div key="3" className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-br from-alert/5 to-primary/5 rounded-full blur-3xl" />,
          <div key="4" className="absolute bottom-1/3 right-1/2 w-72 h-72 bg-gradient-to-br from-primary/5 to-verification/10 rounded-full blur-3xl" />,
        ]}
      >
        <div className="min-h-screen flex items-center justify-center px-4 relative">
          <div className="max-w-5xl mx-auto text-center relative">
            {/* Main Hero Content */}
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

            {/* Live Trust Dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="max-w-3xl mx-auto mb-12"
            >
              <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-charcoal/10 shadow-2xl">
                <div className="flex items-center gap-2 mb-6 justify-center">
                  <div className="w-2 h-2 rounded-full bg-verification animate-pulse" />
                  <span className="text-xs font-mono uppercase tracking-wider text-charcoal/60">
                    Live Verification Dashboard
                  </span>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <ConfidenceMeter score={94} label="Expert Match Quality" showPercentage />
                  </div>
                  <div className="space-y-3">
                    <ConfidenceMeter score={88} label="Citation Coverage" showPercentage />
                  </div>
                  <div className="space-y-3">
                    <ConfidenceMeter score={76} label="Source Credibility" showPercentage />
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-charcoal/10 flex items-center justify-center gap-3">
                  <TrustIndicator metric="verified" pulse />
                  <TrustIndicator metric="transparent" />
                </div>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button size="lg" asChild className="shadow-2xl hover:shadow-3xl transition-shadow">
                <Link href="/eeat-meter">
                  Get Free Analysis
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild className="backdrop-blur-sm">
                <Link href="#verification-process">See How It Works</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </DepthHero>

      {/* Flip Stat Cards - Why Expert Validation Matters */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-[1400px] mx-auto">
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

      {/* Trust Infrastructure Section */}
      <section className="relative bg-gradient-to-b from-white to-cream py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <TiltCard intensity={0.5} glowColor="rgba(119, 171, 149, 0.15)">
              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-charcoal/10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-charcoal">
                      Trust Infrastructure for the AI Age
                    </h2>
                    <p className="text-lg text-charcoal/80 mb-6 leading-relaxed">
                      Studies show that 60% of consumers doubt AI-generated content
                      <CitationMarker
                        number={1}
                        confidence="high"
                        source="Stanford Research, 2025"
                        preview="Comprehensive study of 10,000+ consumers showing significant trust gaps."
                      />
                      . CertREV builds the verification infrastructure brands need to navigate this trust crisis.
                    </p>
                    <p className="text-lg text-charcoal/80 mb-8 leading-relaxed">
                      Our platform connects your content with credentialed experts, creating a transparent verification layer that consumers and search engines recognize
                      <CitationMarker
                        number={2}
                        confidence="high"
                        source="Google E-E-A-T Guidelines, 2024"
                        preview="Official Google documentation on Experience, Expertise, Authoritativeness, and Trust signals."
                      />
                      .
                    </p>
                    <Button size="lg" asChild>
                      <Link href="/trust-showcase">
                        Explore Trust Infrastructure
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </Button>
                  </div>
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-cream to-white backdrop-blur-sm rounded-xl p-6 border border-charcoal/10 shadow-lg">
                      <h3 className="text-sm font-mono uppercase tracking-wider text-charcoal/60 mb-4">
                        Verification Confidence
                      </h3>
                      <ConfidenceMeter score={94} label="Expert Match Quality" showPercentage />
                    </div>
                    <div className="bg-gradient-to-br from-cream to-white backdrop-blur-sm rounded-xl p-6 border border-charcoal/10 shadow-lg">
                      <ConfidenceMeter score={88} label="Citation Coverage" showPercentage />
                    </div>
                    <div className="bg-gradient-to-br from-cream to-white backdrop-blur-sm rounded-xl p-6 border border-charcoal/10 shadow-lg">
                      <ConfidenceMeter score={76} label="Source Credibility" showPercentage />
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>
          </FadeIn>
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

      {/* Flip Cards - Trust Principles */}
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
            <FlipStatCard
              stat="✓"
              label="Expert Verified"
              description="Every piece of content reviewed by credentialed professionals"
              backTitle="Expert Verification"
              backDetails={[
                'Board-certified professionals',
                'Licensed practitioners',
                'Academic researchers',
                'Industry specialists'
              ]}
              icon={Shield}
              gradient="from-verification/10 to-verification/20"
            />

            <FlipStatCard
              stat="✓"
              label="FTC Compliant"
              description="All claims meet regulatory standards for consumer protection"
              backTitle="Compliance Standards"
              backDetails={[
                'Substantiation requirements',
                'Endorsement guidelines',
                'Health claim compliance',
                'Disclosure standards'
              ]}
              icon={CheckCircle2}
              gradient="from-primary/10 to-primary/20"
            />

            <FlipStatCard
              stat="✓"
              label="Fully Transparent"
              description="Complete audit trail from submission to certification"
              backTitle="Transparency Features"
              backDetails={[
                'Expert credentials disclosed',
                'Review history tracked',
                'Verification timestamps',
                'Public badge verification'
              ]}
              icon={Eye}
              gradient="from-alert/10 to-alert/20"
            />
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
