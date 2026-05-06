# CalledIt — Technical Specification

**Product:** CalledIt
**Date:** May 2026
**Version:** 1.0 — MVP

---

## 1. System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    CLIENT (Next.js)                       │
│  Landing → Auth → This Week (picks) → Leaderboard        │
│  Admin: week management, question generation, scoring     │
└──────────────────┬───────────────────────────────────────┘
                   │ Next.js API routes + Server Actions
                   ▼
┌──────────────────────────────────────────────────────────┐
│                 API LAYER (Next.js)                       │
│  /api/weeks  /api/picks  /api/leaderboard  /api/admin    │
└────┬─────────────────┬────────────────────┬──────────────┘
     │                 │                    │
     ▼                 ▼                    ▼
┌─────────┐   ┌──────────────┐   ┌──────────────────────┐
│ Supabase│   │ ESPN API     │   │ Anthropic API        │
│  DB     │   │ (unofficial) │   │ (claude-sonnet-4-6)  │
│  Auth   │   │ WNBA sched.  │   │ Question generation  │
└─────────┘   └──────────────┘   └──────────────────────┘
```

**No separate backend service.** Everything runs as Next.js API routes. The ESPN and Anthropic calls happen server-side only, triggered by admin actions.

---

## 2. Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 16 (App Router) | Existing LaunchKit setup |
| Auth | Clerk | Existing — email + Google OAuth |
| Database | Supabase PostgreSQL | 3 new tables added to existing project |
| Styling | Tailwind CSS 4 + Radix UI | Existing component library |
| AI | Anthropic API (`claude-sonnet-4-6`) | Question + flavor text generation |
| Schedule data | ESPN unofficial API | WNBA scoreboard endpoint |
| Deployment | Netlify | Existing config |

---

## 3. Database Schema

New tables added starting at migration `004`. Users are already handled by Clerk + the existing `profiles` table.

### `weeks`

```sql
CREATE TABLE weeks (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    week_number  INTEGER NOT NULL,
    title        TEXT NOT NULL,
    starts_at    TIMESTAMPTZ NOT NULL,
    locks_at     TIMESTAMPTZ NOT NULL,
    scored_at    TIMESTAMPTZ,
    status       TEXT NOT NULL DEFAULT 'upcoming',
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    updated_at   TIMESTAMPTZ DEFAULT NOW()
);
-- status values: 'upcoming' | 'open' | 'locked' | 'scored'
```

### `questions`

```sql
CREATE TABLE questions (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    week_id            UUID NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
    question_text      TEXT NOT NULL,
    flavor_text        TEXT,
    question_type      TEXT NOT NULL DEFAULT 'pick',
    correct_answer     BOOLEAN,
    tiebreaker_answer  NUMERIC,
    display_order      INTEGER NOT NULL DEFAULT 0,
    player_name        TEXT,
    game_id            TEXT,
    created_at         TIMESTAMPTZ DEFAULT NOW()
);
-- question_type values: 'pick' | 'tiebreaker'
-- correct_answer: null until scored; only for 'pick' type
-- tiebreaker_answer: null until scored; only for 'tiebreaker' type
```

### `picks`

```sql
CREATE TABLE picks (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           TEXT NOT NULL,
    question_id       UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    week_id           UUID NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
    answer            BOOLEAN,
    tiebreaker_guess  NUMERIC,
    is_correct        BOOLEAN,
    created_at        TIMESTAMPTZ DEFAULT NOW(),
    updated_at        TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, question_id)
);
-- user_id: Clerk user ID (e.g. "user_2abc...")
-- answer: true=yes, false=no; for 'pick' questions
-- tiebreaker_guess: numeric guess; for 'tiebreaker' questions
-- is_correct: null until week is scored
-- week_id is denormalized from question for leaderboard query efficiency
```

### RLS Policies

```sql
-- weeks: public read, service role write
ALTER TABLE weeks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "weeks_select" ON weeks FOR SELECT USING (true);
CREATE POLICY "weeks_service_role" ON weeks USING (auth.role() = 'service_role');

-- questions: public read, service role write
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "questions_select" ON questions FOR SELECT USING (true);
CREATE POLICY "questions_service_role" ON questions USING (auth.role() = 'service_role');

-- picks: users read/write own rows, service role full access
ALTER TABLE picks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "picks_select_own" ON picks FOR SELECT
    USING (user_id = auth.jwt()->>'sub');
CREATE POLICY "picks_insert_own" ON picks FOR INSERT
    WITH CHECK (user_id = auth.jwt()->>'sub');
CREATE POLICY "picks_update_own" ON picks FOR UPDATE
    USING (user_id = auth.jwt()->>'sub');
