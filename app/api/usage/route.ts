import { NextRequest, NextResponse } from 'next/server'
import { ensureUser } from '@/lib/auth'
import { TIER_LIMITS } from '@/lib/stripe'

export async function GET(req: NextRequest) {
  try {
    const dbUser = await ensureUser()
    if (!dbUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const limit = TIER_LIMITS[dbUser.subscriptionTier as keyof typeof TIER_LIMITS]

    return NextResponse.json({
      conversionsUsed: dbUser.conversionsUsed,
      conversionsLimit: limit,
      conversionsRemaining: limit - dbUser.conversionsUsed,
      subscriptionTier: dbUser.subscriptionTier,
      subscriptionStatus: dbUser.subscriptionStatus,
      currentPeriodEnd: dbUser.currentPeriodEnd,
      referralCode: dbUser.referralCode,
      referralCredits: dbUser.referralCredits,
    })
  } catch (error) {
    console.error('Usage API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch usage data' },
      { status: 500 }
    )
  }
}
