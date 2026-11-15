'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

interface Question {
  id: string
  question_text: string
  question_type: string
  display_order: number
}

export default function ScorePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, boolean>>({})
  const [tiebreakerAnswer, setTiebreakerAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Load the week being scored by id. (This used to go through
  // /api/weeks/current, which only returns open/upcoming weeks, so a locked
  // week, the only kind the admin list links here, came back with no questions.)
  useEffect(() => {
    let cancelled = false

    fetch(`/api/admin/weeks/${id}`)
      .then(async (res) => {
        const data = await res.json().catch(() => null)
        if (cancelled) return
        if (!res.ok) {
          setError(data?.error ?? 'Could not load this week')
          return
        }
        setQuestions(data?.questions ?? [])
      })
      .catch(() => {
        if (!cancelled) setError('Could not load this week')
      })

    return () => {
      cancelled = true
    }
  }, [id])

  const pickQuestions = questions.filter((q) => q.question_type === 'pick')
  const tiebreakerQuestion = questions.find((q) => q.question_type === 'tiebreaker')

  async function handleSubmit() {
    if (Object.keys(answers).length === 0) { setError('Enter at least one answer'); return }
    setSubmitting(true)
    setError('')

    const res = await fetch(`/api/admin/weeks/${id}/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answers,
        tiebreakerAnswer: tiebreakerAnswer ? parseFloat(tiebreakerAnswer) : undefined,
      }),
    })

    if (res.ok) {
      router.push('/admin')
    } else {
      const data = await res.json()
      setError(data.error ?? 'Scoring failed')
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-(family-name:--font-dm-mono) uppercase tracking-widest text-white/40">Admin · Scoring</p>
        <h1 className="font-(family-name:--font-bebas) text-4xl text-white tracking-wide">Score Results</h1>
      </div>

      <div className="space-y-3">
        {pickQuestions.map((q) => (
          <div key={q.id} className="bg-[#1a1a1f] border border-white/[0.08] rounded-[14px] p-4 space-y-3">
            <p className="text-white text-[15px] leading-snug">{q.question_text}</p>
            <div className="grid grid-cols-2 gap-2">
              {(['YES', 'NO'] as const).map((label) => {
                const val = label === 'YES'
                const selected = answers[q.id] === val
                return (
                  <button key={label} onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: val }))}
                    className={`rounded-[14px] py-3 font-(family-name:--font-bebas) text-2xl tracking-wide transition-all ${
                      selected
                        ? label === 'YES' ? 'bg-lime text-black' : 'bg-coral text-black'
                        : 'bg-[#222228] text-white/50 hover:text-white'
                    }`}>
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        {tiebreakerQuestion && (
          <div className="bg-[#1a1a1f] border border-violet/30 rounded-[14px] p-4 space-y-3">
            <span className="text-[10px] font-(family-name:--font-dm-mono) uppercase tracking-widest text-white/40">Tiebreaker Answer</span>
            <p className="text-white text-[15px]">{tiebreakerQuestion.question_text}</p>
            <input
              type="number"
              value={tiebreakerAnswer}
              onChange={(e) => setTiebreakerAnswer(e.target.value)}
              placeholder="Enter the actual number"
              className="w-full bg-[#222228] border border-white/[0.08] rounded-[10px] px-4 py-3 text-white outline-none focus:border-violet/50"
            />
          </div>
        )}
      </div>

      {error && <p className="text-coral text-sm">{error}</p>}

      <button onClick={handleSubmit} disabled={submitting}
        className="w-full bg-orange text-black font-(family-name:--font-bebas) text-2xl tracking-wide py-4 rounded-[14px] hover:bg-orange/90 disabled:opacity-50 transition-colors">
        {submitting ? 'Submitting...' : 'Submit Scores'}
      </button>
    </div>
  )
}
