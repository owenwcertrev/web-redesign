'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, Info } from 'lucide-react'

export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'unverified'

interface CitationMarkerProps {
  number: number
  confidence: ConfidenceLevel
  source?: string
  preview?: string
  className?: string
}

const confidenceConfig = {
  high: {
    color: 'text-verification',
    bg: 'bg-verification/10',
    border: 'border-verification/30',
    glow: 'shadow-[0_0_8px_rgba(119,171,149,0.3)]',
    icon: CheckCircle2,
  },
  medium: {
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/30',
    glow: 'shadow-[0_0_8px_rgba(91,141,239,0.3)]',
    icon: Info,
  },
  low: {
    color: 'text-alert',
    bg: 'bg-alert/10',
    border: 'border-alert/30',
    glow: 'shadow-[0_0_8px_rgba(241,130,57,0.3)]',
    icon: AlertCircle,
  },
  unverified: {
    color: 'text-charcoal/40',
    bg: 'bg-charcoal/5',
    border: 'border-charcoal/20',
    glow: '',
    icon: Info,
  },
}

export default function CitationMarker({
  number,
  confidence,
  source,
  preview,
  className = ''
}: CitationMarkerProps) {
  const [isHovered, setIsHovered] = useState(false)
  const config = confidenceConfig[confidence]
  const Icon = config.icon

  return (
    <span
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.sup
        className={`
          inline-flex items-center justify-center
          w-5 h-5 ml-0.5 mr-0.5
          rounded-full border
          font-mono text-[10px] font-bold
          cursor-help
          transition-all duration-300
          ${config.color} ${config.bg} ${config.border}
          ${isHovered ? config.glow : ''}
        `}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.95 }}
      >
        {number}
      </motion.sup>

      {/* Hover Preview */}
      <AnimatePresence>
        {isHovered && (source || preview) && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none"
          >
            <div className="bg-white/95 backdrop-blur-xl border border-charcoal/10 rounded-xl shadow-2xl p-4 min-w-[280px] max-w-[400px]">
              {/* Confidence Indicator */}
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${config.color}`} />
                <span className={`text-xs font-mono font-semibold uppercase tracking-wide ${config.color}`}>
                  {confidence} confidence
                </span>
              </div>

              {/* Source */}
              {source && (
                <p className="text-xs text-charcoal/90 font-medium mb-1">
                  {source}
                </p>
              )}

              {/* Preview */}
              {preview && (
                <p className="text-xs text-charcoal/70 leading-relaxed">
                  {preview}
                </p>
              )}

              {/* Arrow */}
              <div className={`absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] w-2 h-2 rotate-45 bg-white/95 border-r border-b border-charcoal/10`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verification Line (visual connection) */}
      {confidence !== 'unverified' && isHovered && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          exit={{ scaleY: 0 }}
          className={`absolute top-full left-1/2 -translate-x-1/2 w-[1px] h-4 origin-top ${config.color.replace('text-', 'bg-')}`}
          style={{ opacity: 0.3 }}
        />
      )}
    </span>
  )
}
