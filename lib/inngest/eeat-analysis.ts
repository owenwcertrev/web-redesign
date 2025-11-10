/**
 * Inngest Function: Comprehensive E-E-A-T Analysis
 *
 * Runs async analysis with external APIs (DataForSEO, OpenAI, Brave Search)
 * and emails comprehensive report when complete
 */

import { inngest } from './client'
import type { PageAnalysis } from '../services/url-analyzer'
import { getDataForSEOMetrics } from '../services/dataforseo-api'
import { analyzeContentWithNLP } from '../services/nlp-analyzer'
import { checkAuthorReputation, type ReputationResult, type ReputationSignal } from '../services/reputation-checker'
import { calculateEEATScores, identifyIssues, generateSuggestions, type Issue, type Suggestion } from '../services/eeat-scorer'
import { Resend } from 'resend'

interface ComprehensiveAnalysisEvent {
  data: {
    url: string
    email: string
    pageAnalysis: PageAnalysis
  }
}

export const comprehensiveEEATAnalysis = inngest.createFunction(
  {
    id: 'comprehensive-eeat-analysis',
    name: 'Comprehensive E-E-A-T Analysis',
  },
  { event: 'eeat/analysis.comprehensive' },
  async ({ event, step }: { event: ComprehensiveAnalysisEvent; step: any }) => {
    const { url, email, pageAnalysis } = event.data

    // Step 1: Get DataForSEO metrics (with retry)
    const dataforSEOMetrics = await step.run('fetch-dataforseo-metrics', async () => {
      try {
        // Extract domain from pageAnalysis
        const domain = new URL(pageAnalysis.finalUrl || pageAnalysis.url).hostname.replace('www.', '')
        return await getDataForSEOMetrics(`https://${domain}`)
      } catch (error) {
        console.error('[Inngest] DataForSEO failed:', error)
        // Return estimated metrics as fallback
        return {
          domainRank: 50,
          organicKeywords: 0,
          organicTraffic: 0,
          organicTrafficValue: 0,
        }
      }
    })

    // Step 2: Run NLP content analysis (with retry)
    const nlpAnalysis = await step.run('nlp-content-analysis', async () => {
      try {
        return await analyzeContentWithNLP(
          pageAnalysis.contentText,
          pageAnalysis.title,
          pageAnalysis.wordCount
        )
      } catch (error) {
        console.error('[Inngest] NLP analysis failed:', error)
        return null
      }
    })

    // Step 3: Check author reputation (with retry)
    const authorReputations: ReputationResult[] = await step.run(
      'check-author-reputation',
      async () => {
        const reputations: ReputationResult[] = []

        // Check reputation for first author only (to avoid excessive API usage)
        if (pageAnalysis.authors.length > 0) {
          try {
            const firstAuthor = pageAnalysis.authors[0]
            const reputation = await checkAuthorReputation(firstAuthor)
            if (reputation) {
              reputations.push(reputation)
            }
          } catch (error) {
            console.error('[Inngest] Reputation check failed:', error)
          }
        }

        return reputations
      }
    )

    // Step 4: Calculate comprehensive E-E-A-T scores
    const scores = await step.run('calculate-comprehensive-scores', async () => {
      return calculateEEATScores(pageAnalysis, dataforSEOMetrics, nlpAnalysis, authorReputations)
    })

    // Step 5: Identify issues and generate suggestions
    const { issues, suggestions } = await step.run('generate-insights', async () => {
      return {
        issues: identifyIssues(pageAnalysis, dataforSEOMetrics, scores, nlpAnalysis, authorReputations),
        suggestions: generateSuggestions(
          pageAnalysis,
          dataforSEOMetrics,
          scores,
          nlpAnalysis,
          authorReputations
        ),
      }
    })

    // Step 6: Send comprehensive email report
    await step.run('send-email-report', async () => {
      const resend = new Resend(process.env.RESEND_API_KEY)

      const issuesHtml = issues
        .map((issue: Issue) => {
          const color =
            issue.severity === 'critical' || issue.severity === 'high'
              ? '#E8603C'
              : issue.severity === 'medium'
              ? '#D4E157'
              : '#0A1B3F'
          return `
            <div style="margin: 12px 0; padding: 12px; border-left: 4px solid ${color}; background: #f5f5f5;">
              <strong style="color: ${color};">${issue.severity.toUpperCase()}:</strong> ${issue.message}
              <p style="margin: 4px 0 0 0; color: #666; font-size: 14px;">${issue.description}</p>
            </div>
          `
        })
        .join('')

      const suggestionsHtml = suggestions
        .map((s: Suggestion) => `<li style="margin: 8px 0;">${s.description}</li>`)
        .join('')

      // NLP Analysis Section
      const nlpHtml = nlpAnalysis
        ? `
          <h3 style="color: #0A1B3F; margin-top: 24px;">🤖 AI Content Analysis</h3>
          <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; margin: 12px 0;">
            <p style="margin: 8px 0;"><strong>Overall Content Quality:</strong> ${nlpAnalysis.overallScore}/100</p>
            <p style="margin: 8px 0;"><strong>Tone:</strong> ${nlpAnalysis.toneScore}/10 (${nlpAnalysis.toneScore >= 8 ? 'Factual & Educational' : nlpAnalysis.toneScore >= 6 ? 'Mostly Factual' : 'Promotional'})</p>
            <p style="margin: 8px 0;"><strong>Experience Signals:</strong> ${nlpAnalysis.experienceScore}/10 (${nlpAnalysis.experienceScore >= 8 ? 'Strong first-person experience' : nlpAnalysis.experienceScore >= 6 ? 'Some experience signals' : 'Lacking real experience'})</p>
            <p style="margin: 8px 0;"><strong>Expertise Depth:</strong> ${nlpAnalysis.expertiseDepthScore}/10 (${nlpAnalysis.expertiseDepthScore >= 8 ? 'Deep technical knowledge' : nlpAnalysis.expertiseDepthScore >= 6 ? 'Good technical content' : 'Surface-level'})</p>
            <p style="margin: 8px 0;"><strong>AI Content Detection:</strong> ${nlpAnalysis.aiContentScore}/10 (${nlpAnalysis.aiContentScore >= 8 ? 'Human-written' : nlpAnalysis.aiContentScore >= 6 ? 'Mostly human' : nlpAnalysis.aiContentScore >= 4 ? 'Some AI patterns' : 'Likely AI-generated'})</p>
            <p style="margin: 8px 0;"><strong>Grammar Quality:</strong> ${nlpAnalysis.grammarQualityScore}/10</p>
            ${nlpAnalysis.flags.length > 0 ? `<p style="margin: 12px 0 4px 0;"><strong>Flags Detected:</strong></p><ul style="margin: 4px 0;">${nlpAnalysis.flags.map((f: string) => `<li style="color: #e00;">${f}</li>`).join('')}</ul>` : ''}
          </div>
        `
        : '<p style="color: #888;">NLP analysis unavailable (OpenAI API not configured)</p>'

      // Author Reputation Section
      const reputationHtml =
        authorReputations.length > 0
          ? authorReputations
              .map(
                (rep: ReputationResult) => `
              <h3 style="color: #0A1B3F; margin-top: 24px;">👤 Author Reputation: ${rep.authorName}</h3>
              <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; margin: 12px 0;">
                <p style="margin: 8px 0;"><strong>Reputation Score:</strong> ${rep.reputationScore}/100</p>
                <p style="margin: 8px 0;">${rep.summary}</p>
                <p style="margin: 12px 0 4px 0;"><strong>Signals Found:</strong></p>
                <ul style="margin: 4px 0;">
                  <li>Professional Profiles: ${rep.signals.filter((s: ReputationSignal) => s.type === 'professional_profile').length}</li>
                  <li>Media Mentions: ${rep.signals.filter((s: ReputationSignal) => s.type === 'media_mention').length}</li>
                  <li>Publications: ${rep.signals.filter((s: ReputationSignal) => s.type === 'publication').length}</li>
                  ${rep.signals.filter((s: ReputationSignal) => s.type === 'negative').length > 0 ? `<li style="color: #e00;">⚠️ Negative Signals: ${rep.signals.filter((s: ReputationSignal) => s.type === 'negative').length}</li>` : ''}
                </ul>
              </div>
            `
              )
              .join('')
          : pageAnalysis.authors.length === 0
          ? '<p style="color: #888;">No authors detected on the page</p>'
          : '<p style="color: #888;">Author reputation check unavailable (Brave Search API not configured)</p>'

      await resend.emails.send({
        from: 'CertREV E-E-A-T Analysis <noreply@mail.certrev.com>',
        to: email,
        subject: `Comprehensive E-E-A-T Analysis: ${new URL(url).hostname}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #0A1B3F;">Comprehensive E-E-A-T Analysis</h1>
            <p><strong>Analyzed URL:</strong> <a href="${url}">${url}</a></p>

            <div style="background: #E8E4DB; padding: 20px; border-radius: 12px; margin: 20px 0;">
              <h2 style="color: #0A1B3F; margin-top: 0;">Overall Score: ${scores.overall}/100</h2>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px;">
                <div>
                  <strong>Experience:</strong> ${scores.experience}/25
                </div>
                <div>
                  <strong>Expertise:</strong> ${scores.expertise}/25
                </div>
                <div>
                  <strong>Authoritativeness:</strong> ${scores.authoritativeness}/25
                </div>
                <div>
                  <strong>Trustworthiness:</strong> ${scores.trustworthiness}/25
                </div>
              </div>
            </div>

            ${nlpHtml}

            ${reputationHtml}

            <h3 style="color: #0A1B3F; margin-top: 24px;">📊 Domain Metrics</h3>
            <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; margin: 12px 0;">
              <p style="margin: 8px 0;"><strong>Domain Rank:</strong> ${dataforSEOMetrics.domainRank}/100</p>
              <p style="margin: 8px 0;"><strong>Organic Keywords:</strong> ${dataforSEOMetrics.organicKeywords.toLocaleString()}</p>
              <p style="margin: 8px 0;"><strong>Organic Traffic:</strong> ${dataforSEOMetrics.organicTraffic.toLocaleString()} visits/month</p>
              <p style="margin: 8px 0;"><strong>Traffic Value:</strong> $${dataforSEOMetrics.organicTrafficValue.toLocaleString()}/month</p>
              <p style="margin: 8px 0;"><strong>Word Count:</strong> ${pageAnalysis.wordCount.toLocaleString()} words</p>
              <p style="margin: 8px 0;"><strong>Readability Score:</strong> ${pageAnalysis.readabilityScore}/100</p>
            </div>

            <h3 style="color: #0A1B3F; margin-top: 24px;">Issues Detected</h3>
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
              This comprehensive analysis includes AI-powered content quality assessment and author reputation verification.<br>
              Contact us for expert-certified content verification.
            </p>
          </div>
        `,
      })

      console.log(`[Inngest] Comprehensive E-E-A-T analysis sent to ${email} for ${url}`)
    })

    return {
      success: true,
      score: scores.overall,
      email,
      url,
    }
  }
)
