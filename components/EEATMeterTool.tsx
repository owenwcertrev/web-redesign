'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import Button from './Button'
import ScoreGauge from './ScoreGauge'
import { Globe, Mail, CheckCircle, XCircle, AlertCircle, ArrowRight, Sparkles } from 'lucide-react'
import VerificationBadge from './VerificationBadge'

interface AnalysisResult {
  score: number
  breakdown: {
    experience: number
    expertise: number
    authoritativeness: number
    trustworthiness: number
  }
  domainInfo?: {
    entered: string
    analyzed: string
    redirected: boolean
    canonical: string | null
  }
  issues: Array<{
    type: 'missing' | 'warning' | 'good'
    severity: 'high' | 'medium' | 'low'
    message: string
  }>
  suggestions: string[]
}

export default function EEATMeterTool() {
  const [url, setUrl] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/analyze-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, email }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('API Error:', response.status, errorData)
        throw new Error(errorData.error || 'Failed to analyze URL')
      }

      const data = await response.json()
      setResults(data.analysis)
    } catch (err) {
      console.error('Analysis error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Unable to analyze this URL. Please check the URL and try again.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'good':
        return <CheckCircle className="w-5 h-5 text-lime flex-shrink-0" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-coral flex-shrink-0" />
      case 'missing':
        return <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
      default:
        return null
    }
  }

  return (
    <div className="w-full">
      {/* Tool Interface */}
      <div className="bg-white rounded-16 p-8 shadow-base mb-8">
        <h2 className="text-2xl font-semibold mb-3 text-black text-center">
          Is your brand content unshakably credible, authoritative, & discoverable?
        </h2>
        <p className="text-black/70 text-center mb-8">
          Analyze any website's E-E-A-T score for free
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* URL Input */}
          <div className="relative">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="example.com or https://example.com"
              required
              className="w-full pl-12 pr-4 py-4 text-lg rounded-16 border-2 border-black/10 focus:border-navy focus:outline-none transition-colors"
            />
          </div>

          {/* Email Field with Value Prop */}
          <div className="bg-lime-light/30 rounded-16 p-4 border-2 border-lime/20">
            <div className="flex items-start gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-lime-dark flex-shrink-0 mt-0.5" />
              <p className="text-sm text-black/70">
                <strong className="text-navy">Get your competitive analysis + 5 quick wins</strong> to boost your score by 20 points (email subscribers only)
              </p>
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com (optional but recommended)"
                className="w-full pl-12 pr-4 py-3 rounded-16 border-2 border-lime/30 focus:border-lime focus:outline-none transition-colors bg-white"
              />
            </div>
          </div>

          <Button type="submit" size="lg" loading={loading} className="w-full">
            {loading ? 'Analyzing...' : 'Analyze Content'}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </Button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-16">
            <div className="flex items-start gap-3 mb-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-red-900 mb-1">Analysis Error</h4>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-red-100">
              <p className="text-xs font-semibold text-black/70 mb-2">Troubleshooting tips:</p>
              <ul className="text-xs text-black/60 space-y-1">
                <li>• Make sure the URL is publicly accessible (not behind a login)</li>
                <li>• Try adding or removing "www" from the domain</li>
                <li>• Verify the website is online and responding</li>
                <li>• Check if you entered the correct domain spelling</li>
              </ul>
            </div>
          </div>
        )}

        <p className="text-xs text-black/50 text-center mt-4">
          Your data is secure. We never share your information.
        </p>
      </div>

      {/* Results Display */}
      {results && (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* E-E-A-T Score Visualization */}
          <div className="bg-white rounded-16 p-8 shadow-base">
            <h3 className="text-2xl font-semibold mb-2 text-center text-black">
              Your E-E-A-T Score
            </h3>
            {results.domainInfo && results.domainInfo.redirected && (
              <p className="text-sm text-black/60 text-center mb-6">
                Analyzing <span className="font-semibold text-navy">{results.domainInfo.analyzed}</span>
                {results.domainInfo.entered !== `https://${results.domainInfo.analyzed}` &&
                  ` (redirected from ${new URL(results.domainInfo.entered).hostname})`}
              </p>
            )}
            <div className="flex justify-center mb-8">
              <ScoreGauge score={results.score} label="Overall E-E-A-T Score" />
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-4 bg-beige rounded-12">
                <div className="text-3xl font-bold text-navy mb-1">{results.breakdown.experience}</div>
                <div className="text-sm text-black/70">Experience</div>
                <div className="text-xs text-black/50">out of 25</div>
              </div>
              <div className="text-center p-4 bg-beige rounded-12">
                <div className="text-3xl font-bold text-navy mb-1">{results.breakdown.expertise}</div>
                <div className="text-sm text-black/70">Expertise</div>
                <div className="text-xs text-black/50">out of 25</div>
              </div>
              <div className="text-center p-4 bg-beige rounded-12">
                <div className="text-3xl font-bold text-navy mb-1">{results.breakdown.authoritativeness}</div>
                <div className="text-sm text-black/70">Authoritativeness</div>
                <div className="text-xs text-black/50">out of 25</div>
              </div>
              <div className="text-center p-4 bg-beige rounded-12">
                <div className="text-3xl font-bold text-navy mb-1">{results.breakdown.trustworthiness}</div>
                <div className="text-sm text-black/70">Trustworthiness</div>
                <div className="text-xs text-black/50">out of 25</div>
              </div>
            </div>

            {/* Benchmark Comparison */}
            <div className="bg-beige rounded-12 p-6 border-2 border-navy/10">
              <h4 className="font-semibold text-navy mb-4 text-center">How Does Your Score Compare?</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-black/70">Fortune 500 Health/Wellness Brands</span>
                  <span className="font-semibold text-navy">75-85</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-black/70">Mid-Market DTC Brands</span>
                  <span className="font-semibold text-navy">55-70</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-black/70">Startup/New Brands</span>
                  <span className="font-semibold text-navy">30-50</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-black/70">AI-Generated (No Expert Review)</span>
                  <span className="font-semibold text-navy">15-25</span>
                </div>
                <div className="h-px bg-navy/20 my-3"></div>
                <div className="flex items-center justify-between bg-white rounded-lg p-3 border-2 border-coral/30">
                  <span className="text-sm font-semibold text-navy">Your Score</span>
                  <span className="text-2xl font-bold text-coral">{results.score}</span>
                </div>
                {results.score < 50 && (
                  <p className="text-xs text-black/60 text-center mt-3">
                    Below industry standard for established brands
                  </p>
                )}
                {results.score >= 50 && results.score < 70 && (
                  <p className="text-xs text-black/60 text-center mt-3">
                    Room for improvement to reach industry-leading levels
                  </p>
                )}
                {results.score >= 70 && (
                  <p className="text-xs text-lime-dark text-center mt-3">
                    Strong foundation — maintain with ongoing expert verification
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* What's Missing Section */}
          <div className="bg-white rounded-16 p-8 shadow-base">
            <h3 className="text-2xl font-semibold mb-6 text-black">
              Opportunities for Improvement
            </h3>
            <ul className="space-y-3">
              {results.issues.map((issue, index) => (
                <li key={index} className="flex items-start gap-3 p-3 rounded-12 hover:bg-beige/50 transition-colors">
                  {getIssueIcon(issue.type)}
                  <span className="text-black/80 flex-1">{issue.message}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* How CertREV Helps */}
          <div className="bg-white rounded-16 p-8 shadow-base">
            <h3 className="text-2xl font-semibold mb-6 text-black">
              How CertREV Can Boost Your Score
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border-2 border-lime-light rounded-12 hover:bg-lime-light/30 transition-colors">
                <div className="mb-2">
                  <VerificationBadge size="sm" />
                </div>
                <h4 className="font-semibold mb-2 text-black">Expert Attribution</h4>
                <p className="text-sm text-black/70">
                  Add credentialed expert signatures to your content
                </p>
              </div>
              <div className="p-4 border-2 border-lime-light rounded-12 hover:bg-lime-light/30 transition-colors">
                <div className="mb-2">
                  <VerificationBadge size="sm" />
                </div>
                <h4 className="font-semibold mb-2 text-black">Verification Badges</h4>
                <p className="text-sm text-black/70">
                  Display trust signals that consumers recognize
                </p>
              </div>
              <div className="p-4 border-2 border-lime-light rounded-12 hover:bg-lime-light/30 transition-colors">
                <div className="mb-2">
                  <VerificationBadge size="sm" />
                </div>
                <h4 className="font-semibold mb-2 text-black">Structured Data</h4>
                <p className="text-sm text-black/70">
                  Implement proper schema markup for search engines
                </p>
              </div>
              <div className="p-4 border-2 border-lime-light rounded-12 hover:bg-lime-light/30 transition-colors">
                <div className="mb-2">
                  <VerificationBadge size="sm" />
                </div>
                <h4 className="font-semibold mb-2 text-black">Authority Building</h4>
                <p className="text-sm text-black/70">
                  Connect with recognized industry experts
                </p>
              </div>
            </div>
          </div>

          {/* Email Confirmation */}
          {email && (
            <div className="bg-lime-light rounded-16 p-6 border-2 border-lime">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-lime-dark flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-lime-dark mb-2">
                    Detailed report sent to your email
                  </h4>
                  <p className="text-sm text-lime-dark/80 mb-3">Check your inbox for:</p>
                  <ul className="text-sm text-lime-dark/80 space-y-1 list-disc list-inside">
                    <li>Complete E-E-A-T breakdown</li>
                    <li>Estimated Semrush Authority Score</li>
                    <li>Blog Content Health Check</li>
                    <li>Personalized recommendations</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Score-Based CTA */}
          <div className={`rounded-16 p-8 ${
            results.score < 50 ? 'bg-coral/10 border-2 border-coral/30' :
            results.score < 70 ? 'bg-navy/5 border-2 border-navy/20' :
            'bg-lime-light border-2 border-lime/30'
          }`}>
            <div className="text-center mb-6">
              {results.score < 50 && (
                <>
                  <h3 className="text-2xl font-semibold mb-3 text-navy">
                    Your Score is Critical — Protect Your Organic Traffic
                  </h3>
                  <p className="text-black/70 mb-4">
                    Sites with scores below 50 saw an average <strong>35% traffic drop</strong> in the last Google algorithm update. Expert verification can bring you to 75+ in 60-90 days.
                  </p>
                  <div className="bg-white rounded-lg p-4 mb-4 inline-block">
                    <p className="text-sm text-black/60 mb-2">Estimated to reach 75+:</p>
                    <p className="text-lg"><strong>12-15 expert reviews</strong> (~$1,920-2,400/month)</p>
                    <p className="text-xs text-black/50 mt-1">Core SEO or Growth Plan</p>
                  </div>
                </>
              )}
              {results.score >= 50 && results.score < 70 && (
                <>
                  <h3 className="text-2xl font-semibold mb-3 text-navy">
                    You're Close — Start Expert Verification Today
                  </h3>
                  <p className="text-black/70 mb-4">
                    With expert-verified content, you could reach industry-leading scores (75+) and protect against algorithm penalties. <strong>3-day turnaround</strong> on first review.
                  </p>
                  <div className="bg-white rounded-lg p-4 mb-4 inline-block">
                    <p className="text-sm text-black/60 mb-2">Estimated to reach 75+:</p>
                    <p className="text-lg"><strong>8-12 expert reviews</strong> (~$1,280-1,920/month)</p>
                    <p className="text-xs text-black/50 mt-1">Starter or Core SEO Plan</p>
                  </div>
                </>
              )}
              {results.score >= 70 && (
                <>
                  <h3 className="text-2xl font-semibold mb-3 text-lime-dark">
                    Strong Foundation — Maintain Your Competitive Edge
                  </h3>
                  <p className="text-black/70 mb-4">
                    You're ahead of most brands. <strong>Ongoing expert verification</strong> protects your authority as Google's algorithms evolve. Join 200+ brands maintaining E-E-A-T compliance.
                  </p>
                  <div className="bg-white rounded-lg p-4 mb-4 inline-block">
                    <p className="text-sm text-black/60 mb-2">Maintain your advantage:</p>
                    <p className="text-lg"><strong>4-8 expert reviews/month</strong> (~$640-1,280)</p>
                    <p className="text-xs text-black/50 mt-1">Starter Plan</p>
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pricing">
                <Button size="lg">
                  {results.score < 50 ? 'See Pricing & Get Started' :
                   results.score < 70 ? 'Start Your First Review' :
                   'View Plans'}
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="secondary">Book Free Consultation</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
