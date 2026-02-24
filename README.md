# LinkedIn Content Repurposer 🚀

> AI-powered tool that transforms LinkedIn posts into Twitter threads, blog articles, and newsletters in seconds.

## 🎯 What This Does

This is a complete micro-SaaS application that:
- Converts LinkedIn posts to 3 different formats using AI (GPT-4)
- Handles user authentication (Clerk)
- Processes payments and subscriptions (Stripe)
- Tracks usage limits per subscription tier
- Provides a beautiful dashboard for managing conversions

**Target Revenue**: $300+/month with just 10-15 paying customers

## 📋 Current Status

✅ **Completed**:
- Project structure and configuration
- Prisma database schema
- Core utilities (OpenAI, Stripe, DB connections)
- AI prompt templates for content conversion
- TypeScript + Tailwind CSS setup

🏗️ **Still Need**:
Since you don't have Node.js installed yet, the next steps require you to:
1. Install Node.js (see below)
2. Run the setup script I've created
3. Add remaining UI components and app pages
4. Configure API keys
5. Deploy to Vercel

## 🚀 Quick Start

### Step 1: Install Prerequisites

**Install Node.js** (Required):
1. Go to https://nodejs.org/
2. Download LTS version (v20.x recommended)
3. Install and restart your terminal
4. Verify: `node --version` and `npm --version`

**Install Git** (if needed):
- macOS: `xcode-select --install` or download from https://git-scm.com
- Already have it? Check with `git --version`

### Step 2: Install Dependencies

```bash
cd /Users/emili/Documents/Test/linkedin-repurposer
npm install
```

This will install all packages from `package.json`.

### Step 3: Complete the Code

The project foundation is ready, but you'll need to add:

1. **Remaining UI Components** (~20 files)
   - All shadcn/ui components (card, input, textarea, tabs, dialog, etc.)
   - Custom components (ConversionForm, OutputDisplay, PricingTable, etc.)

2. **App Pages** (~15 files)
   - Landing page (`app/page.tsx`)
   - Dashboard pages (`app/(dashboard)/...`)
   - API routes (`app/api/...`)
   - Auth pages (using Clerk)

3. **API Routes** (~5 files)
   - `/api/convert` - Main AI conversion endpoint
   - `/api/webhooks/stripe` - Payment webhooks
   - `/api/usage` - Check user limits
   - etc.

### Step 4: Set Up Environment Variables

Create `.env.local` file:

```env
# Database (get from Vercel after deploying)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Clerk (sign up at clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# OpenAI (platform.openai.com)
OPENAI_API_KEY=sk-...

# Stripe (stripe.com)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs (create in Stripe dashboard)
STRIPE_PRICE_ID_STARTER=price_...
STRIPE_PRICE_ID_PROFESSIONAL=price_...
STRIPE_PRICE_ID_AGENCY=price_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 5: Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## 📁 Project Structure

```
linkedin-repurposer/
├── app/                          # Next.js 14 App Router
│   ├── (auth)/                   # Auth pages (to be added)
│   ├── (dashboard)/              # Dashboard pages (to be added)
│   ├── api/                      # API routes (to be added)
│   ├── layout.tsx                # (to be added)
│   └── page.tsx                  # Landing page (to be added)
│
├── components/                   # React components
│   ├── ui/                       # shadcn components (partial)
│   │   └── button.tsx            # ✅ Created
│   ├── ConversionForm.tsx        # (to be added)
│   ├── OutputDisplay.tsx         # (to be added)
│   └── PricingTable.tsx          # (to be added)
│
├── lib/                          # Utilities
│   ├── db.ts                     # ✅ Prisma client
│   ├── openai.ts                 # ✅ OpenAI setup
│   ├── stripe.ts                 # ✅ Stripe setup
│   ├── prompts.ts                # ✅ AI prompts
│   └── utils.ts                  # ✅ Helper functions
│
├── prisma/
│   └── schema.prisma             # ✅ Database schema
│
├── public/                       # Static assets (to be added)
│
├── Configuration Files:
├── package.json                  # ✅ Dependencies
├── tsconfig.json                 # ✅ TypeScript config
├── tailwind.config.ts            # ✅ Tailwind config
├── next.config.js                # ✅ Next.js config
├── postcss.config.js             # ✅ PostCSS config
├── .eslintrc.json                # ✅ ESLint config
├── .gitignore                    # ✅ Git ignore
│
└── Documentation:
    ├── README.md                 # ✅ This file
    └── SETUP-FIRST.md            # ✅ Detailed setup guide
