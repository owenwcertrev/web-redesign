'use client'

import { useEffect } from 'react'

export default function SmoothResize() {
  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleResize = () => {
      // Add class to disable transitions during resize
      document.body.classList.add('resizing')

      // Clear existing timeout
      clearTimeout(timeoutId)

      // Remove class after resize is complete
      timeoutId = setTimeout(() => {
        document.body.classList.remove('resizing')
      }, 300)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [])

  return null
}
