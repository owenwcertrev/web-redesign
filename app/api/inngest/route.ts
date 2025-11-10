/**
 * Inngest Serve API Route
 *
 * Handles Inngest function execution for async E-E-A-T analysis
 */

import { serve } from 'inngest/next'
import { inngest } from '@/lib/inngest/client'
import { comprehensiveEEATAnalysis } from '@/lib/inngest/eeat-analysis'

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [comprehensiveEEATAnalysis],
})
