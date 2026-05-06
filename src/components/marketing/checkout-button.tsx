'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface CheckoutButtonProps {
  priceId: string
  children: React.ReactNode
  className?: string
}

export function CheckoutButton({ priceId, children, className }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      const { url } = data

      if (!url) {
        throw new Error('No checkout URL returned')
      }

      // Redirect to Stripe Checkout
      window.location.href = url
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
      console.error('Checkout error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <Button
        onClick={handleCheckout}
        disabled={loading}
        className={className}
      >
        {loading ? 'Loading...' : children}
      </Button>
      {error && (
        <p className="mt-2 text-sm text-red-600 text-center">
          {error}
        </p>
      )}
    </div>
  )
}
