/**
 * API Route: Data Access Request (PDPL Article 14)
 * Allows users to request download of all their personal data
 */

import { NextRequest, NextResponse } from 'next/server';
import { ConsentManager } from '@/lib/compliance/consent-manager';
import { AuditLogger } from '@/lib/compliance/audit-logger';
import { database } from '@/lib/firebase/config';
import { ref, set } from 'firebase/database';

export async function POST(req: NextRequest) {
  try {
    const { userId, format = 'json' } = await req.json();
    const ipAddress = req.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    if (!['json', 'csv'].includes(format)) {
      return NextResponse.json(
        { error: 'format must be json or csv' },
        { status: 400 }
      );
    }

    // Generate unique request ID
    const requestId = `${userId}-access-${Date.now()}`;

    // Create access request record
    const accessRequestRef = ref(
      database,
      `data-access-requests/${userId}/${requestId}`
    );

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30); // Download link valid for 30 days

    await set(accessRequestRef, {
      id: requestId,
      userId,
      format,
      status: 'pending',
      requestedAt: new Date().toISOString(),
      expiresAt: expiryDate.toISOString(),
      ipAddress,
      userAgent,
    });

    // Log the request
    await AuditLogger.logDataExport(
      userId,
      ['transactions', 'profile', 'consent', 'banking', 'ai_data'],
      format as 'json' | 'csv',
      ipAddress,
      userAgent
    );

    return NextResponse.json({
      requestId,
      status: 'pending',
      message: 'Data access request received. Processing will begin shortly.',
      expiresAt: expiryDate.toISOString(),
    });
  } catch (error) {
    console.error('Data access request error:', error);
    return NextResponse.json(
      { error: 'Failed to process data access request' },
      { status: 500 }
    );
  }
}
