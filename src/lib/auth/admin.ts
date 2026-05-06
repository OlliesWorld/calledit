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
  const { userId } = await auth()
  if (!userId) return false
  const adminIds = (process.env.ADMIN_USER_IDS || '').split(',').map((s) => s.trim()).filter(Boolean)
  return adminIds.includes(userId)
}
