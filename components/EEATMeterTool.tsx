'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import Button from './Button'
import ScoreGauge from './ScoreGauge'
import EEATScoreDisplay from './EEATScoreDisplay'
import { Globe, Mail, CheckCircle, XCircle, AlertCircle, ArrowRight, Sparkles } from 'lucide-react'
import VerificationBadge from './VerificationBadge'
import { analytics } from '@/lib/analytics'

import type { EEATScore } from '@/lib/types/blog-analysis'

interface AnalysisResult {
  type?: 'blog' | 'single-page'
  eeatScore?: EEATScore // New variable-based structure
  score: number
  blogScore?: number
  breakdown: {
    experience: number
    expertise: number
    authoritativeness: number
    trustworthiness: number
  }
  domainInfo?: {
    entered?: string
    analyzed?: string
    redirected?: boolean
    canonical?: string | null
    domain?: string
    postsAnalyzed?: number
    totalPostsFound?: number
    failedAnalyses?: number
  }
  blogInsights?: {
    publishingFrequency: {
      score: number
      postsPerMonth: number
      trend: string
      recommendation: string
    }
    contentDepth: {
      score: number
      avgWordCount: number
      avgCitations: number
      distribution: {
        short: number
        medium: number
        long: number
        comprehensive: number
      }
      recommendation: string
    }
    topicDiversity: {
      score: number
      uniqueTopics: number
      topKeywords: Array<{ keyword: string; frequency: number; relatedPosts: number }>
      coverage: string
      recommendation: string
    }
    authorConsistency: {
      score: number
      totalAuthors: number
      attributionRate: number
      primaryAuthors: Array<{
        name: string
        postCount: number
        percentage: number
        hasCredentials: boolean
      }>
      consistency: string
      recommendation: string
    }
    schemaAdoption: {
      score: number
      adoptionRate: number
      commonTypes: Array<{ type: string; count: number; percentage: number }>
      recommendation: string
    }
    internalLinking: {
      score: number
      avgLinksPerPost: number
      networkStrength: string
      recommendation: string
    }
  }
  topPosts?: Array<{
    url: string
    title: string
    score: number
    wordCount: number
  }>
  bottomPosts?: Array<{
    url: string
    title: string
    score: number
    wordCount: number
  }>
  issues: Array<{
    type: 'missing' | 'warning' | 'good'
    severity: 'high' | 'medium' | 'low'
    message: string
    description?: string
  }>
  suggestions: string[]
  metrics?: {
    wordCount: number
    readabilityScore: number
    citations: number
    authors: number
    schemaMarkup: number
    hasSSL: boolean
  }
}

interface ComprehensiveStatus {
  status: 'processing' | 'not_requested'
  estimatedTime?: string
  message: string
  features: string[]
}

