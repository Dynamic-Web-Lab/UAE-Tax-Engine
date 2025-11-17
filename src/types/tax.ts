/**
 * UAE Tax Engine Types
 * Follows UAE Federal Tax Authority regulations
 */

export interface UAETaxBracket {
  min: number;
  max: number | null;
  rate: number;
  label: string;
}

export interface TaxCalculationResult {
  grossIncome: number;
  adjustedTaxableIncome: number;
  corporateTax: number;
  vat: number;
  totalTax: number;
  effectiveRate: number;
  bracket: UAETaxBracket;
  breakdown: {
    freeBracket: number; // Amount in 0% bracket
    taxableBracket: number; // Amount in 9% bracket
  };
}

export interface Transaction {
  id: string;
  date: Date;
  amount: number;
  type: 'income' | 'expense';
  category: TransactionCategory;
  description: string;
  source: TransactionSource;
  currency: 'AED' | 'USD' | 'EUR';
  isRecurring: boolean;
  taxDeductible: boolean;
  deductiblePercentage: number; // 0-100
  vatApplicable: boolean;
  autoClassified: boolean;
  confidence: number; // 0-1 for AI classification
  metadata?: Record<string, any>;
}

export type TransactionCategory =
  | 'revenue'
  | 'cost_of_goods'
  | 'salary'
  | 'rent'
  | 'utilities'
  | 'marketing'
  | 'professional_fees'
  | 'office_supplies'
  | 'travel'
  | 'meals_entertainment'
  | 'vehicle'
  | 'insurance'
  | 'software'
  | 'equipment'
  | 'government_fees'
  | 'bank_charges'
  | 'other';

export type TransactionSource =
  | 'bank_account'
  | 'stripe'
  | 'paypal'
  | 'talabat'
  | 'amazon_seller'
  | 'manual'
  | 'other';

export interface TaxOptimizationSuggestion {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  potentialSaving: number;
  legalReference: string;
  actionItems: string[];
  actionItemsAr: string[];
  difficulty: 'easy' | 'medium' | 'complex';
  deadline?: Date;
  tags: string[];
}

export interface WhatIfScenario {
  projectedProfit: number;
  currentTax: number;
  projectedTax: number;
  difference: number;
  suggestions: TaxOptimizationSuggestion[];
  breakdown: TaxCalculationResult;
}

export interface ChartOfAccounts {
  id: string;
  name: string;
  nameAr: string;
  category: TransactionCategory;
  taxDeductible: boolean;
  deductiblePercentage: number;
  vatApplicable: boolean;
  learningData: {
    keywords: string[];
    patterns: string[];
    confidence: number;
    usageCount: number;
    lastUsed: Date;
  };
}

export interface TaxPeriod {
  startDate: Date;
  endDate: Date;
  taxYear: number;
  quarter?: 1 | 2 | 3 | 4;
  status: 'current' | 'closed' | 'filed';
}

export interface FTAExport {
  period: TaxPeriod;
  taxableIncome: number;
  corporateTax: number;
  vat: number;
  xmlData: string;
  generatedAt: Date;
}
