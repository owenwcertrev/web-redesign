import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold text-charcoal mb-3">CertREV</h3>
            <p className="text-sm text-charcoal/70">
              Human validation in an AI-powered era
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-charcoal mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/eeat-meter" className="text-charcoal/70 hover:text-primary transition-colors text-sm">
                  E-E-A-T Meter
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-charcoal/70 hover:text-primary transition-colors text-sm">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/for-experts" className="text-charcoal/70 hover:text-primary transition-colors text-sm">
                  For Experts
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-charcoal mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/human-layer" className="text-charcoal/70 hover:text-primary transition-colors text-sm">
                  The Human Layer
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-charcoal/70 hover:text-primary transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-charcoal mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-charcoal/70">
              <li>
                <a href="mailto:certreviewed@gmail.com" className="hover:text-primary transition-colors">
                  certreviewed@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:213-422-8356" className="hover:text-primary transition-colors">
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
        <div className="pt-8 border-t border-black/5">
          <p className="text-sm text-charcoal/70 text-center">
            © 2025 CertREV. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
