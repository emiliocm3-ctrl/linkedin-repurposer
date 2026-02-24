# Manual Testing Checklist

Complete this checklist before launching to ensure everything works correctly.

## Pre-Launch Setup

### API Keys Configuration
- [ ] Clerk account created and keys added to `.env.local`
- [ ] OpenAI account created with $5+ credit, API key added
- [ ] Stripe account created and keys added (test mode)
- [ ] Stripe products created (Starter, Professional, Agency)
- [ ] Stripe price IDs added to `.env.local`
- [ ] Vercel account created

### Database Setup
- [ ] Vercel Postgres database created
- [ ] DATABASE_URL and DIRECT_URL added to `.env.local`
- [ ] Ran `npx prisma generate`
- [ ] Ran `npx prisma db push` successfully
- [ ] Database tables created (User, Conversion, ReferralReward)

---

## Landing Page Tests

### Visual & Layout
- [ ] Landing page loads at http://localhost:3000
- [ ] Hero section displays correctly
- [ ] All links work (Pricing, Sign In, Get Started)
- [ ] Features section shows 3 cards
- [ ] How It Works section displays 3 steps
- [ ] Pricing table shows 4 tiers (Free, Starter, Pro, Agency)
- [ ] FAQ section displays all questions
- [ ] Footer links present
- [ ] Mobile responsive (test on phone or resize browser)

### Navigation
- [ ] "Sign In" button redirects to /sign-in
- [ ] "Get Started" button redirects to /sign-up
- [ ] Pricing card CTAs work
- [ ] Smooth scroll to #pricing and #how-it-works

---

## Authentication Tests

### Sign Up Flow
- [ ] Navigate to /sign-up
- [ ] Clerk sign-up form displays
- [ ] Can create account with email + password
- [ ] Email verification works (if enabled)
- [ ] After sign-up, redirects to /dashboard
- [ ] User record created in database (check with Prisma Studio: `npx prisma studio`)

### Sign In Flow
- [ ] Navigate to /sign-in
- [ ] Clerk sign-in form displays
- [ ] Can log in with test account
- [ ] Incorrect password shows error
- [ ] After sign-in, redirects to /dashboard

### Sign Out
- [ ] Click UserButton in dashboard header
- [ ] "Sign out" option visible
- [ ] Signing out redirects to homepage
- [ ] Cannot access /dashboard when signed out (redirects to /sign-in)

---

## Dashboard Tests

### Initial State
- [ ] Dashboard loads for authenticated user
- [ ] Welcome message shows user's first name
- [ ] ConversionForm displays with textarea, dropdowns, submit button
- [ ] OutputDisplay shows "No conversions yet" placeholder
- [ ] Usage card shows "5 / 5" conversions remaining
- [ ] Progress bar at 0%

### Conversion Flow (Critical Path)
- [ ] Paste LinkedIn post content (100-500 words) into textarea
- [ ] Character counter updates correctly
- [ ] Select tone (Professional, Casual, or Witty)
- [ ] Select industry (General, Tech, Marketing, Finance, or Sales)
- [ ] Click "Convert to All Formats"
- [ ] Loading spinner appears
- [ ] After 10-30 seconds, results appear in OutputDisplay
- [ ] Three tabs visible: Twitter Thread, Blog Post, Newsletter
- [ ] Twitter thread is 8-12 tweets with emojis
- [ ] Blog post is ~1000 words with markdown formatting
- [ ] Newsletter is ~600-800 words, conversational tone
- [ ] Usage counter decrements (now shows "4 / 5")
- [ ] Progress bar updates to 20%

### Output Actions
- [ ] Click "Copy" button on Twitter tab → Toast notification appears
- [ ] Paste into text editor → Content is copied correctly
- [ ] Click "Download" on Twitter tab → File downloads (.txt)
- [ ] Open downloaded file → Content matches display
- [ ] Repeat for Blog Post tab → Downloads as .md file
- [ ] Repeat for Newsletter tab → Downloads as .txt file
- [ ] Character count displayed for each format

### Usage Limits
- [ ] Create 5 total conversions (should use all free conversions)
- [ ] Usage shows "5 / 5"
- [ ] Progress bar at 100%
- [ ] Red warning message: "No conversions remaining"
- [ ] Try creating 6th conversion → Error message appears
- [ ] "Convert" button still clickable but shows error

---

## Payment Flow Tests (Stripe Test Mode)

