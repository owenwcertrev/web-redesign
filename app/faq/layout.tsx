import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions | CertREV',
  description: 'Get answers about CertREV\'s expert verification process, pricing, turnaround times, and how we help improve your content\'s E-E-A-T scores. Learn about credential tiers, expert qualifications, and more.',
  keywords: ['CertREV FAQ', 'content verification questions', 'expert review FAQ', 'E-E-A-T questions', 'verification pricing questions'],
  openGraph: {
    title: 'CertREV FAQ - Your Questions Answered',
    description: 'Everything you need to know about expert content verification, pricing, turnaround times, and E-E-A-T improvement.',
    url: 'https://certrev.com/faq',
    siteName: 'CertREV',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CertREV FAQ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CertREV FAQ - Questions Answered',
    description: 'Everything about expert content verification, pricing, and E-E-A-T improvement.',
    images: ['/twitter-image.png'],
  },
  alternates: {
    canonical: 'https://certrev.com/faq',
  },
}

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
