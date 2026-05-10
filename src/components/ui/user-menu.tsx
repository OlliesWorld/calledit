'use client'

import { useState, useRef, useEffect } from 'react'
import { useClerk, useUser as useClerkUser } from '@clerk/nextjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { UserAvatar, AvatarVariant } from './user-avatar'
import { getProfile } from '@/lib/profile/client'

export function UserMenu() {
  const { user } = useClerkUser()
  const { signOut } = useClerk()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [variant, setVariant] = useState<AvatarVariant>('beam')
  const ref = useRef<HTMLDivElement>(null)

  const seed = user?.username || user?.id || 'default'

  useEffect(() => {
    if (!user?.id) return
    getProfile(user.id).then((profile) => {
      const url = profile?.avatar_url
      if (url?.startsWith('boring:')) {
        setVariant(url.split(':')[1] as AvatarVariant)
      }
    })
  }, [user?.id])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (!user) return null

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="rounded-full overflow-hidden ring-2 ring-transparent hover:ring-white/20 transition-all"
      >
        <UserAvatar seed={seed} variant={variant} size={32} />
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-44 bg-surface2 border border-white/10 rounded-2xl shadow-xl overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-white/8">
            <p className="text-xs text-white/40 truncate">{user.primaryEmailAddress?.emailAddress}</p>
          </div>
          <div className="p-1">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
              Profile
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-coral/70 hover:text-coral hover:bg-coral/5 rounded-xl transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
