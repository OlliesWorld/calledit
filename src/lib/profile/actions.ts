'use server'

import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { profileUpdateSchema, userPreferencesSchema } from '@/lib/validations/profile'
import type { Profile, ProfileUpdate, UserPreferences, UserPreferencesUpdate } from '@/types/user'

/**
 * Server actions for profile and preferences operations.
 * These use the Supabase admin client (service role) to bypass RLS,
 * ensuring compatibility with Clerk authentication out of the box.
 *
 * All actions verify the user's identity via Clerk before performing
 * any database operations — the userId is NEVER taken from the client.
 */

async function getAuthenticatedUserId(): Promise<string> {
  const { userId } = await auth()
  if (!userId) {
    throw new Error('Unauthorized')
  }
  return userId
}

function getAdmin() {
  const supabase = createAdminClient()
  if (!supabase) {
    throw new Error('Supabase is not configured')
  }
  return supabase
}

// ─── Profile Actions ───────────────────────────────────────────────

export async function getProfileAction(): Promise<Profile | null> {
  const userId = await getAuthenticatedUserId()
  const supabase = getAdmin()

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116' || error.code === '42P01' || error.message?.includes('schema cache')) {
      return null
    }
    console.error('Error fetching profile:', error.message)
    return null
  }

  return data
}

export async function updateProfileAction(updates: ProfileUpdate): Promise<Profile> {
  const userId = await getAuthenticatedUserId()
  const supabase = getAdmin()

  // Validate input server-side
  const validation = profileUpdateSchema.safeParse(updates)
  if (!validation.success) {
    throw new Error('Invalid profile data')
  }

  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      { user_id: userId, ...validation.data },
      { onConflict: 'user_id' }
    )
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

// ─── Preferences Actions ───────────────────────────────────────────

export async function getPreferencesAction(): Promise<UserPreferences | null> {
  const userId = await getAuthenticatedUserId()
  const supabase = getAdmin()

  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116' || error.code === '42P01' || error.message?.includes('schema cache')) {
      return null
    }
    console.error('Error fetching preferences:', error.message)
    return null
  }

  return data
}

export async function updatePreferencesAction(updates: UserPreferencesUpdate): Promise<UserPreferences> {
  const userId = await getAuthenticatedUserId()
  const supabase = getAdmin()

  // Validate input server-side
  const validation = userPreferencesSchema.safeParse(updates)
  if (!validation.success) {
    throw new Error('Invalid preferences data')
  }

  const { data, error } = await supabase
    .from('user_preferences')
    .upsert(
      { user_id: userId, ...validation.data },
      { onConflict: 'user_id' }
    )
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

// ─── Username Availability ─────────────────────────────────────────

export async function checkUsernameAvailabilityAction(username: string): Promise<boolean> {
  const userId = await getAuthenticatedUserId()
  const supabase = getAdmin()

  const { data, error } = await supabase
    .from('profiles')
    .select('user_id')
    .eq('username', username)
    .neq('user_id', userId)

  if (error) {
    throw new Error(error.message)
  }

  return data.length === 0
}
