/**
 * What-If Scenario Slider Component
 * Interactive tax planning with AI-powered optimization suggestions
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Sparkles, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { WhatIfScenario, TaxOptimizationSuggestion } from '@/types/tax';
import { calculateCorporateTax } from '@/lib/tax-engine/uae-rules';

interface WhatIfSliderProps {
  currentProfit: number;
  minProfit?: number;
  maxProfit?: number;
  onScenarioChange?: (scenario: WhatIfScenario) => void;
  isLoadingSuggestions?: boolean;
  suggestions?: TaxOptimizationSuggestion[];
}

export function WhatIfSlider({
  currentProfit,
  minProfit = 0,
  maxProfit = 1000000,
  onScenarioChange,
  isLoadingSuggestions = false,
  suggestions = [],
}: WhatIfSliderProps) {
  const { t, i18n } = useTranslation();
  const [projectedProfit, setProjectedProfit] = useState(currentProfit);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const currentResult = calculateCorporateTax(currentProfit);
  const projectedResult = calculateCorporateTax(projectedProfit);
  const taxDifference = projectedResult.corporateTax - currentResult.corporateTax;

  useEffect(() => {
    if (onScenarioChange) {
      const scenario: WhatIfScenario = {
        projectedProfit,
        currentTax: currentResult.corporateTax,
        projectedTax: projectedResult.corporateTax,
        difference: taxDifference,
        suggestions: suggestions,
        breakdown: projectedResult,
      };
      onScenarioChange(scenario);
    }
  }, [projectedProfit]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectedProfit(Number(e.target.value));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600 bg-green-50';
      case 'medium':
        return 'text-amber-600 bg-amber-50';
      case 'complex':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const isArabic = i18n.language === 'ar';

  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="text-primary-500" size={28} />
            {t('whatIf.title', 'What-If Tax Planner')}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {t('whatIf.subtitle', 'Drag the slider to see tax impact')}
          </p>
        </div>

        <button
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
        >
          <Sparkles size={18} />
          {t('whatIf.viewSuggestions', 'AI Suggestions')}
          {suggestions.length > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-white text-primary-600 text-xs font-bold rounded-full">
              {suggestions.length}
            </span>
          )}
        </button>
      </div>

      {/* Slider */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            {t('whatIf.projectedProfit', 'Projected Year-End Profit')}
          </label>
          <span className="text-2xl font-bold text-primary-600">
            AED {projectedProfit.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </span>
        </div>

        <input
          type="range"
          min={minProfit}
          max={maxProfit}
          step={1000}
          value={projectedProfit}
          onChange={handleSliderChange}
          className="w-full h-3 bg-gradient-to-r from-green-200 via-yellow-200 to-red-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right,
              #10b981 0%,
              #10b981 ${(375000 / maxProfit) * 100}%,
              #f59e0b ${(375000 / maxProfit) * 100}%,
              #f59e0b 100%)`,
          }}
        />

        <div className="flex justify-between text-xs text-gray-500">
          <span>AED 0</span>
          <span>AED 375k (Threshold)</span>
          <span>AED {(maxProfit / 1000).toFixed(0)}k</span>
        </div>
      </div>

      {/* Tax Impact Comparison */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">
            {t('whatIf.currentTax', 'Current Tax')}
          </div>
          <div className="text-xl font-bold text-gray-700">
            AED {currentResult.corporateTax.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </div>
        </div>

        <div className="text-center p-4 bg-primary-50 rounded-lg">
          <div className="text-xs text-primary-700 mb-1">
            {t('whatIf.projectedTax', 'Projected Tax')}
          </div>
          <div className="text-xl font-bold text-primary-700">
            AED {projectedResult.corporateTax.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </div>
        </div>

        <div className="text-center p-4 bg-amber-50 rounded-lg">
          <div className="text-xs text-amber-700 mb-1">
            {t('whatIf.difference', 'Difference')}
          </div>
          <div
            className={`text-xl font-bold ${
              taxDifference > 0 ? 'text-red-600' : 'text-green-600'
            }`}
          >
            {taxDifference >= 0 ? '+' : ''}
            AED {taxDifference.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </div>
        </div>
      </div>

      {/* Tax Bracket Breakdown */}
      <div className="space-y-2 pt-4 border-t">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            {t('whatIf.freeBracket', 'Tax-Free (0%)')}
          </span>
          <span className="font-semibold text-green-600">
            AED {projectedResult.breakdown.freeBracket.toLocaleString('en-US')}
          </span>
        </div>
        {projectedResult.breakdown.taxableBracket > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              {t('whatIf.taxableBracket', 'Taxable (9%)')}
            </span>
            <span className="font-semibold text-amber-600">
              AED {projectedResult.breakdown.taxableBracket.toLocaleString('en-US')}
            </span>
          </div>
        )}
        <div className="flex justify-between text-sm font-bold pt-2 border-t">
          <span className="text-gray-700">
            {t('whatIf.effectiveRate', 'Effective Tax Rate')}
          </span>
          <span className="text-primary-600">
            {(projectedResult.effectiveRate * 100).toFixed(2)}%
          </span>
        </div>
      </div>

      {/* AI Suggestions Panel */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 pt-4 border-t overflow-hidden"
          >
            <div className="flex items-center gap-2 text-primary-700">
              <Sparkles size={20} />
              <h3 className="font-bold">
                {t('whatIf.aiSuggestions', 'AI Tax Optimization Suggestions')}
              </h3>
            </div>

            {isLoadingSuggestions ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
                <span className="ml-3 text-gray-600">
                  {t('whatIf.generating', 'Generating suggestions...')}
                </span>
              </div>
            ) : suggestions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle size={40} className="mx-auto mb-2 opacity-50" />
                {t('whatIf.noSuggestions', 'No suggestions available')}
              </div>
            ) : (
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {isArabic ? suggestion.titleAr : suggestion.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {isArabic
                            ? suggestion.descriptionAr
                            : suggestion.description}
                        </p>
                      </div>
                      <span
                        className={`ml-2 px-2 py-1 text-xs font-medium rounded ${getDifficultyColor(suggestion.difficulty)}`}
                      >
                        {t(`difficulty.${suggestion.difficulty}`, suggestion.difficulty)}
                      </span>
                    </div>

                    {suggestion.potentialSaving > 0 && (
                      <div className="flex items-center gap-2 mb-2 text-green-600">
                        <TrendingUp size={16} />
                        <span className="text-sm font-semibold">
                          {t('whatIf.potentialSaving', 'Potential Saving')}: AED{' '}
                          {suggestion.potentialSaving.toLocaleString('en-US')}
                        </span>
                      </div>
                    )}

                    <div className="mt-3 space-y-1">
                      {(isArabic
                        ? suggestion.actionItemsAr
                        : suggestion.actionItems
                      ).map((action, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-sm text-gray-700"
                        >
                          <CheckCircle2
                            size={16}
                            className="text-primary-500 mt-0.5 flex-shrink-0"
                          />
                          <span>{action}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 text-xs text-gray-500 italic">
                      {suggestion.legalReference}
                    </div>

                    {suggestion.deadline && (
                      <div className="mt-2 text-xs text-red-600 font-medium flex items-center gap-1">
                        <AlertCircle size={14} />
                        {t('whatIf.deadline', 'Deadline')}:{' '}
                        {suggestion.deadline.toLocaleDateString()}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
