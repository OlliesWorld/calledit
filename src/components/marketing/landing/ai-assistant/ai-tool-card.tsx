import * as React from 'react'
import { Code2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AIToolCardProps } from '../types'

const AIToolCard = React.forwardRef<HTMLDivElement, AIToolCardProps>(
  ({ className, name, description, icon, isSpecial = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl p-6 text-center transition-all duration-300',
        isSpecial
          ? 'bg-[#3D3D3D] text-[#FAF9F6] shadow-lg hover:-translate-y-1'
          : 'bg-white border border-stone-100 hover:border-[#E07A5F]/30 hover:shadow-md hover:-translate-y-1',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4',
          isSpecial ? 'bg-white/10' : 'bg-stone-50'
        )}
      >
        {icon || <Code2 className={cn('w-6 h-6', isSpecial ? 'text-[#E07A5F]' : 'text-stone-600')} />}
      </div>
      <h4 className={cn('font-bold mb-1 text-sm', isSpecial ? 'text-white' : 'text-[#3D3D3D]')}>
        {name}
      </h4>
      <p className={cn('text-xs', isSpecial ? 'text-stone-400' : 'text-stone-500')}>{description}</p>
    </div>
  )
)
AIToolCard.displayName = 'AIToolCard'

export { AIToolCard }
