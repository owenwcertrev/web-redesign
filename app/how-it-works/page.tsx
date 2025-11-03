import { Metadata } from 'next'
import Link from 'next/link'
import Button from '@/components/Button'
import StatusIndicator from '@/components/StatusIndicator'
import VerificationBadge from '@/components/VerificationBadge'
import { ArrowRight, Upload, Search, CheckCircle, Shield, FileCheck, Award } from 'lucide-react'

export const metadata: Metadata = {
  title: 'How It Works - Expert Content Verification | CertREV',
  description: 'Learn how CertREV connects brands with credentialed experts to verify content, boost E-E-A-T scores, and build trust.',
}

export default function HowItWorksPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-cream py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-semibold mb-6 text-charcoal leading-tight">
            How CertREV Works
          </h1>
          <p className="text-xl text-charcoal/80 max-w-2xl mx-auto">
            Expert fact-checking infrastructure for health, wellness, financial, and professional service content that protects your SEO, builds consumer trust, and ensures compliance
          </p>
        </div>
      </section>

      {/* Detailed Process Steps */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto space-y-24">
          {/* Step 1 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gray-400 text-white flex items-center justify-center text-2xl font-bold shadow-md">
                  1
                </div>
                <StatusIndicator status="pending" />
              </div>
              <h2 className="text-3xl font-semibold mb-4 text-charcoal">
                Submit Your Content
              </h2>
              <div className="space-y-4 text-charcoal/80 leading-relaxed">
                <p>
                  Upload articles, blog posts, landing pages, or product descriptions through our simple dashboard interface. Whether it's skincare guides, wellness advice, or product claims, we review all content types.
                </p>
                <p>
                  Specify the expertise level you need - from certified coaches to board-certified medical doctors. Our tier system ensures you get the right expert for your content's subject matter and claims.
                </p>
                <div className="flex items-start gap-3 bg-cream p-4 rounded-12">
                  <Upload className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">What You Can Submit:</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Blog articles and content pages</li>
                      <li>Product descriptions and claims</li>
                      <li>Email campaigns and newsletters</li>
                      <li>Social media content</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-cream rounded-16 p-8 border-2 border-dashed border-charcoal/20 min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <Upload className="w-16 h-16 text-charcoal/30 mx-auto mb-4" />
                <p className="text-charcoal/40">Content submission dashboard preview</p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="md:order-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-alert text-white flex items-center justify-center text-2xl font-bold shadow-md">
                  2
                </div>
                <StatusIndicator status="inReview" />
              </div>
              <h2 className="text-3xl font-semibold mb-4 text-charcoal">
                Expert Review Process
              </h2>
              <div className="space-y-4 text-charcoal/80 leading-relaxed">
                <p>
                  Our network of credentialed professionals - nurses, estheticians, nutritionists, doctors, and more - rigorously fact-check your content against current research, industry standards, and regulatory requirements.
                </p>
                <p>
                  Experts verify claims, check sources, identify unsubstantiated statements, and ensure accuracy. They also evaluate whether the content demonstrates real-world experience and appropriate expertise level.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 bg-cream p-4 rounded-12">
                    <Search className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">What Experts Check:</h4>
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        <li>Factual accuracy against scientific literature</li>
                        <li>Source credibility and citations</li>
                        <li>FTC compliance for product claims</li>
                        <li>Appropriate expertise level for topic</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:order-1 bg-cream rounded-16 p-8 border-2 border-dashed border-charcoal/20 min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <FileCheck className="w-16 h-16 text-charcoal/30 mx-auto mb-4" />
                <p className="text-charcoal/40">Expert review interface preview</p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-verification text-white flex items-center justify-center text-2xl font-bold shadow-md">
                  3
                </div>
                <StatusIndicator status="verified" />
              </div>
              <h2 className="text-3xl font-semibold mb-4 text-charcoal">
                Receive Certification
              </h2>
              <div className="space-y-4 text-charcoal/80 leading-relaxed">
                <p>
                  Once approved, receive expert-signed validation with visible verification badges, structured data markup, and proper expert attribution that search engines and consumers recognize.
                </p>
                <p>
                  Display trust signals on your site, improve your E-E-A-T score, and demonstrate to Google and consumers that real experts stand behind your content.
                </p>
                <div className="space-y-4 mt-6">
                  <div className="bg-cream p-4 rounded-12">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-verification" />
                      You Receive:
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <VerificationBadge size="sm" />
                        <span>Verification badges for your content</span>
                      </li>
                      <li className="flex items-start gap-2 mt-2">
                        <Award className="w-4 h-4 text-verification flex-shrink-0 mt-0.5" />
                        <span>Expert signature and credentials</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-verification flex-shrink-0 mt-0.5" />
                        <span>Schema markup for search engines</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-cream rounded-16 p-8 border-2 border-dashed border-charcoal/20 min-h-[400px] flex flex-col items-center justify-center gap-6">
              <VerificationBadge />
              <p className="text-charcoal/40 text-center">Verification badge & certificate examples</p>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Vetting Section */}
      <section className="bg-cream py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-serif text-center mb-12 text-charcoal">
            Our Expert Vetting Process
          </h2>
          <div className="bg-white rounded-16 p-8 md:p-12 shadow-base">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-charcoal">
                  Credential Verification
                </h3>
                <p className="text-charcoal/70 leading-relaxed mb-4">
                  Every expert in our network undergoes rigorous credential verification. We check licenses, certifications, board certifications, and professional standing.
                </p>
                <ul className="space-y-2 text-sm text-charcoal/70">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-verification flex-shrink-0 mt-0.5" />
                    <span>State license verification (where applicable)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-verification flex-shrink-0 mt-0.5" />
                    <span>Board certification checks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-verification flex-shrink-0 mt-0.5" />
                    <span>Professional reference validation</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-charcoal">
                  Quality Assurance
                </h3>
                <p className="text-charcoal/70 leading-relaxed mb-4">
                  Experts are evaluated on review quality, accuracy, and thoroughness. We maintain high standards to protect your brand and ensure regulatory compliance.
                </p>
                <ul className="space-y-2 text-sm text-charcoal/70">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-verification flex-shrink-0 mt-0.5" />
                    <span>Sample review assessment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-verification flex-shrink-0 mt-0.5" />
                    <span>Ongoing performance monitoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-verification flex-shrink-0 mt-0.5" />
                    <span>Client feedback integration</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-serif italic mb-6 text-charcoal">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-charcoal/80 mb-8 max-w-2xl mx-auto">
            Try our free E-E-A-T Meter to see how expert validation can improve your content credibility
          </p>
          <Button size="lg" asChild>
            <Link href="/eeat-meter">
              Analyze Your Content
              <ArrowRight className="w-6 h-6" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
