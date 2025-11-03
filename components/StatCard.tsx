import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  stat: string
  description: string
  source: string
  icon?: LucideIcon
}

export default function StatCard({ stat, description, source, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-16 p-6 shadow-base border border-black/5 transition-all duration-300 hover:shadow-md">
      {Icon && (
        <div className="mb-4">
          <Icon className="w-8 h-8 text-primary" />
        </div>
      )}
      <div className="text-4xl font-bold text-primary mb-3">{stat}</div>
      <p className="text-charcoal mb-2 leading-relaxed">{description}</p>
      <p className="text-sm text-charcoal/60">{source}</p>
    </div>
  )
}
