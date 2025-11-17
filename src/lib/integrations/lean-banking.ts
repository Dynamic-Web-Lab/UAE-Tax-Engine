/**
 * Lean Technologies Open Banking Integration
 * https://docs.leantech.me/
 * Primary provider for UAE banks
 */

import axios from 'axios';
import { Transaction } from '@/types/tax';

interface LeanConfig {
  appToken: string;
  apiSecret: string;
  environment: 'sandbox' | 'production';
}

interface LeanAccount {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
}

interface LeanTransaction {
  id: string;
  date: string;
  amount: number;
  currency: string;
  description: string;
  merchant?: string;
  category?: string;
  type: 'debit' | 'credit';
}

export class LeanBankingClient {
  private config: LeanConfig;
  private baseUrl: string;

  constructor(config: LeanConfig) {
    this.config = config;
    this.baseUrl =
      config.environment === 'production'
        ? 'https://api.leantech.me'
        : 'https://sandbox.leantech.me';
  }

  /**
   * Create Lean Connect link for user authorization
   */
  async createConnectLink(
    userId: string,
    redirectUrl: string
  ): Promise<string> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/link/create`,
        {
          app_token: this.config.appToken,
          customer_id: userId,
          redirect_url: redirectUrl,
          permissions: ['accounts', 'transactions', 'balance', 'identity'],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'lean-app-token': this.config.appToken,
          },
        }
      );

      return response.data.link;
    } catch (error) {
      console.error('Lean create link error:', error);
      throw new Error('Failed to create Lean Connect link');
    }
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeToken(code: string): Promise<string> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/link/token`,
        {
          code,
        },
        {
          headers: {
            'lean-app-token': this.config.appToken,
          },
        }
      );

      return response.data.access_token;
    } catch (error) {
      console.error('Lean token exchange error:', error);
      throw new Error('Failed to exchange Lean token');
    }
  }

  /**
   * Get connected bank accounts
   */
  async getAccounts(accessToken: string): Promise<LeanAccount[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/data/v1/accounts`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data.accounts || [];
    } catch (error) {
      console.error('Lean get accounts error:', error);
      return [];
    }
  }

  /**
   * Get transactions from connected bank account
   */
  async getTransactions(
    accessToken: string,
    accountId: string,
    fromDate: Date,
    toDate: Date = new Date()
  ): Promise<LeanTransaction[]> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/data/v1/accounts/${accountId}/transactions`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            from: fromDate.toISOString().split('T')[0],
            to: toDate.toISOString().split('T')[0],
          },
        }
      );

      return response.data.transactions || [];
    } catch (error) {
      console.error('Lean get transactions error:', error);
      return [];
    }
  }

  /**
   * Convert Lean transaction to app Transaction format
   */
  convertToTransaction(leanTxn: LeanTransaction): Omit<Transaction, 'id'> {
    const isIncome = leanTxn.type === 'credit';

    return {
      date: new Date(leanTxn.date),
      amount: Math.abs(leanTxn.amount),
      type: isIncome ? 'income' : 'expense',
      category: this.inferCategory(leanTxn.category, leanTxn.description),
      description: leanTxn.description,
      source: 'bank_account',
      currency: (leanTxn.currency as any) || 'AED',
      isRecurring: false,
      taxDeductible: !isIncome,
      deductiblePercentage: 100,
      vatApplicable: true,
      autoClassified: false,
      confidence: 0.5,
      metadata: {
        leanId: leanTxn.id,
        merchantName: leanTxn.merchant,
      },
    };
  }

  /**
   * Infer transaction category from Lean data
   */
  private inferCategory(
    leanCategory?: string,
    description?: string
  ): string {
    if (!leanCategory && !description) return 'other';

    const text = `${leanCategory} ${description}`.toLowerCase();

    if (text.includes('salary') || text.includes('payroll')) return 'salary';
    if (text.includes('rent')) return 'rent';
    if (text.includes('utility') || text.includes('dewa')) return 'utilities';
    if (text.includes('salik') || text.includes('fuel')) return 'vehicle';
    if (text.includes('insurance')) return 'insurance';
    if (text.includes('software') || text.includes('subscription'))
      return 'software';

    return 'other';
  }

  /**
   * Sync transactions for a given period
   */
  async syncTransactions(
    accessToken: string,
    accountId: string,
    fromDate: Date
  ): Promise<Omit<Transaction, 'id'>[]> {
    const leanTransactions = await this.getTransactions(
      accessToken,
      accountId,
      fromDate
    );

    return leanTransactions.map((txn) => this.convertToTransaction(txn));
  }
}

/**
 * Initialize Lean client from environment
 */
export function createLeanClient(): LeanBankingClient {
  const config: LeanConfig = {
    appToken: process.env.LEAN_APP_TOKEN || '',
    apiSecret: process.env.LEAN_API_SECRET || '',
    environment:
      (process.env.LEAN_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
  };

  return new LeanBankingClient(config);
}
