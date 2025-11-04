'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { ReactNode } from 'react'

interface GlassMorphCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode
  variant?: 'default' | 'primary' | 'verification' | 'alert'
  hover?: boolean
  borderPrecision?: boolean
  className?: string
}

const variantStyles = {
  default: {
    bg: 'bg-white/60',
    border: 'border-charcoal/10',
    hoverBorder: 'hover:border-charcoal/20',
    glow: '',
  },
  primary: {
    bg: 'bg-white/60',
    border: 'border-primary/20',
    hoverBorder: 'hover:border-primary/40',
    glow: 'hover:shadow-[0_0_24px_rgba(91,141,239,0.15)]',
  },
  verification: {
    bg: 'bg-white/60',
    border: 'border-verification/20',
    hoverBorder: 'hover:border-verification/40',
    glow: 'hover:shadow-[0_0_24px_rgba(119,171,149,0.15)]',
  },
  alert: {
    bg: 'bg-white/60',
    border: 'border-alert/20',
    hoverBorder: 'hover:border-alert/40',
    glow: 'hover:shadow-[0_0_24px_rgba(241,130,57,0.15)]',
  },
}

export default function GlassMorphCard({
  children,
  variant = 'default',
  hover = true,
  borderPrecision = true,
  className = '',
  ...motionProps
}: GlassMorphCardProps) {
  const styles = variantStyles[variant]

  return (
    <motion.div
      className={`
        relative overflow-hidden
        ${styles.bg} backdrop-blur-xl
        border ${styles.border}
        ${hover ? styles.hoverBorder : ''}
        ${hover ? styles.glow : ''}
        ${borderPrecision ? 'rounded-[10px]' : 'rounded-xl'}
        transition-all duration-500
        ${className}
      `}
      whileHover={hover ? { y: -4 } : {}}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      {...motionProps}
    >
      {/* Precision corner indicators */}
      {borderPrecision && (
        <>
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-charcoal/20" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-charcoal/20" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-charcoal/20" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-charcoal/20" />
        </>
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 pointer-events-none" />
    </motion.div>
  )
}
