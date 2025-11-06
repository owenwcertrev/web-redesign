import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing - Flexible Expert Verification Plans | CertREV',
  description: 'Transparent pricing for expert content verification. Pay-as-you-go or subscription plans starting at $199/month. 90-day credit rollover, access to all credential tiers. No long-term contracts required.',
  keywords: ['content verification pricing', 'expert review cost', 'fact-checking subscription', 'E-E-A-T pricing', 'verification plans'],
  openGraph: {
    title: 'CertREV Pricing - Flexible Expert Verification Plans',
    description: 'Transparent pricing starting at $199/month. Pay-as-you-go or subscription plans. 90-day credit rollover, all credential tiers included.',
    url: 'https://certrev.com/pricing',
    siteName: 'CertREV',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CertREV Pricing Plans',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CertREV Pricing - Flexible Plans',
    description: 'Transparent pricing starting at $199/month. No long-term contracts.',
    images: ['/twitter-image.png'],
  },
  alternates: {
    canonical: 'https://certrev.com/pricing',
  },
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
