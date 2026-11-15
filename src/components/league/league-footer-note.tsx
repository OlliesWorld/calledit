import { siteConfig } from '@/config/site'
import { LEAGUE_DISCLAIMERS, leagueTagline, type League } from '@/lib/leagues'

/**
 * Small footer for league pages. Only leagues with a disclaimer get one, so
 * WNBA pages render exactly as they did before leagues existed.
 */
export function LeagueFooterNote({ league }: { league: League }) {
  const disclaimer = LEAGUE_DISCLAIMERS[league]
  if (!disclaimer) return null

  return (
    <footer className="mt-10 border-t border-white/8 pt-5 text-center space-y-1">
      <p className="text-white/30 text-xs leading-relaxed">
        {siteConfig.name} · {leagueTagline(league)}
      </p>
      <p className="text-white/40 text-xs leading-relaxed">{disclaimer}</p>
    </footer>
  )
}
