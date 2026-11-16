import { Profile, ProfileUpdate, UserPreferences, UserPreferencesUpdate } from '@/types/user'
import {
  getProfileAction,
  updateProfileAction,
  getPreferencesAction,
  updatePreferencesAction,
  checkUsernameAvailabilityAction,
} from './actions'

// Client-side functions
// These delegate to server actions which use the admin client,
// ensuring they work with Clerk auth without requiring
// Clerk↔Supabase JWT integration.

/**
 * Gets the current user's profile (client-side)
 * Delegates to a server action that authenticates via Clerk
 *
 * @returns Profile object or null if profile doesn't exist
 *
 * @example
 * ```ts
 * const profile = await getProfile()
 * console.log(profile?.full_name)
 * ```
 */
export async function getProfile(_userId?: string): Promise<Profile | null> {
  return getProfileAction()
}

/**
 * Updates or creates the current user's profile (client-side)
 * Delegates to a server action that authenticates via Clerk
 *
 * @param _userId - Deprecated, kept for API compatibility. User is identified server-side.
 * @param updates - Partial profile object with fields to update
 * @returns Updated profile object
 * @throws Error if update fails
 *
 * @example
 * ```ts
 * const updatedProfile = await updateProfile(user.id, {
 *   full_name: 'John Doe',
 *   bio: 'Software Developer'
 * })
 * ```
 */
export async function updateProfile(_userId: string, updates: ProfileUpdate): Promise<Profile> {
  return updateProfileAction(updates)
}

/**
 * Gets the current user's preferences (client-side)
 * Delegates to a server action that authenticates via Clerk
 *
 * @returns UserPreferences object or null if preferences don't exist
 *
 * @example
 * ```ts
 * const preferences = await getUserPreferences()
 * console.log(preferences?.theme)
 * ```
 */
export async function getUserPreferences(_userId?: string): Promise<UserPreferences | null> {
  return getPreferencesAction()
}

/**
 * Updates or creates the current user's preferences (client-side)
 * Delegates to a server action that authenticates via Clerk
 *
 * @param _userId - Deprecated, kept for API compatibility. User is identified server-side.
 * @param updates - Partial preferences object with fields to update
 * @returns Updated preferences object
 * @throws Error if update fails
 *
 * @example
 * ```ts
 * const updatedPrefs = await updateUserPreferences(user.id, {
 *   theme: 'dark',
 *   email_notifications: true
 * })
 * ```
 */
export async function updateUserPreferences(
  _userId: string,
  updates: UserPreferencesUpdate
): Promise<UserPreferences> {
  return updatePreferencesAction(updates)
}

/**
 * Checks if a username is available (client-side)
 * Delegates to a server action that authenticates via Clerk
 *
 * @param username - The username to check
 * @param _currentUserId - Deprecated, kept for API compatibility
 * @returns true if username is available, false if taken
 *
 * @example
 * ```ts
 * const isAvailable = await checkUsernameAvailability('johndoe')
 * if (isAvailable) {
 *   // Proceed with username update
 * }
 * ```
 */
export async function checkUsernameAvailability(username: string, _currentUserId?: string): Promise<boolean> {
  return checkUsernameAvailabilityAction(username)
}
