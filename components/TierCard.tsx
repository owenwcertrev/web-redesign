'use client'

import { Check } from 'lucide-react'
import { motion } from 'framer-motion'

interface TierCardProps {
  tierNumber: number
  tierName: string
  credits: number
  credentials: string[]
}

// Subtle tonal progression - each tier slightly more premium
const tierGradients: Record<number, string> = {
  1: 'from-slate-100 to-slate-200',           // Light silver
  2: 'from-slate-200 to-zinc-200',            // Silver
  3: 'from-zinc-200 to-stone-300',            // Medium silver
  4: 'from-stone-300 to-stone-400',           // Dark silver
  5: 'from-stone-400 to-amber-300',           // Silver-bronze
  6: 'from-amber-300 to-amber-400',           // Subtle gold
}

export default function TierCard({ tierNumber, tierName, credits, credentials }: TierCardProps) {
  const gradient = tierGradients[tierNumber] || tierGradients[1]

  // Tiers 1-3 use dark text (light backgrounds), tiers 4-6 use white text (darker backgrounds)
  const useDarkText = tierNumber <= 3
  const textColor = useDarkText ? 'text-charcoal' : 'text-white'
  const textOpacity = useDarkText ? 'text-charcoal/80' : 'text-white/90'
  const badgeOpacity = useDarkText ? 'text-charcoal/60' : 'text-white/80'
  const borderColor = useDarkText ? 'border-charcoal/10' : 'border-white/20'
  const borderColorDivider = useDarkText ? 'border-charcoal/10' : 'border-white/10'
  const checkOpacity = useDarkText ? 'opacity-60' : 'opacity-80'
  const highlightOpacity = useDarkText ? 'via-charcoal/20' : 'via-white/40'
  const highlightBottomOpacity = useDarkText ? 'via-charcoal/10' : 'via-white/20'

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
        className={`relative bg-gradient-to-br ${gradient} rounded-2xl p-8 border-2 ${borderColor} backdrop-blur-sm h-[480px] flex flex-col overflow-hidden`}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Top edge highlight - security card detail */}
        <div className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent ${highlightOpacity} to-transparent`} />

        {/* Bottom edge subtle highlight */}
        <div className={`absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent ${highlightBottomOpacity} to-transparent`} />

        {/* Content */}
        <div className={`relative z-10 flex flex-col h-full ${textColor}`}>
          {/* Tier badge - monospace for technical feel */}
          <div className={`text-sm font-mono mb-4 ${badgeOpacity} tracking-wider`}>
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
            <div className={`text-sm font-semibold mb-3 ${badgeOpacity} uppercase tracking-wide`}>
              Examples include:
            </div>
            <ul className="space-y-2.5">
              {credentials.map((cred, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className={`flex items-start gap-2.5 ${textOpacity}`}
                >
                  <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${checkOpacity}`} />
                  <span className="text-sm leading-relaxed">{cred}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Subtle authentication mark at bottom */}
          <div className={`mt-6 pt-4 border-t ${borderColorDivider}`}>
            <div className={`text-xs font-mono ${badgeOpacity} tracking-wider`}>
              VERIFIED CREDENTIAL TIER
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
