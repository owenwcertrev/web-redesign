'use client'

import { Check } from 'lucide-react'
import { motion } from 'framer-motion'
import TextureOverlay from './TextureOverlay'
import OrganicShape from './OrganicShape'

interface TierCardProps {
  tierNumber: number
  tierName: string
  credits: number
  credentials: string[]
}

// Warm consumer brand progression with subtle color accents
const tierStyles: Record<number, { bg: string; accent: string; blob: 'navy' | 'lime' | 'coral' }> = {
  1: { bg: 'bg-beige', accent: 'border-lime/30', blob: 'lime' },
  2: { bg: 'bg-white', accent: 'border-coral/30', blob: 'coral' },
  3: { bg: 'bg-beige', accent: 'border-navy/30', blob: 'navy' },
  4: { bg: 'bg-white', accent: 'border-lime/30', blob: 'lime' },
  5: { bg: 'bg-beige', accent: 'border-coral/30', blob: 'coral' },
  6: { bg: 'bg-white', accent: 'border-navy/40', blob: 'navy' },
}

export default function TierCard({ tierNumber, tierName, credits, credentials }: TierCardProps) {
  const style = tierStyles[tierNumber] || tierStyles[1]

  return (
    <div className="relative">
      {/* Main card with warm background */}
      <motion.div
        whileHover={{ scale: 1.01, y: -4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className={`relative ${style.bg} rounded-2xl p-8 border-2 ${style.accent} min-h-[480px] flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow`}
      >
        {/* Texture overlay */}
        <TextureOverlay type="paper" opacity={0.3} />

        {/* Decorative organic shape */}
        <OrganicShape
          variant={tierNumber % 2 === 0 ? 'blob1' : 'blob2'}
          color={style.blob}
          className="absolute -bottom-12 -right-12 w-48 h-48"
          opacity={0.08}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full text-navy">
          {/* Tier badge - warm and friendly */}
          <div className="inline-block self-start mb-4">
            <span className="text-xs font-semibold px-3 py-1 bg-navy/10 rounded-full text-navy tracking-wide">
              Tier {tierNumber}
            </span>
          </div>

          {/* Tier name - serif for warmth */}
          <h3 className="text-3xl font-bold mb-4 leading-tight font-serif">
            {tierName}
          </h3>

          {/* Credits display - clear and friendly */}
          <div className="text-lg mb-6 font-semibold text-coral">
            {credits} CertCredit{credits > 1 ? 's' : ''}
          </div>

          {/* Credentials list */}
          <div className="flex-grow">
            <div className="text-sm font-semibold mb-3 text-navy/70 uppercase tracking-wide">
              Examples include:
            </div>
            <ul className="space-y-2.5">
              {credentials.map((cred, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="flex items-start gap-2.5 text-black/80"
                >
                  <Check className="w-4 h-4 flex-shrink-0 mt-0.5 text-lime" />
                  <span className="text-sm leading-relaxed">{cred}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Verified footer - warm and trustworthy */}
          <div className="mt-6 pt-4 border-t border-navy/10">
            <div className="text-xs font-semibold text-navy/60 tracking-wide">
              Verified Credential Tier
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
