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

      // Helper to format flag text (remove underscores, capitalize)
      const formatFlagText = (flag: string): string => {
        return flag
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')
      }

      const issuesHtml = issues
        .map((issue: Issue) => {
          const color =
            issue.severity === 'critical' || issue.severity === 'high'
              ? '#E8603C' // Coral for critical/high
              : issue.severity === 'medium'
              ? '#A4CF3A' // Lime for medium
              : '#0A1B3F' // Navy for low
          const severityLabel =
            issue.severity === 'critical' ? 'Critical' :
            issue.severity === 'high' ? 'High Priority' :
            issue.severity === 'medium' ? 'Medium Priority' : 'Low Priority'
          return `
            <div style="margin: 12px 0; padding: 16px; border-left: 4px solid ${color}; background: #E8E4DB; border-radius: 8px;">
              <strong style="color: ${color};">${severityLabel}</strong>
              <h4 style="margin: 8px 0 4px 0; color: #0A1B3F;">${issue.title}</h4>
              <p style="margin: 4px 0 0 0; color: #0A1B3F; opacity: 0.8; font-size: 14px; line-height: 1.6;">${issue.description}</p>
            </div>
          `
        })
        .join('')

      const suggestionsHtml = suggestions
        .map((s: Suggestion) => `<li style="margin: 12px 0; color: #0A1B3F; line-height: 1.6;">${s.description}</li>`)
        .join('')

      // NLP Analysis Section
      const nlpHtml = nlpAnalysis
        ? `
          <h3 style="color: #0A1B3F; margin-top: 32px; margin-bottom: 16px; font-size: 20px;">AI Content Analysis</h3>
          <div style="background: #E8E4DB; padding: 20px; border-radius: 12px; margin: 12px 0;">
            <div style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 2px solid #0A1B3F;">
              <p style="margin: 0; font-size: 14px; color: #0A1B3F; opacity: 0.7;">Overall Content Quality</p>
              <p style="margin: 4px 0 0 0; font-size: 28px; font-weight: bold; color: #0A1B3F;">${nlpAnalysis.overallScore}<span style="font-size: 18px; opacity: 0.6;">/100</span></p>
            </div>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #0A1B3F; opacity: 0.9;"><strong>Tone Quality</strong></td>
                <td style="padding: 8px 0; text-align: right; color: #0A1B3F;">${nlpAnalysis.toneScore}/10</td>
                <td style="padding: 8px 0 8px 12px; color: #0A1B3F; opacity: 0.7; font-size: 14px;">${nlpAnalysis.toneScore >= 8 ? 'Factual & Educational' : nlpAnalysis.toneScore >= 6 ? 'Mostly Factual' : 'Promotional'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #0A1B3F; opacity: 0.9;"><strong>Experience Signals</strong></td>
                <td style="padding: 8px 0; text-align: right; color: #0A1B3F;">${nlpAnalysis.experienceScore}/10</td>
                <td style="padding: 8px 0 8px 12px; color: #0A1B3F; opacity: 0.7; font-size: 14px;">${nlpAnalysis.experienceScore >= 8 ? 'Strong Personal Experience' : nlpAnalysis.experienceScore >= 6 ? 'Some Experience' : 'Generic Content'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #0A1B3F; opacity: 0.9;"><strong>Expertise Depth</strong></td>
                <td style="padding: 8px 0; text-align: right; color: #0A1B3F;">${nlpAnalysis.expertiseDepthScore}/10</td>
                <td style="padding: 8px 0 8px 12px; color: #0A1B3F; opacity: 0.7; font-size: 14px;">${nlpAnalysis.expertiseDepthScore >= 8 ? 'Deep Technical Knowledge' : nlpAnalysis.expertiseDepthScore >= 6 ? 'Good Technical Content' : 'Surface-Level'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #0A1B3F; opacity: 0.9;"><strong>Human vs AI</strong></td>
                <td style="padding: 8px 0; text-align: right; color: #0A1B3F;">${nlpAnalysis.aiContentScore}/10</td>
                <td style="padding: 8px 0 8px 12px; color: #0A1B3F; opacity: 0.7; font-size: 14px;">${nlpAnalysis.aiContentScore >= 8 ? 'Human-Written' : nlpAnalysis.aiContentScore >= 6 ? 'Mostly Human' : nlpAnalysis.aiContentScore >= 4 ? 'Some AI Patterns' : 'Likely AI-Generated'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #0A1B3F; opacity: 0.9;"><strong>Grammar Quality</strong></td>
                <td style="padding: 8px 0; text-align: right; color: #0A1B3F;">${nlpAnalysis.grammarQualityScore}/10</td>
                <td style="padding: 8px 0 8px 12px; color: #0A1B3F; opacity: 0.7; font-size: 14px;">${nlpAnalysis.grammarQualityScore >= 8 ? 'Excellent' : nlpAnalysis.grammarQualityScore >= 6 ? 'Good' : 'Needs Improvement'}</td>
              </tr>
            </table>
            ${nlpAnalysis.flags.length > 0 ? `
              <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #0A1B3F; opacity: 0.3;">
                <p style="margin: 0 0 8px 0; font-weight: bold; color: #E8603C; font-size: 14px;">Content Flags</p>
                <ul style="margin: 0; padding-left: 20px;">
                  ${nlpAnalysis.flags.map((f: string) => `<li style="color: #E8603C; margin: 4px 0; font-size: 14px;">${formatFlagText(f)}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
        `
        : '<p style="color: #0A1B3F; opacity: 0.6;">NLP analysis unavailable (OpenAI API not configured)</p>'

      // Author Reputation Section
      const reputationHtml =
        authorReputations.length > 0
          ? authorReputations
              .map(
                (rep: ReputationResult) => `
              <h3 style="color: #0A1B3F; margin-top: 32px; margin-bottom: 16px; font-size: 20px;">Author Reputation: ${rep.authorName}</h3>
              <div style="background: #E8E4DB; padding: 20px; border-radius: 12px; margin: 12px 0;">
                <div style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 2px solid #0A1B3F;">
                  <p style="margin: 0; font-size: 14px; color: #0A1B3F; opacity: 0.7;">Reputation Score</p>
                  <p style="margin: 4px 0 0 0; font-size: 28px; font-weight: bold; color: #0A1B3F;">${rep.reputationScore}<span style="font-size: 18px; opacity: 0.6;">/100</span></p>
                </div>
                <p style="margin: 0 0 16px 0; color: #0A1B3F; line-height: 1.6;">${rep.summary}</p>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #0A1B3F; opacity: 0.9;"><strong>Professional Profiles</strong></td>
                    <td style="padding: 8px 0; text-align: right; color: #0A1B3F; font-weight: bold;">${rep.signals.filter((s: ReputationSignal) => s.type === 'professional_profile').length}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #0A1B3F; opacity: 0.9;"><strong>Media Mentions</strong></td>
                    <td style="padding: 8px 0; text-align: right; color: #0A1B3F; font-weight: bold;">${rep.signals.filter((s: ReputationSignal) => s.type === 'media_mention').length}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #0A1B3F; opacity: 0.9;"><strong>Publications</strong></td>
                    <td style="padding: 8px 0; text-align: right; color: #0A1B3F; font-weight: bold;">${rep.signals.filter((s: ReputationSignal) => s.type === 'publication').length}</td>
                  </tr>
                  ${rep.signals.filter((s: ReputationSignal) => s.type === 'negative').length > 0 ? `
                  <tr>
                    <td style="padding: 8px 0; color: #E8603C; opacity: 0.9;"><strong>Negative Signals</strong></td>
                    <td style="padding: 8px 0; text-align: right; color: #E8603C; font-weight: bold;">${rep.signals.filter((s: ReputationSignal) => s.type === 'negative').length}</td>
                  </tr>
                  ` : ''}
                </table>
              </div>
            `
              )
              .join('')
          : pageAnalysis.authors.length === 0
          ? '<p style="color: #0A1B3F; opacity: 0.6;">No authors detected on the page</p>'
          : '<p style="color: #0A1B3F; opacity: 0.6;">Author reputation check unavailable (Brave Search API not configured)</p>'

      await resend.emails.send({
        from: 'CertREV E-E-A-T Analysis <noreply@mail.certrev.com>',
        to: email,
        subject: `Comprehensive E-E-A-T Analysis: ${new URL(url).hostname}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;">

            <!-- Header -->
            <div style="text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #E8E4DB;">
              <h1 style="color: #0A1B3F; margin: 0 0 8px 0; font-size: 28px;">Comprehensive E-E-A-T Analysis</h1>
              <p style="margin: 0; color: #0A1B3F; opacity: 0.7; font-size: 14px;">Powered by CertREV</p>
            </div>

            <!-- Analyzed URL -->
            <p style="margin: 0 0 24px 0; color: #0A1B3F; opacity: 0.8;"><strong style="color: #0A1B3F;">Analyzed URL:</strong> <a href="${url}" style="color: #E8603C; text-decoration: none;">${url}</a></p>

            <!-- Overall Score -->
            <div style="background: linear-gradient(135deg, #E8E4DB 0%, #F5F3EF 100%); padding: 24px; border-radius: 12px; margin: 0 0 32px 0; border: 2px solid #0A1B3F;">
              <p style="margin: 0 0 4px 0; font-size: 14px; color: #0A1B3F; opacity: 0.7; text-align: center;">Overall E-E-A-T Score</p>
              <p style="margin: 0 0 20px 0; font-size: 48px; font-weight: bold; color: #0A1B3F; text-align: center; line-height: 1;">${scores.overall}<span style="font-size: 24px; opacity: 0.6;">/100</span></p>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 12px; background: #ffffff; border-radius: 8px; margin: 4px;">
                    <p style="margin: 0; font-size: 12px; color: #0A1B3F; opacity: 0.7;">Experience</p>
                    <p style="margin: 4px 0 0 0; font-size: 24px; font-weight: bold; color: #0A1B3F;">${scores.experience}<span style="font-size: 14px; opacity: 0.6;">/25</span></p>
                  </td>
                  <td style="width: 12px;"></td>
                  <td style="padding: 10px 12px; background: #ffffff; border-radius: 8px;">
                    <p style="margin: 0; font-size: 12px; color: #0A1B3F; opacity: 0.7;">Expertise</p>
                    <p style="margin: 4px 0 0 0; font-size: 24px; font-weight: bold; color: #0A1B3F;">${scores.expertise}<span style="font-size: 14px; opacity: 0.6;">/25</span></p>
                  </td>
                </tr>
                <tr style="height: 12px;"></tr>
                <tr>
                  <td style="padding: 10px 12px; background: #ffffff; border-radius: 8px;">
                    <p style="margin: 0; font-size: 12px; color: #0A1B3F; opacity: 0.7;">Authoritativeness</p>
                    <p style="margin: 4px 0 0 0; font-size: 24px; font-weight: bold; color: #0A1B3F;">${scores.authoritativeness}<span style="font-size: 14px; opacity: 0.6;">/25</span></p>
                  </td>
                  <td style="width: 12px;"></td>
                  <td style="padding: 10px 12px; background: #ffffff; border-radius: 8px;">
                    <p style="margin: 0; font-size: 12px; color: #0A1B3F; opacity: 0.7;">Trustworthiness</p>
                    <p style="margin: 4px 0 0 0; font-size: 24px; font-weight: bold; color: #0A1B3F;">${scores.trustworthiness}<span style="font-size: 14px; opacity: 0.6;">/25</span></p>
                  </td>
                </tr>
              </table>
            </div>

            ${nlpHtml}

            ${reputationHtml}

            <!-- Domain Metrics -->
            <h3 style="color: #0A1B3F; margin: 32px 0 16px 0; font-size: 20px;">Domain Performance Metrics</h3>
            <div style="background: #E8E4DB; padding: 20px; border-radius: 12px; margin: 0 0 32px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #0A1B3F; opacity: 0.9;"><strong>Domain Rank</strong></td>
                  <td style="padding: 8px 0; text-align: right; color: #0A1B3F; font-weight: bold;">${dataforSEOMetrics.domainRank}/100</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #0A1B3F; opacity: 0.9;"><strong>Organic Keywords</strong></td>
                  <td style="padding: 8px 0; text-align: right; color: #0A1B3F; font-weight: bold;">${dataforSEOMetrics.organicKeywords.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #0A1B3F; opacity: 0.9;"><strong>Organic Traffic</strong></td>
                  <td style="padding: 8px 0; text-align: right; color: #0A1B3F; font-weight: bold;">${dataforSEOMetrics.organicTraffic.toLocaleString()} visits/mo</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #0A1B3F; opacity: 0.9;"><strong>Traffic Value</strong></td>
                  <td style="padding: 8px 0; text-align: right; color: #0A1B3F; font-weight: bold;">$${dataforSEOMetrics.organicTrafficValue.toLocaleString()}/mo</td>
                </tr>
                <tr style="border-top: 1px solid #0A1B3F; opacity: 0.2;"><td style="padding: 4px 0;"></td></tr>
                <tr>
                  <td style="padding: 8px 0; color: #0A1B3F; opacity: 0.9;"><strong>Word Count</strong></td>
                  <td style="padding: 8px 0; text-align: right; color: #0A1B3F; font-weight: bold;">${pageAnalysis.wordCount.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #0A1B3F; opacity: 0.9;"><strong>Readability Score</strong></td>
                  <td style="padding: 8px 0; text-align: right; color: #0A1B3F; font-weight: bold;">${pageAnalysis.readabilityScore}/100</td>
                </tr>
              </table>
            </div>

            <!-- Issues -->
            <h3 style="color: #0A1B3F; margin: 32px 0 16px 0; font-size: 20px;">Areas for Improvement</h3>
            ${issuesHtml || '<p style="color: #A4CF3A; font-weight: bold;">No major issues detected</p>'}

            <!-- Recommendations -->
            <h3 style="color: #0A1B3F; margin: 32px 0 16px 0; font-size: 20px;">Recommendations</h3>
            <ul style="line-height: 1.8; padding-left: 20px; margin: 0 0 32px 0;">
              ${suggestionsHtml}
            </ul>

            <!-- CTA -->
            <div style="margin: 40px 0 32px 0; padding: 32px 24px; background: #0A1B3F; border-radius: 12px; text-align: center;">
              <p style="margin: 0 0 16px 0; color: #E8E4DB; font-size: 18px; font-weight: bold;">Ready to improve your E-E-A-T score?</p>
              <p style="margin: 0 0 20px 0; color: #E8E4DB; opacity: 0.8; font-size: 14px;">Get expert-certified content verification from credentialed professionals</p>
              <a href="https://certrev.com/pricing" style="display: inline-block; padding: 14px 32px; background: #E8603C; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">View Pricing</a>
            </div>

            <!-- Footer -->
            <div style="text-align: center; padding-top: 24px; border-top: 1px solid #E8E4DB;">
              <p style="margin: 0 0 8px 0; color: #0A1B3F; opacity: 0.6; font-size: 12px;">
                This comprehensive analysis includes AI-powered content quality assessment and author reputation verification.
              </p>
              <p style="margin: 0; color: #0A1B3F; opacity: 0.6; font-size: 12px;">
                <a href="https://certrev.com/contact" style="color: #E8603C; text-decoration: none;">Contact us</a> for expert-certified content verification.
              </p>
            </div>
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
