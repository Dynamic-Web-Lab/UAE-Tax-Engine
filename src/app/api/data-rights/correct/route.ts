/**
 * API Route: Data Correction Request (PDPL Article 16)
 * Allows users to correct inaccurate personal data
 */

import { NextRequest, NextResponse } from 'next/server';
import { AuditLogger } from '@/lib/compliance/audit-logger';
import { database } from '@/lib/firebase/config';
import { ref, update, get } from 'firebase/database';

export async function POST(req: NextRequest) {
  try {
    const { userId, dataType, corrections, reason } = await req.json();
    const ipAddress = req.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    if (!userId || !dataType || !corrections) {
      return NextResponse.json(
        { error: 'userId, dataType, and corrections are required' },
        { status: 400 }
      );
    }

    const validDataTypes = ['profile', 'banking', 'contact'];
    if (!validDataTypes.includes(dataType)) {
      return NextResponse.json(
        { error: `dataType must be one of: ${validDataTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate corrections object has at least one field
    if (typeof corrections !== 'object' || Object.keys(corrections).length === 0) {
      return NextResponse.json(
        { error: 'corrections must contain at least one field to correct' },
        { status: 400 }
      );
    }

    // Get current data for audit trail
    const dataRef = ref(database, `users/${userId}/${dataType}`);
    const snapshot = await get(dataRef);
    const oldData = snapshot.exists() ? snapshot.val() : {};

    // Apply corrections
    await update(dataRef, corrections);

    // Log the correction
    await AuditLogger.logAction(
      userId,
      'data_modification' as any,
      dataType,
      userId,
      dataType as 'profile' | 'banking',
      ipAddress,
      userAgent,
      'success',
      undefined,
      {
        correctionType: 'user_initiated_correction',
        dataType,
        oldData,
        newData: corrections,
        reason,
      }
    );

    // Create correction request record for audit
    const correctionId = `${userId}-correction-${Date.now()}`;
    const correctionRef = ref(
      database,
      `data-correction-requests/${userId}/${correctionId}`
    );

    await update(correctionRef, {
      id: correctionId,
      userId,
      dataType,
      corrections,
      reason: reason || 'User-requested correction',
      status: 'completed',
      requestedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      ipAddress,
      userAgent,
    });

    return NextResponse.json({
      correctionId,
      status: 'completed',
      message: 'Your data has been corrected successfully.',
      appliedCorrections: Object.keys(corrections),
    });
  } catch (error) {
    console.error('Data correction error:', error);
    return NextResponse.json(
      { error: 'Failed to process correction request' },
      { status: 500 }
    );
  }
}
