import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { createAdminClient } from '@/lib/supabase/admin'
import Stripe from 'stripe'
import { applyRateLimit, webhookRateLimiter } from '@/lib/utils/rate-limit'

export async function POST(req: NextRequest) {
  // Check if Stripe is configured
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe is not configured' },
      { status: 503 }
    )
  }

  // Apply rate limiting (100 requests per minute per IP)
  const rateLimitResponse = applyRateLimit(req, webhookRateLimiter)
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  const body = await req.text()
  const signature = (await headers()).get('Stripe-Signature') as string

  let event: Stripe.Event

  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not set')
    }
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return new NextResponse(
      'Webhook signature verification failed',
      { status: 400 }
    )
  }

  // Create admin client for database operations
  const supabaseAdmin = createAdminClient()
  if (!supabaseAdmin) {
    console.error('Failed to create Supabase admin client')
    return new NextResponse('Database configuration error', { status: 500 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Retrieve the subscription details from Stripe
        const subscriptionResponse = await stripe.subscriptions.retrieve(
          session.subscription as string
        )
        const subscription = subscriptionResponse as Stripe.Subscription

        // Get user ID from session metadata or client_reference_id
        const userId = session.metadata?.userId || session.client_reference_id

        if (!userId) {
          console.error('No user ID found in checkout session metadata')
          return new NextResponse('User ID missing', { status: 400 })
        }

        // Update user's subscription status in database
        // Use onConflict to handle retries gracefully (Stripe may resend webhooks)
        // Note: In Stripe SDK v20+, current_period_start/end are on subscription items
        const subscriptionItem = subscription.items.data[0]
        const { error } = await supabaseAdmin
          .from('user_subscriptions')
          .upsert(
            {
              user_id: userId,
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: subscription.id,
              status: subscription.status,
              price_id: subscriptionItem.price.id,
              current_period_start: new Date(
                subscriptionItem.current_period_start * 1000
              ).toISOString(),
              current_period_end: new Date(
                subscriptionItem.current_period_end * 1000
              ).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
            },
            { onConflict: 'stripe_subscription_id' }
          )

        if (error) {
          console.error('Error updating subscription:', error)
          return new NextResponse('Database error', { status: 500 })
        }

        console.log(`✅ Subscription activated for user ${userId}`)
        break
      }

      case 'invoice.payment_succeeded': {
        // Handle successful recurring payment
        const invoice = event.data.object as Stripe.Invoice
        // In Stripe SDK v20+, subscription is accessed via parent.subscription_details
        const subscriptionRef = invoice.parent?.subscription_details?.subscription
        const subscriptionId = typeof subscriptionRef === 'string' 
          ? subscriptionRef 
          : subscriptionRef?.id

        if (subscriptionId) {
          const subscriptionResponse =
            await stripe.subscriptions.retrieve(subscriptionId)
          const subscription = subscriptionResponse as Stripe.Subscription
          const subscriptionItem = subscription.items.data[0]

          const { error } = await supabaseAdmin
            .from('user_subscriptions')
            .update({
              status: subscription.status,
              current_period_start: new Date(
                subscriptionItem.current_period_start * 1000
              ).toISOString(),
              current_period_end: new Date(
                subscriptionItem.current_period_end * 1000
              ).toISOString(),
            })
            .eq('stripe_subscription_id', subscriptionId)

          if (error) {
            console.error('Error updating recurring payment:', error)
          } else {
            console.log(
              `✅ Recurring payment recorded for subscription ${subscriptionId}`
            )
          }
        }
        break
      }

      case 'invoice.payment_failed': {
        // Handle failed payment
        const invoice = event.data.object as Stripe.Invoice
        // In Stripe SDK v20+, subscription is accessed via parent.subscription_details
        const subscriptionRef = invoice.parent?.subscription_details?.subscription
        const subscriptionId = typeof subscriptionRef === 'string' 
          ? subscriptionRef 
          : subscriptionRef?.id

        if (subscriptionId) {
          const { error } = await supabaseAdmin
            .from('user_subscriptions')
            .update({
              status: 'past_due',
            })
            .eq('stripe_subscription_id', subscriptionId)

          if (error) {
            console.error('Error updating failed payment status:', error)
          } else {
            console.log(
              `⚠️ Payment failed for subscription ${subscriptionId}`
            )
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        // Handle subscription updates (plan changes, cancellation scheduled, etc.)
        const subscription = event.data.object as Stripe.Subscription
        const subscriptionItem = subscription.items.data[0]

        const { error } = await supabaseAdmin
          .from('user_subscriptions')
          .update({
            status: subscription.status,
            price_id: subscriptionItem.price.id,
            current_period_start: new Date(
              subscriptionItem.current_period_start * 1000
            ).toISOString(),
            current_period_end: new Date(
              subscriptionItem.current_period_end * 1000
            ).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          })
          .eq('stripe_subscription_id', subscription.id)

        if (error) {
          console.error('Error updating subscription:', error)
        } else {
          console.log(`✅ Subscription ${subscription.id} updated`)
        }
        break
      }

      case 'customer.subscription.deleted': {
        // Handle subscription cancellation
        const subscription = event.data.object as Stripe.Subscription

        const { error } = await supabaseAdmin
          .from('user_subscriptions')
          .update({
            status: 'canceled',
          })
          .eq('stripe_subscription_id', subscription.id)

        if (error) {
          console.error('Error canceling subscription:', error)
        } else {
          console.log(`✅ Subscription ${subscription.id} canceled`)
        }
        break
      }

      default:
        // Log unhandled event types for debugging
        console.log(`Unhandled event type: ${event.type}`)
    }
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new NextResponse('Webhook processing error', { status: 500 })
  }

  // Return simple 200 response (no CORS headers needed for server-to-server webhooks)
  return new NextResponse(null, { status: 200 })
}
