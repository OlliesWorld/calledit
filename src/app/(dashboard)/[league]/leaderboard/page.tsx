import { auth } from '@clerk/nextjs/server'
import { notFound, redirect } from 'next/navigation'
import { LeaderboardTable } from '@/components/leaderboard/leaderboard-table'
import { isLeague } from '@/lib/leagues'

export const dynamic = 'force-dynamic'

export default async function LeagueLeaderboardPage({
  params,
}: {
  params: Promise<{ league: string }>
}) {
  const { league } = await params
  if (!isLeague(league)) notFound()

  const { userId } = await auth()
  if (!userId) redirect('/login')

  // key: switching league remounts the table so no state leaks across leagues
  return <LeaderboardTable key={league} currentUserId={userId} league={league} />
}
