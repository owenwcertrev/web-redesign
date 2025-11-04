'use client'

import { motion } from 'framer-motion'
import { ReactNode, useState } from 'react'

interface DeckCard {
  id: string
  title: string
  content: ReactNode
  color: string
}

interface CardDeckProps {
  cards: DeckCard[]
  className?: string
}

export default function CardDeck({ cards, className = '' }: CardDeckProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const selectedCard = cards.find(card => card.id === selectedId)

  return (
    <>
      <div className={`relative ${className}`} style={{ perspective: '1500px' }}>
        <div className="flex gap-4 justify-center flex-wrap">
          {cards.map((card, index) => {
            const isHovered = hoveredId === card.id
            const isSelected = selectedId === card.id

            return (
              <motion.div
                key={card.id}
                layoutId={card.id}
                className="relative cursor-pointer"
                style={{
                  transformStyle: 'preserve-3d',
                }}
                initial={{
                  rotateY: -index * 3,
                  x: index * -20,
                }}
                animate={{
                  rotateY: isHovered && !isSelected ? -5 : isSelected ? 0 : -index * 3,
                  x: isHovered && !isSelected ? 0 : isSelected ? 0 : index * -20,
                  scale: isHovered && !isSelected ? 1.05 : 1,
                  zIndex: isHovered ? 50 : isSelected ? 100 : index,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 25,
                }}
                onClick={() => setSelectedId(card.id)}
                onHoverStart={() => setHoveredId(card.id)}
                onHoverEnd={() => setHoveredId(null)}
              >
                {/* Shadow */}
                <div
                  className="absolute inset-0 bg-black/20 rounded-2xl blur-xl"
                  style={{
                    transform: 'translateZ(-10px) translateY(10px)',
                  }}
                />

                {/* Card */}
                <div
                  className={`w-72 h-96 rounded-2xl p-8 ${card.color} border-2 border-white/20 backdrop-blur-sm flex flex-col justify-between`}
                  style={{
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  }}
                >
                  <div>
                    <div className="text-sm font-mono text-white/60 mb-4">
                      STEP {index + 1}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      {card.title}
                    </h3>
                  </div>

                  <div className="text-xs font-mono text-white/40">
                    TAP TO EXPAND →
                  </div>

                  {/* Top edge highlight */}
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Expanded Card Modal */}
      {selectedCard && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1000] flex items-center justify-center p-4"
          onClick={() => setSelectedId(null)}
        >
          <motion.div
            layoutId={selectedCard.id}
            className={`w-full max-w-2xl rounded-3xl p-12 ${selectedCard.color} border-2 border-white/20`}
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-sm font-mono text-white/60 mb-4">
              STEP {cards.findIndex(c => c.id === selectedCard.id) + 1}
            </div>
            <h2 className="text-4xl font-bold text-white mb-8">
              {selectedCard.title}
            </h2>
            <div className="text-white/90 text-lg leading-relaxed">
              {selectedCard.content}
            </div>

            <button
              onClick={() => setSelectedId(null)}
              className="mt-8 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl text-white font-medium transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}
