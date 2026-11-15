'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/config/site'
import {
  LEAGUE_DISCLAIMERS,
  LEAGUE_LABELS,
  leagueFromPathname,
  leagueLeaderboardPath,
  leaguePicksPath,
} from '@/lib/leagues'

const tabs = [
  {
    name: 'Picks',
    href: '/dashboard',
    icon: (active: boolean) => (
      <svg className="h-6 w-6" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    name: 'Board',
    href: '/leaderboard',
    icon: (active: boolean) => (
      <svg className="h-6 w-6" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    name: 'Me',
    href: '/profile',
    icon: (active: boolean) => (
      <svg className="h-6 w-6" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
]

export function BottomNav({ isAdmin }: { isAdmin?: boolean }) {
  const pathname = usePathname()
  // On a league page, Picks and Board stay inside that league. Elsewhere they
  // use the legacy URLs, which redirect to the last-used league.
  const league = leagueFromPathname(pathname)

  const allTabs = [
    ...tabs.map((tab) => {
      if (!league) return tab
      if (tab.href === '/dashboard') return { ...tab, href: leaguePicksPath(league) }
      if (tab.href === '/leaderboard') return { ...tab, href: leagueLeaderboardPath(league) }
      return tab
    }),
    ...(isAdmin ? [{
      name: 'Admin',
      href: '/admin',
      icon: (active: boolean) => (
        <svg className="h-6 w-6" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    }] : []),
  ]

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-[#111114] border-t border-white/[0.08]">
      <div className="max-w-107.5 mx-auto flex">
        {allTabs.map((tab) => {
          // The picks tab only matches its exact path (a league's picks URL is a prefix of its leaderboard URL)
          const isPicksTab = tab.name === 'Picks'
          const isActive = isPicksTab ? pathname === tab.href : pathname.startsWith(tab.href)
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                'flex-1 flex flex-col items-center gap-1 pt-3 pb-2 text-[10px] font-(family-name:--font-dm-mono) uppercase tracking-widest transition-colors',
                isActive ? 'text-orange' : 'text-white/40 hover:text-white/70'
              )}
            >
              {tab.icon(isActive)}
              {tab.name}
            </Link>
          )
        })}
      </div>

      {/* Footer text lives here rather than in a separate page footer */}
      <div className="max-w-107.5 mx-auto px-4 pb-2 text-center text-[10px] leading-relaxed">
        <p className="text-white/70">
          {league ? `${LEAGUE_LABELS[league]} pick\u2019em` : siteConfig.tagline}
          {league && LEAGUE_DISCLAIMERS[league] && <> · {LEAGUE_DISCLAIMERS[league]}</>}
        </p>
        <p className="text-white/50">
          © {new Date().getFullYear()} {siteConfig.name} ·{' '}
          <Link href="#" className="hover:text-white transition-colors">Privacy</Link> ·{' '}
          <Link href="#" className="hover:text-white transition-colors">Terms</Link>
        </p>
      </div>
    </nav>
  )
}
