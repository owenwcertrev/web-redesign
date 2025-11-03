'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface FloatingElementProps {
  children: ReactNode
  delay?: number
  duration?: number
  yOffset?: number
}

export default function FloatingElement({
  children,
  delay = 0,
  duration = 3,
  yOffset = 20
}: FloatingElementProps) {
  return (
    <motion.div
      animate={{
        y: [0, -yOffset, 0],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay: delay
      }}
    >
      {children}
    </motion.div>
  )
}
