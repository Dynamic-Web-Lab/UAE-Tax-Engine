# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Commands

```bash
# Install dependencies
npm install

# Development server (runs on http://localhost:3000)
npm run dev

# Type checking
npm run type-check

# Build for production
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## Environment Setup

This project requires a `.env` file with credentials for multiple services. See `.env.example` for the complete list.

**Critical variables** (development will fail without these):
- Firebase: `NEXT_PUBLIC_FIREBASE_*` and `FIREBASE_ADMIN_*`
- AI: `ANTHROPIC_API_KEY` (required for AI features)
- Open Banking: `LEAN_APP_TOKEN` and `LEAN_API_SECRET`
- Payments: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`

Environment variables are validated at startup via `src/lib/env.ts` using Zod schemas. Invalid or missing variables will throw descriptive errors showing exactly which variables are problematic.

## Architecture Overview

### Technology Stack
- **Framework**: Next.js 14 (App Router) + React 18
- **Styling**: Tailwind CSS + Framer Motion
- **Database**: Firebase Realtime Database
- **Auth**: Firebase Authentication
- **AI**: Anthropic Claude 3.5 Sonnet via `@anthropic-ai/sdk`
- **Payments**: Stripe
- **Open Banking**: Lean Technologies (UAE banks)
- **Validation**: Zod for runtime schema validation
- **State**: Zustand + React Query
- **Internationalization**: react-i18next (English/Arabic)

### Project Structure

```
src/
├── app/                        # Next.js 14 App Router
│   ├── api/                    # API routes
│   │   ├── ai/                 # AI classification & optimization
│   │   ├── banking/            # Bank integration callbacks
│   │   ├── fta/                # FTA export endpoints
│   │   └── webhooks/           # Stripe webhooks
│   ├── auth/                   # Authentication pages
│   └── dashboard/              # Main application pages
├── components/                 # React components
│   ├── LiveTaxMeter.tsx        # Real-time tax visualization
│   ├── WhatIfSlider.tsx        # Scenario planning
│   ├── TransactionList.tsx     # Transaction display
│   └── ErrorBoundary.tsx       # Error handling
├── lib/
│   ├── ai/                     # AI features
│   │   ├── transaction-classifier.ts   # Classifies transactions using Claude
│   │   └── tax-optimizer.ts            # Generates optimization suggestions
│   ├── firebase/               # Firebase utilities
│   │   ├── config.ts           # Firebase initialization
│   │   ├── database.ts         # Realtime DB operations
│   │   └── admin.ts            # Server-side Firebase Admin
│   ├── tax-engine/             # UAE tax calculations
│   │   └── uae-rules.ts        # Corporate tax & VAT rules
│   ├── integrations/           # External services
│   │   ├── lean-banking.ts     # Lean Open Banking client
│   │   └── stripe-integration.ts
│   ├── fta/                    # FTA compliance
│   │   └── xml-export.ts       # emaraTax XML generation
│   ├── i18n/                   # Internationalization
│   ├── env.ts                  # Environment validation
│   ├── validators.ts           # Zod request schemas
│   └── api-auth.ts             # API authentication helpers
├── types/
│   ├── tax.ts                  # Transaction, TaxPeriod, ChartOfAccounts types
│   └── user.ts                 # User, Subscription types
└── middleware.ts               # Next.js middleware (auth checks)
```

## Core Patterns

### 1. Environment Validation
All environment variables are validated using Zod in `src/lib/env.ts`. Access via:
```typescript
import { env } from '@/lib/env';
env.firebase // Returns validated Firebase config
env.app      // Returns validated app config
```

### 2. Request Validation
API routes validate incoming requests using Zod schemas from `src/lib/validators.ts`:
```typescript
import { validateRequestBody, classifyTransactionSchema } from '@/lib/validators';

export async function POST(req: NextRequest) {
  const data = await validateRequestBody(req, classifyTransactionSchema);
  // data is now type-safe
}
```

### 3. Firebase Database Structure
The database follows a hierarchical structure with namespaced paths:
```
/users/{userId}/profile           # User profile data
/users/{userId}/subscription      # Subscription details
/transactions/{userId}/{txnId}    # Transaction records
/accounts/{userId}/{accountId}    # Connected bank accounts
/chart-of-accounts/{userId}/{id}  # Chart of accounts for AI learning
/tax-periods/{userId}/{periodId}  # Tax period records
/live-metrics/{userId}            # Real-time calculated metrics
```

All Firebase operations go through `FirebaseDatabase` class in `src/lib/firebase/database.ts`. This class handles:
- User CRUD operations
- Transaction management with automatic live metrics updates
- Connected account tracking
- Chart of accounts (for AI learning data)
- Real-time metrics subscriptions

### 4. AI Integration Pattern
AI features use `@anthropic-ai/sdk`. Two main AI modules:

**Transaction Classifier** (`src/lib/ai/transaction-classifier.ts`):
- Learns from user's Chart of Accounts (historical classifications)
- Classifies new transactions with confidence scores
- Returns category, deductibility, and tax impact

**Tax Optimizer** (`src/lib/ai/tax-optimizer.ts`):
- Takes current and projected profit
- Generates legal tax optimization strategies
- Returns scenarios with potential savings

Both are exposed via API routes in `src/app/api/ai/`.

### 5. UAE Tax Rules
`src/lib/tax-engine/uae-rules.ts` implements Federal Decree-Law No. 47 of 2022:
- Corporate Tax: 0% on first AED 375,000, then 9%
- VAT: Standard 5% rate
- Deduction rules: e.g., meals 50% deductible
- Small business relief calculations

