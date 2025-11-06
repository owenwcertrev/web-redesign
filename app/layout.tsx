import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import SmoothResize from '@/components/SmoothResize'
// import CrispChat from '@/components/CrispChat' // Temporarily disabled

const dmSans = DM_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CertREV - Expert Content Verification for Health, Wellness & Professional Services',
  description: 'Expert fact-checking infrastructure for health, wellness, finance, and professional service brands. Human validation in an AI-powered world.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={dmSans.className}>
        <SmoothResize />
        <Navigation />
        <main className="pt-16">
          {children}
        </main>
        <Footer />
        {/* <CrispChat /> */} {/* Temporarily disabled */}
      </body>
    </html>
  )
}
