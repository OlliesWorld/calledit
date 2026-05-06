'use client'

import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { siteConfig } from '@/config/site'
import { ROUTES } from '@/constants/routes'

export function StatusBar() {
  return (
    <header className="sticky top-0 z-50 bg-[#111114] border-b border-white/[0.08]">
      <div className="max-w-107.5 mx-auto px-5 h-14 flex items-center justify-between">
        <Link
          href={ROUTES.DASHBOARD}
          className="font-(family-name:--font-bebas) text-2xl tracking-wide text-white hover:text-orange leading-none"
        >
          {siteConfig.name}
        </Link>

        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: 'w-8 h-8',
            },
          }}
        />
      </div>
    </header>
  )
}
