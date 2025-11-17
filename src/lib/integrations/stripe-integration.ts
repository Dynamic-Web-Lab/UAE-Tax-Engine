/**
 * Stripe Payment Integration
 * For both subscription billing and transaction syncing
 */

import Stripe from 'stripe';
import { Transaction } from '@/types/tax';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

/**
 * Stripe Integration Client
 */
export class StripeIntegration {
  /**
   * Create checkout session for premium subscription
   */
  async createCheckoutSession(
    userId: string,
    userEmail: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<string> {
    const session = await stripe.checkout.sessions.create({
      customer_email: userEmail,
      client_reference_id: userId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'aed',
            product_data: {
              name: 'UAE Tax Engine Premium',
              description:
                'Multi-bank feeds, VAT & CT returns, FTA export, AI optimizations',
            },
            unit_amount: 4900, // AED 49.00
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
      },
    });

    return session.url!;
  }

  /**
   * Create portal session for subscription management
   */
  async createPortalSession(
    customerId: string,
    returnUrl: string
  ): Promise<string> {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return session.url;
  }

  /**
   * Get Stripe transactions (charges) for a customer
   */
  async getTransactions(
    customerId: string,
    fromDate: Date
  ): Promise<Omit<Transaction, 'id'>[]> {
    const charges = await stripe.charges.list({
      customer: customerId,
      created: {
        gte: Math.floor(fromDate.getTime() / 1000),
      },
      limit: 100,
    });

    return charges.data.map((charge) => ({
      date: new Date(charge.created * 1000),
      amount: charge.amount / 100, // Convert from cents
      type: 'income' as const,
      category: 'revenue' as any,
      description: charge.description || `Payment from ${charge.billing_details?.name || 'customer'}`,
      source: 'stripe' as const,
      currency: (charge.currency.toUpperCase() as any) || 'AED',
      isRecurring: false,
      taxDeductible: false,
      deductiblePercentage: 0,
      vatApplicable: true,
      autoClassified: true,
      confidence: 0.95,
      metadata: {
        stripeChargeId: charge.id,
        paymentMethod: charge.payment_method_details?.type,
      },
    }));
  }

  /**
   * Handle Stripe webhook events
   */
  async handleWebhook(
    payload: string | Buffer,
    signature: string
  ): Promise<Stripe.Event> {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<void> {
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
  }

  /**
   * Get subscription details
   */
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return await stripe.subscriptions.retrieve(subscriptionId);
  }
}

export const stripeClient = new StripeIntegration();
