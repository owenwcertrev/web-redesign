'use client'

import { useState, FormEvent } from 'react'
import Button from '@/components/Button'
import { Calendar, Clock, Users, Send } from 'lucide-react'

export default function BookDemoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    preferredDate: '',
    preferredTime: '',
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
        body: JSON.stringify({ ...formData, subject: 'Demo Request' }),
      })

      if (!response.ok) throw new Error('Failed to send request')

      setSuccess(true)
      setFormData({ name: '', email: '', company: '', role: '', preferredDate: '', preferredTime: '', message: '' })
    } catch (err) {
      setError('Something went wrong. Please try again or contact us directly.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-cream py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-4 px-6 py-2 bg-navy/10 rounded-full">
            <span className="text-sm font-semibold text-navy tracking-wide">MEET THE FOUNDERS</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold mb-6 text-charcoal leading-tight">
            Schedule a Demo with Our Team
          </h1>
          <p className="text-xl text-charcoal/80 max-w-2xl mx-auto">
            Book a personalized 30-minute session with CertREV's founders to see how expert verification can transform your content strategy
          </p>
        </div>
      </section>

      {/* Demo Form & Info */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Demo Form */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-charcoal">
                Schedule Your Demo
              </h2>

              {success ? (
                <div className="bg-lime-light rounded-16 p-6 border-2 border-lime">
                  <h3 className="font-semibold text-lime-dark mb-2">Demo Request Sent!</h3>
                  <p className="text-lime-dark/80">
                    Thank you for your interest. One of our founders will reach out within 1 business day to schedule your personalized demo session.
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
                      Company *
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-16 border-2 border-black/10 focus:border-navy focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-charcoal mb-2">
                      Role
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-16 border-2 border-black/10 focus:border-navy focus:outline-none transition-colors"
                    >
                      <option value="">Select your role</option>
                      <option value="marketing">Marketing</option>
                      <option value="content">Content/Editorial</option>
                      <option value="executive">Executive/C-Level</option>
                      <option value="seo">SEO/Growth</option>
                      <option value="legal">Legal/Compliance</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="preferredDate" className="block text-sm font-medium text-charcoal mb-2">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        id="preferredDate"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-16 border-2 border-black/10 focus:border-navy focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="preferredTime" className="block text-sm font-medium text-charcoal mb-2">
                        Preferred Time
                      </label>
                      <select
                        id="preferredTime"
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-16 border-2 border-black/10 focus:border-navy focus:outline-none transition-colors"
                      >
                        <option value="">Select time</option>
                        <option value="morning">Morning (9AM-12PM)</option>
                        <option value="afternoon">Afternoon (12PM-3PM)</option>
                        <option value="late">Late Afternoon (3PM-6PM)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-charcoal mb-2">
                      What would you like to see in the demo?
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 rounded-16 border-2 border-black/10 focus:border-navy focus:outline-none transition-colors resize-none"
                      placeholder="Tell us about your content verification needs..."
                    />
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-12 text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  <Button type="submit" loading={loading} size="lg" className="w-full">
                    {loading ? 'Sending...' : 'Request Demo'}
                    {!loading && <Send className="w-5 h-5" />}
                  </Button>
                </form>
              )}
            </div>

            {/* Demo Information */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-charcoal">
                What to Expect
              </h2>

              <div className="space-y-6">
                <div className="bg-cream rounded-16 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-navy/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-navy" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-charcoal">30-Minute Session</h3>
                      <p className="text-charcoal/70 text-sm">
                        A personalized walkthrough of CertREV's platform tailored to your content verification needs
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-cream rounded-16 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-navy/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-navy" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-charcoal">Meet the Founders</h3>
                      <p className="text-charcoal/70 text-sm">
                        Direct access to CertREV's founding team who will personally guide you through the platform and answer your questions
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-cream rounded-16 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-navy/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-navy" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-charcoal">Custom Solution</h3>
                      <p className="text-charcoal/70 text-sm">
                        Learn how to build trust infrastructure specific to your content, audience, and business goals
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-navy/5 rounded-16 p-6 border-2 border-navy/10">
                  <h3 className="font-semibold mb-2 text-navy">During the Demo</h3>
                  <ul className="space-y-2 text-sm text-charcoal/80">
                    <li className="flex items-start gap-2">
                      <span className="text-navy mt-1">•</span>
                      <span>See the expert verification workflow in action</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-navy mt-1">•</span>
                      <span>Explore our expert network and credentialing tiers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-navy mt-1">•</span>
                      <span>Review pricing and ROI for your use case</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-navy mt-1">•</span>
                      <span>Get answers to all your questions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
