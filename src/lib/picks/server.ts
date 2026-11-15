import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'
import type { League } from '@/lib/leagues'
import type { WeekWithQuestions, Pick } from '@/types/calledit'

export async function getActiveWeek(league: League): Promise<WeekWithQuestions | null> {
  const supabase = createAdminClient()
  if (!supabase) return null

  const nowIso = new Date().toISOString()
  const { data: week, error } = await supabase
    .from('weeks')
    .select('*')
    .eq('league', league)
    .in('status', ['open', 'upcoming'])
    .lte('starts_at', nowIso)
    .gt('locks_at', nowIso)
    .order('starts_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !week) return null

  const { data: questions, error: qError } = await supabase
    .from('questions')
    .select('*')
    .eq('week_id', week.id)
    .order('display_order', { ascending: true })

  if (qError) return null

  return { ...week, questions: questions ?? [] }
}

export async function getQuestionsForWeek(weekId: string) {
  const supabase = createAdminClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('week_id', weekId)
    .order('display_order', { ascending: true })

  if (error) return []
  return data ?? []
}

export async function getPicksForUser(weekId: string, userId: string): Promise<Pick[]> {
  const supabase = createAdminClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('picks')
    .select('*')
    .eq('week_id', weekId)
    .eq('user_id', userId)

  if (error) return []
  return data ?? []
}
