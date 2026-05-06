import * as React from 'react'
import { cn } from '@/lib/utils'
import type { ProviderBadgesProps } from '../types'

const ProviderBadges = React.forwardRef<HTMLDivElement, ProviderBadgesProps>(
  ({ className, providers, label = 'Supported Providers:', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'mt-8 pt-6 border-t border-stone-700 flex items-center justify-between gap-4',
        className
      )}
      {...props}
    >
      <div className="text-stone-500 text-xs">{label}</div>
      <div className="flex gap-3">
        {providers.map((provider) => (
          <span
            key={provider}
            className="px-2 py-1 rounded bg-stone-800 text-stone-300 text-xs border border-stone-700"
          >
            {provider}
          </span>
        ))}
      </div>
    </div>
  )
)
ProviderBadges.displayName = 'ProviderBadges'

export { ProviderBadges }
