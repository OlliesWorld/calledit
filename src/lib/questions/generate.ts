import 'server-only'
import Anthropic from '@anthropic-ai/sdk'
import { fetchWnbaSchedule } from '@/lib/espn/client'
import { createAdminClient } from '@/lib/supabase/admin'
import type { EspnGame } from '@/lib/espn/client'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

interface GeneratedQuestion {
  question_text: string
  flavor_text: string
  question_type: 'pick' | 'tiebreaker'
  player_name?: string | null
  game_id?: string | null
}

function buildPrompt(games: EspnGame[]): string {
  const gameList = games
    .map((g) => `- ${g.awayTeam} at ${g.homeTeam} (${g.date}, game ID: ${g.id})`)
    .join('\n')

  return `Given these upcoming WNBA games:
${gameList}

Generate questions for a weekly pick'em contest.

Return ONLY valid JSON with this exact structure:
{
  "questions": [
    {
      "question_text": "Will A'ja Wilson score 25+ points?",
      "flavor_text": "She's been on a tear — but the defense showing up lately might finally slow her down.",
      "question_type": "pick",
      "player_name": "A'ja Wilson",
      "game_id": "401652345"
    }
  ],
  "tiebreaker": {
    "question_text": "Total combined points in the Las Vegas Aces vs New York Liberty game",
    "flavor_text": "High-scoring rivalry — pick your number.",
    "question_type": "tiebreaker",
    "game_id": "401652345"
  }
}

Rules for pick questions (generate exactly 5):
- Must have a definitive yes/no answer after the game
- Mix of player props (stat thresholds like "25+ points", "8+ assists") and game outcomes (wins, margins)
- Vary difficulty — not all obvious, not all coin flips
- Flavor text: 1-2 sentences, written like a passionate fan, opinionated, fun

Rules for the tiebreaker (generate exactly 1):
- Ask for a specific numeric total (combined points, total rebounds, etc.)
- Pick one of the matchups above
- Closest without going over wins

Return only the JSON object, no markdown, no explanation.`
}

export async function generateQuestions(weekId: string, startDate: string, endDate: string) {
  const supabase = createAdminClient()
  if (!supabase) throw new Error('Database unavailable')

  const games = await fetchWnbaSchedule(startDate, endDate)
  if (games.length === 0) throw new Error('No WNBA games found for this date range')

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{ role: 'user', content: buildPrompt(games) }],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text : ''

  let parsed: { questions: GeneratedQuestion[]; tiebreaker: GeneratedQuestion }
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error('Claude returned invalid JSON')
  }

  const allQuestions: GeneratedQuestion[] = [
    ...parsed.questions,
    parsed.tiebreaker,
  ]

  const rows = allQuestions.map((q, i) => ({
    week_id: weekId,
    question_text: q.question_text,
    flavor_text: q.flavor_text,
    question_type: q.question_type,
    player_name: q.player_name ?? null,
    game_id: q.game_id ?? null,
    display_order: i,
  }))

  const { error } = await supabase.from('questions').insert(rows)
  if (error) throw new Error(error.message)

  return rows.length
}
