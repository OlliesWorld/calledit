import * as React from 'react'
import { cn } from '@/lib/utils'
import type { TechStackCardProps } from '../types'

const positionClasses = {
  top: 'top-8 left-1/2 -translate-x-1/2',
  'top-right': 'top-24 right-12',
  right: 'top-1/2 -translate-y-1/2 right-0',
  'bottom-right': 'bottom-24 right-12',
  bottom: 'bottom-8 left-1/2 -translate-x-1/2',
  'bottom-left': 'bottom-24 left-12',
  left: 'top-1/2 -translate-y-1/2 left-0',
  'top-left': 'top-24 left-12',
}

const TechStackCard = React.forwardRef<HTMLDivElement, TechStackCardProps>(
  ({ className, icon, title, subtitle, color, position, delay = '', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'absolute animate-fade-in-up',
        position && positionClasses[position],
        delay,
        className
      )}
      {...props}
    >
      <div className="bg-white rounded-2xl p-4 shadow-lg border border-stone-100 hover:shadow-xl transition-all hover:-translate-y-1">
        <div className="flex items-center gap-3">
          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', color)}>
            {icon}
          </div>
          <div>
            <p className="font-bold text-stone-800 text-sm">{title}</p>
            <p className="text-xs text-stone-500">{subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  )
)
TechStackCard.displayName = 'TechStackCard'

export { TechStackCard }
