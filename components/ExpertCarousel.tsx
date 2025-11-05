'use client'

import { motion } from 'framer-motion'
import { ReactNode, useState, useEffect } from 'react'
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
  const cardsPerView = 3

  // Duplicate items for infinite scroll effect
  const extendedItems = [...items, ...items, ...items]
  const startIndex = items.length // Start from the middle set

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1)
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [autoPlay, autoPlayInterval])

  // Reset to middle when reaching boundaries
  useEffect(() => {
    if (currentIndex >= items.length * 2) {
      setTimeout(() => {
        setCurrentIndex(items.length)
      }, 500)
    } else if (currentIndex < items.length) {
      setTimeout(() => {
        setCurrentIndex(items.length * 2 - 1)
      }, 500)
    }
  }, [currentIndex, items.length])

  const next = () => {
    setCurrentIndex((prev) => prev + 1)
  }

  const prev = () => {
    setCurrentIndex((prev) => prev - 1)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(startIndex + index)
  }

  // Calculate the display index for dot indicators
  const displayIndex = ((currentIndex - startIndex) % items.length + items.length) % items.length

  return (
    <div className={`relative ${className}`}>
      {/* Carousel Container */}
      <div className="overflow-hidden">
        <motion.div
          className="flex gap-6"
          animate={{
            x: `calc(-${(currentIndex * 100) / cardsPerView}% - ${currentIndex * 1.5}rem)`
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        >
          {extendedItems.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0"
              style={{ width: `calc(${100 / cardsPerView}% - ${(cardsPerView - 1) * 1.5 / cardsPerView}rem)` }}
            >
              <div className="h-full">
                {item}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Navigation Arrows */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={prev}
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
                index === displayIndex
                  ? 'w-8 bg-lime'
                  : 'w-2 bg-navy/20 hover:bg-navy/40'
              }`}
              aria-label={`Go to expert ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="w-12 h-12 rounded-full bg-white border-2 border-navy/10 hover:border-lime/40 hover:bg-lime/5 transition-all flex items-center justify-center group shadow-lg"
          aria-label="Next expert"
        >
          <ChevronRight className="w-5 h-5 text-navy/60 group-hover:text-navy transition-colors" />
        </button>
      </div>
    </div>
  )
}
