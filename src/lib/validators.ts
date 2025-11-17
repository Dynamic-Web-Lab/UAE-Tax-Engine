/**
 * Input Validation Schemas - HIGH PRIORITY FIX
 * Zod schemas for API request validation
 */

import { z } from 'zod';

/**
 * Transaction classification request
 */
export const classifyTransactionSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters')
    .trim(),
  amount: z
    .number()
    .positive('Amount must be positive')
    .max(1000000000, 'Amount is too large'), // 1 billion AED max
  merchantName: z.string().max(200).optional(),
});

export type ClassifyTransactionInput = z.infer<typeof classifyTransactionSchema>;

/**
 * Tax optimization request
 */
export const optimizeTaxSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  currentProfit: z
    .number()
    .min(0, 'Current profit cannot be negative')
    .max(1000000000, 'Amount is too large'),
  projectedProfit: z
    .number()
    .min(0, 'Projected profit cannot be negative')
    .max(1000000000, 'Amount is too large'),
});

export type OptimizeTaxInput = z.infer<typeof optimizeTaxSchema>;

/**
 * FTA export request
 */
export const ftaExportSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  returnType: z.enum(['CT', 'VAT'], {
    errorMap: () => ({ message: 'Return type must be CT or VAT' }),
  }),
  period: z.object({
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  }),
  businessName: z
    .string()
    .min(1, 'Business name is required')
    .max(200, 'Business name too long'),
  businessNameAr: z.string().max(200).optional(),
  trn: z
    .string()
    .regex(/^\d{15}$/, 'TRN must be 15 digits')
    .min(15, 'TRN must be 15 digits')
    .max(15, 'TRN must be 15 digits'),
  contactEmail: z.string().email('Valid email required'),
  contactPhone: z
    .string()
    .regex(/^\+971[0-9]{9}$/, 'Phone must be UAE format: +971XXXXXXXXX')
    .optional(),
});

export type FTAExportInput = z.infer<typeof ftaExportSchema>;

/**
 * Add transaction request
 */
export const addTransactionSchema = z.object({
  userId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  amount: z.number().positive().max(1000000000),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1),
  description: z.string().min(1).max(500).trim(),
  source: z.string().min(1),
  currency: z.enum(['AED', 'USD', 'EUR']).default('AED'),
  taxDeductible: z.boolean().default(false),
  deductiblePercentage: z.number().min(0).max(100).default(100),
  vatApplicable: z.boolean().default(false),
});

export type AddTransactionInput = z.infer<typeof addTransactionSchema>;

/**
 * Sanitize string input (prevent XSS)
 */
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .slice(0, 1000); // Max length
}

/**
 * Validate and parse request body
 */
export async function validateRequestBody<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<T> {
  try {
    const body = await request.json();
    return schema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      throw new Error(`Validation error: ${firstError.message} at ${firstError.path.join('.')}`);
    }
    throw new Error('Invalid request body');
  }
}
