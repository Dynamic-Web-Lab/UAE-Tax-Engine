import { useTranslation } from 'react-i18next';

export default function PrivacyPolicyPage() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  return (
    <div className={`min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 ${isArabic ? 'rtl' : 'ltr'}`}>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">
          {isArabic ? 'سياسة الخصوصية' : 'Privacy Policy'}
        </h1>
        <p className="text-gray-500 mb-8">
          {isArabic
            ? 'آخر تحديث: 6 مايو 2025'
            : 'Last Updated: May 6, 2025'}
        </p>

        <div className="prose prose-lg max-w-none">
          {isArabic ? (
            <PrivacyPolicyArabic />
          ) : (
            <PrivacyPolicyEnglish />
          )}
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-700">
            {isArabic
              ? 'إذا كان لديك أي استفسارات حول هذه السياسة، يرجى الاتصال بنا على: privacy@uae-tax-engine.com'
              : 'If you have any questions about this policy, please contact us at: privacy@uae-tax-engine.com'}
          </p>
        </div>
      </div>
    </div>
  );
}

function PrivacyPolicyEnglish() {
  return (
    <>
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">1. Introduction</h2>
        <p>
          UAE Tax Engine ("we", "our", or "us") operates the UAE Tax Engine application (the "Service").
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you
          use our Service, in compliance with the UAE Data Protection Law (Federal Law No. 45 of 2021).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">2. Information We Collect</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">2.1 Personal Data You Provide</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Account Information</strong>: Name, email address, phone number, password</li>
              <li><strong>Business Information</strong>: Business name, trade license number (TRN), business location</li>
              <li><strong>Financial Data</strong>: Bank account details, transaction history, income/expense records</li>
              <li><strong>Tax Information</strong>: Tax identification numbers, VAT registration details</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">2.2 Data from Bank Integrations</h3>
            <p>
              When you connect your UAE bank account through Lean Technologies (Open Banking), we access:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Transaction history (amounts, dates, merchant names)</li>
              <li>Account balances</li>
              <li>Transaction metadata (descriptions, categories)</li>
            </ul>
            <p className="mt-2 text-sm text-gray-600">
              <strong>Note:</strong> We never access your banking credentials. Bank authentication is handled
              directly by your bank using OAuth 2.0 secure protocol.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">2.3 Data from AI Services</h3>
            <p>
              When you use our AI features:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Transaction Classification</strong>: Transaction descriptions sent to Claude AI for categorization</li>
              <li><strong>Tax Optimization</strong>: Financial data may be used to generate optimization suggestions</li>
              <li><strong>Learning Data</strong>: Your categorization corrections help improve accuracy for your account</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">2.4 Automatically Collected Data</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Access times and pages visited</li>
              <li>Cookie information</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">3. How We Use Your Data</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">3.1 Essential Uses (No Consent Required)</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Providing the Service (tax calculations, transaction tracking)</li>
              <li>Processing payments and managing subscriptions</li>
              <li>Maintaining account security and preventing fraud</li>
              <li>Complying with legal obligations</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">3.2 Consent-Based Uses</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>AI Learning</strong>: Improving transaction classification (optional)</li>
              <li><strong>Analytics</strong>: Understanding usage patterns (optional)</li>
              <li><strong>Marketing</strong>: Sending promotional emails and updates (optional)</li>
            </ul>
            <p className="mt-2 text-sm text-gray-600">
              You can manage these preferences in your account settings at any time.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">4. Data Storage & Security</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">4.1 Data Location</h3>
            <p>
              All your data is stored in <strong>Azure UAE North</strong> data centers, ensuring compliance
              with UAE data residency requirements. No data is replicated to regions outside the UAE.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">4.2 Security Measures</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>End-to-end encryption for sensitive data</li>
              <li>TLS 1.3 for data in transit</li>
              <li>AES-256 encryption for data at rest</li>
              <li>Firebase Authentication with multi-factor authentication support</li>
              <li>Regular security audits and penetration testing</li>
              <li>Role-based access control for team members</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">4.3 Third-Party Processors</h3>
            <p>
              We share data with the following processors under Data Processing Addenda (DPA):
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Stripe</strong> - Payment processing (US)</li>
              <li><strong>Anthropic</strong> - AI classification (US)</li>
              <li><strong>Lean Technologies</strong> - Bank integration (UAE/EU)</li>
              <li><strong>Google Firebase</strong> - Database & authentication (Azure UAE North)</li>
              <li><strong>Microsoft Azure</strong> - Cloud infrastructure (UAE North)</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">5. Your Rights (UAE PDPL Articles 14-20)</h2>
        <p className="mb-4">
          Under the UAE Personal Data Protection Law, you have the right to:
        </p>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">5.1 Right of Access</h3>
            <p>
              You can request a copy of all your personal data we hold.
              Request via: <a href="/api/data-rights/access" className="text-blue-600 hover:underline">/account/data-request</a>
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">5.2 Right to Deletion</h3>
            <p>
              You can request deletion of your account and associated data.
              Deleted data is soft-deleted for 30 days (recoverable) then permanently removed.
              Request via: <a href="/account/delete-account" className="text-blue-600 hover:underline">/account/delete-account</a>
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">5.3 Right to Correction</h3>
            <p>
              You can request correction of inaccurate personal data.
              Contact us at: privacy@uae-tax-engine.com
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">5.4 Right to Data Portability</h3>
            <p>
              You can request your data in a machine-readable format (JSON/CSV).
              Request via: <a href="/account/data-request" className="text-blue-600 hover:underline">/account/data-request</a>
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">5.5 Right to Withdraw Consent</h3>
            <p>
              You can withdraw consent for optional data processing at any time.
              Manage your preferences in: <a href="/account/consent-preferences" className="text-blue-600 hover:underline">/account/consent-preferences</a>
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">6. Data Retention</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-3 text-left">Data Type</th>
              <th className="border border-gray-300 p-3 text-left">Retention Period</th>
              <th className="border border-gray-300 p-3 text-left">Reason</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            <tr>
              <td className="border border-gray-300 p-3">User Profile</td>
              <td className="border border-gray-300 p-3">10 years</td>
              <td className="border border-gray-300 p-3">Tax record retention requirement</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-3">Transactions</td>
              <td className="border border-gray-300 p-3">7 years</td>
              <td className="border border-gray-300 p-3">UAE business record requirement</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-3">Login Logs</td>
              <td className="border border-gray-300 p-3">90 days</td>
              <td className="border border-gray-300 p-3">Security monitoring</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-3">Audit Logs</td>
              <td className="border border-gray-300 p-3">7 years</td>
              <td className="border border-gray-300 p-3">Compliance & dispute resolution</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-3">Deleted Accounts</td>
              <td className="border border-gray-300 p-3">30 days</td>
              <td className="border border-gray-300 p-3">Recovery window, then permanent deletion</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">7. Cookies & Tracking</h2>
        <p>
          We use cookies for:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li><strong>Essential</strong>: Authentication, security (no consent required)</li>
          <li><strong>Analytics</strong>: Usage patterns to improve the service (requires consent)</li>
          <li><strong>Preferences</strong>: Saving your language and theme choices</li>
        </ul>
        <p className="mt-4">
          See our <a href="/legal/cookie-policy" className="text-blue-600 hover:underline">Cookie Policy</a> for details.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">8. Data Breach Notification</h2>
        <p>
          If we discover a data breach affecting your personal data, we will:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>Notify you within 72 hours of discovery</li>
          <li>Describe the nature of the breach</li>
          <li>Explain steps we've taken to mitigate impact</li>
          <li>Provide contact information for questions</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">9. Children's Privacy</h2>
        <p>
          Our Service is not intended for users under 18 years old. We do not knowingly collect personal data
          from children. If we learn we've collected data from a minor, we will delete it immediately.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">10. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy periodically. When we make material changes, we will:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>Update the "Last Updated" date at the top</li>
          <li>Notify you via email if you have an account</li>
          <li>Request new consent for significant changes</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">11. Contact Us</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <p><strong>Privacy Questions:</strong> privacy@uae-tax-engine.com</p>
          <p><strong>Data Subject Rights Requests:</strong> dsr@uae-tax-engine.com</p>
          <p><strong>Address:</strong> Dubai, United Arab Emirates</p>
          <p className="mt-4 text-sm text-gray-600">
            <strong>UAE Data Protection Authority:</strong><br />
            Email: dpa@dsc.gov.ae<br />
            Website: www.dsc.gov.ae
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-gray-900">12. Compliance</h2>
        <p>
          This Privacy Policy complies with:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>UAE Federal Law No. 45 of 2021 (Personal Data Protection Law)</li>
          <li>ADISA Guidelines for Data Protection</li>
          <li>TRA Implementing Regulations</li>
          <li>GDPR-equivalent standards for international compliance</li>
        </ul>
      </section>
    </>
  );
}

