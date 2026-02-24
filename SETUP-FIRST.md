# LinkedIn Content Repurposer - Setup Guide

## Prerequisites Installation (DO THIS FIRST)

Before you can run the application, you need to install Node.js:

### Install Node.js

1. Visit https://nodejs.org/
2. Download the **LTS version** (recommended, currently v20.x)
3. Run the installer
4. After installation, verify by opening a new terminal and running:
   ```bash
   node --version
   npm --version
   ```
   You should see version numbers (e.g., v20.11.0 and 10.2.4)

### Install Git (if not already installed)

1. Visit https://git-scm.com/downloads
2. Download and install for your operating system
3. Verify installation:
   ```bash
   git --version
   ```

## Quick Start After Prerequisites

Once Node.js and Git are installed, follow these steps:

### Option 1: Automatic Setup (Recommended)

```bash
cd /Users/emili/Documents/Test/linkedin-repurposer
./setup-and-deploy.sh
```

The script will:
- Install all dependencies
- Guide you through API key setup
- Initialize the database
- Set up environment variables
- Optionally deploy to Vercel

### Option 2: Manual Setup

If you prefer to understand each step:

#### 1. Install Dependencies

```bash
cd /Users/emili/Documents/Test/linkedin-repurposer
npm install
```

#### 2. Set Up API Keys

You'll need accounts and API keys from:

1. **Clerk** (Authentication) - https://clerk.com
   - Sign up for free account
   - Create a new application
   - Copy publishable key and secret key

2. **OpenAI** (AI Processing) - https://platform.openai.com
   - Sign up and add $5 credit
   - Go to API keys section
   - Create new secret key

3. **Stripe** (Payments) - https://stripe.com
   - Sign up for account
   - Go to Developers > API keys
   - Copy secret key (test mode to start)

4. **Vercel** (Optional, for deployment) - https://vercel.com
   - Sign up with GitHub
   - Install Vercel CLI: `npm i -g vercel`

#### 3. Create Environment Variables

Create a file named `.env.local` in the project root:

```env
# Database (will be set up after deploying to Vercel)
DATABASE_URL="postgresql://..."

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# OpenAI
OPENAI_API_KEY=sk-...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Stripe Price IDs (create these in Stripe dashboard)
STRIPE_PRICE_ID_STARTER=price_...
STRIPE_PRICE_ID_PROFESSIONAL=price_...
STRIPE_PRICE_ID_AGENCY=price_...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### 4. Set Up Stripe Products

Go to Stripe Dashboard > Products and create:

1. **Starter Plan**
   - Name: Starter
   - Price: $29/month (recurring)
   - Copy the Price ID to `.env.local`

2. **Professional Plan**
   - Name: Professional
   - Price: $79/month (recurring)
   - Copy the Price ID

3. **Agency Plan**
   - Name: Agency
   - Price: $199/month (recurring)
   - Copy the Price ID

#### 5. Run Database Migrations (After Deploying)

After deploying to Vercel and getting DATABASE_URL:

```bash
npx prisma generate
npx prisma db push
```

#### 6. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 to see the app!

## Deployment to Vercel

### Using the Automated Script

```bash
./deploy-to-vercel.sh
```

### Manual Deployment

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Initialize Git repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Follow the prompts:
   - Link to existing project? No
   - Project name: linkedin-repurposer
   - Directory: ./ (current directory)
   - Override settings? No

5. Add environment variables in Vercel dashboard:
   - Go to your project settings
   - Navigate to Environment Variables
   - Add all variables from `.env.local`

6. Set up Vercel Postgres:
   - In Vercel project, go to Storage
   - Create new Postgres database
   - Copy DATABASE_URL to environment variables

7. Run migrations:
   ```bash
   vercel env pull .env.local
   npx prisma generate
   npx prisma db push
   ```

8. Redeploy:
   ```bash
   vercel --prod
   ```

## Post-Deployment Setup

### Configure Stripe Webhook

1. Go to Stripe Dashboard > Developers > Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://your-app.vercel.app/api/webhooks/stripe`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
   - `invoice.payment_succeeded`
5. Copy the webhook signing secret
6. Add to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`
7. Redeploy

### Update Clerk Redirect URLs

1. Go to Clerk Dashboard > Your App > Paths
2. Add your production URL to allowed redirect URLs:
   - `https://your-app.vercel.app`

### Test the Application

1. Visit your deployed URL
2. Sign up for an account
3. Try converting a LinkedIn post
4. Test the payment flow (use Stripe test cards)
5. Verify webhook events in Stripe dashboard

## Troubleshooting

### "Command not found: npm"
- Node.js is not installed or not in PATH
- Reinstall Node.js and restart terminal

### "Cannot find module 'prisma'"
- Run `npm install` in project directory

### "Clerk publishable key is invalid"
- Check that you copied the full key
- Ensure no extra spaces in .env.local
- Restart dev server after changing .env.local

### "OpenAI API error: Invalid API key"
- Verify key starts with `sk-`
- Check that you have credits in your OpenAI account
- Generate a new key if needed

### "Stripe webhook signature verification failed"
- Ensure `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
- Check that webhook endpoint URL is correct
- Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

### Database connection errors
- Ensure `DATABASE_URL` is set correctly
- Run `npx prisma generate` after changing schema
- Check Vercel Postgres is active

## Next Steps After Setup

1. **Customize Branding**
   - Update logo in `/public`
   - Modify colors in `tailwind.config.ts`
   - Update meta tags in `app/layout.tsx`

2. **Test Everything**
   - Follow `/tests/manual-checklist.md`
   - Use Stripe test mode
   - Test all subscription tiers

3. **Launch Marketing**
   - Post on Product Hunt
   - Share on LinkedIn
   - Tweet about it
   - See plan document for full marketing strategy

4. **Monitor**
   - Check Vercel Analytics daily
   - Watch Stripe dashboard for signups
   - Review Sentry for errors

## Support

If you run into issues:
1. Check this guide first
2. Review error messages carefully
3. Google the specific error
4. Check official docs:
   - Next.js: https://nextjs.org/docs
   - Clerk: https://clerk.com/docs
   - Stripe: https://stripe.com/docs
   - Vercel: https://vercel.com/docs
   - Prisma: https://www.prisma.io/docs

## Costs Breakdown

- **Vercel Pro**: $20/month (required for serverless functions)
- **Vercel Postgres**: $0-20/month (free for <1GB)
- **Clerk**: $25/month (up to 1000 MAU)
- **OpenAI API**: ~$30-50/month (varies with usage)
- **Stripe**: 2.9% + $0.30 per transaction (no monthly fee)
- **Domain**: ~$12/year (optional)

**Total**: $75-115/month

## Weekly Maintenance (5 hours)

- **Monday** (1hr): Check analytics and revenue
- **Tue-Thu** (3hrs): LinkedIn/Twitter outreach for customers
- **Friday** (1hr): Answer support emails, check system health

You're all set! Follow the setup steps above and you'll have a working micro-SaaS in under an hour.
