'use client'

import { motion } from 'framer-motion'
import { Award, CheckCircle } from 'lucide-react'
import TextureOverlay from './TextureOverlay'

interface ExpertProfileProps {
  name: string
  credentials: string
  specialty: string
  bio: string
  imagePlaceholder?: string
  tier?: number
  variant?: 'card' | 'inline'
}

export default function ExpertProfile({
  name,
  credentials,
  specialty,
  bio,
  imagePlaceholder = 'Expert Photo',
  tier,
  variant = 'card'
}: ExpertProfileProps) {
  if (variant === 'inline') {
    return (
      <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border-2 border-lime/20 relative overflow-hidden">
        <TextureOverlay type="paper" opacity={0.2} />
        <div className="w-16 h-16 rounded-full bg-lime/20 flex items-center justify-center flex-shrink-0 text-xs text-navy font-semibold border-2 border-lime/40 relative z-10">
          {imagePlaceholder}
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-navy font-serif text-lg">{name}</h3>
            <CheckCircle className="w-4 h-4 text-lime" />
          </div>
          <div className="text-sm text-coral font-semibold mb-1">{credentials}</div>
          <div className="text-sm text-black/70">{specialty}</div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl p-8 border-2 border-lime/20 relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col"
    >
      <TextureOverlay type="paper" opacity={0.2} />

      {/* Photo placeholder */}
      <div className="relative z-10 mb-6">
        <div className="w-24 h-24 rounded-full bg-lime/10 flex items-center justify-center mx-auto text-sm text-navy font-semibold border-2 border-lime/30">
          {imagePlaceholder}
        </div>
      </div>

      {/* Name and credentials */}
      <div className="relative z-10 text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <h3 className="text-2xl font-bold text-navy font-serif">{name}</h3>
          <CheckCircle className="w-5 h-5 text-lime" />
        </div>
        <div className="text-coral font-semibold mb-1">{credentials}</div>
        {tier && (
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-lime/10 rounded-full text-xs font-semibold text-navy">
            <Award className="w-3 h-3" />
            Tier {tier} Expert
          </div>
        )}
      </div>

      {/* Specialty */}
      <div className="relative z-10 text-center mb-4">
        <p className="text-sm font-semibold text-black/70 uppercase tracking-wide">
          {specialty}
        </p>
      </div>

      {/* Bio */}
      <div className="relative z-10 flex-grow">
        <p className="text-black/70 leading-relaxed text-center">
          {bio}
        </p>
      </div>
    </motion.div>
  )
}
