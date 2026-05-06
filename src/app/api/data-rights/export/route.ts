/**
 * API Route: Data Export (PDPL Article 15)
 * Provides user data in portable format (JSON/CSV)
 */

import { NextRequest, NextResponse } from 'next/server';
import { ConsentManager } from '@/lib/compliance/consent-manager';
import { AuditLogger } from '@/lib/compliance/audit-logger';
import { database } from '@/lib/firebase/config';
import { ref, get } from 'firebase/database';

export async function POST(req: NextRequest) {
  try {
    const { userId, format = 'json', dataTypes } = await req.json();
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

    // Determine which data types to export
    const typesToExport = dataTypes || [
      'profile',
      'transactions',
      'consent',
      'banking',
      'audit_logs',
    ];

    // Fetch user data
    const userData: Record<string, any> = {};

    if (typesToExport.includes('profile')) {
      const userRef = ref(database, `users/${userId}`);
      const userSnapshot = await get(userRef);
      if (userSnapshot.exists()) {
        userData.profile = userSnapshot.val();
      }
    }

    if (typesToExport.includes('transactions')) {
      const transRef = ref(database, `transactions/${userId}`);
      const transSnapshot = await get(transRef);
      if (transSnapshot.exists()) {
        userData.transactions = transSnapshot.val();
      }
    }

    if (typesToExport.includes('consent')) {
      const consentData = await ConsentManager.getUserConsent(userId);
      if (consentData) {
        userData.consent = consentData;
      }
    }

    if (typesToExport.includes('banking')) {
      const bankRef = ref(database, `banking/${userId}`);
      const bankSnapshot = await get(bankRef);
      if (bankSnapshot.exists()) {
        userData.banking = bankSnapshot.val();
      }
    }

    if (typesToExport.includes('audit_logs')) {
      const auditLogs = await AuditLogger.getUserAuditLog(userId, 1000);
      userData.auditLogs = auditLogs;
    }

    // Log the export
    await AuditLogger.logDataExport(
      userId,
      typesToExport,
      format as 'json' | 'csv',
      ipAddress,
      userAgent
    );

    // Format response based on requested format
    let exportContent: string;
    let contentType: string;

    if (format === 'json') {
      exportContent = JSON.stringify(userData, null, 2);
      contentType = 'application/json';
    } else {
      // CSV format - flatten the data
      exportContent = convertToCSV(userData);
      contentType = 'text/csv';
    }

    const filename = `user-data-export-${userId}-${new Date().toISOString().split('T')[0]}.${format === 'json' ? 'json' : 'csv'}`;

    return new Response(exportContent, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Data export error:', error);
    return NextResponse.json(
      { error: 'Failed to process export request' },
      { status: 500 }
    );
  }
}

function convertToCSV(data: Record<string, any>): string {
  const lines: string[] = [];

  // Add header with data types
  lines.push('DataType,Key,Value');

  // Flatten nested data
  for (const [dataType, content] of Object.entries(data)) {
    if (typeof content === 'object' && content !== null) {
      for (const [key, value] of Object.entries(content)) {
        const valueStr = typeof value === 'object'
          ? JSON.stringify(value)
          : String(value);
        lines.push(
          `${dataType},"${key}","${valueStr.replace(/"/g, '""')}"`
        );
      }
    } else {
      lines.push(
        `${dataType},"","${String(content).replace(/"/g, '""')}"`
      );
    }
  }

  return lines.join('\n');
}
