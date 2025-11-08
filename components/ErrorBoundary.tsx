'use client'

import React, { Component, ReactNode } from 'react'
import * as Sentry from '@sentry/nextjs'
import Button from './Button'
import TextureOverlay from './TextureOverlay'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to Sentry
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-beige flex items-center justify-center px-4 relative overflow-hidden">
          <TextureOverlay type="paper" opacity={0.3} />
          <div className="max-w-2xl w-full bg-white rounded-2xl p-8 md:p-12 border-2 border-navy/10 shadow-xl relative z-10">
            <div className="w-16 h-16 rounded-full bg-coral/20 flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-coral"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-navy mb-4 text-center font-serif">
              Something went wrong
            </h1>

            <p className="text-lg text-black/70 mb-8 text-center leading-relaxed">
              We apologize for the inconvenience. Our team has been notified and is working on a fix.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-beige rounded-xl p-4 mb-6 border-2 border-coral/20">
                <p className="text-sm font-mono text-black/80 break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => this.setState({ hasError: false, error: null })}
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = '/'}
              >
                Go Home
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
