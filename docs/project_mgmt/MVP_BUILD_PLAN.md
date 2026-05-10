# CalledIt — MVP Build Plan

**Date:** May 2026
**Version:** 2.0

---

## Overview

Build CalledIt on top of the LaunchKit foundation (Clerk auth, Supabase DB, Stripe plumbing, Next.js 16 shell). The app is a weekly women's sports pick'em: users make yes/no picks on player/game questions, admin scores results, leaderboard tracks weekly and season standings.

**Supported sports (current + roadmap):** WNBA, NWSL, PWHL

**Existing foundation:**
- Clerk auth (login, signup, Google OAuth)
- Supabase with profiles and preferences tables
- Next.js 16 App Router with dashboard layout
- UI component library (Button, Card, Input, etc.)
- Feature flags, route constants, validation schemas

---

## Sprint 0: Design ✅ Complete

**Owner:** External (Claude design pass)
**Deliverable:** `docs/project_mgmt/DESIGN_SPEC.md`

Produce the visual design for CalledIt before building user-facing screens.

- Color palette, typography, component specs
- Key screen mockups: landing, picks (open/locked/scored states), leaderboard, admin
- Design gates Sprint 2 (picks UI)
- Admin UI (Sprint 3) can proceed without design approval — plain functional layout is fine

---

## Sprint 1: Data Layer ✅ Complete

**Goal:** Database tables ready, TypeScript types generated, data can be read and written from code.

### Tasks

1. **Supabase migrations** — create the three CalledIt tables:
   - `supabase/migrations/004_create_weeks_table.sql`
   - `supabase/migrations/005_create_questions_table.sql`
   - `supabase/migrations/006_create_picks_table.sql` (with RLS policies)

2. **Domain types** — `src/types/calledit.ts`
   - `Week`, `Question`, `Pick` types
   - `WeekStatus` = `'upcoming' | 'open' | 'locked' | 'scored'`
   - `QuestionType` = `'pick' | 'tiebreaker'`

3. **Server queries** — `src/lib/picks/server.ts`
   - `getActiveWeek()` — returns current open/upcoming week + questions
   - `getQuestionsForWeek(weekId)` — returns questions with display order
   - `getPicksForUser(weekId, userId)` — returns user's existing picks for a week

4. **Server action** — `src/lib/picks/actions.ts`
   - `submitPick(questionId, answer | tiebreakerGuess)` — upserts into `picks`

5. **Regenerate types** — `npm run types:generate` after migrations are applied

### Key Files
```
supabase/migrations/004_create_weeks_table.sql
supabase/migrations/005_create_questions_table.sql
supabase/migrations/006_create_picks_table.sql
src/types/calledit.ts
src/lib/picks/server.ts
src/lib/picks/actions.ts
src/types/database.ts (regenerated)
```

---

## Sprint 2: Picks UI ✅ Complete

**Prerequisite:** Sprint 0 (design) + Sprint 1 (data layer)
**Goal:** Authenticated users can view this week's questions and submit picks.

### Tasks

1. **API route** — `GET /api/weeks/current`
   - Returns active week + its questions
   - Returns `null` if no open/upcoming week exists

2. **API route** — `POST /api/picks`
   - Validates week status = `'open'`
   - Upserts pick for the authenticated user
   - Returns updated pick

3. **This Week page** — `src/app/(dashboard)/dashboard/page.tsx`
   - Replace the placeholder with the picks UI
   - Fetch active week and user's existing picks on load
   - Handle no-active-week state

4. **Question card component** — `src/components/picks/question-card.tsx`
   - Shows question text + flavor text blurb
   - Yes/No toggle buttons (or read-only state when locked/scored)
   - Correct/incorrect result overlay when week is scored

5. **Tiebreaker input** — `src/components/picks/tiebreaker-input.tsx`
   - Numeric input with label
   - Disabled when locked/scored

6. **Picks form** — `src/components/picks/picks-form.tsx`
   - Contains all question cards + tiebreaker
   - Submit button with loading state
   - Calls `POST /api/picks` for each question on submit

7. **Lock state** — display picks read-only with "Results pending" when `status = 'locked'`

8. **Results state** — show correct/incorrect + score summary when `status = 'scored'`

9. **Lock countdown** — show time remaining until `locks_at` when status = `'open'`

### Key Files
```
src/app/api/weeks/current/route.ts
src/app/api/picks/route.ts
src/app/(dashboard)/dashboard/page.tsx
src/components/picks/question-card.tsx
src/components/picks/tiebreaker-input.tsx
src/components/picks/picks-form.tsx
```

---

## Sprint 3: Admin Tools + AI Question Generation ✅ Complete

