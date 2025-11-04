'use client'

import { motion } from 'framer-motion'
import { ReactNode, useState } from 'react'

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

  return (
    <div className={`relative ${className}`} style={{ perspective: '2000px' }}>
      <div className="relative" style={{ minHeight: '400px' }}>
        {cards.map((card, index) => {
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
            yOffset = (expandedIndex! * 20) + ((index - expandedIndex!) * 20) + 100
          }

          return (
            <motion.div
              key={card.id}
              className="absolute inset-x-0 cursor-pointer"
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
              whileHover={!isExpanded ? { scale: scale * 1.02, y: yOffset - 5 } : {}}
            >
              {/* Shadow */}
              <div
                className="absolute inset-0 bg-black/10 rounded-2xl blur-xl -z-10"
                style={{ transform: 'translateY(10px)' }}
              />

              {/* Card */}
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                {card.content}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
