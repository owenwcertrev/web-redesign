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
                E-E-A-T
              </span>
              <br />
              <span className="text-coral">
                Meter
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl md:text-2xl text-black/70 mb-4 max-w-2xl mx-auto"
            >
              Is Your Content Invisible to Google?
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-lg text-black/60 max-w-2xl mx-auto mb-6"
            >
              Without verified expert credentials, your content may be getting buried — no matter how good it is. Find out where you stand in 30 seconds.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="flex flex-wrap justify-center gap-4 text-sm"
            >
              <div className="bg-coral/10 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-coral/30">
                <span className="text-coral mr-2">⚠</span>
                <span className="text-navy font-semibold">Missing Expert Bylines?</span>
              </div>
              <div className="bg-coral/10 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-coral/30">
                <span className="text-coral mr-2">⚠</span>
                <span className="text-navy font-semibold">No Verified Credentials?</span>
              </div>
              <div className="bg-coral/10 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-coral/30">
                <span className="text-coral mr-2">⚠</span>
                <span className="text-navy font-semibold">Traffic Declining?</span>
              </div>
            </motion.div>
          </div>
        </div>
      </DepthHero>

      {/* E-E-A-T Meter Tool - Move to top */}
      <section className="bg-beige py-20 px-4 relative overflow-hidden">
        <TextureOverlay type="paper" opacity={0.3} />
        <OrganicShape variant="blob3" color="lime" className="absolute -bottom-20 -right-20 w-96 h-96" opacity={0.06} />
        <div className="max-w-4xl mx-auto relative z-10">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-navy font-serif">
                See Your Score in 30 Seconds
              </h2>
              <p className="text-xl text-black/70 mb-6 max-w-2xl mx-auto leading-relaxed">
                Discover what's hurting your rankings and how expert verification can fix it — instantly and free.
              </p>
              <div className="bg-white rounded-2xl p-6 max-w-3xl mx-auto border-2 border-coral/20 shadow-lg mb-10">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-coral flex-shrink-0 mt-1" />
                  <div className="text-left">
                    <h3 className="font-bold text-navy mb-2">You'll discover:</h3>
                    <ul className="text-sm text-black/70 leading-relaxed space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-coral font-bold">•</span>
                        <span><strong>Your E-E-A-T score</strong> — how Google sees your content's credibility</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-coral font-bold">•</span>
                        <span><strong>Missing trust signals</strong> — author bylines, credentials, expert reviews</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-coral font-bold">•</span>
                        <span><strong>Domain authority gaps</strong> — where you rank vs. competitors</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-coral font-bold">•</span>
                        <span><strong>How CertREV can help</strong> — specific fixes to boost your score</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
          <EEATMeterTool />
        </div>
      </section>

      {/* What Happens After You See Your Score */}
      <section className="bg-white py-20 px-4 relative overflow-hidden">
        <TextureOverlay type="grain" opacity={0.15} />
        <div className="max-w-6xl mx-auto relative z-10">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-navy font-serif">
                Your Score Reveals the Problem.<br />CertREV Delivers the Solution.
              </h2>
              <p className="text-xl text-black/70 max-w-3xl mx-auto">
                Most brands score below 50/100 — here's how we fix it
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
              <TiltCard intensity={0.6} glowColor="rgba(232, 96, 60, 0.2)">
                <div className="bg-beige rounded-2xl p-6 border-2 border-coral/20 shadow-xl h-full relative overflow-hidden">
                  <TextureOverlay type="paper" opacity={0.3} />
                  <div className="w-12 h-12 rounded-xl bg-coral/20 flex items-center justify-center mb-4 relative z-10">
                    <AlertCircle className="w-6 h-6 text-coral" />
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-3 font-serif relative z-10">Low Experience Score?</h3>
                  <p className="text-black/70 text-sm leading-relaxed mb-4 relative z-10">
                    Your content lacks first-hand expertise signals that separate human knowledge from AI-generated fluff.
                  </p>
                  <div className="bg-white rounded-xl p-4 border-2 border-lime/20 relative z-10">
                    <p className="text-sm font-semibold text-lime-dark mb-2">✓ CertREV Fix:</p>
                    <p className="text-xs text-black/70">Connect with credentialed experts who add verified experience to your content</p>
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
              <TiltCard intensity={0.6} glowColor="rgba(232, 96, 60, 0.2)">
                <div className="bg-beige rounded-2xl p-6 border-2 border-coral/20 shadow-xl h-full relative overflow-hidden">
                  <TextureOverlay type="paper" opacity={0.3} />
                  <div className="w-12 h-12 rounded-xl bg-coral/20 flex items-center justify-center mb-4 relative z-10">
                    <FileCheck className="w-6 h-6 text-coral" />
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-3 font-serif relative z-10">Missing Expertise?</h3>
                  <p className="text-black/70 text-sm leading-relaxed mb-4 relative z-10">
                    No author bylines, credentials, or schema markup means Google can't verify who wrote your content.
                  </p>
                  <div className="bg-white rounded-xl p-4 border-2 border-lime/20 relative z-10">
                    <p className="text-sm font-semibold text-lime-dark mb-2">✓ CertREV Fix:</p>
                    <p className="text-xs text-black/70">Expert attribution with credentials, badges, and structured data that search engines recognize</p>
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
              <TiltCard intensity={0.6} glowColor="rgba(232, 96, 60, 0.2)">
                <div className="bg-beige rounded-2xl p-6 border-2 border-coral/20 shadow-xl h-full relative overflow-hidden">
                  <TextureOverlay type="paper" opacity={0.3} />
                  <div className="w-12 h-12 rounded-xl bg-coral/20 flex items-center justify-center mb-4 relative z-10">
                    <TrendingUp className="w-6 h-6 text-coral" />
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-3 font-serif relative z-10">Low Trust Score?</h3>
                  <p className="text-black/70 text-sm leading-relaxed mb-4 relative z-10">
                    Without expert reviews and verification badges, consumers doubt your claims — especially in health, finance, and wellness.
                  </p>
                  <div className="bg-white rounded-xl p-4 border-2 border-lime/20 relative z-10">
                    <p className="text-sm font-semibold text-lime-dark mb-2">✓ CertREV Fix:</p>
                    <p className="text-xs text-black/70">Verified expert reviews and trust badges that consumers and search engines both recognize</p>
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
              Why E-E-A-T Matters for Your Brand
            </h3>
            <p className="text-lg text-black/80 mb-6 leading-relaxed relative z-10">
              Health, wellness, financial, and legal content falls under Google's "Your Money or Your Life" (YMYL) category — content
              that can impact health, safety, or financial well-being. Google applies stricter E-E-A-T standards to
              YMYL content.
            </p>
            <p className="text-lg text-black/80 mb-4 leading-relaxed font-semibold relative z-10">
              Without verified expert attribution, brands risk:
            </p>
            <ul className="grid md:grid-cols-2 gap-4 text-black/80 mb-6 relative z-10">
              <li className="flex items-start gap-3 bg-white rounded-xl p-4 border-2 border-coral/20">
                <span className="text-coral font-bold">•</span>
                <span>Significant drops in organic traffic (HubSpot saw 88% decline)</span>
              </li>
              <li className="flex items-start gap-3 bg-white rounded-xl p-4 border-2 border-coral/20">
                <span className="text-coral font-bold">•</span>
                <span>Lower search rankings for competitive keywords</span>
              </li>
              <li className="flex items-start gap-3 bg-white rounded-xl p-4 border-2 border-coral/20">
                <span className="text-coral font-bold">•</span>
                <span>Reduced consumer trust and conversion rates</span>
              </li>
              <li className="flex items-start gap-3 bg-white rounded-xl p-4 border-2 border-coral/20">
                <span className="text-coral font-bold">•</span>
                <span>FTC compliance issues for unsubstantiated claims</span>
              </li>
            </ul>
            <p className="text-lg text-black/80 leading-relaxed relative z-10">
              Expert validation through CertREV helps brands across health, wellness, finance, and professional services meet E-E-A-T standards, protect their SEO
              performance, and build lasting consumer trust.
            </p>
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
    </div>
  )
}
