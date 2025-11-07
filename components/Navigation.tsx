'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X, User } from 'lucide-react'
import Button from './Button'

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-beige border-b border-black/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <Image src="/logo.png" alt="CertREV" width={40} height={40} className="w-10 h-10" />
            <span className="text-2xl font-bold text-navy">CertREV</span>
          </Link>

          {/* Desktop Navigation - Right aligned */}
          <div className="hidden lg:flex items-center gap-12 ml-auto mr-12 flex-shrink-0">
            <Link href="/book-demo" className="text-black hover:text-coral transition-colors text-base whitespace-nowrap">
              Book Demo
            </Link>
            <Link href="/eeat-meter" className="text-black hover:text-coral transition-colors text-base whitespace-nowrap">
              E-E-A-T Meter
            </Link>
            <Link href="/how-it-works" className="text-black hover:text-coral transition-colors text-base whitespace-nowrap">
              How It Works
            </Link>
            <Link href="/pricing" className="text-black hover:text-coral transition-colors text-base whitespace-nowrap">
              Pricing
            </Link>
          </div>

          {/* Dashboard CTAs - Desktop and Tablet */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {/* Brand Dashboard Preview */}
            <Button
              variant="primary"
              size="sm"
              asChild
              className="!bg-coral hover:!bg-coral/90 !text-white !border-coral whitespace-nowrap"
            >
              <Link href="/brand-dashboard">Brand Dashboard</Link>
            </Button>

            {/* Expert Dashboard Preview */}
            <Button
              variant="secondary"
              size="sm"
              asChild
              className="whitespace-nowrap"
            >
              <Link href="/expert-dashboard">Expert Dashboard</Link>
            </Button>

            {/* Profile Login Button */}
            <Link
              href="https://dashboard.certrev.com/auth/login"
              className="flex items-center justify-center w-10 h-10 bg-navy/10 hover:bg-navy/20 transition-colors rounded-lg border-2 border-navy/20 hover:border-navy/30 flex-shrink-0"
              aria-label="Sign in"
            >
              <User className="w-5 h-5 text-navy" />
            </Link>
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
              className="block py-3 text-base text-black hover:text-coral transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Book Demo
            </Link>
            <Link
              href="/eeat-meter"
              className="block py-3 text-base text-black hover:text-coral transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              E-E-A-T Meter
            </Link>
            <Link
              href="/how-it-works"
              className="block py-3 text-base text-black hover:text-coral transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="/pricing"
              className="block py-3 text-base text-black hover:text-coral transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <div className="pt-3 space-y-2 border-t border-black/5">
              <Button variant="primary" size="sm" className="w-full !bg-coral hover:!bg-coral/90 !text-white !border-coral" asChild>
                <Link href="/brand-dashboard" onClick={() => setMobileMenuOpen(false)}>Brand Dashboard</Link>
              </Button>
              <Button variant="secondary" size="sm" className="w-full" asChild>
                <Link href="/expert-dashboard" onClick={() => setMobileMenuOpen(false)}>Expert Dashboard</Link>
              </Button>
              <div className="pt-3 border-t border-black/5">
                <Link
                  href="https://dashboard.certrev.com/auth/login"
                  className="block py-2 px-4 text-center text-sm text-navy font-semibold border-2 border-navy rounded-lg hover:bg-navy hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
