import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'E-E-A-T Meter - Free Content Analysis Tool | CertREV',
  description: 'Analyze your content\'s Experience, Expertise, Authoritativeness, and Trustworthiness (E-E-A-T) score. Free tool to evaluate content quality and identify improvement opportunities for better Google rankings.',
  keywords: ['E-E-A-T analyzer', 'content quality tool', 'EEAT score', 'Google quality guidelines', 'content credibility checker', 'expertise analysis'],
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
    images: ['/twitter-image.png'],
  },
  alternates: {
    canonical: 'https://certrev.com/eeat-meter',
  },
}

export default function EEATMeterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
