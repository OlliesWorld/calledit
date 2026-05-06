'use client'

import { useClerk, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import type { ExtendedUser } from '@/types/user'

export function useAuth() {
  const { user, isLoaded } = useUser()
  const { signOut: clerkSignOut } = useClerk()
  const router = useRouter()

  const signOut = async () => {
    await clerkSignOut()
    router.push('/login')
    router.refresh()
  }

  const mappedUser: Pick<ExtendedUser, 'id' | 'email' | 'created_at'> | null = user ? {
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress || '',
    created_at: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
  } : null

  return {
    user: mappedUser,
    loading: !isLoaded,
    signOut
  }
}
