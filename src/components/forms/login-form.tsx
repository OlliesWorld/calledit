'use client'

import { SignIn } from '@clerk/nextjs'

export function LoginForm() {
  return (
    <SignIn
      appearance={{
        elements: {
          formButtonPrimary:
            'bg-orange-500 hover:bg-orange-600 text-white font-medium shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5',
          card: 'shadow-none',
          headerTitle: 'hidden',
          headerSubtitle: 'hidden',
          socialButtonsBlockButton:
            'border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-stone-900',
          formFieldInput:
            'rounded-xl border-stone-200 focus:border-orange-500 focus:ring-orange-500/20',
          footerActionLink: 'text-orange-600 hover:text-orange-500',
        },
      }}
      routing="hash"
      forceRedirectUrl="/dashboard"
    />
  )
}
