/**
 * Transaction List Component
 * Display, filter, and manage transactions
 */

'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Transaction } from '@/types/tax';
import { Pencil, Trash2, Plus, Filter, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TransactionListProps {
  transactions: Transaction[];
  onAdd?: () => void;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transactionId: string) => void;
  isLoading?: boolean;
}

export function TransactionList({
  transactions,
  onAdd,
  onEdit,
  onDelete,
  isLoading = false,
}: TransactionListProps) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions.filter((txn) => {
    const matchesFilter = filter === 'all' || txn.type === filter;
    const matchesSearch =
      searchTerm === '' ||
      txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.category.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      revenue: 'bg-green-100 text-green-800',
      marketing: 'bg-blue-100 text-blue-800',
      salary: 'bg-purple-100 text-purple-800',
      rent: 'bg-orange-100 text-orange-800',
      utilities: 'bg-yellow-100 text-yellow-800',
      vehicle: 'bg-red-100 text-red-800',
      software: 'bg-indigo-100 text-indigo-800',
      meals_entertainment: 'bg-pink-100 text-pink-800',
    };

    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {t('transactions.title', 'Transactions')}
          </h2>

          <div className="flex gap-2">
            <button
              onClick={onAdd}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus size={20} />
              {t('transactions.add', 'Add Transaction')}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('transactions.all', 'All')}
            </button>
            <button
              onClick={() => setFilter('income')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'income'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('transactions.income', 'Income')}
            </button>
            <button
              onClick={() => setFilter('expense')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'expense'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('transactions.expense', 'Expense')}
            </button>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="divide-y">
        <AnimatePresence>
          {filteredTransactions.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p>No transactions found</p>
            </div>
          ) : (
            filteredTransactions.map((txn) => (
              <motion.div
                key={txn.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(txn.category)}`}
                      >
                        {t(`categories.${txn.category}`, txn.category)}
                      </span>

                      {txn.autoClassified && (
                        <span className="text-xs text-gray-500">
                          🤖 AI ({Math.round(txn.confidence * 100)}%)
                        </span>
                      )}

                      {txn.taxDeductible && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {txn.deductiblePercentage}% Deductible
                        </span>
                      )}
                    </div>

                    <p className="text-gray-900 font-medium">
                      {txn.description}
                    </p>

                    <p className="text-sm text-gray-500">
                      {txn.date.toLocaleDateString()} • {txn.source}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div
                        className={`text-lg font-bold ${
                          txn.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {txn.type === 'income' ? '+' : '-'} {txn.currency}{' '}
                        {txn.amount.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit?.(txn)}
                        className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => onDelete?.(txn.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      {filteredTransactions.length > 0 && (
        <div className="p-4 border-t bg-gray-50 text-center text-sm text-gray-600">
          Showing {filteredTransactions.length} of {transactions.length}{' '}
          transactions
        </div>
      )}
    </div>
  );
}
