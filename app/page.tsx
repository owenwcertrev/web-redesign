import Link from 'next/link'
import Button from '@/components/Button'
import StatCard from '@/components/StatCard'
import TierCard from '@/components/TierCard'
import VerificationBadge from '@/components/VerificationBadge'
import StatusIndicator from '@/components/StatusIndicator'
import NewsletterSignup from '@/components/NewsletterSignup'
import { TrendingUp, Users, AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-cream py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-script text-[clamp(3.5rem,10vw,7rem)] mb-6 text-charcoal leading-tight">
            Trust, Verified.
          </h1>
          <p className="text-xl md:text-2xl text-charcoal/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            Expert fact-checking infrastructure for beauty brands navigating the AI content era
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild>
              <Link href="/eeat-meter">
                Analyze Your Content
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <Link href="#how-it-works">How It Works</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Stats Section */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-center mb-12 text-charcoal">
            Why Expert Validation Matters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              stat="88%"
              description="Organic traffic drop at HubSpot after Google's 2024 updates"
              source="Source: HubSpot"
              icon={TrendingUp}
            />
            <StatCard
              stat="60%"
              description="of consumers doubt content that shows no human review"
              source="Source: Stanford, 2025"
              icon={Users}
            />
            <StatCard
              stat="$51,744"
              description="per violation for deceptive or unsubstantiated claims"
              source="Source: FTC, 2024"
              icon={AlertCircle}
            />
            <StatCard
              stat="↑ Purchase Intent"
              description="Expert-reviewed articles lift purchase intent vs. brand copy alone"
              source="Source: Nielsen x inPowered"
              icon={ShoppingBag}
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-cream py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-center mb-16 text-charcoal">
            Your Path to Verified Content
          </h2>

          {/* Step 1 */}
          <div className="mb-16 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-400 text-white flex items-center justify-center text-xl font-bold">
                  1
                </div>
                <StatusIndicator status="pending" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-charcoal">Share Your Content</h3>
              <p className="text-charcoal/80 leading-relaxed text-lg">
                Submit articles, landing pages, or blog posts for expert review. Our platform makes it easy to upload and manage your content for verification.
              </p>
            </div>
            <div className="bg-white/50 rounded-16 p-8 border-2 border-dashed border-charcoal/20 min-h-[200px] flex items-center justify-center">
              <p className="text-charcoal/40 text-center">Content submission interface preview</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="mb-16 grid md:grid-cols-2 gap-8 items-center">
            <div className="md:order-2">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-alert text-white flex items-center justify-center text-xl font-bold">
                  2
                </div>
                <StatusIndicator status="inReview" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-charcoal">Rigorous Fact-Checking</h3>
              <p className="text-charcoal/80 leading-relaxed text-lg">
                Industry specialists verify claims, check sources, and validate expertise. Our credentialed experts ensure your content meets the highest standards.
              </p>
            </div>
            <div className="md:order-1 bg-white/50 rounded-16 p-8 border-2 border-dashed border-charcoal/20 min-h-[200px] flex items-center justify-center">
              <p className="text-charcoal/40 text-center">Expert review process visualization</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-verification text-white flex items-center justify-center text-xl font-bold">
                  3
                </div>
                <StatusIndicator status="verified" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-charcoal">Get Certified Trust</h3>
              <p className="text-charcoal/80 leading-relaxed text-lg mb-4">
                Receive expert-signed validation with verification badges that boost credibility and search rankings.
              </p>
              <div className="inline-block">
                <VerificationBadge />
              </div>
            </div>
            <div className="bg-white/50 rounded-16 p-8 border-2 border-dashed border-charcoal/20 min-h-[200px] flex items-center justify-center">
              <p className="text-charcoal/40 text-center">Verification badge examples</p>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Tiers Section */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif mb-4 text-charcoal">
              Expert Tiers
            </h2>
            <p className="text-xl text-charcoal/80 max-w-3xl mx-auto">
              From certified coaches to medical doctors — we have the right expert for your content
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          </div>
        </div>
      </section>

      {/* The Human Layer Section */}
      <section className="bg-[#F0F9F4] py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif mb-4 text-charcoal">
              The Human Layer
            </h2>
            <p className="text-xl font-serif italic text-charcoal/80 max-w-3xl mx-auto mb-8">
              In a world where AI writes faster than we can fact-check, CertREV exists to bring real experts back into the conversation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Featured Article 1 */}
            <article className="bg-white rounded-16 overflow-hidden shadow-base hover:shadow-md transition-all">
              <div className="h-48 bg-gradient-to-br from-primary/20 to-verification/20" />
              <div className="p-6">
                <span className="text-sm text-primary font-medium">Trust & AI</span>
                <h3 className="text-xl font-semibold mt-2 mb-3 text-charcoal">
                  Why 60% of Consumers Doubt AI-Generated Content
                </h3>
                <p className="text-charcoal/70 mb-4">
                  Stanford's latest research reveals a growing trust gap. Here's what beauty brands need to know about maintaining credibility in the AI age.
                </p>
                <Link href="/human-layer" className="text-primary hover:underline font-medium inline-flex items-center gap-2">
                  Read More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>

            {/* Featured Article 2 */}
            <article className="bg-white rounded-16 overflow-hidden shadow-base hover:shadow-md transition-all">
              <div className="h-48 bg-gradient-to-br from-verification/20 to-accent/30" />
              <div className="p-6">
                <span className="text-sm text-primary font-medium">SEO Strategy</span>
                <h3 className="text-xl font-semibold mt-2 mb-3 text-charcoal">
                  Google's E-E-A-T Update: What Changed in 2024
                </h3>
                <p className="text-charcoal/70 mb-4">
                  The extra 'E' for Experience changed everything. Learn how expert validation protects your organic traffic from algorithm updates.
                </p>
                <Link href="/human-layer" className="text-primary hover:underline font-medium inline-flex items-center gap-2">
                  Read More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          </div>

          {/* Newsletter Signup */}
          <div className="bg-white rounded-16 p-8 shadow-base text-center">
            <h3 className="text-2xl font-semibold mb-3 text-charcoal">Stay Informed</h3>
            <p className="text-charcoal/70 mb-6">
              Get insights on trust, expertise, and content strategy delivered to your inbox.
            </p>
            <NewsletterSignup />
          </div>

          <div className="text-center mt-8">
            <Button variant="ghost" size="lg" asChild>
              <Link href="/human-layer">
                Explore All Articles
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-cream py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif italic mb-6 text-charcoal">
            Ready to Build Trust?
          </h2>
          <p className="text-xl text-charcoal/80 mb-8 max-w-2xl mx-auto">
            Get your free content analysis and see how expert validation can transform your brand credibility
          </p>
          <Button size="lg" asChild>
            <Link href="/eeat-meter">
              Get Your Free Report
              <ArrowRight className="w-6 h-6" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
