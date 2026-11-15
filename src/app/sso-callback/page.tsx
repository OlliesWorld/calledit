'use client'

import { AuthenticateWithRedirectCallback } from '@clerk/nextjs'
import { Suspense } from 'react'
import { Footer } from '@/components/layout/footer'

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
    <div className="min-h-screen flex flex-col bg-[#0a0a0b]">
      <div className="flex-1 flex items-center justify-center">
        <Suspense fallback={<div className="text-center text-white/40">Loading...</div>}>
          <SSOCallbackContent />
        </Suspense>
      </div>
      <Footer league={null} />
    </div>
  )
}
