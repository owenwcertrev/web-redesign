import { Metadata } from 'next'
import Link from 'next/link'
import Button from '@/components/Button'
import { ArrowRight, DollarSign, Clock, Award, TrendingUp, CheckCircle, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Join Our Expert Network | CertREV',
  description: 'Use your expertise to help brands build trustworthy content. Flexible work, competitive compensation, professional recognition.',
}

export default function ForExpertsPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-cream py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-semibold mb-6 text-charcoal leading-tight">
            Join Our Expert Network
          </h1>
          <p className="text-xl text-charcoal/80 max-w-2xl mx-auto mb-8">
            Use your professional expertise to verify health, wellness, financial, and professional service content. Help brands build trust while earning competitive compensation.
          </p>
          <Button size="lg" asChild>
            <Link href="/eeat-meter">
              Apply Now
              <ArrowRight className="w-6 h-6" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-serif text-center mb-12 text-charcoal">
            Why Join CertREV
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-cream rounded-16 p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-charcoal">Flexible Work</h3>
              <p className="text-charcoal/70">
                Review content on your schedule. Work from anywhere, choose assignments that fit your expertise and availability.
              </p>
            </div>

            <div className="bg-cream rounded-16 p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-charcoal">Competitive Pay</h3>
              <p className="text-charcoal/70">
                Earn based on your credential tier. Higher credentials command premium rates for specialized content review.
              </p>
            </div>

            <div className="bg-cream rounded-16 p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-charcoal">Recognition</h3>
              <p className="text-charcoal/70">
                Build your professional profile. Your expertise gets credited on verified content, enhancing your professional brand.
              </p>
            </div>

            <div className="bg-cream rounded-16 p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-charcoal">Impact Quality</h3>
              <p className="text-charcoal/70">
                Help combat misinformation across industries. Your reviews protect consumers and elevate industry standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="bg-cream py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-serif text-center mb-12 text-charcoal">
            Expert Requirements
          </h2>
          <div className="bg-white rounded-16 p-8 md:p-12 shadow-base">
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-charcoal flex items-center gap-3">
                  <Users className="w-6 h-6 text-primary" />
                  Who We're Looking For
                </h3>
                <p className="text-charcoal/70 mb-4 leading-relaxed">
                  We seek credentialed professionals across health, wellness, finance, legal, tech, and professional services. Our 6-tier system accommodates everyone from certified coaches to board-certified physicians, CPAs, attorneys, and senior engineers.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-cream p-4 rounded-12">
                    <h4 className="font-semibold mb-2 text-charcoal">Health & Wellness</h4>
                    <ul className="text-sm text-charcoal/70 space-y-1">
                      <li>• Physicians (MD, DO)</li>
                      <li>• Registered Nurses (RN)</li>
                      <li>• Dietitian Nutritionists (RDN)</li>
                      <li>• Physical Therapists (DPT)</li>
                      <li>• Estheticians (LE)</li>
                    </ul>
                  </div>
                  <div className="bg-cream p-4 rounded-12">
                    <h4 className="font-semibold mb-2 text-charcoal">Finance & Legal</h4>
                    <ul className="text-sm text-charcoal/70 space-y-1">
                      <li>• CPAs & Accountants</li>
                      <li>• Financial Planners (CFP)</li>
                      <li>• Chartered Financial Analysts</li>
                      <li>• Attorneys (JD)</li>
                      <li>• Enrolled Agents</li>
                    </ul>
                  </div>
                  <div className="bg-cream p-4 rounded-12">
                    <h4 className="font-semibold mb-2 text-charcoal">Tech & Engineering</h4>
                    <ul className="text-sm text-charcoal/70 space-y-1">
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
                <h3 className="text-xl font-semibold mb-4 text-charcoal flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-verification" />
                  Verification Process
                </h3>
                <p className="text-charcoal/70 mb-4 leading-relaxed">
                  All experts undergo thorough credential verification before joining our network:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-verification mt-1">1.</span>
                    <div>
                      <span className="font-medium text-charcoal">Submit Application</span>
                      <p className="text-sm text-charcoal/70">Provide your credentials, licenses, and professional background</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-verification mt-1">2.</span>
                    <div>
                      <span className="font-medium text-charcoal">Credential Verification</span>
                      <p className="text-sm text-charcoal/70">We verify licenses, certifications, and professional standing</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-verification mt-1">3.</span>
                    <div>
                      <span className="font-medium text-charcoal">Sample Review</span>
                      <p className="text-sm text-charcoal/70">Complete a paid test review to demonstrate your expertise</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-verification mt-1">4.</span>
                    <div>
                      <span className="font-medium text-charcoal">Onboarding</span>
                      <p className="text-sm text-charcoal/70">Learn our review process and quality standards</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-charcoal flex items-center gap-3">
                  <Clock className="w-6 h-6 text-primary" />
                  Time Commitment
                </h3>
                <p className="text-charcoal/70 leading-relaxed">
                  No minimum hours required. Accept assignments that fit your schedule. Most content reviews take 30-90 minutes depending on complexity. You control your workload.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application CTA */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-verification-light rounded-16 p-8 md:p-12 text-center">
            <h2 className="text-3xl font-semibold mb-4 text-charcoal">
              Ready to Join Our Network?
            </h2>
            <p className="text-lg text-charcoal/70 mb-8 max-w-2xl mx-auto">
              Put your professional expertise to work. Help brands across health, wellness, finance, and professional services build trustworthy content while earning competitive compensation on your schedule.
            </p>
            <Button size="lg" asChild>
              <Link href="/eeat-meter">
                Apply to Become an Expert
                <ArrowRight className="w-6 h-6" />
              </Link>
            </Button>
            <p className="text-sm text-charcoal/60 mt-4">
              Application review typically takes 3-5 business days
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