### Checkout Session
- [ ] Click "Upgrade" or pricing card CTA
- [ ] Redirected to Stripe Checkout
- [ ] Form shows correct plan ($29, $79, or $199)
- [ ] Use test card: 4242 4242 4242 4242, any future expiry, any CVC
- [ ] Complete checkout successfully
- [ ] Redirected to /dashboard?success=true
- [ ] (Wait ~30 seconds for webhook to process)

### Post-Purchase
- [ ] Refresh dashboard
- [ ] Usage card shows new tier (e.g., "Starter" plan)
- [ ] Conversions limit updated (50/50 for Starter)
- [ ] Can create more conversions

### Subscription Management
- [ ] Go to /settings
- [ ] "Manage Subscription" button visible
- [ ] Click button → Opens Stripe Customer Portal
- [ ] Can view billing history
- [ ] Can update payment method
- [ ] Can cancel subscription (test carefully - resets to free tier)

---

## Navigation & Other Pages

### Dashboard Navigation
- [ ] Click "Dashboard" → Goes to /dashboard
- [ ] Click "History" → Goes to /history
- [ ] Click "Analytics" → Goes to /analytics
- [ ] Click "Settings" → Goes to /settings
- [ ] All pages load without errors

### History Page
- [ ] Shows "No conversions yet" if none exist
- [ ] After creating conversions, displays list
- [ ] Each item shows: original content snippet, date, tone, industry
- [ ] "View" button present (functionality placeholder for now)

### Analytics Page
- [ ] Stats cards display (Total Conversions, Most Popular Format, Average/Week)
- [ ] Chart placeholder visible
- [ ] No JavaScript errors in console

### Settings Page
- [ ] Account info displays (email, name from Clerk)
- [ ] Current plan shown (Free, Starter, etc.)
- [ ] Pricing table visible for upgrades

---

## API Endpoint Tests

### `/api/convert` (POST)
- [ ] Authenticated request succeeds
- [ ] Unauthenticated request returns 401
- [ ] Empty content returns 400 error
- [ ] Content >3000 chars returns 400 error
- [ ] Successful conversion returns all 3 formats
- [ ] Database saves conversion record
- [ ] User's conversionsUsed increments
- [ ] Returns conversionsRemaining

### `/api/usage` (GET)
- [ ] Authenticated request succeeds
- [ ] Returns conversionsUsed, conversionsLimit, conversionsRemaining, tier
- [ ] Unauthenticated returns 401

### `/api/checkout` (POST)
- [ ] Creates Stripe checkout session
- [ ] Returns session URL
- [ ] Metadata includes userId

### `/api/webhooks/stripe` (POST)
- [ ] Webhook signature verification works
- [ ] `checkout.session.completed` → Updates user subscription
- [ ] `customer.subscription.updated` → Updates tier
- [ ] `customer.subscription.deleted` → Downgrades to free
- [ ] `invoice.payment_succeeded` → Resets monthly usage
- [ ] `invoice.payment_failed` → Marks subscription past_due

---

## Error Handling

### OpenAI API Errors
- [ ] Temporarily use invalid OpenAI API key
- [ ] Try conversion → Graceful error message shown
- [ ] User not charged a conversion
- [ ] Console shows helpful error log

### Network Errors
- [ ] Disconnect internet
- [ ] Try conversion → "Failed to fetch" error
- [ ] Reconnect → Can retry successfully

### Form Validation
- [ ] Submit empty form → Error toast appears
- [ ] Paste 3001 character content → Cannot submit or shows error
- [ ] Select different tones/industries → Form state updates

---

## Browser Compatibility

Test on multiple browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest, if on Mac)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

---

## Performance

### Page Load Times
- [ ] Landing page loads in <2 seconds
- [ ] Dashboard loads in <3 seconds
- [ ] No console errors on any page
- [ ] No layout shift (CLS) issues

### Conversion Speed
- [ ] AI conversion completes in 10-30 seconds
- [ ] Loading spinner shows during generation
- [ ] No UI freezing

---

## Database Checks

Using Prisma Studio (`npx prisma studio`):

### User Table
- [ ] New users have clerkId, email
- [ ] Default subscriptionTier is "free"
- [ ] Default conversionsLimit is 5
- [ ] conversionsUsed increments after conversion
- [ ] Stripe customer ID populated after checkout

