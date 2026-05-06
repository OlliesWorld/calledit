import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PricingFeatureListProps } from '../types'

const PricingFeatureList = React.forwardRef<HTMLUListElement, PricingFeatureListProps>(
  ({ className, features, ...props }, ref) => (
    <ul ref={ref} className={cn('space-y-4', className)} {...props}>
      {features.map((feature, index) => (
        <li key={index} className="flex items-start gap-3 text-stone-300">
          <div className="w-6 h-6 rounded-full bg-stone-800 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 text-[#E07A5F]" />
          </div>
          <span className="text-lg">{feature}</span>
        </li>
      ))}
    </ul>
  )
)
PricingFeatureList.displayName = 'PricingFeatureList'

export { PricingFeatureList }
