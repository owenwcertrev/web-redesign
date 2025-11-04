'use client'

import { motion } from 'framer-motion'
import { ReactNode, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface Card {
  id: string
  content: ReactNode
}

interface StackedCardsProps {
  cards: Card[]
  className?: string
}

export default function StackedCards({ cards, className = '' }: StackedCardsProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className={`relative ${className}`} style={{ perspective: '2000px' }}>
      <div className="relative" style={{ minHeight: expandedIndex !== null ? '800px' : '400px' }}>
        {cards.map((card, index) => {
          const isExpanded = expandedIndex === index
          const isHovered = hoveredIndex === index
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
            yOffset = (expandedIndex! * 20) + ((index - expandedIndex!) * 20) + 100
          }

          return (
            <motion.div
              key={card.id}
              className="absolute inset-x-0 cursor-pointer group"
              style={{
                zIndex,
                transformStyle: 'preserve-3d',
              }}
              animate={{
                y: yOffset,
                scale,
                rotateX,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
              onClick={() => setExpandedIndex(isExpanded ? null : index)}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              whileHover={!isExpanded ? { scale: scale * 1.02, y: yOffset - 5 } : {}}
            >
              {/* Enhanced Shadow with depth */}
              <div
                className="absolute inset-0 bg-black/20 rounded-2xl blur-xl -z-10"
                style={{ transform: 'translateY(10px)' }}
              />

              {/* Card */}
              <div className={`relative bg-white rounded-2xl shadow-2xl transition-all duration-300 ${
                isHovered && !isExpanded ? 'ring-2 ring-primary/30' : ''
              } ${!isExpanded ? 'max-h-[200px] overflow-hidden' : ''}`}>
                {card.content}

                {/* Gradient fade for collapsed cards */}
                {!isExpanded && (
                  <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
                )}

                {/* Expand/Collapse Icon - appears on hover */}
                {!isExpanded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    className="absolute bottom-4 right-4 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg"
                  >
                    <ChevronDown className="w-5 h-5 text-white" />
                  </motion.div>
                )}

                {/* Collapse Icon - always visible when expanded */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute bottom-4 right-4 w-10 h-10 bg-charcoal rounded-full flex items-center justify-center shadow-lg"
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
