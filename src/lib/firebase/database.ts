/**
 * Firebase Realtime Database Structure and Utilities
 */

import {
  ref,
  set,
  get,
  update,
  push,
  remove,
  onValue,
  off,
  query,
  orderByChild,
  limitToLast,
  DatabaseReference,
} from 'firebase/database';
import { database } from './config';
import { Transaction, ChartOfAccounts, TaxPeriod } from '@/types/tax';
import { User, ConnectedAccount, SubscriptionDetails } from '@/types/user';

/**
 * Database Schema:
 *
 * /users/{userId}
 *   - profile: User
 *   - subscription: SubscriptionDetails
 *   - settings: { language, currency, etc }
 *
 * /transactions/{userId}/{transactionId}
 *   - Transaction data
 *
 * /accounts/{userId}/{accountId}
 *   - ConnectedAccount data
 *
 * /chart-of-accounts/{userId}/{accountId}
 *   - ChartOfAccounts data
 *
 * /tax-periods/{userId}/{periodId}
 *   - TaxPeriod data
 *
 * /live-metrics/{userId}
 *   - currentProfit: number
 *   - currentTax: number
 *   - vatLiability: number
 *   - lastUpdated: timestamp
 */

export class FirebaseDatabase {
  /**
   * User Operations
   */
  static async createUser(userId: string, userData: User): Promise<void> {
    await set(ref(database, `users/${userId}/profile`), {
      ...userData,
      createdAt: userData.createdAt.toISOString(),
      updatedAt: userData.updatedAt.toISOString(),
    });
  }

  static async getUser(userId: string): Promise<User | null> {
    const snapshot = await get(ref(database, `users/${userId}/profile`));
    if (!snapshot.exists()) return null;

    const data = snapshot.val();
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  }

  static async updateUser(
    userId: string,
    updates: Partial<User>
  ): Promise<void> {
    await update(ref(database, `users/${userId}/profile`), {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * Transaction Operations
   */
  static async addTransaction(
    userId: string,
    transaction: Omit<Transaction, 'id'>
  ): Promise<string> {
    const transactionsRef = ref(database, `transactions/${userId}`);
    const newRef = push(transactionsRef);

    await set(newRef, {
      ...transaction,
      date: transaction.date.toISOString(),
    });

    // Update live metrics
    await this.updateLiveMetrics(userId);

    return newRef.key!;
  }

  static async getTransactions(
    userId: string,
    limit: number = 100
  ): Promise<Transaction[]> {
    const transactionsRef = ref(database, `transactions/${userId}`);
    const q = query(transactionsRef, orderByChild('date'), limitToLast(limit));

    const snapshot = await get(q);
    if (!snapshot.exists()) return [];

    const transactions: Transaction[] = [];
    snapshot.forEach((child) => {
      const data = child.val();
      transactions.push({
        ...data,
        id: child.key,
        date: new Date(data.date),
      });
    });

    return transactions.reverse();
  }

  static async deleteTransaction(
    userId: string,
    transactionId: string
  ): Promise<void> {
    await remove(ref(database, `transactions/${userId}/${transactionId}`));
    await this.updateLiveMetrics(userId);
  }

  static async updateTransaction(
    userId: string,
    transactionId: string,
    updates: Partial<Transaction>
  ): Promise<void> {
    await update(
      ref(database, `transactions/${userId}/${transactionId}`),
      updates
    );

    await this.updateLiveMetrics(userId);
  }

  /**
   * Live Metrics Operations
   */
  static async updateLiveMetrics(userId: string): Promise<void> {
    const transactions = await this.getTransactions(userId, 1000);

    let totalIncome = 0;
    let totalExpenses = 0;
    let vatCollected = 0;
    let vatPaid = 0;

    transactions.forEach((txn) => {
      if (txn.type === 'income') {
        totalIncome += txn.amount;
        if (txn.vatApplicable) {
          vatCollected += txn.amount * 0.05;
        }
      } else {
        const deductible = txn.amount * (txn.deductiblePercentage / 100);
        totalExpenses += deductible;
        if (txn.vatApplicable) {
          vatPaid += txn.amount * 0.05;
        }
      }
    });

    const currentProfit = totalIncome - totalExpenses;
    const currentTax =
      currentProfit > 375000 ? (currentProfit - 375000) * 0.09 : 0;
    const vatLiability = Math.max(0, vatCollected - vatPaid);

    await set(ref(database, `live-metrics/${userId}`), {
      currentProfit,
      currentTax,
      vatLiability,
      totalIncome,
      totalExpenses,
      lastUpdated: new Date().toISOString(),
    });
  }

  static subscribeLiveMetrics(
    userId: string,
    callback: (metrics: any) => void
  ): () => void {
    const metricsRef = ref(database, `live-metrics/${userId}`);

    onValue(metricsRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val());
      }
    });

    return () => off(metricsRef);
  }

  /**
   * Chart of Accounts Operations
   */
  static async saveChartOfAccount(
    userId: string,
    account: ChartOfAccounts
  ): Promise<void> {
    await set(ref(database, `chart-of-accounts/${userId}/${account.id}`), {
      ...account,
      learningData: {
        ...account.learningData,
        lastUsed: account.learningData.lastUsed.toISOString(),
      },
    });
  }

  static async getChartOfAccounts(
    userId: string
  ): Promise<ChartOfAccounts[]> {
    const snapshot = await get(ref(database, `chart-of-accounts/${userId}`));
    if (!snapshot.exists()) return [];

    const accounts: ChartOfAccounts[] = [];
    snapshot.forEach((child) => {
      const data = child.val();
      accounts.push({
        ...data,
        learningData: {
          ...data.learningData,
          lastUsed: new Date(data.learningData.lastUsed),
        },
      });
    });

    return accounts;
  }

  /**
   * Connected Accounts Operations
   */
  static async addConnectedAccount(
    userId: string,
    account: ConnectedAccount
  ): Promise<void> {
    await set(ref(database, `accounts/${userId}/${account.id}`), {
      ...account,
      createdAt: account.createdAt.toISOString(),
      lastSynced: account.lastSynced
        ? account.lastSynced.toISOString()
        : null,
    });
  }

  static async getConnectedAccounts(
    userId: string
  ): Promise<ConnectedAccount[]> {
    const snapshot = await get(ref(database, `accounts/${userId}`));
    if (!snapshot.exists()) return [];

    const accounts: ConnectedAccount[] = [];
    snapshot.forEach((child) => {
      const data = child.val();
      accounts.push({
        ...data,
        createdAt: new Date(data.createdAt),
        lastSynced: data.lastSynced ? new Date(data.lastSynced) : undefined,
      });
    });

    return accounts;
  }

  /**
   * Subscription Operations
   */
  static async updateSubscription(
    userId: string,
    subscription: SubscriptionDetails
  ): Promise<void> {
    await set(ref(database, `users/${userId}/subscription`), {
      ...subscription,
      currentPeriodStart: subscription.currentPeriodStart.toISOString(),
      currentPeriodEnd: subscription.currentPeriodEnd.toISOString(),
    });
  }

  static async getSubscription(
    userId: string
  ): Promise<SubscriptionDetails | null> {
    const snapshot = await get(ref(database, `users/${userId}/subscription`));
    if (!snapshot.exists()) return null;

    const data = snapshot.val();
    return {
      ...data,
      currentPeriodStart: new Date(data.currentPeriodStart),
      currentPeriodEnd: new Date(data.currentPeriodEnd),
    };
  }
}
