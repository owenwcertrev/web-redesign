'use client'

import { useState, FormEvent } from 'react'
import Button from './Button'
import ScoreGauge from './ScoreGauge'
import { Globe, Mail, CheckCircle, XCircle, AlertCircle, ArrowRight } from 'lucide-react'
import VerificationBadge from './VerificationBadge'

interface AnalysisResult {
  score: number
  breakdown: {
    experience: number
    expertise: number
    authoritativeness: number
    trustworthiness: number
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
  const [showEmailField, setShowEmailField] = useState(false)
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

      if (!response.ok) throw new Error('Failed to analyze URL')

      const data = await response.json()
      setResults(data.analysis)
    } catch (err) {
      setError('Unable to analyze this URL. Please check the URL and try again.')
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
        <h2 className="text-2xl font-semibold mb-3 text-charcoal text-center">
          Is your brand content unshakably credible, authoritative, & discoverable?
        </h2>
        <p className="text-charcoal/70 text-center mb-8">
          Analyze any website's E-E-A-T score for free
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* URL Input */}
          <div className="relative">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
              className="w-full pl-12 pr-4 py-4 text-lg rounded-16 border-2 border-black/10 focus:border-navy focus:outline-none transition-colors"
            />
          </div>

          {/* Optional Email Field */}
          {!showEmailField ? (
            <button
              type="button"
              onClick={() => setShowEmailField(true)}
              className="text-navy hover:underline text-sm"
            >
              + Add email to receive detailed report
            </button>
          ) : (
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com (optional)"
                className="w-full pl-12 pr-4 py-3 rounded-16 border-2 border-black/10 focus:border-navy focus:outline-none transition-colors"
              />
            </div>
          )}

          <Button type="submit" size="lg" loading={loading} className="w-full">
            {loading ? 'Analyzing...' : 'Analyze Content'}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </Button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-12 text-red-700">
            {error}
          </div>
        )}

        <p className="text-xs text-charcoal/50 text-center mt-4">
          Your data is secure. We never share your information.
        </p>
      </div>

      {/* Results Display */}
      {results && (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* E-E-A-T Score Visualization */}
          <div className="bg-white rounded-16 p-8 shadow-base">
            <h3 className="text-2xl font-semibold mb-8 text-center text-charcoal">
              Your E-E-A-T Score
            </h3>
            <div className="flex justify-center mb-8">
              <ScoreGauge score={results.score} label="Overall E-E-A-T Score" />
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-cream rounded-12">
                <div className="text-3xl font-bold text-navy mb-1">{results.breakdown.experience}</div>
                <div className="text-sm text-charcoal/70">Experience</div>
                <div className="text-xs text-charcoal/50">out of 25</div>
              </div>
              <div className="text-center p-4 bg-cream rounded-12">
                <div className="text-3xl font-bold text-navy mb-1">{results.breakdown.expertise}</div>
                <div className="text-sm text-charcoal/70">Expertise</div>
                <div className="text-xs text-charcoal/50">out of 25</div>
              </div>
              <div className="text-center p-4 bg-cream rounded-12">
                <div className="text-3xl font-bold text-navy mb-1">{results.breakdown.authoritativeness}</div>
                <div className="text-sm text-charcoal/70">Authoritativeness</div>
                <div className="text-xs text-charcoal/50">out of 25</div>
              </div>
              <div className="text-center p-4 bg-cream rounded-12">
                <div className="text-3xl font-bold text-navy mb-1">{results.breakdown.trustworthiness}</div>
                <div className="text-sm text-charcoal/70">Trustworthiness</div>
                <div className="text-xs text-charcoal/50">out of 25</div>
              </div>
            </div>
          </div>

          {/* What's Missing Section */}
          <div className="bg-white rounded-16 p-8 shadow-base">
            <h3 className="text-2xl font-semibold mb-6 text-charcoal">
              Opportunities for Improvement
            </h3>
            <ul className="space-y-3">
              {results.issues.map((issue, index) => (
                <li key={index} className="flex items-start gap-3 p-3 rounded-12 hover:bg-cream/50 transition-colors">
                  {getIssueIcon(issue.type)}
                  <span className="text-charcoal/80 flex-1">{issue.message}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* How CertREV Helps */}
          <div className="bg-white rounded-16 p-8 shadow-base">
            <h3 className="text-2xl font-semibold mb-6 text-charcoal">
              How CertREV Can Boost Your Score
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border-2 border-lime-light rounded-12 hover:bg-lime-light/30 transition-colors">
                <div className="mb-2">
                  <VerificationBadge size="sm" />
                </div>
                <h4 className="font-semibold mb-2 text-charcoal">Expert Attribution</h4>
                <p className="text-sm text-charcoal/70">
                  Add credentialed expert signatures to your content
                </p>
              </div>
              <div className="p-4 border-2 border-lime-light rounded-12 hover:bg-lime-light/30 transition-colors">
                <div className="mb-2">
                  <VerificationBadge size="sm" />
                </div>
                <h4 className="font-semibold mb-2 text-charcoal">Verification Badges</h4>
                <p className="text-sm text-charcoal/70">
                  Display trust signals that consumers recognize
                </p>
              </div>
              <div className="p-4 border-2 border-lime-light rounded-12 hover:bg-lime-light/30 transition-colors">
                <div className="mb-2">
                  <VerificationBadge size="sm" />
                </div>
                <h4 className="font-semibold mb-2 text-charcoal">Structured Data</h4>
                <p className="text-sm text-charcoal/70">
                  Implement proper schema markup for search engines
                </p>
              </div>
              <div className="p-4 border-2 border-lime-light rounded-12 hover:bg-lime-light/30 transition-colors">
                <div className="mb-2">
                  <VerificationBadge size="sm" />
                </div>
                <h4 className="font-semibold mb-2 text-charcoal">Authority Building</h4>
                <p className="text-sm text-charcoal/70">
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

          {/* CTA */}
          <div className="bg-lime-light rounded-16 p-8 text-center">
            <h3 className="text-2xl font-semibold mb-3 text-lime-dark">
              Ready to Improve Your Score?
            </h3>
            <p className="text-lime-dark/80 mb-6">
              Connect with credentialed experts and start building trust
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">Get Started with CertREV</Button>
              <Button size="lg" variant="secondary">Schedule a Demo</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
