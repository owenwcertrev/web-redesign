'use client'

import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react'

type ObserverCallback = (isIntersecting: boolean) => void

interface IntersectionObserverContextValue {
  observe: (element: Element, callback: ObserverCallback, options?: IntersectionObserverInit) => () => void
}

const IntersectionObserverContext = createContext<IntersectionObserverContextValue | null>(null)

/**
 * Shared IntersectionObserver Provider
 * Reduces number of observers by pooling them based on options
 */
export function IntersectionObserverProvider({ children }: { children: ReactNode }) {
  const observersRef = useRef<Map<string, IntersectionObserver>>(new Map())
  const callbacksRef = useRef<Map<Element, ObserverCallback>>(new Map())

  const observe = (
    element: Element,
    callback: ObserverCallback,
    options: IntersectionObserverInit = {}
  ) => {
    // Create a key based on options to pool observers
    const key = JSON.stringify({
      root: options.root,
      rootMargin: options.rootMargin || '0px 0px -20% 0px',
      threshold: options.threshold || 0,
    })

    // Get or create observer for these options
    if (!observersRef.current.has(key)) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const cb = callbacksRef.current.get(entry.target)
          if (cb) {
            cb(entry.isIntersecting)
          }
        })
      }, {
        ...options,
        rootMargin: options.rootMargin || '0px 0px -20% 0px',
      })
      observersRef.current.set(key, observer)
    }

    const observer = observersRef.current.get(key)!
    callbacksRef.current.set(element, callback)
    observer.observe(element)

    // Return cleanup function
    return () => {
      observer.unobserve(element)
      callbacksRef.current.delete(element)
    }
  }

  // Cleanup all observers on unmount
  useEffect(() => {
    return () => {
      observersRef.current.forEach((observer) => observer.disconnect())
      observersRef.current.clear()
      callbacksRef.current.clear()
    }
  }, [])

  return (
    <IntersectionObserverContext.Provider value={{ observe }}>
      {children}
    </IntersectionObserverContext.Provider>
  )
}

/**
 * Hook to use shared IntersectionObserver
 * Automatically cleans up on unmount
 *
 * @param options - IntersectionObserver options
 * @param once - Whether to unobserve after first intersection (default: true)
 */
export function useSharedIntersectionObserver(
  options?: IntersectionObserverInit,
  once: boolean = true
) {
  const context = useContext(IntersectionObserverContext)
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const ref = useRef<Element | null>(null)
  const unobserveRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (!context || !ref.current) return

    // If 'once' mode and already intersected, don't observe again
    if (once && hasIntersected) return

    const cleanup = context.observe(
      ref.current,
      (intersecting) => {
        setIsIntersecting(intersecting)
        if (intersecting && once) {
          setHasIntersected(true)
          // Unobserve after first intersection
          if (unobserveRef.current) {
            unobserveRef.current()
            unobserveRef.current = null
          }
        }
      },
      options
    )

    unobserveRef.current = cleanup
    return cleanup
  }, [context, hasIntersected, once, options])

  return { ref, isIntersecting: once ? hasIntersected : isIntersecting }
}
