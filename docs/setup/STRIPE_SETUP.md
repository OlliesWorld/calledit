# Stripe Payment Setup Guide

This guide explains how to enable Stripe payments in your application. The payment system is designed to be modular and optional.

## 1. Stripe Dashboard Setup

1.  Create a [Stripe account](https://stripe.com).
2.  Go to the **Developers** section in the dashboard.
3.  Get your API keys:
    *   **Publishable Key**
    *   **Secret Key**

## 2. Environment Variables

Add the following keys to your `.env.local` file:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=key
STRIPE_SECRET_KEY=key
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO=price_...
```

## 3. Create Products

1.  Go to **Products** in your Stripe Dashboard.
2.  Create a new product (e.g., "Pro Plan").
3.  Set the price (e.g., $29/month).
4.  Copy the **Price ID** (starts with `price_...`).
5.  Add the Price ID to your `.env.local` file as `NEXT_PUBLIC_STRIPE_PRICE_ID_PRO`.

## 4. Enable Payments in the App

To enable payments, you simply need to use the `CheckoutButton` component and pass your Price ID from the environment variable.

### Example Usage

The pricing page (`src/components/marketing/pricing-page.tsx`) is already configured to use the `NEXT_PUBLIC_STRIPE_PRICE_ID_PRO` environment variable:

```tsx
import { CheckoutButton } from "./checkout-button"

// ... inside your pricing card
<CheckoutButton
  priceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO || ""}
  className="w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 mb-8 relative z-10"
>
  Start Pro Trial
</CheckoutButton>
```

Make sure you've set `NEXT_PUBLIC_STRIPE_PRICE_ID_PRO` in your `.env.local` file with your actual Stripe Price ID.

## 5. Webhooks (Optional but Recommended)

To listen for successful payments (e.g., to update the user's subscription status in your database), a webhook handler has been pre-configured at `src/app/api/webhooks/route.ts`.

1.  Go to **Developers > Webhooks** in Stripe.
2.  Add an endpoint: `https://your-domain.com/api/webhooks`.
3.  Select events to listen for (e.g., `checkout.session.completed`, `invoice.payment_succeeded`).
4.  Get your **Webhook Signing Secret** and add it to `.env.local`:

```bash
STRIPE_WEBHOOK_SECRET=secret
```

The handler is already set up to verify the Stripe signature securely. You just need to add your database logic inside the `if (event.type === ...)` blocks in `src/app/api/webhooks/route.ts`.

### Webhook Security and CORS

The webhook endpoint includes several security features:

1. **Signature Verification**: All webhook requests are verified using Stripe's signature to ensure they're authentic
2. **Rate Limiting**: Limited to 100 requests per minute per IP to prevent abuse
3. **CORS Headers**: Configured to allow POST requests with proper headers

**Stripe Webhook IP Addresses**

Stripe sends webhooks from specific IP addresses. While our webhook handler verifies signatures (which is the recommended approach), you can optionally restrict access by IP for additional security:

- View current Stripe webhook IP addresses: https://stripe.com/docs/ips
- Note: Stripe's IPs may change, so signature verification is the primary security measure

**CORS Configuration**

The webhook endpoint is configured with CORS headers for completeness:

```typescript
headers: {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST',
  'Access-Control-Allow-Headers': 'Content-Type, Stripe-Signature',
}
```

**Important Notes:**
- Webhooks are server-to-server calls and typically don't need CORS
- Stripe verifies authenticity via signature, not origin
- CORS headers are included for edge cases and non-Stripe webhook sources
- If you need to restrict access, use firewall rules or middleware instead of relying on CORS

## 6. Testing Payments

1.  Use [Stripe's test cards](https://stripe.com/docs/testing) to simulate payments.
2.  Check the browser console and server logs for any errors.