**Prerequisite:** Sprint 1 (data layer)
**Goal:** Admin can create a week, generate questions via Claude from the ESPN schedule, review and publish, then score results after games.

### Tasks

1. **Admin auth guard** — `src/lib/auth/admin.ts`
   - `requireAdmin()` helper — checks Clerk userId against `ADMIN_USER_IDS` env var
   - Used in every `/api/admin/*` route

2. **ESPN client** — `src/lib/espn/client.ts`
   - `fetchWnbaSchedule(startDate, endDate)` — calls ESPN unofficial scoreboard API
   - Returns array of games with teams, tip-off times, ESPN game IDs

3. **Question generation** — `src/lib/questions/generate.ts`
   - `buildClaudePrompt(games)` — assembles the prompt with schedule data
   - `generateQuestions(weekId, startDate, endDate)` — orchestrates ESPN fetch → Claude call → insert questions

4. **Admin week list** — `src/app/(dashboard)/admin/page.tsx`

5. **Create week form** — `src/app/(dashboard)/admin/weeks/new/page.tsx`

6. **Week detail page** — `src/app/(dashboard)/admin/weeks/[id]/page.tsx`
   - "Generate Questions" button, editable draft questions, "Publish" button

7. **Admin API routes:**
   - `POST /api/admin/weeks`
   - `POST /api/admin/weeks/[id]/generate`
   - `PATCH /api/admin/weeks/[id]/status`
   - `PUT /api/admin/questions/[id]`

8. **Scoring page** — `src/app/(dashboard)/admin/weeks/[id]/score/page.tsx`

9. **Score API route** — `POST /api/admin/weeks/[id]/score`
   - Bulk-updates `picks.is_correct`, sets week to `'scored'`

10. **Sidebar admin link** — visible only to admin users

### Key Files
```
src/lib/auth/admin.ts
src/lib/espn/client.ts
src/lib/questions/generate.ts
src/app/(dashboard)/admin/page.tsx
src/app/(dashboard)/admin/weeks/new/page.tsx
src/app/(dashboard)/admin/weeks/[id]/page.tsx
src/app/(dashboard)/admin/weeks/[id]/score/page.tsx
src/app/api/admin/weeks/route.ts
src/app/api/admin/weeks/[id]/generate/route.ts
src/app/api/admin/weeks/[id]/status/route.ts
src/app/api/admin/weeks/[id]/score/route.ts
src/app/api/admin/questions/[id]/route.ts
```

---

## Sprint 4: Leaderboard + Polish ✅ Complete

**Prerequisite:** Sprints 1–3
**Goal:** Users can see weekly and season standings. App is presentable for a real friend group.

### Tasks

1. **API routes:**
   - `GET /api/leaderboard/weekly/[weekId]` — sorted scores with Price-is-Right tiebreaker resolution; accepts `latest` as weekId
   - `GET /api/leaderboard/season` — sum of correct picks per user across all scored weeks

2. **Leaderboard page** — `src/app/(dashboard)/leaderboard/page.tsx`
   - "This Week" and "Season" tabs
   - Week selector dropdown when multiple scored weeks exist
   - 🥇🥈🥉 medals for top 3, current user's row highlighted in orange

3. **Leaderboard table component** — `src/components/leaderboard/leaderboard-table.tsx`
   - Client component; fetches from API routes on mount and on tab/week change

4. **Results view on picks page:**
   - After scoring, question cards show green checkmark / red X
   - Score summary card: "You got 7/10"

5. **Landing page** — replace placeholder with CalledIt branding

6. **Error states:**
   - No active week: "No picks open this week — check back soon"
   - Picks locked: "Picks are locked — results coming after games"
   - Not signed in: redirect to login

7. **`npm run validate-setup`** — ensure `ADMIN_USER_IDS` and `ANTHROPIC_API_KEY` are validated

### Key Files
```
src/app/api/leaderboard/weekly/[weekId]/route.ts
src/app/api/leaderboard/season/route.ts
src/app/(dashboard)/leaderboard/page.tsx
src/components/leaderboard/leaderboard-table.tsx
src/app/(marketing)/page.tsx (updated)
```

---

## Verification Checklist

Run through this manually before sharing with real users:

- [ ] Create a week as admin with title and upcoming dates
- [ ] Trigger question generation → ESPN returns game data → Claude returns 8–10 questions + tiebreaker
- [ ] Review questions in admin — edit one question's text → save
- [ ] Publish week → status = `open`
- [ ] Log in as User A → submit picks (mix of yes/no) + tiebreaker guess
- [ ] Log in as User B → submit different picks + different tiebreaker guess
- [ ] As admin: flip week to `locked` → confirm User A and User B cannot change picks
- [ ] As admin: score results → submit correct answers
- [ ] Verify User A and User B picks are marked correct/incorrect
- [ ] Weekly leaderboard shows correct scores with medal ranks
- [ ] Tie scenario: same pick score → tiebreaker resolves correctly (closest without going over)
- [ ] Season leaderboard shows running totals after two scored weeks