CREATE POLICY "picks_service_role" ON picks USING (auth.role() = 'service_role');
```

---

## 4. API Routes

All routes use Next.js API route handlers. Admin routes validate the Clerk userId against `ADMIN_USER_IDS` env var.

### Public (authenticated users)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/weeks/current` | Active week + its questions. Returns `null` if no open/upcoming week. |
| POST | `/api/picks` | Submit or update a pick. Validates `week.status = 'open'`. Upserts on `(user_id, question_id)`. |
| GET | `/api/leaderboard/weekly/[weekId]` | Sorted pick scores for a week. Includes tiebreaker guess for tie resolution. |
| GET | `/api/leaderboard/season` | Sum of pick scores per user across all scored weeks. |

### Admin only

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/admin/weeks` | Create a new week record (title, week_number, starts_at, locks_at). |
| POST | `/api/admin/weeks/[id]/generate` | Fetch ESPN schedule → Claude → insert draft questions. |
| PATCH | `/api/admin/weeks/[id]/status` | Transition week status (upcoming→open→locked→scored). |
| PUT | `/api/admin/questions/[id]` | Update a question's text or flavor text (pre-publish editing). |
| POST | `/api/admin/weeks/[id]/score` | Submit correct answers, bulk-update `picks.is_correct`. |

---

## 5. ESPN → Claude Question Generation Flow

### Step 1: Fetch WNBA schedule

```
GET https://site.api.espn.com/apis/site/v2/sports/basketball/wnba/scoreboard
    ?dates={YYYYMMDD}-{YYYYMMDD}
```

Extract from response:
- Game date and tip-off time
- Home and away team names
- `event.id` (ESPN game ID)
- Key players from each team (from roster data or recent stats)

### Step 2: Build Claude prompt

Send schedule data to `claude-sonnet-4-6` with a structured prompt requesting:

```
Given these upcoming WNBA games:
[game data]

Generate:
1. 8-10 pick questions as yes/no questions about player performance or game outcomes
2. 1 tiebreaker question asking for a specific numeric total
3. A short spicy flavor text blurb for each question (1-2 sentences, sports-talk energy)

Rules for pick questions:
- Must have a definitive yes/no answer after the game
- Mix of player props and game outcomes
- Include specific stat thresholds (e.g. "25+ points", "10+ assists")
- Vary difficulty

Rules for the tiebreaker:
- Ask for a total that will be a real number (combined points, total rebounds, etc.)
- Closest without going over wins

Return valid JSON in this format:
{
  "questions": [
    {
      "question_text": "Will A'ja Wilson score 25+ points tonight?",
      "flavor_text": "She's been on a tear — but the defense showing up lately might finally slow her down.",
      "question_type": "pick",
      "player_name": "A'ja Wilson",
      "game_id": "401652345"
    }
  ],
  "tiebreaker": {
    "question_text": "Total combined points in the Las Vegas Aces vs New York Liberty game",
    "flavor_text": "High-scoring rivalry — pick your number.",
    "question_type": "tiebreaker",
    "game_id": "401652345"
  }
}
```

### Step 3: Parse and insert

- Validate JSON response structure
- Insert into `questions` table with `week_id` and `display_order`
- Status remains draft (week stays `upcoming`) until admin publishes

---

## 6. Scoring Logic

When admin submits scores for a week:

### Pick questions
```sql
UPDATE picks
SET is_correct = (answer = $correct_answer),
    updated_at = NOW()
WHERE question_id = $question_id;
```

### Tiebreaker
The tiebreaker is stored in `questions.tiebreaker_answer`. Tiebreaker winner computation happens at query time in the leaderboard:

```sql
-- Users with the same pick score, ordered by tiebreaker:
-- Closest without going over = MAX(tiebreaker_guess) WHERE tiebreaker_guess <= tiebreaker_answer
SELECT p.user_id, p.tiebreaker_guess
FROM picks p
JOIN questions q ON p.question_id = q.id
WHERE q.week_id = $week_id
  AND q.question_type = 'tiebreaker'
  AND p.tiebreaker_guess <= q.tiebreaker_answer
ORDER BY p.tiebreaker_guess DESC;
```

### After scoring
```sql
UPDATE weeks
SET status = 'scored', scored_at = NOW()
WHERE id = $week_id;
```

---

## 7. Weekly Leaderboard Query

```sql
SELECT
    p.user_id,
    COUNT(*) FILTER (WHERE p.is_correct = true) AS score,
    tb.tiebreaker_guess
