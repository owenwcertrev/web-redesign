'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Button from '@/components/Button'
import DepthHero from '@/components/cards3d/DepthHero'
import AccordionCards from '@/components/cards3d/AccordionCards'
import TiltCard from '@/components/cards3d/TiltCard'
import FadeIn from '@/components/animations/FadeIn'
import TextureOverlay from '@/components/TextureOverlay'
import OrganicShape from '@/components/OrganicShape'
import { ArrowRight, Upload, Search, CheckCircle, Shield, FileCheck, Award, UserCheck, Clipboard, GraduationCap, Building2 } from 'lucide-react'

export default function HowItWorksPage() {
  // Stacked cards for the main process
  const processCards = [
    {
      id: 'submit',
      content: (
        <div className="bg-beige p-10 rounded-2xl border-2 border-lime/20 relative overflow-hidden">
          <TextureOverlay type="paper" opacity={0.4} />
          <OrganicShape variant="blob1" color="lime" className="absolute -bottom-12 -right-12 w-48 h-48" opacity={0.08} />
          <div className="flex items-start gap-4 mb-6 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-lime/20 flex items-center justify-center shadow-md">
              <Upload className="w-8 h-8 text-navy" />
            </div>
            <div className="flex-1">
              <div className="inline-block px-4 py-1 bg-navy/10 rounded-full mb-3">
                <span className="text-sm font-semibold text-navy tracking-wide">STEP 1</span>
              </div>
              <h3 className="text-4xl font-bold text-navy mb-4 font-serif">Submit Your Content</h3>
              <p className="text-black/80 text-lg leading-relaxed mb-6">
                Upload articles, blog posts, landing pages, or product descriptions through our simple dashboard interface. Whether it's skincare guides, wellness advice, or product claims, we review all content types.
              </p>
              <p className="text-black/80 text-lg leading-relaxed mb-6">
                Specify the expertise level you need - from certified coaches to board-certified medical doctors. Our tier system ensures you get the right expert for your content's subject matter and claims.
              </p>
              <div className="bg-white rounded-xl p-6 border-2 border-lime/10">
                <h4 className="font-semibold mb-3 text-navy flex items-center gap-2 font-serif">
                  <Clipboard className="w-5 h-5 text-coral" />
                  What You Can Submit:
                </h4>
                <ul className="space-y-2 text-black/70">
                  <li className="flex items-center gap-2">
                    <span className="text-lime text-xl">•</span>
                    Blog articles and content pages
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-lime text-xl">•</span>
                    Product descriptions and claims
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-lime text-xl">•</span>
                    Email campaigns and newsletters
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-lime text-xl">•</span>
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
        <div className="bg-white p-10 rounded-2xl border-2 border-coral/20 relative overflow-hidden shadow-sm">
          <TextureOverlay type="paper" opacity={0.4} />
          <OrganicShape variant="blob2" color="coral" className="absolute -top-12 -right-12 w-48 h-48" opacity={0.08} />
          <div className="flex items-start gap-4 mb-6 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-coral/20 flex items-center justify-center shadow-md">
              <Search className="w-8 h-8 text-coral" />
            </div>
            <div className="flex-1">
              <div className="inline-block px-4 py-1 bg-navy/10 rounded-full mb-3">
                <span className="text-sm font-semibold text-navy tracking-wide">STEP 2</span>
              </div>
              <h3 className="text-4xl font-bold text-navy mb-4 font-serif">Expert Review Process</h3>
              <p className="text-black/80 text-lg leading-relaxed mb-6">
                Our network of credentialed professionals - nurses, estheticians, nutritionists, doctors, and more - rigorously fact-check your content against current research, industry standards, and regulatory requirements.
              </p>
              <p className="text-black/80 text-lg leading-relaxed mb-6">
                Experts verify claims, check sources, identify unsubstantiated statements, and ensure accuracy. They also evaluate whether the content demonstrates real-world experience and appropriate expertise level.
              </p>
              <div className="bg-beige rounded-xl p-6 border-2 border-coral/10">
                <h4 className="font-semibold mb-3 text-navy flex items-center gap-2 font-serif">
                  <UserCheck className="w-5 h-5 text-lime" />
                  What Experts Check:
                </h4>
                <ul className="space-y-2 text-black/70">
                  <li className="flex items-center gap-2">
                    <span className="text-lime text-xl">•</span>
                    Factual accuracy against scientific literature
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-lime text-xl">•</span>
                    Source credibility and citations
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-lime text-xl">•</span>
                    FTC compliance for product claims
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-lime text-xl">•</span>
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
        <div className="bg-beige p-10 rounded-2xl border-2 border-navy/20 relative overflow-hidden">
          <TextureOverlay type="paper" opacity={0.4} />
          <OrganicShape variant="blob4" color="navy" className="absolute -bottom-12 -left-12 w-48 h-48" opacity={0.08} />
          <div className="flex items-start gap-4 mb-6 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-navy/10 flex items-center justify-center shadow-md">
              <CheckCircle className="w-8 h-8 text-coral" />
            </div>
            <div className="flex-1">
              <div className="inline-block px-4 py-1 bg-navy/10 rounded-full mb-3">
                <span className="text-sm font-semibold text-navy tracking-wide">STEP 3</span>
              </div>
              <h3 className="text-4xl font-bold text-navy mb-4 font-serif">Receive Certification</h3>
              <p className="text-black/80 text-lg leading-relaxed mb-6">
                Once approved, receive expert-signed validation with visible verification badges, structured data markup, and proper expert attribution that search engines and consumers recognize.
              </p>
              <p className="text-black/80 text-lg leading-relaxed mb-6">
                Display trust signals on your site, improve your E-E-A-T score, and demonstrate to Google and consumers that real experts stand behind your content.
              </p>
              <div className="bg-white rounded-xl p-6 border-2 border-navy/10">
                <h4 className="font-semibold mb-4 text-navy flex items-center gap-2 font-serif">
                  <Award className="w-5 h-5 text-coral" />
                  You Receive:
                </h4>
                <div className="space-y-3 text-black/70">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-lime flex-shrink-0" />
                    <span>Verification badges for your content</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-lime flex-shrink-0" />
                    <span>Expert signature and credentials</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-lime flex-shrink-0" />
                    <span>Schema markup for search engines</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileCheck className="w-5 h-5 text-lime flex-shrink-0" />
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
              className="inline-block mb-6 px-3 py-1 bg-coral/10 rounded-md"
            >
              <span className="text-xs font-medium text-navy tracking-wide">THE PROCESS</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 sm:mb-8 leading-tight font-serif"
            >
              <span className="text-navy">
                How CertREV
              </span>
              <br />
              <span className="text-coral">
                Works
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg sm:text-xl md:text-2xl text-black/70 max-w-2xl mx-auto"
            >
              Human-in-the-loop expert fact-checking that protects your SEO, builds consumer trust, and ensures compliance
            </motion.p>
          </div>
        </div>
      </DepthHero>

      {/* Stacked Cards - Main Process */}
      <section className="py-32 px-4 bg-white relative overflow-hidden">
        <TextureOverlay type="grain" opacity={0.15} />
        <div className="max-w-5xl mx-auto relative z-10">
          <FadeIn>
            <div className="text-center mb-20">
              <div className="inline-block mb-6 px-3 py-1 bg-coral/10 rounded-md">
                <span className="text-xs font-medium text-navy tracking-wide">THE JOURNEY</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-navy font-serif">
                From Submission to Certification
              </h2>
              <p className="text-xl text-black/70 max-w-2xl mx-auto">
                Our complete verification workflow
              </p>
            </div>
          </FadeIn>

          <AccordionCards cards={processCards} />
        </div>
      </section>

      {/* Expert Vetting Section - Tilt Cards */}
      <section className="bg-beige py-32 px-4 relative overflow-hidden">
        <TextureOverlay type="paper" opacity={0.3} />
        <OrganicShape variant="blob3" color="lime" className="absolute -bottom-20 -left-20 w-96 h-96" opacity={0.06} />
        <div className="max-w-6xl mx-auto relative z-10">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="inline-block mb-6 px-3 py-1 bg-lime/10 rounded-md">
                <span className="text-xs font-medium text-navy tracking-wide">TRUST BUILT IN</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-navy font-serif">
                Our Expert Vetting Process
              </h2>
              <p className="text-xl text-black/70 max-w-3xl mx-auto">
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
              <TiltCard intensity={0.6} glowColor="rgba(212, 225, 87, 0.2)">
                <div className="bg-white rounded-3xl p-10 border-2 border-lime/20 shadow-2xl h-full relative overflow-hidden">
                  <TextureOverlay type="paper" opacity={0.3} />
                  <div className="w-14 h-14 rounded-2xl bg-lime/20 flex items-center justify-center mb-6 relative z-10">
                    <Shield className="w-7 h-7 text-lime" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-navy font-serif relative z-10">
                    Credential Verification
                  </h3>
                  <p className="text-black/70 leading-relaxed mb-6 text-lg relative z-10">
                    Every expert undergoes rigorous credential verification. We check licenses, certifications, board certifications, and professional standing.
                  </p>
                  <ul className="space-y-3 relative z-10">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-lime flex-shrink-0 mt-0.5" />
                      <span className="text-black/70">State license verification (where applicable)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-lime flex-shrink-0 mt-0.5" />
                      <span className="text-black/70">Board certification checks</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-lime flex-shrink-0 mt-0.5" />
                      <span className="text-black/70">Professional reference validation</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-lime flex-shrink-0 mt-0.5" />
                      <span className="text-black/70">Active standing confirmation</span>
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
              <TiltCard intensity={0.6} glowColor="rgba(10, 27, 63, 0.2)">
                <div className="bg-white rounded-3xl p-10 border-2 border-navy/20 shadow-2xl h-full relative overflow-hidden">
                  <TextureOverlay type="paper" opacity={0.3} />
                  <div className="w-14 h-14 rounded-2xl bg-navy/10 flex items-center justify-center mb-6 relative z-10">
                    <Award className="w-7 h-7 text-navy" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-navy font-serif relative z-10">
                    Quality Assurance
                  </h3>
                  <p className="text-black/70 leading-relaxed mb-6 text-lg relative z-10">
                    Experts are evaluated on review quality, accuracy, and thoroughness. We maintain high standards to protect your brand and ensure compliance.
                  </p>
                  <ul className="space-y-3 relative z-10">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-lime flex-shrink-0 mt-0.5" />
                      <span className="text-black/70">Sample review assessment</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-lime flex-shrink-0 mt-0.5" />
                      <span className="text-black/70">Ongoing performance monitoring</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-lime flex-shrink-0 mt-0.5" />
                      <span className="text-black/70">Client feedback integration</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-lime flex-shrink-0 mt-0.5" />
                      <span className="text-black/70">Continuous education tracking</span>
                    </li>
                  </ul>
                </div>
              </TiltCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-32 px-4 relative overflow-hidden">
        <TextureOverlay type="grain" opacity={0.15} />
        <OrganicShape variant="blob4" color="coral" className="absolute top-0 right-0 w-96 h-96" opacity={0.08} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <FadeIn>
            <h2 className="text-5xl md:text-6xl font-bold mb-8 text-navy leading-tight font-serif">
              Get Started with CertREV
            </h2>
            <p className="text-xl md:text-2xl text-black/70 mb-12 max-w-2xl mx-auto">
              Choose how you want to engage with our expert verification platform
            </p>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center max-w-2xl mx-auto"
            >
              <Button size="lg" asChild className="w-full sm:w-auto shadow-2xl !bg-coral hover:!bg-coral/90 !text-white !border-coral">
                <Link href="https://dashboard.certrev.com/auth/signup?type=brand">
                  Sign Up as Brand
                  <Building2 className="w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" asChild className="w-full sm:w-auto shadow-2xl !bg-navy hover:!bg-navy/90 !text-white !border-navy">
                <Link href="https://dashboard.certrev.com/auth/signup?type=expert">
                  Sign Up as Expert
                  <GraduationCap className="w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild className="w-full sm:w-auto shadow-2xl">
                <Link href="/book-demo">
                  Schedule Demo
                </Link>
              </Button>
            </motion.div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
