'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

export function CloseWeekButton({ weekId }: { weekId: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  async function handleClose() {
    if (!confirm('Close this week? Players will no longer be able to submit picks.')) return
    setError('')
    const res = await fetch(`/api/admin/weeks/${weekId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'locked' }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'Close failed')
      return
    }
    startTransition(() => router.refresh())
  }

  return (
    <>
      <button
        onClick={handleClose}
        disabled={isPending}
        className="text-[13px] text-coral hover:text-coral/80 px-3 py-1.5 rounded-[8px] hover:bg-coral/5 transition-colors disabled:opacity-50"
      >
        {isPending ? 'Closing...' : 'Close'}
      </button>
      {error && <span className="text-coral text-[11px]">{error}</span>}
    </>
  )
}
