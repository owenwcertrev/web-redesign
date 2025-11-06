import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us - Get in Touch | CertREV',
  description: 'Contact CertREV for questions about expert content verification, partnership opportunities, or custom solutions. Email owen@certrev.com or use our contact form for a quick response.',
  keywords: ['contact CertREV', 'expert verification contact', 'customer support', 'partnership inquiry', 'content verification support'],
  openGraph: {
    title: 'Contact CertREV - We\'re Here to Help',
    description: 'Questions about expert verification? Get in touch with our team for personalized support.',
    url: 'https://certrev.com/contact',
    siteName: 'CertREV',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Contact CertREV',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact CertREV',
    description: 'Get in touch with our expert verification team.',
    images: ['/twitter-image.png'],
  },
  alternates: {
    canonical: 'https://certrev.com/contact',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
