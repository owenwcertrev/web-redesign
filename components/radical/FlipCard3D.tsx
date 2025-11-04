'use client'

import { motion } from 'framer-motion'
import { ReactNode, useState } from 'react'

interface FlipCard3DProps {
  front: ReactNode
  back: ReactNode
  className?: string
}

export default function FlipCard3D({ front, back, className = '' }: FlipCard3DProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div
      className={`relative h-full cursor-pointer ${className}`}
      style={{ perspective: '1500px' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
      >
        {/* Front */}
        <motion.div
          className="absolute inset-0 backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {front}
        </motion.div>

        {/* Back */}
        <motion.div
          className="absolute inset-0 backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {back}
        </motion.div>
      </motion.div>
    </div>
  )
}
