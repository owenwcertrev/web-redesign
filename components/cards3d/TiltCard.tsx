'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ReactNode, MouseEvent, useCallback, useMemo } from 'react'
import { usePrefersReducedMotion, useThrottledCallback, useIsTouchDevice } from '@/hooks/usePerformance'

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
  const prefersReducedMotion = usePrefersReducedMotion()
  const isTouchDevice = useIsTouchDevice()

  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)

  // Reduce spring stiffness for better performance (400 → 200)
  // Disable tilt for reduced motion or touch devices
  const springConfig = useMemo(() => ({
    stiffness: prefersReducedMotion ? 100 : 200,
    damping: 30
  }), [prefersReducedMotion])

  const rotateX = useSpring(
    useTransform(y, [0, 1], [intensity * 10, -intensity * 10]),
    springConfig
  )
  const rotateY = useSpring(
    useTransform(x, [0, 1], [-intensity * 10, intensity * 10]),
    springConfig
  )

  const glowX = useTransform(x, [0, 1], ['0%', '100%'])
  const glowY = useTransform(y, [0, 1], ['0%', '100%'])

  // Memoize glow background transform (must be before early return)
  const glowBackground = useTransform(
    glowX,
    (xVal) => `radial-gradient(circle at ${xVal} 50%, ${glowColor}, transparent 60%)`
  )

  // Memoized mouse move handler
  const handleMouseMoveRaw = useCallback((e: MouseEvent<HTMLDivElement>) => {
    // Skip tilt on touch devices or reduced motion
    if (isTouchDevice || prefersReducedMotion) return

    const rect = e.currentTarget.getBoundingClientRect()
    const newX = (e.clientX - rect.left) / rect.width
    const newY = (e.clientY - rect.top) / rect.height
    x.set(newX)
    y.set(newY)
  }, [x, y, isTouchDevice, prefersReducedMotion])

  // Throttle to 60fps (16.67ms) to prevent excessive updates
  const handleMouseMove = useThrottledCallback(handleMouseMoveRaw, 60)

  const handleMouseLeave = useCallback(() => {
    x.set(0.5)
    y.set(0.5)
  }, [x, y])

  // Disable tilt effect entirely on touch devices
  if (isTouchDevice || prefersReducedMotion) {
    return (
      <div className={`relative w-full h-full ${className}`}>
        {children}
      </div>
    )
  }

  return (
    <div style={{ perspective: '1500px' }} className="w-full h-full">
      <motion.div
        className={`relative w-full h-full ${className}`}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          // Add will-change for GPU acceleration on desktop only
          willChange: 'transform',
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
            background: glowBackground,
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
