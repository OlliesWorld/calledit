// Prompt for weekly question generation: a shared core plus per-league context.
// Pure module (no server-only, no I/O) so the output can be checked directly.
//
// The WNBA output is byte-for-byte what the single-league prompt produced
// before leagues existed. Don't reflow the template without re-checking that.

import type { League } from '@/lib/leagues'
import type { Game } from '@/lib/schedule/types'

interface LeaguePromptContext {
  /** League name as it appears in the opening line. */
  name: string
  /** One schedule line per game. */
  formatGame: (game: Game) => string
  /** Extra league notes placed after the game list. Empty for none. */
  notes: string[]
  /** The JSON example block shown to the model. */
  example: string
  /** Completes "Mix of player props (...) and game outcomes". */
  playerPropHint: string
}

const WNBA_EXAMPLE = `{
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
}`

// Neutral placeholders on purpose: no invented players, stat lines or results.
const UNRIVALED_EXAMPLE = `{
  "questions": [
    {
      "question_text": "Will <Player Name> score <N>+ points?",
      "flavor_text": "<1-2 sentences in a fan's voice>",
      "question_type": "pick",
      "player_name": "<Player Name>",
      "game_id": "<game ID from the list above>"
    }
  ],
  "tiebreaker": {
    "question_text": "Total combined points in the <Team A> vs. <Team B> game",
    "flavor_text": "<1 sentence in a fan's voice>",
    "question_type": "tiebreaker",
    "game_id": "<game ID from the list above>"
  }
}`

const LEAGUE_CONTEXT: Record<League, LeaguePromptContext> = {
  wnba: {
    name: 'WNBA',
    formatGame: (g) => `- ${g.awayTeam} at ${g.homeTeam} (${g.date}, game ID: ${g.id})`,
    notes: [],
    example: WNBA_EXAMPLE,
    playerPropHint: 'stat thresholds like "25+ points", "8+ assists"',
  },
  unrivaled: {
    name: 'Unrivaled',
    // Teams are listed in schedule order; the data has no real home/away.
    formatGame: (g) => `- ${g.homeTeam} vs. ${g.awayTeam} (${g.date}, game ID: ${g.id})`,
    notes: [
      'Unrivaled is a women\'s professional 3-on-3 basketball league.',
      'Games are short and fast, so lean into star players and head-to-head star matchups.',
      'Teams are listed in schedule order. Do not assume either team is the home team.',
      // TODO(roni): add confirmed Unrivaled format/rules notes here (game length,
      // scoring format, how games end). Until then the prompt deliberately
      // states no rules.
      'Do not state or rely on specific game rules, game length or scoring format. Only ask questions that can be settled from the final score or a standard box score.',
      'If you are not sure a player is on one of these teams, ask a game-outcome question instead of a player prop. Set "player_name" to null for questions that are not about one player.',
      'Flavor text is hype and opinion only. Do not claim recent results, records, streaks, form or stats for any team or player.',
      'The JSON structure below uses <placeholders>. Replace every one with real values; never output angle brackets.',
    ],
    example: UNRIVALED_EXAMPLE,
    playerPropHint: 'stat thresholds on points, rebounds or assists',
  },
}

export function buildPrompt(league: League, games: Game[]): string {
  const ctx = LEAGUE_CONTEXT[league]
  const gameList = games.map(ctx.formatGame).join('\n')
  const notes = ctx.notes.length
    ? `\nLeague context:\n${ctx.notes.map((n) => `- ${n}`).join('\n')}\n`
    : ''

  return `Given these upcoming ${ctx.name} games:
${gameList}
${notes}
Generate questions for a weekly pick'em contest.

Return ONLY valid JSON with this exact structure:
${ctx.example}

Rules for pick questions (generate exactly 5):
- Must have a definitive yes/no answer after the game
- Mix of player props (${ctx.playerPropHint}) and game outcomes (wins, margins)
- Vary difficulty — not all obvious, not all coin flips
- Flavor text: 1-2 sentences, written like a passionate fan, opinionated, fun

Rules for the tiebreaker (generate exactly 1):
- Ask for a specific numeric total (combined points, total rebounds, etc.)
- Pick one of the matchups above
- Closest without going over wins

Return only the JSON object, no markdown, no explanation.`
}
