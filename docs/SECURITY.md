# CalledIt Security

How CalledIt protects player data, picks and answers, and what to keep in mind when changing it.

## Database access

**Rule: the browser never talks to Supabase.** Every query runs on the server through the service-role client in `src/lib/supabase/admin.ts`, which is guarded by `import 'server-only'` so it can't end up in a client bundle. The user's identity always comes from Clerk's server-side `auth()`, never from the request body.

**Table grants are revoked.** Every Supabase project ships a public anon key. Before migration `008_revoke_public_table_access`, that key could read `weeks` and `questions` directly, including `correct_answer` and `tiebreaker_answer` before a week locked. 008 revokes all table privileges from the `anon` and `authenticated` roles on every CalledIt table. RLS is still enabled underneath as a second layer.

If a future feature needs browser-side reads, expose a view without the answer columns and grant `SELECT` on that view. Don't re-grant the tables.

## Picks and scoring

| Check | Where |
|-------|-------|
| Picks rejected after the week's `locks_at` (403) | `src/lib/picks/actions.ts` |
| Picks rejected for a question that isn't in that week (400) | `src/lib/picks/actions.ts` |
| Body validated: UUID ids, exactly one of `answer` / `tiebreakerGuess`, guess 0–100000 | `src/app/api/picks/route.ts` |
| Database errors logged on the server; players get a generic message | `src/app/api/picks/route.ts` |
| Weekly leaderboard (and everyone's tiebreaker guesses) only for scored weeks | `src/app/api/leaderboard/weekly/[weekId]/route.ts` |
| Leaderboard requests for a week in another league return 404 | same |

## Admin

- `/admin` pages and `/api/admin/*` routes require the Clerk user id to be in `ADMIN_USER_IDS` (`src/lib/auth/admin.ts`).
- Every admin body is validated: question edits, week date edits (real dates only), scoring (booleans and numbers keyed by question id, updates scoped to that week), and question generation (strict `YYYY-MM-DD`).
- Generation refuses a week that already has questions (409), so a double-click can't trigger a second paid model call.
- The league used for generation is read from the week row in the database, never from the client.

## Profiles and avatars

- `avatar_url` only accepts `boring:<variant>` for one of the built-in generated avatars (`src/lib/validations/profile.ts`).
- Other people's avatars render through `MemberAvatar` (`src/components/ui/member-avatar.tsx`): generated avatars draw locally, and Clerk photos load only from `img.clerk.com`. Anything else shows initials, so a stored URL can't be used to make browsers fetch an arbitrary address.

## Rate limiting

`src/lib/utils/rate-limit.ts`, in-memory and fixed-window.

| Endpoint | Limit | Counted by |
|----------|-------|------------|
| `POST /api/picks` | 60 / minute | Clerk user id |
| `POST /api/checkout_sessions` | 5 / minute | Clerk user id |
| `POST /api/webhooks` | 100 / minute | IP |

Signed-in routes count by Clerk user id, which the client can't fake. IP-based limits read `x-vercel-forwarded-for` / `x-real-ip`, which Vercel overwrites with the address it saw.

Counters live per server instance, so this stops one client hammering an endpoint but isn't a global cap. For a hard limit, move the counters to a shared store such as Upstash Redis.

## HTTP headers

Set for every response in `next.config.ts`:

| Header | Purpose |
|--------|---------|
| `Content-Security-Policy` | Scripts, frames and API calls only from this site and Clerk (the Clerk host is read from the publishable key). `frame-ancestors 'none'`, `object-src 'none'`. |
| `Strict-Transport-Security` | HTTPS only, two years, subdomains included |
| `X-Frame-Options: DENY` | No embedding in iframes |
| `X-Content-Type-Options: nosniff` | No MIME sniffing |
| `Referrer-Policy: strict-origin-when-cross-origin` | Limits referrer data |
| `Permissions-Policy` | Camera, microphone and geolocation off |

The CSP follows [Clerk's guidance](https://clerk.com/docs/security/clerk-csp). It needs `'unsafe-inline'` for Next's inline bootstrap scripts and Clerk's injected styles. `'unsafe-eval'` and `ws:` are added in development only. **When you add a new script, image host or browser-side API, add its origin to the matching directive**, or the browser will block it (look for "Content Security Policy" errors in the console).

## Payments (Stripe, not used in v1)

- Webhooks are verified with `stripe.webhooks.constructEvent()` and `STRIPE_WEBHOOK_SECRET`.
- Checkout only accepts price ids from `src/config/pricing.ts`.
- Subscription upserts use `onConflict: 'stripe_subscription_id'`, so Stripe's retries don't create duplicates.

## Checklist for changes

- [ ] New API route: call `auth()` first, validate the body with Zod, return generic error messages.
- [ ] New admin route: use `requireAdmin()` / `isAdmin()`.
- [ ] New table: enable RLS and don't grant it to `anon` / `authenticated`.
- [ ] Never import `@/lib/supabase/admin` from a client component (`server-only` will fail the build).
- [ ] New external script, image host or browser API: add it to the CSP in `next.config.ts`.
- [ ] Migrations: staging first, back up live, `supabase migration list` and `--dry-run` before `db push` (see the README).
