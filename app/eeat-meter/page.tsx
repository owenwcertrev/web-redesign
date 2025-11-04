'use client'

import { motion } from 'framer-motion'
import EEATMeterTool from '@/components/EEATMeterTool'
import DepthHero from '@/components/cards3d/DepthHero'
import FlipStatCard from '@/components/cards3d/FlipStatCard'
import TiltCard from '@/components/cards3d/TiltCard'
import FadeIn from '@/components/animations/FadeIn'
import { BarChart, FileCheck, TrendingUp, Users, AlertCircle, ShoppingBag, Sparkles } from 'lucide-react'

export default function EEATMeterPage() {
  return (
    <div>
      {/* Hero Section with Depth */}
      <DepthHero
        backgroundLayers={[
          <div key="1" className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-primary/10 to-alert/10 rounded-full blur-3xl" />,
          <div key="2" className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-verification/10 to-primary/10 rounded-full blur-3xl" />,
        ]}
      >
        <div className="min-h-[70vh] flex items-center justify-center px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-6 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full border border-primary/20"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">FREE CONTENT ANALYSIS</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-6xl md:text-8xl font-bold mb-8 leading-tight"
            >
              <span className="bg-gradient-to-br from-charcoal to-charcoal/70 bg-clip-text text-transparent">
                E-E-A-T
              </span>
              <br />
              <span className="bg-gradient-to-br from-primary to-verification bg-clip-text text-transparent">
                Meter
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl md:text-2xl text-charcoal/70 mb-4 max-w-2xl mx-auto"
            >
              Human Validation in an AI-Powered Era
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-lg text-charcoal/60 max-w-2xl mx-auto font-light"
            >
              In an AI driven world, trust is the ultimate discriminator. Get your free content analysis.
            </motion.p>
          </div>
        </div>
      </DepthHero>

      {/* Sample Report Preview - Tilt Cards */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="inline-block mb-4 px-6 py-2 bg-cream rounded-full border border-primary/20">
                <span className="text-sm font-medium text-primary">YOUR FREE REPORTS</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-charcoal">
                Your Customized Analysis Includes
              </h2>
              <p className="text-xl text-charcoal/70">
                Authority score and content health metrics
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
            >
              <TiltCard intensity={0.7} glowColor="rgba(91, 141, 239, 0.2)">
                <div className="bg-gradient-to-br from-white to-cream rounded-2xl p-8 border-2 border-primary/20 shadow-xl h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <BarChart className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-charcoal">
                      Estimated Semrush Authority Score
                    </h3>
                  </div>
                  <div className="bg-white rounded-xl p-6 mb-4 border border-charcoal/10">
                    <div className="h-32 flex items-center justify-center text-charcoal/40 text-sm">
                      Sample visualization preview
                    </div>
                  </div>
                  <p className="text-sm text-charcoal/70 leading-relaxed">
                    A calibrated snapshot of your domain's credibility based on backlinks, press coverage, and organic traffic
                  </p>
                </div>
              </TiltCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <TiltCard intensity={0.7} glowColor="rgba(119, 171, 149, 0.2)">
                <div className="bg-gradient-to-br from-white to-cream rounded-2xl p-8 border-2 border-verification/20 shadow-xl h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-verification/20 flex items-center justify-center">
                      <FileCheck className="w-6 h-6 text-verification-dark" />
                    </div>
                    <h3 className="text-xl font-bold text-charcoal">
                      Blog Content Health Check
                    </h3>
                  </div>
                  <div className="bg-white rounded-xl p-6 mb-4 border border-charcoal/10">
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-verification text-lg">✓</span>
                        <span className="text-charcoal/70">SSL Certificate Present</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-red-500 text-lg">✗</span>
                        <span className="text-charcoal/70">Missing Author Bylines</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-red-500 text-lg">✗</span>
                        <span className="text-charcoal/70">No Expert Schema Markup</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-alert text-lg">⚠</span>
                        <span className="text-charcoal/70">Limited Expert Reviews</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-charcoal/70 leading-relaxed">
                    Analysis of missing best practices like author bylines, expert reviews, structured data, and helpfulness signals
                  </p>
                </div>
              </TiltCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Analysis Tool */}
      <section className="bg-gradient-to-b from-white to-cream py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <EEATMeterTool />
        </div>
      </section>

      {/* Educational Section - E-E-A-T Explained */}
      <section className="bg-white py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-charcoal">
                What is E-E-A-T?
              </h2>
              <p className="text-xl text-charcoal/70 max-w-3xl mx-auto">
                Google's framework for evaluating content quality — and why it matters for your brand
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {[
              {
                title: 'Experience',
                description: 'Demonstrates first-hand, real-world experience with the topic. This is what separates human expertise from AI-generated content.',
                color: 'rgba(119, 171, 149, 0.2)'
              },
              {
                title: 'Expertise',
                description: 'Shows credentialed knowledge and qualifications in the subject matter. Professional credentials and certifications signal expertise.',
                color: 'rgba(91, 141, 239, 0.2)'
              },
              {
                title: 'Authoritativeness',
                description: 'Recognized as a leading source in the industry. Built through citations, backlinks, press mentions, and expert partnerships.',
                color: 'rgba(241, 130, 57, 0.2)'
              },
              {
                title: 'Trustworthiness',
                description: 'Proven accuracy, transparency, and reliability. Fact-checking, expert reviews, and clear sourcing build trust with audiences.',
                color: 'rgba(119, 171, 149, 0.2)'
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
                  <div className="bg-gradient-to-br from-white to-cream rounded-2xl p-8 border border-charcoal/10 shadow-xl h-full">
                    <h3 className="text-2xl font-bold mb-4 text-charcoal">{item.title}</h3>
                    <p className="text-charcoal/70 leading-relaxed">{item.description}</p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-cream to-white rounded-3xl p-10 md:p-14 border border-charcoal/10 shadow-xl">
            <h3 className="text-3xl font-bold mb-6 text-charcoal">
              Why E-E-A-T Matters for Your Brand
            </h3>
            <p className="text-lg text-charcoal/80 mb-6 leading-relaxed">
              Health, wellness, financial, and legal content falls under Google's "Your Money or Your Life" (YMYL) category — content
              that can impact health, safety, or financial well-being. Google applies stricter E-E-A-T standards to
              YMYL content.
            </p>
            <p className="text-lg text-charcoal/80 mb-4 leading-relaxed font-semibold">
              Without verified expert attribution, brands risk:
            </p>
            <ul className="grid md:grid-cols-2 gap-4 text-charcoal/80 mb-6">
              <li className="flex items-start gap-3 bg-white rounded-xl p-4 border border-charcoal/10">
                <span className="text-red-500 font-bold">•</span>
                <span>Significant drops in organic traffic (HubSpot saw 88% decline)</span>
              </li>
              <li className="flex items-start gap-3 bg-white rounded-xl p-4 border border-charcoal/10">
                <span className="text-red-500 font-bold">•</span>
                <span>Lower search rankings for competitive keywords</span>
              </li>
              <li className="flex items-start gap-3 bg-white rounded-xl p-4 border border-charcoal/10">
                <span className="text-red-500 font-bold">•</span>
                <span>Reduced consumer trust and conversion rates</span>
              </li>
              <li className="flex items-start gap-3 bg-white rounded-xl p-4 border border-charcoal/10">
                <span className="text-red-500 font-bold">•</span>
                <span>FTC compliance issues for unsubstantiated claims</span>
              </li>
            </ul>
            <p className="text-lg text-charcoal/80 leading-relaxed">
              Expert validation through CertREV helps brands across health, wellness, finance, and professional services meet E-E-A-T standards, protect their SEO
              performance, and build lasting consumer trust.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Signals Section - Flip Cards */}
      <section className="bg-gradient-to-b from-white to-cream py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-charcoal">
                The Impact of Expert Validation
              </h2>
              <p className="text-xl text-charcoal/70 max-w-2xl mx-auto">
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
              gradient="from-primary/10 to-primary/20"
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
              gradient="from-verification/10 to-verification/20"
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
              gradient="from-alert/10 to-alert/20"
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
              gradient="from-charcoal/10 to-charcoal/20"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
