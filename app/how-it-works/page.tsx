'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Button from '@/components/Button'
import DepthHero from '@/components/cards3d/DepthHero'
import StackedCards from '@/components/cards3d/StackedCards'
import TiltCard from '@/components/cards3d/TiltCard'
import FadeIn from '@/components/animations/FadeIn'
import { ArrowRight, Upload, Search, CheckCircle, Shield, FileCheck, Award, UserCheck, Clipboard } from 'lucide-react'

export default function HowItWorksPage() {
  // Stacked cards for the main process
  const processCards = [
    {
      id: 'submit',
      content: (
        <div className="bg-gradient-to-br from-primary/20 to-verification/20 backdrop-blur-sm p-10 rounded-2xl border border-white/20">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-white/40 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <div className="inline-block px-4 py-1 bg-white/30 rounded-full mb-3">
                <span className="text-sm font-mono text-charcoal/70">STEP 1</span>
              </div>
              <h3 className="text-4xl font-bold text-charcoal mb-4">Submit Your Content</h3>
              <p className="text-charcoal/80 text-lg leading-relaxed mb-6">
                Upload articles, blog posts, landing pages, or product descriptions through our simple dashboard interface. Whether it's skincare guides, wellness advice, or product claims, we review all content types.
              </p>
              <p className="text-charcoal/80 text-lg leading-relaxed mb-6">
                Specify the expertise level you need - from certified coaches to board-certified medical doctors. Our tier system ensures you get the right expert for your content's subject matter and claims.
              </p>
              <div className="bg-white/40 backdrop-blur-sm rounded-xl p-6 border border-white/40">
                <h4 className="font-semibold mb-3 text-charcoal flex items-center gap-2">
                  <Clipboard className="w-5 h-5 text-primary" />
                  What You Can Submit:
                </h4>
                <ul className="space-y-2 text-charcoal/70">
                  <li className="flex items-center gap-2">
                    <span className="text-verification">•</span>
                    Blog articles and content pages
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-verification">•</span>
                    Product descriptions and claims
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-verification">•</span>
                    Email campaigns and newsletters
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-verification">•</span>
                    Social media content
                  </li>
                </ul>
              </div>
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
            <div className="w-16 h-16 rounded-2xl bg-white/40 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <Search className="w-8 h-8 text-verification-dark" />
            </div>
            <div className="flex-1">
              <div className="inline-block px-4 py-1 bg-white/30 rounded-full mb-3">
                <span className="text-sm font-mono text-charcoal/70">STEP 2</span>
              </div>
              <h3 className="text-4xl font-bold text-charcoal mb-4">Expert Review Process</h3>
              <p className="text-charcoal/80 text-lg leading-relaxed mb-6">
                Our network of credentialed professionals - nurses, estheticians, nutritionists, doctors, and more - rigorously fact-check your content against current research, industry standards, and regulatory requirements.
              </p>
              <p className="text-charcoal/80 text-lg leading-relaxed mb-6">
                Experts verify claims, check sources, identify unsubstantiated statements, and ensure accuracy. They also evaluate whether the content demonstrates real-world experience and appropriate expertise level.
              </p>
              <div className="bg-white/40 backdrop-blur-sm rounded-xl p-6 border border-white/40">
                <h4 className="font-semibold mb-3 text-charcoal flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-verification-dark" />
                  What Experts Check:
                </h4>
                <ul className="space-y-2 text-charcoal/70">
                  <li className="flex items-center gap-2">
                    <span className="text-verification">•</span>
                    Factual accuracy against scientific literature
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-verification">•</span>
                    Source credibility and citations
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-verification">•</span>
                    FTC compliance for product claims
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-verification">•</span>
                    Appropriate expertise level for topic
                  </li>
                </ul>
              </div>
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
            <div className="w-16 h-16 rounded-2xl bg-white/40 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <CheckCircle className="w-8 h-8 text-alert" />
            </div>
            <div className="flex-1">
              <div className="inline-block px-4 py-1 bg-white/30 rounded-full mb-3">
                <span className="text-sm font-mono text-charcoal/70">STEP 3</span>
              </div>
              <h3 className="text-4xl font-bold text-charcoal mb-4">Receive Certification</h3>
              <p className="text-charcoal/80 text-lg leading-relaxed mb-6">
                Once approved, receive expert-signed validation with visible verification badges, structured data markup, and proper expert attribution that search engines and consumers recognize.
              </p>
              <p className="text-charcoal/80 text-lg leading-relaxed mb-6">
                Display trust signals on your site, improve your E-E-A-T score, and demonstrate to Google and consumers that real experts stand behind your content.
              </p>
              <div className="bg-white/40 backdrop-blur-sm rounded-xl p-6 border border-white/40">
                <h4 className="font-semibold mb-4 text-charcoal flex items-center gap-2">
                  <Award className="w-5 h-5 text-alert" />
                  You Receive:
                </h4>
                <div className="space-y-3 text-charcoal/70">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-verification flex-shrink-0" />
                    <span>Verification badges for your content</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-verification flex-shrink-0" />
                    <span>Expert signature and credentials</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-verification flex-shrink-0" />
                    <span>Schema markup for search engines</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileCheck className="w-5 h-5 text-verification flex-shrink-0" />
                    <span>Immutable verification record</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
  ]

  return (
    <div>
      {/* Hero Section with Depth */}
      <DepthHero
        backgroundLayers={[
          <div key="1" className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-verification/10 to-primary/10 rounded-full blur-3xl" />,
          <div key="2" className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-primary/10 to-alert/10 rounded-full blur-3xl" />,
        ]}
      >
        <div className="min-h-[70vh] flex items-center justify-center px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-6 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full border border-verification/20"
            >
              <span className="text-sm font-medium text-verification-dark">THE PROCESS</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-6xl md:text-8xl font-bold mb-8 leading-tight"
            >
              <span className="bg-gradient-to-br from-charcoal to-charcoal/70 bg-clip-text text-transparent">
                How CertREV
              </span>
              <br />
              <span className="bg-gradient-to-br from-verification to-primary bg-clip-text text-transparent">
                Works
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl md:text-2xl text-charcoal/70 max-w-2xl mx-auto"
            >
              Expert fact-checking infrastructure that protects your SEO, builds consumer trust, and ensures compliance
            </motion.p>
          </div>
        </div>
      </DepthHero>

      {/* Stacked Cards - Main Process */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-20">
              <div className="inline-block mb-6 px-6 py-3 bg-cream rounded-full border border-verification/20">
                <span className="text-sm font-medium text-verification-dark">3-STEP PROCESS</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-charcoal">
                Verification in Three Steps
              </h2>
              <p className="text-xl text-charcoal/70 max-w-2xl mx-auto">
                Click each card to expand and explore the complete workflow
              </p>
            </div>
          </FadeIn>

          <StackedCards cards={processCards} />
        </div>
      </section>

      {/* Expert Vetting Section - Tilt Cards */}
      <section className="bg-gradient-to-b from-white to-cream py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-charcoal">
                Our Expert Vetting Process
              </h2>
              <p className="text-xl text-charcoal/70 max-w-3xl mx-auto">
                Every expert in our network undergoes rigorous credentialing and quality checks
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
            >
              <TiltCard intensity={0.6} glowColor="rgba(119, 171, 149, 0.2)">
                <div className="bg-white rounded-3xl p-10 border border-charcoal/10 shadow-2xl h-full">
                  <div className="w-14 h-14 rounded-2xl bg-verification/20 flex items-center justify-center mb-6">
                    <Shield className="w-7 h-7 text-verification-dark" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-charcoal">
                    Credential Verification
                  </h3>
                  <p className="text-charcoal/70 leading-relaxed mb-6 text-lg">
                    Every expert undergoes rigorous credential verification. We check licenses, certifications, board certifications, and professional standing.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-verification flex-shrink-0 mt-0.5" />
                      <span className="text-charcoal/70">State license verification (where applicable)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-verification flex-shrink-0 mt-0.5" />
                      <span className="text-charcoal/70">Board certification checks</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-verification flex-shrink-0 mt-0.5" />
                      <span className="text-charcoal/70">Professional reference validation</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-verification flex-shrink-0 mt-0.5" />
                      <span className="text-charcoal/70">Active standing confirmation</span>
                    </li>
                  </ul>
                </div>
              </TiltCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <TiltCard intensity={0.6} glowColor="rgba(91, 141, 239, 0.2)">
                <div className="bg-white rounded-3xl p-10 border border-charcoal/10 shadow-2xl h-full">
                  <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
                    <Award className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-charcoal">
                    Quality Assurance
                  </h3>
                  <p className="text-charcoal/70 leading-relaxed mb-6 text-lg">
                    Experts are evaluated on review quality, accuracy, and thoroughness. We maintain high standards to protect your brand and ensure compliance.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-verification flex-shrink-0 mt-0.5" />
                      <span className="text-charcoal/70">Sample review assessment</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-verification flex-shrink-0 mt-0.5" />
                      <span className="text-charcoal/70">Ongoing performance monitoring</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-verification flex-shrink-0 mt-0.5" />
                      <span className="text-charcoal/70">Client feedback integration</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-verification flex-shrink-0 mt-0.5" />
                      <span className="text-charcoal/70">Continuous education tracking</span>
                    </li>
                  </ul>
                </div>
              </TiltCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-5xl md:text-6xl font-bold mb-8 text-charcoal leading-tight">
              Ready to Get Started?
            </h2>
            <p className="text-xl md:text-2xl text-charcoal/70 mb-12 max-w-2xl mx-auto font-light">
              Try our free E-E-A-T Meter to see how expert validation can improve your content credibility
            </p>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Button size="lg" asChild className="shadow-2xl">
                <Link href="/eeat-meter">
                  Analyze Your Content
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
