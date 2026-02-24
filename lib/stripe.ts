import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
})

// Subscription tier limits
export const TIER_LIMITS = {
  free: 5,
  starter: 50,
  professional: 200,
  agency: 1000,
} as const

export type SubscriptionTier = keyof typeof TIER_LIMITS
