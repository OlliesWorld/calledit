import 'server-only'
import Anthropic from '@anthropic-ai/sdk'
import { createAdminClient } from '@/lib/supabase/admin'
import { isLeague, LEAGUE_LABELS } from '@/lib/leagues'
import { getScheduleSource } from '@/lib/schedule'
import { buildPrompt } from './prompt'
import { parseGeneratedQuestions } from './parse'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function generateQuestions(weekId: string, startDate: string, endDate: string) {
  const supabase = createAdminClient()
  if (!supabase) throw new Error('Database unavailable')

  // The league comes from the week row, never from the client.
  const { data: week, error: weekError } = await supabase
    .from('weeks')
    .select('league')
    .eq('id', weekId)
    .single()

  if (weekError || !week) throw new Error('Week not found')
  if (!isLeague(week.league)) throw new Error(`Unknown league on week: ${week.league}`)
  const league = week.league

  const games = await getScheduleSource(league).getGames(startDate, endDate)
  if (games.length === 0) {
    throw new Error(`No ${LEAGUE_LABELS[league]} games found for this date range`)
  }

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{ role: 'user', content: buildPrompt(league, games) }],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text : ''

  // Throws with a clear message on bad JSON or the wrong shape, before any
  // rows are written.
  const parsed = parseGeneratedQuestions(raw)

  const rows = [...parsed.questions, parsed.tiebreaker].map((q, i) => ({
    week_id: weekId,
    question_text: q.question_text,
    flavor_text: q.flavor_text,
    question_type: q.question_type,
    player_name: q.player_name,
    game_id: q.game_id,
    display_order: i,
  }))

  const { error } = await supabase.from('questions').insert(rows)
  if (error) throw new Error(error.message)

  return rows.length
}
