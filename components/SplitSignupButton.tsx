'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'
import { Building2, GraduationCap } from 'lucide-react'

export default function SplitSignupButton() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="relative inline-flex w-full sm:w-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-0 w-full sm:w-auto justify-center">
        <AnimatePresence>
          {isHovered ? (
            <>
              {/* Brand Signup - Orange/Coral */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 'auto' }}
                exit={{ width: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 25,
                }}
                className="overflow-hidden"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.15, duration: 0.2 }}
                >
                  <Link
                    href="https://dashboard.certrev.com/auth/signup?type=brand"
                    className="flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 bg-coral hover:bg-coral/90 text-white font-semibold text-base sm:text-lg rounded-l-2xl border-2 border-coral shadow-lg transition-all hover:shadow-xl whitespace-nowrap"
                  >
                    <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden xs:inline">Sign Up as Brand</span>
                    <span className="xs:hidden">Brand</span>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Expert Signup - Navy/Blue */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 'auto' }}
                exit={{ width: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 25,
                }}
                className="overflow-hidden"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.15, duration: 0.2 }}
                >
                  <Link
                    href="https://dashboard.certrev.com/auth/signup?type=expert"
                    className="flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 bg-navy hover:bg-navy/90 text-white font-semibold text-base sm:text-lg rounded-r-2xl border-2 border-navy shadow-lg transition-all hover:shadow-xl whitespace-nowrap"
                  >
                    <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden xs:inline">Sign Up as Expert</span>
                    <span className="xs:hidden">Expert</span>
                  </Link>
                </motion.div>
              </motion.div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-coral text-white font-semibold text-base sm:text-lg rounded-2xl border-2 border-coral shadow-lg cursor-pointer whitespace-nowrap text-center">
                Sign Up
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
