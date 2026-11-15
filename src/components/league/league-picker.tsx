'use client'

import Link from 'next/link'
import { LEAGUES, LEAGUE_LABELS, leaguePicksPath, type League } from '@/lib/leagues'
import { rememberLeague } from './remember-league'

const BLURBS: Record<League, string> = {
  wnba: 'Weekly picks across the league',
  unrivaled: '3-on-3 picks, star against star',
}

/** Homepage "pick your league" choice. Remembers the choice in a cookie. */
export function LeaguePicker() {
  return (
    <div className="space-y-3">
      <p
        id="league-picker-label"
        className="font-(family-name:--font-dm-mono) text-[10px] uppercase tracking-widest text-white/30"
      >
        Pick your league
      </p>
      <ul aria-labelledby="league-picker-label" className="grid grid-cols-2 gap-3">
        {LEAGUES.map((league) => (
          <li key={league}>
            <Link
              href={leaguePicksPath(league)}
              onClick={() => rememberLeague(league)}
              className="flex min-h-[72px] h-full flex-col items-center justify-center gap-1 rounded-[14px] border border-white/10 bg-surface2 px-3 py-3 text-center transition-colors hover:border-orange/60 hover:bg-surface3 active:bg-surface3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
            >
              <span className="font-(family-name:--font-bebas) text-2xl tracking-wide text-white leading-none">
                {LEAGUE_LABELS[league]}
              </span>
              <span className="text-[11px] leading-snug text-white/40">{BLURBS[league]}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
