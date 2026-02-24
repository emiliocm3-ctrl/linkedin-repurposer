# Quick Start Guide - Get Your SaaS Running in Under 1 Hour

This guide walks you through getting the LinkedIn Content Repurposer up and running from scratch.

## ⏱️ Time Estimate
- **Prerequisites**: 15 minutes
- **Setup**: 20 minutes
- **First Test**: 10 minutes
- **Deploy**: 15 minutes
- **Total**: ~1 hour

---

## Step 1: Install Node.js (5 minutes)

**If you already have Node.js installed, skip to Step 2.**

1. Go to **https://nodejs.org/**
2. Download the **LTS version** (green button, currently v20.x)
3. Run the installer, click through all defaults
4. Open a new terminal/command prompt
5. Verify installation:
   ```bash
   node --version
   # Should show: v20.x.x

   npm --version
   # Should show: 10.x.x
   ```

---

## Step 2: Get API Keys (10 minutes)

You need 3 free accounts. Open these in separate tabs:

### 2.1 Clerk (Authentication)
1. Go to **https://clerk.com**
2. Sign up (free tier: 10,000 users/month)
3. Create a new application → Choose "Next.js"
4. Copy these keys (you'll paste them soon):
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### 2.2 OpenAI (AI Processing)
1. Go to **https://platform.openai.com**
2. Sign up and verify email
3. Add $5 credit (Billing → Add payment method)
4. Go to API Keys → Create new secret key
5. Copy the key (starts with `sk-...`)
   - **Important**: You only see this once!

### 2.3 Stripe (Payments)
1. Go to **https://stripe.com**
2. Sign up (free forever, only pay transaction fees)
3. Skip the onboarding questionnaire
4. You should be in **Test mode** (toggle in top-right)
5. Go to Developers → API keys
6. Copy these:
   - **Secret key** (starts with `sk_test_`)
   - **Publishable key** (starts with `pk_test_`)

---

## Step 3: Run the Setup Script (5 minutes)

Open terminal and run:

```bash
cd /Users/emili/Documents/Test/linkedin-repurposer
./setup-and-deploy.sh
```

The script will:
1. Install all dependencies (~2 minutes)
2. Ask for your API keys
3. Create `.env.local` with your keys
4. Optionally start the dev server

**When prompted, paste the keys you copied in Step 2.**

---

## Step 4: Create Stripe Products (5 minutes)

The app needs 3 subscription products in Stripe:

1. In Stripe Dashboard, go to **Products** → **Add product**

2. Create 3 products:

   **Product 1: Starter**
   - Name: `Starter`
   - Description: `50 conversions/month`
   - Pricing: `$29/month` (recurring)
   - Click **Save product**
   - **Copy the Price ID** (starts with `price_...`)

   **Product 2: Professional**
   - Name: `Professional`
   - Description: `200 conversions/month`
   - Pricing: `$79/month` (recurring)
   - Click **Save product**
   - **Copy the Price ID**

   **Product 3: Agency**
   - Name: `Agency`
   - Description: `1000 conversions/month`
   - Pricing: `$199/month` (recurring)
   - Click **Save product**
   - **Copy the Price ID**

3. Update `.env.local` with the Price IDs:
   ```env
   STRIPE_PRICE_ID_STARTER=price_xxxxx
   STRIPE_PRICE_ID_PROFESSIONAL=price_xxxxx
   STRIPE_PRICE_ID_AGENCY=price_xxxxx
   ```

---

## Step 5: Deploy to Vercel (15 minutes)

### 5.1 Install Vercel CLI
```bash
npm install -g vercel
```

### 5.2 Initialize Git
```bash
git init
git add .
git commit -m "Initial commit"
```

### 5.3 Deploy
```bash
vercel
```

Answer the prompts:
- Set up and deploy? **Yes**
- Which scope? Choose your account
- Link to existing project? **No**
- Project name? Press Enter (uses `linkedin-repurposer`)
- Directory? Press Enter (uses current)
- Override settings? **No**

Wait ~2 minutes for deployment.

### 5.4 Set Up Postgres Database

1. Go to your project in Vercel dashboard (URL shown after deploy)
2. Click **Storage** tab
3. Click **Create Database** → **Postgres**
4. Name it `linkedin-repurposer-db`
5. Click **Create**
6. Go to `.env.local` tab
7. Copy `DATABASE_URL` and `POSTGRES_URL_NON_POOLING`
8. Go back to terminal

### 5.5 Add Environment Variables to Vercel

```bash
# Connect to your Vercel project
vercel link

# Add all environment variables
vercel env add DATABASE_URL
# Paste the DATABASE_URL from Vercel dashboard

vercel env add DIRECT_URL
# Paste the POSTGRES_URL_NON_POOLING from Vercel dashboard

vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
# Paste your Clerk publishable key

vercel env add CLERK_SECRET_KEY
# Paste your Clerk secret key

# Continue for all other variables from your .env.local file
# (OPENAI_API_KEY, STRIPE keys, STRIPE_PRICE_IDs, etc.)
```

Or add them via the Vercel Dashboard:
1. Go to your project settings → Environment Variables
2. Add each variable from `.env.local`

### 5.6 Set Up Database Schema

```bash
# Pull environment variables
vercel env pull .env.local

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push
```

### 5.7 Deploy Production

```bash
vercel --prod
```

Your app is now live! Copy the production URL (e.g., `https://linkedin-repurposer.vercel.app`)

---

## Step 6: Configure Webhooks (5 minutes)

### 6.1 Stripe Webhook

1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://your-app.vercel.app/api/webhooks/stripe`
   - Replace `your-app` with your actual Vercel URL
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)
7. Add to Vercel environment variables:
   ```bash
   vercel env add STRIPE_WEBHOOK_SECRET production
   # Paste the signing secret
   ```