Used throughout for real-time tax calculations.

### 6. FTA XML Export
`src/lib/fta/xml-export.ts` generates emaraTax-compliant XML for:
- Corporate Tax (CT) returns
- VAT returns

Exposed via `src/app/api/fta/export/route.ts`.

### 7. API Route Structure
All API routes follow this pattern:
```typescript
// 1. Validate input
const data = await validateRequestBody(req, schema);

// 2. Check authentication
const userId = await getUserFromAuth(req);

// 3. Business logic
// - Call Firebase operations
// - Call AI services
// - Call integrations

// 4. Return typed response
return NextResponse.json({ success: true, data: result });
```

Error handling wraps in try/catch, returning 500 status with descriptive messages.

### 8. Middleware Authentication
`src/middleware.ts` protects routes. Add protected routes by adding their paths to the middleware matchers.

### 9. Internationalization
The app supports English and Arabic via `react-i18next`:
- Translation files in `public/locales/{en,ar}/`
- Use `useTranslation()` hook in components
- Language detection is automatic; users can override in settings

## Key Modules Reference

### `src/lib/firebase/database.ts`
The single source of truth for all database operations. All methods are static and async.

**Important methods:**
- `getTransactions(userId, limit?)` - Fetches recent transactions
- `addTransaction(userId, transaction)` - Adds transaction and updates live metrics
- `updateLiveMetrics(userId)` - Recalculates profit/tax/VAT for user
- `getChartOfAccounts(userId)` - Fetches user's learning data for AI
- `subscribeLiveMetrics(userId, callback)` - Real-time listener for metrics

### `src/lib/ai/transaction-classifier.ts`
Classifies transactions using Claude. Call pattern:
```typescript
const classifier = new AITransactionClassifier(apiKey);
await classifier.loadLearningData(chartOfAccounts); // Load user's patterns
const result = await classifier.classifyTransaction(description, amount, merchant);
// Returns: { category, confidence, taxDeductible, deductiblePercentage }
```

### `src/lib/tax-engine/uae-rules.ts`
Pure calculation functions; no I/O:
```typescript
const result = calculateCorporateTax(profit);
// Returns: { grossIncome, corporateTax, effectiveRate, breakdown }

const deductible = isDeductibleExpense('meals_entertainment', description);
// Returns: { deductible, percentage, reason }
```

### `src/lib/validators.ts`
Zod schemas for all API inputs. Import schemas like:
```typescript
import { classifyTransactionSchema, optimizeTaxSchema, ftaExportSchema } from '@/lib/validators';
```

## Common Development Tasks

### Adding a New API Route
1. Create file in `src/app/api/{feature}/route.ts`
2. Import or create a Zod schema in `src/lib/validators.ts`
3. Use `validateRequestBody(req, schema)` to parse input
4. Wrap in try/catch, return `NextResponse.json()`
5. If it needs authentication, extract userId via Firebase Auth

### Modifying Tax Rules
Edit `src/lib/tax-engine/uae-rules.ts`. Rules are pure functions with no side effects, making them easy to test.

### Adding AI Features
1. Create a class in `src/lib/ai/feature-name.ts`
2. Instantiate with `new ClassName(apiKey)`
3. Call methods to get results from Claude
4. Expose via `src/app/api/ai/{feature}/route.ts`

### Database Schema Changes
The Firebase structure is defined in the docstring at the top of `src/lib/firebase/database.ts`. Update:
1. The docstring showing the new structure
2. Add getter/setter methods to `FirebaseDatabase` class
3. Update TypeScript types in `src/types/tax.ts` or `src/types/user.ts`

## Type System

TypeScript is strict (`strict: true` in tsconfig). Key types:

**src/types/tax.ts:**
- `Transaction`: Single income/expense record
- `ChartOfAccounts`: Category with AI learning metadata
- `TaxPeriod`: Period-specific calculations

**src/types/user.ts:**
- `User`: Profile data
- `ConnectedAccount`: Bank connection details
- `SubscriptionDetails`: Subscription status and dates

## Testing

Run type checking to catch errors:
```bash
npm run type-check
```

No test framework is configured. For feature validation, test manually against Firebase emulator or dev instance.

## Deployment

The app is configured for Azure UAE North (via `next.config.js`):
- `output: 'standalone'` enables containerized deployment
- Cache headers set to 1 year + immutable for optimal edge caching
- PWA configured (disabled in development, enabled in production)

## Critical Notes

1. **Always validate environment variables at startup.** The `env.ts` module does this automatically, but custom getters may bypass it.

2. **Firebase operations are async.** Never forget `await` when calling `FirebaseDatabase` methods.

3. **Live metrics recalculate on every transaction change.** The `updateLiveMetrics()` method is called automatically by `addTransaction()` and `updateTransaction()`, but remember to call it manually if you modify the database directly.

4. **Dates are converted to/from ISO strings in Firebase.** The `FirebaseDatabase` class handles this, but if you write data directly to Firebase, ensure dates are ISO strings in storage and converted back to `Date` objects when reading.

5. **Zod validation is synchronous.** Use `validateRequestBody()` for async parsing, but for standalone schema validation, call `.parse()` synchronously.

6. **The Anthropic SDK may rate-limit.** Handle rate limit errors (429) gracefully in AI routes and inform users appropriately.

## Git Workflow

The current development branch is `claude/add-claude-documentation-nrw83`. Push changes to this branch, and create a draft PR when ready.
