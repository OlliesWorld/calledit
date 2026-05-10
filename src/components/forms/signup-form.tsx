'use client'

import { SignUp } from '@clerk/nextjs'

export function SignupForm() {
  return (
    <SignUp
      appearance={{
        variables: {
          colorBackground: '#1a1a1f',
          colorText: '#F5F5F0',
          colorTextSecondary: 'rgba(245,245,240,0.45)',
          colorInputBackground: '#222228',
          colorInputText: '#F5F5F0',
          colorPrimary: '#FF5F1F',
          colorTextOnPrimaryBackground: '#ffffff',
          borderRadius: '0.75rem',
        },
        elements: {
          card: 'shadow-none bg-transparent',
          headerTitle: 'hidden',
          headerSubtitle: 'hidden',
          socialButtonsBlockButton: 'border-white/10 text-white/70 hover:bg-white/5 hover:text-white',
          footerActionLink: 'text-orange-400 hover:text-orange-300',
          dividerLine: 'bg-white/10',
          dividerText: 'text-white/30',
          formFieldLabel: 'text-white/60',
          identityPreviewText: 'text-white/70',
          identityPreviewEditButton: 'text-orange-400',
        },
      }}
      routing="hash"
      forceRedirectUrl="/dashboard"
    />
  )
}
