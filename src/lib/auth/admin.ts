import 'server-only'
import { auth } from '@clerk/nextjs/server'

export async function requireAdmin(): Promise<string> {
  const { userId } = await auth()
  const adminIds = (process.env.ADMIN_USER_IDS || '').split(',').map((s) => s.trim()).filter(Boolean)
  if (!userId || !adminIds.includes(userId)) {
    throw new Error('Unauthorized')
  }
  return userId
}

export async function isAdmin(): Promise<boolean> {
  // auth() throws when the request never went through the Clerk proxy. That
  // happens for file-like URLs (e.g. /missing.png), which src/proxy.ts skips
  // and which can land on the /[league] route. Nobody is signed in on those
  // requests, so the answer is "not an admin" and the page 404s normally.
  let userId: string | null
  try {
    ;({ userId } = await auth())
  } catch {
    return false
  }
  if (!userId) return false
  const adminIds = (process.env.ADMIN_USER_IDS || '').split(',').map((s) => s.trim()).filter(Boolean)
  return adminIds.includes(userId)
}
