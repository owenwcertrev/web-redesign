'use client'

import { useEffect, useState, useCallback, useRef } from 'react'

/**
 * Hook to detect if user prefers reduced motion
 * Respects accessibility preferences and improves battery life
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(query.matches)

    const handleChange = (e: MediaQueryListEvent) => setPrefersReduced(e.matches)
    query.addEventListener('change', handleChange)

    return () => query.removeEventListener('change', handleChange)
  }, [])

  return prefersReduced
}

/**
 * Hook to throttle callbacks (e.g., mouse move, resize events)
 * Limits execution to specified FPS for performance
 *
 * @param callback - Function to throttle
 * @param fps - Target frames per second (default: 60)
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  fps: number = 60
): T {
  const lastRun = useRef(Date.now())
  const throttleMs = 1000 / fps

  return useCallback(
    ((...args) => {
      const now = Date.now()
      if (now - lastRun.current >= throttleMs) {
        lastRun.current = now
        callback(...args)
      }
    }) as T,
    [callback, throttleMs]
  )
}

/**
 * Hook to cache expensive calculations that depend on window size
 * Updates only on resize, with debouncing
 *
 * @param calculateValue - Function to calculate the value
 * @param debounceMs - Debounce delay in milliseconds (default: 300)
 */
export function useCachedWindowValue<T>(
  calculateValue: () => T,
  debounceMs: number = 300
): T {
  const [value, setValue] = useState<T>(calculateValue)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setValue(calculateValue())
      }, debounceMs)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [calculateValue, debounceMs])

  return value
}

/**
 * Hook to detect if device is touch-only (for disabling mouse interactions)
 */
export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    setIsTouch(
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      // @ts-ignore - legacy property
      navigator.msMaxTouchPoints > 0
    )
  }, [])

  return isTouch
}
