'use client'

import * as React from 'react'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { defaultProblemSolutionBenefits, defaultTestimonialQuotes } from '@/config/landing'
import type { BaseComponentProps } from '../types'
import { SectionWrapper } from '../shared'

import { TestimonialCard } from './testimonial-card'
import { BenefitList } from './benefit-list'

interface ProblemSolutionSectionProps extends BaseComponentProps {
  testimonialTitle?: string
  testimonialSubtitle?: string
  testimonialQuotes?: string[]
  headingLine1?: string
  headingLine2?: string
  description?: string
  benefits?: string[]
}

const ProblemSolutionSection = React.forwardRef<HTMLElement, ProblemSolutionSectionProps>(
  (
    {
      className,
      testimonialTitle = 'Stop wasting billable hours',
      testimonialSubtitle = 'Your time is worth $100+/hr',
      testimonialQuotes = defaultTestimonialQuotes,
      headingLine1 = 'Built for Solopreneurs',
      headingLine2 = '& Freelancers.',
      description = "Whether you're building your own SaaS or shipping client work, this starter kit pays for itself in the first hour.\n\nStop building the same \"Forgot Password\" flow for the 10th time. We've handled the boring infrastructure so you can focus on the features that get you paid.",
      benefits = defaultProblemSolutionBenefits,
      ...props
    },
    ref
  ) => (
    <SectionWrapper ref={ref} className={cn('py-28 relative', className)} {...props}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div className="relative order-2 md:order-1">
            <TestimonialCard
              icon={<Heart className="w-6 h-6 text-rose-400" />}
              title={testimonialTitle}
              subtitle={testimonialSubtitle}
              quotes={testimonialQuotes}
            />
          </div>

          <div className="order-1 md:order-2">
            <h2 className="text-4xl font-bold text-stone-800 mb-6 leading-tight">
              {headingLine1} <br />
              <span className="text-orange-600">{headingLine2}</span>
            </h2>
            <p className="text-lg text-stone-600 mb-8 leading-relaxed whitespace-pre-line">
              {description}
            </p>
            <BenefitList items={benefits} />
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
)
ProblemSolutionSection.displayName = 'ProblemSolutionSection'

export { ProblemSolutionSection }
export type { ProblemSolutionSectionProps }
