'use client'

import { motion } from 'framer-motion'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

export type VerificationState = 'pending' | 'processing' | 'verified' | 'failed'

interface VerificationProgressProps {
  state: VerificationState
  message?: string
  timestamp?: string
  className?: string
}

const stateConfig = {
  pending: {
    icon: Loader2,
    color: 'text-charcoal/40',
    bgColor: 'bg-charcoal/5',
    borderColor: 'border-charcoal/10',
    label: 'PENDING',
    spinning: false,
  },
  processing: {
    icon: Loader2,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/30',
    label: 'VERIFYING',
    spinning: true,
  },
  verified: {
    icon: CheckCircle2,
    color: 'text-verification',
    bgColor: 'bg-verification/10',
    borderColor: 'border-verification/30',
    label: 'VERIFIED',
    spinning: false,
  },
  failed: {
    icon: AlertCircle,
    color: 'text-alert',
    bgColor: 'bg-alert/10',
    borderColor: 'border-alert/30',
    label: 'REVIEW NEEDED',
    spinning: false,
  },
}

export default function VerificationProgress({
  state,
  message,
  timestamp,
  className = ''
}: VerificationProgressProps) {
  const config = stateConfig[state]
  const Icon = config.icon

  return (
    <div className={`relative ${className}`}>
      {/* Glass morphism card */}
      <div className={`
        relative overflow-hidden
        bg-white/60 backdrop-blur-xl
        border ${config.borderColor}
        rounded-xl p-4
        transition-all duration-500
      `}>
        {/* Animated gradient background */}
        {state === 'processing' && (
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(91,141,239,0.1), transparent)',
            }}
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        )}

        {/* Content */}
        <div className="relative flex items-start gap-4">
          {/* Icon */}
          <motion.div
            className={`
              flex-shrink-0 w-10 h-10 rounded-lg
              ${config.bgColor} ${config.borderColor} border
              flex items-center justify-center
            `}
            animate={config.spinning ? { rotate: 360 } : {}}
            transition={config.spinning ? {
              duration: 2,
              repeat: Infinity,
              ease: 'linear'
            } : {}}
          >
            <Icon className={`w-5 h-5 ${config.color}`} />
          </motion.div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            {/* Status Label */}
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-mono font-bold tracking-wider ${config.color}`}>
                {config.label}
              </span>
              {state === 'processing' && (
                <motion.div
                  className="flex gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className={`w-1 h-1 rounded-full ${config.bgColor.replace('/10', '/60')}`}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </div>

            {/* Message */}
            {message && (
              <p className="text-sm text-charcoal/80 mb-2 leading-relaxed">
                {message}
              </p>
            )}

            {/* Timestamp */}
            {timestamp && (
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-charcoal/10 to-transparent" />
                <span className="text-[10px] font-mono text-charcoal/40 tracking-wider">
                  {timestamp}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Success celebration particles */}
        {state === 'verified' && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-verification"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos((i * Math.PI * 2) / 6) * 40,
                  y: Math.sin((i * Math.PI * 2) / 6) * 40,
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 1,
                  ease: 'easeOut',
                }}
              />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
