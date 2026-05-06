# 🔒 LaunchKit Security Features

This document describes the security measures built into LaunchKit. These protections are active out of the box — no additional configuration required.

---

## HTTP Security Headers

All responses include the following headers via `next.config.ts`:

| Header | Value | Protection |
|--------|-------|------------|
| `X-Frame-Options` | `DENY` | Prevents clickjacking by blocking iframe embedding |
| `X-Content-Type-Options` | `nosniff` | Stops browsers from MIME-type sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limits referrer data sent to external origins |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Forces HTTPS for 2 years, including subdomains |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Disables access to sensitive browser APIs |
| `X-DNS-Prefetch-Control` | `on` | Enables DNS prefetching for performance |

**File:** `next.config.ts`

---

## Authentication & Access Control

### Clerk Middleware (Route Protection)

All routes are protected by default via Clerk's middleware. Only explicitly listed public routes are accessible without authentication:

- `/` (landing page)
- `/login`, `/signup`
- `/api/webhooks` (Stripe — verified by signature, not session)

**File:** `src/proxy.ts`

### Server-Side Auth Pattern

Server actions and API routes always derive the user identity from Clerk's server-side `auth()` — never from client-supplied data:

```ts
const { userId } = await auth()
if (!userId) throw new Error('Unauthorized')
```

This prevents any client from impersonating another user by passing a forged `userId`.

**Files:** `src/lib/profile/actions.ts`, `src/app/api/checkout_sessions/route.ts`, `src/app/api/ai/chat/route.ts`

---

## Database Security

### Server Actions with Admin Client

All client-side profile and preferences operations delegate to server actions that:

1. **Authenticate** via Clerk (`auth()`) — userId is never taken from the client
2. **Validate** all input with Zod schemas before writing to the database
3. **Execute** queries using the Supabase admin client (service role), bypassing RLS

This ensures database operations work correctly with Clerk authentication without requiring Clerk↔Supabase JWT integration.

**Files:** `src/lib/profile/actions.ts`, `src/lib/profile/client.ts`

### Row Level Security (RLS)

All Supabase tables have RLS enabled with policies for:

- **Service role** — full access (used by server actions and webhooks)
- **Clerk JWT** — scoped access via `auth.jwt()->>'sub'` (available if Clerk JWT integration is configured)

**Files:** `supabase/migrations/001_create_user_subscriptions.sql`, `002_create_profiles_table.sql`, `003_create_user_preferences_table.sql`

### Admin Client Isolation

The Supabase admin client (service role key) is protected by the `server-only` import guard, making it impossible to import in client components:

```ts
import 'server-only'
```

**File:** `src/lib/supabase/admin.ts`

---

## Input Validation

All user input is validated server-side with Zod schemas before processing:

| Endpoint / Action | Schema | File |
|-------------------|--------|------|
| Checkout session creation | `checkoutSessionSchema` | `src/lib/validations/checkout.ts` |
| AI chat messages | `chatRequestSchema` | `src/lib/validations/ai.ts` |
| Profile updates | `profileUpdateSchema` | `src/lib/validations/profile.ts` |
| Preferences updates | `userPreferencesSchema` | `src/lib/validations/profile.ts` |
| Contact form | `contactFormSchema` | `src/lib/validations/marketing.ts` |
| Auth (signup/signin) | `signUpSchema`, `signInSchema` | `src/lib/validations/auth.ts` |

---

## Payment Security (Stripe)

### Webhook Signature Verification

All incoming Stripe webhooks are verified using `stripe.webhooks.constructEvent()` with the `STRIPE_WEBHOOK_SECRET`. Invalid signatures are rejected with a generic error message (no internal details leaked).

### Price ID Allowlist

The checkout endpoint validates `priceId` against the configured pricing plans — arbitrary price IDs are rejected:

```ts
const allowedPriceIds = new Set(
  pricingPlans.map((plan) => plan.priceId).filter(Boolean)
)
if (!allowedPriceIds.has(priceId)) {
  return NextResponse.json({ error: 'Invalid price ID' }, { status: 400 })
}
```

