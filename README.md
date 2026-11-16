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

## Leagues

CalledIt supports more than one league. Every week belongs to exactly one league (`weeks.league`); questions and picks inherit it through `week_id`.

| League | URL | Schedule source |
|--------|-----|-----------------|
| WNBA | `/wnba`, `/wnba/leaderboard` | ESPN public scoreboard (`src/lib/schedule/espn.ts`) |
| Unrivaled | `/unrivaled`, `/unrivaled/leaderboard` | Hand-entered JSON (`data/unrivaled-2027.json`) |

The league is in the URL. The old `/dashboard` and `/leaderboard` URLs redirect to the league you last used (a cookie), defaulting to WNBA. The leaderboard and current-week APIs take `?league=<slug>`.

Unrivaled support is fan-made and not affiliated with Unrivaled. The app uses plain-text team names only: no logos, wordmarks or brand colors.

### The schedule adapter

Question generation never talks to a data provider directly. It asks for a `ScheduleSource`:

```ts
// src/lib/schedule/types.ts
interface ScheduleSource {
  getGames(startDate: string, endDate: string): Promise<Game[]> // YYYY-MM-DD, inclusive
}
```

`getScheduleSource(league)` in `src/lib/schedule/index.ts` returns the source for a league. `generateQuestions` reads the league from the week row in the database (never from the client), fetches games through the adapter, and builds the prompt from a shared core plus per-league context in `src/lib/questions/prompt.ts`. The model's reply is validated (exactly 5 picks and 1 tiebreaker) in `src/lib/questions/parse.ts` before anything is inserted.

Unrivaled's official data comes from Sportradar's paid API. There is no Sportradar code here, only the seam: a `sportradarSource` implementing `ScheduleSource` would be returned from `getScheduleSource('unrivaled')`, with the JSON file as a fallback.

### Updating the Unrivaled schedule

Edit `data/unrivaled-2027.json`. Each game needs a stable `id` (`unr-2027-NNN`), a `date` (`YYYY-MM-DD`), two teams and a `tipoff` (ISO timestamp, or `null` if unknown). The file's `todo` list tracks what is still missing. Only enter games from the official schedule.

### Adding a league

1. **Database:** add a migration that extends the `weeks_league_check` constraint to allow the new slug.
2. **Config:** add the slug and label to `LEAGUES` and `LEAGUE_LABELS` in `src/lib/leagues.ts` (and a disclaimer in `LEAGUE_DISCLAIMERS` if the league needs one). TypeScript will then point at every place that needs a decision.
3. **Schedule:** implement a `ScheduleSource` in `src/lib/schedule/` and return it from `getScheduleSource`.
4. **Prompt:** add the league's context (game line format, notes, JSON example) to `LEAGUE_CONTEXT` in `src/lib/questions/prompt.ts`.
5. **Homepage:** add a blurb for the picker in `src/components/league/league-picker.tsx`.

Routes, leaderboards, the admin league selector and the status-bar switcher pick the new league up from `LEAGUES` automatically.

## Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run lint             # Run ESLint
npm run types:generate   # Regenerate Supabase TypeScript types
npm run validate-setup   # Validate environment config
```

## Deployment

Deployed on [Vercel](https://vercel.com). Push to main and Vercel builds it; environment variables live in Project Settings → Environment Variables.

Update `NEXT_PUBLIC_APP_URL` and Stripe webhook URL to your production domain after deploying.
