/**
 * Feature Flags Configuration
 *
 * Toggle sections on/off across the site by changing these boolean values.
 * Set to `true` to show a section, `false` to hide it.
 */

export const featureFlags = {
  // Homepage sections
  homepage: {
    heroSection: true,
    statsSection: true,
    processSection: true,
    whyExpertValidation: true,
    trustInfrastructure: true,
    pricingTiers: true,
    expertNetwork: false, // Set to true when you have experts to showcase
    humanLayer: true,
    testimonials: false, // Replaced with early access CTA
    ctaSection: true,
  },

  // Other pages
  humanLayer: {
    enabled: true,
  },

  howItWorks: {
    enabled: true,
  },

  forExperts: {
    enabled: true,
  },

  eeatMeter: {
    enabled: true,
  },
}

/**
 * Helper function to check if a feature is enabled
 */
export function isFeatureEnabled(feature: string): boolean {
  const keys = feature.split('.')
  let current: unknown = featureFlags

  for (const key of keys) {
    if (typeof current !== 'object' || current === null || !(key in current)) {
      console.warn(`Feature flag not found: ${feature}`)
      return false
    }
    current = (current as Record<string, unknown>)[key]
  }

  return current === true
}
