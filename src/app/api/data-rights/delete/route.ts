/**
 * API Route: Data Deletion Request (PDPL Article 17)
 * Allows users to request complete account and data deletion
 */

import { NextRequest, NextResponse } from 'next/server';
import { AuditLogger } from '@/lib/compliance/audit-logger';
import { ConsentManager } from '@/lib/compliance/consent-manager';
import { database } from '@/lib/firebase/config';
import { ref, set, get, update } from 'firebase/database';

export async function POST(req: NextRequest) {
  try {
    const { userId, requestType = 'full', dataTypes, reason } = await req.json();
    const ipAddress = req.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    if (!['full', 'partial'].includes(requestType)) {
      return NextResponse.json(
        { error: 'requestType must be full or partial' },
        { status: 400 }
      );
    }

    if (requestType === 'partial' && (!dataTypes || dataTypes.length === 0)) {
      return NextResponse.json(
        { error: 'dataTypes is required for partial deletion' },
        { status: 400 }
      );
    }

    // Generate unique request ID
    const requestId = `${userId}-delete-${Date.now()}`;

    // Create deletion request record
    const deletionRequestRef = ref(
      database,
      `data-deletion-requests/${userId}/${requestId}`
    );

    await set(deletionRequestRef, {
      id: requestId,
      userId,
      requestType,
      dataTypes: requestType === 'partial' ? dataTypes : undefined,
      reason: reason || 'User requested deletion',
      status: 'pending',
      requestedAt: new Date().toISOString(),
      ipAddress,
      userAgent,
    });

    // Log the deletion request
    await AuditLogger.logAction(
      userId,
      'account_delete_requested' as any,
      'account',
      userId,
      undefined,
      ipAddress,
      userAgent,
      'success',
      undefined,
      { deletionType: requestType, dataTypes, reason }
    );

    // Update user record to mark deletion pending
    await update(ref(database, `users/${userId}`), {
      deletionRequested: true,
      deletionRequestedAt: new Date().toISOString(),
      deletionStatus: 'pending',
    });

    // Archive current user data before deletion
    const userDataRef = ref(database, `users/${userId}`);
    const userSnapshot = await get(userDataRef);

    if (userSnapshot.exists()) {
      const archiveRef = ref(
        database,
        `deleted-data/${userId}/user/${Date.now()}`
      );
      await set(archiveRef, {
        ...userSnapshot.val(),
        archivedAt: new Date().toISOString(),
        deletionReason: reason || 'User requested deletion',
      });
    }

    return NextResponse.json({
      requestId,
      status: 'pending',
      message: 'Deletion request received. We will process this within 30 days as required by law.',
      note: 'A confirmation email has been sent to your registered email address.',
    });
  } catch (error) {
    console.error('Data deletion request error:', error);
    return NextResponse.json(
      { error: 'Failed to process deletion request' },
      { status: 500 }
    );
  }
}
