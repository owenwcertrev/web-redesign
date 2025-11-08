'use client'

import { useState, FormEvent } from 'react'
import Button from './Button'
import { Mail } from 'lucide-react'
import { analytics } from '@/lib/analytics'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) throw new Error('Failed to subscribe')

      setSuccess(true)
      setEmail('')

      // Track successful newsletter subscription
      analytics.subscribeNewsletter(email, true)
    } catch (err) {
      setError('Something went wrong. Please try again.')

      // Track failed newsletter subscription
      analytics.subscribeNewsletter(email, false)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-lime-light rounded-16 p-6 text-center">
        <p className="text-lime-dark font-medium">
          Thanks for subscribing! Check your email for confirmation.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full pl-10 pr-4 py-3 rounded-full border-2 border-black/10 focus:border-navy focus:outline-none transition-colors"
          />
        </div>
        <Button type="submit" loading={loading}>
          Subscribe
        </Button>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      <p className="mt-2 text-xs text-black/60 text-center">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </form>
  )
}
