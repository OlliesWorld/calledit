'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DEFAULT_LEAGUE, LEAGUES, LEAGUE_LABELS } from '@/lib/leagues'

export default function NewWeekPage() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError('')

    const form = new FormData(e.currentTarget)
    const weekNumberRaw = String(form.get('week_number') ?? '')
    const titleRaw = String(form.get('title') ?? '')
    const startsAtRaw = String(form.get('starts_at') ?? '')
    const locksAtRaw = String(form.get('locks_at') ?? '')
    const leagueRaw = String(form.get('league') ?? DEFAULT_LEAGUE)

    const startsAtMs = Date.parse(startsAtRaw)
    const locksAtMs = Date.parse(locksAtRaw)
    if (Number.isNaN(startsAtMs) || Number.isNaN(locksAtMs)) {
      setError('Please enter valid start and lock dates')
      setPending(false)
      return
    }

    const body = {
      week_number: Number(weekNumberRaw),
      title: titleRaw,
      starts_at: new Date(startsAtMs).toISOString(),
      locks_at: new Date(locksAtMs).toISOString(),
      league: leagueRaw,
    }

    const res = await fetch('/api/admin/weeks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      const week = await res.json()
      router.push(`/admin/weeks/${week.id}`)
    } else {
      let message = 'Failed to create week'
      try {
        const data = await res.json()
        message = data.error ?? data.message ?? message
      } catch {
        const text = await res.text().catch(() => '')
        if (text) message = `${message}: ${text.slice(0, 200)}`
      }
      setError(message)
      setPending(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-(family-name:--font-dm-mono) uppercase tracking-widest text-white/40">Admin</p>
        <h1 className="font-(family-name:--font-bebas) text-4xl text-white tracking-wide">New Week</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="league" className="text-[11px] font-(family-name:--font-dm-mono) uppercase tracking-widest text-white/50">
            League
          </label>
          <select
            id="league"
            name="league"
            defaultValue={DEFAULT_LEAGUE}
            required
            className="w-full min-h-11 bg-[#222228] border border-white/[0.08] rounded-[10px] px-4 py-3 text-[15px] text-white outline-none hover:border-white/20 focus:border-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange transition-colors"
          >
            {LEAGUES.map((league) => (
              <option key={league} value={league}>
                {LEAGUE_LABELS[league]}
              </option>
            ))}
          </select>
        </div>
        <Field label="Week Number" name="week_number" type="number" placeholder="1" required />
        <Field label="Title" name="title" type="text" placeholder="Week 1 · May 5–11" required />
        <Field label="Starts At" name="starts_at" type="datetime-local" required />
        <Field label="Locks At" name="locks_at" type="datetime-local" required />

        {error && <p className="text-coral text-sm">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-orange text-black font-(family-name:--font-bebas) text-2xl tracking-wide py-3 rounded-[14px] hover:bg-orange/90 disabled:opacity-50 transition-colors"
        >
          {pending ? 'Creating...' : 'Create Week'}
        </button>
      </form>
    </div>
  )
}

function Field({ label, name, type, placeholder, required }: {
  label: string; name: string; type: string; placeholder?: string; required?: boolean
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-(family-name:--font-dm-mono) uppercase tracking-widest text-white/50">
        {label}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full bg-[#222228] border border-white/[0.08] rounded-[10px] px-4 py-3 text-[15px] text-white placeholder-white/25 outline-none focus:border-white/20 transition-colors"
      />
    </div>
  )
}
