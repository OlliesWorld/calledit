import type { Appearance } from '@clerk/types'

export const clerkAppearance: Appearance = {
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
    card: 'shadow-none bg-transparent w-full',
    rootBox: 'w-full',
    headerTitle: 'hidden',
    headerSubtitle: 'hidden',
    // The ! is needed: Clerk's own button styles otherwise win and leave dark
    // text on the dark card.
    socialButtonsBlockButton:
      '!bg-white/10 !border !border-white/20 !text-white hover:!bg-white/20 focus-visible:!outline-2 focus-visible:!outline-offset-2 focus-visible:!outline-orange',
    socialButtonsBlockButtonText: '!text-white !font-medium',
    footerActionLink: 'text-orange-400 hover:text-orange-300',
    dividerLine: 'bg-white/10',
    dividerText: 'text-white/30',
    formFieldLabel: 'text-white/60',
    identityPreviewText: 'text-white/70',
    identityPreviewEditButton: 'text-orange-400',
    alternativeMethods: 'space-y-2',
    alternativeMethodsBlockButton:
      'border border-white/10 !bg-transparent !text-white/80 hover:!bg-white/5 hover:!text-white',
    alternativeMethodsBlockButtonText: '!text-white/80',
    alternativeMethodsBlockButtonArrow: '!text-white/40',
    backRow: 'mt-2',
    backLink: '!text-white/60 hover:!text-white',
    formButtonReset: '!text-white/60 hover:!text-white',
    otpCodeFieldInput: '!text-white !bg-[#222228] !border-white/10',
    formResendCodeLink: '!text-orange-400 hover:!text-orange-300',
  },
}
