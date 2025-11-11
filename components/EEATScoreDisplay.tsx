'use client'

import ScoreGauge from './ScoreGauge'
import EEATCategoryCard from './EEATCategoryCard'
import { Sparkles } from 'lucide-react'
import type { EEATScore } from '@/lib/types/blog-analysis'

interface EEATScoreDisplayProps {
  score: EEATScore
  showComprehensiveUpsell?: boolean
  postsAnalyzed?: number
}

export default function EEATScoreDisplay({
  score,
  showComprehensiveUpsell = false,
  postsAnalyzed
}: EEATScoreDisplayProps) {
  const hasEstimatedVariables = Object.values(score.categories).some(cat =>
    cat.variables.some(v => v.isEstimated)
  )

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="bg-white rounded-16 p-8 shadow-base">
        <div className="flex items-center justify-center gap-2 mb-2">
          <h3 className="text-2xl font-semibold text-center text-black">
            Your E-E-A-T Score
          </h3>
          <span className="text-xs font-semibold text-coral bg-coral/10 px-2 py-1 rounded-md">
            INSTANT
          </span>
        </div>

        {postsAnalyzed && (
          <p className="text-sm text-black/60 text-center mb-6">
            Based on analysis of <span className="font-semibold text-navy">{postsAnalyzed}</span> blog posts
          </p>
        )}

        <div className="flex justify-center mb-8">
          <ScoreGauge score={score.overall} label="Overall E-E-A-T Score" />
        </div>

        {/* Category Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="text-center p-3 sm:p-4 bg-beige rounded-12 min-w-0">
            <div className="text-2xl sm:text-3xl font-bold text-navy mb-1">
              {Math.round(score.categories.experience.totalScore)}
            </div>
            <div className="text-xs sm:text-sm text-black/70 break-words hyphens-auto">
              Experience
            </div>
            <div className="text-xs text-black/50 whitespace-nowrap">
              out of {score.categories.experience.maxScore}
            </div>
          </div>
          <div className="text-center p-3 sm:p-4 bg-beige rounded-12 min-w-0">
            <div className="text-2xl sm:text-3xl font-bold text-navy mb-1">
              {Math.round(score.categories.expertise.totalScore)}
            </div>
            <div className="text-xs sm:text-sm text-black/70 break-words hyphens-auto">
              Expertise
            </div>
            <div className="text-xs text-black/50 whitespace-nowrap">
              out of {score.categories.expertise.maxScore}
            </div>
          </div>
          <div className="text-center p-3 sm:p-4 bg-beige rounded-12 min-w-0">
            <div className="text-2xl sm:text-3xl font-bold text-navy mb-1">
              {Math.round(score.categories.authoritativeness.totalScore)}
            </div>
            <div className="text-xs sm:text-sm text-black/70 break-words hyphens-auto">
              Authoritativeness
            </div>
            <div className="text-xs text-black/50 whitespace-nowrap">
              out of {score.categories.authoritativeness.maxScore}
            </div>
          </div>
          <div className="text-center p-3 sm:p-4 bg-beige rounded-12 min-w-0">
            <div className="text-2xl sm:text-3xl font-bold text-navy mb-1">
              {Math.round(score.categories.trustworthiness.totalScore)}
            </div>
            <div className="text-xs sm:text-sm text-black/70 break-words hyphens-auto">
              Trustworthiness
            </div>
            <div className="text-xs text-black/50 whitespace-nowrap">
              out of {score.categories.trustworthiness.maxScore}
            </div>
          </div>
        </div>

        {/* Benchmark Comparison */}
        {score.benchmarkComparison && (
          <div className="bg-beige rounded-12 p-4 sm:p-6 border-2 border-navy/10">
            <h4 className="font-semibold text-navy mb-4 text-center">
              How Does Your Score Compare?
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm text-black/70">
                  Fortune 500 Health/Wellness Brands
                </span>
                <span className="font-semibold text-navy whitespace-nowrap">
                  {score.benchmarkComparison.fortune500}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm text-black/70">Mid-Market DTC Brands</span>
                <span className="font-semibold text-navy whitespace-nowrap">
                  {score.benchmarkComparison.midMarket}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm text-black/70">Startup/New Brands</span>
                <span className="font-semibold text-navy whitespace-nowrap">
                  {score.benchmarkComparison.startup}
                </span>
              </div>
              <div className="h-px bg-navy/20 my-3"></div>
              <div className="flex items-center justify-between bg-white rounded-lg p-3 border-2 border-coral/30">
                <span className="text-sm font-semibold text-navy">Your Score</span>
                <span className="text-2xl font-bold text-coral">{Math.round(score.overall)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Estimation Notice */}
      {hasEstimatedVariables && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-16 p-6">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-900 mb-2">
                Some Scores Are Estimated
              </h4>
              <p className="text-sm text-amber-800 mb-3">
                We couldn't fetch all external data within 30 seconds, so some scores are estimated
                based on on-page quality signals. Variables marked with{' '}
                <span className="font-semibold">⚠️ Estimated</span> show where this applies.
              </p>
              {showComprehensiveUpsell && (
                <p className="text-sm text-amber-800">
                  For complete accuracy with all external API data and AI-powered analysis,{' '}
                  <span className="font-semibold">request a comprehensive report</span> above.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Expandable Category Cards */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-navy">Detailed Breakdown</h3>
        <p className="text-sm text-black/70 mb-4">
          Click each category to see the {Object.values(score.categories).reduce((sum, cat) => sum + cat.variables.length, 0)} variables
          we analyze to calculate your E-E-A-T score.
        </p>

        <EEATCategoryCard category={score.categories.experience} />
        <EEATCategoryCard category={score.categories.expertise} />
        <EEATCategoryCard category={score.categories.authoritativeness} />
        <EEATCategoryCard category={score.categories.trustworthiness} />
      </div>
    </div>
  )
}
