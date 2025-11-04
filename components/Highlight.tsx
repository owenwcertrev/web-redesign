interface HighlightProps {
  children: React.ReactNode
  color?: 'lime' | 'coral' | 'yellow'
}

export default function Highlight({ children, color = 'yellow' }: HighlightProps) {
  const colorClasses = {
    yellow: 'bg-gradient-to-r from-yellow-200/80 via-yellow-300/60 to-yellow-200/80',
    lime: 'bg-gradient-to-r from-lime/60 via-lime/40 to-lime/60',
    coral: 'bg-gradient-to-r from-coral/60 via-coral/40 to-coral/60',
  }

  return (
    <span className="relative inline-block">
      <span
        className={`absolute inset-0 ${colorClasses[color]} -rotate-1 rounded-sm -z-10`}
        style={{
          transform: 'rotate(-1deg) scaleX(1.05)',
          transformOrigin: 'center',
        }}
      />
      <span className="relative">{children}</span>
    </span>
  )
}
