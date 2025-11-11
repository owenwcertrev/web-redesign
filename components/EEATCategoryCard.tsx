'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import type { EEATCategoryScore, EEATVariable } from '@/lib/types/blog-analysis'

interface EEATCategoryCardProps {
  category: EEATCategoryScore
}

export default function EEATCategoryCard({ category }: EEATCategoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-lime-dark bg-lime/20'
      case 'good':
        return 'text-blue-600 bg-blue-50'
      case 'needs-improvement':
      case 'fair':
        return 'text-amber-600 bg-amber-50'
      case 'poor':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return <CheckCircle className="w-4 h-4" />
      case 'good':
        return <CheckCircle className="w-4 h-4" />
      case 'needs-improvement':
      case 'fair':
        return <AlertCircle className="w-4 h-4" />
      case 'poor':
        return <XCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getVariableScoreColor = (actualScore: number, maxScore: number) => {
    const percentage = (actualScore / maxScore) * 100
    if (percentage >= 85) return 'text-lime-dark'
    if (percentage >= 65) return 'text-blue-600'
    if (percentage >= 40) return 'text-amber-600'
    return 'text-red-600'
  }

  return (
    <div className="bg-white rounded-16 border-2 border-navy/10 overflow-hidden">
      {/* Card Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-beige/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="text-left">
            <h3 className="text-xl font-bold text-navy mb-1">{category.displayName}</h3>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-navy">
                {Math.round(category.totalScore)}
              </span>
              <span className="text-sm text-black/50">/ {category.maxScore}</span>
              <span className={`text-xs font-semibold px-2 py-1 rounded-md ${getStatusColor(category.overallStatus)}`}>
                {category.overallStatus.toUpperCase().replace('-', ' ')}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm text-black/60">
              {category.variables.length} variables
            </div>
            {category.variables.some(v => v.isEstimated) && (
              <div className="flex items-center gap-1 text-xs text-amber-600 mt-1">
                <AlertTriangle className="w-3 h-3" />
                <span>Some estimated</span>
              </div>
            )}
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-navy" />
          ) : (
            <ChevronDown className="w-5 h-5 text-navy" />
          )}
        </div>
      </button>

      {/* Expanded Content - Variable Details */}
      {isExpanded && (
        <div className="border-t-2 border-navy/10 bg-beige/30 p-6">
          <div className="space-y-4">
            {category.variables.map((variable) => (
              <VariableDetail key={variable.id} variable={variable} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function VariableDetail({ variable }: { variable: EEATVariable }) {
  const [showEvidence, setShowEvidence] = useState(false)

  const getVariableScoreColor = (actualScore: number, maxScore: number) => {
    const percentage = (actualScore / maxScore) * 100
    if (percentage >= 85) return 'text-lime-dark bg-lime/10'
    if (percentage >= 65) return 'text-blue-600 bg-blue-50'
    if (percentage >= 40) return 'text-amber-600 bg-amber-50'
    return 'text-red-600 bg-red-50'
  }

  return (
    <div className="bg-white rounded-12 p-4 border border-navy/10">
      {/* Variable Header */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-navy">{variable.name}</h4>
            <span className="text-xs font-mono text-black/50">{variable.id}</span>
            {variable.isEstimated && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                <AlertTriangle className="w-3 h-3" />
                Estimated
              </span>
            )}
          </div>
          <p className="text-sm text-black/70">{variable.description}</p>
        </div>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-lg font-bold ${getVariableScoreColor(variable.actualScore, variable.maxScore)}`}>
          <span>{variable.actualScore.toFixed(1)}</span>
          <span className="text-xs opacity-60">/ {variable.maxScore}</span>
        </div>
      </div>

      {/* Estimation Note */}
      {variable.isEstimated && variable.estimationNote && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
          <p className="text-xs text-amber-800">
            <AlertTriangle className="w-3 h-3 inline mr-1" />
            {variable.estimationNote}
          </p>
        </div>
      )}

      {/* Recommendation */}
      {variable.recommendation && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
          <p className="text-xs font-semibold text-blue-900 mb-1">Recommendation:</p>
          <p className="text-xs text-blue-800">{variable.recommendation}</p>
        </div>
      )}

      {/* Evidence Toggle */}
      {variable.evidence.length > 0 && (
        <div>
          <button
            onClick={() => setShowEvidence(!showEvidence)}
            className="text-xs font-semibold text-navy hover:text-coral transition-colors flex items-center gap-1"
          >
            {showEvidence ? 'Hide' : 'Show'} evidence ({variable.evidence.length})
            {showEvidence ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {showEvidence && (
            <div className="mt-3 space-y-2">
              {variable.evidence.map((evidence, index) => (
                <div
                  key={index}
                  className={`text-xs p-2 rounded border ${
                    evidence.isEstimate
                      ? 'bg-amber-50 border-amber-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  {evidence.label && (
                    <div className="font-semibold text-black/80 mb-1">{evidence.label}</div>
                  )}
                  <div className="text-black/70 break-words">
                    {evidence.type === 'url' ? (
                      <a
                        href={evidence.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-navy hover:underline"
                      >
                        {evidence.value}
                      </a>
                    ) : (
                      evidence.value
                    )}
                  </div>
                  {evidence.confidence !== undefined && (
                    <div className="text-xs text-black/50 mt-1">
                      Confidence: {Math.round(evidence.confidence * 100)}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
