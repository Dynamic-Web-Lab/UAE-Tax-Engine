'use client';

/**
 * Consent Preferences Page - Allows users to manage their data consent settings
 * Implements PDPL Article 21 (right to withdraw consent)
 */

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConsentManager } from '@/lib/compliance/consent-manager';
import { ConsentType, UserConsent, ConsentRecord } from '@/types/compliance';

interface ConsentState {
  essential: ConsentRecord | null;
  analytics: ConsentRecord | null;
  aiLearning: ConsentRecord | null;
  marketing: ConsentRecord | null;
  thirdParty: ConsentRecord | null;
}

export default function ConsentPreferencesPage() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userConsent, setUserConsent] = useState<UserConsent | null>(null);
  const [consentHistory, setConsentHistory] = useState<ConsentRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>(
    'idle'
  );

  useEffect(() => {
    // In production, get userId from auth context
    // For now, get from localStorage or query param
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      loadConsentData(storedUserId);
    } else {
      setError('User not authenticated');
      setLoading(false);
    }
  }, []);

  const loadConsentData = async (uid: string) => {
    try {
      setLoading(true);
      const consent = await ConsentManager.getUserConsent(uid);
      const history = await ConsentManager.getConsentHistory(uid);

      setUserConsent(consent);
      setConsentHistory(history);
      setError(null);
    } catch (err) {
      console.error('Failed to load consent data:', err);
      setError('Failed to load your preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleConsent = async (
    consentType: ConsentType
  ) => {
    if (!userId) return;

    if (consentType === ConsentType.ESSENTIAL) {
      setError('Cannot change essential consent');
      return;
    }

    try {
      setSaveStatus('saving');

      // Toggle the consent
      const currentConsent = userConsent ? (userConsent as any)[
        consentType === ConsentType.ANALYTICS ? 'analytics' :
        consentType === ConsentType.AI_LEARNING ? 'aiLearning' :
        consentType === ConsentType.MARKETING ? 'marketing' :
        'thirdParty'
      ] : null;

      const newValue = !currentConsent?.given;

      await ConsentManager.recordConsent(
        userId,
        consentType,
        newValue,
        'settings'
      );

      // Reload data
      await loadConsentData(userId);
      setSaveStatus('saved');

      // Reset save status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      console.error('Failed to update consent:', err);
      setSaveStatus('error');
      setError('Failed to save preference. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-gray-50 py-12 px-4 ${isArabic ? 'rtl' : 'ltr'}`}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center">
            <p>{isArabic ? 'جاري التحميل...' : 'Loading...'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !userConsent) {
    return (
      <div className={`min-h-screen bg-gray-50 py-12 px-4 ${isArabic ? 'rtl' : 'ltr'}`}>
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-700">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 ${
        isArabic ? 'rtl' : 'ltr'
      }`}
    >
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isArabic ? 'تفضيلات الموافقة' : 'Consent Preferences'}
        </h1>
        <p className="text-gray-600 mb-8">
          {isArabic
            ? 'أدر كيفية استخدام بياناتك الشخصية'
            : 'Manage how your personal data is used'}
        </p>

        {error && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6 text-yellow-700">
            {error}
          </div>
        )}

        {saveStatus === 'saved' && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6 text-green-700">
            {isArabic ? 'تم حفظ التفضيلات بنجاح' : 'Preferences saved successfully'}
          </div>
        )}

        {saveStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6 text-red-700">
            {isArabic ? 'فشل الحفظ. حاول مرة أخرى' : 'Failed to save. Please try again'}
          </div>
        )}

        {userConsent && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  {isArabic ? 'حالتك الحالية' : 'Current Status'}
                </h2>
              </div>

              <div className="p-6 space-y-4">
                <ConsentStatus
                  label={isArabic ? 'ملفات تعريف أساسية' : 'Essential Cookies'}
                  description={
                    isArabic
                      ? 'مطلوب للأمان والوظائف الأساسية'
                      : 'Required for security and functionality'
                  }
                  status={userConsent.essentials?.given === true}
                  disabled={true}
                />

                <ConsentStatus
                  label={isArabic ? 'تحليل الاستخدام' : 'Analytics'}
                  description={
                    isArabic
                      ? 'تساعدنا على تحسين التطبيق'
                      : 'Helps us improve the app'
                  }
                  status={userConsent.analytics?.given === true}
                  loading={saveStatus === 'saving'}
                  onToggle={() => handleToggleConsent(ConsentType.ANALYTICS)}
                />

                <ConsentStatus
                  label={isArabic ? 'تحسين الذكاء الاصطناعي' : 'AI Improvement'}
                  description={
                    isArabic
                      ? 'السماح بتحسين نماذج الذكاء الاصطناعي'
                      : 'Allow AI model training'
                  }
                  status={userConsent.aiLearning?.given === true}
                  loading={saveStatus === 'saving'}
                  onToggle={() => handleToggleConsent(ConsentType.AI_LEARNING)}
                />

                <ConsentStatus
                  label={isArabic ? 'التسويق' : 'Marketing'}
                  description={
                    isArabic
                      ? 'تلقي رسائل تسويقية مخصصة'
                      : 'Receive marketing communications'
                  }
                  status={userConsent.marketing?.given === true}
                  loading={saveStatus === 'saving'}
                  onToggle={() => handleToggleConsent(ConsentType.MARKETING)}
                />

                <ConsentStatus
                  label={isArabic ? 'مشاركة الطرف الثالث' : 'Third-Party Sharing'}
                  description={
                    isArabic
                      ? 'مشاركة البيانات مع الأطراف الثالثة الموثوقة'
                      : 'Share with trusted third parties'
                  }
                  status={userConsent.thirdParty?.given === true}
                  loading={saveStatus === 'saving'}
                  onToggle={() => handleToggleConsent(ConsentType.THIRD_PARTY)}
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                {showHistory ? '▼' : '▶'}
                {isArabic ? 'عرض سجل الموافقة' : 'View Consent History'}
              </button>

              {showHistory && consentHistory.length > 0 && (
                <div className="mt-4 space-y-3">
                  {consentHistory.slice(0, 10).map((record, idx) => (
                    <div key={idx} className="text-sm text-gray-600 pb-3 border-b">
                      <p className="font-medium">
                        {record.type.toUpperCase()}: {record.given ? '✓ Accepted' : '✗ Rejected'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(record.timestamp).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {isArabic ? 'المصدر' : 'Source'}: {record.source}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-sm text-blue-900 mb-4">
                {isArabic
                  ? 'يمكنك تغيير تفضيلاتك في أي وقت. قد يستغرق سريان التغييرات بعض الوقت.'
                  : 'You can change your preferences anytime. Changes may take a few moments to take effect.'}
              </p>
              <p className="text-xs text-blue-800">
                {isArabic ? 'اقرأ المزيد في ' : 'Learn more in our '}
                <a
                  href="/legal/cookie-policy"
                  className="font-semibold hover:underline"
                >
                  {isArabic ? 'سياسة ملفات تعريف الارتباط' : 'Cookie Policy'}
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface ConsentStatusProps {
  label: string;
  description: string;
  status: boolean;
  disabled?: boolean;
  loading?: boolean;
  onToggle?: () => void;
}

function ConsentStatus({
  label,
  description,
  status,
  disabled,
  loading,
  onToggle,
}: ConsentStatusProps) {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{label}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>

      {disabled ? (
        <div className="text-green-600 font-semibold">
          {status ? '✓ Required' : '✗'}
        </div>
      ) : (
        <button
          onClick={onToggle}
          disabled={disabled || loading}
          className={`${
            status ? 'bg-green-600' : 'bg-gray-300'
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            disabled || loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
          }`}
        >
          <span
            className={`${
              status ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </button>
      )}
    </div>
  );
}
