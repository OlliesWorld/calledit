import { Database } from './database'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type UserPreferences = Database['public']['Tables']['user_preferences']['Row']
export type UserPreferencesInsert = Database['public']['Tables']['user_preferences']['Insert']
export type UserPreferencesUpdate = Database['public']['Tables']['user_preferences']['Update']

// Extended user type combining Clerk user with profile
export interface ExtendedUser {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  imageUrl: string | null
  created_at: string
  profile?: Profile
  preferences?: UserPreferences
}

// Theme options
export type Theme = 'light' | 'dark' | 'system'

// Language options
export type Language = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh'

// Timezone type
export type Timezone = string

// Currency options
export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD'

// Date format options
export type DateFormat = 'YYYY-MM-DD' | 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'DD-MM-YYYY'

// Time format options
export type TimeFormat = '12h' | '24h'

// Dashboard layout options
export type DashboardLayout = 'default' | 'compact' | 'expanded' | 'minimal'

// Data export format options
export type DataExportFormat = 'json' | 'csv' | 'xlsx' | 'pdf'

// Profile form data interface
export interface ProfileFormData {
  full_name?: string
  username?: string
  bio?: string
  website?: string
  location?: string
  company?: string
  job_title?: string
  date_of_birth?: string
  phone?: string
  avatar_url?: string
}

// Preferences form data interface
export interface PreferencesFormData {
  timezone?: string
  language?: Language
  theme?: Theme
  email_notifications?: boolean
  push_notifications?: boolean
  marketing_emails?: boolean
  dashboard_layout?: DashboardLayout
  sidebar_collapsed?: boolean
  data_export_format?: DataExportFormat
  auto_save?: boolean
  two_factor_enabled?: boolean
  session_timeout?: number
  preferred_currency?: Currency
  date_format?: DateFormat
  time_format?: TimeFormat
  week_start_day?: number
}

// User context interface
export interface UserContextType {
  user: ExtendedUser | null
  profile: Profile | null
  preferences: UserPreferences | null
  loading: boolean
  updateProfile: (data: ProfileUpdate) => Promise<void>
  updatePreferences: (data: UserPreferencesUpdate) => Promise<void>
  refreshUserData: () => Promise<void>
}