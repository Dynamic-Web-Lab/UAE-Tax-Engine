/**
 * API Route: AI Tax Optimization
 * Generates tax optimization suggestions using Claude AI
 */

import { NextRequest, NextResponse } from 'next/server';
import { TaxOptimizationEngine } from '@/lib/ai/tax-optimizer';
import { FirebaseDatabase } from '@/lib/firebase/database';

export async function POST(req: NextRequest) {
  try {
    const { userId, currentProfit, projectedProfit } = await req.json();

    if (!userId || currentProfit === undefined || projectedProfit === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY || '';
    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      );
    }

    // Get user's transactions for context
    const transactions = await FirebaseDatabase.getTransactions(userId, 1000);

    // Generate optimization scenario
    const optimizer = new TaxOptimizationEngine(apiKey);
    const scenario = await optimizer.generateWhatIfScenario(
      currentProfit,
      projectedProfit,
      transactions
    );

    return NextResponse.json(scenario);
  } catch (error) {
    console.error('Tax optimization error:', error);
    return NextResponse.json(
      { error: 'Optimization failed' },
      { status: 500 }
    );
  }
}
