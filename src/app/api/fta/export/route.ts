/**
 * API Route: FTA Export Generation
 * Generates emaraTax XML for CT or VAT returns
 */

import { NextRequest, NextResponse } from 'next/server';
import { exportTaxReturn } from '@/lib/fta/xml-export';
import { FirebaseDatabase } from '@/lib/firebase/database';
import { TaxPeriod } from '@/types/tax';

export async function POST(req: NextRequest) {
  try {
    const {
      userId,
      returnType, // 'CT' or 'VAT'
      period,
      businessName,
      businessNameAr,
      trn,
      contactEmail,
      contactPhone,
    } = await req.json();

    if (!userId || !returnType || !period || !businessName || !trn || !contactEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get transactions for the period
    const transactions = await FirebaseDatabase.getTransactions(userId, 10000);

    // Filter transactions by period
    const periodStart = new Date(period.startDate);
    const periodEnd = new Date(period.endDate);
    const periodTransactions = transactions.filter(
      (txn) => txn.date >= periodStart && txn.date <= periodEnd
    );

    const taxPeriod: TaxPeriod = {
      startDate: periodStart,
      endDate: periodEnd,
      taxYear: new Date(period.startDate).getFullYear(),
      status: 'current',
    };

    // Generate export
    const ftaExport = await exportTaxReturn(
      {
        businessName,
        businessNameAr,
        trn,
        period: taxPeriod,
        transactions: periodTransactions,
        contactEmail,
        contactPhone,
      },
      returnType
    );

    return NextResponse.json({
      success: true,
      xmlData: ftaExport.xmlData,
      taxableIncome: ftaExport.taxableIncome,
      corporateTax: ftaExport.corporateTax,
      vat: ftaExport.vat,
      generatedAt: ftaExport.generatedAt,
    });
  } catch (error) {
    console.error('FTA export error:', error);
    return NextResponse.json(
      { error: 'Export generation failed' },
      { status: 500 }
    );
  }
}
