import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'
import type { WeekWithQuestions, Pick } from '@/types/calledit'

export async function getActiveWeek(): Promise<WeekWithQuestions | null> {
  const supabase = createAdminClient()
  if (!supabase) return null

  const { data: week, error } = await supabase
    .from('weeks')
    .select('*')
    .in('status', ['open', 'upcoming'])
    .order('starts_at', { ascending: true })
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
