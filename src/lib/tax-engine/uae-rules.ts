/**
 * UAE Corporate Tax & VAT Rules Engine
 * Based on UAE Federal Decree-Law No. 47 of 2022
 */

import { UAETaxBracket, TaxCalculationResult, Transaction } from '@/types/tax';

// UAE Tax Constants
export const UAE_TAX_CONSTANTS = {
  CT: {
    THRESHOLD: 375000, // AED 375,000
    RATE_LOW: 0, // 0% for profits ≤ 375k
    RATE_HIGH: 0.09, // 9% for profits > 375k
    SMALL_BUSINESS_RELIEF: 375000,
  },
  VAT: {
    STANDARD_RATE: 0.05, // 5%
    REGISTRATION_THRESHOLD: 375000, // Mandatory registration
    VOLUNTARY_THRESHOLD: 187500, // Voluntary registration
  },
  DEDUCTIONS: {
    MEALS_ENTERTAINMENT_LIMIT: 0.5, // 50% disallowed
    SMALL_ASSET_THRESHOLD: 1000000, // AED 1m for immediate deduction
  },
} as const;

export const TAX_BRACKETS: UAETaxBracket[] = [
  {
    min: 0,
    max: UAE_TAX_CONSTANTS.CT.THRESHOLD,
    rate: UAE_TAX_CONSTANTS.CT.RATE_LOW,
    label: 'Tax-Free Bracket',
  },
  {
    min: UAE_TAX_CONSTANTS.CT.THRESHOLD + 1,
    max: null,
    rate: UAE_TAX_CONSTANTS.CT.RATE_HIGH,
    label: 'Standard Rate',
  },
];

/**
 * Calculate adjusted taxable income from transactions
 */
export function calculateAdjustedIncome(transactions: Transaction[]): number {
  let totalIncome = 0;
  let totalDeductions = 0;

  for (const txn of transactions) {
    if (txn.type === 'income') {
      totalIncome += txn.amount;
    } else if (txn.type === 'expense' && txn.taxDeductible) {
      const deductibleAmount = txn.amount * (txn.deductiblePercentage / 100);
      totalDeductions += deductibleAmount;
    }
  }

  return Math.max(0, totalIncome - totalDeductions);
}

/**
 * Calculate UAE Corporate Tax
 */
export function calculateCorporateTax(
  adjustedTaxableIncome: number
): TaxCalculationResult {
  const { CT } = UAE_TAX_CONSTANTS;

  let corporateTax = 0;
  let freeBracket = 0;
  let taxableBracket = 0;
  let bracket: UAETaxBracket;

  if (adjustedTaxableIncome <= CT.THRESHOLD) {
    // Entire amount in 0% bracket
    corporateTax = 0;
    freeBracket = adjustedTaxableIncome;
    taxableBracket = 0;
    bracket = TAX_BRACKETS[0];
  } else {
    // Split between brackets
    freeBracket = CT.THRESHOLD;
    taxableBracket = adjustedTaxableIncome - CT.THRESHOLD;
    corporateTax = taxableBracket * CT.RATE_HIGH;
    bracket = TAX_BRACKETS[1];
  }

  const effectiveRate =
    adjustedTaxableIncome > 0 ? corporateTax / adjustedTaxableIncome : 0;

  return {
    grossIncome: adjustedTaxableIncome,
    adjustedTaxableIncome,
    corporateTax,
    vat: 0, // Calculated separately
    totalTax: corporateTax,
    effectiveRate,
    bracket,
    breakdown: {
      freeBracket,
      taxableBracket,
    },
  };
}

/**
 * Calculate VAT liability
 */
export function calculateVAT(transactions: Transaction[]): number {
  const { VAT } = UAE_TAX_CONSTANTS;
  let vatCollected = 0;
  let vatPaid = 0;

  for (const txn of transactions) {
    if (txn.vatApplicable) {
      const vatAmount = txn.amount * VAT.STANDARD_RATE;
      if (txn.type === 'income') {
        vatCollected += vatAmount;
      } else {
        vatPaid += vatAmount;
      }
    }
  }

  return Math.max(0, vatCollected - vatPaid);
}

/**
 * Determine current tax bracket from income
 */
export function getCurrentBracket(income: number): UAETaxBracket {
  if (income <= UAE_TAX_CONSTANTS.CT.THRESHOLD) {
    return TAX_BRACKETS[0];
  }
  return TAX_BRACKETS[1];
}

/**
 * Calculate remaining tax-free allowance
 */
export function getRemainingTaxFreeAllowance(currentIncome: number): number {
  const remaining = UAE_TAX_CONSTANTS.CT.THRESHOLD - currentIncome;
  return Math.max(0, remaining);
}

/**
 * Calculate tax impact of additional income
 */
export function calculateMarginalTaxImpact(
  currentIncome: number,
  additionalIncome: number
): {
  currentTax: number;
  newTax: number;
  additionalTax: number;
  marginalRate: number;
} {
  const currentResult = calculateCorporateTax(currentIncome);
  const newResult = calculateCorporateTax(currentIncome + additionalIncome);

  const additionalTax = newResult.corporateTax - currentResult.corporateTax;
  const marginalRate =
    additionalIncome > 0 ? additionalTax / additionalIncome : 0;

  return {
    currentTax: currentResult.corporateTax,
    newTax: newResult.corporateTax,
    additionalTax,
    marginalRate,
  };
}

/**
 * Validate if transaction qualifies for deduction
 */
export function isDeductibleExpense(
  category: string,
  description: string
): { deductible: boolean; percentage: number; reason: string } {
  const lowerDesc = description.toLowerCase();

  // Meals & Entertainment - 50% limit
  if (
    category === 'meals_entertainment' ||
    lowerDesc.includes('lunch') ||
    lowerDesc.includes('dinner') ||
    lowerDesc.includes('meal')
  ) {
    return {
      deductible: true,
      percentage: 50,
      reason: 'Meals & Entertainment - 50% deductible per UAE CT law',
    };
  }

  // Fully deductible business expenses
  const fullyDeductible = [
    'rent',
    'utilities',
    'professional_fees',
    'office_supplies',
    'software',
    'insurance',
    'government_fees',
    'bank_charges',
  ];

  if (fullyDeductible.includes(category)) {
    return {
      deductible: true,
      percentage: 100,
      reason: 'Ordinary and necessary business expense',
    };
  }

  // Marketing & Advertising
  if (
    category === 'marketing' ||
    lowerDesc.includes('ads') ||
    lowerDesc.includes('instagram') ||
    lowerDesc.includes('google') ||
    lowerDesc.includes('facebook')
  ) {
    return {
      deductible: true,
      percentage: 100,
      reason: 'Marketing and advertising expense',
    };
  }

  // Salaries & Wages
  if (category === 'salary' || lowerDesc.includes('salary')) {
    return {
      deductible: true,
      percentage: 100,
      reason: 'Employee compensation',
    };
  }

  // Default: not deductible
  return {
    deductible: false,
    percentage: 0,
    reason: 'Not classified as deductible business expense',
  };
}
