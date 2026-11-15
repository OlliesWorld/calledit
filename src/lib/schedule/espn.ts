import 'server-only'
import type { Game, ScheduleSource } from './types'

async function fetchWnbaSchedule(startDate: string, endDate: string): Promise<Game[]> {
  // Format: YYYYMMDD
  const start = startDate.replace(/-/g, '')
  const end = endDate.replace(/-/g, '')

  const url = `https://site.api.espn.com/apis/site/v2/sports/basketball/wnba/scoreboard?dates=${start}-${end}&limit=50`

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
