/**
 * AI-Powered Tax Optimization Engine
 * Generates legal tax-saving suggestions based on UAE CT law
 */

import Anthropic from '@anthropic-ai/sdk';
import {
  TaxOptimizationSuggestion,
  WhatIfScenario,
  Transaction,
} from '@/types/tax';
import {
  calculateCorporateTax,
  UAE_TAX_CONSTANTS,
} from '../tax-engine/uae-rules';

/**
 * Generate tax optimization suggestions using AI
 */
export class TaxOptimizationEngine {
  private anthropic: Anthropic;

  constructor(apiKey: string) {
    this.anthropic = new Anthropic({ apiKey });
  }

  /**
   * Generate What-If scenario with AI suggestions
   */
  async generateWhatIfScenario(
    currentProfit: number,
    projectedProfit: number,
    transactions: Transaction[],
    currentDate: Date = new Date()
  ): Promise<WhatIfScenario> {
    const currentResult = calculateCorporateTax(currentProfit);
    const projectedResult = calculateCorporateTax(projectedProfit);

    const suggestions = await this.generateOptimizationSuggestions(
      currentProfit,
      projectedProfit,
      transactions,
      currentDate
    );

    return {
      projectedProfit,
      currentTax: currentResult.corporateTax,
      projectedTax: projectedResult.corporateTax,
      difference: projectedResult.corporateTax - currentResult.corporateTax,
      suggestions,
      breakdown: projectedResult,
    };
  }

  /**
   * Generate AI-powered tax optimization suggestions
   */
  private async generateOptimizationSuggestions(
    currentProfit: number,
    projectedProfit: number,
    transactions: Transaction[],
    currentDate: Date
  ): Promise<TaxOptimizationSuggestion[]> {
    const isNearThreshold =
      Math.abs(projectedProfit - UAE_TAX_CONSTANTS.CT.THRESHOLD) < 50000;

    const monthsRemaining = 12 - currentDate.getMonth();

    const prompt = `You are a UAE tax optimization expert. Analyze this business situation and provide LEGAL tax optimization strategies.

Business Situation:
- Current Profit: AED ${currentProfit.toLocaleString()}
- Projected Year-End Profit: AED ${projectedProfit.toLocaleString()}
- UAE CT Threshold: AED ${UAE_TAX_CONSTANTS.CT.THRESHOLD.toLocaleString()}
- Months Remaining in Tax Year: ${monthsRemaining}
- Current Date: ${currentDate.toISOString().split('T')[0]}

${isNearThreshold ? '⚠️ Profit is near the AED 375k threshold!' : ''}

Recent Transactions Summary:
${this.summarizeTransactions(transactions)}

Provide 3-5 LEGAL optimization strategies under UAE Federal Decree-Law No. 47 of 2022. For each:

1. Strategy Title (English & Arabic)
2. Description of the strategy
3. Estimated tax saving
4. Legal reference (article/section)
5. Concrete action items
6. Difficulty level (easy/medium/complex)
7. Deadline (if time-sensitive)

Focus on:
- Timing of income/expenses
- Capital expenditure allowances
- Small asset relief (AED 1m threshold)
- Prepayment strategies
- Legitimate business expenses

Respond in JSON format:
{
  "suggestions": [
    {
      "title": "Strategy name",
      "titleAr": "اسم الاستراتيجية",
      "description": "Detailed explanation",
      "descriptionAr": "شرح مفصل",
      "potentialSaving": 0,
      "legalReference": "UAE CT Law Article X",
      "actionItems": ["Action 1", "Action 2"],
      "actionItemsAr": ["إجراء ١", "إجراء ٢"],
      "difficulty": "easy|medium|complex",
      "deadline": "YYYY-MM-DD" or null,
      "tags": ["timing", "capex", etc.]
    }
  ]
}`;

    try {
      const message = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        temperature: 0.7,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const responseText =
        message.content[0].type === 'text' ? message.content[0].text : '';

      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return this.getFallbackSuggestions(currentProfit, projectedProfit);
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return parsed.suggestions.map((s: any, idx: number) => ({
        id: `opt_${Date.now()}_${idx}`,
        title: s.title,
        titleAr: s.titleAr,
        description: s.description,
        descriptionAr: s.descriptionAr,
        potentialSaving: s.potentialSaving,
        legalReference: s.legalReference,
        actionItems: s.actionItems,
        actionItemsAr: s.actionItemsAr,
        difficulty: s.difficulty,
        deadline: s.deadline ? new Date(s.deadline) : undefined,
        tags: s.tags || [],
      }));
    } catch (error) {
      console.error('AI optimization error:', error);
      return this.getFallbackSuggestions(currentProfit, projectedProfit);
    }
  }

