import { NextRequest, NextResponse } from 'next/server'
import { leagueFromSearchParams } from '@/lib/leagues'
import { createAdminClient } from '@/lib/supabase/admin'

function resolveDisplayName(
  profile: { full_name: string | null; username: string | null } | undefined,
  userId: string,
): string {
  if (profile?.username) return profile.username
  if (profile?.full_name) return profile.full_name
  return `Player ${userId.slice(-4).toUpperCase()}`
}

export async function GET(req: NextRequest) {
  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 })

  const league = leagueFromSearchParams(req.nextUrl.searchParams)
  if (!league) return NextResponse.json({ error: 'Unknown league' }, { status: 400 })

  // Get all scored weeks for this league
  const { data: scoredWeeks } = await supabase
    .from('weeks')
    .select('id')
    .eq('league', league)
    .eq('status', 'scored')

  if (!scoredWeeks || scoredWeeks.length === 0) {
    return NextResponse.json({ entries: [] })
  }

  const weekIds = scoredWeeks.map((w) => w.id)

  // Get all pick-type picks across scored weeks (exclude tiebreakers from score)
  const { data: picks } = await supabase
    .from('picks')
    .select('user_id, question_id, is_correct, week_id')
    .in('week_id', weekIds)

  if (!picks || picks.length === 0) {
    return NextResponse.json({ entries: [] })
  }

  // Get all pick-type question IDs so we can filter out tiebreakers
  const { data: questions } = await supabase
    .from('questions')
    .select('id, question_type')
    .in('week_id', weekIds)
    .eq('question_type', 'pick')

  const pickQuestionIds = new Set((questions ?? []).map((q) => q.id))

  // Aggregate by user: total correct picks + distinct weeks played
  const userMap = new Map<string, { correct: number; weeks: Set<string> }>()
  for (const pick of picks) {
    if (!pickQuestionIds.has(pick.question_id)) continue
    if (!userMap.has(pick.user_id)) {
      userMap.set(pick.user_id, { correct: 0, weeks: new Set() })
    }
    const entry = userMap.get(pick.user_id)!
    if (pick.is_correct === true) entry.correct += 1
    entry.weeks.add(pick.week_id)
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
      avatar_seed: profileMap.get(userId)?.username ?? userId,
      total_correct: data.correct,
      weeks_played: data.weeks.size,
    }))
    .sort((a, b) => b.total_correct - a.total_correct)

  let rank = 1
  const entries = sorted.map((entry, i) => {
    if (i > 0 && sorted[i - 1].total_correct !== entry.total_correct) rank = i + 1
    return { ...entry, rank }
  })

  return NextResponse.json({ entries })
}
