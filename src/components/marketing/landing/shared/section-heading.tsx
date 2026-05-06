import * as React from 'react'
import { cn } from '@/lib/utils'
import type { SectionHeadingProps } from '../types'

const SectionHeading = React.forwardRef<HTMLHeadingElement, SectionHeadingProps>(
  ({ className, line1, line2, highlightColor = 'text-[#E07A5F]', ...props }, ref) => (
    <h2
      ref={ref}
      className={cn('text-4xl md:text-5xl font-bold text-[#3D3D3D] mb-6 leading-tight', className)}
      {...props}
    >
      {line1}
      <br />
      <span className={highlightColor}>{line2}</span>
    </h2>
  )
)
SectionHeading.displayName = 'SectionHeading'

export { SectionHeading }
