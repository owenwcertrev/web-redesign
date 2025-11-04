'use client'

import { Camera, Users, Award, TrendingUp } from 'lucide-react'
import TextureOverlay from './TextureOverlay'
import { motion } from 'framer-motion'

interface LifestyleImagePlaceholderProps {
  variant?: 'hero' | 'inline' | 'feature'
  caption?: string
  aspectRatio?: 'video' | 'square' | 'portrait'
}

export default function LifestyleImagePlaceholder({
  variant = 'hero',
  caption,
  aspectRatio = 'video'
}: LifestyleImagePlaceholderProps) {
  const aspectClasses = {
    video: 'aspect-video',
    square: 'aspect-square',
    portrait: 'aspect-[4/5]'
  }

  if (variant === 'hero') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="mt-16 max-w-4xl mx-auto"
      >
        <div className={`relative ${aspectClasses[aspectRatio]} rounded-3xl overflow-hidden border-2 border-navy/20 shadow-2xl bg-gradient-to-br from-beige via-white to-lime/10`}>
          <TextureOverlay type="paper" opacity={0.4} />

          {/* Placeholder content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4 relative z-10">
              <div className="flex justify-center gap-6 mb-4">
                <div className="w-16 h-16 rounded-full bg-lime/20 flex items-center justify-center border-2 border-lime/40">
                  <Users className="w-8 h-8 text-navy" />
                </div>
                <div className="w-16 h-16 rounded-full bg-coral/20 flex items-center justify-center border-2 border-coral/40">
                  <Award className="w-8 h-8 text-navy" />
                </div>
                <div className="w-16 h-16 rounded-full bg-navy/10 flex items-center justify-center border-2 border-navy/40">
                  <TrendingUp className="w-8 h-8 text-navy" />
                </div>
              </div>
              <Camera className="w-12 h-12 text-navy/30 mx-auto" />
              <p className="text-sm font-semibold text-navy/50 tracking-wide uppercase">
                Lifestyle Hero Image
              </p>
              <p className="text-xs text-navy/40 max-w-xs mx-auto">
                Professionals collaborating on content verification
              </p>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-4 left-4 w-20 h-20 rounded-full bg-lime/20 blur-2xl" />
          <div className="absolute bottom-4 right-4 w-32 h-32 rounded-full bg-coral/20 blur-3xl" />
        </div>
        {caption && (
          <p className="text-center text-sm text-black/60 mt-4 italic">
            {caption}
          </p>
        )}
      </motion.div>
    )
  }

  if (variant === 'inline') {
    return (
      <div className={`relative ${aspectClasses[aspectRatio]} rounded-2xl overflow-hidden border-2 border-navy/10 shadow-md bg-gradient-to-br from-beige to-white`}>
        <TextureOverlay type="paper" opacity={0.3} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-3 relative z-10">
            <Camera className="w-8 h-8 text-navy/30 mx-auto" />
            <p className="text-xs font-semibold text-navy/40 tracking-wide uppercase">
              Lifestyle Image
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Feature variant
  return (
    <div className={`relative ${aspectClasses[aspectRatio]} rounded-2xl overflow-hidden border-2 border-lime/20 shadow-lg bg-gradient-to-br from-white via-lime/5 to-beige`}>
      <TextureOverlay type="paper" opacity={0.3} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-3 relative z-10">
          <div className="w-16 h-16 rounded-full bg-lime/20 flex items-center justify-center border-2 border-lime/40 mx-auto">
            <Users className="w-8 h-8 text-navy" />
          </div>
          <Camera className="w-10 h-10 text-navy/30 mx-auto" />
          <p className="text-sm font-semibold text-navy/50 tracking-wide uppercase">
            Feature Image
          </p>
        </div>
      </div>
      <div className="absolute top-6 right-6 w-24 h-24 rounded-full bg-lime/20 blur-2xl" />
    </div>
  )
}
