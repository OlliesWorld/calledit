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

// ─── Avatar Upload (client-side, uses Supabase Storage directly) ───

const ALLOWED_AVATAR_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
])
const MAX_AVATAR_SIZE = 5 * 1024 * 1024 // 5 MB

/**
 * Validates an avatar file before upload
 * @throws Error if file is invalid
 */
function validateAvatarFile(file: File): void {
  if (!ALLOWED_AVATAR_TYPES.has(file.type)) {
    throw new Error(
      `Invalid file type "${file.type}". Allowed types: JPEG, PNG, GIF, WebP.`
    )
  }
  if (file.size > MAX_AVATAR_SIZE) {
    throw new Error(
      `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum size is 5 MB.`
    )
  }
}

/**
 * Uploads a user's avatar image to storage (client-side)
 * Files are stored in user-specific folders for RLS compliance
 * Validates file type (JPEG, PNG, GIF, WebP) and size (max 5 MB)
 *
 * @param userId - The user's unique identifier
 * @param file - The image file to upload
 * @returns Public URL of the uploaded avatar
 * @throws Error if file is invalid, upload fails, or Supabase is not configured
 *
 * @example
 * ```ts
 * const file = input.files[0]
 * const avatarUrl = await uploadAvatar(user.id, file)
 * await updateProfile(user.id, { avatar_url: avatarUrl })
 * ```
 */
export async function uploadAvatar(userId: string, file: File): Promise<string> {
  // Validate file before uploading
  validateAvatarFile(file)

  const { createClient } = await import('@/lib/supabase/client')
  const supabase = createClient()

  if (!supabase) {
    throw new Error('Supabase is not configured')
  }

  const fileExt = file.name.split('.').pop()?.toLowerCase()
  const fileName = `${userId}/avatar-${Date.now()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, {
      upsert: true,
      contentType: file.type,
    })

  if (uploadError) {
    throw new Error(uploadError.message)
  }

  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName)

  return data.publicUrl
}

/**
 * Deletes a user's avatar from storage (client-side)
 *
 * @param avatarUrl - The public URL of the avatar to delete
 * @throws Error if deletion fails or Supabase is not configured
 *
 * @example
 * ```ts
 * await deleteAvatar(profile.avatar_url)
 * await updateProfile(user.id, { avatar_url: null })
 * ```
 */
export async function deleteAvatar(avatarUrl: string): Promise<void> {
  const { createClient } = await import('@/lib/supabase/client')
  const supabase = createClient()

  if (!supabase) {
    throw new Error('Supabase is not configured')
  }

  // Extract file path from URL (including folder structure)
  const parts = avatarUrl.split('/avatars/')
  const filePath = parts[1]

  if (!filePath) {
    throw new Error('Invalid avatar URL')
  }

  const { error } = await supabase.storage
    .from('avatars')
    .remove([filePath])

  if (error) {
    throw new Error(error.message)
  }
}
