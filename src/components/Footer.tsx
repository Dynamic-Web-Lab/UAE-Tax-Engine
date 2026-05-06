'use client';

/**
 * Footer - Navigation and legal links
 */

import { useTranslation } from 'react-i18next';
import Link from 'next/link';

export function Footer() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  return (
    <footer
      className={`bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8 ${
        isArabic ? 'rtl' : 'ltr'
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Branding */}
          <div>
            <h3 className="text-white font-bold text-lg mb-2">UAE Tax Engine</h3>
            <p className="text-sm">
              {isArabic
                ? 'منصة إدارة الضرائب في الوقت الفعلي للشركات الإماراتية'
                : 'Real-time tax management for UAE businesses'}
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4">
              {isArabic ? 'المنتج' : 'Product'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/dashboard" className="hover:text-white transition">
                  {isArabic ? 'لوحة التحكم' : 'Dashboard'}
                </a>
              </li>
              <li>
                <a href="/transactions" className="hover:text-white transition">
                  {isArabic ? 'المعاملات' : 'Transactions'}
                </a>
              </li>
              <li>
                <a href="/reports" className="hover:text-white transition">
                  {isArabic ? 'التقارير' : 'Reports'}
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">
              {isArabic ? 'الشركة' : 'Company'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/about" className="hover:text-white transition">
                  {isArabic ? 'حول' : 'About'}
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white transition">
                  {isArabic ? 'اتصل بنا' : 'Contact'}
                </a>
              </li>
              <li>
                <a href="/blog" className="hover:text-white transition">
                  {isArabic ? 'المدونة' : 'Blog'}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">
              {isArabic ? 'قانوني' : 'Legal'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/legal/privacy-policy"
                  className="hover:text-white transition"
                >
                  {isArabic ? 'سياسة الخصوصية' : 'Privacy Policy'}
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/terms-of-service"
                  className="hover:text-white transition"
                >
                  {isArabic ? 'شروط الخدمة' : 'Terms of Service'}
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/cookie-policy"
                  className="hover:text-white transition"
                >
                  {isArabic ? 'سياسة ملفات تعريف الارتباط' : 'Cookie Policy'}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} UAE Tax Engine.{' '}
              {isArabic ? 'جميع الحقوق محفوظة' : 'All rights reserved'}.
            </p>

            {/* Contact Info */}
            <div className="text-sm text-gray-400 mt-4 md:mt-0">
              <p>
                {isArabic ? 'البريد الإلكتروني' : 'Email'}:{' '}
                <a
                  href="mailto:privacy@uae-tax-engine.com"
                  className="hover:text-white transition"
                >
                  privacy@uae-tax-engine.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Compliance Statement */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <p className="text-xs text-gray-500 text-center">
            {isArabic
              ? 'هذا الموقع يخضع لقانون حماية البيانات الشخصية الإماراتي (القانون الاتحادي رقم 45 لسنة 2021)'
              : 'This site is subject to UAE Personal Data Protection Law (Federal Law No. 45 of 2021)'}
          </p>
        </div>
      </div>
    </footer>
  );
}
