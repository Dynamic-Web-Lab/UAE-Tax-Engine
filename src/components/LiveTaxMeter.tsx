/**
 * Live Tax Meter Component
 * Real-time visualization of tax position with 0% / 9% bracket breakdown
 */

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { UAE_TAX_CONSTANTS } from '@/lib/tax-engine/uae-rules';

interface LiveTaxMeterProps {
  currentProfit: number;
  currentTax: number;
  vatLiability: number;
  totalIncome: number;
  totalExpenses: number;
  isLoading?: boolean;
}

export function LiveTaxMeter({
  currentProfit,
  currentTax,
  vatLiability,
  totalIncome,
  totalExpenses,
  isLoading = false,
}: LiveTaxMeterProps) {
  const { t } = useTranslation();
  const [animatedProfit, setAnimatedProfit] = useState(0);

  const threshold = UAE_TAX_CONSTANTS.CT.THRESHOLD;
  const freeBracketAmount = Math.min(currentProfit, threshold);
  const taxableBracketAmount = Math.max(0, currentProfit - threshold);

  const freeBracketPercent = (freeBracketAmount / threshold) * 100;
  const isNearThreshold = currentProfit > threshold * 0.9 && currentProfit < threshold * 1.1;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedProfit(currentProfit), 100);
    return () => clearTimeout(timer);
  }, [currentProfit]);

  if (isLoading) {
    return (
      <div className="w-full h-64 animate-pulse bg-gray-100 rounded-xl" />
    );
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {t('liveTaxMeter.title', 'Live Tax Meter')}
          </h2>
          <p className="text-sm text-gray-500">
            {t('liveTaxMeter.subtitle', 'Real-time tax position')}
          </p>
        </div>

        {isNearThreshold && (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
            <AlertTriangle size={20} />
            <span className="text-sm font-medium">
              {t('liveTaxMeter.nearThreshold', 'Near Threshold')}
            </span>
          </div>
        )}
      </div>

      {/* Current Profit Display */}
      <div className="text-center py-4">
        <div className="text-sm text-gray-500 mb-2">
          {t('liveTaxMeter.adjustedProfit', 'Adjusted Taxable Income')}
        </div>
        <motion.div
          className="text-5xl font-bold text-primary-600"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          AED {animatedProfit.toLocaleString('en-US', { maximumFractionDigits: 0 })}
        </motion.div>
      </div>

      {/* Tax Bracket Visualization */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            {t('liveTaxMeter.taxFree', '0% Tax-Free Bracket')}
          </span>
          <span className="font-semibold text-tax-free">
            AED {freeBracketAmount.toLocaleString('en-US')}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
          {/* Free Bracket (0%) */}
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-tax-free to-green-400"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(freeBracketPercent, 100)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />

          {/* Taxable Bracket (9%) */}
          {taxableBracketAmount > 0 && (
            <motion.div
              className="absolute top-0 h-full bg-gradient-to-r from-tax-standard to-red-400"
              initial={{ width: 0, left: `${Math.min(freeBracketPercent, 100)}%` }}
              animate={{
                width: `${Math.min(100 - freeBracketPercent, 100)}%`,
              }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            />
          )}

          {/* Threshold Marker */}
          <div
            className="absolute top-0 h-full w-0.5 bg-gray-700"
            style={{ left: '100%' }}
          >
            <div className="absolute -top-6 -left-12 text-xs text-gray-700 font-medium whitespace-nowrap">
              AED 375k
            </div>
          </div>
        </div>

        {taxableBracketAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              {t('liveTaxMeter.taxable', '9% Taxable Bracket')}
            </span>
            <span className="font-semibold text-tax-standard">
              AED {taxableBracketAmount.toLocaleString('en-US')}
            </span>
          </div>
        )}
      </div>

      {/* Tax Summary Cards */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">
            {t('liveTaxMeter.corporateTax', 'Corporate Tax')}
          </div>
          <div className="text-2xl font-bold text-tax-standard">
            AED {currentTax.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </div>
        </div>

        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">
            {t('liveTaxMeter.vat', 'VAT Liability')}
          </div>
          <div className="text-2xl font-bold text-blue-600">
            AED {vatLiability.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </div>
        </div>

        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">
            {t('liveTaxMeter.total', 'Total Tax')}
          </div>
          <div className="text-2xl font-bold text-gray-900">
            AED {(currentTax + vatLiability).toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </div>
        </div>
      </div>

      {/* Income vs Expenses */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
          <TrendingUp className="text-green-600" size={24} />
          <div>
            <div className="text-xs text-green-700">
              {t('liveTaxMeter.income', 'Total Income')}
            </div>
            <div className="text-lg font-bold text-green-900">
              AED {totalIncome.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
          <TrendingDown className="text-red-600" size={24} />
          <div>
            <div className="text-xs text-red-700">
              {t('liveTaxMeter.expenses', 'Deductible Expenses')}
            </div>
            <div className="text-lg font-bold text-red-900">
              AED {totalExpenses.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </div>
          </div>
        </div>
      </div>

      {/* Remaining Tax-Free Allowance */}
      {currentProfit < threshold && (
        <motion.div
          className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {t('liveTaxMeter.remaining', 'Remaining Tax-Free Allowance')}
            </span>
            <span className="text-lg font-bold text-blue-600">
              AED {(threshold - currentProfit).toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
