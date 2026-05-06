import * as React from 'react'
import { cn } from '@/lib/utils'
import type { SectionWrapperProps } from '../types'

const SectionWrapper = React.forwardRef<HTMLElement, SectionWrapperProps>(
  ({ className, children, id, ...props }, ref) => (
    <section
      ref={ref}
      id={id}
      className={cn('py-28 relative', className)}
      {...props}
    >
      {children}
    </section>
  )
)
SectionWrapper.displayName = 'SectionWrapper'

export { SectionWrapper }