8. Redeploy:
   ```bash
   vercel --prod
   ```

### 6.2 Update Clerk Redirect URLs

1. Go to Clerk Dashboard → Your application
2. Go to **Paths** (under Configure)
3. Add your production URL to allowed redirect URLs
4. Save changes

---

## Step 7: Test Everything (10 minutes)

### 7.1 Visit Your Live Site

Go to `https://your-app.vercel.app`

- [ ] Landing page loads
- [ ] Click "Get Started"
- [ ] Sign up with your email
- [ ] Redirects to `/dashboard`

### 7.2 Create a Conversion

1. Paste this sample LinkedIn post:
   ```
   Just shipped a new feature that our users have been requesting for months.

   The process taught me three key lessons:
   1. Listen to feedback, but validate with data
   2. Prototype quickly, perfect slowly
   3. Ship early, iterate often

   What's your approach to building features users actually want?
   ```

2. Select tone: **Professional**
3. Select industry: **Tech**
4. Click **Convert to All Formats**
5. Wait 10-30 seconds
6. Results appear!
   - [ ] Twitter thread (8-12 tweets)
   - [ ] Blog post (~1000 words)
   - [ ] Newsletter (~600 words)

### 7.3 Test Payment Flow

1. Click pricing card for **Starter** plan
2. Use test card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits
3. Complete checkout
4. Redirected back to dashboard
5. Usage should update to "Starter" plan

---

## Step 8: Start Marketing! (Ongoing)

Your app is live! Now get customers:

### Week 1-2: Soft Launch
- [ ] Post on Twitter/LinkedIn about building in public
- [ ] Share with 10 creator friends for feedback
- [ ] Join /r/SideProject and share
- [ ] Get first 3 paying customers

### Week 3-4: Product Hunt Launch
- [ ] Prepare PH launch (Tuesday-Thursday ideal)
- [ ] Create demo video/GIFs
- [ ] Write compelling description
- [ ] Ask friends to upvote on launch day
- [ ] Goal: 20-50 signups, 5-10 paying customers

### Ongoing (5 hours/week):
- **Monday** (1 hour): Check analytics, revenue
- **Tue-Thu** (3 hours): LinkedIn/Twitter outreach
  - Comment on creators' posts
  - DM tool to interested people
  - Share before/after examples
- **Friday** (1 hour): Answer support emails, fix bugs

---

## Success Metrics

### Week 2:
- [ ] 50+ visitors
- [ ] 20+ signups
- [ ] 3+ paying customers ($90-240 MRR)

### Month 1:
- [ ] 200+ visitors
- [ ] 100+ signups
- [ ] **10+ paying customers ($300+ MRR)** ✅ **GOAL MET**

### Month 3:
- [ ] 1000+ visitors
- [ ] 500+ signups
- [ ] 30+ paying customers ($1000+ MRR)

---

## Troubleshooting

### "npm: command not found"
→ Node.js not installed correctly. Reinstall and restart terminal.

### "Prisma Client did not initialize"
→ Run `npx prisma generate`

### "Invalid OpenAI API key"
→ Check key starts with `sk-` and you have $5+ credit

### "Stripe webhook failed"
→ Verify webhook URL is correct and secret matches

### "Cannot access dashboard"
→ Check Clerk keys are correct, restart dev server

### Conversions fail
→ Check OpenAI API key, verify you have credits

---

## Costs Breakdown

**Monthly Operating Costs:**
- Vercel Pro: $20 (required for serverless functions)
- Vercel Postgres: $0-20 (free for <1GB)
- Clerk: $25 (after 10K free users)
- OpenAI API: $30-50 (varies with usage)
- Stripe: 2.9% + $0.30 per transaction

**Total: $75-115/month**

**To be profitable at $300/month MRR:**
- Profit = $300 - $100 (costs) = $200/month
- Need just 10-15 customers!

---

## Next Steps

Now that you're live:

1. **Monitor**: Check Vercel analytics daily
2. **Support**: Reply to emails within 24 hours
3. **Iterate**: Add features users request
4. **Market**: Spend 5 hours/week acquiring customers
5. **Scale**: Once at $300/month, consider:
   - Adding more output formats
   - Batch conversion feature
   - API access for agencies
   - White-label options

---

## Resources

- **Vercel Docs**: https://vercel.com/docs
- **Clerk Docs**: https://clerk.com/docs
- **Stripe Docs**: https://stripe.com/docs
- **OpenAI Docs**: https://platform.openai.com/docs
- **Next.js Docs**: https://nextjs.org/docs

- **Your Plan**: `/Users/emili/.claude/plans/jiggly-herding-badger.md`
- **Testing Checklist**: `/tests/manual-checklist.md`
- **Full README**: `/README.md`

---

**You're all set! Good luck with your micro-SaaS! 🚀**

Questions? Check the docs above or review the detailed plan file.
