import { NextRequest, NextResponse } from 'next/server'

/**
 * Simple in-memory rate limiter
 *
 * NOTE: This implementation uses in-memory storage and is suitable for:
 * - Development environments
 * - Single-instance deployments
 *
 * For production with multiple instances or serverless deployments, consider using:
 * - Upstash Rate Limit: https://upstash.com/docs/redis/sdks/ratelimit-ts/overview
 * - Redis-based rate limiting
 * - Vercel Edge Config with KV
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private requests: Map<string, RateLimitEntry> = new Map()
  private windowMs: number
  private maxRequests: number

  constructor(windowMs: number = 60000, maxRequests: number = 10) {
    this.windowMs = windowMs
    this.maxRequests = maxRequests

    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60000)
  }

  private cleanup() {
    const now = Date.now()
    for (const [key, entry] of this.requests.entries()) {
      if (now > entry.resetTime) {
        this.requests.delete(key)
      }
    }
  }

  private getIdentifier(req: NextRequest): string {
    // Try to get real IP from various headers (for proxies/load balancers)
    const forwarded = req.headers.get('x-forwarded-for')
    const realIp = req.headers.get('x-real-ip')
    const ip = forwarded?.split(',')[0] || realIp || 'unknown'

    return ip
  }

  check(req: NextRequest): { allowed: boolean; limit: number; remaining: number; reset: number } {
    const identifier = this.getIdentifier(req)
    const now = Date.now()
    const entry = this.requests.get(identifier)

    if (!entry || now > entry.resetTime) {
      // New window or expired entry
      const resetTime = now + this.windowMs
      this.requests.set(identifier, { count: 1, resetTime })
      return {
        allowed: true,
        limit: this.maxRequests,
        remaining: this.maxRequests - 1,
        reset: resetTime
      }
    }

    if (entry.count >= this.maxRequests) {
      // Rate limit exceeded
      return {
        allowed: false,
        limit: this.maxRequests,
        remaining: 0,
        reset: entry.resetTime
      }
    }

    // Increment counter
    entry.count++
    this.requests.set(identifier, entry)

    return {
      allowed: true,
      limit: this.maxRequests,
      remaining: this.maxRequests - entry.count,
      reset: entry.resetTime
    }
  }
}

// Rate limiter instances for different endpoints
// Adjust these limits based on your needs

// Checkout sessions: 5 requests per minute per IP
export const checkoutRateLimiter = new RateLimiter(60000, 5)

// Webhooks: 100 requests per minute per IP (Stripe sends many webhooks)
export const webhookRateLimiter = new RateLimiter(60000, 100)

// AI Chat: 20 requests per minute per IP
export const aiChatRateLimiter = new RateLimiter(60000, 20)

/**
 * Apply rate limiting to a request
 * Returns a 429 response if rate limit is exceeded, null otherwise
 */
export function applyRateLimit(
  req: NextRequest,
  limiter: RateLimiter
): NextResponse | null {
  const result = limiter.check(req)

  if (!result.allowed) {
    const retryAfter = Math.ceil((result.reset - Date.now()) / 1000)
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': result.limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': result.reset.toString(),
        }
      }
    )
  }

  return null
}
