import { NextRequest, NextResponse } from 'next/server'
import { ensureUser } from '@/lib/auth'
import { db } from '@/lib/db'

const REFERRAL_CREDIT_BONUS = 3

export async function GET(req: NextRequest) {
  try {
    const dbUser = await ensureUser()
    if (!dbUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const referralCount = await db.referralReward.count({
      where: { referrerId: dbUser.id },
    })

    return NextResponse.json({
      referralCode: dbUser.referralCode,
      referralCredits: dbUser.referralCredits,
      totalReferrals: referralCount,
    })
  } catch (error) {
    console.error('Referral API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch referral data' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const dbUser = await ensureUser()
    if (!dbUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { referralCode } = await req.json()

    if (!referralCode || typeof referralCode !== 'string') {
      return NextResponse.json({ error: 'Referral code is required' }, { status: 400 })
    }

    if (dbUser.referredBy) {
      return NextResponse.json(
        { error: 'You have already used a referral code' },
        { status: 400 }
      )
    }

    if (dbUser.referralCode === referralCode) {
      return NextResponse.json(
        { error: 'You cannot use your own referral code' },
        { status: 400 }
      )
    }

    const referrer = await db.user.findUnique({
      where: { referralCode },
    })

    if (!referrer) {
      return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 })
    }

    await db.$transaction([
      db.user.update({
        where: { id: dbUser.id },
        data: {
          referredBy: referrer.id,
          referralCredits: { increment: REFERRAL_CREDIT_BONUS },
        },
      }),
      db.user.update({
        where: { id: referrer.id },
        data: {
          referralCredits: { increment: REFERRAL_CREDIT_BONUS },
        },
      }),
      db.referralReward.create({
        data: {
          referrerId: referrer.id,
          refereeId: dbUser.id,
          rewardType: 'credits',
          rewardAmount: REFERRAL_CREDIT_BONUS,
          claimed: true,
        },
      }),
    ])

    return NextResponse.json({
      message: `Referral applied! You and your referrer each received ${REFERRAL_CREDIT_BONUS} bonus conversions.`,
      creditsAwarded: REFERRAL_CREDIT_BONUS,
    })
  } catch (error) {
    console.error('Referral apply error:', error)
    return NextResponse.json(
      { error: 'Failed to apply referral code' },
      { status: 500 }
    )
  }
}
