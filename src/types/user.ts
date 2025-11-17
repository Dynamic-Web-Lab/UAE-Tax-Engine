/**
 * User and Subscription Types
 */

export interface User {
  id: string;
  email: string;
  displayName: string;
  businessName?: string;
  businessNameAr?: string;
  phoneNumber?: string;
  preferredLanguage: 'en' | 'ar';
  subscription: SubscriptionTier;
  onboardingComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type SubscriptionTier = 'free' | 'premium' | 'whitelabel';

export interface SubscriptionDetails {
  tier: SubscriptionTier;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  features: SubscriptionFeatures;
}

export interface SubscriptionFeatures {
  multiBankFeeds: boolean;
  vatReturns: boolean;
  ctReturns: boolean;
  ftaExport: boolean;
  aiOptimizations: boolean;
  prioritySupport: boolean;
  whitelabelApi: boolean;
  transactionLimit: number | null; // null = unlimited
}

export interface ConnectedAccount {
  id: string;
  userId: string;
  source: 'lean' | 'plaid' | 'stripe' | 'paypal' | 'talabat' | 'amazon';
  accountId: string;
  accountName: string;
  accountType: 'bank' | 'payment_gateway' | 'marketplace';
  isActive: boolean;
  lastSynced?: Date;
  accessToken: string; // Encrypted
  refreshToken?: string; // Encrypted
  metadata?: Record<string, any>;
  createdAt: Date;
}