  /**
   * Fallback suggestions when AI is unavailable
   */
  private getFallbackSuggestions(
    currentProfit: number,
    projectedProfit: number
  ): TaxOptimizationSuggestion[] {
    const suggestions: TaxOptimizationSuggestion[] = [];

    // Suggestion 1: Prepay expenses if near threshold
    if (
      projectedProfit > UAE_TAX_CONSTANTS.CT.THRESHOLD &&
      projectedProfit < UAE_TAX_CONSTANTS.CT.THRESHOLD + 100000
    ) {
      const excessAmount = projectedProfit - UAE_TAX_CONSTANTS.CT.THRESHOLD;
      const potentialSaving = excessAmount * UAE_TAX_CONSTANTS.CT.RATE_HIGH;

      suggestions.push({
        id: 'fallback_1',
        title: 'Prepay Q1 Next Year Expenses',
        titleAr: 'الدفع المسبق لمصاريف الربع الأول من العام القادم',
        description:
          'Consider prepaying rent, insurance, or software subscriptions for early next year to reduce current year taxable income.',
        descriptionAr:
          'فكر في الدفع المسبق للإيجار أو التأمين أو اشتراكات البرامج لأوائل العام المقبل لتقليل الدخل الخاضع للضريبة للعام الحالي.',
        potentialSaving: Math.floor(potentialSaving),
        legalReference: 'UAE CT Law - Accrual Basis Accounting',
        actionItems: [
          'Review upcoming Q1 recurring expenses',
          'Contact vendors about prepayment terms',
          'Ensure prepayment is commercially justified',
        ],
        actionItemsAr: [
          'مراجعة المصاريف المتكررة القادمة في الربع الأول',
          'التواصل مع الموردين بشأن شروط الدفع المسبق',
          'التأكد من أن الدفع المسبق له مبرر تجاري',
        ],
        difficulty: 'easy',
        tags: ['timing', 'prepayment'],
      });
    }

    // Suggestion 2: Capital expenditure
    suggestions.push({
      id: 'fallback_2',
      title: 'Accelerate Equipment Purchases',
      titleAr: 'تسريع شراء المعدات',
      description:
        'Assets under AED 1,000,000 qualify for immediate deduction under small business asset relief.',
      descriptionAr:
        'الأصول التي تقل قيمتها عن 1,000,000 درهم مؤهلة للخصم الفوري بموجب إعفاء الأصول الصغيرة للأعمال.',
      potentialSaving: 0,
      legalReference: 'UAE CT Law Article 27 - Capital Allowances',
      actionItems: [
        'Identify needed equipment/software',
        'Ensure purchase value < AED 1m per asset',
        'Complete purchase before year-end',
      ],
      actionItemsAr: [
        'تحديد المعدات / البرامج المطلوبة',
        'التأكد من أن قيمة الشراء < 1 مليون درهم لكل أصل',
        'إكمال الشراء قبل نهاية العام',
      ],
      difficulty: 'medium',
      tags: ['capex', 'small-asset'],
    });

    // Suggestion 3: Timing of income
    if (projectedProfit > UAE_TAX_CONSTANTS.CT.THRESHOLD) {
      suggestions.push({
        id: 'fallback_3',
        title: 'Defer December Revenue Recognition',
        titleAr: 'تأجيل الاعتراف بإيرادات ديسمبر',
        description:
          'For services delivered in late December, consider invoicing in January if commercially reasonable.',
        descriptionAr:
          'بالنسبة للخدمات المقدمة في أواخر ديسمبر ، فكر في إصدار الفواتير في يناير إذا كان ذلك معقولاً تجارياً.',
        potentialSaving: 0,
        legalReference: 'UAE CT Law - Revenue Recognition',
        actionItems: [
          'Review December delivery schedule',
          'Identify invoices that can be dated Jan 2',
          'Ensure timing aligns with actual service delivery',
        ],
        actionItemsAr: [
          'مراجعة جدول التسليم في ديسمبر',
          'تحديد الفواتير التي يمكن أن تكون مؤرخة في 2 يناير',
          'التأكد من أن التوقيت يتوافق مع تقديم الخدمة الفعلية',
        ],
        difficulty: 'easy',
        tags: ['timing', 'revenue'],
      });
    }

    return suggestions;
  }

  /**
   * Summarize transactions for AI context
   */
  private summarizeTransactions(transactions: Transaction[]): string {
    const recentTxns = transactions.slice(-10);

    const summary = recentTxns
      .map(
        (t) =>
          `- ${t.type === 'income' ? '+' : '-'}AED ${t.amount} - ${t.category} (${t.description.substring(0, 30)})`
      )
      .join('\n');

    return summary || 'No recent transactions';
  }

  /**
   * Calculate tax savings from implementing a suggestion
   */
  calculateSavings(
    currentProfit: number,
    expenseReduction: number
  ): number {
    const currentTax = calculateCorporateTax(currentProfit).corporateTax;
    const newTax = calculateCorporateTax(currentProfit - expenseReduction)
      .corporateTax;

    return currentTax - newTax;
  }
}
