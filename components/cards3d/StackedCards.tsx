'use client'

import { motion, Variants } from 'framer-motion'
import { ReactNode, useState, useMemo, useCallback } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { usePrefersReducedMotion } from '@/hooks/usePerformance'

interface Card {
  id: string
  content: ReactNode
}

interface StackedCardsProps {
  cards: Card[]
  className?: string
}

// Memoized position calculator
interface CardPosition {
  zIndex: number
  yOffset: number
  scale: number
  rotateX: number
}

export default function StackedCards({ cards, className = '' }: StackedCardsProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  // Detect mobile/tablet
  const [isMobile, setIsMobile] = useState(false)

  // Set up mobile detection
  useMemo(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => setIsMobile(window.innerWidth < 768)
      checkMobile()
      window.addEventListener('resize', checkMobile)
      return () => window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Memoize card positions - only recalculate when expandedIndex, cards, or viewport changes
  const cardPositions = useMemo<CardPosition[]>(() => {
    return cards.map((_, index) => {
      const isExpanded = expandedIndex === index
      const isAfterExpanded = expandedIndex !== null && index > expandedIndex

      let zIndex = cards.length - index
      // Increased mobile spacing: 60px vs 20px on desktop
      let yOffset = index * (isMobile ? 60 : 20)
      // Less aggressive scale on mobile
      let scale = 1 - index * (isMobile ? 0.01 : 0.03)
      // No 3D rotation on mobile for better compatibility
      let rotateX = isMobile ? 0 : -index * 2

      if (isExpanded) {
        zIndex = 1000
        yOffset = 0
        scale = isMobile ? 1 : 1.05
        rotateX = 0
      } else if (isAfterExpanded) {
        const baseOffset = isMobile ? 60 : 20
        yOffset = (expandedIndex * baseOffset) + ((index - expandedIndex) * baseOffset) + (isMobile ? 150 : 100)
      }

      return { zIndex, yOffset, scale, rotateX }
    })
  }, [cards, expandedIndex, isMobile])

  // Memoized transition config
  const springTransition = useMemo(() => {
    if (prefersReducedMotion) {
      return { duration: 0.2 }
    }
    return {
      type: 'spring' as const,
      stiffness: 200, // Reduced from 300
      damping: 30,
    }
  }, [prefersReducedMotion])

  // Memoized callbacks
  const handleCardClick = useCallback((index: number) => {
    setExpandedIndex(prev => prev === index ? null : index)
  }, [])

  const handleHoverStart = useCallback((index: number) => {
    setHoveredIndex(index)
  }, [])

  const handleHoverEnd = useCallback(() => {
    setHoveredIndex(null)
  }, [])

  return (
    <div
      className={`relative ${className}`}
      style={{
        // Disable 3D perspective on mobile for better compatibility
        perspective: isMobile ? 'none' : '2000px'
      }}
    >
      <div
        className="relative"
        style={{
          // Responsive min-height
          minHeight: isMobile ? '500px' : '400px'
        }}
      >
        {cards.map((card, index) => {
          const isExpanded = expandedIndex === index
          const isHovered = hoveredIndex === index
          const position = cardPositions[index]

          // Inline hover animation (can't use useMemo inside map)
          const hoverAnimation = (isExpanded || prefersReducedMotion) ? {} : {
            scale: position.scale * 1.02,
            y: position.yOffset - 5,
          }

          return (
            <motion.div
              key={card.id}
              className="absolute inset-x-0 cursor-pointer group"
              style={{
                zIndex: position.zIndex,
                // Disable preserve-3d on mobile
                transformStyle: isMobile ? 'flat' : 'preserve-3d',
                // Add will-change only to hovered or expanded cards
                willChange: (isHovered || isExpanded) ? 'transform' : 'auto',
              }}
              animate={{
                y: position.yOffset,
                scale: position.scale,
                rotateX: position.rotateX,
              }}
              transition={springTransition}
              onClick={() => handleCardClick(index)}
              onHoverStart={() => !isMobile && handleHoverStart(index)}
              onHoverEnd={() => !isMobile && handleHoverEnd()}
              onTouchStart={() => isMobile && handleHoverStart(index)}
              onTouchEnd={() => isMobile && handleHoverEnd()}
              whileHover={hoverAnimation}
              whileTap={isMobile ? { scale: position.scale * 0.98 } : {}}
            >
              {/* Enhanced Shadow with depth */}
              <div
                className="absolute inset-0 bg-black/20 rounded-2xl blur-xl -z-10"
                style={{ transform: 'translateY(10px)' }}
              />

              {/* Card */}
              <div className={`bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
                isHovered && !isExpanded ? 'ring-2 ring-navy/30' : ''
              }`}>
                {card.content}

                {/* Expand/Collapse Icon - always visible on mobile, hover on desktop */}
                {!isExpanded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isMobile || isHovered ? 1 : 0 }}
                    className={`absolute bottom-3 right-3 ${isMobile ? 'w-14 h-14' : 'w-10 h-10'} bg-navy rounded-full flex items-center justify-center shadow-lg`}
                  >
                    <ChevronDown className={`${isMobile ? 'w-6 h-6' : 'w-5 h-5'} text-white`} />
                  </motion.div>
                )}

                {/* Collapse Icon - always visible when expanded */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`absolute bottom-3 right-3 ${isMobile ? 'w-14 h-14' : 'w-10 h-10'} bg-black rounded-full flex items-center justify-center shadow-lg`}
                  >
                    <ChevronUp className={`${isMobile ? 'w-6 h-6' : 'w-5 h-5'} text-white`} />
                  </motion.div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
