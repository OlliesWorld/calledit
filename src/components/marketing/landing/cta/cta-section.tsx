'use client'

import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { CtaSectionProps } from '../types'
import { SectionWrapper } from '../shared'

import { CtaCard } from './cta-card'

const CtaSection = React.forwardRef<HTMLElement, CtaSectionProps>(
  (
    {
      className,
      heading = 'Start shipping today.',
      description = "Clone the repo, run one command, and you're ready to build.\nStop configuring. Start creating.",
      primaryCtaText = 'Get the Template',
      primaryCtaHref = '#pricing',
      footnote = 'One-time payment • Unlimited commercial projects • Lifetime updates',
      ...props
    },
    ref
  ) => (
    <SectionWrapper ref={ref} className={cn('py-28 relative overflow-hidden', className)} {...props}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        <CtaCard>
          <h2 className="text-4xl md:text-5xl font-bold text-[#FDFCF8] mb-8">{heading}</h2>
          <p className="text-xl text-stone-300 max-w-2xl mx-auto mb-12 font-light leading-relaxed whitespace-pre-line">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href={primaryCtaHref}>
              <Button
                size="lg"
                className="h-16 px-12 text-lg rounded-full bg-[#FDFCF8] text-stone-900 hover:bg-white hover:scale-105 transition-all duration-300 font-medium shadow-lg shadow-white/10"
              >
                {primaryCtaText}
              </Button>
            </Link>
          </div>
          {footnote && <p className="text-stone-500 text-sm mt-8">{footnote}</p>}
        </CtaCard>
      </div>
    </SectionWrapper>
  )
)
CtaSection.displayName = 'CtaSection'

export { CtaSection }
export type { CtaSectionProps }
