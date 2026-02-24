import { NextRequest, NextResponse } from 'next/server'
import { ensureUser } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const dbUser = await ensureUser()
    if (!dbUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [totalConversions, thisMonthConversions, recentConversions] = await Promise.all([
      db.conversion.count({ where: { userId: dbUser.id } }),
      db.conversion.count({
        where: { userId: dbUser.id, createdAt: { gte: startOfMonth } },
      }),
      db.conversion.findMany({
        where: { userId: dbUser.id, createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true, tone: true, industry: true },
        orderBy: { createdAt: 'asc' },
      }),
    ])

    const weeklyAverage = recentConversions.length > 0
      ? Math.round((recentConversions.length / 4) * 10) / 10
      : 0

    const toneBreakdown: Record<string, number> = {}
    const industryBreakdown: Record<string, number> = {}
    const dailyMap: Record<string, number> = {}

    for (const c of recentConversions) {
      const tone = c.tone || 'professional'
      toneBreakdown[tone] = (toneBreakdown[tone] || 0) + 1

      const industry = c.industry || 'general'
      industryBreakdown[industry] = (industryBreakdown[industry] || 0) + 1

      const dateKey = c.createdAt.toISOString().split('T')[0]
      dailyMap[dateKey] = (dailyMap[dateKey] || 0) + 1
    }

    const dailyUsage: { date: string; count: number }[] = []
    for (let d = new Date(thirtyDaysAgo); d <= now; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().split('T')[0]
      dailyUsage.push({ date: key, count: dailyMap[key] || 0 })
    }

    return NextResponse.json({
      totalConversions,
      thisMonthConversions,
      weeklyAverage,
      toneBreakdown,
      industryBreakdown,
      dailyUsage,
    })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
