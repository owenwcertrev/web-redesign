'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface AccordionItem {
  question: string
  answer: string
}

interface AccordionProps {
  items: AccordionItem[]
  category?: string
}

export default function Accordion({ items, category }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="space-y-4">
      {category && (
        <h3 className="text-xl font-bold text-navy mb-4 font-serif">{category}</h3>
      )}
      {items.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl border-2 border-navy/10 shadow-sm overflow-hidden hover:border-navy/20 transition-colors"
        >
          <button
            onClick={() => toggleItem(index)}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between text-left hover:bg-beige/30 transition-colors"
          >
            <span className="font-semibold text-sm sm:text-base text-navy pr-3 sm:pr-4">{item.question}</span>
            <motion.div
              animate={{ rotate: openIndex === index ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0"
            >
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-coral" />
            </motion.div>
          </button>
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="px-4 sm:px-6 pb-3 sm:pb-4 pt-2 text-sm sm:text-base text-black/70 leading-relaxed">
                  {item.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
