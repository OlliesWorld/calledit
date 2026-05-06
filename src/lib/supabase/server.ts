import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { hasEnvVars } from '@/lib/utils'

export async function createClient() {
  // Return null if environment variables are not properly set
  if (!hasEnvVars || !process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('http')) {
    return null
  }

  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
