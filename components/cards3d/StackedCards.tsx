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

  // Memoize card positions - only recalculate when expandedIndex or cards change
  const cardPositions = useMemo<CardPosition[]>(() => {
    return cards.map((_, index) => {
      const isExpanded = expandedIndex === index
      const isAfterExpanded = expandedIndex !== null && index > expandedIndex

      let zIndex = cards.length - index
      let yOffset = index * 20
      let scale = 1 - index * 0.03
      let rotateX = -index * 2

      if (isExpanded) {
        zIndex = 1000
        yOffset = 0
        scale = 1.05
        rotateX = 0
      } else if (isAfterExpanded) {
        yOffset = (expandedIndex * 20) + ((index - expandedIndex) * 20) + 100
      }

      return { zIndex, yOffset, scale, rotateX }
    })
  }, [cards, expandedIndex])

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
    <div className={`relative ${className}`} style={{ perspective: '2000px' }}>
      <div className="relative" style={{ minHeight: '400px' }}>
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
                transformStyle: 'preserve-3d',
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
              onHoverStart={() => handleHoverStart(index)}
              onHoverEnd={handleHoverEnd}
              whileHover={hoverAnimation}
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

                {/* Expand/Collapse Icon - appears on hover */}
                {!isExpanded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    className="absolute bottom-4 right-4 w-10 h-10 bg-navy rounded-full flex items-center justify-center shadow-lg"
                  >
                    <ChevronDown className="w-5 h-5 text-white" />
                  </motion.div>
                )}

                {/* Collapse Icon - always visible when expanded */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute bottom-4 right-4 w-10 h-10 bg-black rounded-full flex items-center justify-center shadow-lg"
                  >
                    <ChevronUp className="w-5 h-5 text-white" />
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
