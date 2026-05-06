import { createClient as createServerClient } from '@/lib/supabase/server'
import { currentUser } from '@clerk/nextjs/server'
import { Profile, UserPreferences, ExtendedUser } from '@/types/user'

// Server-side functions

/**
 * Gets a user's profile by ID (server-side)
 * Use this in Server Components, Server Actions, and API Routes
 *
 * @param userId - The user's unique identifier
 * @returns Profile object or null if profile doesn't exist
 *
 * @example
 * ```ts
 * const profile = await getServerProfile(user.id)
 * console.log(profile?.full_name)
 * ```
 */
export async function getServerProfile(userId: string): Promise<Profile | null> {
  const supabase = await createServerClient()

  if (!supabase) {
    return null
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // Profile doesn't exist yet
      return null
    }
    // Handle missing table errors gracefully (table not created yet)
    if (error.code === '42P01' || error.message?.includes('schema cache')) {
      return null
    }
    console.error('Error fetching profile:', error.message)
    return null
  }

  return data
}

/**
 * Gets a user's preferences by ID (server-side)
 * Use this in Server Components, Server Actions, and API Routes
 *
 * @param userId - The user's unique identifier
 * @returns UserPreferences object or null if preferences don't exist
 *
 * @example
 * ```ts
 * const preferences = await getServerUserPreferences(user.id)
 * console.log(preferences?.theme)
 * ```
 */
export async function getServerUserPreferences(userId: string): Promise<UserPreferences | null> {
  const supabase = await createServerClient()

  if (!supabase) {
    return null
  }

  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // Preferences don't exist yet
      return null
    }
    // Handle missing table errors gracefully (table not created yet)
    if (error.code === '42P01' || error.message?.includes('schema cache')) {
      return null
    }
    console.error('Error fetching preferences:', error.message)
    return null
  }

  return data
}

/**
 * Gets extended user data including profile and preferences (server-side)
 * Fetches user, profile, and preferences in parallel for better performance
 * Use this in Server Components, Server Actions, and API Routes
 *
 * @param userId - The user's unique identifier
 * @returns ExtendedUser object or null if user doesn't exist
 *
 * @example
 * ```ts
 * const extendedUser = await getServerExtendedUser(user.id)
 * if (extendedUser) {
 *   console.log(extendedUser.profile?.full_name)
 *   console.log(extendedUser.preferences?.theme)
 * }
 * ```
 */
export async function getServerExtendedUser(userId: string): Promise<ExtendedUser | null> {
  // Get the base user from Clerk
  const user = await currentUser()

  if (!user || user.id !== userId) {
    return null
  }

  // Get profile and preferences in parallel
  const [profile, preferences] = await Promise.all([
    getServerProfile(userId),
    getServerUserPreferences(userId)
  ])

  const extendedUser: ExtendedUser = {
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress || '',
    firstName: user.firstName,
    lastName: user.lastName,
    imageUrl: user.imageUrl,
    created_at: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
    profile: profile || undefined,
    preferences: preferences || undefined
  }

  return extendedUser
}

/**
 * Creates an initial profile for a new user (server-side)
 * Called automatically by database trigger on user signup, but can also be called manually
 * Use this in Server Components, Server Actions, and API Routes
 *
 * @param userId - The user's unique identifier
 * @param email - The user's email address
 * @param fullName - Optional full name (defaults to email prefix if not provided)
 * @returns Created profile object
 * @throws Error if profile creation fails or Supabase is not configured
 *
 * @example
 * ```ts
 * const profile = await createInitialProfile(user.id, 'John Doe')
 * ```
 */
export async function createInitialProfile(userId: string, fullName?: string): Promise<Profile> {
  const supabase = await createServerClient()

  if (!supabase) {
    throw new Error('Supabase is not configured')
  }

  const { data, error } = await supabase
    .from('profiles')
    .insert({
      user_id: userId,
      full_name: fullName || null
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}