import { describe, it, expect, vi, beforeEach } from 'vitest'
import { analytics, trackEvent } from '@/lib/analytics'
import posthog from 'posthog-js'

vi.mock('posthog-js')

describe('Analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('trackEvent', () => {
    it('should call posthog.capture with event name and properties', () => {
      trackEvent('Test Event', { foo: 'bar' })
      expect(posthog.capture).toHaveBeenCalledWith('Test Event', { foo: 'bar' })
    })

    it('should handle events without properties', () => {
      trackEvent('Test Event')
      expect(posthog.capture).toHaveBeenCalledWith('Test Event', undefined)
    })
  })

  describe('analytics.clickCTA', () => {
    it('should track CTA clicks with location and text', () => {
      analytics.clickCTA('homepage', 'Get Started')
      expect(posthog.capture).toHaveBeenCalledWith('CTA Clicked', {
        location: 'homepage',
        cta_text: 'Get Started',
      })
    })
  })

  describe('analytics.submitForm', () => {
    it('should track successful form submissions', () => {
      analytics.submitForm('contact', true)
      expect(posthog.capture).toHaveBeenCalledWith('Form Submitted', {
        form_name: 'contact',
        success: true,
      })
    })

    it('should track failed form submissions', () => {
      analytics.submitForm('newsletter', false)
      expect(posthog.capture).toHaveBeenCalledWith('Form Submitted', {
        form_name: 'newsletter',
        success: false,
      })
    })
  })

  describe('analytics.eeAtMeter', () => {
    it('should track when E-E-A-T analysis starts', () => {
      analytics.eeAtMeter.started('https://example.com')
      expect(posthog.capture).toHaveBeenCalledWith('E-E-A-T Analysis Started', {
        url: 'https://example.com',
      })
    })

    it('should track when E-E-A-T analysis completes with score', () => {
      analytics.eeAtMeter.completed('https://example.com', 75)
      expect(posthog.capture).toHaveBeenCalledWith('E-E-A-T Analysis Completed', {
        url: 'https://example.com',
        score: 75,
      })
    })

    it('should track when E-E-A-T analysis fails', () => {
      analytics.eeAtMeter.failed('https://example.com', 'Invalid URL')
      expect(posthog.capture).toHaveBeenCalledWith('E-E-A-T Analysis Failed', {
        url: 'https://example.com',
        error: 'Invalid URL',
      })
    })
  })

  describe('analytics.pricing', () => {
    it('should track pricing plan views', () => {
      analytics.pricing.viewPlan('Starter')
      expect(posthog.capture).toHaveBeenCalledWith('Pricing Plan Viewed', {
        plan_name: 'Starter',
      })
    })

    it('should track pricing plan selections', () => {
      analytics.pricing.selectPlan('Pro', 299)
      expect(posthog.capture).toHaveBeenCalledWith('Pricing Plan Selected', {
        plan_name: 'Pro',
        price: 299,
      })
    })
  })

  describe('analytics.subscribeNewsletter', () => {
    it('should track newsletter subscription with email domain for privacy', () => {
      analytics.subscribeNewsletter('user@example.com', true)
      expect(posthog.capture).toHaveBeenCalledWith('Newsletter Subscription', {
        email_domain: 'example.com',
        success: true,
      })
    })
  })

  describe('analytics.clickDashboardLink', () => {
    it('should track brand dashboard signup clicks', () => {
      analytics.clickDashboardLink('brand', 'signup')
      expect(posthog.capture).toHaveBeenCalledWith('Dashboard Link Clicked', {
        dashboard_type: 'brand',
        action: 'signup',
      })
    })

    it('should track expert dashboard login clicks', () => {
      analytics.clickDashboardLink('expert', 'login')
      expect(posthog.capture).toHaveBeenCalledWith('Dashboard Link Clicked', {
        dashboard_type: 'expert',
        action: 'login',
      })
    })
  })

  describe('analytics.contact functions', () => {
    it('should track when contact button is clicked', () => {
      analytics.clickContact('navigation')
      expect(posthog.capture).toHaveBeenCalledWith('Contact Clicked', {
        source: 'navigation',
      })
    })

    it('should track contact form submissions', () => {
      analytics.submitContact(true)
      expect(posthog.capture).toHaveBeenCalledWith('Contact Form Submitted', {
        success: true,
      })
    })
  })
})
