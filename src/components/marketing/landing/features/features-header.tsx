import * as React from 'react'
import { cn } from '@/lib/utils'
import { SectionBadge, SectionHeading } from '../shared'
import type { BaseComponentProps } from '../types'

interface FeaturesHeaderProps extends BaseComponentProps {
  badge?: {
    icon?: React.ReactNode
    text: string
  }
  title?: {
    line1: string
    line2: string
  }
  subtitle?: string
}

const FeaturesHeader = React.forwardRef<HTMLDivElement, FeaturesHeaderProps>(
  (
    {
      className,
      badge = { text: 'Built for speed' },
      title = { line1: 'Everything pre-configured,', line2: 'ready to customize.' },
      subtitle = "Stop integrating APIs and configuring tools. This starter kit gives you the complete setup you need to build and ship your app fast.",
      ...props
    },
    ref
  ) => (
    <div ref={ref} className={cn('text-center mb-12', className)} {...props}>
      <SectionBadge icon={badge.icon} className="mb-6">
        {badge.text}
      </SectionBadge>
      <SectionHeading line1={title.line1} line2={title.line2} />
      <p className="text-xl text-stone-600 max-w-3xl mx-auto font-light leading-relaxed">
        {subtitle}
      </p>
    </div>
  )
)
FeaturesHeader.displayName = 'FeaturesHeader'

export { FeaturesHeader }
export type { FeaturesHeaderProps }
