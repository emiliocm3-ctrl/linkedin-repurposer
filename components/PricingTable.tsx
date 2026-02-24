'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'

interface PricingTier {
  name: string
  price: string
  description: string
  features: string[]
  cta: string
  popular?: boolean
  priceId?: string
}

const tiers: PricingTier[] = [
  {
    name: 'Free',
    price: '$0',
    description: 'Try it out',
    features: [
      '5 conversions/month',
      '3 output formats',
      'Basic templates',
      'Email support',
    ],
    cta: 'Get Started',
  },
  {
    name: 'Starter',
    price: '$29',
    description: 'For hobbyist creators',
    features: [
      '50 conversions/month',
      '3 output formats',
      'All templates',
      'Priority email support',
      'Conversion history',
    ],
    cta: 'Start Free Trial',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_STARTER,
  },
  {
    name: 'Professional',
    price: '$79',
    description: 'For serious creators',
    features: [
      '200 conversions/month',
      'All output formats',
      'Advanced templates',
      'Priority support',
      'Analytics dashboard',
      'Custom tone controls',
    ],
    cta: 'Start Free Trial',
    popular: true,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PROFESSIONAL,
  },
  {
    name: 'Agency',
    price: '$199',
    description: 'For teams & agencies',
    features: [
      '1000 conversions/month',
      'Everything in Professional',
      'Team accounts (3 users)',
      'API access',
      'White-label options',
      'Dedicated support',
    ],
    cta: 'Contact Sales',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_AGENCY,
  },
]

interface PricingTableProps {
  currentTier?: string
}

export function PricingTable({ currentTier = 'free' }: PricingTableProps) {
  const handleCheckout = async (priceId?: string) => {
    if (!priceId) {
      // Free tier - redirect to signup
      window.location.href = '/sign-up'
      return
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      })

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Checkout error:', error)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-8">
      {tiers.map((tier) => (
        <Card
          key={tier.name}
          className={tier.popular ? 'border-primary shadow-lg scale-105' : ''}
        >
          <CardHeader>
            {tier.popular && (
              <div className="text-xs font-semibold text-primary mb-2">
                MOST POPULAR
              </div>
            )}
            <CardTitle>{tier.name}</CardTitle>
            <CardDescription>{tier.description}</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">{tier.price}</span>
              {tier.price !== '$0' && (
                <span className="text-muted-foreground">/month</span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              variant={tier.popular ? 'default' : 'outline'}
              onClick={() => handleCheckout(tier.priceId)}
              disabled={currentTier === tier.name.toLowerCase()}
            >
              {currentTier === tier.name.toLowerCase() ? 'Current Plan' : tier.cta}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
