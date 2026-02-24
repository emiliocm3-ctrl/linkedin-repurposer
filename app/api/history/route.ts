import { NextRequest, NextResponse } from 'next/server'
import { ensureUser } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const dbUser = await ensureUser()
    if (!dbUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')))
    const skip = (page - 1) * limit

    const [conversions, total] = await Promise.all([
      db.conversion.findMany({
        where: { userId: dbUser.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          originalContent: true,
          twitterThread: true,
          blogPost: true,
          newsletter: true,
          tone: true,
          industry: true,
          createdAt: true,
        },
      }),
      db.conversion.count({ where: { userId: dbUser.id } }),
    ])

    return NextResponse.json({
      conversions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('History API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    )
  }
}
