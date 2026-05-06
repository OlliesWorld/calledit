import * as React from 'react'
import { cn } from '@/lib/utils'
import type { HeroTitleProps } from '../types'

const HeroTitle = React.forwardRef<HTMLHeadingElement, HeroTitleProps>(
  ({ className, line1, line2, underlineColor = 'text-orange-200/60', ...props }, ref) => (
    <h1
      ref={ref}
      className={cn(
        'text-5xl md:text-7xl font-bold tracking-tight text-stone-800 mb-8 leading-[1.1] animate-fade-in-up delay-100',
        className
      )}
      {...props}
    >
      {line1} <br />
      <span className="relative inline-block text-stone-900">
        {line2}
        <svg
          className={cn('absolute -bottom-2 left-0 w-full h-3 -z-10', underlineColor)}
          viewBox="0 0 100 10"
          preserveAspectRatio="none"
        >
          <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
        </svg>
      </span>
    </h1>
  )
)
HeroTitle.displayName = 'HeroTitle'

export { HeroTitle }
