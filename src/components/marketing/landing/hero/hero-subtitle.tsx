import * as React from 'react'
import { cn } from '@/lib/utils'
import type { HeroSubtitleProps } from '../types'

const HeroSubtitle = React.forwardRef<HTMLParagraphElement, HeroSubtitleProps>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        'text-xl md:text-2xl text-stone-600 max-w-2xl mx-auto lg:mx-0 mb-12 leading-relaxed animate-fade-in-up delay-200 font-light',
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
)
HeroSubtitle.displayName = 'HeroSubtitle'

export { HeroSubtitle }
