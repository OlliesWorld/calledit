'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewWeekPage() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError('')

    const form = new FormData(e.currentTarget)
    const body = {
      week_number: parseInt(form.get('week_number') as string),
      title: form.get('title') as string,
      starts_at: new Date(form.get('starts_at') as string).toISOString(),
      locks_at: new Date(form.get('locks_at') as string).toISOString(),
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
      const data = await res.json()
      setError(data.error ?? 'Failed to create week')
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
