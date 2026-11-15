'use client'

import { useUser as useClerkUser, useClerk } from '@clerk/nextjs'
import { ExtendedUser, Profile, UserPreferences, ProfileUpdate, UserPreferencesUpdate } from '@/types/user'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getProfile, getUserPreferences, updateProfile, updateUserPreferences } from '@/lib/profile/client'

export function useUser() {
  const { user: clerkUser, isLoaded } = useClerkUser()
  const { signOut: clerkSignOut } = useClerk()
  const [user, setUser] = useState<ExtendedUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)
  const router = useRouter()

  const loadUserData = useCallback(async (userId: string) => {
    setProfileLoading(true)
    try {
      const [profileData, preferencesData] = await Promise.all([
        getProfile(userId),
        getUserPreferences(userId)
      ])

      setProfile(profileData)
      setPreferences(preferencesData)

      // Update the user object with profile and preferences
      setUser(prev => prev ? {
        ...prev,
        profile: profileData || undefined,
        preferences: preferencesData || undefined
      } : null)
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setProfileLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isLoaded) return

    let cancelled = false
    // Deferred to a microtask: effects should not set state synchronously.
    Promise.resolve().then(() => {
      if (cancelled) return

      if (clerkUser) {
        // Map Clerk user to ExtendedUser format
        const mappedUser: ExtendedUser = {
          id: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          imageUrl: clerkUser.imageUrl,
          created_at: clerkUser.createdAt?.toISOString() || new Date().toISOString(),
        }
        setUser(mappedUser)
        void loadUserData(clerkUser.id)
      } else {
        setUser(null)
        setProfile(null)
        setPreferences(null)
      }
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [clerkUser, isLoaded, loadUserData])

  const refreshUserData = async () => {
    if (!user) return
    await loadUserData(user.id)
  }

  const handleUpdateProfile = async (updates: ProfileUpdate) => {
    if (!user) throw new Error('No user logged in')

    try {
      const updatedProfile = await updateProfile(user.id, updates)
      setProfile(updatedProfile)
      setUser({
        ...user,
        profile: updatedProfile
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  const handleUpdatePreferences = async (updates: UserPreferencesUpdate) => {
    if (!user) throw new Error('No user logged in')

    try {
      const updatedPreferences = await updateUserPreferences(user.id, updates)
      setPreferences(updatedPreferences)
      setUser({
        ...user,
        preferences: updatedPreferences
      })
    } catch (error) {
      console.error('Error updating preferences:', error)
      throw error
    }
  }

  const signOut = async () => {
    await clerkSignOut()
    setUser(null)
    setProfile(null)
    setPreferences(null)
    router.push('/login')
    router.refresh()
  }

  return {
    user,
    profile,
    preferences,
    loading,
    profileLoading,
    updateProfile: handleUpdateProfile,
    updatePreferences: handleUpdatePreferences,
    refreshUserData,
    signOut
  }
}
