'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Button from '@/components/Button'
import StatCard from '@/components/StatCard'
import TierCard from '@/components/TierCard'
import VerificationBadge from '@/components/VerificationBadge'
import StatusIndicator from '@/components/StatusIndicator'
import NewsletterSignup from '@/components/NewsletterSignup'
import FadeIn from '@/components/animations/FadeIn'
import StaggerChildren from '@/components/animations/StaggerChildren'
import FloatingElement from '@/components/animations/FloatingElement'
import GradientBlob from '@/components/GradientBlob'
import { TrendingUp, Users, AlertCircle, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-cream py-16 sm:py-24 md:py-32 px-4 min-h-[80vh] sm:min-h-[85vh] md:min-h-[90vh] flex items-center">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <GradientBlob
            color1="#5B8DEF"
            color2="#A7C4BC"
            size="lg"
            className="absolute -top-40 -right-40"
          />
          <GradientBlob
            color1="#F4E4E6"
            color2="#A7C4BC"
            size="md"
            className="absolute bottom-0 -left-40"
          />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <FadeIn delay={0.2}>
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-charcoal/70">Human validation for the AI age</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <h1 className="font-script text-[clamp(4rem,12vw,9rem)] mb-8 text-charcoal leading-[0.9] tracking-tight">
              Trust, Verified.
            </h1>
          </FadeIn>

          <FadeIn delay={0.6}>
            <p className="text-xl md:text-2xl text-charcoal/70 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              Expert fact-checking infrastructure for health, wellness, and professional service brands navigating the AI content era
            </p>
          </FadeIn>

          <FadeIn delay={0.8}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" asChild className="text-lg px-10 py-5 shadow-lg hover:shadow-xl">
                <Link href="/eeat-meter">
                  Analyze Your Content
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="ghost" asChild className="text-lg">
                <Link href="#how-it-works">How It Works</Link>
              </Button>
            </div>
          </FadeIn>

          <FadeIn delay={1}>
            <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-charcoal/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-verification animate-pulse" />
                <span>Expert-verified content</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>Rigorous fact-checking</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-alert animate-pulse" />
                <span>FTC compliant</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Trust Stats Section */}
      <section className="relative bg-gradient-to-b from-white to-cream py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-serif text-center mb-6 text-charcoal">
              Why Expert Validation Matters
            </h2>
            <p className="text-center text-charcoal/60 mb-16 text-lg max-w-2xl mx-auto">
              The data is clear: expert validation protects your traffic, builds trust, and ensures compliance
            </p>
          </FadeIn>

          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 card-grid">
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <StatCard
                stat="88%"
                description="Organic traffic drop at HubSpot after Google's 2024 updates"
                source="Source: HubSpot"
                icon={TrendingUp}
              />
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <StatCard
                stat="60%"
                description="of consumers doubt content that shows no human review"
                source="Source: Stanford, 2025"
                icon={Users}
              />
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <StatCard
                stat="$51,744"
                description="per violation for deceptive or unsubstantiated claims"
                source="Source: FTC, 2024"
                icon={AlertCircle}
              />
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <StatCard
                stat="↑ Purchase Intent"
                description="Expert-reviewed articles lift purchase intent vs. brand copy alone"
                source="Source: Nielsen x inPowered"
                icon={ShoppingBag}
              />
            </motion.div>
          </StaggerChildren>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative bg-cream py-32 px-4 overflow-hidden">
        {/* Floating decorative blob */}
        <div className="absolute right-0 top-1/4 pointer-events-none">
          <FloatingElement duration={4}>
            <GradientBlob
              color1="#A7C4BC"
              color2="#5B8DEF"
              size="sm"
              className="opacity-30"
            />
          </FloatingElement>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-serif text-center mb-20 text-charcoal">
              Your Path to Verified Content
            </h2>
          </FadeIn>

          {/* Step 1 */}
          <div className="mb-32">
            <FadeIn direction="left">
              <div className="grid md:grid-cols-2 gap-16 items-center">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ type: "spring", duration: 0.6 }}
                      viewport={{ once: true }}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-300 to-gray-400 text-white flex items-center justify-center text-2xl font-bold shadow-lg"
                    >
                      1
                    </motion.div>
                    <StatusIndicator status="pending" />
                  </div>
                  <h3 className="text-3xl font-semibold mb-4 text-charcoal">Share Your Content</h3>
                  <p className="text-charcoal/70 leading-relaxed text-lg mb-6">
                    Submit articles, landing pages, or blog posts for expert review. Our platform makes it easy to upload and manage your content for verification.
                  </p>
                  <Button variant="ghost" asChild>
                    <Link href="/how-it-works">Learn more <ArrowRight className="w-4 h-4" /></Link>
                  </Button>
                </div>
                <FloatingElement delay={0.5}>
                  <div className="relative bg-gradient-to-br from-cream-secondary to-white rounded-3xl p-12 border-2 border-dashed border-charcoal/10 min-h-[300px] flex items-center justify-center shadow-xl">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-verification/20 flex items-center justify-center">
                        <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <p className="text-charcoal/40">Content submission interface</p>
                    </div>
                  </div>
                </FloatingElement>
              </div>
            </FadeIn>
          </div>

          {/* Step 2 */}
          <div className="mb-32">
            <FadeIn direction="right">
              <div className="grid md:grid-cols-2 gap-16 items-center">
                <div className="md:order-2">
                  <div className="flex items-center gap-4 mb-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ type: "spring", duration: 0.6 }}
                      viewport={{ once: true }}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-alert to-amber-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg"
                    >
                      2
                    </motion.div>
                    <StatusIndicator status="inReview" />
                  </div>
                  <h3 className="text-3xl font-semibold mb-4 text-charcoal">Rigorous Fact-Checking</h3>
                  <p className="text-charcoal/70 leading-relaxed text-lg mb-6">
                    Industry specialists verify claims, check sources, and validate expertise. Our credentialed experts ensure your content meets the highest standards.
                  </p>
                  <Button variant="ghost" asChild>
                    <Link href="/how-it-works">See our process <ArrowRight className="w-4 h-4" /></Link>
                  </Button>
                </div>
                <FloatingElement delay={1}>
                  <div className="md:order-1 relative bg-gradient-to-br from-cream-secondary to-white rounded-3xl p-12 border-2 border-dashed border-charcoal/10 min-h-[300px] flex items-center justify-center shadow-xl">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-alert/20 to-amber-200/30 flex items-center justify-center">
                        <svg className="w-10 h-10 text-alert" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-charcoal/40">Expert review process</p>
                    </div>
                  </div>
                </FloatingElement>
              </div>
            </FadeIn>
          </div>

          {/* Step 3 */}
          <div>
            <FadeIn direction="left">
              <div className="grid md:grid-cols-2 gap-16 items-center">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ type: "spring", duration: 0.6 }}
                      viewport={{ once: true }}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-verification to-verification-dark text-white flex items-center justify-center text-2xl font-bold shadow-lg"
                    >
                      3
                    </motion.div>
                    <StatusIndicator status="verified" />
                  </div>
                  <h3 className="text-3xl font-semibold mb-4 text-charcoal">Get Certified Trust</h3>
                  <p className="text-charcoal/70 leading-relaxed text-lg mb-6">
                    Receive expert-signed validation with verification badges that boost credibility and search rankings.
                  </p>
                  <div className="mb-6">
                    <VerificationBadge />
                  </div>
                  <Button variant="ghost" asChild>
                    <Link href="/how-it-works">View benefits <ArrowRight className="w-4 h-4" /></Link>
                  </Button>
                </div>
                <FloatingElement delay={1.5}>
                  <div className="relative bg-gradient-to-br from-verification-light to-white rounded-3xl p-12 border-2 border-verification/30 min-h-[300px] flex items-center justify-center shadow-xl">
                    <div className="text-center space-y-4">
                      <VerificationBadge size="md" />
                      <p className="text-charcoal/40">Verification badge</p>
                    </div>
                  </div>
                </FloatingElement>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Expert Tiers Section */}
      <section className="relative bg-gradient-to-b from-white to-cream py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif mb-4 text-charcoal">
                Expert Tiers
              </h2>
              <p className="text-xl text-charcoal/60 max-w-3xl mx-auto">
                From certified coaches to medical doctors, financial advisors to attorneys — we have the right expert for your content
              </p>
            </div>
          </FadeIn>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 card-grid" staggerDelay={0.15}>
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1 }
              }}
            >
              <TierCard
                tierNumber={1}
                tierName="Certified Professional"
                credits={1}
                credentials={[
                  'Doula (DONA)',
                  'Nutrition Coach (CNC)',
                  'Health & Wellness Coach (NBHWC)',
                  'Personal Trainer (NASM)',
                  'Pilates Instructor (PMI)',
                  'Digital Marketing Professional (OMCP)',
                ]}
              />
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1 }
              }}
            >
              <TierCard
                tierNumber={2}
                tierName="Licensed Practitioner"
                credits={2}
                credentials={[
                  'Registered Nurse (RN)',
                  'Practical/Vocational Nurse (LPN/LVN)',
                  'Esthetician (LE)',
                  'Massage Therapist (LMT)',
                  'Makeup Artist (MUA)',
                  'Enrolled Agent (IRS-licensed)',
                ]}
              />
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1 }
              }}
            >
              <TierCard
                tierNumber={3}
                tierName="Credentialed Specialist"
                credits={3}
                credentials={[
                  'Nurse Practitioner (NP)',
                  'Physician Assistant (PA-C)',
                  'Speech-Language Pathologist (CCC-SLP)',
                  'Dietitian Nutritionist (RDN)',
                  'Physical Therapist (DPT)',
                  'Public Accountant (CPA)',
                ]}
              />
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1 }
              }}
            >
              <TierCard
                tierNumber={4}
                tierName="Senior Credentialed Specialist"
                credits={4}
                credentials={[
                  'Doctor of Pharmacy (PharmD)',
                  'Senior RDN (CNSC, CSSD)',
                  'Behavior Analyst (BCBA-D)',
                  'Senior Cybersecurity Analyst (CISSP)',
                  'Chartered Financial Analyst (CFA charterholder)',
                  'Certified Financial Planner (CFP)',
                ]}
              />
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1 }
              }}
            >
              <TierCard
                tierNumber={5}
                tierName="Practice Leader"
                credits={5}
                credentials={[
                  'Clinical PhD (Nutrition, Psych, Exercise Sci.)',
                  'Doctor of Nursing Practice (DNP)',
                  'Director of Nursing',
                  'Senior Epidemiologist',
                  'Bar-Admitted Attorney (JD)',
                  'Managing CPA / Controller',
                ]}
              />
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1 }
              }}
            >
              <TierCard
                tierNumber={6}
                tierName="Industry Authority"
                credits={6}
                credentials={[
                  'Medical Doctor (MD)',
                  'Doctor of Osteopathy (DO)',
                  'Surgeon',
                  'Board-Certified Subspecialist (Derm, Cardio, Endo)',
                  'Tenured Professor (PhD)',
                  'Chief Medical Officer',
                ]}
              />
            </motion.div>
          </StaggerChildren>
        </div>
      </section>

      {/* The Human Layer Section */}
      <section className="relative bg-gradient-to-br from-[#F0F9F4] via-cream to-[#F0F9F4] py-32 px-4 overflow-hidden">
        <div className="absolute left-0 bottom-0 pointer-events-none">
          <FloatingElement duration={5} delay={1}>
            <GradientBlob
              color1="#A7C4BC"
              color2="#F4E4E6"
              size="md"
              className="opacity-40"
            />
          </FloatingElement>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif mb-6 text-charcoal">
                The Human Layer
              </h2>
              <p className="text-xl md:text-2xl font-serif italic text-charcoal/70 max-w-3xl mx-auto leading-relaxed">
                In a world where AI writes faster than we can fact-check, CertREV exists to bring real experts back into the conversation.
              </p>
            </div>
          </FadeIn>

          <StaggerChildren className="grid md:grid-cols-2 gap-8 mb-12" staggerDelay={0.2}>
            {[
              {
                category: 'Trust & AI',
                title: 'Why 60% of Consumers Doubt AI-Generated Content',
                excerpt: 'Stanford\'s latest research reveals a growing trust gap. Here\'s what beauty brands need to know about maintaining credibility in the AI age.',
                gradient: 'from-primary/20 to-verification/20'
              },
              {
                category: 'SEO Strategy',
                title: 'Google\'s E-E-A-T Update: What Changed in 2024',
                excerpt: 'The extra \'E\' for Experience changed everything. Learn how expert validation protects your organic traffic from algorithm updates.',
                gradient: 'from-verification/20 to-accent/30'
              }
            ].map((article, index) => (
              <motion.article
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="group"
              >
                <Link href="/human-layer" className="block">
                  <div className="bg-white rounded-3xl overflow-hidden shadow-base hover:shadow-xl transition-all duration-500 hover:scale-[1.02]">
                    <div className={`h-56 bg-gradient-to-br ${article.gradient}`} />
                    <div className="p-8">
                      <span className="text-sm text-primary font-medium">{article.category}</span>
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
          </StaggerChildren>

          <FadeIn delay={0.4}>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl text-center border border-verification/20">
              <h3 className="text-3xl font-semibold mb-4 text-charcoal">Stay Informed</h3>
              <p className="text-charcoal/70 mb-8 text-lg max-w-2xl mx-auto">
                Get insights on trust, expertise, and content strategy delivered to your inbox.
              </p>
              <NewsletterSignup />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative bg-gradient-to-br from-cream via-white to-cream py-32 px-4 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <GradientBlob
            color1="#5B8DEF"
            color2="#A7C4BC"
            size="lg"
            className="opacity-20"
          />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <FadeIn>
            <h2 className="text-5xl md:text-6xl font-serif italic mb-8 text-charcoal leading-tight">
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
                  Get Your Free Report
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
