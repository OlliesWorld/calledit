import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

function resolveDisplayName(
  profile: { full_name: string | null; username: string | null } | undefined,
  userId: string,
): string {
  if (profile?.username) return profile.username
  if (profile?.full_name) return profile.full_name
  return `Player ${userId.slice(-4).toUpperCase()}`
}

// Price-is-Right tiebreaker: closest without going over wins.
// Lower return value = better rank.
function tiebreakerSortKey(guess: number | null, answer: number | null): number {
  if (answer === null || guess === null) return 2_000_000
  if (guess <= answer) return answer - guess
  return 1_000_000 + (guess - answer)
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ weekId: string }> },
) {
  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 })

  const { weekId } = await params

  // Support "latest" as a special value for the most recently scored week
  let week: Record<string, unknown> | null = null
  if (weekId === 'latest') {
    const { data } = await supabase
      .from('weeks')
      .select('*')
      .eq('status', 'scored')
      .order('scored_at', { ascending: false })
      .limit(1)
      .single()
    week = data
  } else {
    const { data } = await supabase.from('weeks').select('*').eq('id', weekId).single()
    week = data
  }

  // Always return the scored weeks list for the week selector
  const { data: scoredWeeks } = await supabase
    .from('weeks')
    .select('id, week_number, title, scored_at')
    .eq('status', 'scored')
    .order('week_number', { ascending: false })

  if (!week) {
    return NextResponse.json({ week: null, entries: [], scored_weeks: scoredWeeks ?? [] })
  }

  const weekId_ = week.id as string

  const { data: questions } = await supabase
    .from('questions')
    .select('id, question_type, tiebreaker_answer')
    .eq('week_id', weekId_)

  const qMap = new Map((questions ?? []).map((q) => [q.id, q]))
  const pickCount = (questions ?? []).filter((q) => q.question_type === 'pick').length
  const tiebreakerQ = (questions ?? []).find((q) => q.question_type === 'tiebreaker')
  const tbAnswer =
    tiebreakerQ?.tiebreaker_answer !== null && tiebreakerQ?.tiebreaker_answer !== undefined
      ? Number(tiebreakerQ.tiebreaker_answer)
      : null

  const { data: picks } = await supabase
    .from('picks')
    .select('user_id, question_id, is_correct, tiebreaker_guess')
    .eq('week_id', weekId_)

  if (!picks || picks.length === 0) {
    return NextResponse.json({ week, entries: [], scored_weeks: scoredWeeks ?? [] })
  }

  // Aggregate per user
  const userMap = new Map<string, { score: number; tiebreaker_guess: number | null }>()
  for (const pick of picks) {
    const q = qMap.get(pick.question_id)
    if (!q) continue
    if (!userMap.has(pick.user_id)) {
      userMap.set(pick.user_id, { score: 0, tiebreaker_guess: null })
    }
    const entry = userMap.get(pick.user_id)!
    if (q.question_type === 'pick' && pick.is_correct === true) entry.score += 1
    if (q.question_type === 'tiebreaker' && pick.tiebreaker_guess !== null) {
      entry.tiebreaker_guess = Number(pick.tiebreaker_guess)
    }
  }

  const userIds = Array.from(userMap.keys())
  const { data: profiles } = await supabase
    .from('profiles')
    .select('user_id, full_name, username, avatar_url')
    .in('user_id', userIds)

  const profileMap = new Map((profiles ?? []).map((p) => [p.user_id, p]))

  const sorted = Array.from(userMap.entries())
    .map(([userId, data]) => ({
      user_id: userId,
      display_name: resolveDisplayName(profileMap.get(userId), userId),
      avatar_url: profileMap.get(userId)?.avatar_url ?? null,
      score: data.score,
      total_pick_questions: pickCount,
      tiebreaker_guess: data.tiebreaker_guess,
      tiebreaker_answer: tbAnswer,
    }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return (
        tiebreakerSortKey(a.tiebreaker_guess, tbAnswer) -
        tiebreakerSortKey(b.tiebreaker_guess, tbAnswer)
      )
    })

  // Assign ranks, sharing rank on true ties
  let rank = 1
  const entries = sorted.map((entry, i) => {
    if (i > 0) {
      const prev = sorted[i - 1]
      const sameScore = prev.score === entry.score
      const sameTb =
        tiebreakerSortKey(prev.tiebreaker_guess, tbAnswer) ===
        tiebreakerSortKey(entry.tiebreaker_guess, tbAnswer)
      if (!sameScore || !sameTb) rank = i + 1
    }
    return { ...entry, rank }
  })

  return NextResponse.json({ week, entries, scored_weeks: scoredWeeks ?? [] })
}
