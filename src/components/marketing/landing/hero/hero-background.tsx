import * as React from 'react'
import { cn } from '@/lib/utils'
import type { HeroBackgroundProps } from '../types'

const defaultColors = ['bg-orange-100/40', 'bg-rose-100/40', 'bg-amber-100/40']

const HeroBackground = React.forwardRef<HTMLDivElement, HeroBackgroundProps>(
  ({ className, colors = defaultColors, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 pointer-events-none',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl mix-blend-multiply animate-blob',
          colors[0]
        )}
      />
      <div
        className={cn(
          'absolute top-20 right-10 w-96 h-96 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000',
          colors[1]
        )}
      />
      <div
        className={cn(
          'absolute -bottom-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-4000',
          colors[2]
        )}
      />
    </div>
  )
)
HeroBackground.displayName = 'HeroBackground'

export { HeroBackground }
