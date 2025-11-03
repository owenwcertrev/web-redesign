'use client'

import { motion } from 'framer-motion'

interface GradientBlobProps {
  color1: string
  color2: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  animate?: boolean
}

export default function GradientBlob({
  color1,
  color2,
  className = '',
  size = 'md',
  animate = true
}: GradientBlobProps) {
  const sizeClasses = {
    sm: 'w-64 h-64',
    md: 'w-96 h-96',
    lg: 'w-[600px] h-[600px]'
  }

  return (
    <motion.div
      className={`${sizeClasses[size]} rounded-full blur-3xl opacity-20 ${className}`}
      style={{
        background: `radial-gradient(circle, ${color1}, ${color2})`
      }}
      animate={animate ? {
        scale: [1, 1.2, 1],
        rotate: [0, 90, 0],
      } : {}}
      transition={{
        duration: 20,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
    />
  )
}
