import Link from 'next/link'
import TextureOverlay from './TextureOverlay'
import OrganicShape from './OrganicShape'

export default function Footer() {
  return (
    <footer className="bg-beige border-t border-navy/10 relative overflow-hidden">
      <TextureOverlay type="paper" opacity={0.3} />
      <OrganicShape variant="blob3" color="lime" className="absolute -bottom-20 -left-20 w-96 h-96" opacity={0.06} />
      <OrganicShape variant="blob1" color="coral" className="absolute -top-10 -right-10 w-64 h-64" opacity={0.05} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold text-navy mb-3 font-serif">CertREV</h3>
            <p className="text-sm text-black/70 leading-relaxed">
              Human-in-the-loop validation for AI-powered content
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-navy mb-4 font-serif">Product</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/eeat-meter" className="text-black/70 hover:text-coral transition-colors text-sm">
                  E-E-A-T Meter
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-black/70 hover:text-coral transition-colors text-sm">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/for-experts" className="text-black/70 hover:text-coral transition-colors text-sm">
                  For Experts
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-navy mb-4 font-serif">Resources</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/human-layer" className="text-black/70 hover:text-coral transition-colors text-sm">
                  The Human Layer
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-black/70 hover:text-coral transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-navy mb-4 font-serif">Contact</h4>
            <ul className="space-y-3 text-sm text-black/70">
              <li>
                <a href="mailto:certreviewed@gmail.com" className="hover:text-coral transition-colors">
                  certreviewed@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:213-422-8356" className="hover:text-coral transition-colors">
                  213-422-8356
                </a>
              </li>
              <li className="pt-2">
                500 Westover Dr. #33166<br />
                Sanford, NC 27330
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-navy/10">
          <p className="text-sm text-black/60 text-center">
            © 2025 CertREV. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
