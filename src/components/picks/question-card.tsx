'use client'

import { cn } from '@/lib/utils'
import type { Question, Pick } from '@/types/calledit'

interface QuestionCardProps {
  question: Question
  pick: Pick | undefined
  weekStatus: 'upcoming' | 'open' | 'locked' | 'scored'
  onPick?: (questionId: string, answer: boolean) => void
  index: number
}

export function QuestionCard({ question, pick, weekStatus, onPick, index }: QuestionCardProps) {
  const isLocked = weekStatus === 'locked' || weekStatus === 'scored'
  const isScored = weekStatus === 'scored'
  const selected = pick?.answer

  const showResult = isScored && pick !== undefined && pick.answer !== null
  const isCorrect = showResult && pick.is_correct

  return (
    <div
      className={cn(
        'rounded-[14px] border p-4 space-y-3 animate-fade-up',
        isScored && pick?.is_correct === true
          ? 'border-lime/30 bg-lime/5'
          : isScored && pick?.is_correct === false
          ? 'border-coral/30 bg-coral/5'
          : 'border-white/[0.08] bg-[#1a1a1f]'
      )}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Result badge */}
      {showResult && (
        <div className={cn(
          'inline-flex items-center gap-1.5 text-[10px] font-(family-name:--font-dm-mono) uppercase tracking-widest px-2 py-1 rounded-full',
          isCorrect ? 'bg-lime/15 text-lime' : 'bg-coral/15 text-coral'
        )}>
          {isCorrect ? (
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
          {isCorrect ? 'Correct' : 'Wrong'}
        </div>
      )}

      {/* Question text */}
      <p className="text-[15px] font-medium text-[#F5F5F0] leading-snug">
        {question.question_text}
      </p>

      {/* Flavor text */}
      {question.flavor_text && (
        <div className="rounded-[10px] bg-violet/10 border border-violet/20 px-3 py-2">
          <p className="text-[13px] text-white/75 leading-relaxed italic">
            {question.flavor_text}
          </p>
        </div>
      )}

      {/* YES / NO buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        {(['YES', 'NO'] as const).map((label) => {
          const value = label === 'YES'
          const isSelected = selected === value
          const showCorrectAnswer = isScored && question.correct_answer === value

          return (
            <button
              key={label}
              onClick={() => !isLocked && onPick?.(question.id, value)}
              disabled={isLocked}
              className={cn(
                'rounded-[14px] py-3 font-(family-name:--font-bebas) text-2xl tracking-wide transition-all',
                isSelected && !isScored
                  ? label === 'YES'
                    ? 'bg-orange text-black shadow-[0_0_20px_rgba(255,95,31,0.4)] scale-[1.02]'
                    : 'bg-coral text-black shadow-[0_0_20px_rgba(255,59,110,0.4)] scale-[1.02]'
                  : isSelected && isScored && isCorrect
                  ? 'bg-lime text-black'
                  : isSelected && isScored && !isCorrect
                  ? 'bg-coral/80 text-black'
                  : showCorrectAnswer && isScored
                  ? 'bg-lime/20 text-lime border border-lime/40'
                  : isLocked
                  ? 'bg-[#222228] text-white/30 cursor-not-allowed'
                  : 'bg-[#222228] text-[#F5F5F0]/70 hover:bg-[#2a2a30] hover:text-[#F5F5F0]'
              )}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
