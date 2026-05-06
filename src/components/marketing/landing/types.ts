import { ReactNode } from 'react'

// Base props shared by most components
export interface BaseComponentProps {
  className?: string
  children?: ReactNode
}

// Hero types
export interface HeroBadgeProps extends BaseComponentProps {
  icon?: ReactNode
}

export interface HeroTitleProps {
  line1: string
  line2: string
  underlineColor?: string
  className?: string
}

export type HeroSubtitleProps = BaseComponentProps

export interface HeroActionsProps extends BaseComponentProps {
  alignment?: 'left' | 'center' | 'right'
}

export interface HeroBackgroundProps {
  colors?: string[]
  className?: string
}

export type TechStackPosition =
  | 'top'
  | 'top-right'
  | 'right'
  | 'bottom-right'
  | 'bottom'
  | 'bottom-left'
  | 'left'
  | 'top-left'

export interface TechStackCardProps {
  icon: ReactNode
  title: string
  subtitle: string
  color: string
  position?: TechStackPosition
  delay?: string
  className?: string
}

export interface TechStackOrbitProps extends BaseComponentProps {
  centerContent?: ReactNode
}

// Feature types
export type FeatureKey = string

export interface FeatureDetails {
  title: string
  items: string[]
  timeSaved: string
  headaches: string
  providers?: string[]
}

export interface Feature {
  icon: ReactNode
  label: string
  details: FeatureDetails
}

export type FeatureConfig = Record<FeatureKey, Feature>

export interface FeatureTabsProps {
  features: FeatureConfig
  defaultFeature?: FeatureKey
  onFeatureChange?: (feature: FeatureKey) => void
  className?: string
}

export interface FeatureTabButtonProps {
  icon: ReactNode
  label: string
  active: boolean
  onClick: () => void
  className?: string
}

export interface FeatureDetailsCardProps {
  feature: Feature
  className?: string
}

export interface ProviderBadgeProps {
  provider: string
  className?: string
}

// Testimonial types
export interface TestimonialCardProps {
  icon?: ReactNode
  title: string
  subtitle?: string
  quotes: string[]
  className?: string
}

// Benefit types
export interface BenefitListProps {
  items: string[]
  iconColor?: string
  className?: string
}

export interface BenefitCardProps {
  icon: ReactNode
  title: string
  description: string
  className?: string
}

// AI Tool types
export interface AITool {
  name: string
  description: string
  icon?: ReactNode
  isSpecial?: boolean
}

export interface AIToolCardProps extends AITool {
  className?: string
}

export interface AIToolsGridProps {
  tools: AITool[]
  className?: string
}

// Code block types
export interface CodeBlockProps extends BaseComponentProps {
  filename?: string
}

export interface ProviderBadgesProps {
  providers: string[]
  label?: string
  className?: string
}

// Pricing types
export interface PricingCardProps {
  name: string
  subtitle?: string
  price: number | string
  interval: 'one-time' | 'month' | 'year'
  badge?: string
  features: string[]
  priceId: string
  ctaText?: string
  footnote?: string
  className?: string
}

export interface PricingFeatureListProps {
  features: string[]
  className?: string
}

// Section shared types
export interface SectionWrapperProps extends BaseComponentProps {
  id?: string
}

export interface SectionBadgeProps extends BaseComponentProps {
  icon?: ReactNode
}

export interface SectionHeadingProps {
  line1: string
  line2: string
  highlightColor?: string
  className?: string
}

export interface DecorativeBlobProps {
  color: string
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export interface CheckItemProps extends BaseComponentProps {
  iconBg?: string
  iconColor?: string
}

// CTA types
export interface CtaSectionProps {
  heading?: string
  description?: string
  primaryCtaText?: string
  primaryCtaHref?: string
  footnote?: string
  className?: string
}

export type CtaCardProps = BaseComponentProps
