'use client'

import { useState } from 'react'
import CitationMarker from '@/components/trust/CitationMarker'
import ConfidenceMeter from '@/components/trust/ConfidenceMeter'
import VerificationProgress from '@/components/trust/VerificationProgress'
import TrustTypography from '@/components/trust/TrustTypography'
import GlassMorphCard from '@/components/trust/GlassMorphCard'
import TrustIndicator from '@/components/trust/TrustIndicator'
import Button from '@/components/Button'
import { ArrowRight } from 'lucide-react'

export default function TrustShowcase() {
  const [verificationState, setVerificationState] = useState<'pending' | 'processing' | 'verified' | 'failed'>('pending')

  const cycleVerificationState = () => {
    const states: Array<'pending' | 'processing' | 'verified' | 'failed'> = ['pending', 'processing', 'verified', 'failed']
    const currentIndex = states.indexOf(verificationState)
    const nextIndex = (currentIndex + 1) % states.length
    setVerificationState(states[nextIndex])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-cream">
      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-serif mb-6 text-charcoal">
            Trust Infrastructure Showcase
          </h1>
          <p className="text-xl text-charcoal/70 max-w-2xl mx-auto mb-12">
            Innovative visual language for verification, citations, and confidence in the AI age
          </p>
        </div>
      </section>

      {/* Citation Markers */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <GlassMorphCard className="p-8 md:p-12">
            <h2 className="text-3xl font-semibold mb-6 text-charcoal">Citation Markers</h2>
            <p className="text-lg text-charcoal/80 mb-8 leading-relaxed">
              Beautiful inline citations with confidence indicators.
              Studies show that 60% of consumers doubt AI-generated content.
              <CitationMarker
                number={1}
                confidence="high"
                source="Stanford Research, 2025"
                preview="Comprehensive study of 10,000+ consumers across demographics showing significant trust gaps in AI content."
              />, while expert-verified articles see a 40% lift in purchase intent.
              <CitationMarker
                number={2}
                confidence="medium"
                source="Nielsen x inPowered Study"
                preview="Meta-analysis of branded content performance across industries."
              /> Even unverified claims.
              <CitationMarker
                number={3}
                confidence="unverified"
                source="Pending verification"
              /> can be tracked for future review.
            </p>

            <div className="grid md:grid-cols-3 gap-4 p-6 bg-cream/50 rounded-xl border border-charcoal/5">
              <div className="text-center">
                <CitationMarker number={1} confidence="high" />
                <p className="text-sm text-charcoal/60 mt-2 font-mono">HIGH</p>
              </div>
              <div className="text-center">
                <CitationMarker number={2} confidence="medium" />
                <p className="text-sm text-charcoal/60 mt-2 font-mono">MEDIUM</p>
              </div>
              <div className="text-center">
                <CitationMarker number={3} confidence="low" />
                <p className="text-sm text-charcoal/60 mt-2 font-mono">LOW</p>
              </div>
            </div>
          </GlassMorphCard>
        </div>
      </section>

      {/* Confidence Meters */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <GlassMorphCard variant="primary" className="p-8 md:p-12">
            <h2 className="text-3xl font-semibold mb-6 text-charcoal">Confidence Meters</h2>
            <p className="text-charcoal/70 mb-8">
              Animated precision scores that make trust measurable and beautiful
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <ConfidenceMeter score={92} label="Expert Verification" />
              </div>
              <div>
                <ConfidenceMeter score={78} label="Source Credibility" />
              </div>
              <div>
                <ConfidenceMeter score={65} label="Citation Coverage" />
              </div>
              <div>
                <ConfidenceMeter score={45} label="Content Freshness" />
              </div>
            </div>
          </GlassMorphCard>
        </div>
      </section>

      {/* Verification Progress */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <GlassMorphCard variant="verification" className="p-8 md:p-12">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-3xl font-semibold mb-2 text-charcoal">Verification Progress</h2>
                <p className="text-charcoal/70">
                  Real-time status indicators with glass morphism and animations
                </p>
              </div>
              <Button size="sm" onClick={cycleVerificationState}>
                Cycle States
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <VerificationProgress
                state="pending"
                message="Awaiting expert assignment"
                timestamp="2025-01-15 14:32:00 UTC"
              />
              <VerificationProgress
                state="processing"
                message="Dr. Sarah Chen is reviewing your content"
                timestamp="2025-01-15 14:35:12 UTC"
              />
              <VerificationProgress
                state="verified"
                message="Content verified by board-certified expert"
                timestamp="2025-01-15 15:02:45 UTC"
              />
              <VerificationProgress
                state="failed"
                message="Claims require additional sources"
                timestamp="2025-01-15 15:15:20 UTC"
              />
            </div>

            <div className="mt-8">
              <VerificationProgress
                state={verificationState}
                message={`Current state: ${verificationState}`}
                timestamp={new Date().toISOString()}
              />
            </div>
          </GlassMorphCard>
        </div>
      </section>

      {/* Trust Typography */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <GlassMorphCard className="p-8 md:p-12" borderPrecision={false}>
            <h2 className="text-3xl font-semibold mb-6 text-charcoal">Trust Typography</h2>
            <p className="text-charcoal/70 mb-8">
              Text that visually transforms based on verification status
            </p>

            <div className="space-y-6">
              <div className="p-6 bg-cream/30 rounded-xl">
                <TrustTypography verification="verified" as="h3" className="text-2xl mb-2">
                  Verified Content: Bold, Clear, Trusted
                </TrustTypography>
                <p className="text-sm text-charcoal/60 font-mono">
                  VERIFICATION: ✓ VERIFIED | WEIGHT: SEMIBOLD | OPACITY: 100%
                </p>
              </div>

              <div className="p-6 bg-cream/20 rounded-xl">
                <TrustTypography verification="pending" as="h3" className="text-2xl mb-2">
                  Pending Verification: Medium Weight, Slightly Faded
                </TrustTypography>
                <p className="text-sm text-charcoal/60 font-mono">
                  VERIFICATION: ⧗ PENDING | WEIGHT: MEDIUM | OPACITY: 90%
                </p>
              </div>

              <div className="p-6 bg-cream/10 rounded-xl">
                <TrustTypography verification="unverified" as="h3" className="text-2xl mb-2">
                  Unverified Content: Lighter, More Transparent
                </TrustTypography>
                <p className="text-sm text-charcoal/60 font-mono">
                  VERIFICATION: ✗ UNVERIFIED | WEIGHT: NORMAL | OPACITY: 70%
                </p>
              </div>
            </div>
          </GlassMorphCard>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <GlassMorphCard variant="alert" className="p-8 md:p-12">
            <h2 className="text-3xl font-semibold mb-6 text-charcoal">Trust Indicators</h2>
            <p className="text-charcoal/70 mb-8">
              Infrastructure badges that communicate security and transparency
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <TrustIndicator metric="verified" pulse />
              <TrustIndicator metric="encrypted" value="SHA-256" />
              <TrustIndicator metric="transparent" value="Open" />
              <TrustIndicator metric="immutable" value="Chain" pulse />
            </div>

            <div className="mt-8 p-6 bg-white/40 backdrop-blur-sm rounded-xl border border-charcoal/10">
              <p className="text-sm text-charcoal/70 mb-4">
                Technical details in monospace for precision:
              </p>
              <div className="font-mono text-xs space-y-2 text-charcoal/60">
                <div className="flex justify-between">
                  <span>VERIFICATION_ID:</span>
                  <span className="text-lime">cert_vf_2025_0x4a8b9c</span>
                </div>
                <div className="flex justify-between">
                  <span>TIMESTAMP:</span>
                  <span className="text-navy">2025-01-15T14:32:00.000Z</span>
                </div>
                <div className="flex justify-between">
                  <span>HASH:</span>
                  <span className="text-charcoal/40">a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6</span>
                </div>
              </div>
            </div>
          </GlassMorphCard>
        </div>
      </section>

      {/* Glass Morphism Variants */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold mb-8 text-center text-charcoal">
            Glass Morphism Precision Cards
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <GlassMorphCard variant="default" className="p-8">
              <h3 className="text-xl font-semibold mb-3 text-charcoal">Default Variant</h3>
              <p className="text-charcoal/70 mb-4">
                Clean glass effect with subtle borders and precision corner indicators
              </p>
              <p className="text-xs font-mono text-charcoal/40">
                BORDER-RADIUS: 10px | BACKDROP: blur(12px)
              </p>
            </GlassMorphCard>

            <GlassMorphCard variant="primary" className="p-8">
              <h3 className="text-xl font-semibold mb-3 text-charcoal">Primary Variant</h3>
              <p className="text-charcoal/70 mb-4">
                Enhanced with primary color glow on hover
              </p>
              <p className="text-xs font-mono text-charcoal/40">
                GLOW: rgba(91,141,239,0.15)
              </p>
            </GlassMorphCard>

            <GlassMorphCard variant="verification" className="p-8">
              <h3 className="text-xl font-semibold mb-3 text-charcoal">Verification Variant</h3>
              <p className="text-charcoal/70 mb-4">
                Trust-focused with verification color accents
              </p>
              <p className="text-xs font-mono text-charcoal/40">
                GLOW: rgba(119,171,149,0.15)
              </p>
            </GlassMorphCard>

            <GlassMorphCard variant="alert" className="p-8">
              <h3 className="text-xl font-semibold mb-3 text-charcoal">Alert Variant</h3>
              <p className="text-charcoal/70 mb-4">
                Attention-grabbing for important information
              </p>
              <p className="text-xs font-mono text-charcoal/40">
                GLOW: rgba(241,130,57,0.15)
              </p>
            </GlassMorphCard>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <GlassMorphCard variant="verification" className="p-12" borderPrecision={false}>
            <h2 className="text-4xl font-serif italic mb-6 text-charcoal">
              Trust Infrastructure for the AI Age
            </h2>
            <p className="text-xl text-charcoal/70 mb-8">
              Making verification beautiful, transparent, and tangible
            </p>
            <Button size="lg">
              Explore CertREV
              <ArrowRight className="w-5 h-5" />
            </Button>
          </GlassMorphCard>
        </div>
      </section>
    </div>
  )
}
