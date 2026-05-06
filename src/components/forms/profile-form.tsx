'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProfileFormData, Profile } from '@/types/user'
import { checkUsernameAvailability } from '@/lib/profile'

interface ProfileFormProps {
  profile: Profile | null
  onUpdate: (data: ProfileFormData) => Promise<void>
  loading?: boolean
}

export function ProfileForm({ profile, onUpdate, loading = false }: ProfileFormProps) {
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: '',
    username: '',
    bio: '',
    website: '',
    location: '',
    company: '',
    job_title: '',
    date_of_birth: '',
    phone: '',
  })
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [checkingUsername, setCheckingUsername] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        username: profile.username || '',
        bio: profile.bio || '',
        website: profile.website || '',
        location: profile.location || '',
        company: profile.company || '',
        job_title: profile.job_title || '',
        date_of_birth: profile.date_of_birth || '',
        phone: profile.phone || '',
      })
    }
  }, [profile])

  const checkUsername = async (username: string) => {
    if (!username || username === profile?.username) {
      setUsernameAvailable(null)
      return
    }

    setCheckingUsername(true)
    try {
      const available = await checkUsernameAvailability(username, profile?.user_id)
      setUsernameAvailable(available)
    } catch (error) {
      console.error('Error checking username:', error)
      setUsernameAvailable(null)
    } finally {
      setCheckingUsername(false)
    }
  }

  const handleUsernameChange = (value: string) => {
    // Remove spaces and convert to lowercase
    const cleanUsername = value.toLowerCase().replace(/\s+/g, '')
    setFormData(prev => ({ ...prev, username: cleanUsername }))

    // Debounce username check
    const timeoutId = setTimeout(() => {
      checkUsername(cleanUsername)
    }, 500)

    return () => clearTimeout(timeoutId)
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
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your profile details and personal information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400 rounded-md border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="Your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">
                Username
                {checkingUsername && <span className="text-gray-400 ml-2">Checking...</span>}
                {usernameAvailable === true && <span className="text-green-600 ml-2">✓ Available</span>}
                {usernameAvailable === false && <span className="text-red-600 ml-2">✗ Taken</span>}
              </Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                placeholder="your-username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell us about yourself..."
              className="flex min-h-[80px] w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-pink-400 resize-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://yourwebsite.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="City, Country"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                placeholder="Your company"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="job_title">Job Title</Label>
              <Input
                id="job_title"
                value={formData.job_title}
                onChange={(e) => setFormData(prev => ({ ...prev, job_title: e.target.value }))}
                placeholder="Your job title"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading || checkingUsername || usernameAvailable === false}>
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}