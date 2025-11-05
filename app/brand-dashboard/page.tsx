import { Metadata } from 'next'
import Link from 'next/link'
import Button from '@/components/Button'
import { Upload, BarChart, Download, Users, FileText, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Brand Dashboard | CertREV',
  description: 'Manage your content verification projects, track status, and download verification badges.',
}

export default function BrandDashboardPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-cream py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-semibold mb-6 text-charcoal leading-tight">
            Brand Dashboard
          </h1>
          <p className="text-xl text-charcoal/80 max-w-2xl mx-auto mb-8">
            Manage your content verification projects, track expert reviews, and access your trust infrastructure
          </p>
        </div>
      </section>

      {/* What's Inside Section */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-serif text-center mb-12 text-charcoal">
            What's Inside Your Dashboard
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-cream rounded-16 p-6 border-2 border-navy/20 hover:border-navy/40 transition-colors">
              <div className="w-12 h-12 bg-navy/10 rounded-full flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-navy" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-charcoal">Submit Content</h3>
              <p className="text-charcoal/70 text-sm leading-relaxed">
                Upload articles, landing pages, and product descriptions for expert review. Drag-and-drop interface makes submission easy.
              </p>
            </div>

            <div className="bg-cream rounded-16 p-6 border-2 border-navy/20 hover:border-navy/40 transition-colors">
              <div className="w-12 h-12 bg-navy/10 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-navy" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-charcoal">Track Status</h3>
              <p className="text-charcoal/70 text-sm leading-relaxed">
                Monitor your content through each stage: submission, expert assignment, review, and verification. Real-time status updates.
              </p>
            </div>

            <div className="bg-cream rounded-16 p-6 border-2 border-navy/20 hover:border-navy/40 transition-colors">
              <div className="w-12 h-12 bg-navy/10 rounded-full flex items-center justify-center mb-4">
                <Download className="w-6 h-6 text-navy" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-charcoal">Get Badges</h3>
              <p className="text-charcoal/70 text-sm leading-relaxed">
                Download verification badges, expert signatures, and schema markup code for your verified content.
              </p>
            </div>

            <div className="bg-cream rounded-16 p-6 border-2 border-navy/20 hover:border-navy/40 transition-colors">
              <div className="w-12 h-12 bg-navy/10 rounded-full flex items-center justify-center mb-4">
                <BarChart className="w-6 h-6 text-navy" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-charcoal">View Analytics</h3>
              <p className="text-charcoal/70 text-sm leading-relaxed">
                Track your E-E-A-T score improvements, verification history, and content health metrics over time.
              </p>
            </div>

            <div className="bg-cream rounded-16 p-6 border-2 border-navy/20 hover:border-navy/40 transition-colors">
              <div className="w-12 h-12 bg-navy/10 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-navy" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-charcoal">Manage Team</h3>
              <p className="text-charcoal/70 text-sm leading-relaxed">
                Add team members, assign roles, and collaborate on content verification projects. Perfect for agencies and brands.
              </p>
            </div>

            <div className="bg-cream rounded-16 p-6 border-2 border-navy/20 hover:border-navy/40 transition-colors">
              <div className="w-12 h-12 bg-navy/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-lime" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-charcoal">Expert Communication</h3>
              <p className="text-charcoal/70 text-sm leading-relaxed">
                Communicate directly with experts reviewing your content. Ask questions, provide context, and clarify requirements.
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
              Get Started with CertREV
            </h2>
            <p className="text-lg text-charcoal/70 mb-8 max-w-2xl mx-auto">
              Ready to build trust infrastructure for your brand? Start with a free E-E-A-T analysis to see how we can help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/eeat-meter">Get Free Analysis</Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/contact">Schedule Demo</Link>
              </Button>
            </div>
            <p className="text-sm text-charcoal/60 mt-6">
              Dashboard access provided upon signup. No credit card required for E-E-A-T Meter.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
