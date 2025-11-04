'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { LucideIcon } from 'lucide-react'
import TextureOverlay from '../TextureOverlay'

interface FlipStatCardProps {
  stat: string
  label: string
  description: string
  backTitle: string
  backDetails: string[]
  icon: LucideIcon
  gradient?: string
}

export default function FlipStatCard({
  stat,
  label,
  description,
  backTitle,
  backDetails,
  icon: Icon,
  gradient = 'from-primary/10 to-verification/10'
}: FlipStatCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div
      className="h-full min-h-[380px] cursor-pointer group"
      style={{ perspective: '1500px' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        whileHover={{ scale: 1.01 }}
        transition={{
          duration: 0.4,
          type: 'spring',
          stiffness: 260,
          damping: 25
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="relative h-full flex flex-col bg-white rounded-2xl p-8 border-2 border-navy/10 shadow-md group-hover:shadow-lg group-hover:border-navy/20 transition-all overflow-hidden">
            <TextureOverlay type="paper" opacity={0.3} />

            {/* Click indicator */}
            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-coral/40 group-hover:bg-coral transition-all group-hover:scale-150 relative z-10" />

            <Icon className="w-12 h-12 text-coral mb-4 group-hover:scale-105 transition-transform flex-shrink-0 relative z-10" />

            <div className="mb-4 flex-shrink-0 relative z-10">
              <div className="text-5xl font-bold text-navy mb-2 font-serif">
                {stat}
              </div>
              <div className="text-xs font-semibold text-navy/70 uppercase tracking-wider">
                {label}
              </div>
            </div>

            <p className="text-black/70 leading-relaxed text-sm flex-grow relative z-10">
              {description}
            </p>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="h-full flex flex-col bg-navy rounded-2xl p-6 border-2 border-navy shadow-lg overflow-hidden relative">
            <TextureOverlay type="paper" opacity={0.2} />

            <div className="flex items-start justify-between mb-3 flex-shrink-0 relative z-10">
              <Icon className="w-8 h-8 text-lime opacity-90" />
              <div className="w-2 h-2 rounded-full bg-lime" />
            </div>

            <h3 className="text-lg font-bold mb-3 flex-shrink-0 text-white font-serif relative z-10">
              {backTitle}
            </h3>

            <div className="space-y-2.5 flex-grow overflow-hidden relative z-10">
              {backDetails.map((detail, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: isFlipped ? 0.2 + i * 0.08 : 0 }}
                  className="flex items-start gap-2.5"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-lime mt-1.5 flex-shrink-0" />
                  <span className="text-white/90 leading-snug text-sm">{detail}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-white/20 flex-shrink-0 relative z-10">
              <div className="flex items-center justify-between text-xs text-white/60">
                <span className="font-semibold">VERIFIED</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
