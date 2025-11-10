'use client'

import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'
import DepthHero from '@/components/cards3d/DepthHero'
import TextureOverlay from '@/components/TextureOverlay'
import OrganicShape from '@/components/OrganicShape'
import FadeIn from '@/components/animations/FadeIn'

export default function PrivacyPage() {
  return (
    <div>
      {/* Hero Section */}
      <DepthHero
        backgroundLayers={[
          <div key="bg" className="absolute inset-0 bg-beige" />,
          <TextureOverlay key="texture" type="paper" opacity={0.3} />,
          <OrganicShape key="shape1" variant="blob1" color="lime" className="absolute top-1/4 right-1/4 w-96 h-96" opacity={0.08} />,
          <OrganicShape key="shape2" variant="blob3" color="navy" className="absolute bottom-1/4 left-1/4 w-80 h-80" opacity={0.06} />
        ]}
      >
        <div className="min-h-[40vh] flex items-center justify-center px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-6 px-3 py-1 bg-lime/10 rounded-md"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-lime" />
                <span className="text-xs font-medium text-navy tracking-wide">YOUR PRIVACY</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight font-serif text-navy"
            >
              Privacy Policy
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg text-black/70 max-w-2xl mx-auto"
            >
              CertREV values trust as much as transparency
            </motion.p>
          </div>
        </div>
      </DepthHero>

      {/* Content Section */}
      <section className="bg-white py-20 px-4 relative overflow-hidden">
        <TextureOverlay type="paper" opacity={0.15} />

        <div className="max-w-4xl mx-auto relative z-10">
          <FadeIn>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-black/80 leading-relaxed mb-12">
                This Privacy Policy explains how we collect, use, and protect personal information across our expert-review platform for brands, agencies, and credentialed reviewers.
              </p>

              {/* Company */}
              <h2 className="text-3xl font-bold text-navy font-serif mt-12 mb-4">Company</h2>
              <p className="text-black/80 leading-relaxed mb-6">
                CertREV operates the certrev.com website and the CERT Reviewed service ("CertREV," "we," "us"). To contact us with questions about this privacy policy, email <a href="mailto:owen@certrev.com" className="text-coral hover:underline">owen@certrev.com</a>.
              </p>

              {/* Scope */}
              <h2 className="text-3xl font-bold text-navy font-serif mt-12 mb-4">Scope</h2>
              <p className="text-black/80 leading-relaxed mb-6">
                This Privacy Policy explains how we handle personal or personally identifiable information ("Personal Information") collected when you visit certrev.com or use CertREV services for brands, agencies, and expert reviewers. We prohibit submission of protected health information ("PHI") or other personal health identifiers.
              </p>

              {/* Information Collection */}
              <h2 className="text-3xl font-bold text-navy font-serif mt-12 mb-4">Information Collection</h2>
              <p className="text-black/80 leading-relaxed mb-6">
                Our goal is to provide a smooth, efficient, and secure experience.
              </p>

              <h3 className="text-xl font-semibold text-navy mt-8 mb-4">1. You provide it</h3>
              <ul className="list-disc pl-6 mb-6 text-black/80 space-y-2">
                <li><strong>Account and contact data:</strong> name, email, company, role.</li>
                <li><strong>Brand submissions:</strong> article drafts, citations, disclaimers, image-rights confirmations, and Google Doc links with edit access.</li>
                <li><strong>Expert reviewer data:</strong> credentials, license or certification numbers, jurisdiction, LinkedIn, headshot, bio, W-9 or tax information.</li>
              </ul>

              <h3 className="text-xl font-semibold text-navy mt-8 mb-4">2. From your use of the service</h3>
              <ul className="list-disc pl-6 mb-6 text-black/80 space-y-2">
                <li><strong>Usage data:</strong> IP address, device and browser type, pages viewed, timestamps, referring URLs.</li>
                <li><strong>Cookies and similar technologies:</strong> to remember you, keep sessions secure, and improve features.</li>
              </ul>

              <h3 className="text-xl font-semibold text-navy mt-8 mb-4">3. From third parties</h3>
              <ul className="list-disc pl-6 mb-6 text-black/80 space-y-2">
                <li>Identity and credential checks for experts through verification partners such as Certree, ComplyCube, and Verif-y, plus public board lookups and LinkedIn.</li>
                <li>Payments via our processor (e.g., Stripe).</li>
                <li>Support and chatbot interactions (e.g., CredBot) for customer assistance.</li>
              </ul>

              <h3 className="text-xl font-semibold text-navy mt-8 mb-4">4. Content certification artifacts</h3>
              <ul className="list-disc pl-6 mb-6 text-black/80 space-y-2">
                <li>Compliance checklists, tracked changes, and signature blocks tied to reviews.</li>
                <li>Tamper-proof content receipts including SHA-256 hashes and timestamps stored in our ledger.</li>
              </ul>

              <h3 className="text-xl font-semibold text-navy mt-8 mb-4">5. Program operations</h3>
              <ul className="list-disc pl-6 mb-6 text-black/80 space-y-2">
                <li>Post-job quality ratings and limited performance metrics to maintain reviewer standards.</li>
              </ul>

              <p className="text-black/80 leading-relaxed mb-6">
                Your information may be stored and processed in the United States.
              </p>

              {/* Our Use */}
              <h2 className="text-3xl font-bold text-navy font-serif mt-12 mb-4">Our Use of Your Information</h2>
              <p className="text-black/80 leading-relaxed mb-4">We use information to:</p>
              <ul className="list-disc pl-6 mb-6 text-black/80 space-y-2">
                <li>Operate and improve the platform, match briefs to qualified reviewers, and run compliance workflows.</li>
                <li>Generate certification assets, including the "CERT Reviewed" signature block and audit hash.</li>
                <li>Display expert attribution on approved content and enable perpetual display rights on that specific asset.</li>
                <li>Process payments and manage billing; issue tax forms such as 1099-NEC for U.S. reviewers.</li>
                <li>Provide support via email, in-product chat, and CredBot.</li>
                <li>Monitor quality and integrity, including post-job ratings.</li>
                <li>Enforce terms, comply with law, and protect users and the service.</li>
              </ul>
              <p className="text-black/80 leading-relaxed mb-6">
                By using the service, you agree we may contact you with administrative notices and service communications.
              </p>

              {/* Sharing and Disclosure */}
              <h2 className="text-3xl font-bold text-navy font-serif mt-12 mb-4">Sharing and Disclosure of Personal Information</h2>
              <p className="text-black/80 leading-relaxed mb-4">
                We do not sell or rent Personal Information. We share information only as follows:
              </p>
              <ul className="list-disc pl-6 mb-6 text-black/80 space-y-2">
                <li><strong>Service providers:</strong> payment processing, identity and credential verification, hosting, analytics, communications, document handling.</li>
                <li><strong>Certification and publication:</strong> if you are an expert reviewer, your name, credentials, headshot, and bio appear on the approved asset and may be listed by the brand as a contributor, consistent with program rules. Approved content must be re-reviewed if later changed.</li>
                <li><strong>Brands and reviewers:</strong> we share submission documents and editorial artifacts necessary to complete a review in Google Docs.</li>
                <li><strong>Legal:</strong> to respond to subpoenas, court orders, or lawful requests, and to investigate and prevent unlawful activity.</li>
                <li><strong>Business transfers:</strong> as part of a merger, acquisition, or asset sale, subject to this policy.</li>
              </ul>
              <p className="text-black/80 leading-relaxed mb-6">
                We may use or share aggregated or de-identified data that does not identify you.
              </p>

              {/* Security */}
              <h2 className="text-3xl font-bold text-navy font-serif mt-12 mb-4">Security</h2>
              <p className="text-black/80 leading-relaxed mb-6">
                We use administrative, technical, and physical safeguards to protect Personal Information, including SOC-2-ready processes and an auditable content-hash ledger. No method is perfectly secure on the internet.
              </p>

              {/* Access */}
              <h2 className="text-3xl font-bold text-navy font-serif mt-12 mb-4">Access</h2>
              <p className="text-black/80 leading-relaxed mb-6">
                Access to nonpublic information is limited to team members and contractors who need it to operate the service. Edit access to submission documents is granted only to the matched reviewer and necessary staff to complete the review.
              </p>

              {/* Lawful Use */}
              <h2 className="text-3xl font-bold text-navy font-serif mt-12 mb-4">Lawful Use of Site</h2>
              <p className="text-black/80 leading-relaxed mb-6">
                Use the site only for lawful purposes. Do not submit content that infringes intellectual-property rights, violates privacy rights, discloses trade secrets, or breaches any law. Persons under 18 may not use CertREV. We cooperate with law enforcement when legally obligated. You agree to indemnify CertREV, its officers, directors, employees, and agents from claims arising from misuse of the service under applicable terms.
              </p>

              {/* Amendments */}
              <h2 className="text-3xl font-bold text-navy font-serif mt-12 mb-4">Amendments</h2>
              <p className="text-black/80 leading-relaxed mb-6">
                We may update this Policy and will post changes on certrev.com. Changes apply from the posted effective date. This Policy does not create contractual rights for third parties.
              </p>

              {/* Ownership */}
              <h2 className="text-3xl font-bold text-navy font-serif mt-12 mb-4">Ownership</h2>
              <p className="text-black/80 leading-relaxed mb-6">
                "CertREV" and "CERT Reviewed" are trade names of the company that operates certrev.com.
              </p>

              {/* Last Updated */}
              <div className="mt-16 pt-8 border-t border-navy/10 text-center">
                <p className="text-sm text-navy/50">Last updated: January 2025</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
