import { cn } from '@/lib/utils'

interface StatusIndicatorProps {
  status: 'verified' | 'inReview' | 'pending'
  className?: string
}

export default function StatusIndicator({ status, className }: StatusIndicatorProps) {
  const config = {
    verified: {
      color: 'bg-verification',
      text: 'Verified',
      textColor: 'text-verification-dark',
    },
    inReview: {
      color: 'bg-alert',
      text: 'In Review',
      textColor: 'text-amber-900',
    },
    pending: {
      color: 'bg-gray-400',
      text: 'Pending',
      textColor: 'text-gray-700',
    },
  }

  const { color, text, textColor } = config[status]

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <span className={cn('w-2 h-2 rounded-full', color)} />
      <span className={cn('text-sm font-medium', textColor)}>{text}</span>
    </div>
  )
}
