'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PreferencesFormData, UserPreferences, Language, Theme, DashboardLayout, DataExportFormat, Currency, DateFormat, TimeFormat } from '@/types/user'

interface PreferencesFormProps {
  preferences: UserPreferences | null
  onUpdate: (data: PreferencesFormData) => Promise<void>
  loading?: boolean
}

export function PreferencesForm({ preferences, onUpdate, loading = false }: PreferencesFormProps) {
  const [formData, setFormData] = useState<PreferencesFormData>(() => {
    if (preferences) {
      return {
        timezone: preferences?.timezone || 'UTC',
        language: (preferences?.language as Language) || 'en',
        theme: (preferences?.theme as Theme) || 'system',
        email_notifications: preferences?.email_notifications ?? true,
        push_notifications: preferences?.push_notifications ?? true,
        marketing_emails: preferences?.marketing_emails ?? false,
        dashboard_layout: (preferences?.dashboard_layout as DashboardLayout) || 'default',
        sidebar_collapsed: preferences?.sidebar_collapsed ?? false,
        data_export_format: (preferences?.data_export_format as DataExportFormat) || 'json',
        auto_save: preferences?.auto_save ?? true,
        preferred_currency: (preferences?.preferred_currency as Currency) || 'USD',
        date_format: (preferences?.date_format as DateFormat) || 'YYYY-MM-DD',
        time_format: (preferences?.time_format as TimeFormat) || '24h',
        week_start_day: preferences?.week_start_day || 1,
      }
    }

    return {
      timezone: 'UTC',
      language: 'en',
      theme: 'system',
      email_notifications: true,
      push_notifications: true,
      marketing_emails: false,
      dashboard_layout: 'default',
      sidebar_collapsed: false,
      data_export_format: 'json',
      auto_save: true,
      session_timeout: 30,
      preferred_currency: 'USD',
      date_format: 'YYYY-MM-DD',
      time_format: '24h',
      week_start_day: 1,
    }
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await onUpdate(formData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update preferences')
    }
  }

  return (
    <div className="space-y-6">
      {/* General Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>General Preferences</CardTitle>
          <CardDescription>
            Customize your application experience
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
                <Label htmlFor="theme">Theme</Label>
                <select
                  id="theme"
                  value={formData.theme}
                  onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value as Theme }))}
                  className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-pink-400"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <select
                  id="language"
                  value={formData.language}
                  onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value as Language }))}
                  className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-pink-400"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="ja">Japanese</option>
                  <option value="zh">Chinese</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <select
                  id="timezone"
                  value={formData.timezone}
                  onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-pink-400"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                  <option value="Asia/Shanghai">Shanghai</option>
                  <option value="Australia/Sydney">Sydney</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferred_currency">Preferred Currency</Label>
                <select
                  id="preferred_currency"
                  value={formData.preferred_currency}
                  onChange={(e) => setFormData(prev => ({ ...prev, preferred_currency: e.target.value as Currency }))}
                  className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-pink-400"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date_format">Date Format</Label>
                <select
                  id="date_format"
                  value={formData.date_format}
                  onChange={(e) => setFormData(prev => ({ ...prev, date_format: e.target.value as DateFormat }))}
                  className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-pink-400"
                >
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time_format">Time Format</Label>
                <select
                  id="time_format"
                  value={formData.time_format}
                  onChange={(e) => setFormData(prev => ({ ...prev, time_format: e.target.value as TimeFormat }))}
                  className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-pink-400"
                >
                  <option value="24h">24 Hour</option>
                  <option value="12h">12 Hour</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="session_timeout">Session Timeout (minutes)</Label>
              <Input
                id="session_timeout"
                type="number"
                min="5"
                max="480"
                value={formData.session_timeout}
                onChange={(e) => setFormData(prev => ({ ...prev, session_timeout: parseInt(e.target.value) || 30 }))}
              />
            </div>

            <div className="space-y-4">
              <Label>Application Settings</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto_save" className="font-normal">Auto Save</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Automatically save changes as you work</p>
                  </div>
                  <input
                    type="checkbox"
                    id="auto_save"
                    checked={formData.auto_save}
                    onChange={(e) => setFormData(prev => ({ ...prev, auto_save: e.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sidebar_collapsed" className="font-normal">Collapse Sidebar</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Start with sidebar collapsed</p>
                  </div>
                  <input
                    type="checkbox"
                    id="sidebar_collapsed"
                    checked={formData.sidebar_collapsed}
                    onChange={(e) => setFormData(prev => ({ ...prev, sidebar_collapsed: e.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Preferences'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}