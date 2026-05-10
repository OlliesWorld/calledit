import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { LeaderboardTable } from '@/components/leaderboard/leaderboard-table'

export const dynamic = 'force-dynamic'

export default async function LeaderboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/login')

  return <LeaderboardTable currentUserId={userId} />
}
