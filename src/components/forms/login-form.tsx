'use client'

import { SignIn } from '@clerk/nextjs'
import { clerkAppearance } from '@/lib/clerk/appearance'

export function LoginForm() {
  return (
    <SignIn
      appearance={clerkAppearance}
      routing="hash"
      forceRedirectUrl="/dashboard"
    />
  )
}
