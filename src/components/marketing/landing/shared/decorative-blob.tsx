import * as React from 'react'
import { cn } from '@/lib/utils'
import type { DecorativeBlobProps } from '../types'

const positionClasses = {
  'top-left': 'top-0 left-0 -translate-x-1/3 -translate-y-1/3',
  'top-right': 'top-0 right-0 translate-x-1/3 -translate-y-1/3',
  'bottom-left': 'bottom-0 left-0 -translate-x-1/3 translate-y-1/3',
  'bottom-right': 'bottom-0 right-0 translate-x-1/3 translate-y-1/3',
  center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
}

const sizeClasses = {
  sm: 'w-64 h-64',
  md: 'w-96 h-96',
  lg: 'w-[32rem] h-[32rem]',
}

const DecorativeBlob = React.forwardRef<HTMLDivElement, DecorativeBlobProps>(
  ({ className, color, position, size = 'md', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'absolute rounded-full blur-3xl pointer-events-none',
        positionClasses[position],
        sizeClasses[size],
        className
      )}
      style={{ backgroundColor: color.startsWith('#') ? color : undefined }}
      {...props}
    >
      {!color.startsWith('#') && (
        <div className={cn('w-full h-full rounded-full', `bg-${color}`)} />
      )}
    </div>
  )
)
DecorativeBlob.displayName = 'DecorativeBlob'

export { DecorativeBlob }
