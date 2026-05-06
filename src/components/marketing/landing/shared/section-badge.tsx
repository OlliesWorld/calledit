import * as React from 'react'
import { cn } from '@/lib/utils'
import type { SectionBadgeProps } from '../types'

const SectionBadge = React.forwardRef<HTMLDivElement, SectionBadgeProps>(
  ({ className, children, icon, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-stone-100 shadow-sm text-stone-600 text-sm font-medium',
        className
      )}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </div>
  )
)
SectionBadge.displayName = 'SectionBadge'

export { SectionBadge }
