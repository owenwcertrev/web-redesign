'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

export type VerificationLevel = 'verified' | 'unverified' | 'pending'

interface TrustTypographyProps {
  children: ReactNode
  verification?: VerificationLevel
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'
  className?: string
  animated?: boolean
}

const verificationStyles = {
  verified: {
    weight: 'font-semibold',
    color: 'text-black',
    glow: 'shadow-[0_0_20px_rgba(119,171,149,0.15)]',
    opacity: 'opacity-100',
    scale: 1,
  },
  pending: {
    weight: 'font-medium',
    color: 'text-black/70',
    glow: '',
    opacity: 'opacity-90',
    scale: 0.995,
  },
  unverified: {
    weight: 'font-normal',
    color: 'text-black/50',
    glow: '',
    opacity: 'opacity-70',
    scale: 0.99,
  },
}

export default function TrustTypography({
  children,
  verification = 'unverified',
  as = 'p',
  className = '',
  animated = true,
}: TrustTypographyProps) {
  const Component = as
  const styles = verificationStyles[verification]

  const content = (
    <Component
      className={`
        transition-all duration-500
        ${styles.weight}
        ${styles.color}
        ${styles.glow}
        ${styles.opacity}
        ${className}
      `}
    >
      {children}
    </Component>
  )

  if (!animated) return content

  return (
    <motion.div
      initial={{ scale: verificationStyles.unverified.scale }}
      animate={{ scale: styles.scale }}
      transition={{
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1]
      }}
    >
      {content}
    </motion.div>
  )
}
