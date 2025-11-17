/**
 * Main Dashboard Page - FIXED: Was missing, causing 404 errors
 * Integrates all components with proper authentication
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { LiveTaxMeter } from '@/components/LiveTaxMeter';
import { WhatIfSlider } from '@/components/WhatIfSlider';
import { TransactionList } from '@/components/TransactionList';
import { FirebaseDatabase } from '@/lib/firebase/database';
import { auth } from '@/lib/firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Transaction, TaxOptimizationSuggestion } from '@/types/tax';
import { Globe, LogOut, Settings, CreditCard } from 'lucide-react';

export default function DashboardPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Live Metrics State
  const [currentProfit, setCurrentProfit] = useState(0);
  const [currentTax, setCurrentTax] = useState(0);
  const [vatLiability, setVatLiability] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  // Transaction State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [suggestions, setSuggestions] = useState<TaxOptimizationSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        initializeDashboard(user.uid);
      } else {
        router.push('/auth/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const initializeDashboard = async (uid: string) => {
    try {
      setIsLoading(true);
      setError(null);

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
    } catch (err: any) {
      console.error('Dashboard initialization error:', err);
      setError(err.message || 'Failed to load dashboard');
      setIsLoading(false);
    }
  };

  const handleScenarioChange = async (projectedProfit: number) => {
    if (!userId) return;

    const profitDifference = Math.abs(projectedProfit - currentProfit);

    if (profitDifference > 10000 && !isLoadingSuggestions) {
      setIsLoadingSuggestions(true);

      try {
        const response = await fetch('/api/ai/optimize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            currentProfit,
            projectedProfit,
          }),
        });

        if (response.ok) {
          const scenario = await response.json();
          setSuggestions(scenario.suggestions || []);
        }
      } catch (error) {
        console.error('Failed to generate suggestions:', error);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/auth/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">{t('common.loading', 'Loading...')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t('app.title', 'UAE Tax Engine')}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {t('app.subtitle', 'Real-Time Tax Dashboard')}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Globe size={20} />
                {i18n.language === 'en' ? 'العربية' : 'English'}
              </button>

              <button
                onClick={() => router.push('/settings')}
                className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Settings"
              >
                <Settings size={20} />
              </button>

              <button
                onClick={() => router.push('/subscription')}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
              >
                <CreditCard size={20} />
                {t('subscription.upgrade', 'Upgrade')}
              </button>

              <button
                onClick={handleSignOut}
                className="p-2 text-gray-700 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Sign out"
              >
                <LogOut size={20} />
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
            maxProfit={Math.max(1000000, currentProfit * 2)}
            onScenarioChange={(scenario) => handleScenarioChange(scenario.projectedProfit)}
            isLoadingSuggestions={isLoadingSuggestions}
            suggestions={suggestions}
          />

          {/* Transactions */}
          <TransactionList
            transactions={transactions}
            onAdd={() => router.push('/transactions/add')}
            onEdit={(txn) => router.push(`/transactions/edit/${txn.id}`)}
            onDelete={async (txnId) => {
              // TODO: Implement delete
              setTransactions(transactions.filter(t => t.id !== txnId));
            }}
            isLoading={false}
          />

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {t('transactions.title', 'Transactions')}
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {transactions.length}
              </p>
              <p className="text-sm text-gray-500 mt-1">This month</p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Connected Accounts
              </h3>
              <p className="text-3xl font-bold text-gray-900">0</p>
              <button
                onClick={() => router.push('/banking/connect')}
                className="text-sm text-primary-600 hover:text-primary-700 mt-1"
              >
                Connect Bank
              </button>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                AI Classification
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {transactions.filter(t => t.autoClassified).length > 0
                  ? Math.round(
                      (transactions.filter(t => t.autoClassified).reduce((sum, t) => sum + t.confidence, 0) /
                        transactions.filter(t => t.autoClassified).length) *
                        100
                    )
                  : 0}
                %
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Target accuracy: 90%+
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
