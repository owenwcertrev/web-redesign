'use client'

import { motion } from 'framer-motion'
import { Shield, Lock, Eye, Database } from 'lucide-react'

export type TrustMetric = 'verified' | 'encrypted' | 'transparent' | 'immutable'

interface TrustIndicatorProps {
  metric: TrustMetric
  value?: string
  label?: string
  pulse?: boolean
  className?: string
}

const metricConfig = {
  verified: {
    icon: Shield,
    color: 'text-navy',
    bgColor: 'bg-navy/10',
    borderColor: 'border-navy/30',
    defaultLabel: 'Expert Verified',
    defaultValue: '✓',
  },
  encrypted: {
    icon: Lock,
    color: 'text-navy',
    bgColor: 'bg-navy/10',
    borderColor: 'border-navy/30',
    defaultLabel: 'Secure',
    defaultValue: 'AES-256',
  },
  transparent: {
    icon: Eye,
    color: 'text-coral',
    bgColor: 'bg-coral/10',
    borderColor: 'border-coral/30',
    defaultLabel: 'Transparent',
    defaultValue: 'Public',
  },
  immutable: {
    icon: Database,
    color: 'text-coral',
    bgColor: 'bg-coral/10',
    borderColor: 'border-coral/30',
    defaultLabel: 'Immutable',
    defaultValue: 'Blockchain',
  },
}

export default function TrustIndicator({
  metric,
  value,
  label,
  pulse = false,
  className = ''
}: TrustIndicatorProps) {
  const config = metricConfig[metric]
  const Icon = config.icon
  const displayValue = value || config.defaultValue
  const displayLabel = label || config.defaultLabel

  return (
    <motion.div
      className={`
        inline-flex items-center gap-2.5
        px-4 py-2.5
        bg-white/60 backdrop-blur-xl
        border ${config.borderColor}
        rounded-xl
        ${className}
      `}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Icon with pulse effect */}
      <div className="relative">
        <motion.div
          className={`
            w-8 h-8 rounded-lg
            ${config.bgColor}
            flex items-center justify-center
            border ${config.borderColor}
          `}
        >
          <Icon className={`w-4 h-4 ${config.color}`} />
        </motion.div>

        {pulse && (
          <motion.div
            className={`absolute inset-0 rounded-lg ${config.bgColor} opacity-75`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </div>

      {/* Label - show only if value is empty, otherwise show both */}
      {displayValue === '' ? (
        <span className="text-sm font-semibold text-navy">
          {displayLabel}
        </span>
      ) : (
        <div className="flex flex-col">
          <span className="text-[10px] font-mono uppercase tracking-wider text-black/50">
            {displayLabel}
          </span>
          <span className={`text-sm font-mono font-semibold ${config.color}`}>
            {displayValue}
          </span>
        </div>
      )}
    </motion.div>
  )
}
