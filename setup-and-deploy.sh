#!/bin/bash

# LinkedIn Content Repurposer - Setup and Deploy Script
# This script helps you set up the project and optionally deploy to Vercel

set -e  # Exit on error

echo "🚀 LinkedIn Content Repurposer - Setup Wizard"
echo "=============================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed."
    echo "Please install Node.js from https://nodejs.org/"
    echo "Download the LTS version (v20.x recommended)"
    exit 1
fi

echo "✅ Node.js detected: $(node --version)"
echo "✅ npm detected: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists. Skipping environment setup."
    echo "If you want to reconfigure, delete .env.local and run this script again."
else
    echo "🔐 Environment Variable Setup"
    echo "You'll need API keys from:"
    echo "  1. Clerk (https://clerk.com) - Authentication"
    echo "  2. OpenAI (https://platform.openai.com) - AI processing"
    echo "  3. Stripe (https://stripe.com) - Payments"
    echo ""

    read -p "Do you have all API keys ready? (y/n): " has_keys

    if [ "$has_keys" = "y" ]; then
        echo ""
        echo "Please enter your API keys:"
        echo ""

        read -p "Clerk Publishable Key: " clerk_pub
        read -p "Clerk Secret Key: " clerk_secret
        read -p "OpenAI API Key: " openai_key
        read -p "Stripe Secret Key: " stripe_secret
        read -p "Stripe Publishable Key: " stripe_pub

        # Create .env.local
        cat > .env.local << EOF
# Database (will be set after Vercel deployment)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$clerk_pub
CLERK_SECRET_KEY=$clerk_secret
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# OpenAI
OPENAI_API_KEY=$openai_key

# Stripe
STRIPE_SECRET_KEY=$stripe_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$stripe_pub
STRIPE_WEBHOOK_SECRET=whsec_placeholder

# Stripe Price IDs (you'll need to create these in Stripe Dashboard)
STRIPE_PRICE_ID_STARTER=price_placeholder
STRIPE_PRICE_ID_PROFESSIONAL=price_placeholder
STRIPE_PRICE_ID_AGENCY=price_placeholder

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF

        echo "✅ .env.local created"
        echo ""
        echo "⚠️  Important next steps:"
        echo "1. Create products in Stripe Dashboard and update price IDs in .env.local"
        echo "2. After deploying to Vercel, update DATABASE_URL and DIRECT_URL"
        echo "3. Configure Stripe webhook and update STRIPE_WEBHOOK_SECRET"
    else
        echo ""
        echo "Please sign up for the required services first:"
        echo "1. Clerk: https://clerk.com (Free tier available)"
        echo "2. OpenAI: https://platform.openai.com (Add $5 credit)"
        echo "3. Stripe: https://stripe.com (Free to start)"
        echo ""
        echo "Then run this script again."
        exit 0
    fi
fi

echo ""
echo "🎨 Project setup complete!"
echo ""

# Ask about running dev server
read -p "Would you like to start the development server now? (y/n): " start_dev

if [ "$start_dev" = "y" ]; then
    echo ""
    echo "Starting development server..."
    echo "Open http://localhost:3000 in your browser"
    echo ""
    npm run dev
else
    echo ""
    echo "✅ Setup complete! Next steps:"
    echo ""
    echo "1. Start development server:"
    echo "   npm run dev"
    echo ""
    echo "2. Open http://localhost:3000 in your browser"
    echo ""
    echo "3. When ready to deploy:"
    echo "   - Install Vercel CLI: npm i -g vercel"
    echo "   - Run: vercel"
    echo "   - Follow prompts to deploy"
    echo ""
    echo "4. After deployment:"
    echo "   - Set up Vercel Postgres in your project"
    echo "   - Add environment variables in Vercel dashboard"
    echo "   - Run: npx prisma db push"
    echo "   - Configure Stripe webhook with your production URL"
    echo ""
    echo "See README.md and SETUP-FIRST.md for detailed instructions."
fi
