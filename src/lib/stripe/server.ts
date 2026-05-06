import 'server-only'
import Stripe from 'stripe'

// Only initialize Stripe if the secret key is configured
// This allows the app to build and run without Stripe configured
const stripeSecretKey = process.env.STRIPE_SECRET_KEY

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2025-12-15.clover',
      appInfo: {
        name: 'Next.js Tailwind Starter',
        version: '0.1.0',
      },
    })
  : null

// Helper to check if Stripe is configured
export function isStripeConfigured(): boolean {
  return stripe !== null
}
