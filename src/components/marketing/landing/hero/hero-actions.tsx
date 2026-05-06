import * as React from 'react'
import { cn } from '@/lib/utils'
import type { HeroActionsProps } from '../types'

const alignmentClasses = {
  left: 'justify-center lg:justify-start',
  center: 'justify-center',
  right: 'justify-center lg:justify-end',
}

const HeroActions = React.forwardRef<HTMLDivElement, HeroActionsProps>(
  ({ className, children, alignment = 'left', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col sm:flex-row items-center lg:items-start gap-4 animate-fade-in-up delay-300',
        alignmentClasses[alignment],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
HeroActions.displayName = 'HeroActions'

export { HeroActions }
