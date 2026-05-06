import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'

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
    .select('status')
    .eq('id', weekId)
    .single()

  if (weekError || !week) throw new Error('Week not found')
  if (week.status !== 'open') throw new Error('Picks are locked')

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
