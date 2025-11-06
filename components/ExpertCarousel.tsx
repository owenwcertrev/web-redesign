'use client'

import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
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
  const [currentIndex, setCurrentIndex] = useState(items.length) // Start from middle
  const [isHovered, setIsHovered] = useState(false)
  const [dragStart, setDragStart] = useState(0)
  const constraintsRef = useRef<HTMLDivElement>(null)

  // Responsive cards per view
  const [cardsPerView, setCardsPerView] = useState(3)

  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth < 640) {
        setCardsPerView(1)
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2)
      } else {
        setCardsPerView(3)
      }
    }

    updateCardsPerView()
    window.addEventListener('resize', updateCardsPerView)
    return () => window.removeEventListener('resize', updateCardsPerView)
  }, [])

  // Triple the items for infinite scroll
  const extendedItems = [...items, ...items, ...items]

  // Auto-play with pause on hover
  useEffect(() => {
    if (!autoPlay || isHovered) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1)
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [autoPlay, autoPlayInterval, isHovered])

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

  const next = () => {
    setCurrentIndex((prev) => prev + 1)
  }

  const prev = () => {
    setCurrentIndex((prev) => prev - 1)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(items.length + index)
  }

  // Calculate display index for dots
  const displayIndex = ((currentIndex - items.length) % items.length + items.length) % items.length

  // Calculate card width and gap (smaller gap on mobile)
  const gapRem = typeof window !== 'undefined' && window.innerWidth < 640 ? 1.0 : 1.5 // 16px mobile, 24px desktop
  const translateX = -(currentIndex * (100 / cardsPerView)) - (currentIndex * gapRem)

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
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 0.8
          }}
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
        >
          {extendedItems.map((item, index) => (
            <motion.div
              key={index}
              className="flex-shrink-0"
              style={{
                width: `calc(${100 / cardsPerView}% - ${(cardsPerView - 1) * gapRem / cardsPerView}rem)`
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="h-full pointer-events-auto">
                {item}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Navigation Arrows */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <motion.button
          onClick={prev}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 rounded-full bg-white border-2 border-navy/10 hover:border-lime/40 hover:bg-lime/5 transition-all flex items-center justify-center group shadow-lg hover:shadow-xl"
          aria-label="Previous expert"
        >
          <ChevronLeft className="w-5 h-5 text-navy/60 group-hover:text-navy transition-colors" />
        </motion.button>

        {/* Dot Indicators with animation */}
        <div className="flex gap-2">
          {items.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="relative"
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
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        <motion.button
          onClick={next}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 rounded-full bg-white border-2 border-navy/10 hover:border-lime/40 hover:bg-lime/5 transition-all flex items-center justify-center group shadow-lg hover:shadow-xl"
          aria-label="Next expert"
        >
          <ChevronRight className="w-5 h-5 text-navy/60 group-hover:text-navy transition-colors" />
        </motion.button>
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
