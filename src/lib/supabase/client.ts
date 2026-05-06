import { createBrowserClient } from '@supabase/ssr'
import { hasEnvVars } from '@/lib/utils'

export function createClient() {
  // Return null if environment variables are not properly set
  if (!hasEnvVars || !process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('http')) {
    return null
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