function PrivacyPolicyArabic() {
  return (
    <>
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">1. المقدمة</h2>
        <p>
          يعمل محرك الضرائب الإماراتي ("نحن" أو "خدمتنا") على تطبيق محرك الضرائب الإماراتي ("الخدمة").
          توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية معلوماتك عند استخدامك للخدمة،
          وفقاً لقانون حماية البيانات الشخصية الإماراتي (القانون الاتحادي رقم 45 لسنة 2021).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">2. المعلومات التي نجمعها</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">2.1 البيانات الشخصية التي تقدمها</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>معلومات الحساب</strong>: الاسم وعنوان البريد الإلكتروني ورقم الهاتف وكلمة المرور</li>
              <li><strong>معلومات العمل</strong>: اسم النشاط التجاري ورقم التسجيل التجاري</li>
              <li><strong>البيانات المالية</strong>: بيانات الحساب البنكي وسجل المعاملات والدخل والمصروفات</li>
              <li><strong>معلومات الضرائب</strong>: أرقام الضرائب وتفاصيل التسجيل الضريبي</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">2.2 البيانات من التكامل البنكي</h3>
            <p>
              عند ربط حسابك البنكي الإماراتي من خلال Lean Technologies (الخدمات المصرفية المفتوحة)، نتمكن من الوصول إلى:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>سجل المعاملات (المبالغ والتواريخ وأسماء التجار)</li>
              <li>أرصدة الحسابات</li>
              <li>بيانات وصف المعاملات والفئات</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">2.3 البيانات من خدمات الذكاء الاصطناعي</h3>
            <p>
              عند استخدام ميزاتنا الذكية:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>تصنيف المعاملات</strong>: وصف المعاملات يُرسل للذكاء الاصطناعي للتصنيف</li>
              <li><strong>تحسين الضرائب</strong>: قد تُستخدم البيانات المالية لتوليد اقتراحات التحسين</li>
              <li><strong>بيانات التعلم</strong>: تصحيحاتك تساعد في تحسين الدقة</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">3. كيفية استخدامنا لبياناتك</h2>
        <p>
          نستخدم بيانات الحساب الخاصة بك بشكل أساسي لتقديم الخدمة وتحسين تجربتك.
          لا نشارك بيانات الحساب مع أطراف ثالثة بدون موافقتك الصريحة.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">4. حماية البيانات والأمان</h2>
        <p>
          نستخدم تشفير من الدرجة الأولى وتدابير أمان متقدمة لحماية بياناتك.
          جميع البيانات مخزنة في خوادم Azure UAE North، مما يضمن الامتثال لمتطلبات إقامة البيانات الإماراتية.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">5. حقوقك (قانون حماية البيانات الإماراتي)</h2>
        <p>
          لديك الحق في الوصول إلى بياناتك وتصحيحها وحذفها والحصول على نسخة منها.
          يمكنك إدارة هذه الحقوق من خلال إعدادات حسابك.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">6. مدة الاحتفاظ بالبيانات</h2>
        <p>
          نحتفظ بالبيانات المالية لمدة 7 سنوات (متطلبات السجلات التجارية الإماراتية)،
          وبيانات الحساب لمدة 10 سنوات (متطلبات السجلات الضريبية).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">7. التواصل معنا</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <p><strong>أسئلة الخصوصية:</strong> privacy@uae-tax-engine.com</p>
          <p><strong>طلبات حقوق الوصول:</strong> dsr@uae-tax-engine.com</p>
          <p className="mt-4 text-sm text-gray-600">
            <strong>سلطة حماية البيانات الإماراتية:</strong><br />
            البريد الإلكتروني: dpa@dsc.gov.ae<br />
            الموقع: www.dsc.gov.ae
          </p>
        </div>
      </section>
    </>
  );
}
