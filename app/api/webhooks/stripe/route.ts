import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import Stripe from 'stripe'

function getTierFromPriceId(priceId: string): string {
  const starterPriceId = process.env.STRIPE_PRICE_ID_STARTER || process.env.STRIPE_STARTER
  const proPriceId = process.env.STRIPE_PRICE_ID_PROFESSIONAL || process.env.STRIPE_PRO
  const agencyPriceId = process.env.STRIPE_PRICE_ID_AGENCY || process.env.STRIPE_AGENCY

  if (priceId === starterPriceId) return 'starter'
  if (priceId === proPriceId) return 'professional'
  if (priceId === agencyPriceId) return 'agency'
  return 'free'
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId

        if (!userId) {
          console.error('No userId in session metadata')
          break
        }

        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        )

        const tier = getTierFromPriceId(subscription.items.data[0].price.id)

        await db.user.update({
          where: { clerkId: userId },
          data: {
            stripeCustomerId: session.customer as string,
            subscriptionId: subscription.id,
            subscriptionTier: tier,
            subscriptionStatus: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            conversionsUsed: 0,
            lastResetDate: new Date(),
          },
        })
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription

        const user = await db.user.findUnique({
          where: { stripeCustomerId: subscription.customer as string },
        })

        if (!user) break

        const tier = getTierFromPriceId(subscription.items.data[0].price.id)

        await db.user.update({
          where: { id: user.id },
          data: {
            subscriptionTier: tier,
            subscriptionStatus: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        })
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        const user = await db.user.findUnique({
          where: { stripeCustomerId: subscription.customer as string },
        })

        if (!user) break

        await db.user.update({
          where: { id: user.id },
          data: {
            subscriptionTier: 'free',
            subscriptionStatus: 'canceled',
            subscriptionId: null,
          },
        })
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice

        if (invoice.billing_reason === 'subscription_cycle') {
          const user = await db.user.findUnique({
            where: { stripeCustomerId: invoice.customer as string },
          })

          if (user) {
            await db.user.update({
              where: { id: user.id },
              data: {
                conversionsUsed: 0,
                lastResetDate: new Date(),
              },
            })
          }
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice

        const user = await db.user.findUnique({
          where: { stripeCustomerId: invoice.customer as string },
        })

        if (user) {
          await db.user.update({
            where: { id: user.id },
            data: {
              subscriptionStatus: 'past_due',
            },
          })
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
