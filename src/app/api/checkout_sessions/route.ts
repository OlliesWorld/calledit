import { stripe } from '@/lib/stripe/server'
import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { applyRateLimit, checkoutRateLimiter } from '@/lib/utils/rate-limit'
import { checkoutSessionSchema } from '@/lib/validations'
import { pricingPlans } from '@/config/pricing'

export async function POST(req: NextRequest) {
  // Check if Stripe is configured
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment variables.' },
      { status: 503 }
    )
  }

  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 5 requests per minute per signed-in user
  const rateLimitResponse = applyRateLimit(req, checkoutRateLimiter, userId)
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  try {
    const body = await req.json()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL

    if (!appUrl) {
      return NextResponse.json(
        { error: 'App URL is not configured. Please add NEXT_PUBLIC_APP_URL to your environment variables.' },
        { status: 500 }
      )
    }

    // Validate request body
    const validation = checkoutSessionSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: validation.error.flatten().fieldErrors
        },
        { status: 400 }
      )
    }

    const { priceId } = validation.data

    const allowedPriceIds = new Set(
      pricingPlans.map((plan) => plan.priceId).filter((id) => Boolean(id))
    )

    if (!allowedPriceIds.has(priceId)) {
      return NextResponse.json({ error: 'Invalid price ID' }, { status: 400 })
    }

    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      customer_email: user.emailAddresses[0]?.emailAddress,
      client_reference_id: user.id,
      metadata: {
        userId: user.id,
      },
      success_url: `${appUrl}/?success=true`,
      cancel_url: `${appUrl}/?canceled=true`,
      automatic_tax: { enabled: true },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (err) {
    console.error('Error creating checkout session:', err)
    return NextResponse.json(
      { error: 'Failed to create checkout session. Please try again.' },
      { status: 500 }
    )
  }
}
