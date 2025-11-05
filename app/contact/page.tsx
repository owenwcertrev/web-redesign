'use client'

import { Metadata } from 'next'
import { useState, FormEvent } from 'react'
import Button from '@/components/Button'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/contact-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to send message')

      setSuccess(true)
      setFormData({ name: '', email: '', company: '', message: '' })
    } catch (err) {
      setError('Something went wrong. Please try again or email us directly.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-cream py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-semibold mb-6 text-charcoal leading-tight">
            Get in Touch
          </h1>
          <p className="text-xl text-charcoal/80 max-w-2xl mx-auto">
            Have questions about CertREV? We're here to help you build trust infrastructure for your brand.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-charcoal">
                Send Us a Message
              </h2>

              {success ? (
                <div className="bg-lime-light rounded-16 p-6 border-2 border-lime">
                  <h3 className="font-semibold text-lime-dark mb-2">Message Sent!</h3>
                  <p className="text-lime-dark/80">
                    Thank you for reaching out. We'll get back to you within 1 business day.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-charcoal mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-16 border-2 border-black/10 focus:border-navy focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-16 border-2 border-black/10 focus:border-navy focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-charcoal mb-2">
                      Company (optional)
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-16 border-2 border-black/10 focus:border-navy focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-charcoal mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 rounded-16 border-2 border-black/10 focus:border-navy focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-12 text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  <Button type="submit" loading={loading} size="lg" className="w-full">
                    {loading ? 'Sending...' : 'Send Message'}
                    {!loading && <Send className="w-5 h-5" />}
                  </Button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-charcoal">
                Contact Information
              </h2>

              <div className="space-y-6">
                <div className="bg-cream rounded-16 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-navy/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-navy" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-charcoal">Email</h3>
                      <a
                        href="mailto:owen@certrev.com"
                        className="text-navy hover:underline"
                      >
                        owen@certrev.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-cream rounded-16 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-navy/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-navy" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-charcoal">Phone</h3>
                      <a
                        href="tel:213-304-9637"
                        className="text-navy hover:underline"
                      >
                        213-304-9637
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-cream rounded-16 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-navy/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-navy" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-charcoal">Address</h3>
                      <address className="not-italic text-charcoal/70">
                        500 Westover Dr. #33166<br />
                        Sanford, NC 27330
                      </address>
                    </div>
                  </div>
                </div>

                <div className="bg-lime-light rounded-16 p-6 border-2 border-lime/30">
                  <h3 className="font-semibold mb-2 text-lime-dark">Response Time</h3>
                  <p className="text-sm text-lime-dark/80">
                    We typically respond to inquiries within 1 business day. For urgent matters, please call us directly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
