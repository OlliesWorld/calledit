import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { getActiveWeek } from '@/lib/picks/server'
import { leagueFromSearchParams } from '@/lib/leagues'

export async function GET(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const league = leagueFromSearchParams(req.nextUrl.searchParams)
  if (!league) return NextResponse.json({ error: 'Unknown league' }, { status: 400 })

  const week = await getActiveWeek(league)
  return NextResponse.json(week)
}
