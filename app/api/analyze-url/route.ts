import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { analyzeURL, getAuthoritativeDomain } from '@/lib/services/url-analyzer'
import { getDataForSEOMetrics } from '@/lib/services/dataforseo-api'
import { calculateEEATScores, calculateInstantEEATScores, identifyIssues, generateSuggestions } from '@/lib/services/eeat-scorer'
import { analyzeContentWithNLP } from '@/lib/services/nlp-analyzer'
import { checkAuthorReputation, type ReputationResult } from '@/lib/services/reputation-checker'
import { inngest } from '@/lib/inngest/client'

// Force Node.js runtime for Buffer support and external API calls
export const runtime = 'nodejs'

// Lazy initialize Resend to avoid build-time errors
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('RESEND_API_KEY not configured - emails will not be sent')
    return null
  }
  return new Resend(apiKey)
}

function isValidURL(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url, email } = await request.json()

    // Validate URL format
    if (!url || typeof url !== 'string' || url.trim() === '') {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Normalize URL before validation
    let normalizedUrl = url.trim()
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl
    }

    // Validate URL structure
    if (!isValidURL(normalizedUrl)) {
      return NextResponse.json(
        { error: 'Invalid URL format. Please enter a valid domain (e.g., example.com)' },
        { status: 400 }
      )
    }

    // Perform instant E-E-A-T analysis (no external APIs)
    console.log('Starting instant E-E-A-T analysis for:', normalizedUrl)

    // First, analyze the page to get redirects and canonical URL
    const pageAnalysis = await analyzeURL(normalizedUrl).catch((err) => {
      console.error('Page analysis failed:', err.message)

      // Provide user-friendly error messages
      if (err.message.includes('Failed to fetch')) {
        if (err.message.includes('404')) {
          throw new Error('We couldn\'t find that page. Please check the URL and try again.')
        } else if (err.message.includes('403') || err.message.includes('401')) {
          throw new Error('This website is blocking automated access. Please try a different URL.')
        } else if (err.message.includes('500') || err.message.includes('502') || err.message.includes('503')) {
          throw new Error('The website is experiencing technical issues. Please try again later.')
        } else if (err.message.includes('timeout') || err.message.includes('ECONNREFUSED')) {
          throw new Error('Unable to connect to this website. Please verify the URL is correct and try again.')
        }
      }

      // Generic fallback
      throw new Error('We couldn\'t analyze this URL. Please verify it\'s a valid, publicly accessible website.')
    })

    // Get the authoritative domain (canonical > finalUrl > original)
    const authoritativeDomain = getAuthoritativeDomain(pageAnalysis)
    console.log('Domain resolution:', {
      entered: normalizedUrl,
      finalUrl: pageAnalysis.finalUrl,
      canonical: pageAnalysis.canonicalUrl,
      authoritative: authoritativeDomain,
    })

    // Calculate instant E-E-A-T scores (no external APIs - fast)
    const instantScores = calculateInstantEEATScores(pageAnalysis)

    // Generate instant issues and suggestions (without LLM enhancements)
    const estimatedMetrics = {
      domainRank: 50,
      organicKeywords: 0,
      organicTraffic: 0,
      organicTrafficValue: 0,
    }
    const instantIssues = identifyIssues(pageAnalysis, estimatedMetrics, instantScores, null, [])
    const instantSuggestions = generateSuggestions(pageAnalysis, estimatedMetrics, instantScores, null, [])

    // Format instant analysis results
    const instantAnalysis = {
      score: instantScores.overall,
      breakdown: {
        experience: instantScores.experience,
        expertise: instantScores.expertise,
        authoritativeness: instantScores.authoritativeness,
        trustworthiness: instantScores.trustworthiness,
      },
      domainInfo: {
        entered: normalizedUrl,
        analyzed: authoritativeDomain,
        redirected: pageAnalysis.finalUrl !== normalizedUrl,
        canonical: pageAnalysis.canonicalUrl,
      },
      issues: instantIssues.map(issue => ({
        type: issue.severity === 'critical' || issue.severity === 'high' ? 'missing' : issue.severity === 'medium' ? 'warning' : 'good',
        severity: issue.severity,
        message: issue.title,
        description: issue.description,
      })),
      suggestions: instantSuggestions.map(s => s.description),
      metrics: {
        wordCount: pageAnalysis.wordCount,
        readabilityScore: pageAnalysis.readabilityScore,
        citations: pageAnalysis.citations,
        authors: pageAnalysis.authors.length,
        schemaMarkup: pageAnalysis.schemaMarkup.length,
        hasSSL: pageAnalysis.hasSSL,
      },
    }

    console.log('Instant E-E-A-T analysis complete:', { url, score: instantScores.overall })

    // If email provided, trigger comprehensive analysis via Inngest
    if (email) {
      try {
        await inngest.send({
          name: 'eeat/analysis.comprehensive',
          data: {
            url: normalizedUrl,
            email,
            pageAnalysis,
          },
        })

        console.log('Triggered comprehensive E-E-A-T analysis for:', email)

        return NextResponse.json({
          success: true,
          instant: instantAnalysis,
          comprehensive: {
            status: 'processing',
            estimatedTime: '2-4 minutes',
            message: 'Comprehensive analysis with AI-powered insights will be emailed to you shortly',
            features: [
              'Domain authority metrics (traffic, keywords, rank)',
              'AI content quality analysis (tone, experience, AI detection)',
              'Author reputation verification (profiles, publications, media)',
              'Enhanced E-E-A-T score with all intelligence layers',
              'Detailed actionable recommendations'
            ]
          },
        })
      } catch (inngestError) {
        console.error('Failed to trigger comprehensive analysis:', inngestError)
        // Fall through to return instant analysis only
      }
    }

    // No email provided - return instant analysis with upgrade prompt
    return NextResponse.json({
      success: true,
      instant: instantAnalysis,
      comprehensive: {
        status: 'not_requested',
        message: 'Want deeper insights? Provide your email for comprehensive AI-powered analysis',
        features: [
          'Domain authority metrics from DataForSEO',
          'AI content quality analysis via OpenAI GPT-4',
          'Author reputation verification via web search',
          'Enhanced E-E-A-T score (+8-21 potential points)',
          'Detect AI-generated content and promotional tone',
          'Verify author credentials and professional presence'
        ]
      },
    })
  } catch (error) {
    console.error('Error analyzing URL:', error)
    return NextResponse.json(
      { error: 'Failed to analyze URL' },
      { status: 500 }
    )
  }
}
