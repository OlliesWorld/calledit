'use client'

import { useState } from 'react'
import { PreferencesFormData, UserPreferences, Language, Theme, DashboardLayout, DataExportFormat, Currency, DateFormat, TimeFormat } from '@/types/user'

interface PreferencesFormProps {
  preferences: UserPreferences | null
  onUpdate: (data: PreferencesFormData) => Promise<void>
  loading?: boolean
}

const selectClass = 'h-10 w-full rounded-xl border border-white/10 bg-surface3 px-3 py-2 text-sm text-white focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange appearance-none'
const labelClass = 'block text-[11px] uppercase tracking-widest text-white/40 font-mono mb-1.5'

export function PreferencesForm({ preferences, onUpdate, loading = false }: PreferencesFormProps) {
  const [formData, setFormData] = useState<PreferencesFormData>(() => ({
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
  }))
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
    <div className="space-y-4">
      <div className="bg-surface2 border border-white/8 rounded-2xl p-5">
        <h2 className="text-lg font-bold text-white mb-1">General Preferences</h2>
        <p className="text-white/40 text-sm mb-5">Customize your experience</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-coral bg-coral/10 rounded-xl border border-coral/20">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="timezone" className={labelClass}>Timezone</label>
              <select id="timezone" value={formData.timezone} onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))} className={selectClass}>
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern</option>
                <option value="America/Chicago">Central</option>
                <option value="America/Denver">Mountain</option>
                <option value="America/Los_Angeles">Pacific</option>
                <option value="Europe/London">London</option>
                <option value="Europe/Paris">Paris</option>
                <option value="Asia/Tokyo">Tokyo</option>
              </select>
            </div>

            <div>
              <label htmlFor="language" className={labelClass}>Language</label>
              <select id="language" value={formData.language} onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value as Language }))} className={selectClass}>
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="date_format" className={labelClass}>Date Format</label>
              <select id="date_format" value={formData.date_format} onChange={(e) => setFormData(prev => ({ ...prev, date_format: e.target.value as DateFormat }))} className={selectClass}>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>

            <div>
              <label htmlFor="time_format" className={labelClass}>Time Format</label>
              <select id="time_format" value={formData.time_format} onChange={(e) => setFormData(prev => ({ ...prev, time_format: e.target.value as TimeFormat }))} className={selectClass}>
                <option value="12h">12 Hour</option>
                <option value="24h">24 Hour</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-orange px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Update Preferences'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