FROM picks p
JOIN questions q ON p.question_id = q.id
LEFT JOIN picks tb ON tb.user_id = p.user_id
    AND tb.question_id = (
        SELECT id FROM questions
        WHERE week_id = $week_id AND question_type = 'tiebreaker'
        LIMIT 1
    )
WHERE q.week_id = $week_id
  AND q.question_type = 'pick'
GROUP BY p.user_id, tb.tiebreaker_guess
ORDER BY score DESC, tb.tiebreaker_guess DESC;
```

Tie-breaking: higher `tiebreaker_guess` (that doesn't exceed `tiebreaker_answer`) wins. Guesses over the answer are excluded from tie resolution.

---

## 8. Admin Auth Pattern

No admin dashboard auth UI needed. Guard using env var:

```typescript
// src/lib/auth/admin.ts
import { auth } from '@clerk/nextjs/server'

export async function requireAdmin() {
  const { userId } = await auth()
  const adminIds = (process.env.ADMIN_USER_IDS || '').split(',').map(s => s.trim())
  if (!userId || !adminIds.includes(userId)) {
    throw new Error('Unauthorized')
  }
  return userId
}
```

Used in every admin API route:

```typescript
import { requireAdmin } from '@/lib/auth/admin'

export async function POST(req: NextRequest) {
  await requireAdmin() // throws 401 if not admin
  // ...
}
```

---

## 9. Environment Variables (additions to .env.example)

```bash
# Admin access (comma-separated Clerk user IDs)
ADMIN_USER_IDS=user_2abc123,user_2xyz456

# Anthropic API (already in .env.example as ANTHROPIC_API_KEY)
ANTHROPIC_API_KEY=sk-ant-...
```

No new env vars needed for the ESPN API (it's a public unofficial endpoint, no auth required).

---

## 10. File Structure (new files only)

```
supabase/migrations/
├── 004_create_weeks_table.sql
├── 005_create_questions_table.sql
└── 006_create_picks_table.sql

src/
├── types/
│   └── calledit.ts                     # domain types: Week, Question, Pick, etc.
├── lib/
│   ├── auth/
│   │   └── admin.ts                    # requireAdmin() helper
│   ├── picks/
│   │   ├── server.ts                   # getActiveWeek, getQuestionsForWeek, getPicksForUser
│   │   └── actions.ts                  # submitPick server action
│   ├── espn/
│   │   └── client.ts                   # fetchWnbaSchedule(startDate, endDate)
│   └── questions/
│       └── generate.ts                 # buildClaudePrompt, parseQuestionsResponse
├── app/
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx          # This Week page (picks UI)
│   │   ├── leaderboard/page.tsx        # Weekly + season leaderboard
│   │   └── admin/
│   │       ├── page.tsx                # Week list + status
│   │       └── weeks/
│   │           ├── new/page.tsx        # Create week form
│   │           └── [id]/
│   │               ├── page.tsx        # Week detail + question preview
│   │               └── score/page.tsx  # Scoring form
│   └── api/
│       ├── weeks/
│       │   └── current/route.ts
│       ├── picks/
│       │   └── route.ts
│       ├── leaderboard/
│       │   ├── weekly/[weekId]/route.ts
│       │   └── season/route.ts
│       └── admin/
│           ├── weeks/
│           │   ├── route.ts
│           │   └── [id]/
│           │       ├── generate/route.ts
│           │       ├── score/route.ts
│           │       └── status/route.ts
│           └── questions/
│               └── [id]/route.ts
└── components/
    ├── picks/
    │   ├── question-card.tsx            # Pick question with yes/no toggle
    │   ├── tiebreaker-input.tsx         # Numeric input for tiebreaker
    │   └── picks-form.tsx              # Full picks submission form
    └── leaderboard/
        └── leaderboard-table.tsx       # Rank table with current user highlight
```

---

## 11. Performance Notes

- Leaderboard query runs on a small dataset (one week's picks) — no caching needed for v1
- ESPN API call only happens on admin trigger — no performance concern
- Claude API call averages ~5–10s for question generation — show loading state in admin UI
- All picks operations use the Supabase admin client (service role) via server actions — bypasses RLS complexity with Clerk JWT

---

## 12. Security Checklist

- [ ] Admin routes call `requireAdmin()` before any DB operation
- [ ] Picks route validates `week.status = 'open'` before accepting submission
- [ ] User ID always from Clerk `auth()` server-side — never from request body
- [ ] Anthropic API key server-side only (`ANTHROPIC_API_KEY` not prefixed with `NEXT_PUBLIC_`)
- [ ] ESPN fetch happens server-side only (no CORS issues, no key needed)
- [ ] Tiebreaker answer stored on `questions` table — never sent to client until week is scored
