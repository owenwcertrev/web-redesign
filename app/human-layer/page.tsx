import { Metadata } from 'next'
import Link from 'next/link'
import NewsletterSignup from '@/components/NewsletterSignup'
import { ArrowRight, Calendar, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'The Human Layer - Trust & Expertise Blog | CertREV',
  description: 'Insights on trust, expertise, and content in the AI age. Learn how expert validation protects your brand in an AI-powered world.',
}

export default function HumanLayerPage() {
  const articles = [
    {
      id: 1,
      category: 'Trust & AI',
      title: 'Why 60% of Consumers Doubt AI-Generated Content',
      excerpt: 'Stanford\'s latest research reveals a growing trust gap. Here\'s what brands need to know about maintaining credibility in the AI age.',
      date: 'March 15, 2025',
      readTime: '6 min read',
      image: 'from-primary/20 to-verification/20',
    },
    {
      id: 2,
      category: 'SEO Strategy',
      title: 'Google\'s E-E-A-T Update: What Changed in 2024',
      excerpt: 'The extra \'E\' for Experience changed everything. Learn how expert validation protects your organic traffic from algorithm updates.',
      date: 'March 10, 2025',
      readTime: '8 min read',
      image: 'from-verification/20 to-accent/30',
    },
    {
      id: 3,
      category: 'Compliance',
      title: 'FTC Cracks Down: $51K Average Fine for Deceptive Claims',
      excerpt: 'New enforcement data shows rising penalties. How expert-reviewed content helps brands stay compliant and build consumer trust.',
      date: 'March 5, 2025',
      readTime: '5 min read',
      image: 'from-accent/20 to-primary/20',
    },
    {
      id: 4,
      category: 'Content Strategy',
      title: 'The HubSpot Case Study: 88% Traffic Loss Without E-E-A-T',
      excerpt: 'How one of marketing\'s biggest publishers lost nearly all organic traffic - and what brands can learn from their recovery.',
      date: 'February 28, 2025',
      readTime: '7 min read',
      image: 'from-primary/30 to-verification/10',
    },
    {
      id: 5,
      category: 'Expert Insights',
      title: 'Credentialed Experts vs. Social Media Influencers',
      excerpt: 'Understanding the credential gap that impacts both SEO and consumer trust. Why expertise levels matter more than ever.',
      date: 'February 20, 2025',
      readTime: '6 min read',
      image: 'from-verification/10 to-primary/30',
    },
    {
      id: 6,
      category: 'Industry Trends',
      title: 'Purchase Intent Lift: The Nielsen Study Brands Need to See',
      excerpt: 'Data-backed proof that expert-reviewed content outperforms traditional brand messaging. Key findings and implementation strategies.',
      date: 'February 15, 2025',
      readTime: '5 min read',
      image: 'from-accent/30 to-verification/20',
    },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-cream py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-script text-[clamp(3.5rem,8vw,6rem)] mb-6 text-charcoal leading-tight">
            The Human Layer
          </h1>
          <p className="text-xl md:text-2xl font-serif italic text-charcoal/80 max-w-2xl mx-auto">
            Insights on trust, expertise, and content in the AI age
          </p>
        </div>
      </section>

      {/* Featured Article */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <article className="bg-cream rounded-16 overflow-hidden shadow-base hover:shadow-md transition-all">
            <div className="grid md:grid-cols-2 gap-0">
              <div className={`h-64 md:h-auto bg-gradient-to-br ${articles[0].image}`} />
              <div className="p-8 flex flex-col justify-center">
                <span className="text-sm text-primary font-medium mb-3">{articles[0].category}</span>
                <h2 className="text-3xl font-semibold mb-4 text-charcoal">
                  {articles[0].title}
                </h2>
                <p className="text-charcoal/70 mb-6 leading-relaxed">
                  {articles[0].excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-charcoal/60 mb-6">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {articles[0].date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {articles[0].readTime}
                  </div>
                </div>
                <Link
                  href={`/human-layer/${articles[0].id}`}
                  className="text-primary hover:underline font-medium inline-flex items-center gap-2"
                >
                  Read Article <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Article Grid */}
      <section className="bg-cream py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.slice(1).map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-16 overflow-hidden shadow-base hover:shadow-md transition-all hover:scale-[1.02]"
              >
                <div className={`h-48 bg-gradient-to-br ${article.image}`} />
                <div className="p-6">
                  <span className="text-sm text-primary font-medium">{article.category}</span>
                  <h3 className="text-xl font-semibold mt-2 mb-3 text-charcoal">
                    {article.title}
                  </h3>
                  <p className="text-charcoal/70 mb-4 text-sm leading-relaxed">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-charcoal/60 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {article.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </div>
                  </div>
                  <Link
                    href={`/human-layer/${article.id}`}
                    className="text-primary hover:underline font-medium inline-flex items-center gap-2 text-sm"
                  >
                    Read More <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-verification-light rounded-16 p-8 md:p-12 text-center">
            <h2 className="text-3xl font-semibold mb-4 text-charcoal">
              Stay Informed
            </h2>
            <p className="text-lg text-charcoal/70 mb-8 max-w-2xl mx-auto">
              Get insights on trust, expertise, and content strategy delivered to your inbox. No spam, just valuable insights for brands navigating the AI age.
            </p>
            <NewsletterSignup />
          </div>
        </div>
      </section>
    </div>
  )
}
