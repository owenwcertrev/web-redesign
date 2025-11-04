'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ReactNode, MouseEvent } from 'react'

interface TiltCardProps {
  children: ReactNode
  className?: string
  intensity?: number
  glowColor?: string
}

export default function TiltCard({
  children,
  className = '',
  intensity = 0.5,
  glowColor = 'rgba(91, 141, 239, 0.2)'
}: TiltCardProps) {
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)

  const rotateX = useSpring(useTransform(y, [0, 1], [intensity * 10, -intensity * 10]), {
    stiffness: 400,
    damping: 30
  })
  const rotateY = useSpring(useTransform(x, [0, 1], [-intensity * 10, intensity * 10]), {
    stiffness: 400,
    damping: 30
  })

  const glowX = useTransform(x, [0, 1], ['0%', '100%'])
  const glowY = useTransform(y, [0, 1], ['0%', '100%'])

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const newX = (e.clientX - rect.left) / rect.width
    const newY = (e.clientY - rect.top) / rect.height
    x.set(newX)
    y.set(newY)
  }

  const handleMouseLeave = () => {
    x.set(0.5)
    y.set(0.5)
  }

  return (
    <div style={{ perspective: '1500px' }} className="w-full h-full">
      <motion.div
        className={`relative w-full h-full ${className}`}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {/* Depth shadow layer */}
        <div
          className="absolute inset-0 rounded-2xl -z-10"
          style={{
            transform: 'translateZ(-20px)',
            background: 'linear-gradient(135deg, rgba(0,0,0,0.1), rgba(0,0,0,0.05))',
            filter: 'blur(10px)',
          }}
        />

        {/* Glow effect following mouse */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: useTransform(
              glowX,
              (xVal) => `radial-gradient(circle at ${xVal} 50%, ${glowColor}, transparent 60%)`
            ),
          }}
        />

        {/* Main content */}
        <div className="relative w-full h-full" style={{ transform: 'translateZ(0px)' }}>
          {children}
        </div>

        {/* Subtle highlight on top edge */}
        <div
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
          style={{ transform: 'translateZ(1px)' }}
        />
      </motion.div>
    </div>
  )
}
