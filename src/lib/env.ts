/**
 * Environment Variable Validation - CRITICAL FIX
 * Validates all required environment variables at startup
 */

import { z } from 'zod';

const envSchema = z.object({
  // Firebase (Client-side)
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1, 'Firebase API Key is required'),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1, 'Firebase Auth Domain is required'),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1, 'Firebase Project ID is required'),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1, 'Firebase Storage Bucket is required'),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1, 'Firebase Messaging Sender ID is required'),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1, 'Firebase App ID is required'),

  // App Config
  NEXT_PUBLIC_APP_URL: z.string().url('Valid app URL is required'),
  NEXT_PUBLIC_PREMIUM_PRICE_AED: z.string().regex(/^\d+$/, 'Premium price must be a number'),
  NEXT_PUBLIC_API_TRANSACTION_PRICE_AED: z.string().regex(/^[\d.]+$/, 'Transaction price must be a number'),
});

const serverEnvSchema = z.object({
  // Firebase Admin (Server-side)
  FIREBASE_ADMIN_PROJECT_ID: z.string().min(1, 'Firebase Admin Project ID is required'),
  FIREBASE_ADMIN_CLIENT_EMAIL: z.string().email('Valid Firebase Admin email is required'),
  FIREBASE_ADMIN_PRIVATE_KEY: z.string().min(1, 'Firebase Admin Private Key is required'),

  // AI Services
  ANTHROPIC_API_KEY: z.string().startsWith('sk-ant-', 'Valid Anthropic API key is required'),

  // Open Banking
  LEAN_APP_TOKEN: z.string().min(1, 'Lean App Token is required'),
  LEAN_API_SECRET: z.string().min(1, 'Lean API Secret is required'),
  LEAN_ENVIRONMENT: z.enum(['sandbox', 'production'], {
    errorMap: () => ({ message: 'Lean environment must be sandbox or production' }),
  }),

  // Stripe
  STRIPE_SECRET_KEY: z.string().startsWith('sk_', 'Valid Stripe secret key is required'),
  STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_', 'Valid Stripe publishable key is required'),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_', 'Valid Stripe webhook secret is required'),
});

/**
 * Validate client-side environment variables
 */
export function validateClientEnv() {
  const env = {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    NEXT_PUBLIC_PREMIUM_PRICE_AED: process.env.NEXT_PUBLIC_PREMIUM_PRICE_AED || '49',
    NEXT_PUBLIC_API_TRANSACTION_PRICE_AED: process.env.NEXT_PUBLIC_API_TRANSACTION_PRICE_AED || '0.05',
  };

  try {
    return envSchema.parse(env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((err) => `  - ${err.path.join('.')}: ${err.message}`).join('\n');
      throw new Error(`❌ Missing or invalid environment variables:\n${missingVars}\n\nPlease check your .env file.`);
    }
    throw error;
  }
}

/**
 * Validate server-side environment variables
 */
export function validateServerEnv() {
  const env = {
    FIREBASE_ADMIN_PROJECT_ID: process.env.FIREBASE_ADMIN_PROJECT_ID,
    FIREBASE_ADMIN_CLIENT_EMAIL: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    FIREBASE_ADMIN_PRIVATE_KEY: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    LEAN_APP_TOKEN: process.env.LEAN_APP_TOKEN,
    LEAN_API_SECRET: process.env.LEAN_API_SECRET,
    LEAN_ENVIRONMENT: process.env.LEAN_ENVIRONMENT,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  };

  try {
    return serverEnvSchema.parse(env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((err) => `  - ${err.path.join('.')}: ${err.message}`).join('\n');
      throw new Error(`❌ Missing or invalid server environment variables:\n${missingVars}\n\nPlease check your .env file.`);
    }
    throw error;
  }
}

/**
 * Get validated environment variables (safe to use)
 */
export const env = {
  get firebase() {
    const validated = validateClientEnv();
    return {
      apiKey: validated.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: validated.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: validated.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: validated.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: validated.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: validated.NEXT_PUBLIC_FIREBASE_APP_ID,
    };
  },
  get app() {
    const validated = validateClientEnv();
    return {
      url: validated.NEXT_PUBLIC_APP_URL,
      premiumPrice: parseInt(validated.NEXT_PUBLIC_PREMIUM_PRICE_AED, 10),
      transactionPrice: parseFloat(validated.NEXT_PUBLIC_API_TRANSACTION_PRICE_AED),
    };
  },
};
