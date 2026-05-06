import * as React from 'react'
import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CheckItemProps } from '../types'

const CheckItem = React.forwardRef<HTMLLIElement, CheckItemProps>(
  ({ className, children, iconBg = 'bg-emerald-100', iconColor = 'text-emerald-600', ...props }, ref) => (
    <li
      ref={ref}
      className={cn('flex items-center gap-3 text-stone-700', className)}
      {...props}
    >
      <div className={cn('w-6 h-6 rounded-full flex items-center justify-center shrink-0', iconBg)}>
        <CheckCircle2 className={cn('w-4 h-4', iconColor)} />
      </div>
      <span>{children}</span>
    </li>
  )
)
CheckItem.displayName = 'CheckItem'

export { CheckItem }
