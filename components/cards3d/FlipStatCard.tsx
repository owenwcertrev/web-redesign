'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { LucideIcon } from 'lucide-react'

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
      className="h-full cursor-pointer group"
      style={{ perspective: '1500px' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{
          duration: 0.6,
          type: 'spring',
          stiffness: 120,
          damping: 20
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className={`relative h-full bg-gradient-to-br ${gradient} backdrop-blur-sm rounded-2xl p-8 border border-charcoal/10 shadow-xl group-hover:shadow-2xl transition-shadow overflow-hidden`}>
            {/* 3D depth indicator */}
            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary/30 group-hover:bg-primary/60 transition-colors" />

            <Icon className="w-12 h-12 text-primary mb-6 group-hover:scale-110 transition-transform" />

            <div className="mb-6">
              <div className="text-5xl font-bold bg-gradient-to-br from-primary to-verification bg-clip-text text-transparent mb-2">
                {stat}
              </div>
              <div className="text-sm font-semibold text-charcoal/80 uppercase tracking-wider">
                {label}
              </div>
            </div>

            <p className="text-charcoal/70 leading-relaxed mb-4">
              {description}
            </p>

            <div className="absolute bottom-6 left-8 right-8">
              <div className="flex items-center justify-between text-xs text-charcoal/40">
                <span>CLICK TO REVEAL</span>
                <span>→</span>
              </div>
            </div>

            {/* Subtle 3D edge highlight */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
            </div>
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
          <div className="h-full bg-gradient-to-br from-verification to-verification-dark rounded-2xl p-8 border border-verification/30 shadow-2xl text-white">
            <div className="flex items-start justify-between mb-6">
              <Icon className="w-10 h-10 opacity-80" />
              <div className="w-2 h-2 rounded-full bg-white/50" />
            </div>

            <h3 className="text-2xl font-bold mb-6">
              {backTitle}
            </h3>

            <div className="space-y-4 mb-8">
              {backDetails.map((detail, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: isFlipped ? 0.3 + i * 0.1 : 0 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white/80 mt-2 flex-shrink-0" />
                  <span className="text-white/90 leading-relaxed">{detail}</span>
                </motion.div>
              ))}
            </div>

            <div className="absolute bottom-6 left-8 right-8">
              <div className="flex items-center justify-between text-xs text-white/40">
                <span>VERIFIED</span>
                <span className="font-mono">{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {/* Back edge highlights */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
