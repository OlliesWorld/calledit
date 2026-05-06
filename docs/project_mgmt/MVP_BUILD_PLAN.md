# CalledIt — MVP Build Plan

**Date:** May 2026
**Version:** 1.0

---

## Overview

Build CalledIt on top of the LaunchKit foundation (Clerk auth, Supabase DB, Stripe plumbing, Next.js 16 shell). The app is a weekly WNBA pick'em: users make yes/no picks on player/game questions, admin scores results, leaderboard tracks weekly and season standings.

**Existing foundation:**
- Clerk auth (login, signup, Google OAuth)
- Supabase with profiles and preferences tables
- Next.js 16 App Router with dashboard layout
- UI component library (Button, Card, Input, etc.)
- Feature flags, route constants, validation schemas

---

## Sprint 0: Design (external)

**Owner:** External (Claude design pass)
**Deliverable:** `docs/project_mgmt/DESIGN_SPEC.md`

Produce the visual design for CalledIt before building user-facing screens.

- Color palette, typography, component specs
- Key screen mockups: landing, picks (open/locked/scored states), leaderboard, admin
- Design gates Sprint 2 (picks UI)
- Admin UI (Sprint 3) can proceed without design approval — plain functional layout is fine

---

## Sprint 1: Data Layer

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

### Demoable Output
Insert a week + questions via Supabase dashboard → read them back from `getActiveWeek()` in a test page or via logs.

---

## Sprint 2: Picks UI

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

### Demoable Output
Authenticated user lands on dashboard → sees questions with flavor text → submits yes/no picks + tiebreaker → sees confirmation → after status is manually flipped to `locked`, picks are read-only.

---

## Sprint 3: Admin Tools + AI Question Generation

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
   - List of all weeks with status pills
   - Links to week detail and scoring pages
   - "New Week" button

5. **Create week form** — `src/app/(dashboard)/admin/weeks/new/page.tsx`
   - Title, week number, starts_at, locks_at inputs
   - Submits to `POST /api/admin/weeks`

6. **Week detail page** — `src/app/(dashboard)/admin/weeks/[id]/page.tsx`
   - Shows draft questions (editable text)
   - "Generate Questions" button → calls `POST /api/admin/weeks/[id]/generate`
   - Loading state during generation (5–10s)
   - "Publish" button → calls `PATCH /api/admin/weeks/[id]/status` with `{ status: 'open' }`

7. **Admin API routes:**
   - `POST /api/admin/weeks` — create week
   - `POST /api/admin/weeks/[id]/generate` — ESPN + Claude → insert questions
   - `PATCH /api/admin/weeks/[id]/status` — status transitions
   - `PUT /api/admin/questions/[id]` — edit question text or flavor text

8. **Scoring page** — `src/app/(dashboard)/admin/weeks/[id]/score/page.tsx`
   - One yes/no toggle per pick question
   - Numeric input for tiebreaker answer
   - "Submit Scores" → calls `POST /api/admin/weeks/[id]/score`

9. **Score API route** — `POST /api/admin/weeks/[id]/score`
   - Accepts `{ answers: { [questionId]: boolean }, tiebreakerAnswer: number }`
   - Updates `questions.correct_answer` / `questions.tiebreaker_answer`
   - Bulk-updates `picks.is_correct`
   - Sets `weeks.status = 'scored'` and `weeks.scored_at = NOW()`

10. **Sidebar admin link** — visible only to admin users (check against `ADMIN_USER_IDS`)

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

### Demoable Output
Admin logs in → creates a week → triggers question generation → sees 8–10 AI-generated questions with flavor text → edits any → publishes → later enters correct answers → scores week → picks are marked correct/incorrect.

---

## Sprint 4: Leaderboard + Polish

**Prerequisite:** Sprints 1–3
**Goal:** Users can see weekly and season standings. App is presentable for a real friend group.

### Tasks

1. **API routes:**
   - `GET /api/leaderboard/weekly/[weekId]` — sorted scores for a week, includes tiebreaker for tie resolution
   - `GET /api/leaderboard/season` — sum of pick scores per user across all scored weeks

2. **Leaderboard page** — `src/app/(dashboard)/leaderboard/page.tsx`
   - Weekly tab (defaults to most recent scored week) and Season tab
   - Rank table: position, display name, score, tiebreaker guess (weekly only)
   - Current user's row highlighted

3. **Leaderboard table component** — `src/components/leaderboard/leaderboard-table.tsx`

4. **Results view on picks page:**
   - After scoring, question cards show green checkmark / red X
   - Score summary card: "You got 7/10 — #3 this week"

5. **Landing page** — replace the current placeholder with CalledIt branding (using design spec)

6. **Error states:**
   - No active week: "No picks open this week — check back soon"
   - Picks locked: "Picks are locked — results coming after games"
   - Not signed in: redirect to login

7. **`npm run validate-setup`** — ensure new env vars (`ADMIN_USER_IDS`, `ANTHROPIC_API_KEY`) are included in validation

### Key Files
```
src/app/api/leaderboard/weekly/[weekId]/route.ts
src/app/api/leaderboard/season/route.ts
src/app/(dashboard)/leaderboard/page.tsx
src/components/leaderboard/leaderboard-table.tsx
src/app/(marketing)/page.tsx (updated)
```

### Demoable Output
Full end-to-end: admin creates week → generates questions → publishes → users submit picks → admin scores → leaderboard shows rankings → season tab accumulates scores across weeks.

---

## Verification Checklist

Run through this manually after Sprint 4 before sharing with real users:

- [ ] Create a week as admin with title and upcoming dates
- [ ] Trigger question generation → ESPN returns game data → Claude returns 8–10 questions + tiebreaker
- [ ] Review questions in admin — edit one question's text → save
- [ ] Publish week → status = `open`
- [ ] Log in as User A → submit picks (mix of yes/no) + tiebreaker guess
- [ ] Log in as User B → submit different picks + different tiebreaker guess
- [ ] As admin: flip week to `locked` → confirm User A and User B cannot change picks
- [ ] As admin: score results → submit correct answers
- [ ] Verify User A and User B picks are marked correct/incorrect
- [ ] Weekly leaderboard shows correct scores
- [ ] Tie scenario: set User A and User B to same pick score → confirm tiebreaker resolves correctly (closest without going over)
- [ ] Season leaderboard shows running totals after two scored weeks

---

## Deferred Features

| Feature | Rationale |
|---------|-----------|
| Automatic lock at tip-off (cron) | Manual admin flip is good enough for launch |
| Email notifications (week open, results ready) | Add after core loop is proven |
| Social features (comments, reactions) | Not core to the game mechanic |
| Mobile-optimized picks UI | Web works fine for v1 |
| Public leaderboard (unauthenticated) | Auth required for v1 |
| Bulk question editing | One-by-one is fine at 8–12 questions |
| Historical week browsing | Nice to have; add after leaderboard is built |
