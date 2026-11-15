import { redirect } from 'next/navigation'
import { leagueLeaderboardPath } from '@/lib/leagues'
import { getPreferredLeague } from '@/lib/leagues-server'

export const dynamic = 'force-dynamic'

// Legacy URL. Leaderboards now live at /[league]/leaderboard.
export default async function LeaderboardPage() {
  redirect(leagueLeaderboardPath(await getPreferredLeague()))
}