export default function EEATMeterTool() {
  const [url, setUrl] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<AnalysisResult | null>(null)
  const [comprehensiveStatus, setComprehensiveStatus] = useState<ComprehensiveStatus | null>(null)
  const [error, setError] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [lastAnalyzedUrl, setLastAnalyzedUrl] = useState<string | null>(null)
  const [lastAnalysisTime, setLastAnalysisTime] = useState<number | null>(null)
  const [rateLimitError, setRateLimitError] = useState('')

  const validateEmail = (emailValue: string): boolean => {
    if (!emailValue) return true // Email is optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(emailValue)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    if (emailError && validateEmail(value)) {
      setEmailError('')
    }
  }

  const handleEmailBlur = () => {
    if (email && !validateEmail(email)) {
      setEmailError('Please enter a valid email address')
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Validate email if provided
    if (email && !validateEmail(email)) {
      setEmailError('Please enter a valid email address')
      return
    }

    // Rate limiting: Prevent duplicate submissions within 10 seconds
    const now = Date.now()
    const normalizedUrl = url.toLowerCase().trim()
    const RATE_LIMIT_MS = 10000 // 10 seconds

    if (
      lastAnalyzedUrl === normalizedUrl &&
      lastAnalysisTime &&
      now - lastAnalysisTime < RATE_LIMIT_MS
    ) {
      const secondsRemaining = Math.ceil((RATE_LIMIT_MS - (now - lastAnalysisTime)) / 1000)
      setRateLimitError(
        `Please wait ${secondsRemaining} second${secondsRemaining !== 1 ? 's' : ''} before analyzing this URL again.`
      )
      return
    }

    setLoading(true)
    setError('')
    setEmailError('')
    setRateLimitError('')

    // Track analysis start
    analytics.eeAtMeter.started(url)

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

      // Handle new hybrid API response structure
      if (data.instant) {
        setResults(data.instant)
        setComprehensiveStatus(data.comprehensive || null)

        // Track successful analysis
        analytics.eeAtMeter.completed(url, data.instant.score)

        // Set rate limiting trackers
        setLastAnalyzedUrl(normalizedUrl)
        setLastAnalysisTime(now)

        // If email was provided, show success confirmation
        if (email) {
          setEmailSubmitted(true)
          setSubmittedEmail(email)
          // Clear form
          setUrl('')
          setEmail('')
        }
      } else if (data.analysis) {
        // Backwards compatibility with old API response
        setResults(data.analysis)
        analytics.eeAtMeter.completed(url, data.analysis.score)

        // Set rate limiting trackers
        setLastAnalyzedUrl(normalizedUrl)
        setLastAnalysisTime(now)

        // If email was provided, show success confirmation
        if (email) {
          setEmailSubmitted(true)
          setSubmittedEmail(email)
          // Clear form
          setUrl('')
          setEmail('')
        }
      }
    } catch (err) {
      console.error('Analysis error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Unable to analyze this URL. Please check the URL and try again.'
      setError(errorMessage)

      // Track failed analysis
      analytics.eeAtMeter.failed(url, errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    setError('')
    setRateLimitError('')
    setEmailError('')
  }

  const handleNewAnalysis = () => {
    setResults(null)
    setComprehensiveStatus(null)
    setError('')
    setRateLimitError('')
    setEmailError('')
    setEmailSubmitted(false)
    setSubmittedEmail('')
    setUrl('')
    setEmail('')
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
          Is your blog content unshakably credible, authoritative, & discoverable?
        </h2>
        <p className="text-black/70 text-center mb-6">
          Analyze your entire blog strategy & E-E-A-T score for free
        </p>

        {/* How to Use Guide */}
        <div className="bg-navy/5 rounded-12 p-5 mb-6 border border-navy/10">
          <h3 className="text-sm font-semibold text-navy mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            How to Use
          </h3>
          <div className="space-y-2 text-sm text-black/80">
            <div className="flex items-start gap-2">
              <span className="text-lime-dark font-semibold min-w-[120px]">Blog Analysis:</span>
              <span>Enter domain only (e.g., <code className="bg-white px-1.5 py-0.5 rounded text-navy font-mono text-xs">healthline.com</code>) to analyze your entire blog strategy</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-coral font-semibold min-w-[120px]">Single Page:</span>
              <span>Enter full URL (e.g., <code className="bg-white px-1.5 py-0.5 rounded text-navy font-mono text-xs">healthline.com/nutrition/vitamin-d-101</code>) for one article</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* URL Input */}
          <div className="relative">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="healthline.com (blog) or healthline.com/article (single page)"
              required
              aria-label="Website URL to analyze"
              aria-describedby="url-help"
              className="w-full pl-12 pr-4 py-4 text-lg rounded-16 border-2 border-black/10 focus:border-navy focus:outline-none transition-colors"
            />
            <span id="url-help" className="sr-only">Enter your domain to analyze your entire blog strategy, or a specific post URL for single-page analysis</span>
          </div>

          {/* Email Field with Value Prop */}
          <div className="bg-lime-light/30 rounded-16 p-4 border-2 border-lime/20">
            <div className="flex items-start gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-lime-dark flex-shrink-0 mt-0.5" />
              <p className="text-sm text-black/70" id="email-help">
                <strong className="text-navy">Get AI-powered comprehensive analysis</strong> with domain authority metrics, content quality assessment, and author reputation verification (optional)
              </p>
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40" />
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                placeholder="your@email.com (optional - for comprehensive report)"
                aria-label="Email address for comprehensive analysis report"
                aria-describedby="email-help email-privacy"
                aria-invalid={!!emailError}
                className={`w-full pl-12 pr-4 py-3 rounded-16 border-2 focus:outline-none transition-colors bg-white ${
                  emailError
                    ? 'border-red-500 focus:border-red-600'
                    : 'border-lime/30 focus:border-lime'
                }`}
              />
            </div>
            {emailError && (
              <p className="text-sm text-red-600 mt-2 flex items-center gap-1" role="alert">
                <AlertCircle className="w-4 h-4" />
                {emailError}
              </p>
            )}
            <p className="text-xs text-black/50 mt-3" id="email-privacy">
              Your data is secure. We never share your information. Read our{' '}
              <a href="/privacy" className="text-navy hover:underline">privacy policy</a>.
            </p>
          </div>

          <Button
            type="submit"
            size="lg"
            loading={loading}
            className="w-full"
            disabled={loading || !!emailError || !!rateLimitError}
            aria-busy={loading}
          >
            {loading ? 'Analyzing...' : 'Analyze Content'}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </Button>
        </form>

        {/* Rate Limit Warning */}
        {rateLimitError && (
          <div className="mt-4 p-4 bg-coral/10 border-2 border-coral/30 rounded-16" role="alert">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-coral flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-coral mb-1">Please Wait</h4>
                <p className="text-sm text-black/80">{rateLimitError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Email Confirmation Success Message */}
        {emailSubmitted && submittedEmail && (
          <div className="mt-4 p-4 bg-lime-light border-2 border-lime rounded-16" role="status" aria-live="polite">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-lime-dark flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-lime-dark mb-1">Email Sent Successfully!</h4>
                <p className="text-sm text-lime-dark/90 mb-2">
                  We've sent your comprehensive E-E-A-T analysis to <strong>{submittedEmail}</strong>
                </p>
                <p className="text-xs text-lime-dark/80">
                  Your detailed report will arrive in 2-4 minutes. Don't forget to check your spam/promotions folder!
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-16" role="alert">
            <div className="flex items-start gap-3 mb-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-red-900 mb-1">Analysis Error</h4>
                <p className="text-red-700 text-sm mb-3">{error}</p>
                <button
                  onClick={handleRetry}
                  className="text-sm font-semibold text-red-700 hover:text-red-900 underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
                >
                  Try Again
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-red-100">
              <p className="text-xs font-semibold text-black/70 mb-2">Troubleshooting tips:</p>
              <ul className="text-xs text-black/60 space-y-1">
                <li>• Make sure the URL is publicly accessible (not behind a login)</li>
                <li>• Try adding or removing "www" from the domain</li>
                <li>• Verify the website is online and responding</li>
                <li>• Check if you entered the correct domain spelling</li>
                <li>• If the issue persists, <a href="/contact" className="text-navy hover:underline">contact support</a></li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Loading Skeleton */}
      {loading && !results && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="bg-white rounded-16 p-8 shadow-base">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-navy/20 border-t-navy rounded-full animate-spin mb-6" />
              <div className="h-8 w-64 bg-beige rounded-lg mb-4 animate-pulse" />
              <div className="h-4 w-48 bg-beige/70 rounded-lg mb-8 animate-pulse" />

              {/* Skeleton Score Gauge */}
              <div className="w-48 h-48 bg-beige rounded-full mb-8 animate-pulse relative">
                <div className="absolute inset-8 bg-white rounded-full" />
              </div>

              {/* Skeleton Breakdown */}
              <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-beige rounded-12 p-4 animate-pulse">
                    <div className="h-10 w-16 bg-beige/70 rounded mx-auto mb-2" />
                    <div className="h-4 w-24 bg-beige/70 rounded mx-auto" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 space-y-2">
              <div className="h-4 w-full bg-beige rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-beige rounded animate-pulse" />
              <div className="h-4 w-4/6 bg-beige rounded animate-pulse" />
            </div>
          </div>

          <div className="bg-white rounded-16 p-8 shadow-base">
            <div className="h-6 w-48 bg-beige rounded-lg mb-4 animate-pulse" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3 p-3">
                  <div className="w-5 h-5 bg-beige rounded-full flex-shrink-0 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-full bg-beige rounded animate-pulse" />
                    <div className="h-4 w-3/4 bg-beige rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results Display */}
      {results && (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Comprehensive Analysis Status - Prominent Banner */}
          {comprehensiveStatus && comprehensiveStatus.status === 'processing' && (
            <div className="bg-gradient-to-r from-lime-light to-lime-light/70 border-2 border-lime rounded-16 p-6 shadow-lg" role="status" aria-live="polite">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-6 h-6 text-lime-dark" />
                  <div className="w-6 h-6 border-2 border-lime-dark border-t-transparent rounded-full animate-spin" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-lime-dark mb-2">
                    Comprehensive Analysis in Progress
                  </h3>
                  <p className="text-base text-lime-dark/90 mb-3 max-w-2xl">
                    {comprehensiveStatus.message}
                  </p>
                  <p className="text-sm font-semibold text-lime-dark/80 mb-4">
                    Estimated time: {comprehensiveStatus.estimatedTime}
                  </p>
                  <div className="inline-block bg-white/80 rounded-lg p-4 text-left">
                    <p className="text-sm font-semibold text-lime-dark mb-2">
                      Your comprehensive report will include:
                    </p>
                    <ul className="text-sm text-lime-dark/90 space-y-2">
                      {comprehensiveStatus.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-lime" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* E-E-A-T Score - New Variable-Based Display */}
          {results.eeatScore ? (
            <EEATScoreDisplay
              score={results.eeatScore}
              showComprehensiveUpsell={!comprehensiveStatus || comprehensiveStatus.status === 'not_requested'}
              postsAnalyzed={results.domainInfo?.postsAnalyzed}
            />
          ) : (
            /* E-E-A-T Score Visualization - Legacy */
            <div className="bg-white rounded-16 p-8 shadow-base">
            <div className="flex items-center justify-center gap-2 mb-2">
              <h3 className="text-2xl font-semibold text-center text-black">
                Your E-E-A-T Score
              </h3>
              {(!comprehensiveStatus || comprehensiveStatus.status === 'not_requested') && (
                <span className="text-xs font-semibold text-coral bg-coral/10 px-2 py-1 rounded-md">
                  INSTANT
                </span>
              )}
            </div>
            {results.domainInfo && results.domainInfo.redirected && results.domainInfo.entered && (
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
              <div className="text-center p-3 sm:p-4 bg-beige rounded-12 min-w-0">
                <div className="text-2xl sm:text-3xl font-bold text-navy mb-1">{results.breakdown.experience}</div>
                <div className="text-xs sm:text-sm text-black/70 break-words hyphens-auto">Experience</div>
                <div className="text-xs text-black/50 whitespace-nowrap">out of 25</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-beige rounded-12 min-w-0">
                <div className="text-2xl sm:text-3xl font-bold text-navy mb-1">{results.breakdown.expertise}</div>
                <div className="text-xs sm:text-sm text-black/70 break-words hyphens-auto">Expertise</div>
                <div className="text-xs text-black/50 whitespace-nowrap">out of 25</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-beige rounded-12 min-w-0">
                <div className="text-2xl sm:text-3xl font-bold text-navy mb-1">{results.breakdown.authoritativeness}</div>
                <div className="text-xs sm:text-sm text-black/70 break-words hyphens-auto" lang="en">Authoritativeness</div>
                <div className="text-xs text-black/50 whitespace-nowrap">out of 25</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-beige rounded-12 min-w-0">
                <div className="text-2xl sm:text-3xl font-bold text-navy mb-1">{results.breakdown.trustworthiness}</div>
                <div className="text-xs sm:text-sm text-black/70 break-words hyphens-auto">Trustworthiness</div>
                <div className="text-xs text-black/50 whitespace-nowrap">out of 25</div>
              </div>
            </div>

            {/* Benchmark Comparison */}
            <div className="bg-beige rounded-12 p-4 sm:p-6 border-2 border-navy/10">
              <h4 className="font-semibold text-navy mb-4 text-center break-words">How Does Your Score Compare?</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm text-black/70 break-words min-w-0 flex-1">Fortune 500 Health/Wellness Brands</span>
                  <span className="font-semibold text-navy whitespace-nowrap">75-85</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm text-black/70 break-words min-w-0 flex-1">Mid-Market DTC Brands</span>
                  <span className="font-semibold text-navy whitespace-nowrap">55-70</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm text-black/70 break-words min-w-0 flex-1">Startup/New Brands</span>
                  <span className="font-semibold text-navy whitespace-nowrap">30-50</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm text-black/70 break-words min-w-0 flex-1">AI-Generated (No Expert Review)</span>
                  <span className="font-semibold text-navy whitespace-nowrap">15-25</span>
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
          )}

          {/* Blog Strategy Insights (only for blog analysis) */}
          {results.type === 'blog' && results.blogInsights && (
            <div className="bg-white rounded-16 p-8 shadow-base">
              <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-2 text-black">Blog Strategy Insights</h3>
                <p className="text-black/70">
                  Analyzed {results.domainInfo?.postsAnalyzed} posts from your blog
                  {results.domainInfo?.totalPostsFound && results.domainInfo.totalPostsFound > (results.domainInfo?.postsAnalyzed || 0) &&
                    ` (${results.domainInfo.totalPostsFound} total found)`}
                </p>
              </div>

              {/* Blog Strategy Score */}
              {results.blogScore !== undefined && (
                <div className="bg-gradient-to-r from-navy/5 to-lime/5 rounded-12 p-6 mb-6 border-2 border-navy/10">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h4 className="text-lg font-semibold text-navy mb-1">Overall Blog Strategy Score</h4>
                      <p className="text-sm text-black/70">Aggregate score across all blog metrics</p>
                    </div>
                    <div className="text-4xl font-bold text-navy">{results.blogScore}/100</div>
                  </div>
                </div>
              )}

              {/* 6 Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {/* Publishing Frequency */}
                <div className="bg-beige rounded-12 p-5 border-2 border-navy/10">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-navy">Publishing Frequency</h4>
                    <span className="text-2xl font-bold text-navy">{results.blogInsights.publishingFrequency.score}</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-black/70">Posts/Month:</span>
                      <span className="font-semibold text-black">{results.blogInsights.publishingFrequency.postsPerMonth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/70">Trend:</span>
                      <span className={`font-semibold capitalize ${
                        results.blogInsights.publishingFrequency.trend === 'increasing' ? 'text-lime-dark' :
                        results.blogInsights.publishingFrequency.trend === 'decreasing' ? 'text-coral' :
                        'text-navy'
                      }`}>{results.blogInsights.publishingFrequency.trend}</span>
                    </div>
                  </div>
                  <p className="text-xs text-black/60 mt-3">{results.blogInsights.publishingFrequency.recommendation}</p>
                </div>

                {/* Content Depth */}
                <div className="bg-beige rounded-12 p-5 border-2 border-navy/10">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-navy">Content Depth</h4>
                    <span className="text-2xl font-bold text-navy">{results.blogInsights.contentDepth.score}</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-black/70">Avg Words:</span>
                      <span className="font-semibold text-black">{results.blogInsights.contentDepth.avgWordCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/70">Avg Citations:</span>
                      <span className="font-semibold text-black">{results.blogInsights.contentDepth.avgCitations}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-black/60 mb-1">
                      <span>Distribution:</span>
                    </div>
                    <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-black/5">
                      {results.blogInsights.contentDepth.distribution.short > 0 && (
                        <div
                          style={{ width: `${(results.blogInsights.contentDepth.distribution.short / (results.domainInfo?.postsAnalyzed || 1)) * 100}%` }}
                          className="bg-coral"
                          title={`${results.blogInsights.contentDepth.distribution.short} short posts (<500 words)`}
                        />
                      )}
                      {results.blogInsights.contentDepth.distribution.medium > 0 && (
                        <div
                          style={{ width: `${(results.blogInsights.contentDepth.distribution.medium / (results.domainInfo?.postsAnalyzed || 1)) * 100}%` }}
                          className="bg-navy/50"
                          title={`${results.blogInsights.contentDepth.distribution.medium} medium posts (500-1500 words)`}
                        />
                      )}
                      {results.blogInsights.contentDepth.distribution.long > 0 && (
                        <div
                          style={{ width: `${(results.blogInsights.contentDepth.distribution.long / (results.domainInfo?.postsAnalyzed || 1)) * 100}%` }}
                          className="bg-lime-dark"
                          title={`${results.blogInsights.contentDepth.distribution.long} long posts (1500-3000 words)`}
                        />
                      )}
                      {results.blogInsights.contentDepth.distribution.comprehensive > 0 && (
                        <div
                          style={{ width: `${(results.blogInsights.contentDepth.distribution.comprehensive / (results.domainInfo?.postsAnalyzed || 1)) * 100}%` }}
                          className="bg-lime"
                          title={`${results.blogInsights.contentDepth.distribution.comprehensive} comprehensive posts (>3000 words)`}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Topic Diversity */}
                <div className="bg-beige rounded-12 p-5 border-2 border-navy/10">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-navy">Topic Diversity</h4>
                    <span className="text-2xl font-bold text-navy">{results.blogInsights.topicDiversity.score}</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-black/70">Unique Topics:</span>
                      <span className="font-semibold text-black">{results.blogInsights.topicDiversity.uniqueTopics}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/70">Coverage:</span>
                      <span className="font-semibold text-black capitalize">{results.blogInsights.topicDiversity.coverage}</span>
                    </div>
                  </div>
                  {results.blogInsights.topicDiversity.topKeywords.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-black/60 mb-2">Top Keywords:</p>
                      <div className="flex flex-wrap gap-1">
                        {results.blogInsights.topicDiversity.topKeywords.slice(0, 5).map((kw, idx) => (
                          <span key={idx} className="text-xs bg-navy/10 text-navy px-2 py-1 rounded-full">
                            {kw.keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Author Consistency */}
                <div className="bg-beige rounded-12 p-5 border-2 border-navy/10">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-navy">Author Consistency</h4>
                    <span className="text-2xl font-bold text-navy">{results.blogInsights.authorConsistency.score}</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-black/70">Total Authors:</span>
                      <span className="font-semibold text-black">{results.blogInsights.authorConsistency.totalAuthors}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/70">Attribution:</span>
                      <span className="font-semibold text-black">{results.blogInsights.authorConsistency.attributionRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/70">Consistency:</span>
                      <span className="font-semibold text-black capitalize">{results.blogInsights.authorConsistency.consistency.replace('-', ' ')}</span>
                    </div>
                  </div>
                </div>

                {/* Schema Adoption */}
                <div className="bg-beige rounded-12 p-5 border-2 border-navy/10">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-navy">Schema Markup</h4>
                    <span className="text-2xl font-bold text-navy">{results.blogInsights.schemaAdoption.score}</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-black/70">Adoption Rate:</span>
                      <span className="font-semibold text-black">{results.blogInsights.schemaAdoption.adoptionRate}%</span>
                    </div>
                  </div>
                  {results.blogInsights.schemaAdoption.commonTypes.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-black/60 mb-2">Common Types:</p>
                      <div className="space-y-1">
                        {results.blogInsights.schemaAdoption.commonTypes.slice(0, 3).map((type, idx) => (
                          <div key={idx} className="text-xs flex justify-between">
                            <span className="text-black/70">{type.type}</span>
                            <span className="font-semibold text-navy">{type.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Internal Linking */}
                <div className="bg-beige rounded-12 p-5 border-2 border-navy/10">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-navy">Internal Linking</h4>
                    <span className="text-2xl font-bold text-navy">{results.blogInsights.internalLinking.score}</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-black/70">Avg Links/Post:</span>
                      <span className="font-semibold text-black">{results.blogInsights.internalLinking.avgLinksPerPost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/70">Strength:</span>
                      <span className={`font-semibold capitalize ${
                        results.blogInsights.internalLinking.networkStrength === 'strong' ? 'text-lime-dark' :
                        results.blogInsights.internalLinking.networkStrength === 'weak' ? 'text-coral' :
                        'text-navy'
                      }`}>{results.blogInsights.internalLinking.networkStrength}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top and Bottom Posts */}
              {(results.topPosts && results.topPosts.length > 0) && (
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Top Performing Posts */}
                  <div className="bg-lime-light/30 rounded-12 p-5 border-2 border-lime/30">
                    <h4 className="font-semibold text-lime-dark mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Top Performing Posts
                    </h4>
                    <div className="space-y-2">
                      {results.topPosts.slice(0, 3).map((post, idx) => (
                        <div key={idx} className="text-sm">
                          <a
                            href={post.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-navy hover:underline font-medium line-clamp-1"
                          >
                            {post.title}
                          </a>
                          <div className="flex justify-between text-xs text-black/60 mt-1">
                            <span>Score: {post.score}/100</span>
                            <span>{post.wordCount} words</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Performing Posts */}
                  {results.bottomPosts && results.bottomPosts.length > 0 && (
                    <div className="bg-coral/10 rounded-12 p-5 border-2 border-coral/30">
                      <h4 className="font-semibold text-coral mb-3 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Needs Improvement
                      </h4>
                      <div className="space-y-2">
                        {results.bottomPosts.slice(0, 3).map((post, idx) => (
                          <div key={idx} className="text-sm">
                            <a
                              href={post.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-navy hover:underline font-medium line-clamp-1"
                            >
                              {post.title}
                            </a>
                            <div className="flex justify-between text-xs text-black/60 mt-1">
                              <span>Score: {post.score}/100</span>
                              <span>{post.wordCount} words</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

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
                    Let's Get Experts on Your Content
                  </h3>
                  <p className="text-black/70 mb-6">
                    The gap between your current score and industry leaders isn't about content quality - it's about attribution. You need credentialed professionals reviewing and signing your work. That's what we do.
                  </p>
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
                    <p className="text-sm text-black/60 mb-2">Example path to 75+:</p>
                    <p className="text-lg"><strong>8-12 expert reviews</strong></p>
                    <p className="text-xs text-black/50 mt-1">Pricing varies by plan and volume</p>
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
                    <p className="text-lg"><strong>4-8 expert reviews/month</strong></p>
                    <p className="text-xs text-black/50 mt-1">Pricing varies by plan and volume</p>
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

          {/* Analyze Another URL Button */}
          <div className="text-center">
            <button
              onClick={handleNewAnalysis}
              className="inline-flex items-center gap-2 px-6 py-3 text-navy hover:text-navy/80 font-semibold text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-2 rounded-lg"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
              Analyze Another URL
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
