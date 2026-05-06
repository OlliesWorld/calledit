# 🚀 Welcome to LaunchKit!

Thanks for purchasing LaunchKit! You're about to save weeks of setup time and ship your SaaS faster.

## Quick Start (15 minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Then fill in your API keys (see below for where to get them).

### 3. Set Up Your Database

1. Create a [Supabase](https://supabase.com) project
2. Run the migrations in `supabase/migrations/` via the SQL Editor
3. Add your Supabase URL and keys to `.env.local`

### 4. Set Up Authentication

1. Create a [Clerk](https://clerk.com) application
2. Add your Clerk keys to `.env.local`
3. Configure your OAuth providers in Clerk dashboard (optional)

### 5. Set Up Payments

1. Create a [Stripe](https://stripe.com) account
2. Create a Product and Price in Stripe Dashboard
3. Add your Stripe keys and Price ID to `.env.local`
4. Set up webhook endpoint: `https://yourdomain.com/api/webhooks`

### 6. Run the App

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

---

## Where to Get Your API Keys

| Service | URL | Keys Needed |
|---------|-----|-------------|
| **Clerk** | [dashboard.clerk.com](https://dashboard.clerk.com) | Publishable Key, Secret Key |
| **Supabase** | [supabase.com/dashboard](https://supabase.com/dashboard) | Project URL, Anon Key, Service Role Key |
| **Stripe** | [dashboard.stripe.com](https://dashboard.stripe.com) | Publishable Key, Secret Key, Webhook Secret, Price ID |
| **OpenAI** | [platform.openai.com](https://platform.openai.com) | API Key (optional, for AI chat) |
| **Anthropic** | [console.anthropic.com](https://console.anthropic.com) | API Key (optional, for AI chat) |

---

## Validate Your Setup

Run this command to check all your environment variables:

```bash
npm run validate-setup
```

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Login/signup pages
│   ├── (dashboard)/       # Protected dashboard pages
│   ├── (marketing)/       # Public marketing pages
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Reusable UI primitives
│   ├── forms/            # Form components
│   └── marketing/        # Landing page sections
├── lib/                   # Utilities and integrations
│   ├── auth/             # Clerk authentication
│   ├── supabase/         # Database client
│   ├── stripe/           # Payment integration
│   └── ai/               # AI chat utilities
├── config/               # App configuration
├── hooks/                # Custom React hooks
└── types/                # TypeScript types
```

---

## Customization Guide

### Branding
Edit `src/config/site.ts` to update:
- App name and description
- Social links
- Contact info
- Hero text

### Pricing
Edit `src/config/pricing.ts` to update:
- Plan names and prices
- Feature lists
- Stripe Price IDs

### Features
Toggle features in `src/config/features.ts` without code changes.

---

## Deployment

### Netlify (Recommended)
1. Push to GitHub
2. Connect repo to Netlify
3. Add environment variables
4. Deploy!

### Vercel
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

---

## Need Help?

- 📖 Check the `docs/` folder for detailed setup guides
- 📝 Read the inline code comments
- 🐛 Found a bug? Email me!

Happy building! 🚀
