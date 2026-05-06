# LaunchKit 🚀

> A thoughtfully crafted Next.js starter template. Skip the setup, start building what matters.

## Overview

**LaunchKit** is a modern, production-ready Next.js starter template built with the latest web technologies. Launch your idea this weekend instead of spending weeks on setup. This template provides everything you need to build and ship your app, with a carefully crafted codebase that follows best practices and scales with your project.

Perfect for building SaaS products, landing pages, or modern web applications. Built by developers, for developers who want to focus on building unique features instead of spending days on setup and configuration.

## Key Features

### Authentication & User Management
- **Email/Password Authentication** - Secure user registration and login with Clerk
- **OAuth Integration** - One-click sign-in with Google (more providers available)
- **Email Verification** - Built-in email verification flow
- **Protected Routes** - Automatic middleware-based route protection
- **User Profiles** - Complete profile management with avatar uploads
- **User Preferences** - Customizable user settings (theme, language, notifications)
- **Session Management** - Secure session handling with Clerk

### Payments & Subscriptions
- **Stripe Integration** - Production-ready payment processing
- **Multiple Pricing Tiers** - Free, Pro, and Team plans included
- **Subscription Management** - Automatic billing and renewal handling
- **Webhook Processing** - Robust webhook handlers for payment events
- **Tax Calculation** - Automatic tax calculation via Stripe Tax
- **Secure Checkout** - PCI-compliant payment flows

### AI Integration
- **Multi-Provider AI Chat** - OpenAI, Anthropic, and Google AI support
- **Streaming Responses** - Real-time AI response streaming with Vercel AI SDK
- **Model Selection** - Switch between AI providers at runtime
- **Rate Limited** - Built-in rate limiting for AI API calls
- **Type-Safe** - Full TypeScript support for AI operations
- **Extensible Architecture** - Easy to add image analysis, RAG, and more

### UI & Components
- **Beautiful Design System** - Built with Radix UI and Tailwind CSS 4
- **Fully Responsive** - Mobile-first design approach
- **Accessible Components** - WCAG compliant UI primitives
- **Dark Mode Ready** - Theme system infrastructure in place
- **Pre-built Pages** - Landing, pricing, login, signup, dashboard, profile, contact, AI chat
- **Reusable Components** - Organized component library (UI, forms, marketing, layout, AI)

### Developer Experience
- **TypeScript** - Full type safety throughout the codebase
- **Modern Stack** - Next.js 16 (App Router), React 19, Tailwind CSS 4
- **Clean Architecture** - Domain-driven file organization
- **Path Aliases** - Clean imports with TypeScript path mapping
- **Route Groups** - Organized app structure with Next.js route groups
- **Form Validation** - Zod schemas for client and server-side validation
- **Database Types** - Auto-generated TypeScript types from Supabase

