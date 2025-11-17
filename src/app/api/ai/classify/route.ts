/**
 * API Route: AI Transaction Classification
 * Processes transactions through Claude AI for categorization
 */

import { NextRequest, NextResponse } from 'next/server';
import { AITransactionClassifier } from '@/lib/ai/transaction-classifier';
import { FirebaseDatabase } from '@/lib/firebase/database';

export async function POST(req: NextRequest) {
  try {
    const { userId, description, amount, merchantName } = await req.json();

    if (!userId || !description || !amount) {
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

    // Initialize classifier
    const classifier = new AITransactionClassifier(apiKey);

    // Load user's learning data
    const chartOfAccounts = await FirebaseDatabase.getChartOfAccounts(userId);
    await classifier.loadLearningData(chartOfAccounts);

    // Classify transaction
    const result = await classifier.classifyTransaction(
      description,
      amount,
      merchantName
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('AI classification error:', error);
    return NextResponse.json(
      { error: 'Classification failed' },
      { status: 500 }
    );
  }
}
