import { auth, currentUser } from '@clerk/nextjs/server'
import { getServerProfile, getServerUserPreferences } from '@/lib/profile/server'
import type { ExtendedUser } from '@/types/user'

/**
 * Gets the current auth state (server-side)
 * Use this in Server Components, Server Actions, and API Routes
 *
 * @returns Auth object with userId and other auth state
 *
 * @example
 * ```ts
 * const { userId } = await auth()
 * if (!userId) {
 *   redirect('/login')
 * }
 * ```
 */
export { auth }

/**
 * Gets the currently authenticated user (server-side)
 * Use this in Server Components, Server Actions, and API Routes
 *
 * @returns User object or null if not authenticated
 *
 * @example
 * ```ts
 * const user = await getUser()
 * if (!user) {
 *   redirect('/login')
 * }
 * console.log(user.emailAddresses[0].emailAddress)
 * ```
 */
export async function getUser() {
  const user = await currentUser()
  return user
}

/**
 * Gets the currently authenticated user with extended data (server-side)
 * Returns user data formatted for compatibility with existing code,
 * including profile and preferences from the database when available
 *
 * @returns Extended user object or null if not authenticated
 *
 * @example
 * ```ts
 * const user = await getExtendedUser()
 * if (user) {
 *   console.log(user.email)
 *   console.log(user.profile?.full_name)
 * }
 * ```
 */
export async function getExtendedUser(): Promise<ExtendedUser | null> {
  const user = await currentUser()

  if (!user) {
    return null
  }

  // Try to fetch profile and preferences from database
  // Gracefully handle cases where Supabase isn't configured or tables don't exist
  let profile = undefined
  let preferences = undefined

  try {
    const [profileResult, preferencesResult] = await Promise.all([
      getServerProfile(user.id).catch(() => null),
      getServerUserPreferences(user.id).catch(() => null),
    ])
    profile = profileResult ?? undefined
    preferences = preferencesResult ?? undefined
  } catch {
    // Database not available - continue with Clerk data only
    console.warn('Could not fetch profile/preferences from database')
  }

  // Map Clerk user to ExtendedUser format
  return {
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress || '',
    firstName: user.firstName,
    lastName: user.lastName,
    imageUrl: user.imageUrl,
    created_at: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
    profile,
    preferences,
  }
}

/**
 * Gets the current session (server-side)
 * Returns the authentication state
 *
 * @returns Session info or null if not authenticated
 *
 * @example
 * ```ts
 * const session = await getSession()
 * if (!session) {
 *   return new Response('Unauthorized', { status: 401 })
 * }
 * ```
 */
export async function getSession() {
  const { userId, sessionId } = await auth()

  if (!userId || !sessionId) {
    return null
  }

  return {
    userId,
    sessionId,
  }
}
