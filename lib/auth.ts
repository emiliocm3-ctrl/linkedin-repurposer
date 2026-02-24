import { currentUser } from '@clerk/nextjs/server'
import { db } from './db'
import { generateReferralCode } from './utils'

export async function ensureUser() {
  const user = await currentUser()
  if (!user) return null

  const email = user.emailAddresses[0]?.emailAddress
  if (!email) return null

  const dbUser = await db.user.upsert({
    where: { clerkId: user.id },
    update: { email },
    create: {
      clerkId: user.id,
      email,
      referralCode: generateReferralCode(email),
    },
  })

  return dbUser
}
