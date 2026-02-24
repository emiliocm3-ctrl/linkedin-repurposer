import { NextRequest, NextResponse } from 'next/server'
import { ensureUser } from '@/lib/auth'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const dbUser = await ensureUser()
    if (!dbUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!dbUser.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 400 }
      )
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: dbUser.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL}/settings`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Billing portal error:', error)
    return NextResponse.json(
      { error: 'Failed to create billing portal session' },
      { status: 500 }
    )
  }
}
