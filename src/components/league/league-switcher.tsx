'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LEAGUES,
  LEAGUE_LABELS,
  leagueFromPathname,
  leagueLeaderboardPath,
  leaguePicksPath,
} from '@/lib/leagues'
import { rememberLeague } from './remember-league'

/**
 * Compact league toggle for the status bar. Only shows on league pages, and
 * keeps you on the same view (picks or leaderboard) when you switch.
 */
export function LeagueSwitcher() {
  const pathname = usePathname()
  const current = leagueFromPathname(pathname)
  if (!current) return null

  const onLeaderboard = pathname.startsWith(leagueLeaderboardPath(current))

  return (
    <nav aria-label="League" className="flex items-center">
      {LEAGUES.map((league) => {
        const active = league === current
        return (
          <Link
            key={league}
            href={onLeaderboard ? leagueLeaderboardPath(league) : leaguePicksPath(league)}
            aria-current={active ? 'page' : undefined}
            onClick={() => rememberLeague(league)}
            // 44px tall tap target; the visible pill is the inner span
            className="group inline-flex min-h-11 items-center px-0.5 rounded-[10px] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-white"
          >
            <span
              className={cn(
                'px-2.5 py-1.5 rounded-[8px] text-[10px] font-(family-name:--font-dm-mono) uppercase tracking-widest transition-colors',
                active
                  ? 'bg-orange text-black font-medium'
                  : 'text-white/50 group-hover:text-white group-hover:bg-white/10',
              )}
            >
              {LEAGUE_LABELS[league]}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
