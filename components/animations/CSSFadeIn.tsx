'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

interface CSSFadeInProps {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
}

/**
 * Lightweight CSS-based fade-in animation using IntersectionObserver
 * Replaces Framer Motion FadeIn for better performance
 * Reduces bundle size by ~10-15KB per usage
 */
export default function CSSFadeIn({
  children,
  delay = 0,
  duration = 0.6,
  className = ''
}: CSSFadeInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px',
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}s`,
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {children}
    </div>
  )
}
