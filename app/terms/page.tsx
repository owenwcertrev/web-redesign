'use client'

import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'
import DepthHero from '@/components/cards3d/DepthHero'
import TextureOverlay from '@/components/TextureOverlay'
import OrganicShape from '@/components/OrganicShape'
import FadeIn from '@/components/animations/FadeIn'

export default function TermsPage() {
  return (
    <div>
      {/* Hero Section */}
      <DepthHero
        backgroundLayers={[
          <div key="bg" className="absolute inset-0 bg-beige" />,
          <TextureOverlay key="texture" type="paper" opacity={0.3} />,
          <OrganicShape key="shape1" variant="blob2" color="navy" className="absolute top-1/4 right-1/4 w-96 h-96" opacity={0.06} />,
          <OrganicShape key="shape2" variant="blob1" color="coral" className="absolute bottom-1/4 left-1/4 w-80 h-80" opacity={0.05} />
        ]}
      >
        <div className="min-h-[40vh] flex items-center justify-center px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-6 px-6 py-3 bg-white rounded-full border-2 border-navy/20 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-navy" />
                <span className="text-sm font-semibold text-navy tracking-wide">LEGAL</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight font-serif text-navy"
            >
              Terms of Service
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg text-black/70 max-w-2xl mx-auto"
            >
              Credibility you can prove, powered by verified experts, delivered at scale
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
              {/* Section 1 */}
              <h2 className="text-3xl font-bold text-navy font-serif mt-12 mb-4">1. Overview</h2>
              <p className="text-black/80 leading-relaxed mb-6">
                These Terms of Service ("Terms") form an agreement between you and CertREV ("CertREV," "we," "us"). They govern your access to and use of the website, applications, and services that connect brands with credential-verified experts for content review and attribution (the "CertREV Platform" or "Services"). If you use the Services on behalf of an entity, you confirm you are authorized to bind that entity, and "you" includes that entity.
              </p>

              {/* Section 2 */}
              <h2 className="text-3xl font-bold text-navy font-serif mt-12 mb-4">2. Members and Roles</h2>
              <p className="text-black/80 leading-relaxed mb-4">
                <strong>Brand:</strong> a company or publisher that submits drafts for expert review.
              </p>
              <p className="text-black/80 leading-relaxed mb-4">
                <strong>Expert Reviewer:</strong> a licensed or certified professional who performs a structured accuracy, citation, compliance, and clarity pass, then approves content for attribution. Experts are vetted and re-verified on a schedule.
              </p>
              <p className="text-black/80 leading-relaxed mb-6">
                <strong>Referral/Agency Partner:</strong> a third party that sources brands for CertREV under a separate partner agreement. (Partner terms are separate and control that program.)
              </p>

              {/* Section 3 */}
              <h2 className="text-3xl font-bold text-navy font-serif mt-12 mb-4">3. Access and Use</h2>
              <h3 className="text-xl font-semibold text-navy mt-6 mb-3">3.1 Access</h3>
              <p className="text-black/80 leading-relaxed mb-4">
                Brands register, pick a credit bundle, and upload drafts. CertREV matches to a vetted, conflict-free reviewer who completes the Compliance Checklist and returns tracked changes or structured edit notes. We then finalize, insert the reviewer's signature block, and hash the approved version to our ledger.
              </p>
              <h3 className="text-xl font-semibold text-navy mt-6 mb-3">3.2 Profiles and Attribution</h3>
              <p className="text-black/80 leading-relaxed mb-4">
                We display visible, credentialed reviewer bylines and credential metadata with the approved content to strengthen trust signals.
              </p>
              <h3 className="text-xl font-semibold text-navy mt-6 mb-3">3.3 Typical Timing</h3>
              <p className="text-black/80 leading-relaxed mb-6">
                Standard turnaround is usually 48–72 hours per accepted article; timing depends on scope and availability.
              </p>

              {/* Section 4 */}
              <h2 className="text-3xl font-bold text-navy font-serif mt-12 mb-4">4. Brand Submission Requirements</h2>
              <p className="text-black/80 leading-relaxed mb-4">By using the Platform, Brands agree to:</p>
              <ul className="list-disc pl-6 mb-4 text-black/80 space-y-2">
                <li>Submit a near-final Google Doc with edit access, full length, and strategy notes; provide reputable citations; include required disclaimers; and ensure rights to any images. One review cycle is included.</li>
                <li>Do not submit placeholder text, AI dumps needing heavy rewrite, unlinked claims, locked files, or PHI.</li>
                <li>Accept that reviewers perform structured, light editorial and compliance checks; they do not ghostwrite or overhaul drafts. Major changes require resubmission and new credits.</li>
              </ul>

              {/* Section 5 */}
              <h2 className="text-3xl font-bold text-navy font-serif mt-12 mb-4">5. Expert Reviewer Rules</h2>
              <p className="text-black/80 leading-relaxed mb-4">Experts agree to:</p>
              <ul className="list-disc pl-6 mb-6 text-black/80 space-y-2">
                <li>Maintain current licensure or certification, pass identity and sanctions checks, and sign independent-contractor and conflict-of-interest agreements.</li>
                <li>Complete the Compliance Checklist (accuracy, citations, regulatory language, conflicts), share a short relevant perspective, and return the draft within the assignment window.</li>
                <li>Approve only when standards are met; otherwise provide structured edit notes. Anonymity is not permitted; attribution is required. Maintain a ≥4.0 average rating.</li>
              </ul>

              {/* Section 6 */}
              <h2 className="text-3xl font-bold text-navy font-serif mt-12 mb-4">6. Attribution, Marketing Claims, and Re-use</h2>
              <h3 className="text-xl font-semibold text-navy mt-6 mb-3">6.1 Attribution Rights</h3>
              <p className="text-black/80 leading-relaxed mb-4">
                After approval, Brands receive a perpetual, non-exclusive right to display the reviewer's name, credential, headshot, and short bio on the specific reviewed asset and, if applicable, a contributors page. Product advertising or broader endorsements require separate consent.
              </p>
              <h3 className="text-xl font-semibold text-navy mt-6 mb-3">6.2 Approved Language</h3>
              <p className="text-black/80 leading-relaxed mb-4">
                You may state "Reviewed by [Name], [Credential] via CertREV." Do not imply endorsement or ongoing affiliation unless expressly agreed.
              </p>
              <h3 className="text-xl font-semibold text-navy mt-6 mb-3">6.3 Post-Edit Rule</h3>
              <p className="text-black/80 leading-relaxed mb-4">
                If you change content after approval, you must remove the reviewer's attribution and CertREV badge unless you resubmit for re-review.
              </p>
              <h3 className="text-xl font-semibold text-navy mt-6 mb-3">6.4 Exclusivity</h3>
              <p className="text-black/80 leading-relaxed mb-6">
                CertREV endeavors to avoid assigning the same reviewer to direct competitors for a cooling-off period where feasible, but exclusivity is not guaranteed unless explicitly contracted.
              </p>

              {/* Section 7 */}
              <h2 className="text-3xl font-bold text-navy font-serif mt-12 mb-4">7. Pricing, Credits, and Billing</h2>
              <h3 className="text-xl font-semibold text-navy mt-6 mb-3">7.1 Credit System</h3>
              <p className="text-black/80 leading-relaxed mb-4">
                Reviews consume credits by reviewer tier. Bundles are billed monthly; add-on credits are available. Per-credit rates scale with volume. Credits roll over for 90 days. No long-term commitment.
              </p>
              <h3 className="text-xl font-semibold text-navy mt-6 mb-3">7.2 Examples</h3>
              <p className="text-black/80 leading-relaxed mb-4">
                Published bundle examples show tiered monthly credits and volume pricing. These examples are illustrative and may change; your order page controls.
              </p>
              <h3 className="text-xl font-semibold text-navy mt-6 mb-3">7.3 Billing</h3>
              <p className="text-black/80 leading-relaxed mb-4">
                Billed to a card via Stripe; upgrades take effect immediately; downgrades at the next cycle. No refunds for unused credits; rollover applies as stated.
              </p>
              <h3 className="text-xl font-semibold text-navy mt-6 mb-3">7.4 Reviewer Payments</h3>
              <p className="text-black/80 leading-relaxed mb-6">
                Experts are paid a fixed amount per assignment via ACH/PayPal within 14 days of final approval.
              </p>

              {/* Section 8 */}
              <h2 className="text-3xl font-bold text-navy font-serif mt-12 mb-4">8. Monitoring and Enforcement</h2>
              <p className="text-black/80 leading-relaxed mb-6">
                We may monitor activity and submissions, but we do not guarantee continuous oversight. We may remove content, suspend accounts, or decline work that violates these Terms or presents compliance risk. Hashes and timestamps create an audit trail for approved versions.
              </p>

              {/* Section 9 */}
              <h2 className="text-3xl font-bold text-navy font-serif mt-12 mb-4">9. Restrictions</h2>
              <p className="text-black/80 leading-relaxed mb-4">You will not:</p>
              <ul className="list-disc pl-6 mb-6 text-black/80 space-y-2">
                <li>Misuse, copy, or scrape the Platform; introduce malware; bypass access controls; or use bots.</li>
                <li>Submit plagiarized content or unlicensed assets; misrepresent identity or credentials; or disclose confidential information.</li>
              </ul>

              {/* Section 10 */}
              <h2 className="text-3xl font-bold text-navy font-serif mt-12 mb-4">10. Intellectual Property</h2>
              <h3 className="text-xl font-semibold text-navy mt-6 mb-3">10.1 Your Content</h3>
              <p className="text-black/80 leading-relaxed mb-4">
                You retain ownership of content you submit. You grant CertREV a worldwide, royalty-free license to host, process, transmit, display, and create operational derivatives to provide the Services and generate audit artifacts.
              </p>
              <h3 className="text-xl font-semibold text-navy mt-6 mb-3">10.2 Expert Likeness</h3>
              <p className="text-black/80 leading-relaxed mb-4">
                Experts grant CertREV the right to provide Brands the attribution license described in §6.1 and to display reviewer identity on approved assets; no product ads without separate consent.
              </p>
              <h3 className="text-xl font-semibold text-navy mt-6 mb-3">10.3 Platform IP</h3>
              <p className="text-black/80 leading-relaxed mb-4">
                The Platform, badges, schemas, and related materials are owned by CertREV. Visible trust badges and credential metadata are part of the service deliverable.
              </p>
              <h3 className="text-xl font-semibold text-navy mt-6 mb-3">10.4 Usage Data and Feedback</h3>
              <p className="text-black/80 leading-relaxed mb-6">
                We may collect and use aggregated usage data and non-confidential feedback to improve the Services.
              </p>

              {/* Section 11 */}
              <h2 className="text-3xl font-bold text-navy font-serif mt-12 mb-4">11. Compliance and Disclaimers</h2>
              <h3 className="text-xl font-semibold text-navy mt-6 mb-3">11.1 No Professional Advice</h3>
              <p className="text-black/80 leading-relaxed mb-4">
                CertREV facilitates expert review. We do not provide medical, legal, or financial advice. Reviewers validate content against checklists; Brands remain the publisher of record.
              </p>
              <h3 className="text-xl font-semibold text-navy mt-6 mb-3">11.2 Required Disclaimers</h3>
              <p className="text-black/80 leading-relaxed mb-4">
                Brands must include applicable legal disclaimers (e.g., "Not medical advice"). Reviewers verify presence but do not supply your legal text.
              </p>
              <h3 className="text-xl font-semibold text-navy mt-6 mb-3">11.3 Safety and Quality</h3>
              <p className="text-black/80 leading-relaxed mb-6">
                Reviewers complete structured checks for accuracy, evidence, and regulatory language. If a draft fails, they return edit notes instead of signing.
              </p>

              {/* Section 12 */}
              <h2 className="text-3xl font-bold text-navy font-serif mt-12 mb-4">12. Term; Suspension; Termination</h2>
              <p className="text-black/80 leading-relaxed mb-6">
                Monthly memberships auto-renew until canceled. We may suspend or terminate access for violations or risk. Upon termination, operational licenses end, but Brand attribution rights on already approved assets remain subject to §6 and §6.3.
              </p>

              {/* Section 13 */}
              <h2 className="text-3xl font-bold text-navy font-serif mt-12 mb-4">13. Warranties and Limitation of Liability</h2>
              <p className="text-black/80 leading-relaxed mb-6 uppercase text-sm">
                THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE." WE DO NOT WARRANT RANKINGS, PUBLICATION, OR RESULTS. TO THE MAXIMUM EXTENT PERMITTED BY LAW, CERTREV'S TOTAL LIABILITY FOR ALL CLAIMS IN ANY 12-MONTH PERIOD WILL NOT EXCEED THE AMOUNTS YOU PAID TO CERTREV FOR THE SERVICES IN THAT PERIOD; WE ARE NOT LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES.
              </p>

              {/* Section 14 */}
              <h2 className="text-3xl font-bold text-navy font-serif mt-12 mb-4">14. Copyright Claims (DMCA)</h2>
              <p className="text-black/80 leading-relaxed mb-6">
                If you believe content on the Platform infringes your rights, send a notice containing the elements of 17 U.S.C. §512(c)(3) to <a href="mailto:owen@certrev.com" className="text-coral hover:underline">owen@certrev.com</a> with subject "DMCA Notice." We may remove or disable access to the material and notify the submitter. Counter-notices must follow §512(g).
              </p>

              {/* Section 15 */}
              <h2 className="text-3xl font-bold text-navy font-serif mt-12 mb-4">15. Privacy</h2>
              <p className="text-black/80 leading-relaxed mb-6">
                Use of the Services is subject to CertREV's <a href="/privacy" className="text-coral hover:underline">Privacy Policy</a>. If you are outside the U.S., you consent to processing in the U.S.
              </p>

              {/* Section 16 */}
              <h2 className="text-3xl font-bold text-navy font-serif mt-12 mb-4">16. Indemnification</h2>
              <p className="text-black/80 leading-relaxed mb-6">
                You will defend and indemnify CertREV and its personnel from third-party claims arising from your content, your use of the Services, or your violation of these Terms.
              </p>

              {/* Section 17 */}
              <h2 className="text-3xl font-bold text-navy font-serif mt-12 mb-4">17. Communications</h2>
              <p className="text-black/80 leading-relaxed mb-6">
                We may contact you at the email tied to your account about your use of the Services and updates to these Terms. Support: <a href="mailto:owen@certrev.com" className="text-coral hover:underline">owen@certrev.com</a>.
              </p>

              {/* Section 18 */}
              <h2 className="text-3xl font-bold text-navy font-serif mt-12 mb-4">18. Miscellaneous</h2>
              <p className="text-black/80 leading-relaxed mb-6">
                These Terms are the entire agreement for the Services. We may update them by posting a revised version; continued use means acceptance. If any part is unenforceable, the rest remains in effect. Governing law and venue: insert preferred state and venue. Parties waive class actions and agree to personal jurisdiction there.
              </p>

              {/* Appendices */}
              <h2 className="text-3xl font-bold text-navy font-serif mt-16 mb-4">Appendix A — Brand Submission Checklist</h2>
              <p className="text-black/80 leading-relaxed mb-6 text-sm bg-beige/30 p-6 rounded-lg">
                Near-final Google Doc with edit access; full word count; reputable citations; required disclaimers; image rights; one review cycle; no PHI; no locked files; no ghostwriting requests.
              </p>

              <h2 className="text-3xl font-bold text-navy font-serif mt-12 mb-4">Appendix B — Expert Review Scope</h2>
              <p className="text-black/80 leading-relaxed mb-6 text-sm bg-beige/30 p-6 rounded-lg">
                Complete Compliance Checklist; verify facts, sources, and disclaimers; add short relevant professional perspective; approve only when standards are met; no endorsements; attribution required; payment within 14 days of final approval.
              </p>

              <h2 className="text-3xl font-bold text-navy font-serif mt-12 mb-4">Appendix C — Credit Program</h2>
              <p className="text-black/80 leading-relaxed mb-6 text-sm bg-beige/30 p-6 rounded-lg">
                Credit-based reviews by tier; monthly bundles; add-ons at bundle rate; 90-day rollover; billed via Stripe; examples of bundles are illustrative and may change.
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
