import * as React from 'react'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TestimonialCardProps } from '../types'

const TestimonialCard = React.forwardRef<HTMLDivElement, TestimonialCardProps>(
  (
    {
      className,
      icon = <Heart className="w-6 h-6 text-rose-400" />,
      title,
      subtitle,
      quotes,
      ...props
    },
    ref
  ) => (
    <div ref={ref} className={cn('relative', className)} {...props}>
      <div className="absolute -inset-4 bg-stone-100 rounded-[3rem] -rotate-2" />
      <div className="relative bg-white p-10 rounded-[2.5rem] shadow-sm border border-stone-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-stone-800 text-lg">{title}</h3>
            {subtitle && <p className="text-stone-500 text-sm">{subtitle}</p>}
          </div>
        </div>
        <div className="space-y-6">
          {quotes.map((quote, index) => (
            <React.Fragment key={index}>
              <p className="text-stone-600 leading-relaxed">&quot;{quote}&quot;</p>
              {index < quotes.length - 1 && <div className="h-px w-full bg-stone-100" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
)
TestimonialCard.displayName = 'TestimonialCard'

export { TestimonialCard }
