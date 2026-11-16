import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Clerk's Frontend API host is encoded in the publishable key
// (pk_live_<base64("clerk.example.com$")>), so dev and prod each allow their own.
function clerkFrontendApi(): string | null {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const encoded = key?.split("_")[2];
  if (!encoded) return null;
  const host = Buffer.from(encoded, "base64").toString("utf8").replace(/\$$/, "");
  return /^[a-z0-9.-]+$/i.test(host) ? `https://${host}` : null;
}

// Content-Security-Policy, following https://clerk.com/docs/security/clerk-csp.
// 'unsafe-inline' is needed by Next's inline bootstrap scripts and Clerk's
// injected styles; 'unsafe-eval' and ws: only in dev for hot reload. When
// something new needs to load (a script, an image host, an API the browser
// calls), add its origin to the matching directive below.
function contentSecurityPolicy(): string {
  const clerk = clerkFrontendApi();
  const cloudflare = "https://challenges.cloudflare.com";
  const clerkProtect = "https://*.protect.clerk.com";
  const directives: Record<string, (string | null | false)[]> = {
    "default-src": ["'self'"],
    "script-src": ["'self'", "'unsafe-inline'", isDev && "'unsafe-eval'", clerk, cloudflare, clerkProtect],
    "connect-src": ["'self'", clerk, `${clerkProtect}:*`, "https://clerk-telemetry.com", isDev && "ws:"],
    "img-src": ["'self'", "data:", "blob:", "https://img.clerk.com"],
    "style-src": ["'self'", "'unsafe-inline'"],
    "font-src": ["'self'", "data:"],
    "worker-src": ["'self'", "blob:"],
    "frame-src": [cloudflare, clerkProtect],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
    "base-uri": ["'self'"],
    "object-src": ["'none'"],
  };
  const policy = Object.entries(directives)
    .map(([name, sources]) => [name, ...sources.filter(Boolean)].join(" "))
    .join("; ");
  return isDev ? policy : `${policy}; upgrade-insecure-requests`;
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy(),
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
