'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useClerk } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { signOut } = useClerk()

  const handleLogout = async () => {
    setLoading(true)
    try {
      await signOut()
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      size="sm"
      variant="outline"
      className="rounded-full border-white/10 text-white/50 hover:text-white hover:bg-white/5 px-6 transition-colors"
      onClick={handleLogout}
      disabled={loading}
    >
      <LogOut className="w-4 h-4 mr-2" />
      {loading ? 'Logging out...' : 'Logout'}
    </Button>
  )
}