```

## 🏗️ What I've Built So Far

### 1. Database Schema (`prisma/schema.prisma`)
- **User Model**: Clerk ID, email, subscription info, usage tracking, referrals
- **Conversion Model**: Original content + AI-generated outputs (Twitter/Blog/Newsletter)
- **ReferralReward Model**: Track referral program

### 2. Core Libraries (`lib/`)
- **db.ts**: Prisma client singleton
- **openai.ts**: OpenAI API client configuration
- **stripe.ts**: Stripe client + subscription tier limits
- **prompts.ts**: 3 comprehensive AI prompts for each content type
  - Twitter: 8-12 tweet threads with hooks and emojis
  - Blog: 1000-1200 word articles with SEO structure
  - Newsletter: 600-800 word conversational sections
- **utils.ts**: Helper functions (date formatting, clipboard, downloads, etc.)

### 3. Configuration
- TypeScript with strict mode
- Tailwind CSS with custom theme
- Next.js 14 App Router
- ESLint for code quality
- PostCSS for CSS processing

## 🔑 Required API Keys

You'll need to sign up for these services (all have free tiers):

1. **Clerk** (clerk.com)
   - Free up to 10,000 monthly active users
   - Provides: Authentication, user management
   - Cost after free tier: $25/month

2. **OpenAI** (platform.openai.com)
   - Pay-as-you-go ($10 per 1M tokens)
   - Add $5 to start
   - Expected cost: $30-50/month at scale

3. **Stripe** (stripe.com)
   - Free to sign up
   - 2.9% + $0.30 per transaction
   - No monthly fees

4. **Vercel** (vercel.com)
   - Free hobby plan available
   - Pro plan ($20/month) recommended for production
   - Includes hosting + Postgres database

## 💰 Revenue Model

| Tier | Price | Conversions | Target Customers |
|------|-------|-------------|------------------|
| Free | $0 | 5/month | Trial users |
| Starter | $29/month | 50/month | Hobbyist creators |
| Professional | $79/month | 200/month | Serious creators |
| Agency | $199/month | 1000/month | Agencies |

**To hit $300/month goal:**
- Need 10-11 customers at $29/month, OR
- 4 customers at $79/month, OR
- 2 customers at $199/month

## 🎨 Features to Complete

### Essential (MVP - Week 1):
- [ ] All UI components (card, input, textarea, tabs, etc.)
- [ ] Landing page with pricing
- [ ] Sign-in/sign-up pages (Clerk integration)
- [ ] Dashboard with conversion form
- [ ] AI conversion API endpoint
- [ ] Output display with copy/download
- [ ] Stripe checkout integration
- [ ] Stripe webhook handler
- [ ] Usage limit enforcement

### Nice-to-Have (Week 2):
- [ ] Conversion history page
- [ ] Analytics dashboard
- [ ] Account settings page
- [ ] Referral system
- [ ] Email templates
- [ ] FAQ page
- [ ] Mobile responsive design

## 🚢 Deployment

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Initialize and deploy
vercel

# Add environment variables in Vercel dashboard
# Set up Postgres database
# Configure Stripe webhook
```

### Option 2: Manual Deploy

See `SETUP-FIRST.md` for detailed step-by-step instructions.

## 📊 Monitoring

Once deployed, monitor:
- **Vercel Analytics**: Traffic and performance
- **Stripe Dashboard**: Revenue and subscriptions
- **OpenAI Dashboard**: API usage and costs
- **Clerk Dashboard**: User signups and auth

## 🎯 Marketing Plan (5 hours/week)

**Monday** (1 hour):
- Review Vercel Analytics
- Check Stripe MRR
- Screenshot growth metrics

**Tuesday-Thursday** (3 hours):
- LinkedIn: Comment on creator posts, DM tool offer
- Twitter: Post before/after examples
- Reddit: Share in r/SaaS, r/Entrepreneur

**Friday** (1 hour):
- Answer support emails
- Update FAQ based on questions
- Check system health

## 📈 Success Metrics

**Week 2**: 50+ visitors, 20+ signups, 3+ paying customers
**Month 1**: 200+ visitors, 100+ signups, 10+ paying ($300+ MRR) ✅ GOAL
**Month 3**: 1000+ visitors, 500+ signups, 30+ paying ($1000+ MRR)

## 🐛 Troubleshooting

See `SETUP-FIRST.md` for common issues and solutions.

## 📝 Next Steps for You

1. ✅ Read this README
2. ⏳ Install Node.js (if not done)
3. ⏳ Run `npm install`
4. ⏳ Ask me to complete the remaining code files
5. ⏳ Set up API keys (.env.local)
6. ⏳ Run `npm run dev` to test locally
7. ⏳ Deploy to Vercel
8. ⏳ Start marketing!

## 🤝 Support

The full implementation plan is in `/Users/emili/.claude/plans/jiggly-herding-badger.md`

Let me know when you're ready for me to create the remaining ~40 files needed to complete the application!

---

**Built with**: Next.js 14, TypeScript, Tailwind CSS, Prisma, Clerk, Stripe, OpenAI
**Target**: $300+/month passive income
**Time Investment**: 5 hours/week after launch
