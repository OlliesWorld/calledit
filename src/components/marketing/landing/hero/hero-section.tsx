'use client'

import * as React from 'react'
import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { defaultTechStack } from '@/config/landing'
import type { BaseComponentProps, TechStackCardProps } from '../types'

import { HeroBadge } from './hero-badge'
import { HeroTitle } from './hero-title'
import { HeroSubtitle } from './hero-subtitle'
import { HeroActions } from './hero-actions'
import { HeroBackground } from './hero-background'
import { TechStackOrbit } from './tech-stack-orbit'
import { TechStackCard } from './tech-stack-card'

interface HeroSectionProps extends BaseComponentProps {
  badge?: string
  badgeIcon?: React.ReactNode
  titleLine1?: string
  titleLine2?: string
  subtitle?: string
  primaryCtaText?: string
  primaryCtaHref?: string
  secondaryCtaText?: string
  secondaryCtaHref?: string
  techStack?: Omit<TechStackCardProps, 'className'>[]
  showTechStack?: boolean
}

const HeroSection = React.forwardRef<HTMLElement, HeroSectionProps>(
  (
    {
      className,
      badge = 'Your Next.js starter, ready to ship',
      badgeIcon = <Sparkles className="w-4 h-4 text-orange-400" />,
      titleLine1 = 'Launch your idea',
      titleLine2 = 'this weekend.',
      subtitle = "Skip the boring setup. This Next.js + TypeScript starter has everything you need to build and ship your app—so you can focus on what makes it yours.",
      primaryCtaText = 'Get Started',
      primaryCtaHref = '#pricing',
      secondaryCtaText = "See What's Inside",
      secondaryCtaHref = '#features',
      techStack = defaultTechStack,
      showTechStack = true,
      ...props
    },
    ref
  ) => (
    <section
      ref={ref}
      className={cn('relative pt-20 pb-10 overflow-hidden', className)}
      {...props}
    >
      <HeroBackground />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Hero Content */}
          <div className="text-center lg:text-left">
            <HeroBadge icon={badgeIcon}>{badge}</HeroBadge>

            <HeroTitle line1={titleLine1} line2={titleLine2} />

            <HeroSubtitle>{subtitle}</HeroSubtitle>

            <HeroActions>
              <Link href={primaryCtaHref}>
                <Button
                  size="lg"
                  className="h-14 px-8 text-lg rounded-full bg-stone-900 hover:bg-stone-800 text-[#FDFCF8] shadow-xl shadow-stone-900/10 hover:shadow-stone-900/20 hover:-translate-y-1 transition-all duration-300"
                >
                  {primaryCtaText}
                </Button>
              </Link>
              <Link href={secondaryCtaHref}>
                <Button
                  variant="ghost"
                  size="lg"
                  className="h-14 px-8 text-lg rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-100/50"
                >
                  {secondaryCtaText} <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </HeroActions>
          </div>

          {/* Right Column - Tech Stack Visual */}
          {showTechStack && (
            <TechStackOrbit
              centerContent={
                <>
                  <p className="text-sm text-stone-500 font-medium mb-2">Everything you need</p>
                  <p className="text-xs text-stone-400 max-w-[140px]">
                    + TypeScript paths, ESLint, Prettier, and more
                  </p>
                </>
              }
            >
              {techStack.map((item, index) => (
                <TechStackCard key={index} {...item} />
              ))}
            </TechStackOrbit>
          )}
        </div>
      </div>
    </section>
  )
)
HeroSection.displayName = 'HeroSection'

export { HeroSection }
export type { HeroSectionProps }
