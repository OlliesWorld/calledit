'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navigation = [
  {
    name: 'This Week',
    href: '/dashboard',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: 'Leaderboard',
    href: '/leaderboard',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
]

const secondaryNavigation = [
  {
    name: 'Profile',
    href: '/profile',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white lg:pt-20">
      <div className="flex flex-col flex-1 overflow-y-auto px-4 py-6">
        <nav className="flex-1 space-y-1">
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Picks
          </p>
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <span className={cn(isActive ? 'text-orange-600' : 'text-gray-400')}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            )
          })}
        </nav>

        <nav className="mt-8 space-y-1">
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Account
          </p>
          {secondaryNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <span className={cn(isActive ? 'text-orange-600' : 'text-gray-400')}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

export function MobileSidebarToggle() {
  return (
    <button
      type="button"
      className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600"
      aria-label="Open sidebar"
    >
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  )
}
