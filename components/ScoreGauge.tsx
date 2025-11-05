'use client'

import { cn } from '@/lib/utils'

interface ScoreGaugeProps {
  score: number
  label: string
  className?: string
}

export default function ScoreGauge({ score, label, className }: ScoreGaugeProps) {
  const getColor = (score: number) => {
    if (score >= 71) return 'text-lime'
    if (score >= 41) return 'text-coral'
    return 'text-red-500'
  }

  const getStrokeColor = (score: number) => {
    if (score >= 71) return '#A7C4BC'
    if (score >= 41) return '#F59E0B'
    return '#EF4444'
  }

  const circumference = 2 * Math.PI * 70
  const offset = circumference - (score / 100) * circumference

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="relative w-48 h-48">
        <svg className="transform -rotate-90" width="192" height="192">
          {/* Background circle */}
          <circle
            cx="96"
            cy="96"
            r="70"
            stroke="#e5e7eb"
            strokeWidth="12"
            fill="none"
          />
          {/* Score circle */}
          <circle
            cx="96"
            cy="96"
            r="70"
            stroke={getStrokeColor(score)}
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('text-5xl font-bold', getColor(score))}>{score}</span>
          <span className="text-sm text-charcoal/60 mt-1">out of 100</span>
        </div>
      </div>
      <p className="mt-4 text-lg font-medium text-charcoal">{label}</p>
    </div>
  )
}
