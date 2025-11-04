'use client'

import { motion } from 'framer-motion'

interface CyberGridProps {
  className?: string
  animated?: boolean
}

export default function CyberGrid({ className = '', animated = true }: CyberGridProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden opacity-20 ${className}`}>
      {/* Horizontal lines */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5B8DEF" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#77AB95" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#F18239" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.line
            key={`h-${i}`}
            x1="0"
            y1={`${i * 5}%`}
            x2="100%"
            y2={`${i * 5}%`}
            stroke="url(#grid-gradient)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={animated ? {
              pathLength: [0, 1, 0],
              opacity: [0, 0.5, 0],
            } : { pathLength: 1, opacity: 0.3 }}
            transition={animated ? {
              duration: 3,
              repeat: Infinity,
              delay: i * 0.1,
              ease: 'linear',
            } : {}}
          />
        ))}

        {Array.from({ length: 20 }).map((_, i) => (
          <motion.line
            key={`v-${i}`}
            x1={`${i * 5}%`}
            y1="0"
            x2={`${i * 5}%`}
            y2="100%"
            stroke="url(#grid-gradient)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={animated ? {
              pathLength: [0, 1, 0],
              opacity: [0, 0.5, 0],
            } : { pathLength: 1, opacity: 0.3 }}
            transition={animated ? {
              duration: 3,
              repeat: Infinity,
              delay: i * 0.1 + 0.5,
              ease: 'linear',
            } : {}}
          />
        ))}

        {/* Pulsing center circle */}
        <motion.circle
          cx="50%"
          cy="50%"
          r="20"
          stroke="url(#grid-gradient)"
          strokeWidth="2"
          fill="none"
          animate={animated ? {
            r: [20, 100, 20],
            opacity: [1, 0, 1],
          } : {}}
          transition={animated ? {
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          } : {}}
        />
      </svg>

      {/* Scanline effect */}
      {animated && (
        <motion.div
          className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
          animate={{
            top: ['0%', '100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
    </div>
  )
}
