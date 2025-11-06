'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'

interface LazySectionProps {
  children: ReactNode
  className?: string
  rootMargin?: string
  threshold?: number
  fallback?: ReactNode
}

/**
 * Lazy load sections below the fold using IntersectionObserver
 * Only renders children when section enters viewport
 * Improves initial page load performance
 */
export default function LazySection({
  children,
  className = '',
  rootMargin = '400px', // Start loading 400px before visible
  threshold = 0,
  fallback = null,
}: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            // Once loaded, disconnect to save resources
            observer.disconnect()
          }
        })
      },
      {
        rootMargin,
        threshold,
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [rootMargin, threshold])

  return (
    <div ref={ref} className={className}>
      {isInView ? children : fallback}
    </div>
  )
}
