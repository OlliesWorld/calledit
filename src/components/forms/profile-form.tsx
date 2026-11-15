'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { UserAvatar, AVATAR_VARIANTS, AvatarVariant } from '@/components/ui/user-avatar'
import { ProfileFormData, Profile } from '@/types/user'
import { checkUsernameAvailability } from '@/lib/profile'

interface ProfileFormProps {
  profile: Profile | null
  onUpdate: (data: ProfileFormData) => Promise<void>
  loading?: boolean
}

const labelClass = 'block text-[11px] uppercase tracking-widest text-white/40 font-mono mb-1.5'

function parseVariant(avatarUrl: string | null | undefined): AvatarVariant {
  if (avatarUrl?.startsWith('boring:')) return avatarUrl.split(':')[1] as AvatarVariant
  return 'beam'
}

export function ProfileForm({ profile, onUpdate, loading = false }: ProfileFormProps) {
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: '',
    username: '',
    bio: '',
    avatar_url: 'boring:beam',
  })
  const [selectedVariant, setSelectedVariant] = useState<AvatarVariant>('beam')
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [checkingUsername, setCheckingUsername] = useState(false)
  const [error, setError] = useState('')

  // Reset the form whenever a new profile object arrives (first load, or after
  // a save). Done during render rather than in an effect, so there is no extra
  // render with stale values.
  const [syncedProfile, setSyncedProfile] = useState<Profile | null>(null)
  if (profile && profile !== syncedProfile) {
    const variant = parseVariant(profile.avatar_url)
    setSyncedProfile(profile)
    setSelectedVariant(variant)
    setFormData({
      full_name: profile.full_name || '',
      username: profile.username || '',
      bio: profile.bio || '',
      avatar_url: `boring:${variant}`,
    })
  }

  const seed = formData.username || profile?.user_id || 'default'

  const handleVariantSelect = (variant: AvatarVariant) => {
    setSelectedVariant(variant)
    setFormData(prev => ({ ...prev, avatar_url: `boring:${variant}` }))
  }

  const checkUsername = async (username: string) => {
    if (!username || username === profile?.username) {
      setUsernameAvailable(null)
      return
    }
    setCheckingUsername(true)
    try {
      const available = await checkUsernameAvailability(username, profile?.user_id)
      setUsernameAvailable(available)
    } catch {
      setUsernameAvailable(null)
    } finally {
      setCheckingUsername(false)
    }
  }

  const handleUsernameChange = (value: string) => {
    const clean = value.toLowerCase().replace(/\s+/g, '')
    setFormData(prev => ({ ...prev, username: clean }))
    const id = setTimeout(() => checkUsername(clean), 500)
    return () => clearTimeout(id)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (formData.username && usernameAvailable === false) {
      setError('Username is not available')
      return
    }
    try {
      await onUpdate(formData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    }
  }

  return (
    <div className="bg-surface2 border border-white/8 rounded-2xl p-5 space-y-5">
      <div>
        <h2 className="text-lg font-bold text-white mb-1">Profile Information</h2>
        <p className="text-white/40 text-sm">Update your display name, username, and avatar</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 text-sm text-coral bg-coral/10 rounded-xl border border-coral/20">
            {error}
          </div>
        )}

        {/* Avatar picker */}
        <div>
          <p className={labelClass}>Avatar Style</p>
          <div className="flex items-center gap-3 flex-wrap">
            {AVATAR_VARIANTS.map((variant) => (
              <button
                key={variant}
                type="button"
                onClick={() => handleVariantSelect(variant)}
                className={`rounded-full transition-all ${
                  selectedVariant === variant
                    ? 'ring-2 ring-orange ring-offset-2 ring-offset-surface2'
                    : 'opacity-50 hover:opacity-80'
                }`}
                title={variant}
              >
                <UserAvatar seed={seed} variant={variant} size={40} />
              </button>
            ))}
          </div>
          <p className="text-[11px] text-white/25 mt-2 font-mono capitalize">{selectedVariant}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="full_name" className={labelClass}>Full Name</label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              placeholder="Roni Lockwood"
            />
          </div>

          <div>
            <label htmlFor="username" className={labelClass}>
              Username
              {checkingUsername && <span className="text-white/30 ml-2 normal-case">checking…</span>}
              {usernameAvailable === true && <span className="text-lime ml-2 normal-case">✓ Available</span>}
              {usernameAvailable === false && <span className="text-coral ml-2 normal-case">✗ Taken</span>}
            </label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              placeholder="rtlockwood"
            />
          </div>
        </div>

        <div>
          <label htmlFor="bio" className={labelClass}>Bio</label>
          <textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            placeholder="Tell us about yourself…"
            rows={3}
            className="w-full rounded-xl border border-white/10 bg-surface3 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-orange focus:border-orange resize-none"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || checkingUsername || usernameAvailable === false}
            className="rounded-full bg-orange px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {loading ? 'Saving…' : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  )
}
