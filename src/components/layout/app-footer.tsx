'use client'

import { usePathname } from 'next/navigation'
import { leagueFromPathname } from '@/lib/leagues'
import { Footer } from './footer'

/**
 * Footer for the signed-in app. Takes its league from the URL: league pages
 * get that league's tagline (and disclaimer); other pages get a neutral one.
 */
export function AppFooter({ className }: { className?: string }) {
  const league = leagueFromPathname(usePathname())
  return <Footer league={league} variant="compact" className={className} />
}
