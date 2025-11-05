'use client'

import { motion } from 'framer-motion'
import { FileCheck, Award, CheckCircle, ArrowRight } from 'lucide-react'
import TextureOverlay from './TextureOverlay'

export default function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="mt-12 sm:mt-16 md:mt-20 max-w-5xl mx-auto relative px-4"
    >
      {/* Main Visual Container */}
      <div className="relative min-h-[700px] sm:min-h-[600px] md:h-[500px]">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-lime/20 via-coral/10 to-navy/20 rounded-2xl md:rounded-[3rem] blur-3xl" />

        {/* Center: Content Document */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="absolute left-1/2 top-[30%] sm:top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[90%] max-w-[320px] md:max-w-[320px]"
        >
          <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-navy/20 shadow-2xl w-full relative overflow-hidden">
            <TextureOverlay type="paper" opacity={0.3} />
            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <FileCheck className="w-6 h-6 text-navy" />
                <span className="font-bold text-navy font-serif">Content Document</span>
              </div>
              <div className="h-2 bg-navy/10 rounded-full w-full" />
              <div className="h-2 bg-navy/10 rounded-full w-5/6" />
              <div className="h-2 bg-navy/10 rounded-full w-4/6" />
              <div className="h-2 bg-navy/10 rounded-full w-full" />
              <div className="h-2 bg-navy/10 rounded-full w-3/4" />

              {/* Verification badge overlay */}
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 2.2, type: "spring", stiffness: 200 }}
                className="absolute top-6 right-6"
              >
                <div className="w-16 h-16 rounded-full bg-lime shadow-lg flex items-center justify-center border-4 border-white">
                  <CheckCircle className="w-8 h-8 text-navy" />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Left: Credential Verification Badge */}
        <motion.div
          initial={{ x: -100, opacity: 0, rotate: -5 }}
          animate={{ x: 0, opacity: 1, rotate: 0 }}
          transition={{ delay: 1.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-1/2 -translate-x-1/2 top-4 sm:top-8 md:left-8 md:top-1/2 md:-translate-y-1/2 md:translate-x-0 z-20 w-[85%] max-w-[240px] md:max-w-[224px]"
        >
          <div className="bg-gradient-to-br from-white to-lime/5 rounded-2xl p-5 sm:p-6 border-2 border-lime shadow-xl w-full relative overflow-hidden">
            <TextureOverlay type="paper" opacity={0.2} />

            {/* Credential seal/badge */}
            <div className="relative z-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-lime to-lime-dark flex items-center justify-center mx-auto mb-3 sm:mb-4 border-4 border-white shadow-lg relative">
                <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-navy" strokeWidth={2.5} />
                {/* Inner ring decoration */}
                <div className="absolute inset-2 rounded-full border-2 border-white/30" />
              </div>

              <div className="text-center">
                <div className="text-[10px] sm:text-xs font-semibold text-navy/70 uppercase tracking-wider mb-1">Verified By</div>
                <div className="font-bold text-navy text-sm sm:text-base mb-1 sm:mb-2 font-serif">Board Certified MD</div>
                <div className="text-[10px] sm:text-xs text-black/60 mb-2 sm:mb-3 leading-relaxed">Licensed Medical Professional</div>
                <div className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-lime/20 rounded-full text-[10px] sm:text-xs font-bold text-navy border border-lime/40">
                  <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  Tier 6 Authority
                </div>
              </div>
            </div>
          </div>

          {/* Arrow to content - hidden on mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.9, duration: 0.5 }}
            className="hidden md:block absolute -right-16 top-1/2 -translate-y-1/2"
          >
            <ArrowRight className="w-8 h-8 text-lime" />
          </motion.div>
        </motion.div>

        {/* Right: Trust Metrics */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-1/2 -translate-x-1/2 bottom-4 sm:bottom-8 md:right-8 md:left-auto md:translate-x-0 md:top-1/2 md:-translate-y-1/2 md:bottom-auto z-20 w-[85%] max-w-[240px] md:max-w-[224px]"
        >
          <div className="bg-navy rounded-2xl p-5 sm:p-6 border-2 border-lime shadow-xl w-full relative overflow-hidden">
            <TextureOverlay type="grain" opacity={0.1} />
            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-lime animate-pulse" />
                <span className="text-white font-semibold text-sm">Live Verification</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-xs">Accuracy</span>
                  <span className="text-lime font-bold text-sm">98%</span>
                </div>
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "98%" }}
                    transition={{ delay: 2, duration: 1, ease: "easeOut" }}
                    className="h-full bg-lime rounded-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-xs">Citations</span>
                  <span className="text-lime font-bold text-sm">12/12</span>
                </div>
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 2.2, duration: 1, ease: "easeOut" }}
                    className="h-full bg-lime rounded-full"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-white/20">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-lime" />
                  <span className="text-white text-xs font-semibold">Verified Content</span>
                </div>
              </div>
            </div>
          </div>

          {/* Arrow from content - hidden on mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.1, duration: 0.5 }}
            className="hidden md:block absolute -left-16 top-1/2 -translate-y-1/2"
          >
            <ArrowRight className="w-8 h-8 text-coral" />
          </motion.div>
        </motion.div>

        {/* Bottom caption */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.4, duration: 0.6 }}
          className="absolute -bottom-8 sm:-bottom-12 left-1/2 -translate-x-1/2 w-full text-center px-4"
        >
          <p className="text-xs sm:text-sm text-black/60 italic">
            Human experts verify AI-powered content in real-time
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
