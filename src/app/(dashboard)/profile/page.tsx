'use client'

import { useState } from 'react'
import { ProfileForm } from '@/components/forms/profile-form'
import { PreferencesForm } from '@/components/forms/preferences-form'
import { useUser } from '@/hooks/use-user'
import { ProfileFormData, PreferencesFormData } from '@/types/user'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Force dynamic rendering - profile requires Clerk auth at runtime
export const dynamic = 'force-dynamic'

export default function ProfilePage() {
  const { user, profile, preferences, updateProfile, updatePreferences, loading, profileLoading } = useUser()
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences'>('profile')
  const [updateLoading, setUpdateLoading] = useState(false)
  const [success, setSuccess] = useState('')

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please sign in to view your profile</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const handleProfileUpdate = async (data: ProfileFormData) => {
    setUpdateLoading(true)
    setSuccess('')
    try {
      await updateProfile(data)
      setSuccess('Profile updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Profile update error:', error)
      throw error
    } finally {
      setUpdateLoading(false)
    }
  }

  const handlePreferencesUpdate = async (data: PreferencesFormData) => {
    setUpdateLoading(true)
    setSuccess('')
    try {
      // Convert the form data to the format expected by the database
      const updates = {
        timezone: data.timezone,
        dashboard_layout: data.dashboard_layout,
        sidebar_collapsed: data.sidebar_collapsed,
        data_export_format: data.data_export_format,
        auto_save: data.auto_save,
        session_timeout: data.session_timeout,
        preferred_currency: data.preferred_currency,
        date_format: data.date_format,
        time_format: data.time_format,
        week_start_day: data.week_start_day,
      }
      await updatePreferences(updates)
      setSuccess('Preferences updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Preferences update error:', error)
      throw error
    } finally {
      setUpdateLoading(false)
    }
  }

  return (
    <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Profile Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your account information and preferences
            </p>
          </div>

          {success && (
            <div className="mb-6 p-3 text-sm text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400 rounded-md border border-green-200 dark:border-green-800">
              {success}
            </div>
          )}

          {profileLoading && (
            <div className="mb-6 p-3 text-sm text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400 rounded-md border border-blue-200 dark:border-blue-800">
              Loading profile data...
            </div>
          )}

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <nav className="-mb-px flex space-x-4">
              <Button
                variant={activeTab === 'profile' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('profile')}
                className="py-2 px-4 text-sm font-medium rounded-lg"
              >
                Profile
              </Button>
              <Button
                variant={activeTab === 'preferences' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('preferences')}
                className="py-2 px-4 text-sm font-medium rounded-lg"
              >
                Preferences
              </Button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'profile' && (
            <ProfileForm
              profile={profile}
              onUpdate={handleProfileUpdate}
              loading={updateLoading}
            />
          )}

          {activeTab === 'preferences' && (
            <PreferencesForm
              preferences={preferences}
              onUpdate={handlePreferencesUpdate}
              loading={updateLoading}
            />
          )}
    </>
  )
}