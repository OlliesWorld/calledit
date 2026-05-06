import * as React from 'react'
import { cn } from '@/lib/utils'
import type { BenefitCardProps } from '../types'

const BenefitCard = React.forwardRef<HTMLDivElement, BenefitCardProps>(
  ({ className, icon, title, description, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'bg-white rounded-[2rem] p-8 border border-stone-100 shadow-sm hover:shadow-md transition-all duration-300',
        className
      )}
      {...props}
    >
      <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h4 className="text-xl font-bold text-[#3D3D3D] mb-3">{title}</h4>
      <p className="text-stone-600 leading-relaxed font-light">{description}</p>
    </div>
  )
)
BenefitCard.displayName = 'BenefitCard'

export { BenefitCard }
