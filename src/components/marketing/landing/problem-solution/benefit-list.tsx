import * as React from 'react'
import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BenefitListProps } from '../types'

const BenefitList = React.forwardRef<HTMLUListElement, BenefitListProps>(
  ({ className, items, iconColor = 'text-emerald-600', ...props }, ref) => (
    <ul ref={ref} className={cn('space-y-4', className)} {...props}>
      {items.map((item, index) => (
        <li key={index} className="flex items-center gap-3 text-stone-700">
          <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <CheckCircle2 className={cn('w-4 h-4', iconColor)} />
          </div>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
)
BenefitList.displayName = 'BenefitList'

export { BenefitList }
