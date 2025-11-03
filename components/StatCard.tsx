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
      className="bg-white rounded-3xl p-8 shadow-base border border-black/5 hover:shadow-xl hover:border-primary/20 transition-all duration-300 group"
    >
      {Icon && (
        <motion.div
          className="mb-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-verification/10 flex items-center justify-center"
          whileHover={{ rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          <Icon className="w-7 h-7 text-primary group-hover:scale-110 transition-transform" />
        </motion.div>
      )}
      <div className="text-5xl font-bold bg-gradient-to-br from-primary to-verification bg-clip-text text-transparent mb-4">
        {stat}
      </div>
      <p className="text-charcoal/80 mb-3 leading-relaxed">{description}</p>
      <p className="text-xs text-charcoal/50 font-medium">{source}</p>
    </motion.div>
  )
}
