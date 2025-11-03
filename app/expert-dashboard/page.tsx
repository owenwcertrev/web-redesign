import { Metadata } from 'next'
import Link from 'next/link'
import Button from '@/components/Button'
import { FileText, DollarSign, BarChart, User, Calendar, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Expert Dashboard | CertREV',
  description: 'Access your expert assignments, submit reviews, track earnings, and manage your expert profile.',
}

export default function ExpertDashboardPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-cream py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-semibold mb-6 text-charcoal leading-tight">
            Expert Dashboard
          </h1>
          <p className="text-xl text-charcoal/80 max-w-2xl mx-auto mb-8">
            Manage review assignments, submit verifications, and track your impact as a CertREV expert
          </p>
        </div>
      </section>

      {/* What's Inside Section */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-serif text-center mb-12 text-charcoal">
            What's Inside Your Expert Dashboard
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-cream rounded-16 p-6 border-2 border-verification/30 hover:border-verification transition-colors">
              <div className="w-12 h-12 bg-verification/10 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-verification" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-charcoal">Review Assignments</h3>
              <p className="text-charcoal/70 text-sm leading-relaxed">
                Browse available content review assignments matched to your credentials. Accept what fits your schedule and expertise.
              </p>
            </div>

            <div className="bg-cream rounded-16 p-6 border-2 border-verification/30 hover:border-verification transition-colors">
              <div className="w-12 h-12 bg-verification/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-verification" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-charcoal">Submit Reviews</h3>
              <p className="text-charcoal/70 text-sm leading-relaxed">
                Use our structured review interface to fact-check content, verify claims, and provide expert validation with your professional signature.
              </p>
            </div>

            <div className="bg-cream rounded-16 p-6 border-2 border-verification/30 hover:border-verification transition-colors">
              <div className="w-12 h-12 bg-verification/10 rounded-full flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-verification" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-charcoal">Track Earnings</h3>
              <p className="text-charcoal/70 text-sm leading-relaxed">
                Monitor your completed reviews, pending payments, and total earnings. Transparent payment tracking with detailed breakdowns.
              </p>
            </div>

            <div className="bg-cream rounded-16 p-6 border-2 border-verification/30 hover:border-verification transition-colors">
              <div className="w-12 h-12 bg-verification/10 rounded-full flex items-center justify-center mb-4">
                <User className="w-6 h-6 text-verification" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-charcoal">Manage Profile</h3>
              <p className="text-charcoal/70 text-sm leading-relaxed">
                Update your credentials, areas of expertise, and availability. Build your professional profile visible to brands.
              </p>
            </div>

            <div className="bg-cream rounded-16 p-6 border-2 border-verification/30 hover:border-verification transition-colors">
              <div className="w-12 h-12 bg-verification/10 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-verification" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-charcoal">Review History</h3>
              <p className="text-charcoal/70 text-sm leading-relaxed">
                Access your complete verification history. See all content you've reviewed and track your contribution to industry standards.
              </p>
            </div>

            <div className="bg-cream rounded-16 p-6 border-2 border-verification/30 hover:border-verification transition-colors">
              <div className="w-12 h-12 bg-verification/10 rounded-full flex items-center justify-center mb-4">
                <BarChart className="w-6 h-6 text-verification" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-charcoal">Performance Metrics</h3>
              <p className="text-charcoal/70 text-sm leading-relaxed">
                View your review quality ratings, turnaround times, and client feedback. Maintain high standards to unlock premium assignments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Access Section */}
      <section className="bg-cream py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-16 p-8 md:p-12 text-center shadow-base">
            <h2 className="text-3xl font-semibold mb-6 text-charcoal">
              Not an Expert Yet?
            </h2>
            <p className="text-lg text-charcoal/70 mb-8 max-w-2xl mx-auto">
              Join our network of credentialed professionals. Use your expertise to help brands build trustworthy content while earning competitive compensation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/for-experts">Apply to Join</Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/how-it-works">Learn More</Link>
              </Button>
            </div>
            <p className="text-sm text-charcoal/60 mt-6">
              Application review typically takes 3-5 business days
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