### Infrastructure & Configuration
- **Supabase Backend** - PostgreSQL database with Row Level Security (RLS)
- **File Storage** - Built-in avatar upload with Supabase Storage
- **Config Management** - Centralized configuration files for easy customization
- **Feature Flags** - Toggle features without deploying code
- **Rate Limiting** - Built-in API rate limiting for APIs and AI endpoints
- **Validation Utilities** - Pre-built validation schemas (auth, profile, checkout, AI)

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **UI Components** | [Radix UI](https://www.radix-ui.com/) |
| **Authentication** | [Clerk](https://clerk.com/docs) |
| **Database** | [Supabase PostgreSQL](https://supabase.com/docs/guides/database) |
| **Payments** | [Stripe](https://stripe.com/) |
| **AI Integration** | [Vercel AI SDK](https://sdk.vercel.ai/) |
| **Form Validation** | [Zod](https://zod.dev/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Deployment** | [Netlify](https://www.netlify.com/) (recommended) |

## Quick Start

### Prerequisites

Before you begin, ensure you have:
- **Node.js 18+** installed on your machine
- A **[Clerk](https://clerk.com)** account (free tier works great)
- A **[Supabase](https://supabase.com)** account for database (free tier works great)
- A **[Stripe](https://stripe.com)** account (test mode is fine to start)
- **AI API Keys** (optional, for AI features):
  - [OpenAI API Key](https://platform.openai.com/api-keys)
  - [Anthropic API Key](https://console.anthropic.com/)
  - [Google AI API Key](https://aistudio.google.com/app/apikey)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/LadyKerr/launchkit.git
cd your-repo
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env.local
```

4. **Configure your environment:**

   Open `.env.local` and add your credentials (see [Environment Variables](#environment-variables) section below)

5. **Set up your database:**

   Follow the [Database Setup Guide](./docs/setup/database.md) to create tables and configure RLS policies

6. **Run the development server:**
```bash
npm run dev
```

7. **Open your browser:**

   Navigate to [http://localhost:3000](http://localhost:3000)

### First Steps

After installation, we recommend:
1. Setting up Clerk authentication (see [Auth Setup](./docs/setup/auth.md))
2. Setting up Supabase database (see [Database Setup](./docs/setup/database.md))
3. Setting up Stripe payments (see [Stripe Setup](./docs/setup/stripe.md))
4. Adding AI API keys to `.env.local` (optional, for AI chat features)
5. Customizing the site configuration in `src/config/site.ts`
6. Updating pricing plans in `src/config/pricing.ts`

## Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env.local
```

See [`.env.example`](./.env.example) for all required and optional environment variables with detailed comments explaining where to find each value.

For detailed setup instructions for each service, see:
- [Auth Setup Guide](./docs/setup/AUTH_SETUP.md) - Clerk authentication setup
- [Database Setup Guide](./docs/setup/DATABASE_SETUP.md) - Supabase database configuration
- [Stripe Setup Guide](./docs/setup/STRIPE_SETUP.md) - Payment configuration

## Available Scripts

```bash
# Development
npm run dev              # Start development server (http://localhost:3000)

# Production
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint

# Database
npm run types:generate   # Generate TypeScript types from Supabase schema

# Utilities
npm run validate-setup   # Validate environment configuration
```

## Configuration

### Site Configuration

Update `src/config/site.ts` to customize your site metadata:

```typescript
export const siteConfig = {
  name: "Your SaaS Name",
  description: "Your SaaS Description",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  // ... more options
}
```

### Pricing Plans

Customize pricing in `src/config/pricing.ts`:

```typescript
export const pricingPlans = [
  {
    id: "free",
    name: "Starter",
    price: 0,
    features: ["Feature 1", "Feature 2"],
    // ...
  },
  // ... more plans
]
```

### Feature Flags

Toggle features in `src/config/features.ts`:

```typescript
export const features = {
  auth: {
    googleOAuth: true,
    githubOAuth: false,
  },
  // ... more flags
}
```

## Deployment

### Deploy to Netlify (Recommended)

The easiest way to deploy your LaunchKit project is with [Netlify](https://www.netlify.com):

1. **Push your code to GitHub:**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Import to Netlify:**
   - Go to [app.netlify.com/start](https://app.netlify.com/start)
   - Connect your GitHub account and select your repository
   - Netlify will auto-detect Next.js

3. **Configure environment variables:**
   - Go to Site Settings > Environment Variables
   - Add all variables from `.env.example`

4. **Deploy:**
   - Click "Deploy site"
   - Your site will be live in minutes

5. **Set up webhooks:**
   - Update your Stripe webhook URL to `https://your-site.netlify.app/api/webhooks`
   - Update `NEXT_PUBLIC_APP_URL` to your production URL

### Other Platforms

Your LaunchKit project can be deployed to any platform that supports Next.js:

- **[Vercel](https://vercel.com/)** - The creators of Next.js
- **[Railway](https://railway.app/)** - Simple deployments with databases
- **[Fly.io](https://fly.io/)** - Deploy globally with edge computing
- **Self-hosted** - Deploy on your own infrastructure

Make sure to:
- Configure environment variables on your chosen platform
- Set up webhook URLs for Stripe
- Configure OAuth redirect URLs for authentication

## Documentation

### Setup Guides
- **[Authentication Setup](./docs/setup/auth.md)** - Configure Clerk authentication and OAuth providers
- **[Database Setup](./docs/setup/database.md)** - Complete Supabase setup with schema, RLS policies, and storage
- **[Stripe Setup](./docs/setup/stripe.md)** - Set up payments, webhooks, and subscription management

## Features Comparison

### What's Included Out of the Box

| Feature | Status |
|---------|--------|
| Email/Password Auth | ✅ |
| Google OAuth | ✅ |
| User Profiles | ✅ |
| Avatar Uploads | ✅ |
| User Preferences | ✅ |
| Stripe Payments | ✅ |
| Subscriptions | ✅ |
| Webhooks | ✅ |
| Protected Routes | ✅ |
| Pricing Page | ✅ |
| Landing Page | ✅ |
| Contact Page | ✅ |
| Dashboard | ✅ |
| AI Chat (Multi-Provider) | ✅ |
| Streaming AI Responses | ✅ |
| Responsive Design | ✅ |
| TypeScript | ✅ |
| Database (PostgreSQL) | ✅ |
| File Storage | ✅ |

### Roadmap Features

See [FEATURE_ROADMAP.md](./docs/FEATURE_ROADMAP.md) for planned features including:
- **AI Enhancements** - Token tracking, conversation history, RAG, image/PDF analysis
- Email service integration (transactional emails)
- Magic link authentication
- Legal pages (Terms, Privacy, etc.)
- Blog/content system (MDX)
- Admin dashboard
- Analytics integration
- And more...

## Support

### Getting Help

- **Documentation**: Check the [setup guides](./docs/setup/) for detailed instructions
- **Next.js**: [Next.js Documentation](https://nextjs.org/docs)
- **Supabase**: [Supabase Documentation](https://supabase.com/docs)
- **Stripe**: [Stripe Documentation](https://stripe.com/docs)
- **Tailwind CSS**: [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Common Issues

**Build Errors**: Run `npm run build` to check for TypeScript errors before deploying

**Authentication Issues**: Verify your Clerk publishable key and secret key are correct in `.env.local`

**Payment Issues**: Ensure webhook secret is configured and webhooks are reaching your endpoint

**Database Errors**: Check that Supabase RLS policies are set up correctly (see database setup guide)

## Contributing

Contributions are welcome! This is a starter template meant to be customized for your needs, but improvements to the base template are appreciated.

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Guidelines

- Follow the existing code style and structure
- Add TypeScript types for all new code
- Test your changes locally before submitting
- Update documentation if you change functionality

## Acknowledgments

Built with these amazing open-source projects:
- [Next.js](https://nextjs.org/) by Vercel
- [Clerk](https://clerk.com/) for authentication
- [Supabase](https://supabase.com/) for database infrastructure
- [Stripe](https://stripe.com/) for payment processing
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

**Ready to launch?** Start building your app today with LaunchKit.

For detailed setup instructions, head over to the [Database Setup Guide](./docs/setup/database.md) to get started.
# calledit
