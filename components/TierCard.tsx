'use client'

import { ArrowRight, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import Button from './Button'

interface TierCardProps {
  tierNumber: number
  tierName: string
  credits: number
  credentials: string[]
}

export default function TierCard({ tierNumber, tierName, credits, credentials }: TierCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-3xl p-8 shadow-base border border-black/5 hover:shadow-xl hover:border-primary/10 transition-all duration-500 group relative overflow-hidden"
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-verification/0 group-hover:from-primary/5 group-hover:to-verification/5 transition-all duration-500 rounded-3xl" />

      <div className="relative z-10">
        {/* Tier Header */}
        <h3 className="text-sm font-semibold tracking-wider mb-2 text-primary">
          TIER {tierNumber}
        </h3>
        <h4 className="text-3xl font-light mb-6 text-charcoal">
          {tierName}
        </h4>

        {/* Sage Green Credit Badge - matches design system */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center gap-2 bg-verification-light px-5 py-2.5 rounded-full mb-8 border border-verification/20"
        >
          <span className="font-medium text-verification-dark">
            {credits} CertCredit{credits > 1 ? 's' : ''}
          </span>
        </motion.div>

        {/* Credentials List */}
        <h5 className="text-lg font-semibold mb-4 text-charcoal">Examples include:</h5>
        <ul className="space-y-3 mb-8">
          {credentials.map((cred, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              viewport={{ once: true }}
              className="flex items-start gap-3"
            >
              <Check className="w-5 h-5 text-verification flex-shrink-0 mt-0.5" />
              <span className="text-base text-charcoal/80 leading-relaxed">{cred}</span>
            </motion.li>
          ))}
        </ul>

        {/* Primary Blue CTA Button - matches design system */}
        <Button size="lg" className="w-full">
          GET EXPERT REVIEWS
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  )
}
