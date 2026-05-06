import { useTranslation } from 'react-i18next';

export default function TermsOfServicePage() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  return (
    <div className={`min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 ${isArabic ? 'rtl' : 'ltr'}`}>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">
          {isArabic ? 'شروط الخدمة' : 'Terms of Service'}
        </h1>
        <p className="text-gray-500 mb-8">
          {isArabic
            ? 'آخر تحديث: 6 مايو 2025'
            : 'Last Updated: May 6, 2025'}
        </p>

        <div className="prose prose-lg max-w-none">
          {isArabic ? (
            <TermsOfServiceArabic />
          ) : (
            <TermsOfServiceEnglish />
          )}
        </div>

        <div className="mt-12 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-gray-700 font-semibold">
            {isArabic
              ? '⚠️ إخلاء المسؤولية: لا توفر هذه الخدمة مشورة قانونية أو ضريبية. استشر دائماً محترفاً مؤهلاً قبل اتخاذ قرارات ضريبية.'
              : '⚠️ Disclaimer: This service does not provide legal or tax advice. Always consult a qualified professional before making tax decisions.'}
          </p>
        </div>
      </div>
    </div>
  );
}

function TermsOfServiceEnglish() {
  return (
    <>
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">1. Acceptance of Terms</h2>
        <p>
          By accessing and using the UAE Tax Engine ("Service"), you accept and agree to be bound by and comply
          with these Terms of Service. If you do not agree to abide by these terms, you should not use this service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">2. Service Description</h2>
        <p>
          UAE Tax Engine is a web-based tax calculation and tracking application designed to help UAE micro-businesses,
          freelancers, and e-commerce sellers:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>Track tax position in real-time</li>
          <li>Calculate Corporate Tax (CT) and VAT liability</li>
          <li>Classify business transactions using AI</li>
          <li>Generate tax optimization suggestions</li>
          <li>Export FTA-compliant tax return data</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">3. Use License</h2>
        <p>
          Permission is granted to temporarily download one copy of the materials (information or software) on
          the UAE Tax Engine for personal, non-commercial transitory viewing only. This is the grant of a license,
          not a transfer of title, and under this license you may not:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>Modify or copy the materials</li>
          <li>Use the materials for any commercial purpose or for any public display</li>
          <li>Attempt to decompile or reverse engineer any software contained on the Service</li>
          <li>Remove any copyright or other proprietary notations from the materials</li>
          <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
          <li>Use the Service to transmit any unlawful, threatening, abusive, defamatory, obscene, or otherwise objectionable material</li>
          <li>Disrupt the normal flow of dialogue within the Service</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">4. Account Registration</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">4.1 Eligibility</h3>
            <p>
              You must be at least 18 years old to use this Service. You represent and warrant that you are of legal age
              and have the authority to enter into this agreement.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">4.2 Account Credentials</h3>
            <p>
              You are responsible for maintaining the confidentiality of your password and account information.
              You agree to accept responsibility for all activities that occur under your account. You must notify
              us immediately of any unauthorized use of your account.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">4.3 Accurate Information</h3>
            <p>
              You agree to provide accurate, current, and complete information during registration and to update
              such information to keep it accurate, current, and complete.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">5. Limitation of Liability</h2>
        <div className="bg-red-50 p-6 rounded-lg border border-red-200 space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">5.1 Disclaimer</h3>
            <p>
              THE MATERIALS ON THE UAE TAX ENGINE ARE PROVIDED ON AN 'AS IS' BASIS. UAE TAX ENGINE MAKES NO WARRANTIES,
              EXPRESSED OR IMPLIED, AND HEREBY DISCLAIMS AND NEGATES ALL OTHER WARRANTIES INCLUDING, WITHOUT LIMITATION,
              IMPLIED WARRANTIES OR CONDITIONS OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT
              OF INTELLECTUAL PROPERTY OR OTHER VIOLATION OF RIGHTS.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">5.2 Tax & Legal Advice</h3>
            <p className="font-semibold">
              IMPORTANT: This Service does NOT provide tax advice, legal advice, or professional accounting services.
            </p>
            <p>
              While we strive for accuracy, tax calculations are generated by an automated system and may contain errors.
              All tax information should be verified by a qualified tax professional before filing with the UAE Federal
              Tax Authority (FTA).
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">5.3 Limitation of Damages</h3>
            <p>
              IN NO EVENT SHALL UAE TAX ENGINE OR ITS SUPPLIERS BE LIABLE FOR ANY DAMAGES (INCLUDING, WITHOUT LIMITATION,
              DAMAGES FOR LOSS OF DATA OR PROFIT, OR DUE TO BUSINESS INTERRUPTION) ARISING OUT OF THE USE OR INABILITY
              TO USE THE MATERIALS ON THE UAE TAX ENGINE, EVEN IF UAE TAX ENGINE OR AN AUTHORIZED REPRESENTATIVE HAS BEEN
              NOTIFIED ORALLY OR IN WRITING OF THE POSSIBILITY OF SUCH DAMAGE.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">5.4 Financial Loss</h3>
            <p>
              We are not responsible for any tax miscalculations, financial losses, or penalties resulting from:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Inaccurate data entry by the user</li>
              <li>Misinterpretation of tax rules or regulations</li>
              <li>Changes in UAE tax law after data was entered</li>
              <li>Service outages or technical errors</li>
              <li>Integration errors with third-party services</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">6. Subscription & Billing</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">6.1 Pricing</h3>
            <p>
              Current pricing is displayed at checkout. Prices may change with 30 days' notice. Price changes do not
              apply to existing active subscriptions.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">6.2 Billing Cycle</h3>
            <p>
              Subscriptions are billed monthly in advance. Billing occurs on the same date each month as your
              subscription date.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">6.3 Cancellation</h3>
            <p>
              You may cancel your subscription at any time. Cancellation takes effect at the end of the current billing
              cycle. No refunds are provided for partial billing periods.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">6.4 Non-Refundable Service</h3>
            <p>
              All payments for subscriptions are non-refundable except as required by law. Refunds will only be issued if
              the Service fails to provide the core features described.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">7. Data Ownership & Intellectual Property</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">7.1 Your Data</h3>
            <p>
              All transaction data, financial information, and personal data you upload remains your property.
              You grant us a limited license to process this data solely to provide the Service.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">7.2 Our Content</h3>
            <p>
              All materials on the Service, including text, graphics, logos, images, and software, are the property of
              UAE Tax Engine or its content suppliers and are protected by international copyright laws.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">7.3 AI-Generated Content</h3>
            <p>
              Categories and suggestions generated by our AI system are provided for informational purposes only.
              You retain all rights to the underlying transaction data. We may use anonymized data to improve our AI model.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">8. Permitted & Prohibited Uses</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">8.1 Permitted Uses</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Track your own business financial data</li>
              <li>Generate reports for personal or business use</li>
              <li>Export data for tax filings</li>
              <li>View AI-generated suggestions</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">8.2 Prohibited Uses</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Accessing another user's account without permission</li>
              <li>Using automated tools to scrape or bulk download data</li>
              <li>Sharing login credentials with unauthorized users</li>
              <li>Attempting to bypass security measures</li>
              <li>Using the Service for illegal activities</li>
              <li>Harassing, threatening, or abusive behavior toward staff</li>
              <li>Reverse engineering or decompiling the Service</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">9. Accuracy of Data</h2>
        <p>
          You are solely responsible for the accuracy of data you enter into the Service. We provide tools to validate
          and verify data, but we make no guarantees regarding accuracy. It is your responsibility to:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>Ensure all entered data is accurate and complete</li>
          <li>Reconcile transactions regularly</li>
          <li>Verify calculations before filing with authorities</li>
          <li>Consult a tax professional for complex situations</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">10. Indemnification</h2>
        <p>
          You agree to indemnify, defend, and hold harmless UAE Tax Engine and its officers, directors, employees,
          and agents from and against all claims, actions, damages, losses, liabilities, and expenses arising out of
          or related to your use of the Service or breach of these terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">11. Service Availability & Maintenance</h2>
        <p>
          We strive for 99% uptime but make no guarantees. The Service may be interrupted for:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>Scheduled maintenance (announced 48 hours in advance)</li>
          <li>Emergency maintenance (unscheduled outages)</li>
          <li>Third-party service failures (Firebase, Azure, APIs)</li>
          <li>External attacks or security incidents</li>
        </ul>
        <p className="mt-4">
          We are not liable for losses or damages caused by service unavailability.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">12. Governing Law & Jurisdiction</h2>
        <p>
          These Terms of Service are governed by and construed in accordance with the laws of the United Arab Emirates,
          without regard to its conflict of law provisions. Any disputes arising under or related to these terms shall be
          subject to the exclusive jurisdiction of the courts of Dubai, UAE.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">13. Dispute Resolution</h2>
        <p>
          Before initiating legal action, we encourage both parties to attempt resolution through good-faith negotiation.
          If negotiation fails, disputes may be escalated to arbitration under UAE arbitration law.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">14. Termination of Service</h2>
        <p>
          We reserve the right to terminate or suspend your account and access to the Service at any time, with or without
          cause, with or without notice. Grounds for termination include:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>Violation of these Terms of Service</li>
          <li>Illegal activity or fraud</li>
          <li>Harassment or abusive behavior</li>
          <li>Non-payment of subscription fees</li>
          <li>Request from legal authorities</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">15. Modifications to Terms</h2>
        <p>
          We may revise these Terms of Service at any time. Changes become effective upon posting to the Service.
          Continued use of the Service following the posting of revised Terms means you accept and agree to the changes.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">16. Severability</h2>
        <p>
          If any provision of these Terms of Service is found to be invalid or unenforceable, that provision shall be
          modified to the minimum extent necessary to make it valid, or if not possible, severed, and the remaining
          provisions shall remain in full force and effect.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">17. Contact Information</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <p><strong>For support inquiries:</strong> support@uae-tax-engine.com</p>
          <p><strong>For legal notices:</strong> legal@uae-tax-engine.com</p>
          <p><strong>Address:</strong> Dubai, United Arab Emirates</p>
          <p><strong>Phone:</strong> +971 [contact number]</p>
        </div>
      </section>
    </>
  );
}

