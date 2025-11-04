'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface NeonTextProps {
  children: ReactNode
  color?: 'primary' | 'verification' | 'alert' | 'white'
  intensity?: 'low' | 'medium' | 'high'
  flicker?: boolean
  className?: string
}

const colorClasses = {
  primary: {
    text: 'text-primary',
    shadow: 'drop-shadow-[0_0_10px_rgba(91,141,239,0.8)] drop-shadow-[0_0_20px_rgba(91,141,239,0.6)] drop-shadow-[0_0_30px_rgba(91,141,239,0.4)]',
  },
  verification: {
    text: 'text-verification',
    shadow: 'drop-shadow-[0_0_10px_rgba(119,171,149,0.8)] drop-shadow-[0_0_20px_rgba(119,171,149,0.6)] drop-shadow-[0_0_30px_rgba(119,171,149,0.4)]',
  },
  alert: {
    text: 'text-alert',
    shadow: 'drop-shadow-[0_0_10px_rgba(241,130,57,0.8)] drop-shadow-[0_0_20px_rgba(241,130,57,0.6)] drop-shadow-[0_0_30px_rgba(241,130,57,0.4)]',
  },
  white: {
    text: 'text-white',
    shadow: 'drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] drop-shadow-[0_0_20px_rgba(255,255,255,0.6)] drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]',
  },
}

export default function NeonText({
  children,
  color = 'primary',
  intensity = 'medium',
  flicker = false,
  className = ''
}: NeonTextProps) {
  const colorClass = colorClasses[color]

  return (
    <motion.span
      className={`${colorClass.text} ${colorClass.shadow} font-bold ${className}`}
      animate={flicker ? {
        opacity: [1, 0.8, 1, 0.9, 1, 0.95, 1],
      } : {}}
      transition={flicker ? {
        duration: 0.15,
        repeat: Infinity,
        repeatDelay: Math.random() * 5 + 2,
      } : {}}
    >
      {children}
    </motion.span>
  )
}
