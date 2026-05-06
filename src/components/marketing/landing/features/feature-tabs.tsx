'use client'

import * as React from 'react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { FeatureTabsProps, FeatureKey } from '../types'
import { FeatureTabButton } from './feature-tab-button'
import { FeatureDetailsCard } from './feature-details-card'

const FeatureTabs = React.forwardRef<HTMLDivElement, FeatureTabsProps>(
  ({ className, features, defaultFeature, onFeatureChange, ...props }, ref) => {
    const featureKeys = Object.keys(features) as FeatureKey[]
    const [activeFeature, setActiveFeature] = useState<FeatureKey>(
      defaultFeature || featureKeys[0]
    )

    const handleFeatureChange = (feature: FeatureKey) => {
      setActiveFeature(feature)
      onFeatureChange?.(feature)
    }

    return (
      <div ref={ref} className={cn('', className)} {...props}>
        {/* Feature Tab Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {featureKeys.map((key) => (
            <FeatureTabButton
              key={key}
              icon={features[key].icon}
              label={features[key].label}
              active={activeFeature === key}
              onClick={() => handleFeatureChange(key)}
            />
          ))}
        </div>

        {/* Feature Details */}
        <FeatureDetailsCard feature={features[activeFeature]} />
      </div>
    )
  }
)
FeatureTabs.displayName = 'FeatureTabs'

export { FeatureTabs }
