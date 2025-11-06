import { Variants, Transition } from 'framer-motion'

/**
 * Reusable animation variants to prevent recreation on every render
 * Improves performance by memoizing animation configurations
 */

// Common fade and slide up animation
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

// Fade in from left
export const fadeInLeftVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
}

// Fade in from right
export const fadeInRightVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
}

// Simple fade
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

// Scale up animation
export const scaleUpVariants: Variants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
}

// Stagger children container
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

// Common viewport configuration
export const viewportConfig = {
  once: true,
  margin: '0px 0px -10% 0px',
}

// Optimized transition configurations
// Use these instead of spring animations for better performance

// Fast transition (for UI interactions)
export const fastTransition: Transition = {
  duration: 0.2,
  ease: [0.4, 0, 0.2, 1], // easeInOut
}

// Standard transition (most animations)
export const standardTransition: Transition = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1],
}

// Slow transition (for emphasis)
export const slowTransition: Transition = {
  duration: 0.5,
  ease: [0.4, 0, 0.2, 1],
}

// Smooth transition (for floating/subtle animations)
export const smoothTransition: Transition = {
  duration: 0.6,
  ease: 'easeInOut',
}

// Only use spring for important interactions that need physics
export const springTransition: Transition = {
  type: 'spring',
  stiffness: 200, // Reduced from typical 300-400
  damping: 25,
}

// Aggressive spring (for snappy interactions)
export const snappySpringTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
}