---

## Sprint 5: League Infrastructure (data + server logic)

**Prerequisite:** Sprints 1–4
**Goal:** The database and server layer support multiple leagues, each scoped to a women's sport. No new UI yet — demoable via Supabase dashboard and API calls.

### Supported sports
`'wnba'` · `'nwsl'` · `'pwhl'`

> Intentionally scoped to women's sports only. New leagues can be added by extending the `Sport` union type and adding an ESPN endpoint mapping.

### Tasks

1. **Migration** — `supabase/migrations/007_create_leagues_table.sql`
   - `id`, `name`, `slug` (unique), `sport` (`'wnba' | 'nwsl' | 'pwhl'`), `is_private` (bool), `invite_code` (nullable, auto-generated for private leagues), `created_by` (Clerk userId), `logo_url`, `created_at`

2. **Migration** — `supabase/migrations/008_create_league_members_table.sql`
   - `id`, `league_id` (FK → leagues), `user_id` (Clerk ID text), `role` (`'admin' | 'member'`), `joined_at`
   - Unique constraint on `(league_id, user_id)`
   - RLS: service role full access; members can read their own rows

3. **Migration** — `supabase/migrations/009_add_league_id_to_weeks.sql`
   - Add `league_id UUID REFERENCES leagues(id)` to `weeks` (nullable during migration)
   - Backfill: create a default "WNBA" league, assign all existing weeks to it

4. **Domain types** — update `src/types/calledit.ts`
   - `Sport = 'wnba' | 'nwsl' | 'pwhl'`
   - `League`, `LeagueMember` interfaces
   - Add `league_id` to `Week`

5. **Server queries** — `src/lib/leagues/server.ts`
   - `getLeaguesForUser(userId)` — leagues the user is a member of
   - `getLeague(leagueIdOrSlug)` — single league with member count
   - `createLeague(data, userId)` — inserts league + adds creator as admin member
   - `joinLeague(leagueId, userId)` — inserts into `league_members` as `'member'`
   - `getLeagueMember(leagueId, userId)` — returns membership row or null

6. **Admin API routes** — `src/app/api/admin/leagues/`
   - `POST /api/admin/leagues` — create a league (global admin only)
   - `POST /api/admin/leagues/[id]/members` — add a member by userId

### Key Files
```
supabase/migrations/007_create_leagues_table.sql
supabase/migrations/008_create_league_members_table.sql
supabase/migrations/009_add_league_id_to_weeks.sql
src/types/calledit.ts (updated)
src/lib/leagues/server.ts
src/app/api/admin/leagues/route.ts
src/app/api/admin/leagues/[id]/members/route.ts
```

### Demoable Output
Create a "NWSL" league via API → add two users as members → create a week scoped to that league → confirm existing WNBA weeks are unaffected.

---

## Sprint 6: League UX (browse, join, create, scoped picks)

**Prerequisite:** Sprint 5
**Goal:** Users can browse leagues, join via invite code, and their picks/leaderboard are scoped to the active league. The sidebar shows a league switcher.

### Tasks

1. **Leagues index page** — `src/app/(dashboard)/leagues/page.tsx`
   - Shows the user's leagues with sport badge (WNBA / NWSL / PWHL) and member count
   - "Join via invite code" text input + submit
   - "Create League" button (for users who should be able to self-serve — see deferred)

2. **League detail page** — `src/app/(dashboard)/leagues/[slug]/page.tsx`
   - League name, sport badge, member count
   - "Join" button for public leagues the user isn't in yet
   - This week's picks scoped to the league (reuses `PicksForm`)
   - Leaderboard tab scoped to the league

3. **Invite join flow** — `src/app/(dashboard)/leagues/join/[code]/page.tsx`
   - Validates invite code → shows league preview → "Join" button
   - On success, redirect to league detail page

4. **Update picks data layer** — scope picks to league membership
   - `getActiveWeek(leagueId?)` — filter by `league_id` when provided
   - Picks API: validate the week belongs to a league the submitting user is a member of

5. **Update leaderboard APIs** — add optional `?leagueId=` query param
   - Weekly: filter picks to users who are members of that league
   - Season: same scoping

6. **League switcher in sidebar**
   - Dropdown of the user's leagues
   - Selecting a league navigates to `/leagues/[slug]`
   - Defaults to the user's first/most-recently-active league

