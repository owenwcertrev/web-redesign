import { Metadata } from 'next'
import { notFound } from 'next/navigation'

// Dynamic metadata based on feature flag
export async function generateMetadata(): Promise<Metadata> {
  const isEnabled = process.env.EEAT_METER_ENABLED === 'true'

  return {
    title: 'E-E-A-T Meter - Free Content Analysis Tool | CertREV',
    description: 'Free tool to analyze your content\'s E-E-A-T score. Get instant expert recommendations and boost your Google rankings with credibility insights.',
    keywords: ['E-E-A-T analyzer', 'content quality tool', 'EEAT score', 'Google quality guidelines', 'content credibility checker', 'expertise analysis'],
    // Block search engines when disabled
    robots: isEnabled ? undefined : {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
      noimageindex: true,
    },
    openGraph: {
      title: 'E-E-A-T Meter - Analyze Your Content Quality',
      description: 'Free tool to analyze your content\'s E-E-A-T score. Get actionable insights to improve expertise, authoritativeness, and trustworthiness.',
      url: 'https://certrev.com/eeat-meter',
      siteName: 'CertREV',
      type: 'website',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'CertREV E-E-A-T Meter Tool',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'E-E-A-T Meter - Free Content Analysis',
      description: 'Analyze your content\'s E-E-A-T score for free. Improve expertise, authoritativeness, and trust.',
      images: ['/og-image.png'],
    },
    alternates: {
      canonical: 'https://certrev.com/eeat-meter',
    },
  }
}

export default function EEATMeterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if E-E-A-T meter is enabled
  const isEnabled = process.env.EEAT_METER_ENABLED === 'true'

  // Return 404 if disabled
  if (!isEnabled) {
    notFound()
  }

  return <>{children}</>
}
