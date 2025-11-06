import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book a Demo - See CertREV in Action | CertREV',
  description: 'Schedule a personalized demo of CertREV\'s expert verification platform. Learn how credentialed professionals can validate your content and improve E-E-A-T scores. Free 30-minute consultation available.',
  keywords: ['CertREV demo', 'content verification demo', 'expert review consultation', 'schedule consultation', 'E-E-A-T demo'],
  openGraph: {
    title: 'Book a CertREV Demo - See Expert Verification in Action',
    description: 'Schedule a personalized demo and learn how expert verification can transform your content strategy.',
    url: 'https://certrev.com/book-demo',
    siteName: 'CertREV',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Book a CertREV Demo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book a CertREV Demo',
    description: 'Schedule a personalized demo of expert content verification.',
    images: ['/twitter-image.png'],
  },
  alternates: {
    canonical: 'https://certrev.com/book-demo',
  },
}

export default function BookDemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
