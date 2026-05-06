export const ROUTES = {
  // Public routes
  HOME: '/',
  PRICING: '/#pricing',
  CONTACT: '/contact',

  // Auth routes
  LOGIN: '/login',
  SIGNUP: '/signup',
  RESET_PASSWORD: '/reset-password',

  // Dashboard routes
  DASHBOARD: '/dashboard',
  AI_CHAT: '/ai-chat',
  PROFILE: '/profile',
  SETTINGS: '/settings',

  // API routes
  API: {
    AUTH: '/api/auth',
    WEBHOOKS: {
      STRIPE: '/api/webhooks/stripe',
    },
  },
} as const;
