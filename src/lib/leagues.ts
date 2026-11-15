// Single source of truth for the leagues the app knows about.
// Safe to import from both server and client code.
//
// To add a league, see the "Leagues" section of the README. The list here must
// match the weeks_league_check constraint in supabase/migrations.

export const LEAGUES = ['wnba', 'unrivaled'] as const

export type League = (typeof LEAGUES)[number]

export const DEFAULT_LEAGUE: League = 'wnba'

export const LEAGUE_LABELS: Record<League, string> = {
  wnba: 'WNBA',
  unrivaled: 'Unrivaled',
}

/** Shown on league pages for leagues the app has no relationship with. */
export const LEAGUE_DISCLAIMERS: Partial<Record<League, string>> = {
  unrivaled: 'Fan-made. Not affiliated with Unrivaled.',
}

/** Footer tagline, e.g. "WNBA pick'em. Call it. Prove it." */
export function leagueTagline(league: League): string {
  return `${LEAGUE_LABELS[league]} pick'em. Call it. Prove it.`
}

export function isLeague(value: unknown): value is League {
  return typeof value === 'string' && (LEAGUES as readonly string[]).includes(value)
}

/** Narrow an untrusted value to a league, falling back to the default. */
export function toLeague(value: unknown): League {
  return isLeague(value) ? value : DEFAULT_LEAGUE
}

// Remembers the last league the user looked at, so the legacy /dashboard and
// /leaderboard URLs know where to send them.
export const LEAGUE_COOKIE = 'calledit_league'
export const LEAGUE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export function leaguePicksPath(league: League): string {
  return `/${league}`
}

export function leagueLeaderboardPath(league: League): string {
  return `/${league}/leaderboard`
}

/** Returns the league a pathname belongs to, or null for league-agnostic pages. */
export function leagueFromPathname(pathname: string): League | null {
  const first = pathname.split('/')[1]
  return isLeague(first) ? first : null
}

/**
 * Reads `?league=` from an API request. A missing param means the default
 * league (so pre-league callers keep working); an unknown value returns null
 * so the route can answer 400.
 */
export function leagueFromSearchParams(params: URLSearchParams): League | null {
  const raw = params.get('league')
  if (raw === null) return DEFAULT_LEAGUE
  return isLeague(raw) ? raw : null
}
