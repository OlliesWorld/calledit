import * as React from 'react'
import { cn } from '@/lib/utils'
import type { ProviderBadgeProps } from '../types'

const ProviderBadge = React.forwardRef<HTMLSpanElement, ProviderBadgeProps>(
  ({ className, provider, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'px-3 py-1.5 bg-[#3D3D3D] rounded-lg text-[#FAF9F6] text-sm font-medium shadow-sm',
        className
      )}
      {...props}
    >
      {provider}
    </span>
  )
)
ProviderBadge.displayName = 'ProviderBadge'

export { ProviderBadge }
