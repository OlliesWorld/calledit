'use client'

import * as React from 'react'
import { Zap, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { defaultAIApiBenefits, defaultAIProviders } from '@/config/landing'
import type { BaseComponentProps } from '../types'
import { SectionWrapper, SectionBadge, SectionHeading } from '../shared'

import { CodeBlock } from './code-block'
import { ProviderBadges } from './provider-badges'

interface AIApiSectionProps extends BaseComponentProps {
  badge?: string
  titleLine1?: string
  titleLine2?: string
  subtitle?: string
  benefits?: string[]
  providers?: string[]
}

const AIApiSection = React.forwardRef<HTMLElement, AIApiSectionProps>(
  (
    {
      className,
      badge = 'New Feature',
      titleLine1 = 'Unified AI API.',
      titleLine2 = 'Any model, one interface.',
      subtitle = "Don't lock yourself into one provider. Switch between OpenAI, Anthropic, and Google models instantly with our standardized API wrapper.",
      benefits = defaultAIApiBenefits,
      providers = defaultAIProviders,
      ...props
    },
    ref
  ) => (
    <SectionWrapper ref={ref} className={cn('py-28 relative overflow-hidden', className)} {...props}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="relative z-10">
            <SectionBadge icon={<Zap className="w-4 h-4 text-[#E07A5F]" />} className="mb-6">
              {badge}
            </SectionBadge>
            <SectionHeading line1={titleLine1} line2={titleLine2} />
            <p className="text-xl text-stone-600 mb-8 font-light leading-relaxed">{subtitle}</p>

            <div className="flex flex-col gap-4">
              {benefits.map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-stone-700">
                  <div className="w-6 h-6 rounded-full bg-[#E07A5F]/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-[#E07A5F]" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual - Code Block */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#E07A5F]/20 to-[#91C4F2]/20 rounded-[2.5rem] blur-2xl -z-10" />
            <CodeBlock filename="src/lib/ai/example.ts">
              <div className="text-stone-400 mb-4">
                <span className="text-purple-400">import</span>{' '}
                <span className="text-yellow-200">{`{ ai }`}</span>{' '}
                <span className="text-purple-400">from</span>{' '}
                <span className="text-green-300">&quot;@/lib/ai&quot;</span>
              </div>

              <div className="text-stone-300">
                <span className="text-purple-400">const</span>{' '}
                <span className="text-blue-300">response</span>{' '}
                <span className="text-purple-400">=</span>{' '}
                <span className="text-purple-400">await</span> ai.
                <span className="text-yellow-200">chat</span>({`{`}
              </div>
              <div className="pl-4 text-stone-300">
                <span className="text-stone-500">{/* Switch providers instantly */}</span>
              </div>
              <div className="pl-4 text-stone-300">
                provider: <span className="text-green-300">&quot;anthropic&quot;</span>,
              </div>
              <div className="pl-4 text-stone-300">
                model: <span className="text-green-300">&quot;claude-3-5-sonnet&quot;</span>,
              </div>
              <div className="pl-4 text-stone-300">messages: [</div>
              <div className="pl-8 text-stone-300">
                {`{`} role: <span className="text-green-300">&quot;user&quot;</span>, content:{' '}
                <span className="text-green-300">&quot;Hello!&quot;</span> {`}`}
              </div>
              <div className="pl-4 text-stone-300">]</div>
              <div className="text-stone-300">{`})`}</div>

              <ProviderBadges providers={providers} />
            </CodeBlock>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
)
AIApiSection.displayName = 'AIApiSection'

export { AIApiSection }
export type { AIApiSectionProps }
