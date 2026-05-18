'use client'

import { SignUp } from '@clerk/nextjs'
import { clerkAppearance } from '@/lib/clerk/appearance'

export function SignupForm() {
  return (
    <SignUp
      appearance={clerkAppearance}
      routing="hash"
      forceRedirectUrl="/dashboard"
    />
  )
}
