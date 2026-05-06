import { useTranslation } from 'react-i18next';

export default function CookiePolicyPage() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  return (
    <div className={`min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 ${isArabic ? 'rtl' : 'ltr'}`}>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">
          {isArabic ? 'سياسة ملفات تعريف الارتباط' : 'Cookie Policy'}
        </h1>
        <p className="text-gray-500 mb-8">
          {isArabic
            ? 'آخر تحديث: 6 مايو 2025'
            : 'Last Updated: May 6, 2025'}
        </p>

        <div className="prose prose-lg max-w-none">
          {isArabic ? <CookiePolicyArabic /> : <CookiePolicyEnglish />}
        </div>
      </div>
    </div>
  );
}

function CookiePolicyEnglish() {
  return (
    <>
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">What Are Cookies?</h2>
        <p>
          Cookies are small text files stored on your device (computer, tablet, smartphone) that websites and
          applications place on your browser when you visit them. They help websites remember information about you,
          such as your preferences, language choice, and login status.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Types of Cookies We Use</h2>

        <div className="space-y-6">
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="text-xl font-semibold mb-2 text-green-700">1. Essential Cookies (No Consent Required)</h3>
            <p className="mb-2">
              These cookies are necessary for the Service to function properly. Without them, features like login and
              security cannot work.
            </p>
            <table className="w-full text-sm border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 text-left border">Cookie Name</th>
                  <th className="p-2 text-left border">Purpose</th>
                  <th className="p-2 text-left border">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border">__session</td>
                  <td className="p-2 border">User authentication & session management</td>
                  <td className="p-2 border">Until logout</td>
                </tr>
                <tr>
                  <td className="p-2 border">CSRF token</td>
                  <td className="p-2 border">Protection against CSRF attacks</td>
                  <td className="p-2 border">Session</td>
                </tr>
                <tr>
                  <td className="p-2 border">lang</td>
                  <td className="p-2 border">Preferred language (English/Arabic)</td>
                  <td className="p-2 border">1 year</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="text-xl font-semibold mb-2 text-blue-700">2. Analytics Cookies (Consent Required)</h3>
            <p className="mb-2">
              These cookies help us understand how users interact with the Service to improve functionality.
              <strong> You can opt-out in your consent preferences.</strong>
            </p>
            <table className="w-full text-sm border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 text-left border">Service</th>
                  <th className="p-2 text-left border">Purpose</th>
                  <th className="p-2 text-left border">Data Shared</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border">Google Analytics</td>
                  <td className="p-2 border">Track page views, user behavior</td>
                  <td className="p-2 border">Anonymized usage data</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="text-xl font-semibold mb-2 text-purple-700">3. Preference Cookies (Consent Required)</h3>
            <p className="mb-2">
              These remember your preferences to enhance user experience.
              <strong> You can opt-out in your consent preferences.</strong>
            </p>
            <table className="w-full text-sm border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 text-left border">Cookie Name</th>
                  <th className="p-2 text-left border">Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border">theme</td>
                  <td className="p-2 border">Dark/light mode preference</td>
                </tr>
                <tr>
                  <td className="p-2 border">sidebar</td>
                  <td className="p-2 border">Sidebar open/closed state</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border-l-4 border-orange-500 pl-4">
            <h3 className="text-xl font-semibold mb-2 text-orange-700">4. Marketing Cookies (Consent Required)</h3>
            <p>
              These may be used to deliver personalized advertisements.
              <strong> You can opt-out in your consent preferences.</strong>
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Third-Party Cookies</h2>
        <p>
          We use cookies from the following third-party services:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
          <li><strong>Google Analytics</strong> - Usage analytics (optional with consent)</li>
          <li><strong>Firebase</strong> - Authentication & real-time database (essential)</li>
          <li><strong>Stripe</strong> - Payment processing (essential during checkout)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Managing Your Cookies</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">In Our App</h3>
            <p>
              You can manage cookie preferences anytime by visiting your
              <a href="/account/consent-preferences" className="text-blue-600 hover:underline">
                {' '}Consent Preferences
              </a>
              page.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">In Your Browser</h3>
            <p>You can control cookies through your browser settings:</p>
            <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
              <li>
                <strong>Chrome</strong>: Settings → Privacy and Security → Cookies
              </li>
              <li>
                <strong>Firefox</strong>: Preferences → Privacy & Security → Cookies
              </li>
              <li>
                <strong>Safari</strong>: Preferences → Privacy → Cookies
              </li>
              <li>
                <strong>Edge</strong>: Settings → Privacy → Cookies
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-sm">
              <strong>⚠️ Note:</strong> Disabling essential cookies may prevent the Service from functioning properly.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Do Not Track (DNT)</h2>
        <p>
          Some browsers include a Do Not Track (DNT) feature. Currently, our Service does not respond to DNT signals,
          but you can manage tracking preferences through your
          <a href="/account/consent-preferences" className="text-blue-600 hover:underline">
            {' '}Consent Preferences.
          </a>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Your Rights</h2>
        <p>
          Under UAE Data Protection Law, you have the right to:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
          <li>Know what cookies are used and why</li>
          <li>Opt out of non-essential cookies at any time</li>
          <li>Access data collected via cookies</li>
          <li>Request deletion of cookie data</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Contact Us</h2>
        <p>
          If you have questions about our cookie practices, please contact:
        </p>
        <div className="bg-gray-50 p-6 rounded-lg mt-4">
          <p><strong>Email:</strong> privacy@uae-tax-engine.com</p>
          <p><strong>Address:</strong> Dubai, United Arab Emirates</p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Policy Changes</h2>
        <p>
          We may update this Cookie Policy periodically. The latest version is always available on this page.
          Changes take effect immediately upon posting.
        </p>
      </section>
    </>
  );
}

