import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How CertREV Works - Expert Content Verification Process',
  description: 'Discover how CertREV connects your content with credentialed experts for fact-checking and validation. Simple 3-step process: Submit, Review, Verify. Boost E-E-A-T scores with expert-verified content.',
  keywords: ['content verification process', 'expert review workflow', 'fact-checking service', 'E-E-A-T improvement', 'content credibility'],
  openGraph: {
    title: 'How CertREV Works - Expert Content Verification Process',
    description: 'Simple 3-step expert verification: Submit content, expert review, get verified. Boost your E-E-A-T scores with credentialed professionals.',
    url: 'https://certrev.com/how-it-works',
    siteName: 'CertREV',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'How CertREV Works',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How CertREV Works - Expert Content Verification',
    description: 'Simple 3-step expert verification: Submit content, expert review, get verified.',
    images: ['/twitter-image.png'],
  },
  alternates: {
    canonical: 'https://certrev.com/how-it-works',
  },
}

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
