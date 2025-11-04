'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Button from './Button'

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-beige/95 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-navy hover:text-navy/80 transition-colors">
            CertREV
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/human-layer" className="text-black hover:text-coral transition-colors">
              The Human Layer
            </Link>
            <Link href="/eeat-meter" className="text-black hover:text-coral transition-colors">
              E-E-A-T Meter
            </Link>
            <Link href="/how-it-works" className="text-black hover:text-coral transition-colors">
              How It Works
            </Link>
          </div>

          {/* Dashboard CTAs - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="primary" size="sm" asChild>
              <Link href="/brand-dashboard">Brand Dashboard</Link>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="!bg-lime hover:!bg-lime/90 hover:!text-navy !text-navy !border-lime"
              asChild
            >
              <Link href="/expert-dashboard">Expert Dashboard</Link>
            </Button>
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
              href="/human-layer"
              className="block py-2 text-black hover:text-coral transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              The Human Layer
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
              <Button variant="primary" size="sm" className="w-full" asChild>
                <Link href="/brand-dashboard">Brand Dashboard</Link>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="w-full !bg-lime hover:!bg-lime/90 hover:!text-navy !text-navy !border-lime"
                asChild
              >
                <Link href="/expert-dashboard">Expert Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
