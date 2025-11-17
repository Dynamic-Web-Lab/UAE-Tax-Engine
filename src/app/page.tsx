/**
 * Main Dashboard Page
 * Integrates Live Tax Meter, What-If Slider, and Transaction Management
 */

'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LiveTaxMeter } from '@/components/LiveTaxMeter';
import { WhatIfSlider } from '@/components/WhatIfSlider';
import { FirebaseDatabase } from '@/lib/firebase/database';
import { TaxOptimizationEngine } from '@/lib/ai/tax-optimizer';
import { AITransactionClassifier } from '@/lib/ai/transaction-classifier';
import { Transaction, TaxOptimizationSuggestion, WhatIfScenario } from '@/types/tax';
import { auth } from '@/lib/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

export default function DashboardPage() {
  const { t } = useTranslation();
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Live Metrics State
  const [currentProfit, setCurrentProfit] = useState(0);
  const [currentTax, setCurrentTax] = useState(0);
  const [vatLiability, setVatLiability] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  // What-If State
  const [suggestions, setSuggestions] = useState<TaxOptimizationSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Listen to auth state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        initializeDashboard(user.uid);
      } else {
        setUserId(null);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const initializeDashboard = async (uid: string) => {
    try {
      // Subscribe to live metrics
      const unsubscribeMetrics = FirebaseDatabase.subscribeLiveMetrics(
        uid,
        (metrics) => {
          setCurrentProfit(metrics.currentProfit || 0);
          setCurrentTax(metrics.currentTax || 0);
          setVatLiability(metrics.vatLiability || 0);
          setTotalIncome(metrics.totalIncome || 0);
          setTotalExpenses(metrics.totalExpenses || 0);
        }
      );

      // Load transactions
      const txns = await FirebaseDatabase.getTransactions(uid);
      setTransactions(txns);

      setIsLoading(false);

      return () => {
        unsubscribeMetrics();
      };
    } catch (error) {
      console.error('Dashboard initialization error:', error);
      setIsLoading(false);
    }
  };

  const handleScenarioChange = async (scenario: WhatIfScenario) => {
    // Generate AI suggestions when scenario changes significantly
    const profitDifference = Math.abs(scenario.projectedProfit - currentProfit);

    if (profitDifference > 10000 && !isLoadingSuggestions) {
      setIsLoadingSuggestions(true);

      try {
        const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || '';
        const optimizer = new TaxOptimizationEngine(apiKey);

        const whatIf = await optimizer.generateWhatIfScenario(
          currentProfit,
          scenario.projectedProfit,
          transactions
        );

        setSuggestions(whatIf.suggestions);
      } catch (error) {
        console.error('Failed to generate suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('app.title')}
          </h1>
          <p className="text-gray-600 mb-8">{t('app.subtitle')}</p>
          <button
            onClick={() => {
              // Implement auth flow
              window.location.href = '/auth/login';
            }}
            className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t('app.title')}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {t('app.subtitle')}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button className="px-4 py-2 text-gray-700 hover:text-gray-900">
                English / العربية
              </button>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                {t('subscription.upgrade')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Live Tax Meter */}
          <LiveTaxMeter
            currentProfit={currentProfit}
            currentTax={currentTax}
            vatLiability={vatLiability}
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            isLoading={false}
          />

          {/* What-If Slider */}
          <WhatIfSlider
            currentProfit={currentProfit}
            minProfit={0}
            maxProfit={1000000}
            onScenarioChange={handleScenarioChange}
            isLoadingSuggestions={isLoadingSuggestions}
            suggestions={suggestions}
          />

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {t('transactions.title')}
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {transactions.length}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                This month
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Connected Accounts
              </h3>
              <p className="text-3xl font-bold text-gray-900">0</p>
              <button className="text-sm text-primary-600 hover:text-primary-700 mt-1">
                Connect Bank
              </button>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                AI Classification
              </h3>
              <p className="text-3xl font-bold text-gray-900">0%</p>
              <p className="text-sm text-gray-500 mt-1">
                Accuracy after 30 days: 90%+
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
