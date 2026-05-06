import * as React from 'react'
import { cn } from '@/lib/utils'
import type { CodeBlockProps } from '../types'

const CodeBlock = React.forwardRef<HTMLDivElement, CodeBlockProps>(
  ({ className, children, filename = 'example.ts', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'bg-[#2C2825] rounded-[2rem] p-8 shadow-2xl border border-stone-800 relative overflow-hidden',
        className
      )}
      {...props}
    >
      {/* Window Chrome */}
      <div className="flex items-center gap-2 mb-6 border-b border-stone-700 pb-4">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-stone-500 text-xs font-mono ml-2">{filename}</span>
      </div>

      {/* Code Content */}
      <div className="font-mono text-sm leading-relaxed">{children}</div>
    </div>
  )
)
CodeBlock.displayName = 'CodeBlock'

export { CodeBlock }
