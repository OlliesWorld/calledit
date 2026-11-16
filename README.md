# CalledIt

> Women's basketball pick'em. Make your picks each week, see who called it.

**Call it. Prove it.**

## What It Is

CalledIt is a weekly pick'em app for the WNBA and Unrivaled. Each week has five yes/no picks about real games plus a tiebreaker. Players lock in picks before tip-off, an admin scores the week, and the leaderboards show who called it.

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4 |
| **Authentication** | Clerk |
| **Database** | Supabase (PostgreSQL), server-side access only |
| **Question generation** | Anthropic API (`@anthropic-ai/sdk`) |
| **Validation** | Zod |
| **Deployment** | Vercel |

Stripe is wired up (checkout + webhooks) but not used in v1.

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.example .env.local
   npm run validate-setup
   ```

   Fill in `.env.local` with your Clerk keys, Supabase URL and secret key, `ADMIN_USER_IDS` and (for question generation) `ANTHROPIC_API_KEY`. `validate-setup` checks the values and tests the Supabase connection.

3. **Set up the database:** link the Supabase CLI to your project and push the migrations in `supabase/migrations/` (see [Database](#database)).

4. **Run the dev server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

See [`.env.example`](./.env.example) for the full list. Setup guides are in [`docs/setup/`](./docs/setup/).

| Variable | Where it's used |
|----------|-----------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | Sign-in. The publishable key also sets the Clerk host allowed by the CSP. |
| `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | All database access, on the server only. |
| `ADMIN_USER_IDS` | Comma-separated Clerk user IDs allowed into `/admin`. |
| `ANTHROPIC_API_KEY` | Admin "generate questions". |

No Supabase anon/publishable key is needed: nothing in the browser talks to Supabase.

## Environments

| | Supabase project | Used by |
|---|---|---|
| **Live** | `sqdk…` | Production on Vercel, local `.env.local` |
| **Staging** | `fhgw…` | Trying migrations and features before live |

Vercel's environment variables decide which database a deployment uses. Point Preview at staging and Production at live, so a pull request can never write to live data.

## Database

Migrations live in `supabase/migrations/` and are applied with the Supabase CLI. They are additive: new columns and permissions, never renames or drops.

| Migration | What it does |
|-----------|--------------|
| `001`–`003` | Subscriptions, profiles, preferences |
| `004`–`006` | Weeks, questions, picks |
| `007_add_league` | `weeks.league` (`wnba` \| `unrivaled`), existing weeks backfilled to `wnba` |
| `008_revoke_public_table_access` | Removes the anon/authenticated roles' direct table access (see [Security](#security)) |

### Applying a migration

Always staging first, then live. Before touching live, take a backup.

```bash
# 1. Check which project the CLI is linked to
cat supabase/.temp/project-ref

# 2. Staging: link, push, test the app against it
supabase link --project-ref <staging-ref>
supabase db push

# 3. Live: link, back up, compare, push
supabase link --project-ref <live-ref>
supabase migration list            # read-only: what live already has
pg_dump "$(cat supabase/.temp/pooler-url)" -n public -f ~/calledit-backups/live-full-$(date +%F).sql
pg_dump "$(cat supabase/.temp/pooler-url)" -n public --data-only -f ~/calledit-backups/live-data-$(date +%F).sql
supabase db push --dry-run         # shows exactly which migrations will run
supabase db push
```

- `pg_dump` comes from `brew install libpq` (then `export PATH="/opt/homebrew/opt/libpq/bin:$PATH"`). Its major version must be at least the server's (Postgres 17). `supabase db dump` does the same job but needs Docker.
- Keep backups outside the repo: they contain user data.
- If `supabase/.temp/pooler-url` still names the other project after `supabase link`, delete it and link again. A stale pooler URL can send commands to the wrong database.
- The database password asked for is the project's Postgres password (Project Settings → Database), not an API key.

## Leagues

CalledIt supports more than one league. Every week belongs to exactly one league (`weeks.league`); questions and picks inherit it through `week_id`.

| League | URL | Schedule source |
|--------|-----|-----------------|
| WNBA | `/wnba`, `/wnba/leaderboard` | ESPN public scoreboard (`src/lib/schedule/espn.ts`) |
| Unrivaled | `/unrivaled`, `/unrivaled/leaderboard` | Hand-entered JSON (`data/unrivaled-2027.json`) |

The league is in the URL. The old `/dashboard` and `/leaderboard` URLs redirect to the league you last used (a cookie), defaulting to WNBA. The leaderboard and current-week APIs take `?league=<slug>`.

Each league shows one active week at a time, so keep only one week per league in `open` status.

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

The ESPN source fetches one day at a time (the scoreboard API rejects date ranges), up to 31 days.

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

## Security

Full details in [`docs/SECURITY.md`](./docs/SECURITY.md). In short:

- **Server-only database access.** Every read and write goes through the service-role client on the server after Clerk has identified the user. Migration 008 revokes the anon and authenticated roles' table grants, so the public anon key can't read answers or anything else.
- **Picks are enforced on the server.** Picks are rejected after `locks_at` (403) or for a question outside the week (400). Request bodies are validated with Zod.
- **No early peeking.** A week's leaderboard (including tiebreaker guesses) only exists once the week is scored.
- **Admin routes** check `ADMIN_USER_IDS` and validate every body.
- **Rate limiting** per Clerk user on pick saves and checkout; by Vercel-set IP elsewhere.
- **Security headers** including a Content-Security-Policy in `next.config.ts`. When adding a new script, image host or browser-side API, add its origin there.

## Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Serve the production build
npm run lint             # Run ESLint
npm run types:generate   # Regenerate Supabase TypeScript types (needs SUPABASE_PROJECT_ID)
npm run validate-setup   # Check .env.local and test the Supabase connection
```

## Deployment

Deployed on [Vercel](https://vercel.com). Push to `main` and Vercel builds production; pull requests get preview deployments. Environment variables live in Project Settings → Environment Variables (see [Environments](#environments)).

Clerk runs on its production instance for the custom domain. Google sign-in on a production Clerk instance needs your own Google OAuth client ID and secret (Clerk dashboard → SSO connections).

Apply any new migrations to live **before** deploying code that depends on them.
