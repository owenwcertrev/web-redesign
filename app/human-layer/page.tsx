'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import NewsletterSignup from '@/components/NewsletterSignup'
import DepthHero from '@/components/cards3d/DepthHero'
import TiltCard from '@/components/cards3d/TiltCard'
import FadeIn from '@/components/animations/FadeIn'
import { ArrowRight, Calendar, Clock, BookOpen, TrendingUp, Shield, Users } from 'lucide-react'

export default function HumanLayerPage() {
  const articles = [
    {
      id: 1,
      category: 'Trust & AI',
      title: 'Why 60% of Consumers Doubt AI-Generated Content',
      excerpt: 'Stanford\'s latest research reveals a growing trust gap. Here\'s what brands need to know about maintaining credibility in the AI age.',
      date: 'March 15, 2025',
      readTime: '6 min read',
      gradient: 'from-navy/20 to-lime/20',
      icon: Users,
    },
    {
      id: 2,
      category: 'SEO Strategy',
      title: 'Google\'s E-E-A-T Update: What Changed in 2024',
      excerpt: 'The extra \'E\' for Experience changed everything. Learn how expert validation protects your organic traffic from algorithm updates.',
      date: 'March 10, 2025',
      readTime: '8 min read',
      gradient: 'from-lime/20 to-coral/20',
      icon: TrendingUp,
    },
    {
      id: 3,
      category: 'Compliance',
      title: 'FTC Cracks Down: $51K Average Fine for Deceptive Claims',
      excerpt: 'New enforcement data shows rising penalties. How expert-reviewed content helps brands stay compliant and build consumer trust.',
      date: 'March 5, 2025',
      readTime: '5 min read',
      gradient: 'from-coral/20 to-navy/20',
      icon: Shield,
    },
    {
      id: 4,
      category: 'Content Strategy',
      title: 'The HubSpot Case Study: 88% Traffic Loss Without E-E-A-T',
      excerpt: 'How one of marketing\'s biggest publishers lost nearly all organic traffic - and what brands can learn from their recovery.',
      date: 'February 28, 2025',
      readTime: '7 min read',
      gradient: 'from-navy/30 to-lime/10',
      icon: TrendingUp,
    },
    {
      id: 5,
      category: 'Expert Insights',
      title: 'Credentialed Experts vs. Social Media Influencers',
      excerpt: 'Understanding the credential gap that impacts both SEO and consumer trust. Why expertise levels matter more than ever.',
      date: 'February 20, 2025',
      readTime: '6 min read',
      gradient: 'from-lime/10 to-navy/30',
      icon: BookOpen,
    },
    {
      id: 6,
      category: 'Industry Trends',
      title: 'Purchase Intent Lift: The Nielsen Study Brands Need to See',
      excerpt: 'Data-backed proof that expert-reviewed content outperforms traditional brand messaging. Key findings and implementation strategies.',
      date: 'February 15, 2025',
      readTime: '5 min read',
      gradient: 'from-coral/30 to-lime/20',
      icon: TrendingUp,
    },
  ]

  return (
    <div>
      {/* Hero Section with Depth */}
      <DepthHero
        backgroundLayers={[
          <div key="1" className="absolute top-1/3 right-1/3 w-96 h-96 bg-gradient-to-br from-lime/10 to-navy/10 rounded-full blur-3xl" />,
          <div key="2" className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-gradient-to-br from-navy/10 to-coral/10 rounded-full blur-3xl" />,
        ]}
      >
        <div className="min-h-[70vh] flex items-center justify-center px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-6 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border-2 border-lime/30 shadow-sm"
            >
              <span className="text-sm font-semibold text-navy tracking-wide">INSIGHTS & ANALYSIS</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-6xl md:text-8xl font-bold mb-8 leading-tight font-serif"
            >
              <span className="text-navy">
                The Human
              </span>
              <br />
              <span className="text-coral">
                Layer
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl md:text-2xl text-black/70 max-w-2xl mx-auto leading-relaxed italic"
            >
              In a world where AI writes faster than we can fact-check, we explore trust, expertise, and content in the AI age
            </motion.p>
          </div>
        </div>
      </DepthHero>

      {/* Featured Article - Large Tilt Card */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <div className="inline-block mb-4 px-6 py-2 bg-cream rounded-full border border-primary/20">
                <span className="text-sm font-medium text-primary">FEATURED ARTICLE</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-charcoal">
                Latest Insights
              </h2>
            </div>
          </FadeIn>

          <TiltCard intensity={0.6} glowColor="rgba(119, 171, 149, 0.2)">
            <Link href={`/human-layer/${articles[0].id}`} className="block">
              <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-charcoal/10">
                <div className="grid md:grid-cols-5">
                  <div className={`md:col-span-2 h-64 md:h-auto bg-gradient-to-br ${articles[0].gradient} flex items-center justify-center`}>
                    {(() => {
                      const Icon = articles[0].icon
                      return <Icon className="w-24 h-24 text-white/30" />
                    })()}
                  </div>
                  <div className="md:col-span-3 p-10">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm text-primary font-medium uppercase tracking-wide">{articles[0].category}</span>
                      <span className="text-charcoal/30">•</span>
                      <div className="flex items-center gap-1 text-sm text-charcoal/60">
                        <Calendar className="w-3 h-3" />
                        {articles[0].date}
                      </div>
                      <span className="text-charcoal/30">•</span>
                      <div className="flex items-center gap-1 text-sm text-charcoal/60">
                        <Clock className="w-3 h-3" />
                        {articles[0].readTime}
                      </div>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold mb-4 text-charcoal group-hover:text-primary transition-colors">
                      {articles[0].title}
                    </h3>
                    <p className="text-charcoal/70 mb-6 leading-relaxed text-lg">
                      {articles[0].excerpt}
                    </p>
                    <div className="inline-flex items-center gap-2 text-primary font-medium group-hover:gap-4 transition-all">
                      Read Full Article <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </TiltCard>
        </div>
      </section>

      {/* Article Grid - Tilt Cards */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-cream">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-charcoal">
                Recent Articles
              </h2>
              <p className="text-xl text-charcoal/70">
                Expert insights on trust, AI, and content strategy
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.slice(1).map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <TiltCard intensity={0.7} glowColor={`rgba(${index % 2 === 0 ? '119, 171, 149' : '91, 141, 239'}, 0.2)`}>
                  <Link href={`/human-layer/${article.id}`} className="block group">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-charcoal/10 h-full">
                      <div className={`h-48 bg-gradient-to-br ${article.gradient} flex items-center justify-center relative overflow-hidden`}>
                        {(() => {
                          const Icon = article.icon
                          return <Icon className="w-16 h-16 text-white/20" />
                        })()}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3 text-xs">
                          <span className="text-primary font-medium uppercase tracking-wide">{article.category}</span>
                          <span className="text-charcoal/30">•</span>
                          <div className="flex items-center gap-1 text-charcoal/60">
                            <Clock className="w-3 h-3" />
                            {article.readTime}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-charcoal group-hover:text-primary transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-charcoal/70 mb-4 text-sm leading-relaxed line-clamp-3">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center gap-1 text-sm text-charcoal/60 mb-4">
                          <Calendar className="w-3 h-3" />
                          {article.date}
                        </div>
                        <div className="inline-flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                          Read More <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="bg-gradient-to-br from-verification-light to-cream rounded-3xl p-12 md:p-16 text-center shadow-2xl border border-verification/20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-charcoal">
                Stay Informed
              </h2>
              <p className="text-lg md:text-xl text-charcoal/70 mb-10 max-w-2xl mx-auto leading-relaxed">
                Get insights on trust, expertise, and content strategy delivered to your inbox. No spam, just valuable insights for brands navigating the AI age.
              </p>
              <NewsletterSignup />
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
