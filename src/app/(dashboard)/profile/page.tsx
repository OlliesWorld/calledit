'use client'

import { useState } from 'react'
import { ProfileForm } from '@/components/forms/profile-form'
import { PreferencesForm } from '@/components/forms/preferences-form'
import { useUser } from '@/hooks/use-user'
import { ProfileFormData, PreferencesFormData } from '@/types/user'

export const dynamic = 'force-dynamic'

export default function ProfilePage() {
  const { user, profile, preferences, updateProfile, updatePreferences, loading, profileLoading } = useUser()
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences'>('profile')
  const [updateLoading, setUpdateLoading] = useState(false)
  const [success, setSuccess] = useState('')

  // Keep the spinner up until the profile's first load has finished, so the
  // form appears once, already filled in, instead of rendering empty and then
  // shifting when the data and the "loading" notice swap places.
  const firstProfileLoad = profileLoading && !profile

  if (loading || firstProfileLoad) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-white/40">Please sign in to view your profile</p>
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
      await updatePreferences({
        timezone: data.timezone,
        dashboard_layout: data.dashboard_layout,
        sidebar_collapsed: data.sidebar_collapsed,
        data_export_format: data.data_export_format,
        auto_save: data.auto_save,
        preferred_currency: data.preferred_currency,
        date_format: data.date_format,
        time_format: data.time_format,
        week_start_day: data.week_start_day,
      })
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
        <h1 className="font-(family-name:--font-bebas) text-4xl tracking-wide text-white mb-1">
          Profile Settings
        </h1>
        <p className="text-white/40 text-sm">
          Manage your account information and preferences
        </p>
      </div>

      {success && (
        <div className="mb-6 p-3 text-sm text-green-400 bg-green-500/10 rounded-xl border border-green-500/20">
          {success}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-white/10 mb-6">
        <nav className="-mb-px flex gap-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === 'profile'
                ? 'bg-orange-500 text-white'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === 'preferences'
                ? 'bg-orange-500 text-white'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            Preferences
          </button>
        </nav>
      </div>

      {activeTab === 'profile' && (
        <ProfileForm profile={profile} onUpdate={handleProfileUpdate} loading={updateLoading} />
      )}

      {activeTab === 'preferences' && (
        <PreferencesForm preferences={preferences} onUpdate={handlePreferencesUpdate} loading={updateLoading} />
      )}
    </>
  )
}
