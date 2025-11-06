'use client'

import { motion } from 'framer-motion'
import { ReactNode, useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { usePrefersReducedMotion, useCachedWindowValue } from '@/hooks/usePerformance'

interface ExpertCarouselProps {
  items: ReactNode[]
  className?: string
  autoPlay?: boolean
  autoPlayInterval?: number
}

export default function ExpertCarousel({
  items,
  className = '',
  autoPlay = false,
  autoPlayInterval = 5000
}: ExpertCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(items.length) // Start from middle
  const [isHovered, setIsHovered] = useState(false)
  const [dragStart, setDragStart] = useState(0)
  const constraintsRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  // Responsive cards per view - debounced with cached window value
  const cardsPerView = useCachedWindowValue(() => {
    if (typeof window === 'undefined') return 3
    if (window.innerWidth < 640) return 1
    if (window.innerWidth < 1024) return 2
    return 3
  }, 300)

  // Virtualization: Only render visible cards + buffer
  const visibleRange = useMemo(() => {
    const buffer = 2 // Render 2 cards before/after visible
    const start = Math.max(0, currentIndex - buffer)
    const end = Math.min(items.length * 3, currentIndex + cardsPerView + buffer)
    return { start, end }
  }, [currentIndex, cardsPerView, items.length])

  // Only create extended items for visible range
  const extendedItems = useMemo(() => {
    return [...items, ...items, ...items]
  }, [items])

  // Virtualized cards - only render what's needed
  const visibleCards = useMemo(() => {
    return extendedItems.slice(visibleRange.start, visibleRange.end).map((item, idx) => ({
      item,
      globalIndex: visibleRange.start + idx,
    }))
  }, [extendedItems, visibleRange])

  // Memoized navigation functions
  const next = useCallback(() => {
    setCurrentIndex((prev) => prev + 1)
  }, [])

  const prev = useCallback(() => {
    setCurrentIndex((prev) => prev - 1)
  }, [])

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(items.length + index)
  }, [items.length])

  // Auto-play with pause on hover
  useEffect(() => {
    if (!autoPlay || isHovered || prefersReducedMotion) return

    const interval = setInterval(next, autoPlayInterval)
    return () => clearInterval(interval)
  }, [autoPlay, autoPlayInterval, isHovered, prefersReducedMotion, next])

  // Smooth infinite loop reset (no visible jump)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex >= items.length * 2) {
        setCurrentIndex(items.length)
      } else if (currentIndex < items.length) {
        setCurrentIndex(items.length * 2 - 1)
      }
    }, 300) // Wait for animation to settle

    return () => clearTimeout(timer)
  }, [currentIndex, items.length])

  // Calculate display index for dots
  const displayIndex = useMemo(() =>
    ((currentIndex - items.length) % items.length + items.length) % items.length,
    [currentIndex, items.length]
  )

  // Memoized calculations
  const { gapRem, translateX } = useMemo(() => {
    const gap = cardsPerView === 1 ? 1.0 : 1.5
    const translate = -(currentIndex * (100 / cardsPerView)) - (currentIndex * gap)
    return { gapRem: gap, translateX: translate }
  }, [cardsPerView, currentIndex])

  // Optimized transition
  const carouselTransition = useMemo(() => {
    if (prefersReducedMotion) {
      return { duration: 0.2 }
    }
    return {
      type: 'spring' as const,
      stiffness: 200, // Reduced from 300
      damping: 30,
      mass: 0.8
    }
  }, [prefersReducedMotion])

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Fade edges for polish */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none hidden md:block" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none hidden md:block" />

      {/* Carousel Container */}
      <div className="overflow-hidden" ref={constraintsRef}>
        <motion.div
          className="flex gap-4 sm:gap-6"
          animate={{
            x: `calc(${translateX}% - ${translateX / 100 * gapRem}rem)`
          }}
          transition={carouselTransition}
          drag="x"
          dragConstraints={constraintsRef}
          dragElastic={0.1}
          onDragStart={(e, info) => {
            setDragStart(info.point.x)
          }}
          onDragEnd={(e, info) => {
            const dragDistance = info.point.x - dragStart
            if (Math.abs(dragDistance) > 50) {
              if (dragDistance > 0) {
                prev()
              } else {
                next()
              }
            }
          }}
          style={{
            // Offset for virtualization - shift left by start index
            marginLeft: `calc(-${visibleRange.start * (100 / cardsPerView)}% - ${visibleRange.start * gapRem}rem)`
          }}
        >
          {visibleCards.map(({ item, globalIndex }) => {
            const isActive = globalIndex === currentIndex

            return (
              <motion.div
                key={`expert-card-${globalIndex}`}
                className="flex-shrink-0"
                style={{
                  width: `calc(${100 / cardsPerView}% - ${(cardsPerView - 1) * gapRem / cardsPerView}rem)`,
                  // Add will-change only to cards near active position
                  willChange: Math.abs(globalIndex - currentIndex) <= 1 ? 'transform' : 'auto',
                }}
                whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="h-full pointer-events-auto">
                  {item}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* Navigation Arrows - CSS transitions instead of Framer Motion */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={prev}
          className="w-12 h-12 rounded-full bg-white border-2 border-navy/10 hover:border-lime/40 hover:bg-lime/5 hover:scale-110 active:scale-95 transition-all flex items-center justify-center group shadow-lg hover:shadow-xl"
          aria-label="Previous expert"
        >
          <ChevronLeft className="w-5 h-5 text-navy/60 group-hover:text-navy transition-colors" />
        </button>

        {/* Dot Indicators with CSS transitions */}
        <div className="flex gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="relative hover:scale-120 active:scale-90 transition-transform"
              aria-label={`Go to expert ${index + 1}`}
            >
              <div className={`h-2 rounded-full transition-all duration-300 ${
                index === displayIndex
                  ? 'w-8 bg-lime'
                  : 'w-2 bg-navy/20 hover:bg-navy/40'
              }`} />
              {index === displayIndex && (
                <motion.div
                  layoutId="activeDot"
                  className="absolute inset-0 bg-lime/20 rounded-full"
                  initial={false}
                  transition={prefersReducedMotion ? { duration: 0.1 } : { type: "spring", stiffness: 200, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        <button
          onClick={next}
          className="w-12 h-12 rounded-full bg-white border-2 border-navy/10 hover:border-lime/40 hover:bg-lime/5 hover:scale-110 active:scale-95 transition-all flex items-center justify-center group shadow-lg hover:shadow-xl"
          aria-label="Next expert"
        >
          <ChevronRight className="w-5 h-5 text-navy/60 group-hover:text-navy transition-colors" />
        </button>
      </div>

      {/* Auto-play indicator */}
      {autoPlay && !isHovered && (
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-1 h-1 rounded-full bg-lime"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </motion.div>
      )}
    </div>
  )
}
