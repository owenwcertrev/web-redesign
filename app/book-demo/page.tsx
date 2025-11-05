'use client'

import { useState, FormEvent } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/Button'
import DepthHero from '@/components/cards3d/DepthHero'
import TiltCard from '@/components/cards3d/TiltCard'
import FadeIn from '@/components/animations/FadeIn'
import TextureOverlay from '@/components/TextureOverlay'
import OrganicShape from '@/components/OrganicShape'
import { Calendar, Clock, Users, Send, CheckCircle } from 'lucide-react'

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
      {/* Hero Section with Depth */}
      <DepthHero
        backgroundLayers={[
          <div key="bg" className="absolute inset-0 bg-beige" />,
          <TextureOverlay key="texture" type="paper" opacity={0.3} />,
          <OrganicShape key="shape1" variant="blob1" color="coral" className="absolute top-1/4 right-1/4 w-96 h-96" opacity={0.1} />,
          <OrganicShape key="shape2" variant="blob3" color="navy" className="absolute bottom-1/3 left-1/4 w-80 h-80" opacity={0.08} />,
        ]}
      >
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-6 px-6 py-3 bg-white rounded-full border-2 border-coral/20 shadow-sm"
            >
              <span className="text-sm font-semibold text-navy tracking-wide">MEET THE FOUNDERS</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight font-serif"
            >
              <span className="text-navy">
                Schedule a Demo
              </span>
              <br />
              <span className="text-coral">
                with Our Team
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg sm:text-xl md:text-2xl text-black/70 max-w-3xl mx-auto leading-relaxed"
            >
              Book a personalized 30-minute session with CertREV's founders to see how expert verification can transform your content strategy
            </motion.p>
          </div>
        </div>
      </DepthHero>

      {/* Demo Form & Info */}
      <section className="bg-white py-20 sm:py-24 md:py-28 px-4 relative overflow-hidden">
        <TextureOverlay type="grain" opacity={0.15} />
        <OrganicShape variant="blob2" color="lime" className="absolute -top-20 -right-20 w-96 h-96" opacity={0.06} />
        <div className="max-w-6xl mx-auto relative z-10">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="inline-block mb-6 px-6 py-3 bg-coral/10 rounded-full border-2 border-coral/30 shadow-md">
                <span className="text-sm font-semibold text-navy tracking-wide">GET STARTED</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-navy font-serif">
                Let's Talk About Your Needs
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Demo Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <TiltCard intensity={0.5} glowColor="rgba(240, 123, 97, 0.2)">
                <div className="bg-beige rounded-3xl p-6 border-2 border-coral/20 shadow-xl relative overflow-hidden">
                  <TextureOverlay type="paper" opacity={0.3} />
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-4 text-navy font-serif">
                      Schedule Your Demo
                    </h3>

                    {success ? (
                      <div className="bg-lime/10 rounded-2xl p-4 border-2 border-lime">
                        <div className="flex items-start gap-3 mb-2">
                          <CheckCircle className="w-5 h-5 text-lime flex-shrink-0" />
                          <h4 className="font-bold text-navy">Demo Request Sent!</h4>
                        </div>
                        <p className="text-black/70 text-sm leading-relaxed">
                          Thank you for your interest. One of our founders will reach out within 1 business day to schedule your personalized demo session.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-3">
                        <div>
                          <label htmlFor="name" className="block text-sm font-semibold text-navy mb-1">
                            Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 rounded-2xl border-2 border-black/10 focus:border-coral focus:outline-none transition-colors bg-white text-sm"
                          />
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-semibold text-navy mb-1">
                            Email *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 rounded-2xl border-2 border-black/10 focus:border-coral focus:outline-none transition-colors bg-white text-sm"
                          />
                        </div>

                        <div>
                          <label htmlFor="company" className="block text-sm font-semibold text-navy mb-1">
                            Company *
                          </label>
                          <input
                            type="text"
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 rounded-2xl border-2 border-black/10 focus:border-coral focus:outline-none transition-colors bg-white text-sm"
                          />
                        </div>

                        <div>
                          <label htmlFor="role" className="block text-sm font-semibold text-navy mb-1">
                            Role
                          </label>
                          <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-2xl border-2 border-black/10 focus:border-coral focus:outline-none transition-colors bg-white text-sm"
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
                            <label htmlFor="preferredDate" className="block text-sm font-semibold text-navy mb-1">
                              Preferred Date
                            </label>
                            <input
                              type="date"
                              id="preferredDate"
                              name="preferredDate"
                              value={formData.preferredDate}
                              onChange={handleChange}
                              className="w-full px-3 py-2 rounded-2xl border-2 border-black/10 focus:border-coral focus:outline-none transition-colors bg-white text-sm"
                            />
                          </div>

                          <div>
                            <label htmlFor="preferredTime" className="block text-sm font-semibold text-navy mb-1">
                              Preferred Time
                            </label>
                            <select
                              id="preferredTime"
                              name="preferredTime"
                              value={formData.preferredTime}
                              onChange={handleChange}
                              className="w-full px-3 py-2 rounded-2xl border-2 border-black/10 focus:border-coral focus:outline-none transition-colors bg-white text-sm"
                            >
                              <option value="">Select time</option>
                              <option value="morning">Morning (9AM-12PM)</option>
                              <option value="afternoon">Afternoon (12PM-3PM)</option>
                              <option value="late">Late Afternoon (3PM-6PM)</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="message" className="block text-sm font-semibold text-navy mb-1">
                            What would you like to see in the demo?
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-3 rounded-2xl border-2 border-black/10 focus:border-coral focus:outline-none transition-colors resize-none bg-white"
                            placeholder="Tell us about your content verification needs..."
                          />
                        </div>

                        {error && (
                          <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-red-700 text-sm">
                            {error}
                          </div>
                        )}

                        <Button type="submit" loading={loading} size="lg" className="w-full !bg-coral hover:!bg-coral/90 !border-coral">
                          {loading ? 'Sending...' : 'Request Demo'}
                          {!loading && <Send className="w-5 h-5" />}
                        </Button>
                      </form>
                    )}
                  </div>
                </div>
              </TiltCard>
            </motion.div>

            {/* Demo Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <TiltCard intensity={0.5} glowColor="rgba(119, 171, 149, 0.2)">
                <div className="bg-white rounded-3xl p-5 border-2 border-lime/20 shadow-xl relative overflow-hidden">
                  <TextureOverlay type="paper" opacity={0.3} />
                  <div className="relative z-10">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-lime/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-lime" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-1 text-navy font-serif">30-Minute Session</h3>
                        <p className="text-black/70 text-sm leading-relaxed">
                          A personalized walkthrough of CertREV's platform tailored to your content verification needs
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>

              <TiltCard intensity={0.5} glowColor="rgba(240, 123, 97, 0.2)">
                <div className="bg-white rounded-3xl p-5 border-2 border-coral/20 shadow-xl relative overflow-hidden">
                  <TextureOverlay type="paper" opacity={0.3} />
                  <div className="relative z-10">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-coral/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Users className="w-6 h-6 text-coral" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-1 text-navy font-serif">Meet the Founders</h3>
                        <p className="text-black/70 text-sm leading-relaxed">
                          Direct access to CertREV's founding team who will personally guide you through the platform and answer your questions
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>

              <TiltCard intensity={0.5} glowColor="rgba(10, 27, 63, 0.2)">
                <div className="bg-white rounded-3xl p-5 border-2 border-navy/20 shadow-xl relative overflow-hidden">
                  <TextureOverlay type="paper" opacity={0.3} />
                  <div className="relative z-10">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-navy/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-6 h-6 text-navy" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-1 text-navy font-serif">Custom Solution</h3>
                        <p className="text-black/70 text-sm leading-relaxed">
                          Learn how to build trust infrastructure specific to your content, audience, and business goals
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>

              <div className="bg-gradient-to-br from-lime/5 to-lime/10 rounded-3xl p-5 border-2 border-lime/30 shadow-lg">
                <h3 className="text-lg font-bold mb-3 text-navy font-serif">During the Demo</h3>
                <ul className="space-y-2 text-black/70 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-lime flex-shrink-0 mt-0.5" />
                    <span>See the expert verification workflow in action</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-lime flex-shrink-0 mt-0.5" />
                    <span>Explore our expert network and credentialing tiers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-lime flex-shrink-0 mt-0.5" />
                    <span>Review pricing and ROI for your use case</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-lime flex-shrink-0 mt-0.5" />
                    <span>Get answers to all your questions</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
