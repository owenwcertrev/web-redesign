/**
 * Inngest Client Configuration
 *
 * Handles async background processing for E-E-A-T analysis
 */

import { Inngest } from 'inngest'

// Create the Inngest client
export const inngest = new Inngest({
  id: 'certrev-web',
  name: 'CertREV Website',
})
