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
      className="h-full min-h-[380px] cursor-pointer group"
      style={{ perspective: '1500px' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        whileHover={{ scale: 1.02 }}
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
          <div className={`relative h-full flex flex-col bg-gradient-to-br ${gradient} backdrop-blur-sm rounded-2xl p-8 border border-charcoal/10 shadow-xl group-hover:shadow-2xl group-hover:border-charcoal/20 transition-all overflow-hidden`}>
            {/* 3D depth indicator - pulses on hover to hint interactivity */}
            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary/30 group-hover:bg-primary transition-all group-hover:scale-150" />

            <Icon className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform flex-shrink-0" />

            <div className="mb-4 flex-shrink-0">
              <div className="text-4xl font-bold bg-gradient-to-br from-primary to-verification bg-clip-text text-transparent mb-2">
                {stat}
              </div>
              <div className="text-xs font-semibold text-charcoal/80 uppercase tracking-wider">
                {label}
              </div>
            </div>

            <p className="text-charcoal/70 leading-relaxed text-sm flex-grow">
              {description}
            </p>

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
          <div className={`h-full flex flex-col bg-gradient-to-br ${gradient} backdrop-blur-sm rounded-2xl p-8 border border-charcoal/10 shadow-2xl overflow-hidden`}>
            <div className="flex items-start justify-between mb-4 flex-shrink-0">
              <Icon className="w-10 h-10 text-primary opacity-80" />
              <div className="w-2 h-2 rounded-full bg-primary/50" />
            </div>

            <h3 className="text-xl font-bold mb-4 flex-shrink-0 text-charcoal">
              {backTitle}
            </h3>

            <div className="space-y-3 flex-grow overflow-hidden">
              {backDetails.map((detail, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: isFlipped ? 0.2 + i * 0.08 : 0 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/80 mt-1.5 flex-shrink-0" />
                  <span className="text-charcoal/90 leading-relaxed text-sm">{detail}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-charcoal/10 flex-shrink-0">
              <div className="flex items-center justify-between text-xs text-charcoal/40">
                <span>VERIFIED</span>
                <span className="font-mono">{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {/* Back edge highlights */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
