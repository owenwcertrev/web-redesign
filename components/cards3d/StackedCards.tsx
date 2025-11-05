'use client'

import { motion, AnimatePresence } from 'framer-motion'
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
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className={`space-y-6 ${className}`}>
      {cards.map((card, index) => {
        const isExpanded = expandedIndex === index
        const isHovered = hoveredIndex === index

        return (
          <motion.div
            key={card.id}
            className="cursor-pointer group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setExpandedIndex(isExpanded ? null : index)}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
          >
            {/* Card */}
            <motion.div
              className={`rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${
                isHovered ? 'shadow-2xl' : ''
              }`}
              whileHover={{ scale: 1.01, y: -2 }}
            >
              <AnimatePresence mode="wait">
                {isExpanded ? (
                  <motion.div
                    key="expanded"
                    initial={{ opacity: 0, height: 'auto' }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {card.content}
                  </motion.div>
                ) : (
                  <motion.div
                    key="collapsed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                  >
                    {/* Collapsed preview - extract title from content */}
                    <div className="p-6 bg-white border-2 border-charcoal/10 hover:border-navy/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {/* Extract the step badge and title from content */}
                          <div className="flex items-center gap-4">
                            {/* Step number badge */}
                            <div className="inline-block px-4 py-1 bg-navy/10 rounded-full">
                              <span className="text-sm font-semibold text-navy tracking-wide">
                                STEP {index + 1}
                              </span>
                            </div>
                            {/* Title */}
                            <h3 className="text-2xl md:text-3xl font-bold text-navy font-serif">
                              {index === 0 ? 'Submit Your Content' : index === 1 ? 'Expert Review Process' : 'Receive Certification'}
                            </h3>
                          </div>
                        </div>
                        <motion.div
                          className="w-10 h-10 bg-navy/10 hover:bg-navy rounded-full flex items-center justify-center transition-colors"
                          whileHover={{ scale: 1.1 }}
                        >
                          <ChevronDown className="w-5 h-5 text-navy group-hover:text-white transition-colors" />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Collapse button for expanded state */}
              {isExpanded && (
                <div className="relative">
                  <button
                    className="absolute bottom-4 right-4 w-12 h-12 bg-navy hover:bg-navy/90 rounded-full flex items-center justify-center shadow-lg z-10 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      setExpandedIndex(null)
                    }}
                  >
                    <ChevronUp className="w-6 h-6 text-white" />
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )
      })}
    </div>
  )
}
