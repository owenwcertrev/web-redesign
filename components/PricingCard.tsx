'use client'

import { motion, AnimatePresence } from 'framer-motion'
import TextureOverlay from './TextureOverlay'
import OrganicShape from './OrganicShape'
import { Check } from 'lucide-react'

export interface PricingTier {
  id: string
  name: string
  price: number
  credits: number
  pricePerCredit: number
  description: string
  examples: string[]
  isPopular?: boolean
}

interface PricingCardProps {
  tier: PricingTier
}

export default function PricingCard({ tier }: PricingCardProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={tier.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="relative"
      >
        {/* Popular Badge */}
        {tier.isPopular && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20"
          >
            <div className="bg-lime text-navy px-6 py-2 rounded-full font-bold text-sm shadow-lg border-2 border-navy/10">
              Most Popular
            </div>
          </motion.div>
        )}

        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border-2 border-navy/10 relative overflow-hidden">
          <TextureOverlay type="paper" opacity={0.2} />
          <OrganicShape
            variant="blob1"
            color="lime"
            className="absolute -top-20 -right-20 w-64 h-64"
            opacity={0.06}
          />
          <OrganicShape
            variant="blob3"
            color="coral"
            className="absolute -bottom-20 -left-20 w-64 h-64"
            opacity={0.06}
          />

          {/* Two-column layout on desktop, single column on mobile */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
            {/* Left Column: Plan details */}
            <div>
              {/* Tier Name */}
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy font-serif mb-2">
                {tier.name}
              </h3>

              {/* Description */}
              <p className="text-sm sm:text-base text-navy/60 mb-4 sm:mb-6">{tier.description}</p>

              {/* Price */}
              <div className="mb-6 sm:mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-coral font-serif">
                    ${tier.price.toLocaleString()}
                  </span>
                  <span className="text-lg sm:text-xl text-navy/60">/month</span>
                </div>
                <p className="text-sm text-navy/50 mt-2">
                  {tier.credits} credits • ${tier.pricePerCredit}/credit
                </p>
              </div>

              {/* CTA Button */}
              <motion.a
                href="https://dashboard.certrev.com/auth/signup?tab=brand"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="block w-full text-center px-8 py-4 bg-coral text-white font-semibold rounded-full hover:bg-coral/90 transition-all shadow-md hover:shadow-lg mb-3"
              >
                Start Today
              </motion.a>

              <p className="text-center text-xs text-navy/40">
                No long-term contract • Cancel anytime
              </p>
            </div>

            {/* Right Column: Example spending scenarios & Features */}
            <div className="md:border-l md:border-navy/10 md:pl-8 lg:pl-12">
              <p className="text-sm font-semibold text-navy/60 uppercase tracking-wide mb-4">
                Example Spending
              </p>
              <div className="space-y-3 mb-8">
                {tier.examples.map((example, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-lime/20 flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-navy" />
                    </div>
                    <p className="text-navy/70 text-sm leading-relaxed">{example}</p>
                  </motion.div>
                ))}
              </div>

              {/* Features */}
              <div className="pt-6 border-t border-navy/10">
                <p className="text-sm font-semibold text-navy/60 uppercase tracking-wide mb-4">
                  Included Features
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-navy/60">
                    <Check className="w-4 h-4 text-lime" />
                    <span>90-day credit rollover</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-navy/60">
                    <Check className="w-4 h-4 text-lime" />
                    <span>Access to all 6 credential tiers</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-navy/60">
                    <Check className="w-4 h-4 text-lime" />
                    <span>JSON-LD schema & EEAT badges</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-navy/60">
                    <Check className="w-4 h-4 text-lime" />
                    <span>SOC-2 compliant platform</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
