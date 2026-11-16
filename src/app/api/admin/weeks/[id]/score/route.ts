import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/admin'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 })

  const { id } = await params
  const body = await req.json().catch(() => null)
  const answers = body?.answers
  const tiebreakerAnswer = body?.tiebreakerAnswer
  const validAnswers =
    answers && typeof answers === 'object' && !Array.isArray(answers) &&
    Object.values(answers).every((v) => typeof v === 'boolean')
  const validTiebreaker = tiebreakerAnswer === undefined || (typeof tiebreakerAnswer === 'number' && Number.isFinite(tiebreakerAnswer))
  if (!validAnswers || !validTiebreaker) {
    return NextResponse.json({ error: 'answers must map question ids to true/false; tiebreakerAnswer must be a number' }, { status: 400 })
  }
  // answers: { [questionId]: boolean }
  // tiebreakerAnswer: number

  // Update correct_answer on each pick question and bulk-update picks.is_correct
  for (const [questionId, correctAnswer] of Object.entries(answers as Record<string, boolean>)) {
    await supabase
      .from('questions')
      .update({ correct_answer: correctAnswer })
      .eq('id', questionId)
      .eq('week_id', id)

    await supabase
      .from('picks')
      .update({ is_correct: false })
      .eq('question_id', questionId)
      .eq('week_id', id)

    await supabase
      .from('picks')
      .update({ is_correct: true })
      .eq('question_id', questionId)
      .eq('week_id', id)
      .eq('answer', correctAnswer)
  }

  // Update tiebreaker answer
  if (tiebreakerAnswer !== undefined) {
    await supabase
      .from('questions')
      .update({ tiebreaker_answer: tiebreakerAnswer })
      .eq('week_id', id)
      .eq('question_type', 'tiebreaker')
  }

  // Mark week as scored
  await supabase
    .from('weeks')
    .update({ status: 'scored', scored_at: new Date().toISOString() })
    .eq('id', id)

  return NextResponse.json({ ok: true })
}
