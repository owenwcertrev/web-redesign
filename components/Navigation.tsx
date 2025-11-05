'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from './Button'

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [brandHovered, setBrandHovered] = useState(false)
  const [expertHovered, setExpertHovered] = useState(false)
  const [brandExpanded, setBrandExpanded] = useState(false)
  const [expertExpanded, setExpertExpanded] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-beige border-b border-black/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-navy hover:text-navy/80 transition-colors">
            CertREV
          </Link>

          {/* Desktop Navigation - Right aligned */}
          <div className="hidden lg:flex items-center gap-8 ml-auto mr-4">
            <Link href="/book-demo" className="text-black hover:text-coral transition-colors">
              Book Demo
            </Link>
            <Link href="/eeat-meter" className="text-black hover:text-coral transition-colors">
              E-E-A-T Meter
            </Link>
            <Link href="/how-it-works" className="text-black hover:text-coral transition-colors">
              How It Works
            </Link>
          </div>

          {/* Dashboard CTAs - Desktop and Tablet */}
          <div className="hidden md:flex items-center gap-3">
            {/* Brand Dashboard - Orange button with Blue icon (left) */}
            <div
              className="relative"
              onMouseEnter={() => setBrandHovered(true)}
              onMouseLeave={() => setBrandHovered(false)}
              onClick={() => setBrandExpanded(!brandExpanded)}
            >
              <div className="flex items-center">
                <AnimatePresence>
                  {(brandHovered || brandExpanded) && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 40, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 25,
                        mass: 0.5
                      }}
                      className="overflow-hidden"
                    >
                      <Link
                        href="/brand-dashboard"
                        className="flex items-center justify-center w-10 h-10 bg-navy hover:bg-navy/90 transition-colors rounded-l-lg border-2 border-r-0 border-navy"
                      >
                        <User className="w-4 h-4 text-white" />
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
                <Button
                  variant="secondary"
                  size="sm"
                  asChild
                  className={`!bg-coral hover:!bg-coral/90 !text-white !border-coral ${brandHovered || brandExpanded ? 'rounded-l-none' : ''}`}
                >
                  <Link href="/brand-dashboard">Brand Dashboard</Link>
                </Button>
              </div>
            </div>

            {/* Expert Dashboard - Blue button with Orange icon (right) */}
            <div
              className="relative"
              onMouseEnter={() => setExpertHovered(true)}
              onMouseLeave={() => setExpertHovered(false)}
              onClick={() => setExpertExpanded(!expertExpanded)}
            >
              <div className="flex items-center">
                <Button
                  variant="primary"
                  size="sm"
                  asChild
                  className={expertHovered || expertExpanded ? 'rounded-r-none' : ''}
                >
                  <Link href="/expert-dashboard">Expert Dashboard</Link>
                </Button>
                <AnimatePresence>
                  {(expertHovered || expertExpanded) && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 40, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 25,
                        mass: 0.5
                      }}
                      className="overflow-hidden"
                    >
                      <Link
                        href="/expert-dashboard"
                        className="flex items-center justify-center w-10 h-10 bg-coral hover:bg-coral/90 transition-colors rounded-r-lg border-2 border-l-0 border-coral"
                      >
                        <User className="w-4 h-4 text-white" />
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-black hover:text-coral transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-black/5 bg-beige">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/book-demo"
              className="block py-2 text-black hover:text-coral transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Book Demo
            </Link>
            <Link
              href="/eeat-meter"
              className="block py-2 text-black hover:text-coral transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              E-E-A-T Meter
            </Link>
            <Link
              href="/how-it-works"
              className="block py-2 text-black hover:text-coral transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <div className="pt-3 space-y-2 border-t border-black/5">
              <Button variant="secondary" size="sm" className="w-full !bg-coral hover:!bg-coral/90 !text-white !border-coral" asChild>
                <Link href="/brand-dashboard">Brand Dashboard</Link>
              </Button>
              <Button variant="primary" size="sm" className="w-full" asChild>
                <Link href="/expert-dashboard">Expert Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
