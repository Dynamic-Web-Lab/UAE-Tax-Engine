/**
 * API Route: Data Rights Request Status
 * Check status of pending access, deletion, correction requests
 */

import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/firebase/config';
import { ref, get } from 'firebase/database';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const requestId = searchParams.get('requestId');
    const requestType = searchParams.get('type'); // access, delete, correct

    if (!userId) {
      return NextResponse.json(
        { error: 'userId query parameter is required' },
        { status: 400 }
      );
    }

    const statusData: Record<string, any> = {
      userId,
      timestamp: new Date().toISOString(),
    };

    if (requestId && requestType) {
      // Get status of specific request
      const requestPath = requestType === 'access'
        ? `data-access-requests/${userId}/${requestId}`
        : requestType === 'delete'
          ? `data-deletion-requests/${userId}/${requestId}`
          : `data-correction-requests/${userId}/${requestId}`;

      const requestRef = ref(database, requestPath);
      const snapshot = await get(requestRef);

      if (!snapshot.exists()) {
        return NextResponse.json(
          { error: 'Request not found' },
          { status: 404 }
        );
      }

      statusData.request = snapshot.val();
    } else {
      // Get all requests for user
      const accessRef = ref(database, `data-access-requests/${userId}`);
      const deleteRef = ref(database, `data-deletion-requests/${userId}`);
      const correctRef = ref(database, `data-correction-requests/${userId}`);

      const [accessSnapshot, deleteSnapshot, correctSnapshot] = await Promise.all([
        get(accessRef),
        get(deleteRef),
        get(correctRef),
      ]);

      statusData.accessRequests = accessSnapshot.exists()
        ? Object.values(accessSnapshot.val())
        : [];

      statusData.deletionRequests = deleteSnapshot.exists()
        ? Object.values(deleteSnapshot.val())
        : [];

      statusData.correctionRequests = correctSnapshot.exists()
        ? Object.values(correctSnapshot.val())
        : [];
    }

    return NextResponse.json(statusData);
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve status' },
      { status: 500 }
    );
  }
}
