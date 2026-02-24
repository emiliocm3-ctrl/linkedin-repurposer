import { NextRequest, NextResponse } from 'next/server'
import { ensureUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { openai } from '@/lib/openai'
import { getPrompts, type Tone, type Industry } from '@/lib/prompts'
import { TIER_LIMITS } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const dbUser = await ensureUser()
    if (!dbUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const limit = TIER_LIMITS[dbUser.subscriptionTier as keyof typeof TIER_LIMITS]
    if (dbUser.conversionsUsed >= limit) {
      return NextResponse.json(
        { error: 'Monthly conversion limit reached. Upgrade to continue.' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { content, tone, industry } = body

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    if (content.length > 3000) {
      return NextResponse.json({ error: 'Content too long (max 3000 characters)' }, { status: 400 })
    }

    const prompts = getPrompts({
      originalContent: content,
      tone: (tone as Tone) || 'professional',
      industry: (industry as Industry) || 'general',
    })

    const [twitterResponse, blogResponse, newsletterResponse] = await Promise.all([
      openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompts.twitter }],
        temperature: 0.7,
        max_tokens: 1500,
      }),
      openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompts.blog }],
        temperature: 0.7,
        max_tokens: 2500,
      }),
      openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompts.newsletter }],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    ])

    const twitterThread = twitterResponse.choices[0]?.message?.content || ''
    const blogPost = blogResponse.choices[0]?.message?.content || ''
    const newsletter = newsletterResponse.choices[0]?.message?.content || ''

    await db.conversion.create({
      data: {
        userId: dbUser.id,
        originalContent: content,
        twitterThread,
        blogPost,
        newsletter,
        tone,
        industry,
      },
    })

    await db.user.update({
      where: { id: dbUser.id },
      data: {
        conversionsUsed: dbUser.conversionsUsed + 1,
      },
    })

    return NextResponse.json({
      twitterThread,
      blogPost,
      newsletter,
      conversionsRemaining: limit - (dbUser.conversionsUsed + 1),
    })
  } catch (error) {
    console.error('Conversion API error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    )
  }
}
