'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Button from '@/components/Button'
import DepthHero from '@/components/cards3d/DepthHero'
import FlipStatCard from '@/components/cards3d/FlipStatCard'
import TiltCard from '@/components/cards3d/TiltCard'
import FadeIn from '@/components/animations/FadeIn'
import TextureOverlay from '@/components/TextureOverlay'
import OrganicShape from '@/components/OrganicShape'
import EEATMeterTool from '@/components/EEATMeterTool'
import { BarChart, FileCheck, TrendingUp, Users, AlertCircle, ShoppingBag, Sparkles, ArrowRight } from 'lucide-react'

export default function EEATMeterPage() {
  return (
    <div>
      {/* Hero Section with Depth */}
      <DepthHero
        backgroundLayers={[
          <div key="bg" className="absolute inset-0 bg-beige" />,
          <TextureOverlay key="texture" type="paper" opacity={0.3} />,
          <OrganicShape key="shape1" variant="blob1" color="lime" className="absolute top-1/4 right-1/4 w-96 h-96" opacity={0.08} />,
          <OrganicShape key="shape2" variant="blob2" color="coral" className="absolute bottom-1/4 left-1/4 w-80 h-80" opacity={0.06} />,
        ]}
      >
        <div className="min-h-[70vh] flex items-center justify-center px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-6 px-6 py-3 bg-white rounded-full border-2 border-coral/20 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-coral" />
                <span className="text-sm font-semibold text-navy tracking-wide">FREE CONTENT ANALYSIS</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 leading-tight font-serif"
            >
              <span className="text-navy">
                Discover Your Content's
              </span>
              <br />
              <span className="text-coral">
                Credibility Score
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl md:text-2xl text-black/70 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              60% of consumers doubt AI-generated content. Find out if your content has the expert signals needed to rank higher and convert skeptical audiences.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap justify-center gap-4 text-sm mb-8"
            >
              <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-navy/20 shadow-sm">
                <span className="text-navy font-semibold">Instant E-E-A-T Analysis</span>
              </div>
              <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-navy/20 shadow-sm">
                <span className="text-navy font-semibold">Domain Authority Insights</span>
              </div>
              <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-navy/20 shadow-sm">
                <span className="text-navy font-semibold">Expert Verification Roadmap</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="flex flex-wrap justify-center items-center gap-6 text-sm"
            >
              <div className="flex items-center gap-2 text-black/60">
                <div className="w-8 h-8 rounded-full bg-lime/20 flex items-center justify-center">
                  <span className="text-lime-dark font-bold text-xs">✓</span>
                </div>
                <span><strong className="text-navy">15,000+</strong> URLs analyzed</span>
              </div>
              <div className="flex items-center gap-2 text-black/60">
                <div className="w-8 h-8 rounded-full bg-lime/20 flex items-center justify-center">
                  <span className="text-lime-dark font-bold text-xs">✓</span>
                </div>
                <span><strong className="text-navy">500+</strong> credentialed experts</span>
              </div>
              <div className="flex items-center gap-2 text-black/60">
                <div className="w-8 h-8 rounded-full bg-lime/20 flex items-center justify-center">
                  <span className="text-lime-dark font-bold text-xs">✓</span>
                </div>
                <span>Powered by <strong className="text-navy">DataForSEO</strong></span>
              </div>
            </motion.div>
          </div>
        </div>
      </DepthHero>

      {/* E-E-A-T Meter Tool - Lead with the tool */}
      <section className="bg-beige py-20 px-4 relative overflow-hidden">
        <TextureOverlay type="paper" opacity={0.3} />
        <OrganicShape variant="blob3" color="lime" className="absolute -bottom-20 -right-20 w-96 h-96" opacity={0.06} />
        <div className="max-w-4xl mx-auto relative z-10">
          <FadeIn>
            <div className="text-center mb-8">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-navy font-serif">
                See How Your Content Measures Up
              </h2>
              <p className="text-xl text-black/70 mb-8 max-w-2xl mx-auto leading-relaxed">
                Get your E-E-A-T score in 30 seconds. No signup required.
              </p>
            </div>
          </FadeIn>

          <EEATMeterTool />

          <div className="mt-12 grid md:grid-cols-4 gap-4 text-center">
            <div className="bg-white rounded-xl p-4 border-2 border-navy/10 shadow-sm">
              <div className="text-2xl font-bold text-navy mb-1">0-100</div>
              <div className="text-sm text-black/60">E-E-A-T Score</div>
            </div>
            <div className="bg-white rounded-xl p-4 border-2 border-navy/10 shadow-sm">
              <div className="text-2xl font-bold text-navy mb-1">4 Factors</div>
              <div className="text-sm text-black/60">Detailed Breakdown</div>
            </div>
            <div className="bg-white rounded-xl p-4 border-2 border-navy/10 shadow-sm">
              <div className="text-2xl font-bold text-navy mb-1">Live Data</div>
              <div className="text-sm text-black/60">Domain Authority</div>
            </div>
            <div className="bg-white rounded-xl p-4 border-2 border-navy/10 shadow-sm">
              <div className="text-2xl font-bold text-navy mb-1">Instant</div>
              <div className="text-sm text-black/60">Results</div>
            </div>
          </div>
        </div>
      </section>

      {/* What Happens After You See Your Score */}
      <section className="bg-white py-20 px-4 relative overflow-hidden">
        <TextureOverlay type="grain" opacity={0.15} />
        <div className="max-w-6xl mx-auto relative z-10">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-navy font-serif">
                How Expert Verification Fixes Your E-E-A-T Score
              </h2>
              <p className="text-xl text-black/70 max-w-3xl mx-auto">
                Credentialed professionals add the trust signals Google and consumers demand
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
            >
              <TiltCard intensity={0.6} glowColor="rgba(212, 225, 87, 0.2)">
                <div className="bg-beige rounded-2xl p-6 border-2 border-lime/20 shadow-xl h-full relative overflow-hidden">
                  <TextureOverlay type="paper" opacity={0.3} />
                  <div className="w-12 h-12 rounded-xl bg-lime/20 flex items-center justify-center mb-4 relative z-10">
                    <Users className="w-6 h-6 text-lime-dark" />
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-3 font-serif relative z-10">Add Expert Experience</h3>
                  <p className="text-black/70 text-sm leading-relaxed mb-4 relative z-10">
                    Board-certified dermatologists, registered dietitians (RDN), licensed nurses (RN), and certified professionals verify your claims against current research and industry standards.
                  </p>
                  <div className="bg-white rounded-xl p-4 border-2 border-lime/30 relative z-10">
                    <p className="text-sm font-semibold text-navy mb-2">Result:</p>
                    <p className="text-xs text-black/70">First-hand expertise signals that separate human knowledge from AI-generated content</p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              <TiltCard intensity={0.6} glowColor="rgba(212, 225, 87, 0.2)">
                <div className="bg-beige rounded-2xl p-6 border-2 border-lime/20 shadow-xl h-full relative overflow-hidden">
                  <TextureOverlay type="paper" opacity={0.3} />
                  <div className="w-12 h-12 rounded-xl bg-lime/20 flex items-center justify-center mb-4 relative z-10">
                    <FileCheck className="w-6 h-6 text-lime-dark" />
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-3 font-serif relative z-10">Build Authority Signals</h3>
                  <p className="text-black/70 text-sm leading-relaxed mb-4 relative z-10">
                    Expert bylines with credentials, schema markup Google recognizes, and verification badges create the authority signals search engines prioritize for E-E-A-T compliance.
                  </p>
                  <div className="bg-white rounded-xl p-4 border-2 border-lime/30 relative z-10">
                    <p className="text-sm font-semibold text-navy mb-2">Result:</p>
                    <p className="text-xs text-black/70">Protection against algorithm updates and improved rankings for competitive keywords</p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <TiltCard intensity={0.6} glowColor="rgba(212, 225, 87, 0.2)">
                <div className="bg-beige rounded-2xl p-6 border-2 border-lime/20 shadow-xl h-full relative overflow-hidden">
                  <TextureOverlay type="paper" opacity={0.3} />
                  <div className="w-12 h-12 rounded-xl bg-lime/20 flex items-center justify-center mb-4 relative z-10">
                    <TrendingUp className="w-6 h-6 text-lime-dark" />
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-3 font-serif relative z-10">Earn Consumer Trust</h3>
                  <p className="text-black/70 text-sm leading-relaxed mb-4 relative z-10">
                    Transparent expert reviews, verification seals, and credibility markers convert skeptical consumers — especially critical for health, wellness, finance, and professional service content.
                  </p>
                  <div className="bg-white rounded-xl p-4 border-2 border-lime/30 relative z-10">
                    <p className="text-sm font-semibold text-navy mb-2">Result:</p>
                    <p className="text-xs text-black/70">40% higher purchase intent and improved conversion rates from verified content</p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Educational Section - E-E-A-T Explained */}
      <section className="bg-white py-32 px-4 relative overflow-hidden">
        <TextureOverlay type="grain" opacity={0.15} />
        <OrganicShape variant="blob4" color="coral" className="absolute top-0 left-0 w-96 h-96" opacity={0.08} />
        <div className="max-w-6xl mx-auto relative z-10">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-navy font-serif">
                What is E-E-A-T?
              </h2>
              <p className="text-xl text-black/70 max-w-3xl mx-auto">
                Google's framework for evaluating content quality — and why it matters for your brand
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {[
              {
                title: 'Experience',
                description: 'Demonstrates first-hand, real-world experience with the topic. This is what separates human expertise from AI-generated content.',
                color: 'rgba(212, 225, 87, 0.2)',
                borderColor: 'border-lime/20'
              },
              {
                title: 'Expertise',
                description: 'Shows credentialed knowledge and qualifications in the subject matter. Professional credentials and certifications signal expertise.',
                color: 'rgba(10, 27, 63, 0.2)',
                borderColor: 'border-navy/20'
              },
              {
                title: 'Authoritativeness',
                description: 'Recognized as a leading source in the industry. Built through citations, backlinks, press mentions, and expert partnerships.',
                color: 'rgba(232, 96, 60, 0.2)',
                borderColor: 'border-coral/20'
              },
              {
                title: 'Trustworthiness',
                description: 'Proven accuracy, transparency, and reliability. Fact-checking, expert reviews, and clear sourcing build trust with audiences.',
                color: 'rgba(212, 225, 87, 0.2)',
                borderColor: 'border-lime/20'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <TiltCard intensity={0.6} glowColor={item.color}>
                  <div className={`bg-white rounded-2xl p-8 border-2 ${item.borderColor} shadow-xl h-full relative overflow-hidden`}>
                    <TextureOverlay type="paper" opacity={0.3} />
                    <h3 className="text-2xl font-bold mb-4 text-navy font-serif relative z-10">{item.title}</h3>
                    <p className="text-black/70 leading-relaxed relative z-10">{item.description}</p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>

          <div className="bg-beige rounded-3xl p-10 md:p-14 border-2 border-navy/10 shadow-xl relative overflow-hidden">
            <TextureOverlay type="paper" opacity={0.3} />
            <h3 className="text-3xl font-bold mb-6 text-navy font-serif relative z-10">
              Why E-E-A-T Matters for YMYL Content
            </h3>
            <p className="text-lg text-black/80 mb-6 leading-relaxed relative z-10">
              Health, wellness, financial, and legal content falls under Google's "Your Money or Your Life" (YMYL) category — content
              that can impact health, safety, or financial well-being. Google applies the strictest E-E-A-T standards to YMYL content,
              requiring verified expert credentials from Tier 1-3 professionals (MDs, CPAs, JDs, RNs, RDNs).
            </p>
            <p className="text-lg text-black/80 mb-4 leading-relaxed font-semibold relative z-10">
              Without expert-verified content, YMYL brands face:
            </p>
            <ul className="grid md:grid-cols-2 gap-4 text-black/80 mb-6 relative z-10">
              <li className="flex items-start gap-3 bg-white rounded-xl p-4 border-2 border-navy/10">
                <span className="text-navy font-bold">•</span>
                <span><strong>88% traffic drops</strong> from algorithm updates (HubSpot case study)</span>
              </li>
              <li className="flex items-start gap-3 bg-white rounded-xl p-4 border-2 border-navy/10">
                <span className="text-navy font-bold">•</span>
                <span><strong>Lower rankings</strong> for competitive keywords without expert attribution</span>
              </li>
              <li className="flex items-start gap-3 bg-white rounded-xl p-4 border-2 border-navy/10">
                <span className="text-navy font-bold">•</span>
                <span><strong>60% consumer doubt</strong> for AI-generated or anonymous content</span>
              </li>
              <li className="flex items-start gap-3 bg-white rounded-xl p-4 border-2 border-navy/10">
                <span className="text-navy font-bold">•</span>
                <span><strong>$51,744 average FTC fine</strong> per violation for unsubstantiated health/wellness claims</span>
              </li>
            </ul>
            <div className="bg-lime-light/30 rounded-2xl p-6 border-2 border-lime/30 relative z-10">
              <p className="text-lg text-black/90 leading-relaxed">
                <strong className="text-navy">Expert verification through CertREV</strong> helps brands meet E-E-A-T standards, protect organic traffic from algorithm penalties, ensure regulatory compliance, and convert skeptical consumers into customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals Section - Flip Cards */}
      <section className="bg-beige py-32 px-4 relative overflow-hidden">
        <TextureOverlay type="paper" opacity={0.3} />
        <OrganicShape variant="blob1" color="lime" className="absolute top-0 right-0 w-96 h-96" opacity={0.08} />
        <div className="max-w-7xl mx-auto relative z-10">
          <FadeIn>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-navy font-serif">
                The Impact of Expert Validation
              </h2>
              <p className="text-xl text-black/70 max-w-2xl mx-auto">
                Real data on traffic, trust, compliance, and conversions
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FlipStatCard
              stat="88%"
              label="Traffic Drop"
              description="Without verifiable expertise"
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

            <FlipStatCard
              stat="60%"
              label="Consumer Doubt"
              description="Doubt AI-only content"
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

            <FlipStatCard
              stat="$51,744"
              label="Per Violation"
              description="Average FTC fine per violation"
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

            <FlipStatCard
              stat="↑40%"
              label="Purchase Intent"
              description="Expert-reviewed content performs better"
              backTitle="Conversion Impact"
              backDetails={[
                'Nielsen x inPowered meta-analysis',
                'Expert content outperforms ads',
                'Builds long-term brand trust',
                'Compound effect over time'
              ]}
              icon={ShoppingBag}
              gradient="from-black/10 to-black/20"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-32 px-4 relative overflow-hidden">
        <TextureOverlay type="grain" opacity={0.15} />
        <div className="max-w-4xl mx-auto relative z-10">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-navy font-serif">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-black/70">
                Everything you need to know about E-E-A-T scoring
              </p>
            </div>
          </FadeIn>

          <div className="space-y-4">
            <details className="bg-beige rounded-16 p-6 border-2 border-navy/10 group">
              <summary className="font-semibold text-navy text-lg cursor-pointer list-none flex items-center justify-between">
                Why should I trust this E-E-A-T score?
                <span className="text-navy/40 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-black/70 leading-relaxed">
                Our analysis uses real-time data from <strong>DataForSEO's Domain Authority API</strong>, which tracks 21M+ keywords, organic traffic estimates, and domain rankings. We combine this with on-page analysis of your content structure, author attribution, schema markup, and trust signals to calculate a comprehensive E-E-A-T score based on Google's Quality Rater Guidelines.
              </p>
            </details>

            <details className="bg-beige rounded-16 p-6 border-2 border-navy/10 group">
              <summary className="font-semibold text-navy text-lg cursor-pointer list-none flex items-center justify-between">
                Can I improve my score without expert verification?
                <span className="text-navy/40 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-black/70 leading-relaxed">
                You can make some improvements (adding author bios, SSL certificates, better content structure), but <strong>verified expert credentials are the most impactful factor</strong> for E-E-A-T scores. Google's algorithms prioritize content reviewed by credentialed professionals (MDs, RNs, CPAs, JDs) — especially for YMYL content. DIY improvements typically boost scores 10-15 points; expert verification can add 30-40 points.
              </p>
            </details>

            <details className="bg-beige rounded-16 p-6 border-2 border-navy/10 group">
              <summary className="font-semibold text-navy text-lg cursor-pointer list-none flex items-center justify-between">
                How long does it take to see results from improving my E-E-A-T score?
                <span className="text-navy/40 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-black/70 leading-relaxed">
                <strong>Technical improvements</strong> (schema markup, author attribution) can be recognized within 2-4 weeks after Google recrawls your pages. <strong>Organic traffic recovery</strong> from expert verification typically takes 3-6 months as Google's algorithms reevaluate your site's authority. Brands that maintain consistent expert verification see compounding benefits over 12+ months.
              </p>
            </details>

            <details className="bg-beige rounded-16 p-6 border-2 border-navy/10 group">
              <summary className="font-semibold text-navy text-lg cursor-pointer list-none flex items-center justify-between">
                What if my score is already high (70+)?
                <span className="text-navy/40 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-black/70 leading-relaxed">
                A high score means you're ahead of most competitors, but <strong>Google's algorithm updates can change rankings overnight</strong>. Brands with 70+ scores that didn't maintain expert verification saw 20-30% traffic drops during recent updates. Ongoing expert review (4-8 articles/month) protects your authority and keeps you competitive as standards evolve.
              </p>
            </details>

            <details className="bg-beige rounded-16 p-6 border-2 border-navy/10 group">
              <summary className="font-semibold text-navy text-lg cursor-pointer list-none flex items-center justify-between">
                How much does expert verification cost?
                <span className="text-navy/40 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-black/70 leading-relaxed">
                Expert review pricing ranges from <strong>$160 per article</strong> (Starter Plan: 4 reviews/month) to custom enterprise pricing for high-volume brands. Most brands improving from 40-50 to 75+ need 12-15 expert reviews over 2-3 months ($1,920-2,400/month on Core SEO plan). <Link href="/pricing" className="text-navy underline hover:text-coral transition-colors">See full pricing →</Link>
              </p>
            </details>

            <details className="bg-beige rounded-16 p-6 border-2 border-navy/10 group">
              <summary className="font-semibold text-navy text-lg cursor-pointer list-none flex items-center justify-between">
                Does Google actually use E-E-A-T as a ranking factor?
                <span className="text-navy/40 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-black/70 leading-relaxed">
                Google states that E-E-A-T is <strong>not a direct ranking factor</strong>, but it's a core part of their Quality Rater Guidelines — the framework human evaluators use to assess search results. Algorithm updates like Helpful Content Update and Core Updates heavily penalize sites without expert signals. The data proves the impact: brands without verified expertise saw 35-88% traffic drops post-update.
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  )
}
