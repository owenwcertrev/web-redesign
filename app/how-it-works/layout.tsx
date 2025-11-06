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
  // HowTo Schema for the expert verification process
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Get Expert Content Verification with CertREV',
    description: 'Simple 3-step process to get your content verified by credentialed experts and improve E-E-A-T scores.',
    image: 'https://certrev.com/og-image.png',
    totalTime: 'P3D',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: '160'
    },
    step: [
      {
        '@type': 'HowToStep',
        name: 'Submit Your Content',
        text: 'Upload articles, blog posts, landing pages, or product descriptions through our simple dashboard interface. Specify the expertise level you need - from certified coaches to board-certified medical doctors.',
        itemListElement: [
          {
            '@type': 'HowToDirection',
            text: 'Log into your CertREV dashboard'
          },
          {
            '@type': 'HowToDirection',
            text: 'Upload your content (blog articles, product descriptions, email campaigns, or social media content)'
          },
          {
            '@type': 'HowToDirection',
            text: 'Select the appropriate expert tier based on your content\'s subject matter'
          }
        ]
      },
      {
        '@type': 'HowToStep',
        name: 'Expert Review Process',
        text: 'Our network of credentialed professionals - nurses, estheticians, nutritionists, doctors, and more - rigorously fact-check your content against current research, industry standards, and regulatory requirements.',
        itemListElement: [
          {
            '@type': 'HowToDirection',
            text: 'Expert verifies factual accuracy against scientific literature'
          },
          {
            '@type': 'HowToDirection',
            text: 'Expert checks source credibility and citations'
          },
          {
            '@type': 'HowToDirection',
            text: 'Expert ensures FTC compliance for product claims'
          },
          {
            '@type': 'HowToDirection',
            text: 'Expert evaluates appropriate expertise level for topic'
          }
        ]
      },
      {
        '@type': 'HowToStep',
        name: 'Receive Certification',
        text: 'Once approved, receive expert-signed validation with visible verification badges, structured data markup, and proper expert attribution that search engines and consumers recognize.',
        itemListElement: [
          {
            '@type': 'HowToDirection',
            text: 'Download verification badges for your content'
          },
          {
            '@type': 'HowToDirection',
            text: 'Get expert signature and credentials'
          },
          {
            '@type': 'HowToDirection',
            text: 'Implement JSON-LD schema markup'
          },
          {
            '@type': 'HowToDirection',
            text: 'Display trust signals on your website to improve E-E-A-T scores'
          }
        ]
      }
    ]
  }

  return (
    <>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      </head>
      {children}
    </>
  )
}
