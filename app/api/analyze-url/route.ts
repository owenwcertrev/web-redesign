import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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

    // Validate URL
    if (!url || !isValidURL(url)) {
      return NextResponse.json(
        { error: 'Invalid URL provided' },
        { status: 400 }
      )
    }

    // For MVP, return mock data
    // Later: integrate with actual analysis tools (Semrush API, custom crawlers)
    const analysis = {
      score: 65,
      breakdown: {
        experience: 18,
        expertise: 12,
        authoritativeness: 20,
        trustworthiness: 15,
      },
      issues: [
        {
          type: 'missing',
          severity: 'high',
          message: '73% of articles lack expert bylines',
        },
        {
          type: 'missing',
          severity: 'high',
          message: 'No structured data for author credentials',
        },
        {
          type: 'warning',
          severity: 'medium',
          message: 'Limited expert reviews on key content',
        },
        {
          type: 'warning',
          severity: 'medium',
          message: 'Low domain authority score (estimate based on backlinks)',
        },
        {
          type: 'good',
          severity: 'low',
          message: 'Strong backlink profile detected',
        },
      ],
      suggestions: [
        'Add expert attribution to your content',
        'Implement author schema markup',
        'Build relationships with credentialed experts',
        'Improve E-E-A-T signals with verification badges',
      ],
    }

    // If email provided, send detailed report
    if (email) {
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
          from: 'CertREV E-E-A-T Analysis <systems@certrev.com>',
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
