import * as React from 'react'
import { cn } from '@/lib/utils'
import type { TechStackOrbitProps } from '../types'

const TechStackOrbit = React.forwardRef<HTMLDivElement, TechStackOrbitProps>(
  ({ className, children, centerContent, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative hidden lg:block animate-fade-in-up delay-400', className)}
      {...props}
    >
      <div className="relative w-full h-[600px]">
        {/* Central Circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border-2 border-dashed border-stone-200" />

        {/* Tech Stack Items */}
        {children}

        {/* Center Content */}
        {centerContent && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            {centerContent}
          </div>
        )}
      </div>
    </div>
  )
)
TechStackOrbit.displayName = 'TechStackOrbit'

export { TechStackOrbit }
