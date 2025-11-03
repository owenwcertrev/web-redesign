import { ArrowRight, Check } from 'lucide-react'
import Button from './Button'

interface TierCardProps {
  tierNumber: number
  tierName: string
  credits: number
  credentials: string[]
}

export default function TierCard({ tierNumber, tierName, credits, credentials }: TierCardProps) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-base border border-black/5 transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
      {/* Tier Header */}
      <h3 className="text-sm font-semibold tracking-wider mb-2 text-primary">
        TIER {tierNumber}
      </h3>
      <h4 className="text-3xl font-light mb-6 text-charcoal">
        {tierName}
      </h4>

      {/* Sage Green Credit Badge - matches design system */}
      <div className="inline-flex items-center gap-2 bg-verification-light px-4 py-2 rounded-full mb-8">
        <span className="font-medium text-verification-dark">
          {credits} CertCredit{credits > 1 ? 's' : ''}
        </span>
      </div>

      {/* Credentials List */}
      <h5 className="text-lg font-semibold mb-4 text-charcoal">Examples include:</h5>
      <ul className="space-y-3 mb-8">
        {credentials.map((cred, i) => (
          <li key={i} className="flex items-start gap-3">
            {/* Use verification color for checkmarks */}
            <Check className="w-5 h-5 text-verification flex-shrink-0 mt-0.5" />
            <span className="text-base text-charcoal leading-relaxed">{cred}</span>
          </li>
        ))}
      </ul>

      {/* Primary Blue CTA Button - matches design system */}
      <Button size="lg" className="w-full">
        GET EXPERT REVIEWS
        <ArrowRight className="w-5 h-5" />
      </Button>
    </div>
  )
}
