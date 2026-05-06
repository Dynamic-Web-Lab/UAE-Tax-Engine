import Link from 'next/link';

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}

      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Legal Documents</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/legal/privacy-policy" className="hover:text-blue-400">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/legal/terms-of-service" className="hover:text-blue-400">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/legal/cookie-policy" className="hover:text-blue-400">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a href="mailto:support@uae-tax-engine.com" className="hover:text-blue-400">
                    support@uae-tax-engine.com
                  </a>
                </li>
                <li>
                  <a href="mailto:privacy@uae-tax-engine.com" className="hover:text-blue-400">
                    privacy@uae-tax-engine.com
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Compliance</h3>
              <p className="text-sm text-gray-400">
                Compliant with UAE Data Protection Law (Federal Law No. 45 of 2021)
              </p>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <p className="text-center text-gray-400 text-sm">
              © 2025 UAE Tax Engine. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
