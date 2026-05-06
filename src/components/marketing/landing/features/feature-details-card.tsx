import * as React from 'react'
import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FeatureDetailsCardProps } from '../types'
import { ProviderBadge } from './provider-badge'

const FeatureDetailsCard = React.forwardRef<HTMLDivElement, FeatureDetailsCardProps>(
  ({ className, feature, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'bg-white rounded-[2rem] p-8 md:p-12 border border-stone-100 shadow-sm relative overflow-hidden',
        className
      )}
      {...props}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#E07A5F]/5 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-[#3D3D3D] mb-8 flex items-center gap-3">
          {feature.icon}
          {feature.details.title}
        </h3>

        <ul className="grid md:grid-cols-2 gap-4 mb-8">
          {feature.details.items.map((item, index) => (
            <li key={index} className="flex items-start gap-3 text-stone-600">
              <div className="w-6 h-6 rounded-full bg-[#E07A5F]/10 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-[#E07A5F]" />
              </div>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-stone-100">
          <div className="flex items-center gap-2">
            <span className="text-[#E07A5F] font-medium">Time saved:</span>
            <span className="text-[#3D3D3D] font-bold">{feature.details.timeSaved}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#E07A5F] font-medium">Headaches:</span>
            <span className="text-[#3D3D3D] font-bold">{feature.details.headaches}</span>
          </div>

          {feature.details.providers && feature.details.providers.length > 0 && (
            <div className="flex items-center gap-3 ml-auto">
              <span className="text-stone-400 text-sm">Powered by</span>
              {feature.details.providers.map((provider, index) => (
                <ProviderBadge key={index} provider={provider} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
)
FeatureDetailsCard.displayName = 'FeatureDetailsCard'

export { FeatureDetailsCard }
