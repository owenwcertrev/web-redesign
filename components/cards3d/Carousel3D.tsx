'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Carousel3DProps {
  items: ReactNode[]
  className?: string
}

export default function Carousel3D({ items, className = '' }: Carousel3DProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const navigate = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1))
    } else {
      setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1))
    }
  }

  const getCardPosition = (index: number) => {
    const diff = index - currentIndex
    const position = ((diff + items.length) % items.length)

    if (position === 0) {
      // Center (active)
      return {
        x: 0,
        z: 0,
        rotateY: 0,
        scale: 1,
        opacity: 1,
        zIndex: 30,
      }
    } else if (position === 1 || position === items.length - 1) {
      // Adjacent cards
      const side = position === 1 ? 1 : -1
      return {
        x: side * 350,
        z: -300,
        rotateY: side * -35,
        scale: 0.85,
        opacity: 0.6,
        zIndex: 20,
      }
    } else if (position === 2 || position === items.length - 2) {
      // Far cards
      const side = position === 2 ? 1 : -1
      return {
        x: side * 550,
        z: -500,
        rotateY: side * -45,
        scale: 0.7,
        opacity: 0.3,
        zIndex: 10,
      }
    } else {
      // Hidden cards
      return {
        x: 0,
        z: -800,
        rotateY: 0,
        scale: 0.5,
        opacity: 0,
        zIndex: 0,
      }
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* 3D Container */}
      <div
        className="relative h-[500px] flex items-center justify-center overflow-visible"
        style={{ perspective: '2000px', perspectiveOrigin: 'center' }}
      >
        <AnimatePresence initial={false}>
          {items.map((item, index) => {
            const position = getCardPosition(index)
            const isActive = index === currentIndex

            return (
              <motion.div
                key={index}
                className="absolute"
                style={{
                  transformStyle: 'preserve-3d',
                  zIndex: position.zIndex,
                }}
                initial={false}
                animate={{
                  x: position.x,
                  z: position.z,
                  rotateY: position.rotateY,
                  scale: position.scale,
                  opacity: position.opacity,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 30,
                }}
                onClick={() => !isActive && setCurrentIndex(index)}
              >
                <div
                  className={`w-[400px] ${
                    isActive ? 'cursor-default' : 'cursor-pointer hover:scale-105'
                  } transition-transform`}
                >
                  {item}
                </div>

                {/* Shadow */}
                <div
                  className="absolute inset-0 bg-black/20 rounded-2xl blur-2xl -z-10"
                  style={{
                    transform: `translateY(${20 + position.z / 10}px) scale(${0.9 - position.z / 2000})`,
                  }}
                />
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={() => navigate('prev')}
          className="w-12 h-12 rounded-full bg-white border-2 border-black/10 hover:border-navy/30 hover:bg-navy/5 transition-all flex items-center justify-center group shadow-lg"
        >
          <ChevronLeft className="w-5 h-5 text-black/60 group-hover:text-navy transition-colors" />
        </button>

        {/* Indicators */}
        <div className="flex gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-navy'
                  : 'w-2 bg-black/20 hover:bg-black/40'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => navigate('next')}
          className="w-12 h-12 rounded-full bg-white border-2 border-black/10 hover:border-navy/30 hover:bg-navy/5 transition-all flex items-center justify-center group shadow-lg"
        >
          <ChevronRight className="w-5 h-5 text-black/60 group-hover:text-navy transition-colors" />
        </button>
      </div>
    </div>
  )
}
