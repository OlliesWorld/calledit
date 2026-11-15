import 'server-only'
import type { Game, ScheduleSource } from './types'

// Longest range we will fan out over. A week is 7 days; this is a guard
// against a mistyped date turning into hundreds of requests.
const MAX_RANGE_DAYS = 31

/** Every calendar day from startDate to endDate inclusive, as YYYYMMDD. */
function daysInRange(startDate: string, endDate: string): string[] {
  const start = Date.parse(`${startDate}T00:00:00Z`)
  const end = Date.parse(`${endDate}T00:00:00Z`)
  if (Number.isNaN(start) || Number.isNaN(end)) throw new Error('Schedule dates must be YYYY-MM-DD')
  if (end < start) return []

  const DAY_MS = 24 * 60 * 60 * 1000
  const count = Math.round((end - start) / DAY_MS) + 1
  if (count > MAX_RANGE_DAYS) {
    throw new Error(`Date range too long for the ESPN schedule (${count} days, max ${MAX_RANGE_DAYS})`)
  }

  return Array.from({ length: count }, (_, i) =>
    new Date(start + i * DAY_MS).toISOString().slice(0, 10).replace(/-/g, '')
  )
}

// ESPN's scoreboard rejects `dates=START-END` ranges with a 400 ("Failed to
// get events endpoint"), while single days work. So ask for each day in the
// range and merge.
async function fetchWnbaSchedule(startDate: string, endDate: string): Promise<Game[]> {
  const perDay = await Promise.all(daysInRange(startDate, endDate).map(fetchWnbaDay))

  const seen = new Set<string>()
  return perDay
    .flat()
    .filter((game) => (seen.has(game.id) ? false : (seen.add(game.id), true)))
    .sort((a, b) => (a.tipoff ?? '').localeCompare(b.tipoff ?? ''))
}

async function fetchWnbaDay(day: string): Promise<Game[]> {
  const url = `https://site.api.espn.com/apis/site/v2/sports/basketball/wnba/scoreboard?dates=${day}&limit=50`

  const res = await fetch(url, { next: { revalidate: 0 } })
  if (!res.ok) throw new Error(`ESPN API error: ${res.status}`)

  const data = await res.json()
  const events = data.events ?? []

  return events.map((event: Record<string, unknown>) => {
    const competition = (event.competitions as Record<string, unknown>[])?.[0]
    const competitors = (competition?.competitors as Record<string, unknown>[]) ?? []
    const home = competitors.find((c: Record<string, unknown>) => c.homeAway === 'home')
    const away = competitors.find((c: Record<string, unknown>) => c.homeAway === 'away')

    return {
      id: event.id as string,
      date: (event.date as string)?.split('T')[0] ?? '',
      homeTeam: (home?.team as Record<string, unknown>)?.displayName as string ?? 'Home',
      awayTeam: (away?.team as Record<string, unknown>)?.displayName as string ?? 'Away',
      tipoff: event.date as string,
    }
  })
}

/** WNBA schedule from ESPN's public scoreboard endpoint. */
export const espnSource: ScheduleSource = {
  getGames: fetchWnbaSchedule,
}
