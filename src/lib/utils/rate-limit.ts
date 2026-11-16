import { NextRequest, NextResponse } from 'next/server'

/**
 * Simple in-memory, fixed-window rate limiter.
 *
 * Counts live in the memory of one server instance, so on Vercel each warm
 * function has its own counters. That is enough to stop a single client
 * hammering an endpoint, not a coordinated attack. For a hard global limit,
 * move the counters to a shared store (e.g. Upstash Redis).
 *
 * Who is counted:
 * - Signed-in routes pass the Clerk user id, which the client cannot fake.
 * - Anonymous routes fall back to the client IP. Only headers Vercel sets
 *   itself are trusted for that (see clientIp below).
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

export class RateLimiter {
  private requests = new Map<string, RateLimitEntry>()
  private lastSweep = 0

  constructor(
    private readonly windowMs: number,
    private readonly maxRequests: number,
  ) {}

  // Drop expired entries at most once per window. Done lazily rather than with
  // setInterval, which keeps serverless functions (and test runs) alive.
  private sweep(now: number) {
    if (now - this.lastSweep < this.windowMs) return
    this.lastSweep = now
    for (const [key, entry] of this.requests) {
      if (now > entry.resetTime) this.requests.delete(key)
    }
  }

  check(key: string): { allowed: boolean; limit: number; remaining: number; reset: number } {
    const now = Date.now()
    this.sweep(now)
    const entry = this.requests.get(key)

    if (!entry || now > entry.resetTime) {
      const resetTime = now + this.windowMs
      this.requests.set(key, { count: 1, resetTime })
      return { allowed: true, limit: this.maxRequests, remaining: this.maxRequests - 1, reset: resetTime }
    }

    if (entry.count >= this.maxRequests) {
      return { allowed: false, limit: this.maxRequests, remaining: 0, reset: entry.resetTime }
    }

    entry.count++
    return { allowed: true, limit: this.maxRequests, remaining: this.maxRequests - entry.count, reset: entry.resetTime }
  }
}

/**
 * The caller's IP, from headers the Vercel edge sets itself.
 *
 * Vercel overwrites x-forwarded-for (and its copies x-real-ip and
 * x-vercel-forwarded-for) with the address it saw, so a client can't choose
 * its own value there. Off Vercel (local dev) these headers are whatever the
 * client sent, which is fine for development.
 */
export function clientIp(req: NextRequest): string {
  const header =
    req.headers.get('x-vercel-forwarded-for') ??
    req.headers.get('x-real-ip') ??
    req.headers.get('x-forwarded-for')
  return header?.split(',')[0].trim() || 'unknown'
}

// Checkout sessions: 5 per minute per signed-in user
export const checkoutRateLimiter = new RateLimiter(60_000, 5)

// Stripe webhooks: 100 per minute per IP. Signatures are verified separately;
// this only blunts floods of unsigned junk.
export const webhookRateLimiter = new RateLimiter(60_000, 100)

// Pick saves: 60 per minute per signed-in user (a full card is 6 saves, plus
// changes of mind)
export const picksRateLimiter = new RateLimiter(60_000, 60)

/**
 * Apply rate limiting to a request. Pass `key` (the Clerk user id) on
 * signed-in routes; without it the client IP is used.
 * Returns a 429 response if the limit is exceeded, null otherwise.
 */
export function applyRateLimit(
  req: NextRequest,
  limiter: RateLimiter,
  key?: string,
): NextResponse | null {
  const result = limiter.check(key ? `user:${key}` : `ip:${clientIp(req)}`)
  if (result.allowed) return null

  const retryAfter = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000))
  return NextResponse.json(
    { error: 'Too many requests. Please try again later.' },
    {
      status: 429,
      headers: {
        'Retry-After': retryAfter.toString(),
        'X-RateLimit-Limit': result.limit.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': result.reset.toString(),
      },
    },
  )
}
