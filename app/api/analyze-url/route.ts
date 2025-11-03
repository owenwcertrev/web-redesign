import { NextRequest, NextResponse } from 'next/server'

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

    // If email provided, you could send detailed report here
    // For now, just log it
    if (email) {
      console.log(`Email report requested for: ${email}`)
      // TODO: Integrate with email service (SendGrid, Mailchimp, etc.)
      // await sendEmailReport(email, url, analysis)
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
