'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Accordion from '@/components/Accordion'
import DepthHero from '@/components/cards3d/DepthHero'
import FadeIn from '@/components/animations/FadeIn'
import TextureOverlay from '@/components/TextureOverlay'
import OrganicShape from '@/components/OrganicShape'
import { HelpCircle, Building2, GraduationCap, BookOpen } from 'lucide-react'

type TabType = 'brand' | 'expert' | 'general'

export default function FAQPage() {
  const [activeTab, setActiveTab] = useState<TabType>('brand')

  // PLACEHOLDER DATA - Replace with actual content from certrev.com
  const brandFAQs = [
    {
      category: 'Program Overview',
      items: [
        {
          question: 'What makes CertREV different from other content verification services?',
          answer: '[Copy answer from certrev.com Brand FAQ]'
        },
        {
          question: 'How does the credit system work?',
          answer: '[Copy answer from certrev.com Brand FAQ]'
        }
      ]
    },
    {
      category: 'Pricing & Credits',
      items: [
        {
          question: 'What is your pricing structure?',
          answer: '[Copy answer from certrev.com Brand FAQ]'
        }
      ]
    }
  ]

  const expertFAQs = [
    {
      category: 'Getting Started',
      items: [
        {
          question: 'Who is eligible to become a CertREV expert?',
          answer: '[Copy answer from certrev.com Expert FAQ]'
        },
        {
          question: 'How do I apply?',
          answer: '[Copy answer from certrev.com Expert FAQ]'
        }
      ]
    },
    {
      category: 'Compensation',
      items: [
        {
          question: 'How much do experts earn per review?',
          answer: '[Copy answer from certrev.com Expert FAQ]'
        }
      ]
    }
  ]

  const generalFAQs = [
    {
      category: 'E-E-A-T & SEO',
      items: [
        {
          question: 'What is E-E-A-T?',
          answer: '[Copy answer from certrev.com General FAQ]'
        },
        {
          question: 'Why does expert verification matter for SEO?',
          answer: '[Copy answer from certrev.com General FAQ]'
        }
      ]
    }
  ]

  const tabs = [
    { id: 'brand' as TabType, label: 'For Brands', icon: Building2, data: brandFAQs, color: 'coral' },
    { id: 'expert' as TabType, label: 'For Experts', icon: GraduationCap, data: expertFAQs, color: 'navy' },
    { id: 'general' as TabType, label: 'General', icon: BookOpen, data: generalFAQs, color: 'lime' }
  ]

  const activeTabData = tabs.find(tab => tab.id === activeTab)

  return (
    <div>
      {/* Hero Section */}
      <DepthHero
        backgroundLayers={[
          <div key="bg" className="absolute inset-0 bg-beige" />,
          <TextureOverlay key="texture" type="paper" opacity={0.3} />,
          <OrganicShape key="shape1" variant="blob1" color="coral" className="absolute top-1/4 right-1/4 w-96 h-96" opacity={0.08} />,
          <OrganicShape key="shape2" variant="blob3" color="navy" className="absolute bottom-1/4 left-1/4 w-80 h-80" opacity={0.06} />
        ]}
      >
        <div className="min-h-[50vh] flex items-center justify-center px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-6 px-6 py-3 bg-white rounded-full border-2 border-lime/20 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-lime" />
                <span className="text-sm font-semibold text-navy tracking-wide">FREQUENTLY ASKED QUESTIONS</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight font-serif"
            >
              <span className="text-navy">Questions?</span>
              <br />
              <span className="text-coral">We've Got Answers</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-black/70 max-w-2xl mx-auto"
            >
              Everything you need to know about expert verification, pricing, and getting started
            </motion.p>
          </div>
        </div>
      </DepthHero>

      {/* Tab Navigation */}
      <section className="bg-white py-8 px-4 border-b-2 border-navy/10 sticky top-16 z-40">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 justify-center flex-wrap">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all
                    ${isActive
                      ? tab.color === 'coral'
                        ? 'bg-coral text-white shadow-md'
                        : tab.color === 'navy'
                        ? 'bg-navy text-white shadow-md'
                        : 'bg-lime text-white shadow-md'
                      : 'bg-beige text-navy hover:bg-beige/80'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="bg-beige py-20 px-4 relative overflow-hidden">
        <TextureOverlay type="paper" opacity={0.2} />
        <OrganicShape variant="blob2" color="lime" className="absolute -top-20 -right-20 w-96 h-96" opacity={0.05} />

        <div className="max-w-4xl mx-auto relative z-10">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-navy font-serif">
                {activeTabData?.label} FAQ
              </h2>
              <p className="text-lg text-black/70">
                {activeTab === 'brand' && 'Answers for companies looking to verify their content'}
                {activeTab === 'expert' && 'Information for professionals joining our expert network'}
                {activeTab === 'general' && 'Understanding E-E-A-T, SEO, and content verification'}
              </p>
            </div>
          </FadeIn>

          <div className="space-y-12">
            {activeTabData?.data.map((section, idx) => (
              <FadeIn key={idx} delay={idx * 0.1}>
                <Accordion items={section.items} category={section.category} />
              </FadeIn>
            ))}
          </div>

          {/* Still Have Questions CTA */}
          <FadeIn delay={0.4}>
            <div className="mt-16 bg-white rounded-3xl p-8 md:p-12 text-center border-2 border-coral/20 shadow-lg relative overflow-hidden">
              <TextureOverlay type="paper" opacity={0.2} />
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-4 text-navy font-serif">Still Have Questions?</h3>
                <p className="text-black/70 mb-6 text-lg max-w-2xl mx-auto">
                  Can't find what you're looking for? Our team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-coral text-white font-semibold rounded-full hover:bg-coral/90 transition-all shadow-md hover:shadow-lg"
                  >
                    Contact Us
                  </a>
                  <a
                    href="/book-demo"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-navy font-semibold rounded-full border-2 border-navy/20 hover:border-navy/30 transition-all"
                  >
                    Schedule Demo
                  </a>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
