'use client'

import { ReactNode } from 'react'

interface DepthHeroProps {
  children: ReactNode
  backgroundLayers?: ReactNode[]
  className?: string
}

export default function DepthHero({
  children,
  backgroundLayers = [],
  className = ''
}: DepthHeroProps) {
  return (
    <div
      className={`relative min-h-screen overflow-hidden ${className}`}
    >
      {/* Background layers - static without hooks */}
      {backgroundLayers.map((layer, index) => (
        <div
          key={index}
          className="absolute inset-0"
        >
          {layer}
        </div>
      ))}

      {/* Main content */}
      <div
        className="relative z-10"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'translateZ(0px)',
        }}
      >
        {children}
      </div>
    </div>
  )
}
