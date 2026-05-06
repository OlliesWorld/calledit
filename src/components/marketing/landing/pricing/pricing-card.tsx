'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { CheckoutButton } from '@/components/marketing/checkout-button'
import type { PricingCardProps } from '../types'
import { PricingFeatureList } from './pricing-feature-list'

const PricingCard = React.forwardRef<HTMLDivElement, PricingCardProps>(
  (
    {
      className,
      name,
      subtitle,
      price,
      interval,
      badge,
      features,
      priceId,
      ctaText = 'Get Instant Access',
      footnote = '30-day money-back guarantee • Secure payment via Stripe',
      ...props
    },
    ref
  ) => {
    const intervalLabel = interval === 'one-time' ? '/one-time' : `/${interval}`

    return (
      <div
        ref={ref}
        className={cn(
          'bg-[#2C2825] rounded-[2.5rem] p-10 md:p-12 text-[#FAF9F6] shadow-2xl relative overflow-hidden',
          className
        )}
        {...props}
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E07A5F]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#91C4F2]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
              {subtitle && <p className="text-stone-400">{subtitle}</p>}
            </div>
            {badge && (
              <div className="bg-[#E07A5F] text-white text-xs font-bold px-4 py-2 rounded-full">
                {badge}
              </div>
            )}
          </div>

          <div className="flex items-baseline gap-2 mb-8">
            <span className="text-6xl font-bold text-white">
              {typeof price === 'number' ? `$${price}` : price}
            </span>
            <span className="text-stone-400 text-lg">{intervalLabel}</span>
          </div>

          <PricingFeatureList features={features} className="mb-10" />

          <CheckoutButton
            priceId={priceId}
            className="w-full h-16 rounded-full text-xl font-bold bg-[#E07A5F] hover:bg-[#d66a4f] text-white shadow-lg shadow-[#E07A5F]/20 transition-all duration-300 hover:-translate-y-1"
          >
            {ctaText}
          </CheckoutButton>

          {footnote && <p className="text-center text-stone-500 text-sm mt-6">{footnote}</p>}
        </div>
      </div>
    )
  }
)
PricingCard.displayName = 'PricingCard'

export { PricingCard }
