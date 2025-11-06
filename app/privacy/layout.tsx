import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | CertREV',
  description: 'CertREV privacy policy. Learn how we collect, use, and protect your personal information. SOC-2 compliant platform committed to data security and user privacy.',
  keywords: ['privacy policy', 'data protection', 'CertREV privacy', 'user data security', 'SOC-2 compliance'],
  openGraph: {
    title: 'Privacy Policy - CertREV',
    description: 'How CertREV collects, uses, and protects your personal information.',
    url: 'https://certrev.com/privacy',
    siteName: 'CertREV',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CertREV Privacy Policy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy - CertREV',
    description: 'How we protect your personal information.',
    images: ['/twitter-image.png'],
  },
  alternates: {
    canonical: 'https://certrev.com/privacy',
  },
  robots: {
    index: false, // Privacy pages typically shouldn't be indexed
    follow: true,
  },
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
