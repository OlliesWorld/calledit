'use client'

import * as React from 'react'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { defaultAITools, defaultAIBenefits } from '@/config/landing'
import type { BaseComponentProps, AITool, BenefitCardProps } from '../types'
import { SectionWrapper, SectionBadge, SectionHeading } from '../shared'

import { AIToolsGrid } from './ai-tools-grid'
import { BenefitCard } from './benefit-card'

interface AIAssistantSectionProps extends BaseComponentProps {
  badge?: string
  titleLine1?: string
  titleLine2?: string
  subtitle?: string
  tools?: AITool[]
  benefits?: Omit<BenefitCardProps, 'className'>[]
}

const AIAssistantSection = React.forwardRef<HTMLElement, AIAssistantSectionProps>(
  (
    {
      className,
      badge = 'AI-Powered Development',
      titleLine1 = "Your AI assistant's",
      titleLine2 = 'favorite starter kit.',
      subtitle = "We've structured the codebase to be perfectly readable by AI. Clean patterns, strong typing, and clear context mean your AI tools work better, faster, and smarter.",
      tools = defaultAITools,
      benefits = defaultAIBenefits,
      ...props
    },
    ref
  ) => (
    <SectionWrapper ref={ref} className={cn('py-28 relative', className)} {...props}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-[#FAF9F6] rounded-[3rem] p-12 md:p-16 relative overflow-hidden border border-stone-100 shadow-sm">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100/50 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-100/50 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />

          <div className="relative z-10">
            <div className="text-center mb-16">
              <SectionBadge icon={<Sparkles className="w-4 h-4 text-[#E07A5F]" />} className="mb-6">
                {badge}
              </SectionBadge>
              <SectionHeading line1={titleLine1} line2={titleLine2} />
              <p className="text-xl text-stone-600 max-w-3xl mx-auto font-light leading-relaxed">
                {subtitle}
              </p>
            </div>

            {/* AI Tools Grid */}
            <AIToolsGrid tools={tools} className="mb-16" />

            {/* Benefits */}
            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <BenefitCard
                  key={index}
                  icon={benefit.icon}
                  title={benefit.title}
                  description={benefit.description}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
)
AIAssistantSection.displayName = 'AIAssistantSection'

export { AIAssistantSection }
export type { AIAssistantSectionProps }
