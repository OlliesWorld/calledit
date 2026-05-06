# CalledIt

> WNBA pick'em. Make your picks each week, see who called it.

**Call it. Prove it.**

## What It Is

CalledIt is a weekly WNBA pick'em app. Users make game predictions each week and compete to see who called it right.

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4 |
| **UI Components** | Radix UI |
| **Authentication** | Clerk |
| **Database** | Supabase (PostgreSQL + RLS) |
| **Payments** | Stripe |
| **Deployment** | Netlify |

## Getting Started

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env.local
```
Fill in `.env.local` with your Clerk, Supabase, and Stripe credentials.

3. **Set up the database:**

Run the SQL migrations in `supabase/` against your Supabase project.

4. **Run the dev server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

See [`.env.example`](./.env.example) for all required variables.

Setup guides are in [`docs/setup/`](./docs/setup/).

## Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run lint             # Run ESLint
npm run types:generate   # Regenerate Supabase TypeScript types
npm run validate-setup   # Validate environment config
```

## Deployment

Configured for [Netlify](https://www.netlify.com). Push to main, connect the repo in Netlify, and add environment variables in Site Settings.

Update `NEXT_PUBLIC_APP_URL` and Stripe webhook URL to your production domain after deploying.
