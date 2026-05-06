'use client'

import * as React from 'react'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { defaultPricingFeatures } from '@/config/landing'
import type { BaseComponentProps } from '../types'
import { SectionWrapper, SectionBadge, SectionHeading } from '../shared'

import { PricingCard } from './pricing-card'

interface PricingSectionProps extends BaseComponentProps {
  badge?: string
  titleLine1?: string
  titleLine2?: string
  subtitle?: string
  cardName?: string
  cardSubtitle?: string
  price?: number | string
  priceId?: string
  features?: string[]
  ctaText?: string
  footnote?: string
}

const PricingSection = React.forwardRef<HTMLElement, PricingSectionProps>(
  (
    {
      className,
      badge = 'Fair pricing for honest work',
      titleLine1 = 'Pay once.',
      titleLine2 = 'Build unlimited projects.',
      subtitle = 'A complete commercial license for less than the cost of one hour of freelance work.',
      cardName = 'Commercial License',
      cardSubtitle = 'For founders & freelancers',
      price = 99,
      priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO || '',
      features = defaultPricingFeatures,
      ctaText = 'Get Instant Access',
      footnote = 'Secure payment via Stripe',
      ...props
    },
    ref
  ) => (
    <SectionWrapper ref={ref} id="pricing" className={cn('py-28 relative', className)} {...props}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <SectionBadge icon={<Heart className="w-4 h-4 text-[#E07A5F]" />} className="mb-6">
            {badge}
          </SectionBadge>
          <SectionHeading
            line1={titleLine1}
            line2={titleLine2}
            highlightColor="text-orange-600"
            className="text-stone-800"
          />
          <p className="text-xl text-stone-600 max-w-2xl mx-auto font-light leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="relative max-w-lg mx-auto">
          {/* Card Glow */}
          <div className="absolute -inset-4 bg-gradient-to-b from-orange-500/20 to-rose-500/20 rounded-[3rem] blur-2xl -z-10" />

          <PricingCard
            name={cardName}
            subtitle={cardSubtitle}
            price={price}
            interval="one-time"
            badge="BEST VALUE"
            features={features}
            priceId={priceId}
            ctaText={ctaText}
            footnote={footnote}
          />
        </div>
      </div>
    </SectionWrapper>
  )
)
PricingSection.displayName = 'PricingSection'

export { PricingSection }
export type { PricingSectionProps }
