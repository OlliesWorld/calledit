'use client'

import { useState, useTransition } from 'react'
import { QuestionCard } from './question-card'
import { TiebreakerInput } from './tiebreaker-input'
import { cn } from '@/lib/utils'
import type { WeekWithQuestions, Pick, WeekStatus } from '@/types/calledit'

interface PicksFormProps {
  week: WeekWithQuestions
  initialPicks: Pick[]
}

export function PicksForm({ week, initialPicks }: PicksFormProps) {
  const [picks, setPicks] = useState<Record<string, Pick>>(() =>
    Object.fromEntries(initialPicks.map((p) => [p.question_id, p]))
  )
  const [pending, startTransition] = useTransition()
  const [submitted, setSubmitted] = useState(false)
  const [tiebreakerValues, setTiebreakerValues] = useState<Record<string, number>>({})

  const pickQuestions = week.questions.filter((q) => q.question_type === 'pick')
  const tiebreakerQuestion = week.questions.find((q) => q.question_type === 'tiebreaker')
  const isOpen = week.status === 'open'
  const isLocked = week.status === 'locked'
  const isScored = week.status === 'scored'

  const picksCount = pickQuestions.filter((q) => picks[q.id]?.answer !== undefined && picks[q.id]?.answer !== null).length
  const progress = pickQuestions.length > 0 ? picksCount / pickQuestions.length : 0

  function handlePick(questionId: string, answer: boolean) {
    setPicks((prev) => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] ?? { id: '', user_id: '', week_id: week.id, question_id: questionId, tiebreaker_guess: null, is_correct: null, created_at: '', updated_at: '' }),
        question_id: questionId,
        answer,
      } as Pick,
    }))
  }

  function handleTiebreaker(questionId: string, value: number) {
    setTiebreakerValues((prev) => ({ ...prev, [questionId]: value }))
  }

  function handleSubmit() {
    startTransition(async () => {
      const requests: Promise<Response>[] = []

      for (const [questionId, pick] of Object.entries(picks)) {
        if (pick.answer !== null && pick.answer !== undefined) {
          requests.push(
            fetch('/api/picks', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ questionId, weekId: week.id, answer: pick.answer }),
            })
          )
        }
      }

      if (tiebreakerQuestion) {
        const guess = tiebreakerValues[tiebreakerQuestion.id]
        if (guess !== undefined) {
          requests.push(
            fetch('/api/picks', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ questionId: tiebreakerQuestion.id, weekId: week.id, tiebreakerGuess: guess }),
            })
          )
        }
      }

      const results = await Promise.all(requests)
      if (results.every((r) => r.ok)) setSubmitted(true)
    })
  }

  return (
    <div className="space-y-3">
      {/* Week header */}
      <div className="animate-fade-up mb-5">
        <p className="text-[10px] font-(family-name:--font-dm-mono) uppercase tracking-widest text-white/60 mb-1">
          Week {week.week_number}
        </p>
        <h1 className="font-(family-name:--font-bebas) text-4xl text-white leading-none tracking-wide">
          {week.title}
        </h1>

        {/* Status badge */}
        <div className="mt-3 flex items-center gap-3">
          <StatusBadge status={week.status as WeekStatus} />
          {isOpen && pickQuestions.length > 0 && (
            <div className="flex-1 flex items-center gap-2">
              <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange rounded-full transition-all duration-500"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-(family-name:--font-dm-mono) text-white/60 shrink-0">
                {picksCount}/{pickQuestions.length}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Questions */}
      {pickQuestions.map((question, i) => (
        <QuestionCard
          key={question.id}
          question={question}
          pick={picks[question.id]}
          weekStatus={week.status as WeekStatus}
          onPick={handlePick}
          index={i + 1}
        />
      ))}

      {/* Tiebreaker */}
      {tiebreakerQuestion && (
        <TiebreakerInput
          question={tiebreakerQuestion}
          pick={picks[tiebreakerQuestion.id]}
          weekStatus={week.status as WeekStatus}
          onChange={handleTiebreaker}
          index={pickQuestions.length + 1}
        />
      )}

      {/* Submit */}
      {isOpen && (
        <div className="pt-2 animate-fade-up" style={{ animationDelay: `${(week.questions.length + 1) * 60}ms` }}>
          {submitted ? (
            <div className="rounded-[14px] bg-lime/10 border border-lime/30 p-4 text-center">
              <p className="font-(family-name:--font-bebas) text-2xl text-lime tracking-wide">
                You&apos;re locked in ✓
              </p>
              <p className="text-[13px] text-white/50 mt-1">
                You can change your picks until the week locks.
              </p>
            </div>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={pending || picksCount === 0}
              className={cn(
                'w-full rounded-[14px] py-4 font-(family-name:--font-bebas) text-2xl tracking-wide transition-all',
                picksCount > 0
                  ? 'bg-orange text-black hover:bg-orange/90 active:scale-[0.98]'
                  : 'bg-[#222228] text-white/30 cursor-not-allowed'
              )}
            >
              {pending ? 'Saving...' : 'Submit Picks'}
            </button>
          )}
        </div>
      )}

      {/* Locked state */}
      {isLocked && (
        <div className="rounded-[14px] bg-[#1a1a1f] border border-white/[0.08] p-4 text-center animate-fade-up" style={{ animationDelay: '200ms' }}>
          <p className="font-(family-name:--font-bebas) text-xl text-white/60 tracking-wide">
            Picks are locked
          </p>
          <p className="text-[13px] text-white/55 mt-1">Results coming after games</p>
        </div>
      )}

      {/* Scored summary */}
      {isScored && (
        <ScoreSummary picks={Object.values(picks)} totalQuestions={pickQuestions.length} />
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: WeekStatus }) {
  const config = {
    upcoming: { label: 'Coming Soon', className: 'bg-white/10 text-white/50' },
    open: { label: 'Open · Make Your Picks', className: 'bg-orange/15 text-orange' },
    locked: { label: 'Locked · Results Pending', className: 'bg-white/10 text-white/50' },
    scored: { label: 'Scored', className: 'bg-lime/15 text-lime' },
  }
  const { label, className } = config[status]
  return (
    <span className={cn('text-[10px] font-(family-name:--font-dm-mono) uppercase tracking-widest px-2 py-1 rounded-full', className)}>
      {label}
    </span>
  )
}

function ScoreSummary({ picks, totalQuestions }: { picks: Pick[]; totalQuestions: number }) {
  const correct = picks.filter((p) => p.is_correct === true).length
  const attempted = picks.filter((p) => p.answer !== null).length

  return (
    <div className="rounded-[14px] bg-[#1a1a1f] border border-white/[0.08] p-5 text-center animate-fade-up" style={{ animationDelay: '200ms' }}>
      <p className="font-(family-name:--font-bebas) text-5xl text-white tracking-wide">
        {correct}<span className="text-white/55">/{totalQuestions}</span>
      </p>
      <p className="text-[13px] text-white/50 mt-1">
        {attempted < totalQuestions ? `${totalQuestions - attempted} questions skipped` : 'All questions answered'}
      </p>
    </div>
  )
}
