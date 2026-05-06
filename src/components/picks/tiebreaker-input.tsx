'use client'

import { cn } from '@/lib/utils'
import type { Question, Pick } from '@/types/calledit'

interface TiebreakerInputProps {
  question: Question
  pick: Pick | undefined
  weekStatus: 'upcoming' | 'open' | 'locked' | 'scored'
  onChange?: (questionId: string, value: number) => void
  index: number
}

export function TiebreakerInput({ question, pick, weekStatus, onChange, index }: TiebreakerInputProps) {
  const isLocked = weekStatus === 'locked' || weekStatus === 'scored'
  const isScored = weekStatus === 'scored'

  return (
    <div
      className="rounded-[14px] border border-violet/30 bg-violet/5 p-4 space-y-3 animate-fade-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-(family-name:--font-dm-mono) uppercase tracking-widest text-white/70 bg-violet/20 px-2 py-1 rounded-full">
          Tiebreaker
        </span>
      </div>

      <p className="text-[15px] font-medium text-[#F5F5F0] leading-snug">
        {question.question_text}
      </p>

      {question.flavor_text && (
        <p className="text-[13px] text-white/65 italic leading-relaxed">
          {question.flavor_text}
        </p>
      )}

      <div className="flex items-center gap-3">
        <input
          type="number"
          min={0}
          defaultValue={pick?.tiebreaker_guess ?? undefined}
          disabled={isLocked}
          onChange={(e) => onChange?.(question.id, parseFloat(e.target.value))}
          placeholder="Enter your number"
          className={cn(
            'flex-1 bg-[#222228] border border-white/[0.08] rounded-[10px] px-4 py-3 text-[15px] text-[#F5F5F0] placeholder-white/25 outline-none focus:border-violet/50 transition-colors',
            isLocked && 'cursor-not-allowed opacity-50'
          )}
        />
        {isScored && question.tiebreaker_answer !== null && (
          <div className="text-right shrink-0">
            <p className="text-[10px] font-(family-name:--font-dm-mono) uppercase tracking-widest text-white/40">Answer</p>
            <p className="text-lg font-(family-name:--font-bebas) text-lime">{question.tiebreaker_answer}</p>
          </div>
        )}
      </div>

      <p className="text-[11px] font-(family-name:--font-dm-mono) text-white/50 uppercase tracking-wide">
        Closest without going over wins ties
      </p>
    </div>
  )
}
