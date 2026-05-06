import { z } from 'zod'

/**
 * Checkout session creation request validation
 */
export const checkoutSessionSchema = z.object({
  priceId: z
    .string()
    .min(1, 'Price ID is required')
    .startsWith('price_', 'Invalid Stripe price ID format'),
})

export type CheckoutSessionInput = z.infer<typeof checkoutSessionSchema>
