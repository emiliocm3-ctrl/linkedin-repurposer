import { NextRequest, NextResponse } from 'next/server'
import { ensureUser } from '@/lib/auth'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const dbUser = await ensureUser()
    if (!dbUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { priceId } = await req.json()

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID required' }, { status: 400 })
    }

    const sessionParams: Record<string, unknown> = {
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL}/dashboard?canceled=true`,
      metadata: { userId: dbUser.clerkId },
    }

    if (dbUser.stripeCustomerId) {
      sessionParams.customer = dbUser.stripeCustomerId
    } else {
      sessionParams.customer_email = dbUser.email
    }

    const session = await stripe.checkout.sessions.create(
      sessionParams as Parameters<typeof stripe.checkout.sessions.create>[0]
    )

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
