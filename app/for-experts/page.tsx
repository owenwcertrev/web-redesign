import { Metadata } from 'next'
import Link from 'next/link'
import Button from '@/components/Button'
import TextureOverlay from '@/components/TextureOverlay'
import OrganicShape from '@/components/OrganicShape'
import { ArrowRight, DollarSign, Clock, Award, TrendingUp, CheckCircle, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Join Our Expert Network | CertREV',
  description: 'Use your expertise to help brands build trustworthy content. Flexible work, competitive compensation, professional recognition.',
}

export default function ForExpertsPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-lime/20 via-beige to-beige py-32 px-4 relative overflow-hidden">
        <TextureOverlay type="paper" opacity={0.2} />
        <OrganicShape variant="blob1" color="lime" className="absolute top-0 right-0 w-96 h-96" opacity={0.15} />
        <OrganicShape variant="blob2" color="coral" className="absolute bottom-0 left-0 w-80 h-80" opacity={0.08} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block mb-6 px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full border-2 border-lime shadow-md">
            <span className="text-sm font-semibold text-navy tracking-wide">FOR EXPERTS</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 text-navy leading-tight font-serif">
            Share Your Expertise.<br />
            <span className="text-coral">Build Trust.</span>
          </h1>
          <p className="text-xl md:text-2xl text-black/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Use your professional credentials to verify health, wellness, financial, and professional service content. Earn competitive compensation while helping brands combat misinformation.
          </p>
          <Button size="lg" asChild>
            <Link href="/eeat-meter">
              Apply to Join
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-24 px-4 relative overflow-hidden">
        <TextureOverlay type="grain" opacity={0.15} />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-6 py-2 bg-lime/10 rounded-full border-2 border-lime/30 shadow-md">
              <span className="text-xs font-semibold text-navy tracking-wide">BENEFITS</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-navy font-serif">
              Why Join CertREV
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-beige rounded-2xl p-6 text-center border-2 border-lime/20 relative overflow-hidden">
              <TextureOverlay type="paper" opacity={0.3} />
              <div className="w-16 h-16 bg-lime/20 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                <Clock className="w-8 h-8 text-navy" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-navy font-serif relative z-10">Flexible Work</h3>
              <p className="text-black/70 relative z-10">
                Review content on your schedule. Work from anywhere, choose assignments that fit your expertise and availability.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center border-2 border-coral/20 relative overflow-hidden shadow-sm">
              <TextureOverlay type="paper" opacity={0.3} />
              <div className="w-16 h-16 bg-coral/20 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                <DollarSign className="w-8 h-8 text-coral" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-navy font-serif relative z-10">Competitive Pay</h3>
              <p className="text-black/70 relative z-10">
                Earn based on your credential tier. Higher credentials command premium rates for specialized content review.
              </p>
            </div>

            <div className="bg-beige rounded-2xl p-6 text-center border-2 border-navy/20 relative overflow-hidden">
              <TextureOverlay type="paper" opacity={0.3} />
              <div className="w-16 h-16 bg-navy/10 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                <Award className="w-8 h-8 text-navy" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-navy font-serif relative z-10">Recognition</h3>
              <p className="text-black/70 relative z-10">
                Build your professional profile. Your expertise gets credited on verified content, enhancing your professional brand.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center border-2 border-lime/20 relative overflow-hidden shadow-sm">
              <TextureOverlay type="paper" opacity={0.3} />
              <div className="w-16 h-16 bg-lime/20 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                <TrendingUp className="w-8 h-8 text-lime" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-navy font-serif relative z-10">Impact Quality</h3>
              <p className="text-black/70 relative z-10">
                Help combat misinformation across industries. Your reviews protect consumers and elevate industry standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="bg-beige py-24 px-4 relative overflow-hidden">
        <OrganicShape variant="blob2" color="coral" className="absolute bottom-0 left-0 w-96 h-96" opacity={0.06} />
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-3xl font-bold text-center mb-12 text-navy font-serif">
            Expert Requirements
          </h2>
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border-2 border-navy/10 relative overflow-hidden">
            <TextureOverlay type="paper" opacity={0.3} />
            <div className="space-y-8 relative z-10">
              <div>
                <h3 className="text-xl font-bold mb-4 text-navy flex items-center gap-3 font-serif">
                  <Users className="w-6 h-6 text-coral" />
                  Who We're Looking For
                </h3>
                <p className="text-black/70 mb-4 leading-relaxed">
                  We seek credentialed professionals across health, wellness, finance, legal, tech, and professional services. Our 6-tier system accommodates everyone from certified coaches to board-certified physicians, CPAs, attorneys, and senior engineers.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-beige p-4 rounded-xl border-2 border-lime/20">
                    <h4 className="font-bold mb-2 text-navy">Health & Wellness</h4>
                    <ul className="text-sm text-black/70 space-y-1">
                      <li>• Physicians (MD, DO)</li>
                      <li>• Registered Nurses (RN)</li>
                      <li>• Dietitian Nutritionists (RDN)</li>
                      <li>• Physical Therapists (DPT)</li>
                      <li>• Estheticians (LE)</li>
                    </ul>
                  </div>
                  <div className="bg-beige p-4 rounded-xl border-2 border-coral/20">
                    <h4 className="font-bold mb-2 text-navy">Finance & Legal</h4>
                    <ul className="text-sm text-black/70 space-y-1">
                      <li>• CPAs & Accountants</li>
                      <li>• Financial Planners (CFP)</li>
                      <li>• Chartered Financial Analysts</li>
                      <li>• Attorneys (JD)</li>
                      <li>• Enrolled Agents</li>
                    </ul>
                  </div>
                  <div className="bg-beige p-4 rounded-xl border-2 border-navy/20">
                    <h4 className="font-bold mb-2 text-navy">Tech & Engineering</h4>
                    <ul className="text-sm text-black/70 space-y-1">
                      <li>• Professional Engineers (PE)</li>
                      <li>• Cybersecurity Analysts</li>
                      <li>• Data Scientists (PhD)</li>
                      <li>• Software Architects</li>
                      <li>• Patent Agents</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4 text-navy flex items-center gap-3 font-serif">
                  <CheckCircle className="w-6 h-6 text-lime" />
                  Verification Process
                </h3>
                <p className="text-black/70 mb-4 leading-relaxed">
                  All experts undergo thorough credential verification before joining our network:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-lime font-bold mt-1">1.</span>
                    <div>
                      <span className="font-semibold text-navy">Submit Application</span>
                      <p className="text-sm text-black/70">Provide your credentials, licenses, and professional background</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-lime font-bold mt-1">2.</span>
                    <div>
                      <span className="font-semibold text-navy">Credential Verification</span>
                      <p className="text-sm text-black/70">We verify licenses, certifications, and professional standing</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-lime font-bold mt-1">3.</span>
                    <div>
                      <span className="font-semibold text-navy">Sample Review</span>
                      <p className="text-sm text-black/70">Complete a paid test review to demonstrate your expertise</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-lime font-bold mt-1">4.</span>
                    <div>
                      <span className="font-semibold text-navy">Onboarding</span>
                      <p className="text-sm text-black/70">Learn our review process and quality standards</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4 text-navy flex items-center gap-3 font-serif">
                  <Clock className="w-6 h-6 text-coral" />
                  Time Commitment
                </h3>
                <p className="text-black/70 leading-relaxed">
                  No minimum hours required. Accept assignments that fit your schedule. Most content reviews take 30-90 minutes depending on complexity. You control your workload.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application CTA */}
      <section className="bg-white py-24 px-4 relative overflow-hidden">
        <TextureOverlay type="grain" opacity={0.15} />
        <OrganicShape variant="blob4" color="lime" className="absolute top-0 right-0 w-96 h-96" opacity={0.08} />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="bg-lime/10 rounded-2xl p-8 md:p-12 text-center border-2 border-lime relative overflow-hidden">
            <TextureOverlay type="paper" opacity={0.3} />
            <p className="text-coral font-script text-3xl mb-3 relative z-10">Ready to Start?</p>
            <h2 className="text-3xl font-bold mb-4 text-navy font-serif relative z-10">
              Ready to Join Our Network?
            </h2>
            <p className="text-lg text-black/80 mb-8 max-w-2xl mx-auto relative z-10">
              Put your professional expertise to work. Help brands across health, wellness, finance, and professional services build trustworthy content while earning competitive compensation on your schedule.
            </p>
            <div className="relative z-10">
              <Button size="lg" asChild>
                <Link href="/eeat-meter">
                  Start Your Application
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
            <p className="text-sm text-black/60 mt-4 relative z-10">
              Application review typically takes 3-5 business days
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
