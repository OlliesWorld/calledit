import * as React from 'react'
import { cn } from '@/lib/utils'
import type { HeroBadgeProps } from '../types'

const HeroBadge = React.forwardRef<HTMLDivElement, HeroBadgeProps>(
  ({ className, children, icon, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-stone-100 shadow-sm text-stone-600 text-sm font-medium mb-8 animate-fade-in-up hover:shadow-md transition-shadow duration-300 cursor-default',
        className
      )}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </div>
  )
)
HeroBadge.displayName = 'HeroBadge'

export { HeroBadge }
