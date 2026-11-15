'use client'

import { useEffect } from 'react'
import type { League } from '@/lib/leagues'
import { rememberLeague } from './remember-league'

/** Renders nothing. Records the league of the page the user is on. */
export function LeagueTracker({ league }: { league: League }) {
  useEffect(() => {
    rememberLeague(league)
  }, [league])

  return null
}
