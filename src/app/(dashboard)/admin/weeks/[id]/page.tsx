'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { LEAGUE_LABELS, isLeague } from '@/lib/leagues'

interface Question {
  id: string
  question_text: string
  flavor_text: string | null
  question_type: string
  display_order: number
}

interface Week {
  id: string
  title: string
  week_number: number
  status: string
  league: string
  starts_at: string
  locks_at: string
}

export default function WeekDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [week, setWeek] = useState<Week | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [generating, setGenerating] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [editFlavor, setEditFlavor] = useState('')
  const [error, setError] = useState('')
  const [editingDates, setEditingDates] = useState(false)
  const [startsAt, setStartsAt] = useState('')
  const [locksAt, setLocksAt] = useState('')
  const [savingDates, setSavingDates] = useState(false)

  const load = useCallback(async () => {
    const data = await fetch(`/api/admin/weeks/${id}`).then((r) => r.json())
    setWeek(data)
    setQuestions(data.questions ?? [])
  }, [id])

  useEffect(() => { load() }, [load])

  async function handleGenerate() {
    if (!week) return
    setGenerating(true)
    setError('')
    const startDate = week.starts_at.split('T')[0]
    const endDate = week.locks_at.split('T')[0]
    const res = await fetch(`/api/admin/weeks/${id}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startDate, endDate }),
    })
    if (res.ok) {
      await load()
    } else {
      const data = await res.json()
      setError(data.error ?? 'Generation failed')
    }
    setGenerating(false)
  }

  async function handlePublish() {
    setPublishing(true)
    const res = await fetch(`/api/admin/weeks/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'open' }),
    })
    if (res.ok) {
      router.push('/admin')
    } else {
      const data = await res.json()
      setError(data.error ?? 'Publish failed')
      setPublishing(false)
    }
  }

  function toLocalInput(iso: string) {
    const d = new Date(iso)
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  }

  async function handleSaveDates() {
    setSavingDates(true)
    setError('')
    const res = await fetch(`/api/admin/weeks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ starts_at: startsAt, locks_at: locksAt }),
    })
    if (res.ok) {
      setEditingDates(false)
      await load()
    } else {
      const data = await res.json()
      setError(data.error ?? 'Failed to update dates')
    }
    setSavingDates(false)
  }

  async function handleSaveEdit(questionId: string) {
    await fetch(`/api/admin/questions/${questionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question_text: editText, flavor_text: editFlavor }),
    })
    setEditingId(null)
    await load()
  }

  if (!week) return <p className="text-white/30 text-sm">Loading...</p>

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-(family-name:--font-dm-mono) uppercase tracking-widest text-white/40">
          Admin · {isLeague(week.league) ? LEAGUE_LABELS[week.league] : week.league} · Week {week.week_number}
        </p>
        <h1 className="font-(family-name:--font-bebas) text-4xl text-white tracking-wide">{week.title}</h1>
        <span className="text-[10px] font-(family-name:--font-dm-mono) uppercase tracking-widest px-2 py-1 rounded-full bg-white/10 text-white/50 mt-2 inline-block">
          {week.status}
        </span>
      </div>

      {/* Dates */}
      <div className="bg-[#1a1a1f] border border-white/[0.08] rounded-[14px] p-4 space-y-2">
        {editingDates ? (
          <div className="space-y-2">
            <label className="block text-[10px] font-(family-name:--font-dm-mono) uppercase tracking-widest text-white/40">
              Starts At
              <input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)}
                className="w-full mt-1 bg-[#222228] border border-white/20 rounded-[10px] px-3 py-2 text-sm text-white outline-none" />
            </label>
            <label className="block text-[10px] font-(family-name:--font-dm-mono) uppercase tracking-widest text-white/40">
              Locks At
              <input type="datetime-local" value={locksAt} onChange={(e) => setLocksAt(e.target.value)}
                className="w-full mt-1 bg-[#222228] border border-white/20 rounded-[10px] px-3 py-2 text-sm text-white outline-none" />
            </label>
            <div className="flex gap-2">
              <button onClick={handleSaveDates} disabled={savingDates} className="bg-orange text-black text-sm font-medium px-4 py-1.5 rounded-[8px] disabled:opacity-50">
                {savingDates ? 'Saving...' : 'Save'}
              </button>
              <button onClick={() => setEditingDates(false)} className="text-white/40 text-sm px-4 py-1.5">Cancel</button>
            </div>
          </div>
        ) : (
          <button className="text-left w-full" onClick={() => { setEditingDates(true); setStartsAt(toLocalInput(week.starts_at)); setLocksAt(toLocalInput(week.locks_at)) }}>
            <p className="text-white/60 text-sm">Starts: {new Date(week.starts_at).toLocaleString()}</p>
            <p className="text-white/60 text-sm">Locks: {new Date(week.locks_at).toLocaleString()}</p>
            <p className="text-white/30 text-[11px] mt-1">Tap to edit dates</p>
          </button>
        )}
      </div>

      {/* Generate section — only for upcoming weeks with no questions */}
      {week.status === 'upcoming' && questions.length === 0 && (
        <button onClick={handleGenerate} disabled={generating}
          className="w-full bg-violet/20 border border-violet/30 text-white font-(family-name:--font-bebas) text-xl tracking-wide py-3 rounded-[14px] hover:bg-violet/30 disabled:opacity-50 transition-colors">
          {generating ? 'Generating... (may take 10s)' : '✦ Generate with Claude'}
        </button>
      )}

      {error && <p className="text-coral text-sm">{error}</p>}

      {/* Questions list */}
      {questions.length > 0 && (
        <div className="space-y-3">
          <p className="text-[11px] font-(family-name:--font-dm-mono) uppercase tracking-widest text-white/40">
            {questions.length} Questions — tap to edit
          </p>
          {questions.map((q) => (
            <div key={q.id} className="bg-[#1a1a1f] border border-white/[0.08] rounded-[14px] p-4 space-y-2">
              <span className="text-[10px] font-(family-name:--font-dm-mono) uppercase tracking-widest text-white/30">
                {q.question_type}
              </span>

              {editingId === q.id ? (
                <div className="space-y-2">
                  <textarea value={editText} onChange={(e) => setEditText(e.target.value)} rows={2}
                    className="w-full bg-[#222228] border border-white/20 rounded-[10px] px-3 py-2 text-sm text-white outline-none resize-none" />
                  <textarea value={editFlavor} onChange={(e) => setEditFlavor(e.target.value)} rows={2}
                    placeholder="Flavor text..."
                    className="w-full bg-[#222228] border border-white/[0.08] rounded-[10px] px-3 py-2 text-sm text-white/60 italic outline-none resize-none" />
                  <div className="flex gap-2">
                    <button onClick={() => handleSaveEdit(q.id)} className="bg-orange text-black text-sm font-medium px-4 py-1.5 rounded-[8px]">Save</button>
                    <button onClick={() => setEditingId(null)} className="text-white/40 text-sm px-4 py-1.5">Cancel</button>
                  </div>
                </div>
              ) : (
                <button className="text-left w-full" onClick={() => { setEditingId(q.id); setEditText(q.question_text); setEditFlavor(q.flavor_text ?? '') }}>
                  <p className="text-white text-base leading-snug font-medium">{q.question_text}</p>
                  {q.flavor_text && <p className="text-white/60 text-sm italic mt-1.5 leading-snug">{q.flavor_text}</p>}
                </button>
              )}
            </div>
          ))}

          {/* Publish */}
          {week.status === 'upcoming' && (
            <button onClick={handlePublish} disabled={publishing}
              className="w-full bg-orange text-black font-(family-name:--font-bebas) text-2xl tracking-wide py-3 rounded-[14px] hover:bg-orange/90 disabled:opacity-50 transition-colors mt-2">
              {publishing ? 'Publishing...' : 'Publish Week'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