### Idempotent Webhook Processing

Subscription upserts use `onConflict: 'stripe_subscription_id'` to handle Stripe's webhook retry behavior gracefully without creating duplicate records.

**Files:** `src/app/api/webhooks/route.ts`, `src/app/api/checkout_sessions/route.ts`

---

## AI Security (OWASP LLM Top 10)

### Prompt Injection Protection (LLM01)

User messages are sanitized before being sent to the model. Known injection patterns are detected and replaced:

- Instruction override attempts (`ignore previous instructions`)
- System prompt extraction attempts (`show me your prompt`)
- Role manipulation (`you are now`, `pretend to be`)
- DAN-style jailbreaks

**File:** `src/lib/ai/sanitize.ts`

### System Prompt Hardening

A security-hardened system prompt is prepended to every conversation with explicit rules against prompt leaking, instruction override, and harmful content generation.

**File:** `src/lib/ai/sanitize.ts` → `getSecureSystemPrompt()`

### Output Filtering (LLM06 — Information Disclosure)

AI responses are filtered through a `TransformStream` that redacts:

- Credentials (passwords, API keys, tokens, secrets)
- Personal information (emails, SSNs, credit card numbers, phone numbers)
- Technical details (IP addresses, private keys)
- Dangerous code patterns (`rm -rf`, `eval()`, `DROP TABLE`, `<script>`)

**Files:** `src/lib/ai/filter.ts`, `src/app/api/ai/chat/route.ts`

### Token Exhaustion Protection

- Max message length: 4,000 characters per message
- Max conversation length: 50 messages
- Max output tokens: 2,000 per response
- Response length cap: 10,000 characters

**Files:** `src/lib/validations/ai.ts`, `src/lib/ai/sanitize.ts`, `src/app/api/ai/chat/route.ts`

---

## Rate Limiting

In-memory rate limiters are configured per endpoint:

| Endpoint | Limit | Window |
|----------|-------|--------|
| Checkout sessions | 5 requests | 1 minute |
| AI chat | 20 requests | 1 minute |
| Webhooks | 100 requests | 1 minute |

**File:** `src/lib/utils/rate-limit.ts`

> **⚠️ Production Note:** The built-in rate limiter uses in-memory storage, which works for single-instance deployments but resets on each serverless invocation. For production on Netlify/Vercel, replace with [Upstash Rate Limit](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview) (free tier available, same API pattern).

---

## Error Handling (No Information Leakage)

API error responses return generic messages to the client. Internal details (stack traces, SDK errors, configuration info) are logged server-side only:

```ts
// ✅ What the client sees
{ error: 'Failed to create checkout session. Please try again.' }

// ✅ What the server logs
console.error('Error creating checkout session:', err)
```

**Files:** `src/app/api/webhooks/route.ts`, `src/app/api/checkout_sessions/route.ts`, `src/app/api/ai/chat/route.ts`

---

## File Upload Validation

Avatar uploads are validated before processing:

- **Allowed types:** JPEG, PNG, GIF, WebP only
- **Max size:** 5 MB
- **Storage:** User-scoped folders (`{userId}/avatar-{timestamp}.{ext}`)

**File:** `src/lib/profile/client.ts`

---

## Security Checklist for Builders

When customizing LaunchKit for your app, keep these practices:

- [ ] Set `NEXT_PUBLIC_APP_URL` to your production domain (Stripe redirects depend on it)
- [ ] Use live Stripe keys and update `STRIPE_WEBHOOK_SECRET` for production
- [ ] Consider [Upstash Rate Limit](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview) if deploying to serverless
- [ ] If adding new API routes, always call `auth()` and validate input with Zod
- [ ] If adding new database tables, enable RLS and add service role policies
- [ ] Never import from `@/lib/supabase/admin` in client components
- [ ] Keep error messages generic in API responses — log details server-side
