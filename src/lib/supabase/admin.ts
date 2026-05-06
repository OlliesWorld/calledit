import 'server-only'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

/**
 * Supabase Admin Client
 * 
 * This client uses the service role key which bypasses Row Level Security (RLS).
 * ONLY use this for server-side operations that need elevated privileges,
 * such as webhook handlers that need to update user data.
 * 
 * NEVER expose this client or the service role key to the client-side.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

/**
 * Create a Supabase admin client that bypasses RLS
 * Returns null if environment variables are not configured
 */
export function createAdminClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Supabase admin client: Missing environment variables')
    return null
  }

  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
