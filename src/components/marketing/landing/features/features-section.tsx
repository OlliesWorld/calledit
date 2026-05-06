'use client'

import * as React from 'react'
import { Hammer } from 'lucide-react'
import { cn } from '@/lib/utils'
import { defaultFeatures } from '@/config/landing'
import type { BaseComponentProps, FeatureConfig, FeatureKey } from '../types'
import { SectionWrapper } from '../shared'

import { FeaturesHeader, type FeaturesHeaderProps } from './features-header'
import { FeatureTabs } from './feature-tabs'

interface FeaturesSectionProps extends BaseComponentProps {
  features?: FeatureConfig
  defaultFeature?: FeatureKey
  onFeatureChange?: (feature: FeatureKey) => void
  header?: Omit<FeaturesHeaderProps, 'className'>
}

const FeaturesSection = React.forwardRef<HTMLElement, FeaturesSectionProps>(
  (
    {
      className,
      features = defaultFeatures,
      defaultFeature = 'auth',
      onFeatureChange,
      header,
      ...props
    },
    ref
  ) => (
    <SectionWrapper ref={ref} id="features" className={cn('py-28 relative', className)} {...props}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-[#FAF9F6] rounded-[3rem] p-12 md:p-16 relative overflow-hidden border border-stone-100 shadow-sm">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#E07A5F]/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#91C4F2]/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />

          <div className="relative z-10">
            <FeaturesHeader
              badge={{ icon: <Hammer className="w-4 h-4 text-[#E07A5F]" />, text: 'Built for speed' }}
              {...header}
            />

            <FeatureTabs
              features={features}
              defaultFeature={defaultFeature}
              onFeatureChange={onFeatureChange}
            />
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
)
FeaturesSection.displayName = 'FeaturesSection'

export { FeaturesSection }
export type { FeaturesSectionProps }
