'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode, useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(() => {
      navigate('next')
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [currentIndex, autoPlay, autoPlayInterval])

  const navigate = (dir: 'prev' | 'next') => {
    if (dir === 'prev') {
      setDirection(-1)
      setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1))
    } else {
      setDirection(1)
      setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1))
    }
  }

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  // Get visible items (3 at once, wrapping around)
  const getVisibleItems = () => {
    const visible = []
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % items.length
      visible.push({ item: items[index], originalIndex: index })
    }
    return visible
  }

  const visibleItems = getVisibleItems()

  return (
    <div className={`relative ${className}`}>
      {/* Carousel Container with horizontal slide animation */}
      <div className="relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ x: direction > 0 ? 1000 : -1000 }}
            animate={{ x: 0 }}
            exit={{ x: direction > 0 ? -1000 : 1000 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 auto-rows-fr"
          >
            {visibleItems.map(({ item, originalIndex }, idx) => (
              <div key={`${currentIndex}-${idx}`} className="h-full">
                {item}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={() => navigate('prev')}
          className="w-12 h-12 rounded-full bg-white border-2 border-navy/10 hover:border-lime/40 hover:bg-lime/5 transition-all flex items-center justify-center group shadow-lg"
          aria-label="Previous expert"
        >
          <ChevronLeft className="w-5 h-5 text-navy/60 group-hover:text-navy transition-colors" />
        </button>

        {/* Dot Indicators */}
        <div className="flex gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-lime'
                  : 'w-2 bg-navy/20 hover:bg-navy/40'
              }`}
              aria-label={`Go to expert ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => navigate('next')}
          className="w-12 h-12 rounded-full bg-white border-2 border-navy/10 hover:border-lime/40 hover:bg-lime/5 transition-all flex items-center justify-center group shadow-lg"
          aria-label="Next expert"
        >
          <ChevronRight className="w-5 h-5 text-navy/60 group-hover:text-navy transition-colors" />
        </button>
      </div>
    </div>
  )
}
