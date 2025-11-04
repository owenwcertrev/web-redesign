'use client'

import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import TextureOverlay from './TextureOverlay'

interface TestimonialProps {
  quote: string
  name: string
  role: string
  company: string
  imagePlaceholder?: string
  variant?: 'default' | 'compact'
}

export default function Testimonial({
  quote,
  name,
  role,
  company,
  imagePlaceholder = 'User Photo',
  variant = 'default'
}: TestimonialProps) {
  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-2xl p-6 border-2 border-lime/20 relative overflow-hidden shadow-md">
        <TextureOverlay type="paper" opacity={0.3} />
        <div className="relative z-10">
          <Quote className="w-8 h-8 text-lime mb-4" />
          <p className="text-black/80 italic mb-4 leading-relaxed">
            "{quote}"
          </p>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-navy/10 flex items-center justify-center text-xs text-navy font-semibold">
              {imagePlaceholder}
            </div>
            <div>
              <div className="font-semibold text-navy">{name}</div>
              <div className="text-sm text-black/60">{role}, {company}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-beige rounded-2xl p-8 md:p-12 border-2 border-navy/10 relative overflow-hidden shadow-lg"
    >
      <TextureOverlay type="paper" opacity={0.3} />

      {/* Quote icon */}
      <div className="relative z-10 mb-6">
        <Quote className="w-12 h-12 text-coral" />
      </div>

      {/* Quote text */}
      <p className="text-xl md:text-2xl text-navy italic mb-8 leading-relaxed relative z-10 font-serif">
        "{quote}"
      </p>

      {/* Author info */}
      <div className="flex items-center gap-4 relative z-10">
        <div className="w-16 h-16 rounded-full bg-lime/20 flex items-center justify-center text-xs text-navy font-semibold border-2 border-lime/30">
          {imagePlaceholder}
        </div>
        <div>
          <div className="font-bold text-navy text-lg font-serif">{name}</div>
          <div className="text-black/70">{role}</div>
          <div className="text-black/60 text-sm">{company}</div>
        </div>
      </div>
    </motion.div>
  )
}
