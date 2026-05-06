'use client'

import { AuthenticateWithRedirectCallback } from '@clerk/nextjs'
import { Suspense } from 'react'

function SSOCallbackContent() {
  return (
    <AuthenticateWithRedirectCallback
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    />
  )
}

export default function SSOCallback() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center text-stone-500">Loading...</div>
        </div>
      }
    >
      <SSOCallbackContent />
    </Suspense>
  )
}
