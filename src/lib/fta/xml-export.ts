/**
 * FTA emaraTax XML Export
 * Generates compliant XML for UAE Federal Tax Authority submissions
 */

import { create } from 'xmlbuilder2';
import { Transaction, TaxPeriod, FTAExport } from '@/types/tax';
import { calculateCorporateTax, calculateVAT } from '../tax-engine/uae-rules';

interface TaxReturnData {
  businessName: string;
  businessNameAr?: string;
  trn: string; // Tax Registration Number
  period: TaxPeriod;
  transactions: Transaction[];
  contactEmail: string;
  contactPhone: string;
}

/**
 * Generate FTA Corporate Tax XML
 */
export function generateCTXML(data: TaxReturnData): string {
  const { transactions, period, businessName, businessNameAr, trn, contactEmail } = data;

  // Calculate tax
  let totalIncome = 0;
  let totalDeductions = 0;

  transactions.forEach((txn) => {
    if (txn.type === 'income') {
      totalIncome += txn.amount;
    } else if (txn.taxDeductible) {
      totalDeductions += txn.amount * (txn.deductiblePercentage / 100);
    }
  });

  const taxableIncome = totalIncome - totalDeductions;
  const taxResult = calculateCorporateTax(taxableIncome);

  // Build XML
  const doc = create({ version: '1.0', encoding: 'UTF-8' })
    .ele('CorporateTaxReturn', {
      'xmlns': 'urn:ae:gov:fta:corporatetax',
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'version': '1.0',
    })
    .ele('Header')
      .ele('TaxRegistrationNumber').txt(trn).up()
      .ele('TaxPeriodStart').txt(period.startDate.toISOString().split('T')[0]).up()
      .ele('TaxPeriodEnd').txt(period.endDate.toISOString().split('T')[0]).up()
      .ele('TaxYear').txt(period.taxYear.toString()).up()
      .ele('SubmissionDate').txt(new Date().toISOString().split('T')[0]).up()
      .ele('ContactEmail').txt(contactEmail).up()
    .up()
    .ele('TaxpayerInformation')
      .ele('LegalName').txt(businessName).up()
      .ele('LegalNameArabic').txt(businessNameAr || businessName).up()
      .ele('TRN').txt(trn).up()
    .up()
    .ele('IncomeStatement')
      .ele('TotalRevenue').txt(totalIncome.toFixed(2)).up()
      .ele('TotalDeductions').txt(totalDeductions.toFixed(2)).up()
      .ele('TaxableIncome').txt(taxableIncome.toFixed(2)).up()
    .up()
    .ele('TaxCalculation')
      .ele('TaxFreeAmount').txt(taxResult.breakdown.freeBracket.toFixed(2)).up()
      .ele('TaxableAmount').txt(taxResult.breakdown.taxableBracket.toFixed(2)).up()
      .ele('TaxRate').txt('0.09').up()
      .ele('TaxPayable').txt(taxResult.corporateTax.toFixed(2)).up()
      .ele('EffectiveRate').txt(taxResult.effectiveRate.toFixed(4)).up()
    .up()
    .ele('Declaration')
      .ele('DeclarationStatement').txt(
        'I declare that the information provided in this return is true, correct and complete.'
      ).up()
      .ele('DeclarationDate').txt(new Date().toISOString().split('T')[0]).up()
    .up();

  return doc.end({ prettyPrint: true });
}

/**
 * Generate FTA VAT Return XML
 */
export function generateVATXML(data: TaxReturnData): string {
  const { transactions, period, businessName, trn, contactEmail } = data;

  const vatLiability = calculateVAT(transactions);

  // Calculate VAT details
  let standardRatedSupplies = 0;
  let outputVAT = 0;
  let inputVAT = 0;

  transactions.forEach((txn) => {
    if (txn.vatApplicable) {
      const vatAmount = txn.amount * 0.05;
      if (txn.type === 'income') {
        standardRatedSupplies += txn.amount;
        outputVAT += vatAmount;
      } else {
        inputVAT += vatAmount;
      }
    }
  });

  const netVAT = outputVAT - inputVAT;

  // Build XML
  const doc = create({ version: '1.0', encoding: 'UTF-8' })
    .ele('VATReturn', {
      'xmlns': 'urn:ae:gov:fta:vat',
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'version': '1.0',
    })
    .ele('Header')
      .ele('TRN').txt(trn).up()
      .ele('ReturnPeriodStart').txt(period.startDate.toISOString().split('T')[0]).up()
      .ele('ReturnPeriodEnd').txt(period.endDate.toISOString().split('T')[0]).up()
      .ele('SubmissionDate').txt(new Date().toISOString().split('T')[0]).up()
      .ele('ContactEmail').txt(contactEmail).up()
    .up()
    .ele('TaxpayerDetails')
      .ele('LegalName').txt(businessName).up()
      .ele('TRN').txt(trn).up()
    .up()
    .ele('VATOutputs')
      .ele('StandardRatedSupplies').txt(standardRatedSupplies.toFixed(2)).up()
      .ele('OutputVAT').txt(outputVAT.toFixed(2)).up()
    .up()
    .ele('VATInputs')
      .ele('InputVAT').txt(inputVAT.toFixed(2)).up()
    .up()
    .ele('VATSummary')
      .ele('TotalOutputVAT').txt(outputVAT.toFixed(2)).up()
      .ele('TotalInputVAT').txt(inputVAT.toFixed(2)).up()
      .ele('NetVATDue').txt(netVAT.toFixed(2)).up()
      .ele('VATPayable').txt(Math.max(0, netVAT).toFixed(2)).up()
    .up()
    .ele('Declaration')
      .ele('DeclarationStatement').txt(
        'I declare that the information provided in this VAT return is true and complete.'
      ).up()
      .ele('DeclarationDate').txt(new Date().toISOString().split('T')[0]).up()
    .up();

  return doc.end({ prettyPrint: true });
}

/**
 * Export tax return data
 */
export async function exportTaxReturn(
  data: TaxReturnData,
  returnType: 'CT' | 'VAT'
): Promise<FTAExport> {
  let xmlData: string;
  const taxableIncome = data.transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const taxResult = calculateCorporateTax(taxableIncome);
  const vatLiability = calculateVAT(data.transactions);

  if (returnType === 'CT') {
    xmlData = generateCTXML(data);
  } else {
    xmlData = generateVATXML(data);
  }

  return {
    period: data.period,
    taxableIncome,
    corporateTax: taxResult.corporateTax,
    vat: vatLiability,
    xmlData,
    generatedAt: new Date(),
  };
}

/**
 * Download XML file
 */
export function downloadXML(xmlData: string, filename: string): void {
  const blob = new Blob([xmlData], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
