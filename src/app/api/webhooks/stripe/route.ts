/**
 * API Route: Stripe Webhook Handler
 * Handles subscription events from Stripe
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { FirebaseDatabase } from '@/lib/firebase/database';
import { SubscriptionDetails } from '@/types/user';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
      break;

    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
      break;

    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
      break;

    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object as Stripe.Invoice);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;
  if (!userId) return;

  const subscriptionData: SubscriptionDetails = {
    tier: 'premium',
    status: subscription.status as any,
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    stripeCustomerId: subscription.customer as string,
    stripeSubscriptionId: subscription.id,
    features: {
      multiBankFeeds: true,
      vatReturns: true,
      ctReturns: true,
      ftaExport: true,
      aiOptimizations: true,
      prioritySupport: true,
      whitelabelApi: false,
      transactionLimit: null,
    },
  };

  await FirebaseDatabase.updateSubscription(userId, subscriptionData);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;
  if (!userId) return;

  const subscriptionData: SubscriptionDetails = {
    tier: 'free',
    status: 'cancelled',
    currentPeriodStart: new Date(),
    currentPeriodEnd: new Date(),
    cancelAtPeriodEnd: false,
    features: {
      multiBankFeeds: false,
      vatReturns: false,
      ctReturns: false,
      ftaExport: false,
      aiOptimizations: false,
      prioritySupport: false,
      whitelabelApi: false,
      transactionLimit: 100,
    },
  };

  await FirebaseDatabase.updateSubscription(userId, subscriptionData);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Payment succeeded:', invoice.id);
  // Send receipt email, update payment history, etc.
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Payment failed:', invoice.id);
  // Send notification to user, retry payment, etc.
}
