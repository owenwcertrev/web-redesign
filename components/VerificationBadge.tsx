import { CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VerificationBadgeProps {
  className?: string
  size?: 'sm' | 'md'
}

export default function VerificationBadge({ className, size = 'md' }: VerificationBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 bg-lime-light rounded-full text-lime-dark shadow-[0_2px_8px_rgba(167,196,188,0.15)]',
        {
          'px-2 py-1 text-xs': size === 'sm',
          'px-3 py-1.5 text-sm': size === 'md',
        },
        className
      )}
    >
      <CheckCircle className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      <span className="font-semibold">verified</span>
    </span>
  )
}
