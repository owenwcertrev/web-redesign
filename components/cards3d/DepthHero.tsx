'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { ReactNode, useRef } from 'react'

interface DepthHeroProps {
  children: ReactNode
  backgroundLayers?: ReactNode[]
  className?: string
}

export default function DepthHero({
  children,
  backgroundLayers = [],
  className = ''
}: DepthHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  })

  return (
    <div
      ref={containerRef}
      className={`relative min-h-screen overflow-hidden ${className}`}
      style={{ perspective: '1500px' }}
    >
      {/* Background layers with parallax */}
      {backgroundLayers.map((layer, index) => {
        const depth = (backgroundLayers.length - index) * 50
        const y = useTransform(scrollYProgress, [0, 1], [0, depth])
        const opacity = useTransform(
          scrollYProgress,
          [0, 0.5, 1],
          [1, 0.5, 0]
        )

        return (
          <motion.div
            key={index}
            className="absolute inset-0"
            style={{
              y,
              opacity,
              transformStyle: 'preserve-3d',
              transform: `translateZ(-${depth}px) scale(${1 + depth / 1500})`,
            }}
          >
            {layer}
          </motion.div>
        )
      })}

      {/* Main content */}
      <div
        className="relative z-10"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'translateZ(0px)',
        }}
      >
        {children}
      </div>

      {/* Foreground floating elements */}
      <motion.div
        className="absolute top-1/4 right-10 w-32 h-32 bg-gradient-to-br from-primary/20 to-verification/20 rounded-3xl blur-2xl pointer-events-none"
        style={{
          y: useTransform(scrollYProgress, [0, 1], [0, -100]),
          transformStyle: 'preserve-3d',
          transform: 'translateZ(100px)',
        }}
      />

      <motion.div
        className="absolute bottom-1/4 left-10 w-40 h-40 bg-gradient-to-br from-verification/20 to-alert/20 rounded-full blur-3xl pointer-events-none"
        style={{
          y: useTransform(scrollYProgress, [0, 1], [0, -150]),
          transformStyle: 'preserve-3d',
          transform: 'translateZ(150px)',
        }}
      />
    </div>
  )
}