function TermsOfServiceArabic() {
  return (
    <>
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">1. قبول الشروط</h2>
        <p>
          بالوصول واستخدام محرك الضرائب الإماراتي ("الخدمة")، فإنك توافق على الالتزام بشروط الخدمة هذه.
          إذا كنت لا توافق على هذه الشروط، فلا يجب عليك استخدام هذه الخدمة.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">2. وصف الخدمة</h2>
        <p>
          محرك الضرائب الإماراتي هو تطبيق قائم على الويب مصمم لمساعدة الشركات الصغيرة والعاملين بحرية والبائعين الإلكترونيين:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>تتبع الوضع الضريبي في الوقت الفعلي</li>
          <li>حساب ضريبة الشركات والضريبة المضافة</li>
          <li>تصنيف العمليات باستخدام الذكاء الاصطناعي</li>
          <li>توليد اقتراحات تحسين ضريبي</li>
          <li>تصدير بيانات الإقرار الضريبي</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">3. محدودية المسؤولية</h2>
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <p className="font-semibold text-red-800">
            تحذير هام: هذه الخدمة لا توفر مشورة ضريبية أو قانونية. يجب عليك دائماً استشارة متخصص مؤهل
            قبل اتخاذ قرارات ضريبية رسمية.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">4. الفوترة والاشتراك</h2>
        <p>
          يتم فرض رسوم الاشتراك شهرياً مقدماً. يمكنك إلغاء الاشتراك في أي وقت. لا يتم استرجاع الأموال
          لفترات الفوترة الجزئية.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">5. البيانات المالية</h2>
        <p>
          أنت مسؤول بمفردك عن دقة جميع البيانات التي تدخلها في الخدمة. يجب عليك التحقق من جميع الحسابات
          من قبل متخصص ضريبي مؤهل قبل تقديمها للسلطات.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">6. القانون الحاكم</h2>
        <p>
          تُحكم هذه الشروط بقوانين دولة الإمارات العربية المتحدة. تخضع أي نزاعات للاختصاص الحصري
          لمحاكم إمارة دبي.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">7. التواصل معنا</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <p><strong>لاستفسارات الدعم:</strong> support@uae-tax-engine.com</p>
          <p><strong>للإشعارات القانونية:</strong> legal@uae-tax-engine.com</p>
          <p><strong>العنوان:</strong> دبي، الإمارات العربية المتحدة</p>
        </div>
      </section>
    </>
  );
}
