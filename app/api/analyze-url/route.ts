import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { analyzeURL, getAuthoritativeDomain } from '@/lib/services/url-analyzer'
import { getDataForSEOMetrics } from '@/lib/services/dataforseo-api'
import { calculateEEATScores, identifyIssues, generateSuggestions } from '@/lib/services/eeat-scorer'
import { analyzeContentWithNLP } from '@/lib/services/nlp-analyzer'
import { checkAuthorReputation, type ReputationResult } from '@/lib/services/reputation-checker'

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

    // Perform comprehensive E-E-A-T analysis with DataForSEO
    console.log('Starting E-E-A-T analysis for:', normalizedUrl)

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

    // Fetch DataForSEO metrics using the authoritative domain
    const dataforSEOMetrics = await getDataForSEOMetrics(`https://${authoritativeDomain}`).catch((err) => {
      console.error('DataForSEO API failed:', err.message)
      // Don't fail the entire request if DataForSEO fails - use estimated metrics
      return null
    })

    // Use actual metrics or fallback to estimated ones
    const metricsToUse = dataforSEOMetrics || await getDataForSEOMetrics(`https://${authoritativeDomain}`)

    // Debug logging for DataForSEO metrics
    console.log('DataForSEO Metrics for', normalizedUrl, ':', {
      domainRank: metricsToUse.domainRank,
      organicKeywords: metricsToUse.organicKeywords,
      organicTraffic: metricsToUse.organicTraffic,
      organicTrafficValue: metricsToUse.organicTrafficValue,
    })

    // Perform NLP analysis (optional - graceful fallback if API unavailable)
    const nlpAnalysis = await analyzeContentWithNLP(
      pageAnalysis.contentText,
      pageAnalysis.title,
      pageAnalysis.wordCount
    ).catch((err) => {
      console.error('NLP analysis failed:', err.message)
      return null // Continue without NLP analysis
    })

    // Debug logging for NLP analysis
    if (nlpAnalysis) {
      console.log('NLP Analysis:', {
        overallScore: nlpAnalysis.overallScore,
        toneScore: nlpAnalysis.toneScore,
        experienceScore: nlpAnalysis.experienceScore,
        expertiseDepthScore: nlpAnalysis.expertiseDepthScore,
        aiContentScore: nlpAnalysis.aiContentScore,
        grammarQualityScore: nlpAnalysis.grammarQualityScore,
      })
    }

    // Check author reputation (optional - graceful fallback if API unavailable)
    const authorReputations: ReputationResult[] = []
    if (pageAnalysis.authors.length > 0) {
      // Check reputation for first author (to avoid excessive API usage)
      const firstAuthor = pageAnalysis.authors[0]
      const reputation = await checkAuthorReputation(firstAuthor).catch((err) => {
        console.error('Author reputation check failed:', err.message)
        return null
      })

      if (reputation) {
        authorReputations.push(reputation)
        console.log('Author Reputation:', {
          author: reputation.authorName,
          score: reputation.reputationScore,
          summary: reputation.summary,
        })
      }
    }

    // Calculate E-E-A-T scores (including NLP and reputation analysis if available)
    const scores = calculateEEATScores(pageAnalysis, metricsToUse, nlpAnalysis, authorReputations)

    // Debug logging for scores
    console.log('E-E-A-T Scores:', {
      overall: scores.overall,
      experience: scores.experience,
      expertise: scores.expertise,
      authoritativeness: scores.authoritativeness,
      trustworthiness: scores.trustworthiness,
    })

    // Identify issues and generate suggestions (including NLP and reputation analysis if available)
    const issues = identifyIssues(pageAnalysis, metricsToUse, scores, nlpAnalysis, authorReputations)
    const suggestions = generateSuggestions(pageAnalysis, metricsToUse, scores, nlpAnalysis, authorReputations)

    // Format analysis results for frontend
    const analysis = {
      score: scores.overall,
      breakdown: {
        experience: scores.experience,
        expertise: scores.expertise,
        authoritativeness: scores.authoritativeness,
        trustworthiness: scores.trustworthiness,
      },
      domainInfo: {
        entered: normalizedUrl,
        analyzed: authoritativeDomain,
        redirected: pageAnalysis.finalUrl !== normalizedUrl,
        canonical: pageAnalysis.canonicalUrl,
      },
      issues: issues.map(issue => ({
        type: issue.severity === 'critical' || issue.severity === 'high' ? 'missing' : issue.severity === 'medium' ? 'warning' : 'good',
        severity: issue.severity,
        message: issue.title,
        description: issue.description,
      })),
      suggestions: suggestions.map(s => s.description),
      metrics: {
        domainRank: metricsToUse.domainRank,
        organicKeywords: metricsToUse.organicKeywords,
        organicTraffic: metricsToUse.organicTraffic,
        organicTrafficValue: metricsToUse.organicTrafficValue,
        wordCount: pageAnalysis.wordCount,
        readabilityScore: pageAnalysis.readabilityScore,
      },
    }

    console.log('E-E-A-T analysis complete:', { url, score: scores.overall, cost: '~$0.04-0.06' })

    // If email provided, send detailed report
    if (email) {
      const resend = getResendClient()
      if (resend) {
        try {
          const issuesHtml = analysis.issues.map(issue => {
            const color = issue.severity === 'high' ? '#E8603C' : issue.severity === 'medium' ? '#D4E157' : '#0A1B3F'
            return `
              <div style="margin: 12px 0; padding: 12px; border-left: 4px solid ${color}; background: #f5f5f5;">
                <strong style="color: ${color};">${issue.severity.toUpperCase()}:</strong> ${issue.message}
              </div>
            `
          }).join('')

          const suggestionsHtml = analysis.suggestions.map(s => `
            <li style="margin: 8px 0;">${s}</li>
          `).join('')

          await resend.emails.send({
          from: 'CertREV E-E-A-T Analysis <noreply@mail.certrev.com>',
          to: email,
          subject: `Your E-E-A-T Analysis Results for ${new URL(url).hostname}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #0A1B3F;">Your E-E-A-T Analysis Results</h1>
              <p><strong>Analyzed URL:</strong> <a href="${url}">${url}</a></p>

              <div style="background: #E8E4DB; padding: 20px; border-radius: 12px; margin: 20px 0;">
                <h2 style="color: #0A1B3F; margin-top: 0;">Overall Score: ${analysis.score}/100</h2>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px;">
                  <div>
                    <strong>Experience:</strong> ${analysis.breakdown.experience}/25
                  </div>
                  <div>
                    <strong>Expertise:</strong> ${analysis.breakdown.expertise}/25
                  </div>
                  <div>
                    <strong>Authoritativeness:</strong> ${analysis.breakdown.authoritativeness}/25
                  </div>
                  <div>
                    <strong>Trustworthiness:</strong> ${analysis.breakdown.trustworthiness}/25
                  </div>
                </div>
              </div>

              <h3 style="color: #0A1B3F;">Issues Detected</h3>
              ${issuesHtml}

              <h3 style="color: #0A1B3F; margin-top: 24px;">Recommendations</h3>
              <ul style="line-height: 1.8;">
                ${suggestionsHtml}
              </ul>

              <div style="margin-top: 32px; padding: 20px; background: #0A1B3F; color: white; border-radius: 12px; text-align: center;">
                <p style="margin: 0 0 12px 0;">Ready to improve your E-E-A-T score?</p>
                <a href="https://certrev.com/book-demo" style="display: inline-block; padding: 12px 24px; background: #E8603C; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Book a Demo</a>
              </div>

              <p style="text-align: center; color: #666; font-size: 12px; margin-top: 24px;">
                This is a sample analysis for demonstration purposes. <br>
                Contact us for a comprehensive E-E-A-T audit.
              </p>
            </div>
          `,
          })
        } catch (emailError) {
          console.error('Error sending analysis email:', emailError)
          // Continue even if email fails - don't block the user
        }
      }
    }

    return NextResponse.json({
      success: true,
      analysis,
    })
  } catch (error) {
    console.error('Error analyzing URL:', error)
    return NextResponse.json(
      { error: 'Failed to analyze URL' },
      { status: 500 }
    )
  }
}
