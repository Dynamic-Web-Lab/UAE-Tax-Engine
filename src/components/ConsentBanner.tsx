'use client';

/**
 * Consent Banner - Displays on first visit to collect user consent
 * Implements PDPL Article 7 consent requirements
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ConsentManager } from '@/lib/compliance/consent-manager';
import { ConsentType } from '@/types/compliance';

interface ConsentBannerProps {
  userId?: string;
  onConsentChange?: (consents: Record<string, boolean>) => void;
}

export function ConsentBanner({ userId, onConsentChange }: ConsentBannerProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [consents, setConsents] = useState<Record<ConsentType, boolean>>({
    [ConsentType.ESSENTIAL]: true, // Always true
    [ConsentType.ANALYTICS]: false,
    [ConsentType.AI_LEARNING]: false,
    [ConsentType.MARKETING]: false,
    [ConsentType.THIRD_PARTY]: false,
  });

  useEffect(() => {
    // Check if user has already given consent
    const consentGiven = localStorage.getItem('consent-banner-dismissed');
    if (!consentGiven) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = async () => {
    const allConsents = {
      [ConsentType.ESSENTIAL]: true,
      [ConsentType.ANALYTICS]: true,
      [ConsentType.AI_LEARNING]: true,
      [ConsentType.MARKETING]: true,
      [ConsentType.THIRD_PARTY]: true,
    };

    setConsents(allConsents);
    await saveConsents(allConsents);
    setIsVisible(false);
  };

  const handleRejectOptional = async () => {
    const optionalOnlyConsents = {
      [ConsentType.ESSENTIAL]: true,
      [ConsentType.ANALYTICS]: false,
      [ConsentType.AI_LEARNING]: false,
      [ConsentType.MARKETING]: false,
      [ConsentType.THIRD_PARTY]: false,
    };

    setConsents(optionalOnlyConsents);
    await saveConsents(optionalOnlyConsents);
    setIsVisible(false);
  };

  const handleToggleConsent = (type: ConsentType) => {
    if (type === ConsentType.ESSENTIAL) {
      return; // Can't toggle essential
    }

    setConsents((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleSaveCustom = async () => {
    await saveConsents(consents);
    setIsVisible(false);
  };

  const saveConsents = async (consentSettings: Record<ConsentType, boolean>) => {
    try {
      if (userId) {
        // Record each consent in database
        for (const [type, given] of Object.entries(consentSettings)) {
          await ConsentManager.recordConsent(
            userId,
            type as ConsentType,
            given,
            'banner'
          );
        }
      }

      // Store in localStorage for quick checks
      localStorage.setItem(
        'user-consents',
        JSON.stringify(consentSettings)
      );
      localStorage.setItem('consent-banner-dismissed', 'true');

      if (onConsentChange) {
        onConsentChange(consentSettings as Record<string, boolean>);
      }
    } catch (error) {
      console.error('Failed to save consents:', error);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-lg z-50 ${
        isArabic ? 'rtl' : 'ltr'
      }`}
    >
      <div className="max-w-6xl mx-auto p-6">
        {!isExpanded ? (
          // Collapsed view
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                {isArabic
                  ? 'نحن نستخدم ملفات تعريف الارتباط'
                  : 'We Use Cookies'}
              </h3>
              <p className="text-sm text-gray-600">
                {isArabic
                  ? 'نستخدم ملفات تعريف الارتباط لتحسين تجربتك. يمكنك تخصيص التفضيلات الخاصة بك أو قبول الكل.'
                  : 'We use cookies to enhance your experience. You can customize your preferences or accept all.'}
              </p>
            </div>

            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={handleRejectOptional}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {isArabic ? 'رفض الاختياري' : 'Reject Optional'}
              </button>

              <button
                onClick={() => setIsExpanded(true)}
                className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"
              >
                {isArabic ? 'تخصيص' : 'Customize'}
              </button>

              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                {isArabic ? 'قبول الكل' : 'Accept All'}
              </button>
            </div>
          </div>
        ) : (
          // Expanded view
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {isArabic ? 'إدارة تفضيلات ملفات تعريف الارتباط' : 'Manage Cookie Preferences'}
            </h3>

            <div className="space-y-4 mb-6">
              <ConsentToggle
                type={ConsentType.ESSENTIAL}
                label={isArabic ? 'ملفات تعريف أساسية' : 'Essential Cookies'}
                description={
                  isArabic
                    ? 'مطلوب للأمان والوظائف الأساسية'
                    : 'Required for security and basic functionality'
                }
                checked={consents[ConsentType.ESSENTIAL]}
                disabled={true}
              />

              <ConsentToggle
                type={ConsentType.ANALYTICS}
                label={isArabic ? 'تحليل الاستخدام' : 'Analytics'}
                description={
                  isArabic
                    ? 'تساعدنا على فهم كيفية استخدامك للتطبيق'
                    : 'Help us understand how you use the app'
                }
                checked={consents[ConsentType.ANALYTICS]}
                onToggle={() =>
                  handleToggleConsent(ConsentType.ANALYTICS)
                }
              />

              <ConsentToggle
                type={ConsentType.AI_LEARNING}
                label={isArabic ? 'تحسين الذكاء الاصطناعي' : 'AI Improvement'}
                description={
                  isArabic
                    ? 'السماح بتحسين نماذج الذكاء الاصطناعي'
                    : 'Allow AI model improvement'
                }
                checked={consents[ConsentType.AI_LEARNING]}
                onToggle={() =>
                  handleToggleConsent(ConsentType.AI_LEARNING)
                }
              />

              <ConsentToggle
                type={ConsentType.MARKETING}
                label={isArabic ? 'التسويق' : 'Marketing'}
                description={
                  isArabic
                    ? 'تلقي رسائل تسويقية مخصصة'
                    : 'Receive personalized marketing messages'
                }
                checked={consents[ConsentType.MARKETING]}
                onToggle={() =>
                  handleToggleConsent(ConsentType.MARKETING)
                }
              />

              <ConsentToggle
                type={ConsentType.THIRD_PARTY}
                label={isArabic ? 'مشاركة الطرف الثالث' : 'Third-Party Sharing'}
                description={
                  isArabic
                    ? 'السماح بمشاركة البيانات مع أطراف ثالثة موثوقة'
                    : 'Allow sharing with trusted third parties'
                }
                checked={consents[ConsentType.THIRD_PARTY]}
                onToggle={() =>
                  handleToggleConsent(ConsentType.THIRD_PARTY)
                }
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleRejectOptional}
                className="px-6 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {isArabic ? 'رفض الاختياري' : 'Reject Optional'}
              </button>

              <button
                onClick={handleSaveCustom}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                {isArabic ? 'حفظ التفضيلات' : 'Save Preferences'}
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              <a
                href="/legal/cookie-policy"
                className="text-blue-600 hover:underline"
              >
                {isArabic ? 'سياسة ملفات تعريف الارتباط' : 'Cookie Policy'}
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface ConsentToggleProps {
  type: ConsentType;
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onToggle?: () => void;
}

function ConsentToggle({
  label,
  description,
  checked,
  disabled,
  onToggle,
}: ConsentToggleProps) {
  return (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{label}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>

      <button
        onClick={onToggle}
        disabled={disabled}
        className={`${
          checked
            ? 'bg-blue-600'
            : 'bg-gray-300'
        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
        }`}
      >
        <span
          className={`${
            checked ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
        />
      </button>
    </div>
  );
}
