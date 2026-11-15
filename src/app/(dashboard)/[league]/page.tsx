import { auth } from '@clerk/nextjs/server'
import { notFound, redirect } from 'next/navigation'
import { getActiveWeek, getPicksForUser } from '@/lib/picks/server'
import { PicksForm } from '@/components/picks/picks-form'
import { isLeague } from '@/lib/leagues'

export const dynamic = 'force-dynamic'

export default async function LeaguePicksPage({
  params,
}: {
  params: Promise<{ league: string }>
}) {
  const { league } = await params
  if (!isLeague(league)) notFound()

  const { userId } = await auth()
  if (!userId) redirect('/login')

  const week = await getActiveWeek(league)
  const picks = week ? await getPicksForUser(week.id, userId) : []

  if (!week) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="font-(family-name:--font-bebas) text-3xl text-white/30 tracking-wide">
          Next week dropping soon
        </p>
        <p className="text-[13px] text-white/25 mt-2">Check back in a bit</p>
      </div>
    )
  }

  return <PicksForm week={week} initialPicks={picks} />
}
