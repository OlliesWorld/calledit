import * as React from 'react'
import { cn } from '@/lib/utils'
import type { FeatureTabButtonProps } from '../types'

const FeatureTabButton = React.forwardRef<HTMLButtonElement, FeatureTabButtonProps>(
  ({ className, icon, label, active, onClick, ...props }, ref) => (
    <button
      ref={ref}
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-2 px-5 py-4 rounded-2xl transition-all duration-300',
        active
          ? 'bg-[#E07A5F] text-[#FAF9F6] shadow-lg shadow-[#E07A5F]/20 scale-105'
          : 'bg-white text-[#3D3D3D] hover:bg-stone-50 border border-stone-100 hover:border-[#E07A5F]/30',
        className
      )}
      {...props}
    >
      <div className={cn(active && 'scale-110', 'transition-transform')}>{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  )
)
FeatureTabButton.displayName = 'FeatureTabButton'

export { FeatureTabButton }
