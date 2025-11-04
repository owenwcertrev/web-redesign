'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ReactNode, MouseEvent } from 'react'

interface HolographicCardProps {
  children: ReactNode
  className?: string
  intensity?: number
}

export default function HolographicCard({
  children,
  className = '',
  intensity = 1
}: HolographicCardProps) {
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)

  const rotateX = useSpring(useTransform(y, [0, 1], [15, -15]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(x, [0, 1], [-15, 15]), { stiffness: 300, damping: 30 })

  const gradientX = useTransform(x, [0, 1], [0, 100])
  const gradientY = useTransform(y, [0, 1], [0, 100])

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
    <div className="relative perspective-1000" style={{ perspective: '1000px' }}>
      <motion.div
        className={`relative rounded-2xl overflow-hidden ${className}`}
        style={{
          rotateX: useTransform(rotateX, (val) => `${val * intensity}deg`),
          rotateY: useTransform(rotateY, (val) => `${val * intensity}deg`),
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {/* Holographic gradient overlay */}
        <motion.div
          className="absolute inset-0 opacity-30 mix-blend-color-dodge pointer-events-none"
          style={{
            background: useTransform(
              [gradientX, gradientY],
              ([x, y]) => `
                radial-gradient(
                  circle at ${x}% ${y}%,
                  rgba(91, 141, 239, 0.8) 0%,
                  rgba(167, 196, 188, 0.6) 25%,
                  rgba(241, 130, 57, 0.6) 50%,
                  rgba(119, 171, 149, 0.8) 75%,
                  rgba(91, 141, 239, 0.8) 100%
                )
              `
            ),
          }}
        />

        {/* Iridescent shine effect */}
        <motion.div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background: useTransform(
              [gradientX, gradientY],
              ([x, y]) => `
                linear-gradient(
                  ${x * 3.6}deg,
                  transparent 20%,
                  rgba(255, 255, 255, 0.2) 40%,
                  rgba(91, 141, 239, 0.3) 50%,
                  rgba(255, 255, 255, 0.2) 60%,
                  transparent 80%
                )
              `
            ),
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Glowing border */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: useTransform(
              [gradientX, gradientY],
              ([x, y]) => `
                linear-gradient(
                  ${x * 3.6}deg,
                  rgba(91, 141, 239, 0.5),
                  rgba(119, 171, 149, 0.5),
                  rgba(241, 130, 57, 0.5)
                )
              `
            ),
            WebkitMaskImage: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            padding: '2px',
          }}
        />
      </motion.div>
    </div>
  )
}
