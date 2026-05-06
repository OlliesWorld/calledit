import * as React from 'react'
import { cn } from '@/lib/utils'
import type { AIToolsGridProps } from '../types'
import { AIToolCard } from './ai-tool-card'

const AIToolsGrid = React.forwardRef<HTMLDivElement, AIToolsGridProps>(
  ({ className, tools, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4', className)}
      {...props}
    >
      {tools.map((tool, index) => (
        <AIToolCard
          key={index}
          name={tool.name}
          description={tool.description}
          icon={tool.icon}
          isSpecial={tool.isSpecial}
        />
      ))}
    </div>
  )
)
AIToolsGrid.displayName = 'AIToolsGrid'

export { AIToolsGrid }
