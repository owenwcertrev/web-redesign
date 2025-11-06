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
import SplitSignupButton from '@/components/SplitSignupButton'
import { TrendingUp, Users, AlertCircle, ShoppingBag, ArrowRight, Upload, FileCheck, Search, CheckCircle2, Shield, Eye } from 'lucide-react'
import CitationMarker from '@/components/trust/CitationMarker'
import ConfidenceMeter from '@/components/trust/ConfidenceMeter'
import TrustIndicator from '@/components/trust/TrustIndicator'
import OrganicShape from '@/components/OrganicShape'
import TextureOverlay from '@/components/TextureOverlay'
import Testimonial from '@/components/Testimonial'
import ExpertProfile from '@/components/ExpertProfile'
import ExpertCarousel from '@/components/ExpertCarousel'
import { featureFlags } from '@/config/features'
import { fadeUpVariants, scaleUpVariants, viewportConfig } from '@/lib/animationVariants'

// Move static content outside component to prevent recreation on every render
const processCards = [
    {
      id: 'submit',
      content: (
        <div className="bg-navy/5 p-10 rounded-2xl border-2 border-navy/20 relative overflow-hidden shadow-md">
          <TextureOverlay type="paper" opacity={0.3} />
          <div className="flex items-start gap-4 mb-6 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-navy flex items-center justify-center shadow-sm">
              <Upload className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-navy mb-3 font-serif">Submit Content</h3>
              <p className="text-black/70 text-lg leading-relaxed">
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
        <div className="bg-lime/10 p-10 rounded-2xl border-2 border-lime relative overflow-hidden shadow-md">
          <TextureOverlay type="paper" opacity={0.3} />
          <div className="flex items-start gap-4 mb-6 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-lime flex items-center justify-center shadow-sm">
              <Search className="w-7 h-7 text-navy" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-navy mb-3 font-serif">Expert Review</h3>
              <p className="text-black/70 text-lg leading-relaxed">
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
        <div className="bg-coral/10 p-10 rounded-2xl border-2 border-coral relative overflow-hidden shadow-md">
          <TextureOverlay type="paper" opacity={0.3} />
          <div className="flex items-start gap-4 mb-6 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-coral flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-navy mb-3 font-serif">Get Certified</h3>
              <p className="text-black/70 text-lg leading-relaxed">
                Receive verification badges, expert signatures, and structured data markup that boost credibility with consumers and search engines alike.
              </p>
            </div>
          </div>
        </div>
      )
    },
  ]

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section with Depth */}
      <DepthHero
        backgroundLayers={[
          <TextureOverlay key="texture" type="paper" opacity={0.3} />,
          <OrganicShape key="blob1" variant="blob1" color="lime" className="top-20 right-1/4 w-96 h-96" opacity={0.12} />,
          <OrganicShape key="blob2" variant="blob2" color="coral" className="bottom-1/4 left-1/4 w-80 h-80" opacity={0.10} />,
          <OrganicShape key="blob3" variant="blob3" color="navy" className="top-1/2 right-1/3 w-72 h-72" opacity={0.08} />,
          <OrganicShape key="blob4" variant="blob4" color="lime" className="bottom-1/3 left-1/2 w-64 h-64" opacity={0.10} />,
        ]}
      >
        <div className="min-h-[85vh] sm:min-h-[90vh] md:min-h-screen flex items-center justify-center px-4 relative pt-20 sm:pt-24">
          <div className="max-w-5xl mx-auto text-center relative">
            {/* Main Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-8 px-6 py-3 bg-white rounded-full border-2 border-lime shadow-sm"
            >
              <span className="text-sm font-semibold text-navy tracking-wide">EXPERT VERIFICATION PLATFORM</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 leading-tight font-serif"
            >
              <span className="text-navy">
                Turn Content Into
              </span>
              <br />
              <span className="text-coral">
                Credibility
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-black/70 mb-10 sm:mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Human-in-the-loop expert validation that satisfies Google's E-E-A-T, protects your organic traffic, and converts skeptical consumers
            </motion.p>

            {/* Live Trust Dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="max-w-4xl mx-auto mb-12 relative"
            >
              <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 border-2 border-navy/10 shadow-xl relative overflow-hidden">
                <TextureOverlay type="paper" opacity={0.2} />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4 sm:mb-6 md:mb-8 justify-center">
                    <div className="w-2 h-2 rounded-full bg-lime animate-pulse" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-navy/80">
                      Real-Time Trust Metrics
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
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

                  <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t-2 border-navy/10 flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
                    <TrustIndicator metric="verified" pulse label="Expert Verified" value="" />
                    <TrustIndicator metric="transparent" label="Fully Transparent" value="" />
                    <TrustIndicator metric="encrypted" label="FTC Compliant" value="" />
                    <TrustIndicator metric="immutable" label="Audit Trail" value="" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center max-w-2xl mx-auto"
            >
              <Button size="lg" variant="secondary" asChild className="w-full sm:w-auto">
                <Link href="/book-demo">Book Demo</Link>
              </Button>
              <div className="w-full sm:w-auto flex justify-center">
                <SplitSignupButton />
              </div>
              <Button size="lg" variant="secondary" asChild className="w-full sm:w-auto">
                <Link href="#verification-process">See How It Works</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </DepthHero>

      {/* Flip Stat Cards - Why Expert Validation Matters - Asymmetric spacing */}
      <section className="pt-16 pb-12 sm:pt-20 sm:pb-16 md:pt-28 md:pb-24 px-4 bg-white relative overflow-hidden">
        <TextureOverlay type="grain" opacity={0.2} />
        <div className="max-w-[1400px] mx-auto relative z-10">
          <FadeIn>
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-navy font-serif">
                Why Expert Validation Matters
              </h2>
              <p className="text-xl text-black/70 max-w-2xl mx-auto">
                The data behind expert verification
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
              transition={{ duration: 0.6 }}
            >
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
                gradient="from-navy/10 to-navy/20"
              />
            </motion.div>

            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
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
                gradient="from-lime/10 to-lime/20"
              />
            </motion.div>

            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
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
                gradient="from-coral/10 to-coral/20"
              />
            </motion.div>

            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
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
                gradient="from-navy/10 to-navy/20"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Infrastructure Section - Bold Split Layout */}
      <section className="relative bg-white pt-16 pb-20 sm:pt-20 sm:pb-24 md:pt-24 md:pb-32 px-4 overflow-hidden">
        <OrganicShape variant="blob2" color="lime" className="top-10 right-10 w-[600px] h-[600px]" opacity={0.15} />
        <OrganicShape variant="blob4" color="coral" className="bottom-10 left-10 w-[500px] h-[500px]" opacity={0.12} />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            {/* Left: Content */}
            <FadeIn>
              <div>
                <h2 className="text-5xl md:text-6xl font-bold mb-8 text-navy font-serif leading-tight">
                  Trust Infrastructure for the AI Age
                </h2>
                <p className="text-lg text-black/80 mb-6 leading-relaxed">
                  Studies show that 60% of consumers doubt AI-generated content.
                  <CitationMarker
                    number={1}
                    confidence="high"
                    source="Stanford Research, 2025"
                    preview="Comprehensive study of 10,000+ consumers showing significant trust gaps."
                  /> CertREV builds the human-in-the-loop verification infrastructure brands need to navigate this trust crisis.
                </p>
                <p className="text-lg text-black/80 mb-8 leading-relaxed">
                  Our platform connects your content with credentialed experts, creating a transparent human-in-the-loop verification layer that consumers and search engines recognize.
                  <CitationMarker
                    number={2}
                    confidence="high"
                    source="Google E-E-A-T Guidelines, 2024"
                    preview="Official Google documentation on Experience, Expertise, Authoritativeness, and Trust signals."
                  />
                </p>
              </div>
            </FadeIn>

            {/* Right: Trust Metrics */}
            <TiltCard intensity={0.7} glowColor="rgba(212, 225, 87, 0.2)">
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 border-2 border-lime/20 shadow-md relative overflow-hidden">
                  <TextureOverlay type="paper" opacity={0.2} />
                  <div className="relative z-10">
                    <ConfidenceMeter score={94} label="Expert Match Quality" showPercentage />
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 border-2 border-lime/20 shadow-md relative overflow-hidden">
                  <TextureOverlay type="paper" opacity={0.2} />
                  <div className="relative z-10">
                    <ConfidenceMeter score={88} label="Citation Coverage" showPercentage />
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 border-2 border-lime/20 shadow-md relative overflow-hidden">
                  <TextureOverlay type="paper" opacity={0.2} />
                  <div className="relative z-10">
                    <ConfidenceMeter score={76} label="Source Credibility" showPercentage />
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* Stacked Cards - Layered Process */}
      <section id="verification-process" className="py-16 sm:py-20 md:py-28 px-4 bg-white relative overflow-hidden">
        <TextureOverlay type="paper" opacity={0.2} />
        <div className="max-w-4xl mx-auto relative z-10">
          <FadeIn>
            <div className="text-center mb-20">
              <div className="inline-block mb-6 px-6 py-3 bg-lime/10 rounded-full border-2 border-lime shadow-md">
                <span className="text-sm font-semibold text-navy tracking-wide">LAYERED PROCESS</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-navy font-serif">
                Verification in Layers
              </h2>
              <p className="text-xl text-black/70 max-w-2xl mx-auto">
                Three steps to expert-validated content
              </p>
            </div>
          </FadeIn>

          <StackedCards cards={processCards} />
        </div>
      </section>


      {/* Expert Tiers Carousel */}
      <section className="relative bg-beige py-16 sm:py-20 md:py-28 px-4 overflow-visible">
        <OrganicShape variant="blob1" color="coral" className="top-0 left-0 w-96 h-96" opacity={0.06} />
        <div className="max-w-7xl mx-auto relative z-10">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="inline-block mb-6 px-6 py-3 bg-white rounded-full border-2 border-navy/20 shadow-sm">
                <span className="text-sm font-semibold text-navy">6 EXPERT LEVELS</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-navy font-serif">
                Expert Credential Tiers
              </h2>
              <p className="text-xl text-black/70 max-w-3xl mx-auto mb-4">
                From certified coaches to medical doctors, financial advisors to attorneys — we have the right expert for your content
              </p>
              <p className="text-sm text-black/40">
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

      {/* Trust Principles - Modern Card Design */}
      <section className="pt-16 pb-12 sm:pt-24 sm:pb-20 md:pt-32 md:pb-28 px-4 bg-white relative overflow-hidden">
        <TextureOverlay type="grain" opacity={0.08} />
        <div className="max-w-7xl mx-auto relative z-10">
          <FadeIn>
            <div className="text-center mb-20">
              <div className="inline-block mb-6 px-6 py-3 bg-beige rounded-full border-2 border-navy/10">
                <span className="text-sm font-semibold text-navy tracking-wide">TRUST PRINCIPLES</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-8 text-black font-serif leading-tight">
                Built on Trust Principles
              </h2>
              <p className="text-xl text-black/70 max-w-2xl mx-auto leading-relaxed">
                Expert verification, FTC compliance, and complete transparency
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0, duration: 0.6 }}
            >
              <TiltCard intensity={0.7} glowColor="rgba(119, 171, 149, 0.3)">
                <div className="bg-white rounded-3xl p-8 border-2 border-lime/20 shadow-md h-full flex flex-col relative overflow-hidden">
                  <TextureOverlay type="paper" opacity={0.2} />
                  <div className="w-16 h-16 bg-lime rounded-full flex items-center justify-center mb-6 shadow-sm relative z-10">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-black mb-4 font-serif relative z-10">Expert Verified</h3>
                  <p className="text-black/70 mb-6 leading-relaxed flex-grow relative z-10">
                    Every piece of content reviewed by credentialed professionals with verified expertise
                  </p>
                  <ul className="space-y-3 relative z-10">
                    {['Board-certified professionals', 'Licensed practitioners', 'Industry specialists'].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-black/80">
                        <div className="w-1.5 h-1.5 bg-lime rounded-full flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </TiltCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.6 }}
            >
              <TiltCard intensity={0.7} glowColor="rgba(10, 27, 63, 0.3)">
                <div className="bg-white rounded-3xl p-8 border-2 border-navy/20 shadow-md h-full flex flex-col relative overflow-hidden">
                  <TextureOverlay type="paper" opacity={0.2} />
                  <div className="w-16 h-16 bg-navy rounded-full flex items-center justify-center mb-6 shadow-sm relative z-10">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-black mb-4 font-serif relative z-10">FTC Compliant</h3>
                  <p className="text-black/70 mb-6 leading-relaxed flex-grow relative z-10">
                    All claims meet regulatory standards for consumer protection and advertising truth
                  </p>
                  <ul className="space-y-3 relative z-10">
                    {['Substantiation requirements', 'Endorsement guidelines', 'Health claim compliance'].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-black/80">
                        <div className="w-1.5 h-1.5 bg-navy rounded-full flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </TiltCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <TiltCard intensity={0.7} glowColor="rgba(240, 123, 97, 0.3)">
                <div className="bg-white rounded-3xl p-8 border-2 border-coral/20 shadow-md h-full flex flex-col relative overflow-hidden">
                  <TextureOverlay type="paper" opacity={0.2} />
                  <div className="w-16 h-16 bg-coral rounded-full flex items-center justify-center mb-6 shadow-sm relative z-10">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-black mb-4 font-serif relative z-10">Fully Transparent</h3>
                  <p className="text-black/70 mb-6 leading-relaxed flex-grow relative z-10">
                    Complete audit trail from submission to certification with public verification
                  </p>
                  <ul className="space-y-3 relative z-10">
                    {['Expert credentials disclosed', 'Review history tracked', 'Public badge verification'].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-black/80">
                        <div className="w-1.5 h-1.5 bg-coral rounded-full flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </TiltCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof Section - Testimonials & Experts - Asymmetric spacing */}
      <section className="relative bg-white pt-16 pb-20 sm:pt-20 sm:pb-24 md:pt-24 md:pb-32 px-4 overflow-hidden">
        <TextureOverlay type="grain" opacity={0.15} />
        <OrganicShape variant="blob4" color="lime" className="top-0 right-0 w-96 h-96" opacity={0.08} />
        <div className="max-w-7xl mx-auto relative z-10">
          <FadeIn>
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-navy font-serif">
                Brands & Experts Choose CertREV
              </h2>
              <p className="text-xl text-black/70 max-w-2xl mx-auto">
                Join the growing community of brands and credentialed professionals building trust
              </p>
            </div>
          </FadeIn>

          {/* Testimonials Grid - Offset Layout */}
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="md:translate-y-8"
            >
              <Testimonial
                quote="CertREV transformed how we approach content credibility. Our organic traffic recovered within 3 months of implementing expert verification."
                name="Sarah Chen"
                role="VP of Content"
                company="WellnessBrand Co."
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="md:-translate-y-8"
            >
              <Testimonial
                quote="As a dermatologist, I appreciate how CertREV makes it easy to lend my expertise to brands I trust. The platform is intuitive and the compensation is fair."
                name="Dr. James Mitchell"
                role="Board-Certified Dermatologist"
                company="CertREV Expert Network"
              />
            </motion.div>
          </div>

          {/* Expert Profiles - Compact Grid */}
          {featureFlags.homepage.expertNetwork && (
            <>
              <FadeIn delay={0.2}>
                <div className="text-center mb-12">
                  <div className="inline-block mb-4 px-6 py-2 bg-lime/10 rounded-full border-2 border-lime/30 shadow-sm">
                    <span className="text-xs font-semibold text-navy tracking-wide">OUR EXPERTS</span>
                  </div>
                  <h3 className="text-3xl font-bold text-navy font-serif mb-3">
                    Meet Our Expert Network
                  </h3>
                  <p className="text-black/70">
                    Credentialed professionals across health, wellness, finance, and professional services
                  </p>
                </div>
              </FadeIn>

              <ExpertCarousel
                autoPlay
                autoPlayInterval={6000}
                items={[
                  <ExpertProfile
                    key="emily"
                    name="Dr. Emily Rodriguez"
                    credentials="MD, Board-Certified"
                    specialty="Internal Medicine & Wellness"
                    bio="15+ years experience reviewing health content for major wellness brands"
                    tier={6}
                  />,
                  <ExpertProfile
                    key="michael"
                    name="Michael Thompson, RDN"
                    credentials="Registered Dietitian Nutritionist"
                    specialty="Sports Nutrition & Supplements"
                    bio="Specializes in nutrition claim verification and FDA compliance"
                    tier={3}
                  />,
                  <ExpertProfile
                    key="jennifer"
                    name="Jennifer Park, CFA"
                    credentials="Chartered Financial Analyst"
                    specialty="Financial Services Content"
                    bio="Expert in investment content review and SEC compliance"
                    tier={4}
                  />,
                  <ExpertProfile
                    key="sarah"
                    name="Sarah Mitchell, PE"
                    credentials="Professional Engineer"
                    specialty="Technical & Engineering Content"
                    bio="Validates technical specifications and engineering claims for B2B brands"
                    tier={5}
                  />,
                  <ExpertProfile
                    key="david"
                    name="David Chen, JD"
                    credentials="Attorney at Law"
                    specialty="Legal & Compliance"
                    bio="Reviews legal content and ensures regulatory compliance across industries"
                    tier={5}
                  />,
                  <ExpertProfile
                    key="lisa"
                    name="Lisa Anderson, PhD"
                    credentials="Clinical Psychologist"
                    specialty="Mental Health & Wellness"
                    bio="Expert in mental health content accuracy and ethical representation"
                    tier={6}
                  />
                ]}
              />
            </>
          )}
        </div>
      </section>

      {/* The Human Layer - Hidden for MVP */}
      {/* <section className="relative bg-beige pt-16 pb-12 sm:pt-24 sm:pb-20 md:pt-32 md:pb-28 px-4 overflow-hidden">
        <OrganicShape variant="blob3" color="lime" className="bottom-0 right-0 w-[500px] h-[500px]" opacity={0.08} />
        <div className="max-w-6xl mx-auto relative z-10">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-navy font-serif">
                The Human Layer
              </h2>
              <p className="text-xl md:text-2xl italic text-black/70 max-w-3xl mx-auto leading-relaxed">
                In a world where AI writes faster than we can fact-check, CertREV puts human experts back in the loop
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-10 sm:mb-12">
            {[
              {
                category: 'Trust & AI',
                title: 'Why 60% of Consumers Doubt AI-Generated Content',
                excerpt: 'Stanford\'s latest research reveals a growing trust gap. Here\'s what brands need to know about maintaining credibility in the AI age.',
                gradient: 'from-navy/20 to-lime/20'
              },
              {
                category: 'SEO Strategy',
                title: 'Google\'s E-E-A-T Update: What Changed in 2024',
                excerpt: 'The extra \'E\' for Experience changed everything. Learn how expert validation protects your organic traffic from algorithm updates.',
                gradient: 'from-lime/20 to-coral/20'
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
                  <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border-2 border-navy/10 hover:border-navy/20 relative">
                    <TextureOverlay type="paper" opacity={0.2} />
                    <div className={`h-56 bg-gradient-to-br ${article.gradient} relative z-10 flex items-center justify-center`}>
                      <div className="text-6xl opacity-10 font-serif font-bold text-navy">
                        {index === 0 ? '60%' : 'E-E-A-T'}
                      </div>
                    </div>
                    <div className="p-8 relative z-10">
                      <span className="text-sm text-coral font-semibold uppercase tracking-wide">{article.category}</span>
                      <h3 className="text-2xl font-bold mt-3 mb-4 text-navy group-hover:text-coral transition-colors font-serif">
                        {article.title}
                      </h3>
                      <p className="text-black/70 mb-6 leading-relaxed">
                        {article.excerpt}
                      </p>
                      <div className="inline-flex items-center gap-2 text-coral font-semibold group-hover:gap-4 transition-all">
                        Read More <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          <FadeIn delay={0.4}>
            <div className="bg-white rounded-2xl p-12 shadow-lg text-center border-2 border-lime relative overflow-hidden">
              <TextureOverlay type="paper" opacity={0.2} />
              <h3 className="text-3xl font-bold mb-4 text-navy font-serif relative z-10">Stay Informed</h3>
              <p className="text-black/70 mb-8 text-lg max-w-2xl mx-auto relative z-10">
                Get insights on trust, expertise, and content strategy delivered to your inbox
              </p>
              <div className="relative z-10">
                <NewsletterSignup />
              </div>
            </div>
          </FadeIn>
        </div>
      </section> */}

      {/* Final CTA Section - Asymmetric spacing */}
      <section className="relative bg-white pt-16 pb-20 sm:pt-24 sm:pb-28 md:pt-32 md:pb-36 px-4 overflow-hidden">
        <TextureOverlay type="grain" opacity={0.15} />
        <OrganicShape variant="blob2" color="coral" className="top-0 left-0 w-96 h-96" opacity={0.08} />
        <OrganicShape variant="blob1" color="lime" className="bottom-0 right-0 w-[400px] h-[400px]" opacity={0.10} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <FadeIn>
            <h2 className="text-6xl md:text-7xl font-bold mb-8 text-navy leading-tight font-serif">
              Start Building Trust Today
            </h2>
            <p className="text-xl md:text-2xl text-black/70 mb-14 max-w-2xl mx-auto">
              Get your free E-E-A-T analysis and discover how expert validation transforms skeptics into believers
            </p>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Button size="lg" asChild>
                <Link href="/eeat-meter">
                  Try the E-E-A-T Meter Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
