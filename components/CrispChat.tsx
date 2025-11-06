'use client'

import { useEffect } from 'react'

export default function CrispChat() {
  useEffect(() => {
    // Get Crisp Website ID from environment variable
    const websiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID

    // Only load Crisp if Website ID is configured
    if (!websiteId) {
      console.warn('Crisp chat widget not loaded: NEXT_PUBLIC_CRISP_WEBSITE_ID not set')
      return
    }

    // Load Crisp chat widget
    // @ts-ignore
    window.$crisp = []
    // @ts-ignore
    window.CRISP_WEBSITE_ID = websiteId

    const script = document.createElement('script')
    script.src = 'https://client.crisp.chat/l.js'
    script.async = true
    document.getElementsByTagName('head')[0].appendChild(script)

    // Cleanup function
    return () => {
      // Remove Crisp script and global variables on unmount
      const crispScript = document.querySelector('script[src="https://client.crisp.chat/l.js"]')
      if (crispScript) {
        crispScript.remove()
      }
      // @ts-ignore
      delete window.$crisp
      // @ts-ignore
      delete window.CRISP_WEBSITE_ID
    }
  }, [])

  return null // This component doesn't render anything visible
}
