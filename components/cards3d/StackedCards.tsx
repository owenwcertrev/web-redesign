'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface Card {
  id: string
  content: ReactNode
}

interface StackedCardsProps {
  cards: Card[]
  className?: string
}

export default function StackedCards({ cards, className = '' }: StackedCardsProps) {

  return (
    <div className={`relative ${className}`} style={{ perspective: '2000px' }}>
      <div className="relative" style={{ minHeight: '400px' }}>
        {cards.map((card, index) => {
          const zIndex = cards.length - index
          const yOffset = index * 20
          const scale = 1 - index * 0.03
          const rotateX = -index * 2

          return (
            <motion.div
              key={card.id}
              className="absolute inset-x-0 group"
              style={{
                zIndex,
                transformStyle: 'preserve-3d',
              }}
              initial={{
                y: yOffset,
                scale,
                rotateX,
              }}
              whileHover={{
                y: yOffset - 10,
                scale: scale * 1.02,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
            >
              {/* Enhanced Shadow with depth */}
              <div
                className="absolute inset-0 bg-black/20 rounded-2xl blur-xl -z-10"
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
