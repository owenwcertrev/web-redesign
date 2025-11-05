'use client'

import { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'

interface StatCardProps {
  stat: string
  description: string
  source: string
  icon?: LucideIcon
}

export default function StatCard({ stat, description, source, icon: Icon }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-white rounded-3xl p-8 shadow-base border border-black/5 hover:shadow-xl hover:border-navy/20 transition-all duration-300 group h-full flex flex-col"
    >
      {Icon && (
        <motion.div
          className="mb-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-navy/10 to-lime/10 flex items-center justify-center"
          whileHover={{ rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          <Icon className="w-7 h-7 text-navy group-hover:scale-110 transition-transform" />
        </motion.div>
      )}
      <div className="text-5xl font-bold bg-gradient-to-br from-navy to-lime bg-clip-text text-transparent mb-4">
        {stat}
      </div>
      <p className="text-charcoal/80 mb-3 leading-relaxed flex-grow">{description}</p>
      <p className="text-xs text-charcoal/50 font-medium mt-auto">{source}</p>
    </motion.div>
  )
}