### Conversion Table
- [ ] Each conversion has all fields populated
- [ ] originalContent, twitterThread, blogPost, newsletter saved
- [ ] Timestamps (createdAt) accurate
- [ ] userId foreign key links to User

---

## Stripe Dashboard Verification

In Stripe Dashboard (test mode):

### Products
- [ ] Three products exist: Starter ($29), Professional ($79), Agency ($199)
- [ ] Each has a monthly recurring price
- [ ] Price IDs match `.env.local`

### Webhooks
- [ ] Webhook endpoint created (will be production URL after deploy)
- [ ] Events listening: checkout.session.completed, customer.subscription.*, invoice.*
- [ ] Webhook secret matches STRIPE_WEBHOOK_SECRET

### Test Payment
- [ ] Payment intent created after test checkout
- [ ] Subscription created
- [ ] Customer record created
- [ ] Invoice generated

---

## Pre-Deployment Checklist

Before deploying to Vercel:

### Code Quality
- [ ] No TypeScript errors: `npm run build`
- [ ] No ESLint errors (if configured)
- [ ] All console.log statements removed or converted to proper logging
- [ ] No hardcoded secrets in code

### Environment Variables
- [ ] .env.local is in .gitignore
- [ ] .env.example is up-to-date
- [ ] All required variables documented

### Documentation
- [ ] README.md is accurate
- [ ] SETUP-FIRST.md has deployment instructions
- [ ] API endpoints documented (if needed)

---

## Post-Deployment Checks

After deploying to Vercel:

### Vercel Configuration
- [ ] Environment variables added to Vercel project
- [ ] Vercel Postgres database created and connected
- [ ] DATABASE_URL environment variable set
- [ ] `npx prisma db push` run in production (via Vercel CLI or deployment)

### Production URLs
- [ ] Landing page loads at production URL
- [ ] Can sign up for new account
- [ ] Can create conversions
- [ ] Stripe checkout works with production URL

### Stripe Webhook (Production)
- [ ] Webhook endpoint updated to `https://your-app.vercel.app/api/webhooks/stripe`
- [ ] Webhook secret updated in Vercel environment variables
- [ ] Test checkout in production → Webhook fires successfully

### Clerk Configuration
- [ ] Production domain added to Clerk allowed redirect URLs
- [ ] Sign-in/sign-up work on production

### Monitoring
- [ ] Vercel Analytics enabled
- [ ] Sentry error tracking configured (optional)
- [ ] Stripe webhook logs show successful events

---

## Launch Checklist

Final items before public launch:

### Marketing
- [ ] Landing page copy reviewed
- [ ] Pricing finalized
- [ ] FAQ answers accurate
- [ ] Social media graphics prepared
- [ ] Product Hunt launch scheduled

### Legal
- [ ] Privacy Policy page created (or link to template)
- [ ] Terms of Service page created (or link to template)
- [ ] Stripe terms acknowledgment

### Support
- [ ] Support email set up
- [ ] FAQ comprehensive
- [ ] Cancellation policy clear

### Analytics
- [ ] Google Analytics or PostHog configured
- [ ] Conversion tracking set up
- [ ] Funnel tracking (signup → conversion → upgrade)

---

## Common Issues & Solutions

### "Prisma Client did not initialize"
- **Solution**: Run `npx prisma generate`

### "Invalid API Key" (OpenAI)
- **Solution**: Check OPENAI_API_KEY starts with `sk-` and has credits

### "Webhook signature failed"
- **Solution**: Ensure STRIPE_WEBHOOK_SECRET matches Stripe dashboard

### "Cannot access /dashboard" after login
- **Solution**: Check middleware.ts public routes, verify Clerk keys

### Conversions not incrementing
- **Solution**: Check database connection, verify API endpoint not erroring

### Stripe checkout fails
- **Solution**: Use test card 4242..., check price IDs match .env.local

---

## Success Criteria

Before considering the app "production ready":

- [ ] Created 10+ test conversions successfully
- [ ] Completed full checkout flow 3+ times (each tier)
- [ ] Tested on 3+ browsers
- [ ] Zero critical console errors
- [ ] All API endpoints return correct responses
- [ ] Database schema matches Prisma schema
- [ ] Webhooks processing successfully
- [ ] No broken links or 404 pages
- [ ] Mobile experience polished
- [ ] Loading states feel smooth

---

**Testing completed by:** _______________
**Date:** _______________
**Environment:** Local / Staging / Production
**Status:** PASS / FAIL / NEEDS FIXES

**Notes:**
