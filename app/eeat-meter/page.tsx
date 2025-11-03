'use client'

import EEATMeterTool from '@/components/EEATMeterTool'
import StatCard from '@/components/StatCard'
import { BarChart, FileCheck, TrendingUp, Users, AlertCircle, ShoppingBag } from 'lucide-react'

export default function EEATMeterPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-cream py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-script text-[clamp(3.5rem,8vw,6rem)] mb-6 text-charcoal leading-tight">
            E-E-A-T Meter
          </h1>
          <p className="text-xl md:text-2xl text-charcoal/80 mb-4 max-w-2xl mx-auto">
            Human Validation in an AI-Powered Era
          </p>
          <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
            In an AI driven world, trust is the ultimate discriminator. Get your free content analysis.
          </p>
        </div>
      </section>

      {/* Sample Report Preview - Before Form Submission */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-8 text-charcoal">
            Your free customized reports include:
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-cream rounded-16 p-6 border-2 border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <BarChart className="w-8 h-8 text-primary" />
                <h3 className="text-lg font-semibold text-charcoal">
                  Estimated Semrush Authority Score
                </h3>
              </div>
              <div className="bg-white rounded-12 p-4 mb-3">
                <div className="h-32 flex items-center justify-center text-charcoal/40 text-sm">
                  Sample visualization preview
                </div>
              </div>
              <p className="text-sm text-charcoal/70">
                A calibrated snapshot of your domain's credibility based on backlinks, press coverage, and organic traffic
              </p>
            </div>

            <div className="bg-cream rounded-16 p-6 border-2 border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <FileCheck className="w-8 h-8 text-primary" />
                <h3 className="text-lg font-semibold text-charcoal">
                  Blog Content Health Check
                </h3>
              </div>
              <div className="bg-white rounded-12 p-4 mb-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-verification">✓</span>
                    <span className="text-charcoal/70">SSL Certificate Present</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-500">✗</span>
                    <span className="text-charcoal/70">Missing Author Bylines</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-500">✗</span>
                    <span className="text-charcoal/70">No Expert Schema Markup</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-alert">⚠</span>
                    <span className="text-charcoal/70">Limited Expert Reviews</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-charcoal/70">
                Analysis of missing best practices like author bylines, expert reviews, structured data, and helpfulness signals
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Analysis Tool */}
      <section className="bg-cream py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <EEATMeterTool />
        </div>
      </section>

      {/* Educational Section */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-serif text-center mb-8 text-charcoal">
            What is E-E-A-T?
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-charcoal/80 mb-6 leading-relaxed">
              E-E-A-T stands for <strong>Experience, Expertise, Authoritativeness, and Trustworthiness</strong> —
              Google's framework for evaluating content quality. In 2024, Google added the first "E" for Experience,
              emphasizing the importance of real-world expertise and human validation.
            </p>

            <div className="grid md:grid-cols-2 gap-6 my-8">
              <div className="bg-cream rounded-16 p-6">
                <h3 className="text-xl font-semibold mb-3 text-charcoal">Experience</h3>
                <p className="text-charcoal/70">
                  Demonstrates first-hand, real-world experience with the topic. This is what separates human expertise
                  from AI-generated content.
                </p>
              </div>
              <div className="bg-cream rounded-16 p-6">
                <h3 className="text-xl font-semibold mb-3 text-charcoal">Expertise</h3>
                <p className="text-charcoal/70">
                  Shows credentialed knowledge and qualifications in the subject matter. Professional credentials and
                  certifications signal expertise to both users and search engines.
                </p>
              </div>
              <div className="bg-cream rounded-16 p-6">
                <h3 className="text-xl font-semibold mb-3 text-charcoal">Authoritativeness</h3>
                <p className="text-charcoal/70">
                  Recognized as a leading source in the industry. Built through citations, backlinks, press mentions,
                  and expert partnerships.
                </p>
              </div>
              <div className="bg-cream rounded-16 p-6">
                <h3 className="text-xl font-semibold mb-3 text-charcoal">Trustworthiness</h3>
                <p className="text-charcoal/70">
                  Proven accuracy, transparency, and reliability. Fact-checking, expert reviews, and clear sourcing
                  build trust with audiences and algorithms.
                </p>
              </div>
            </div>

            <h3 className="text-2xl font-semibold mb-4 mt-12 text-charcoal">
              Why E-E-A-T Matters for Beauty Brands
            </h3>
            <p className="text-charcoal/80 mb-4 leading-relaxed">
              Beauty and wellness content falls under Google's "Your Money or Your Life" (YMYL) category — content
              that can impact health, safety, or financial well-being. Google applies stricter E-E-A-T standards to
              YMYL content.
            </p>
            <p className="text-charcoal/80 leading-relaxed">
              Without verified expert attribution, beauty brands risk:
            </p>
            <ul className="list-disc list-inside text-charcoal/80 space-y-2 my-4">
              <li>Significant drops in organic traffic (HubSpot saw 88% decline)</li>
              <li>Lower search rankings for competitive keywords</li>
              <li>Reduced consumer trust and conversion rates</li>
              <li>FTC compliance issues for unsubstantiated claims</li>
            </ul>
            <p className="text-charcoal/80 leading-relaxed">
              Expert validation through CertREV helps beauty brands meet E-E-A-T standards, protect their SEO
              performance, and build lasting consumer trust.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Signals Section */}
      <section className="bg-cream py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-serif text-center mb-12 text-charcoal">
            The Impact of Expert Validation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              stat="88%"
              description="Traffic drop without verifiable expertise"
              source="Google/HubSpot 2024"
              icon={TrendingUp}
            />
            <StatCard
              stat="60%"
              description="Consumers doubt AI-only content"
              source="Stanford 2025"
              icon={Users}
            />
            <StatCard
              stat="$51,744"
              description="Average FTC fine per violation"
              source="FTC 2024"
              icon={AlertCircle}
            />
            <StatCard
              stat="↑ Purchase Intent"
              description="Expert-reviewed content performs better"
              source="Nielsen x inPowered"
              icon={ShoppingBag}
            />
          </div>
        </div>
      </section>
    </div>
  )
}
