'use client'

import {
  HeroSection,
  ProblemSolutionSection,
  FeaturesSection,
  PricingSection,
  CtaSection,
} from './landing'

export function LandingPage() {
  return (
    <div className="bg-[#FDFCF8] min-h-screen font-sans selection:bg-orange-100 selection:text-orange-900 overflow-x-hidden">
      <HeroSection />
      <ProblemSolutionSection />
      <FeaturesSection />
      <PricingSection />
      <CtaSection />
    </div>
  )
}
