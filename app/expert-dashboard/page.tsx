import { Metadata } from 'next'
import Link from 'next/link'
import Button from '@/components/Button'
import { FileText, DollarSign, BarChart, User, Calendar, CheckCircle, GraduationCap, Building2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Expert Dashboard | CertREV',
  description: 'Access your expert assignments, submit reviews, track earnings, and manage your expert profile. Review content, earn $50-200/hour, and build your professional reputation.',
  keywords: ['expert dashboard', 'expert assignments', 'content review platform', 'expert earnings', 'professional verification work'],
  openGraph: {
    title: 'Expert Dashboard - Manage Review Assignments',
    description: 'Access assignments, submit reviews, track earnings, and manage your expert profile.',
    url: 'https://certrev.com/expert-dashboard',
    siteName: 'CertREV',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CertREV Expert Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CertREV Expert Dashboard',
    description: 'Manage review assignments and track your earnings.',
    images: ['/twitter-image.png'],
  },
  alternates: {
    canonical: 'https://certrev.com/expert-dashboard',
  },
}

export default function ExpertDashboardPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-beige py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-semibold mb-6 text-black leading-tight">
            Expert Dashboard
          </h1>
          <p className="text-xl text-black/80 max-w-2xl mx-auto mb-8">
            Manage review assignments, submit verifications, and track your impact as a CertREV expert
          </p>
        </div>
      </section>

      {/* What's Inside Section */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-serif text-center mb-12 text-black">
            What's Inside Your Expert Dashboard
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-beige rounded-16 p-6 border-2 border-navy/20 hover:border-navy transition-colors">
              <div className="w-12 h-12 bg-navy/10 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-navy" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black">Review Assignments</h3>
              <p className="text-black/70 text-sm leading-relaxed">
                Browse available content review assignments matched to your credentials. Accept what fits your schedule and expertise.
              </p>
            </div>

            <div className="bg-beige rounded-16 p-6 border-2 border-navy/20 hover:border-navy transition-colors">
              <div className="w-12 h-12 bg-navy/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-navy" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black">Submit Reviews</h3>
              <p className="text-black/70 text-sm leading-relaxed">
                Use our structured review interface to fact-check content, verify claims, and provide expert validation with your professional signature.
              </p>
            </div>

            <div className="bg-beige rounded-16 p-6 border-2 border-navy/20 hover:border-navy transition-colors">
              <div className="w-12 h-12 bg-navy/10 rounded-full flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-navy" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black">Track Earnings</h3>
              <p className="text-black/70 text-sm leading-relaxed">
                Monitor your completed reviews, pending payments, and total earnings. Transparent payment tracking with detailed breakdowns.
              </p>
            </div>

            <div className="bg-beige rounded-16 p-6 border-2 border-navy/20 hover:border-navy transition-colors">
              <div className="w-12 h-12 bg-navy/10 rounded-full flex items-center justify-center mb-4">
                <User className="w-6 h-6 text-navy" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black">Manage Profile</h3>
              <p className="text-black/70 text-sm leading-relaxed">
                Update your credentials, areas of expertise, and availability. Build your professional profile visible to brands.
              </p>
            </div>

            <div className="bg-beige rounded-16 p-6 border-2 border-navy/20 hover:border-navy transition-colors">
              <div className="w-12 h-12 bg-navy/10 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-navy" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black">Review History</h3>
              <p className="text-black/70 text-sm leading-relaxed">
                Access your complete verification history. See all content you've reviewed and track your contribution to industry standards.
              </p>
            </div>

            <div className="bg-beige rounded-16 p-6 border-2 border-navy/20 hover:border-navy transition-colors">
              <div className="w-12 h-12 bg-navy/10 rounded-full flex items-center justify-center mb-4">
                <BarChart className="w-6 h-6 text-navy" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black">Performance Metrics</h3>
              <p className="text-black/70 text-sm leading-relaxed">
                View your review quality ratings, turnaround times, and client feedback. Maintain high standards to unlock premium assignments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Access Section */}
      <section className="bg-beige py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-16 p-8 md:p-12 text-center shadow-base">
            <h2 className="text-3xl font-semibold mb-6 text-black">
              Get Started with CertREV
            </h2>
            <p className="text-lg text-black/70 mb-8 max-w-2xl mx-auto">
              Join our network of credentialed professionals or explore our platform as a brand.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="!bg-coral hover:!bg-coral/90 !text-white !border-coral">
                <Link href="https://dashboard.certrev.com/auth/signup?tab=brand">
                  Sign Up as Brand
                  <Building2 className="w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" asChild className="!bg-navy hover:!bg-navy/90 !text-white !border-navy">
                <Link href="https://dashboard.certrev.com/auth/signup?tab=expert">
                  Sign Up as Expert
                  <GraduationCap className="w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/book-demo">Schedule Demo</Link>
              </Button>
            </div>
            <p className="text-sm text-black/60 mt-6">
              Expert applications typically reviewed within 3-5 business days
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
