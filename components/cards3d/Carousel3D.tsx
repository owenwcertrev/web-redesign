'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode, useState, useMemo, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { usePrefersReducedMotion } from '@/hooks/usePerformance'

interface Carousel3DProps {
  items: ReactNode[]
  className?: string
}

// Position calculation results
interface CardPosition {
  x: number
  z: number
  rotateY: number
  scale: number
  opacity: number
  zIndex: number
  visible: boolean // NEW: Only render visible cards
}

export default function Carousel3D({ items, className = '' }: Carousel3DProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const prefersReducedMotion = usePrefersReducedMotion()

  const navigate = useCallback((direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1))
    } else {
      setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1))
    }
  }, [items.length])

  // Memoize position calculations - only recalculate when currentIndex changes
  const getCardPosition = useCallback((index: number): CardPosition => {
    const diff = index - currentIndex
    const position = ((diff + items.length) % items.length)

    if (position === 0) {
      // Center (active)
      return {
        x: 0,
        z: 0,
        rotateY: 0,
        scale: 1,
        opacity: 1,
        zIndex: 30,
        visible: true,
      }
    } else if (position === 1 || position === items.length - 1) {
      // Adjacent cards
      const side = position === 1 ? 1 : -1
      return {
        x: side * 350,
        z: -300,
        rotateY: side * -35,
        scale: 0.85,
        opacity: 0.6,
        zIndex: 20,
        visible: true,
      }
    } else if (position === 2 || position === items.length - 2) {
      // Far cards
      const side = position === 2 ? 1 : -1
      return {
        x: side * 550,
        z: -500,
        rotateY: side * -45,
        scale: 0.7,
        opacity: 0.3,
        zIndex: 10,
        visible: true,
      }
    } else {
      // Hidden cards - DON'T RENDER
      return {
        x: 0,
        z: -800,
        rotateY: 0,
        scale: 0.5,
        opacity: 0,
        zIndex: 0,
        visible: false,
      }
    }
  }, [currentIndex, items.length])

  // Only render visible cards (5 instead of all 6)
  const visibleCards = useMemo(() => {
    return items
      .map((item, index) => ({
        item,
        index,
        position: getCardPosition(index),
      }))
      .filter(card => card.position.visible)
  }, [items, getCardPosition])

  // Optimized transitions - active card gets spring, others get faster easing
  const getTransition = useCallback((isActive: boolean) => {
    if (prefersReducedMotion) {
      return { duration: 0.1 }
    }

    if (isActive) {
      // Active card: smooth spring animation
      return {
        type: 'spring' as const,
        stiffness: 200, // Reduced from 260
        damping: 30,
      }
    } else {
      // Inactive cards: faster duration-based animation
      return {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1] as const, // easeInOut
      }
    }
  }, [prefersReducedMotion])

  return (
    <div className={`relative ${className}`}>
      {/* 3D Container */}
      <div
        className="relative h-[500px] flex items-center justify-center overflow-visible"
        style={{ perspective: '2000px', perspectiveOrigin: 'center' }}
      >
        <AnimatePresence initial={false}>
          {visibleCards.map(({ item, index, position }) => {
            const isActive = index === currentIndex

            return (
              <motion.div
                key={`carousel-card-${index}`}
                className="absolute"
                style={{
                  transformStyle: 'preserve-3d',
                  zIndex: position.zIndex,
                  // Add will-change hint ONLY to active card for GPU acceleration
                  willChange: isActive ? 'transform, opacity' : 'auto',
                }}
                initial={false}
                animate={{
                  x: position.x,
                  z: position.z,
                  rotateY: position.rotateY,
                  scale: position.scale,
                  opacity: position.opacity,
                }}
                transition={getTransition(isActive)}
                onClick={() => !isActive && setCurrentIndex(index)}
              >
                <div
                  className={`w-full max-w-[400px] ${
                    isActive ? 'cursor-default' : 'cursor-pointer hover:scale-105'
                  } transition-transform`}
                >
                  {item}
                </div>

                {/* Shadow - simplified calculation for performance */}
                <div
                  className="absolute inset-0 bg-black/20 rounded-2xl blur-2xl -z-10"
                  style={{
                    transform: `translateY(${20 + position.z / 10}px) scale(${0.9 - position.z / 2000})`,
                  }}
                />
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={() => navigate('prev')}
          className="w-12 h-12 rounded-full bg-white border-2 border-black/10 hover:border-navy/30 hover:bg-navy/5 transition-all flex items-center justify-center group shadow-lg"
        >
          <ChevronLeft className="w-5 h-5 text-black/60 group-hover:text-navy transition-colors" />
        </button>

        {/* Indicators */}
        <div className="flex gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-navy'
                  : 'w-2 bg-black/20 hover:bg-black/40'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => navigate('next')}
          className="w-12 h-12 rounded-full bg-white border-2 border-black/10 hover:border-navy/30 hover:bg-navy/5 transition-all flex items-center justify-center group shadow-lg"
        >
          <ChevronRight className="w-5 h-5 text-black/60 group-hover:text-navy transition-colors" />
        </button>
      </div>
    </div>
  )
}
