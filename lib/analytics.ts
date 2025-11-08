import posthog from 'posthog-js'

/**
 * Track custom events with PostHog
 * Safe to call even if PostHog isn't initialized
 */
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && posthog) {
    posthog.capture(eventName, properties)
  }
}

/**
 * Common event tracking functions
 */
export const analytics = {
  // Button clicks
  clickCTA: (location: string, ctaText: string) => {
    trackEvent('CTA Clicked', {
      location,
      cta_text: ctaText,
    })
  },

  // Form submissions
  submitForm: (formName: string, success: boolean) => {
    trackEvent('Form Submitted', {
      form_name: formName,
      success,
    })
  },

  // E-E-A-T Meter specific events
  eeAtMeter: {
    started: (url: string) => {
      trackEvent('E-E-A-T Analysis Started', { url })
    },
    completed: (url: string, score: number) => {
      trackEvent('E-E-A-T Analysis Completed', { url, score })
    },
    failed: (url: string, error: string) => {
      trackEvent('E-E-A-T Analysis Failed', { url, error })
    },
  },

  // Navigation
  clickNavLink: (linkText: string, destination: string) => {
    trackEvent('Nav Link Clicked', {
      link_text: linkText,
      destination,
    })
  },

  // Pricing interactions
  pricing: {
    viewPlan: (planName: string) => {
      trackEvent('Pricing Plan Viewed', { plan_name: planName })
    },
    selectPlan: (planName: string, price: number) => {
      trackEvent('Pricing Plan Selected', { plan_name: planName, price })
    },
  },

  // Newsletter
  subscribeNewsletter: (email: string, success: boolean) => {
    trackEvent('Newsletter Subscription', {
      // Hash email for privacy
      email_domain: email.split('@')[1],
      success,
    })
  },

  // Dashboard links
  clickDashboardLink: (type: 'brand' | 'expert', action: 'signup' | 'login') => {
    trackEvent('Dashboard Link Clicked', {
      dashboard_type: type,
      action,
    })
  },

  // External links
  clickExternalLink: (destination: string, context: string) => {
    trackEvent('External Link Clicked', {
      destination,
      context,
    })
  },

  // Contact
  clickContact: (source: string) => {
    trackEvent('Contact Clicked', { source })
  },

  submitContact: (success: boolean) => {
    trackEvent('Contact Form Submitted', { success })
  },
}
