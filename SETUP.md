# 🚀 Complete Setup Guide

This guide will walk you through setting up the UAE Tax Engine from scratch.

## Step 1: Prerequisites

Ensure you have the following:

- **Node.js 18+** ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **Git**
- Code editor (VS Code recommended)

## Step 2: Clone and Install

```bash
# Clone the repository
git clone https://github.com/maidulcu/UAE-Tax-Engine.git
cd UAE-Tax-Engine

# Install dependencies
npm install
```

## Step 3: Firebase Setup

### 3.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it "UAE Tax Engine"
4. Enable Google Analytics (optional)

### 3.2 Enable Authentication

1. In Firebase Console → Authentication
2. Click "Get Started"
3. Enable Email/Password authentication
4. Enable Google sign-in (optional)

### 3.3 Create Realtime Database

1. In Firebase Console → Realtime Database
2. Click "Create Database"
3. Choose location: **"europe-west1"** (closest to UAE)
4. Start in **test mode** (we'll secure it later)

### 3.4 Get Firebase Credentials

1. Go to Project Settings → General
2. Scroll to "Your apps"
3. Click Web icon (</>) to add web app
4. Register app name: "UAE Tax Engine Web"
5. Copy the configuration

### 3.5 Set up Firebase Admin SDK

1. Go to Project Settings → Service Accounts
2. Click "Generate new private key"
3. Save the JSON file securely
4. Extract values for `.env`:
   - `project_id`
   - `client_email`
   - `private_key`

## Step 4: Anthropic API (AI Features)

### 4.1 Get API Key

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy the key (starts with `sk-ant-`)

### 4.2 Add Credits

- Anthropic requires prepaid credits
- Minimum: $5 USD
- Recommended for testing: $20 USD

## Step 5: Lean Technologies (UAE Open Banking)

### 5.1 Create Sandbox Account

1. Go to [Lean Technologies](https://leantech.me/)
2. Sign up for developer account
3. Navigate to Dashboard
4. Get your **App Token** and **API Secret**

### 5.2 Enable Sandbox Mode

1. In Lean Dashboard → Settings
2. Enable "Sandbox Mode"
3. Test with sandbox bank credentials (provided by Lean)

## Step 6: Stripe Setup

### 6.1 Create Stripe Account

1. Go to [Stripe](https://stripe.com/)
2. Sign up (UAE supported)
3. Verify your business

### 6.2 Get API Keys

1. Dashboard → Developers → API keys
2. Copy **Publishable key** (starts with `pk_test_`)
3. Copy **Secret key** (starts with `sk_test_`)

### 6.3 Set Up Webhooks

1. Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy **Webhook signing secret** (starts with `whsec_`)

## Step 7: Environment Configuration

Create `.env` file in project root:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=uae-tax-engine.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=uae-tax-engine
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=uae-tax-engine.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Firebase Admin (Server-side)
FIREBASE_ADMIN_PROJECT_ID=uae-tax-engine
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk@uae-tax-engine.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Key-Here\n-----END PRIVATE KEY-----\n"

# AI Services
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here

# Open Banking - Lean Technologies
LEAN_APP_TOKEN=your_lean_app_token_here
LEAN_API_SECRET=your_lean_api_secret_here
LEAN_ENVIRONMENT=sandbox

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_PREMIUM_PRICE_AED=49
NEXT_PUBLIC_API_TRANSACTION_PRICE_AED=0.05

# UAE Tax Constants
UAE_CT_THRESHOLD=375000
UAE_CT_RATE_LOW=0
UAE_CT_RATE_HIGH=0.09
UAE_VAT_RATE=0.05
```

## Step 8: Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Step 9: Test Features

### Test AI Classification

1. Add a transaction manually
2. Description: "Instagram advertising campaign"
3. AI should classify as "Marketing" with high confidence

### Test Tax Calculation

1. Add income transaction: AED 400,000
2. Live Tax Meter should show:
   - Free bracket: AED 375,000
   - Taxable bracket: AED 25,000
   - Tax payable: AED 2,250 (25,000 × 9%)

### Test What-If Scenario

1. Use the slider to project year-end profit
2. Move slider to AED 500,000
3. AI should suggest optimization strategies

## Step 10: Build for Production

```bash
# Build the application
npm run build

# Test production build locally
npm start
```

## Step 11: Deploy to Azure (Optional)

### 11.1 Install Azure CLI

```bash
# macOS
brew install azure-cli

# Windows
# Download from https://aka.ms/installazurecliwindows

# Login
az login
```

### 11.2 Create Azure Resources

```bash
# Create resource group in UAE North
az group create --name uae-tax-engine-rg --location uaenorth

# Create App Service plan
az appservice plan create \
  --name uae-tax-engine-plan \
  --resource-group uae-tax-engine-rg \
  --location uaenorth \
  --sku B1 \
  --is-linux

# Create web app
az webapp create \
  --resource-group uae-tax-engine-rg \
  --plan uae-tax-engine-plan \
  --name uae-tax-engine \
  --runtime "NODE|18-lts"
```

### 11.3 Deploy

```bash
# Deploy from local build
az webapp up \
  --name uae-tax-engine \
  --resource-group uae-tax-engine-rg \
  --location uaenorth
```

### 11.4 Configure Environment Variables

```bash
# Set each environment variable
az webapp config appsettings set \
  --resource-group uae-tax-engine-rg \
  --name uae-tax-engine \
  --settings ANTHROPIC_API_KEY="sk-ant-your-key"

# Repeat for all variables from .env
```

## Troubleshooting

### Issue: Firebase connection failed

**Solution**:
- Check if Firebase API keys are correct
- Ensure Firebase Realtime Database is enabled
- Verify database rules allow read/write

### Issue: AI classification not working

**Solution**:
- Verify `ANTHROPIC_API_KEY` is set correctly
- Check Anthropic account has credits
- Review browser console for API errors

### Issue: Lean banking integration fails

**Solution**:
- Confirm you're using sandbox credentials
- Check `LEAN_ENVIRONMENT=sandbox`
- Verify Lean dashboard shows active app token

### Issue: Stripe webhook not receiving events

**Solution**:
- Use ngrok for local testing: `ngrok http 3000`
- Update Stripe webhook URL to ngrok URL
- Check webhook signing secret matches

## Security Checklist

Before going to production:

- [ ] Change all API keys from test to production
- [ ] Enable Firebase security rules
- [ ] Enable Stripe live mode
- [ ] Set up proper CORS policies
- [ ] Enable HTTPS only
- [ ] Add rate limiting
- [ ] Set up monitoring (Firebase Analytics)
- [ ] Configure backup strategy
- [ ] Review and audit code for vulnerabilities
- [ ] Set up error tracking (Sentry recommended)

## Next Steps

1. Read the [README.md](README.md) for feature overview
2. Review [API documentation](docs/API.md)
3. Check [Contributing Guide](CONTRIBUTING.md)
4. Join our [Discord community](https://discord.gg/uae-tax)

## Support

Need help?
- 📧 Email: support@uae-tax-engine.com
- 💬 Discord: [Join community](https://discord.gg/uae-tax)
- 📖 Docs: [docs.uae-tax-engine.com](https://docs.uae-tax-engine.com)
