'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Button from '@/components/Button'
import HolographicCard from '@/components/radical/HolographicCard'
import ParticleNetwork from '@/components/radical/ParticleNetwork'
import FlipCard3D from '@/components/radical/FlipCard3D'
import LiquidBlob from '@/components/radical/LiquidBlob'
import NeonText from '@/components/radical/NeonText'
import CyberGrid from '@/components/radical/CyberGrid'
import { Shield, Zap, Eye, Lock, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react'

export default function RadicalDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal via-charcoal/95 to-charcoal overflow-hidden">
      {/* Cyber Grid Background */}
      <CyberGrid animated />

      {/* Hero Section with Particle Network */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        {/* Particle Network Background */}
        <div className="absolute inset-0 opacity-40">
          <ParticleNetwork particleCount={80} connectionDistance={120} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Liquid Blob Accent */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 -z-10">
            <LiquidBlob variant="processing" size="lg" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="mb-8 inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-xl rounded-full border border-primary/30"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(91,141,239,0.3)',
                  '0 0 40px rgba(91,141,239,0.5)',
                  '0 0 20px rgba(91,141,239,0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-white/90 font-mono text-sm tracking-wider">
                TRUST INFRASTRUCTURE v2.0
              </span>
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              <NeonText color="white" flicker>
                Trust,
              </NeonText>
              <br />
              <NeonText color="primary" intensity="high">
                Radically
              </NeonText>
              <br />
              <NeonText color="verification" intensity="high">
                Verified.
              </NeonText>
            </h1>

            <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed">
              Next-generation verification infrastructure for the{' '}
              <span className="text-primary font-semibold">AI age</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-[0_0_30px_rgba(91,141,239,0.5)]">
                <Zap className="w-5 h-5" />
                Experience the Future
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button size="lg" variant="ghost" className="text-white border-white/20 hover:bg-white/10">
                View Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Holographic Cards Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold mb-6">
              <NeonText color="primary">Holographic</NeonText>{' '}
              <span className="text-white">Trust Signals</span>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Move your mouse over the cards to experience the future of trust visualization
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Expert Verified',
                description: 'Credentialed professionals validate every claim',
                color: 'text-verification'
              },
              {
                icon: Lock,
                title: 'Cryptographically Secure',
                description: 'Immutable verification records on blockchain',
                color: 'text-primary'
              },
              {
                icon: Eye,
                title: 'Radically Transparent',
                description: 'Every source, every citation, fully traceable',
                color: 'text-alert'
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <HolographicCard className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 h-full" intensity={0.8}>
                  <item.icon className={`w-16 h-16 mb-6 ${item.color}`} />
                  <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-white/70 leading-relaxed">{item.description}</p>
                </HolographicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3D Flip Cards Section */}
      <section className="relative py-32 px-4 bg-gradient-to-b from-transparent to-charcoal/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold mb-6">
              <span className="text-white">3D</span>{' '}
              <NeonText color="verification">Verification</NeonText>{' '}
              <span className="text-white">Cards</span>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Click any card to reveal verification details
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: 'Content Analysis',
                subtitle: 'AI-Powered Initial Scan',
                backTitle: 'Verification Complete',
                stats: ['92% Confidence', '15 Citations', '3 Expert Reviews']
              },
              {
                title: 'Expert Review',
                subtitle: 'Human Validation Layer',
                backTitle: 'Verified by Dr. Sarah Chen',
                stats: ['Board Certified MD', '15 Years Experience', 'Tier 6 Expert']
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="h-80"
              >
                <FlipCard3D
                  front={
                    <div className="relative h-full bg-gradient-to-br from-primary/20 to-verification/20 backdrop-blur-xl border border-white/20 rounded-2xl p-8 flex flex-col justify-between">
                      <div className="absolute top-0 left-0 w-full h-full">
                        <LiquidBlob variant={i === 0 ? 'processing' : 'verified'} size="sm" className="opacity-30" />
                      </div>
                      <div className="relative z-10">
                        <div className="text-xs font-mono text-white/50 mb-2">STEP {i + 1}</div>
                        <h3 className="text-3xl font-bold text-white mb-2">{card.title}</h3>
                        <p className="text-white/70">{card.subtitle}</p>
                      </div>
                      <div className="relative z-10 text-sm text-white/50 font-mono">
                        CLICK TO REVEAL →
                      </div>
                    </div>
                  }
                  back={
                    <div className="h-full bg-gradient-to-br from-verification to-verification-dark backdrop-blur-xl border border-verification/30 rounded-2xl p-8 flex flex-col justify-between">
                      <div>
                        <CheckCircle2 className="w-12 h-12 text-white mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-6">{card.backTitle}</h3>
                        <div className="space-y-3">
                          {card.stats.map((stat, j) => (
                            <div key={j} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-white rounded-full" />
                              <span className="text-white/90">{stat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="text-sm text-white/50 font-mono">
                        VERIFIED • {new Date().toLocaleDateString()}
                      </div>
                    </div>
                  }
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Liquid Morphing States */}
      <section className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="text-5xl font-bold mb-6">
              <NeonText color="alert">Living</NeonText>{' '}
              <span className="text-white">Verification States</span>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Watch trust materialize in real-time
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-12">
            {[
              { variant: 'default', label: 'Pending', sublabel: 'Awaiting Review' },
              { variant: 'processing', label: 'Processing', sublabel: 'AI Analysis' },
              { variant: 'verified', label: 'Verified', sublabel: 'Expert Approved' },
              { variant: 'warning', label: 'Review Needed', sublabel: 'Claims Flagged' },
            ].map((state, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex flex-col items-center"
              >
                <LiquidBlob variant={state.variant as any} size="md" />
                <h3 className="text-xl font-bold text-white mt-6 mb-2">{state.label}</h3>
                <p className="text-sm text-white/50 font-mono">{state.sublabel}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <div className="absolute inset-0 -z-10">
              <LiquidBlob variant="processing" size="lg" />
            </div>

            <HolographicCard className="bg-white/5 backdrop-blur-xl border border-white/10 p-12" intensity={1.2}>
              <h2 className="text-5xl md:text-6xl font-bold mb-8">
                <span className="text-white">Ready for the</span>
                <br />
                <NeonText color="primary" intensity="high">
                  Future of Trust?
                </NeonText>
              </h2>
              <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
                Experience verification infrastructure that's as beautiful as it is secure
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-verification hover:bg-verification-dark text-white shadow-[0_0_30px_rgba(119,171,149,0.5)]">
                  <Shield className="w-5 h-5" />
                  Start Verifying
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button size="lg" asChild className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                  <Link href="/trust-showcase">View All Components</Link>
                </Button>
              </div>

              <div className="mt-12 flex items-center justify-center gap-8 flex-wrap">
                <div className="text-sm text-white/50 font-mono">BLOCKCHAIN VERIFIED</div>
                <div className="w-px h-4 bg-white/20" />
                <div className="text-sm text-white/50 font-mono">AES-256 ENCRYPTED</div>
                <div className="w-px h-4 bg-white/20" />
                <div className="text-sm text-white/50 font-mono">100% TRANSPARENT</div>
              </div>
            </HolographicCard>
          </div>
        </div>
      </section>
    </div>
  )
}
