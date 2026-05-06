import * as React from 'react'
import { cn } from '@/lib/utils'
import type { CtaCardProps } from '../types'

const CtaCard = React.forwardRef<HTMLDivElement, CtaCardProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'relative bg-[#2C2825] rounded-[3rem] p-16 md:p-24 overflow-hidden shadow-2xl',
        className
      )}
      {...props}
    >
      {/* Soft Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />

      <div className="relative z-10">{children}</div>
    </div>
  )
)
CtaCard.displayName = 'CtaCard'

export { CtaCard }
