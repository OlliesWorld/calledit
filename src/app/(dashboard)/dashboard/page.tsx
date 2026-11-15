import { redirect } from 'next/navigation'
import { leaguePicksPath } from '@/lib/leagues'
import { getPreferredLeague } from '@/lib/leagues-server'

export const dynamic = 'force-dynamic'

// Legacy URL. Picks now live at /[league]; send the user to the league they
// last used (default: WNBA). Sign-in is still enforced by src/proxy.ts.
export default async function DashboardPage() {
  redirect(leaguePicksPath(await getPreferredLeague()))
}
