import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'

/** A pick rejected for a reason the client can act on; carries the HTTP status. */
export class PickError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message)
    this.name = 'PickError'
  }
}

interface SubmitPickArgs {
  userId: string
  questionId: string
  weekId: string
  answer?: boolean
  tiebreakerGuess?: number
}

export async function submitPick({ userId, questionId, weekId, answer, tiebreakerGuess }: SubmitPickArgs) {

  const supabase = createAdminClient()
  if (!supabase) throw new Error('Database unavailable')

  // Confirm the week is still open before accepting the pick
  const { data: week, error: weekError } = await supabase
    .from('weeks')
    .select('status, locks_at')
    .eq('id', weekId)
    .single()

  if (weekError || !week) throw new Error('Week not found')
  if (week.status !== 'open') throw new PickError('Picks are locked', 403)

  // Don't rely on an admin flipping the status in time: the lock time is binding
  if (new Date(week.locks_at).getTime() <= Date.now()) throw new PickError('Picks are locked', 403)

  // The question must belong to the week the pick is filed under
  const { data: question, error: questionError } = await supabase
    .from('questions')
    .select('id')
    .eq('id', questionId)
    .eq('week_id', weekId)
    .maybeSingle()

  if (questionError) throw new Error(questionError.message)
  if (!question) throw new PickError('Question does not belong to this week', 400)

  const { data, error } = await supabase
    .from('picks')
    .upsert(
      {
        user_id: userId,
        question_id: questionId,
        week_id: weekId,
        answer: answer ?? null,
        tiebreaker_guess: tiebreakerGuess ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,question_id' }
    )
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}
