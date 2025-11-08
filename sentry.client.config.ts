import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Filter out errors we don't care about
  beforeSend(event, hint) {
    // Filter out browser extension errors
    if (event.exception) {
      const values = event.exception.values
      if (values && values.length > 0) {
        const firstException = values[0]
        if (
          firstException.value?.includes('chrome-extension') ||
          firstException.value?.includes('moz-extension')
        ) {
          return null
        }
      }
    }
    return event
  },

  environment: process.env.NODE_ENV,
})