function CookiePolicyArabic() {
  return (
    <>
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">ما هي ملفات تعريف الارتباط؟</h2>
        <p>
          ملفات تعريف الارتباط هي ملفات نصية صغيرة يتم تخزينها على جهازك التي تساعد المواقع على تذكر معلومات عنك
          مثل تفضيلاتك واختيار اللغة وحالة تسجيل الدخول.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">أنواع ملفات تعريف الارتباط التي نستخدمها</h2>

        <div className="space-y-6">
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="text-xl font-semibold mb-2 text-green-700">1. ملفات تعريف الارتباط الأساسية</h3>
            <p>
              هذه الملفات ضرورية لتشغيل الخدمة. بدونها، لا يمكن تسجيل الدخول والأمان.
            </p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="text-xl font-semibold mb-2 text-blue-700">2. ملفات تعريف الارتباط التحليلية</h3>
            <p>
              تساعدنا على فهم كيفية استخدامك للخدمة. يمكنك رفضها في إعدادات الموافقة.
            </p>
          </div>

          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="text-xl font-semibold mb-2 text-purple-700">3. ملفات تعريف تفضيلاتك</h3>
            <p>
              تتذكر تفضيلاتك مثل اللغة والمظهر. يمكنك رفضها في إعدادات الموافقة.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">إدارة ملفات تعريف الارتباط</h2>
        <p>
          يمكنك إدارة تفضيلاتك في أي وقت من خلال
          <a href="/account/consent-preferences" className="text-blue-600 hover:underline">
            {' '}إعدادات الموافقة.
          </a>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">حقوقك</h2>
        <p>
          بموجب قانون حماية البيانات الإماراتي، لديك الحق في:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
          <li>معرفة ملفات تعريف الارتباط المستخدمة والسبب</li>
          <li>رفض ملفات تعريف الارتباط غير الأساسية في أي وقت</li>
          <li>الوصول إلى البيانات المجمعة</li>
          <li>طلب حذف البيانات</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">التواصل معنا</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <p><strong>البريد الإلكتروني:</strong> privacy@uae-tax-engine.com</p>
          <p><strong>العنوان:</strong> دبي، الإمارات العربية المتحدة</p>
        </div>
      </section>
    </>
  );
}
