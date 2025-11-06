import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import SmoothResize from '@/components/SmoothResize'

const dmSans = DM_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://certrev.com'),
  title: {
    default: 'CertREV - Expert Content Verification for Health, Wellness & Professional Services',
    template: '%s | CertREV'
  },
  description: 'Expert fact-checking infrastructure for health, wellness, finance, and professional service brands. Human validation in an AI-powered world.',
  keywords: ['content verification', 'expert fact-checking', 'E-E-A-T', 'health content validation', 'medical content review', 'credentialed experts', 'trust infrastructure'],
  authors: [{ name: 'CertREV' }],
  creator: 'CertREV',
  publisher: 'CertREV',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://certrev.com',
    siteName: 'CertREV',
    title: 'CertREV - Expert Content Verification',
    description: 'Expert fact-checking infrastructure for health, wellness, finance, and professional service brands. Human validation in an AI-powered world.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CertREV - Expert Content Verification',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CertREV - Expert Content Verification',
    description: 'Expert fact-checking infrastructure for health, wellness, finance, and professional service brands.',
    images: ['/og-image.png'],
    creator: '@certrev',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: '#0A1B3F', // Navy color from brand
  alternates: {
    canonical: 'https://certrev.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CertREV',
    url: 'https://certrev.com',
    logo: 'https://certrev.com/logo.png',
    description: 'Expert fact-checking infrastructure for health, wellness, finance, and professional service brands.',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'owen@certrev.com',
      contactType: 'Customer Service',
    },
    sameAs: [
      'https://twitter.com/certrev',
      'https://www.linkedin.com/company/certrev',
    ],
  }

  // WebSite Schema with Search Action
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CertREV',
    url: 'https://certrev.com',
    description: 'Expert content verification for health, wellness & professional services',
    publisher: {
      '@type': 'Organization',
      name: 'CertREV',
    },
  }

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={dmSans.className}>
        <SmoothResize />
        <Navigation />
        <main className="pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
