import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Human Layer - Why Expert Validation Matters | CertREV',
  description: 'Discover why human expert validation is essential in an AI-powered world. Learn how CertREV\'s credentialed professionals add the human layer of trust, expertise, and accountability that AI cannot replicate.',
  keywords: ['human validation', 'expert vs AI', 'human layer', 'expert credibility', 'AI limitations', 'human expertise'],
  openGraph: {
    title: 'The Human Layer - Why Expert Validation Matters',
    description: 'Human expert validation is essential in an AI-powered world. Discover how credentialed professionals add trust AI cannot replicate.',
    url: 'https://certrev.com/human-layer',
    siteName: 'CertREV',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'The Human Layer - CertREV',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Human Layer - Expert Validation',
    description: 'Why human expert validation matters in an AI-powered world.',
    images: ['/twitter-image.png'],
  },
  alternates: {
    canonical: 'https://certrev.com/human-layer',
  },
}

export default function HumanLayerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
