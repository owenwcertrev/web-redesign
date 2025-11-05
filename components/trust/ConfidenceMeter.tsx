'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface ConfidenceMeterProps {
  score: number // 0-100
  label?: string
  showPercentage?: boolean
  animated?: boolean
  className?: string
}

export default function ConfidenceMeter({
  score,
  label = 'Confidence',
  showPercentage = true,
  animated = true,
  className = ''
}: ConfidenceMeterProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score)

  useEffect(() => {
    if (animated) {
      const duration = 1500
      const steps = 60
      const increment = score / steps
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= score) {
          setDisplayScore(score)
          clearInterval(timer)
        } else {
          setDisplayScore(Math.floor(current))
        }
      }, duration / steps)

      return () => clearInterval(timer)
    }
  }, [score, animated])

  const getColor = (score: number) => {
    if (score >= 80) return { from: '#77AB95', to: '#5B8DEF', text: 'text-verification' }
    if (score >= 60) return { from: '#5B8DEF', to: '#A7C4BC', text: 'text-primary' }
    if (score >= 40) return { from: '#F18239', to: '#5B8DEF', text: 'text-alert' }
    return { from: '#9CA3AF', to: '#6B7280', text: 'text-charcoal/50' }
  }

  const colors = getColor(score)

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-charcoal/70">{label}</span>
        {showPercentage && (
          <motion.span
            className="text-sm font-mono font-bold text-navy"
            key={displayScore}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {displayScore}%
          </motion.span>
        )}
      </div>

      {/* Meter Container */}
      <div className="relative h-2 bg-charcoal/5 rounded-full overflow-hidden backdrop-blur-sm border border-charcoal/5">
        {/* Shimmer Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
          style={{
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s infinite'
          }}
        />

        {/* Progress Bar */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${colors.from}, ${colors.to})`,
            boxShadow: `0 0 12px ${colors.from}40`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${displayScore}%` }}
          transition={{
            duration: animated ? 1.5 : 0,
            ease: [0.16, 1, 0.3, 1] // Custom easing for smooth feel
          }}
        />
      </div>

      {/* Precision Indicator (monospace technical detail) */}
      <div className="flex items-center justify-between text-[10px] font-mono text-charcoal/30">
        <span>0</span>
        <span className="text-[9px]">PRECISION SCORE</span>
        <span>100</span>
      </div>
    </div>
  )
}
