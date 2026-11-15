import { notFound } from 'next/navigation'
import { isLeague } from '@/lib/leagues'
import { LeagueTracker } from '@/components/league/league-tracker'
import { LeagueFooterNote } from '@/components/league/league-footer-note'

export default async function LeagueLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ league: string }>
}) {
  const { league } = await params
  if (!isLeague(league)) notFound()

  return (
    <>
      <LeagueTracker league={league} />
      {children}
      <LeagueFooterNote league={league} />
    </>
  )
}
