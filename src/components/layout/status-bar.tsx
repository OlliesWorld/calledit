'use client'

import Link from 'next/link'
import { siteConfig } from '@/config/site'
import { ROUTES } from '@/constants/routes'
import { UserMenu } from '@/components/ui/user-menu'
import { LeagueSwitcher } from '@/components/league/league-switcher'

export function StatusBar() {
  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-white/8">
      <div className="max-w-107.5 mx-auto px-5 h-14 flex items-center justify-between">
        <Link
          href={ROUTES.DASHBOARD}
          className="font-(family-name:--font-bebas) text-2xl tracking-wide text-orange leading-none"
        >
          {siteConfig.name}
        </Link>

        <div className="flex items-center gap-3">
          <LeagueSwitcher />
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
