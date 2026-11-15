import { LEAGUE_COOKIE, LEAGUE_COOKIE_MAX_AGE, type League } from '@/lib/leagues'

/** Client-side: remember the league so /dashboard and /leaderboard can redirect to it. */
export function rememberLeague(league: League) {
  document.cookie = `${LEAGUE_COOKIE}=${league}; path=/; max-age=${LEAGUE_COOKIE_MAX_AGE}; samesite=lax`
}
