'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface LiquidBlobProps {
  children?: ReactNode
  variant?: 'verified' | 'processing' | 'warning' | 'default'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const variantColors = {
  verified: 'from-lime via-lime-light to-lime',
  processing: 'from-navy via-coral to-navy',
  warning: 'from-coral via-amber-400 to-coral',
  default: 'from-black/20 via-black/10 to-black/20',
}

const sizes = {
  sm: 'w-32 h-32',
  md: 'w-48 h-48',
  lg: 'w-64 h-64',
}

export default function LiquidBlob({
  children,
  variant = 'default',
  size = 'md',
  className = ''
}: LiquidBlobProps) {
  return (
    <div className={`relative ${sizes[size]} ${className}`}>
      {/* Animated blob shapes */}
      <motion.div
        className={`absolute inset-0 rounded-full bg-gradient-to-br ${variantColors[variant]} blur-2xl opacity-60`}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          borderRadius: ['60% 40% 30% 70%', '30% 60% 70% 40%', '60% 40% 30% 70%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className={`absolute inset-0 rounded-full bg-gradient-to-tr ${variantColors[variant]} blur-2xl opacity-50`}
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [90, 0, 90],
          borderRadius: ['30% 60% 70% 40%', '60% 40% 30% 70%', '30% 60% 70% 40%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
      />
      <motion.div
        className={`absolute inset-0 rounded-full bg-gradient-to-bl ${variantColors[variant]} blur-xl opacity-70`}
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
          borderRadius: ['50% 50% 50% 50%', '40% 60% 60% 40%', '50% 50% 50% 50%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      {/* Content */}
      {children && (
        <div className="relative z-10 flex items-center justify-center h-full">
          {children}
        </div>
      )}
    </div>
  )
}
