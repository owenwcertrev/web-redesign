import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing - Flexible Expert Verification Plans | CertREV',
  description: 'Expert verification pricing from $199/mo. Pay-as-you-go or subscription plans. 90-day credit rollover, all credential tiers. No contracts.',
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
    images: ['/og-image.png'],
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
  // Service schema for CertREV's expert verification service
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'CertREV Expert Content Verification',
    description: 'Professional content verification service with credentialed experts. Improve E-E-A-T scores with expert-reviewed content.',
    provider: {
      '@type': 'Organization',
      name: 'CertREV',
      url: 'https://certrev.com'
    },
    areaServed: {
      '@type': 'Country',
      name: 'United States'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Expert Verification Plans',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Mini Plan',
            description: 'Perfect for occasional updates and content refreshes'
          },
          price: '480',
          priceCurrency: 'USD',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: '480',
            priceCurrency: 'USD',
            billingIncrement: 1,
            unitCode: 'MON'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Starter Plan',
            description: 'Build a steady content presence with weekly expert reviews'
          },
          price: '1120',
          priceCurrency: 'USD',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: '1120',
            priceCurrency: 'USD',
            billingIncrement: 1,
            unitCode: 'MON'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Core SEO Plan',
            description: 'The growth baseline for serious content marketing teams'
          },
          price: '2133',
          priceCurrency: 'USD',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: '2133',
            priceCurrency: 'USD',
            billingIncrement: 1,
            unitCode: 'MON'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Accelerate Plan',
            description: 'Fast-track your authority with high-volume expert validation'
          },
          price: '3773',
          priceCurrency: 'USD',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: '3773',
            priceCurrency: 'USD',
            billingIncrement: 1,
            unitCode: 'MON'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Authority Builder Plan',
            description: 'Establish market leadership with premium expert access'
          },
          price: '5700',
          priceCurrency: 'USD',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: '5700',
            priceCurrency: 'USD',
            billingIncrement: 1,
            unitCode: 'MON'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Enterprise Plan',
            description: 'High-velocity publishing with maximum flexibility'
          },
          price: '9675',
          priceCurrency: 'USD',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: '9675',
            priceCurrency: 'USD',
            billingIncrement: 1,
            unitCode: 'MON'
          }
        }
      ]
    }
  }

  return (
    <>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
      </head>
      {children}
    </>
  )
}
