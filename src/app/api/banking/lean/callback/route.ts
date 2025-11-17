/**
 * API Route: Lean Banking OAuth Callback
 * Handles authorization callback from Lean Technologies
 */

import { NextRequest, NextResponse } from 'next/server';
import { createLeanClient } from '@/lib/integrations/lean-banking';
import { FirebaseDatabase } from '@/lib/firebase/database';
import { ConnectedAccount } from '@/types/user';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');
  const userId = searchParams.get('state'); // We pass userId as state parameter

  if (!code || !userId) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=auth_failed`
    );
  }

  try {
    const leanClient = createLeanClient();

    // Exchange code for access token
    const accessToken = await leanClient.exchangeToken(code);

    // Get connected accounts
    const accounts = await leanClient.getAccounts(accessToken);

    // Save each account to Firebase
    for (const account of accounts) {
      const connectedAccount: ConnectedAccount = {
        id: `lean_${account.id}`,
        userId,
        source: 'lean',
        accountId: account.id,
        accountName: account.name,
        accountType: 'bank',
        isActive: true,
        lastSynced: new Date(),
        accessToken: accessToken, // Should be encrypted in production
        createdAt: new Date(),
        metadata: {
          balance: account.balance,
          currency: account.currency,
          accountType: account.type,
        },
      };

      await FirebaseDatabase.addConnectedAccount(userId, connectedAccount);
    }

    // Redirect back to dashboard with success
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?connected=success`
    );
  } catch (error) {
    console.error('Lean OAuth callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=connection_failed`
    );
  }
}
