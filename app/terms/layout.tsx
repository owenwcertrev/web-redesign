import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | CertREV',
  description: 'CertREV terms of service and user agreement. Review the terms and conditions for using our expert content verification platform.',
  keywords: ['terms of service', 'user agreement', 'CertREV terms', 'service conditions', 'legal terms'],
  openGraph: {
    title: 'Terms of Service - CertREV',
    description: 'Terms and conditions for using CertREV\'s expert verification platform.',
    url: 'https://certrev.com/terms',
    siteName: 'CertREV',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CertREV Terms of Service',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service - CertREV',
    description: 'Terms and conditions for using our platform.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://certrev.com/terms',
  },
  robots: {
    index: false, // Terms pages typically shouldn't be indexed
    follow: true,
  },
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