7. **API routes for league self-service:**
   - `GET /api/leagues` — user's leagues
   - `POST /api/leagues/join` — join by invite code
   - `GET /api/leagues/[slug]` — league detail + membership status

### Key Files
```
src/app/(dashboard)/leagues/page.tsx
src/app/(dashboard)/leagues/[slug]/page.tsx
src/app/(dashboard)/leagues/join/[code]/page.tsx
src/app/api/leagues/route.ts
src/app/api/leagues/join/route.ts
src/app/api/leagues/[slug]/route.ts
src/lib/picks/server.ts (getActiveWeek updated)
src/app/api/picks/route.ts (membership validation)
src/app/api/leaderboard/weekly/[weekId]/route.ts (leagueId param)
src/app/api/leaderboard/season/route.ts (leagueId param)
```

### Demoable Output
User opens app → sees their WNBA league by default → switches to NWSL league in sidebar → sees NWSL-specific picks and leaderboard → pastes an invite code → joins a friend's private league → that league appears in their switcher.

---

## Sprint 7: Multi-Sport ESPN + AI

**Prerequisite:** Sprint 5 (sport type exists on leagues)
**Goal:** The ESPN client and Claude question generator are parameterized by sport. An admin picking a sport when creating a week gets schedule data and AI questions tailored to that sport.

### Supported sports
| Sport | ESPN endpoint | Season |
|-------|--------------|--------|
| WNBA | `wnba/scoreboard` | May–Oct |
| NWSL | `soccer/usa.nwsl/scoreboard` | Mar–Nov |
| PWHL | `hockey/pwhl/scoreboard` | Jan–May |

### Tasks

1. **Update ESPN client** — `src/lib/espn/client.ts`
   - Replace `fetchWnbaSchedule()` with `fetchSchedule(sport: Sport, startDate, endDate)`
   - Map each `Sport` to its ESPN scoreboard URL
   - Return a normalized `Game[]` shape (home team, away team, tip-off/kickoff time, game ID) regardless of sport
   - Keep `fetchWnbaSchedule` as a convenience wrapper so existing admin pages don't break

2. **Update question generation** — `src/lib/questions/generate.ts`
   - `generateQuestions(weekId, startDate, endDate, sport)` — pass sport through
   - `buildClaudePrompt(games, sport)` — include sport context in the prompt so Claude generates sport-appropriate questions:
     - WNBA: assists, points, rebounds, true shooting %
     - NWSL: goals, assists, clean sheets, shots on target
     - PWHL: goals, assists, save %, power-play goals

3. **Update admin week creation** — `src/app/(dashboard)/admin/weeks/new/page.tsx`
   - Add sport selector (defaults to the league's sport when creating within a league)
   - Pass sport to `POST /api/admin/weeks`

4. **Update `POST /api/admin/weeks`** — store `sport` on the week (add column via migration if not already on `weeks`)
   - `supabase/migrations/010_add_sport_to_weeks.sql` if needed (may already come from `league_id` join)

5. **`requireLeagueAdmin(leagueId)`** — `src/lib/auth/admin.ts`
   - New helper: checks `league_members.role = 'admin'` for the current user
   - Use in `/api/admin/leagues/[id]/*` routes so league admins can manage their own leagues without being a global admin

### Key Files
```
src/lib/espn/client.ts (updated)
src/lib/questions/generate.ts (updated)
src/app/(dashboard)/admin/weeks/new/page.tsx (sport selector)
src/app/api/admin/weeks/route.ts (sport stored)
src/lib/auth/admin.ts (requireLeagueAdmin added)
supabase/migrations/010_add_sport_to_weeks.sql (if needed)
```

### Demoable Output
Admin creates a PWHL league → creates a week → clicks "Generate Questions" → ESPN fetches PWHL games → Claude returns hockey-specific questions ("Does [player] record a point tonight?", "Will [team] keep a clean sheet?") → publishes → users pick → results scored → works exactly like WNBA but for hockey.

---

## Deferred Features

| Feature | Rationale |
|---------|-----------|
| Self-serve league creation for regular users | Global admin creates leagues for now; opens up later |
| Automatic lock at tip-off (cron) | Manual admin flip is good enough for launch |
| Email notifications (week open, results ready) | Add after core loop is proven |
| Social features (comments, reactions) | Not core to the game mechanic |
| Mobile-optimized picks UI | Web works fine for v1 |
| Public leaderboard (unauthenticated) | Auth required for v1 |
| Historical week browsing | Nice to have; add after leaderboard is built |
| Men's sports leagues | Intentionally out of scope — women's sports only |
