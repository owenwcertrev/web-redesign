'use client'

import { Check } from 'lucide-react'
import { motion } from 'framer-motion'

interface TierCardProps {
  tierNumber: number
  tierName: string
  credits: number
  credentials: string[]
}

// Gradient mapping for each tier - metallic security card aesthetic
const tierGradients: Record<number, string> = {
  1: 'from-primary to-primary-dark',
  2: 'from-verification to-verification-dark',
  3: 'from-alert to-amber-600',
  4: 'from-purple-600 to-purple-800',
  5: 'from-blue-600 to-blue-800',
  6: 'from-charcoal to-charcoal/80',
}

export default function TierCard({ tierNumber, tierName, credits, credentials }: TierCardProps) {
  const gradient = tierGradients[tierNumber] || tierGradients[1]

  return (
    <div
      className="relative"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Enhanced shadow with depth */}
      <div
        className="absolute inset-0 bg-black/20 rounded-2xl blur-2xl"
        style={{
          transform: 'translateZ(-10px) translateY(10px)',
        }}
      />

      {/* Main card with metallic gradient */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className={`relative bg-gradient-to-br ${gradient} rounded-2xl p-8 border-2 border-white/20 backdrop-blur-sm h-[480px] flex flex-col overflow-hidden`}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Top edge highlight - security card detail */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        {/* Bottom edge subtle highlight */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full text-white">
          {/* Tier badge - monospace for technical feel */}
          <div className="text-sm font-mono mb-4 opacity-80 tracking-wider">
            TIER {tierNumber}
          </div>

          {/* Tier name */}
          <h3 className="text-3xl font-bold mb-4 leading-tight">
            {tierName}
          </h3>

          {/* Credits display - prominent */}
          <div className="text-lg mb-6 font-medium">
            {credits} CertCredit{credits > 1 ? 's' : ''}
          </div>

          {/* Credentials list */}
          <div className="flex-grow">
            <div className="text-sm font-semibold mb-3 opacity-90 uppercase tracking-wide">
              Examples include:
            </div>
            <ul className="space-y-2.5">
              {credentials.map((cred, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="flex items-start gap-2.5 text-white/90"
                >
                  <Check className="w-4 h-4 flex-shrink-0 mt-0.5 opacity-80" />
                  <span className="text-sm leading-relaxed">{cred}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Subtle authentication mark at bottom */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="text-xs font-mono opacity-50 tracking-wider">
              VERIFIED CREDENTIAL TIER
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
