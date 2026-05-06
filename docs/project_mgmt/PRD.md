# CalledIt — Product Requirements Document

**Product:** CalledIt
**Date:** May 2026
**Version:** 1.0 — MVP

---

## 1. Problem Statement

WNBA fans have no good free, low-stakes weekly way to engage with the season alongside friends. The options today are:

- **DFS (DraftKings, FanDuel):** Complex, pay-to-win, skill gap discourages casual fans
- **Sports betting:** Real money, high stakes, not social
- **Just watching:** No game layer, no way to compete with friends

No WNBA-specific pick'em product exists that's free, casual, and designed to drop in and out of mid-season.

---

## 2. Product Vision

A free weekly WNBA pick'em app where anyone can join at any point in the season, no penalty for missing previous weeks. Make picks on player and game questions each week, see how you did, compare with your group.

The experience is:
1. Questions generated from the real schedule — grounded in actual upcoming games
2. Spicy AI-written flavor text that makes each question feel like sports commentary
3. Picks lock at tip-off — no changing your mind once the game starts
4. Results posted by the admin after games complete
5. See who called it right each week and who's winning the season

---

## 3. Target Users

**Primary:** WNBA fans — casual to die-hard — who want to make watching games more fun with a low-stakes competition.

**Secondary:** Friend groups and coworkers who want a shared activity around the WNBA season.

**Who this is NOT for:** Professional bettors, DFS players looking for edge.

---

## 4. Core Mechanic

### Weekly Pick'em

Each week has:
- **8–12 pick questions** — binary yes/no player/game questions (e.g. "Will A'ja Wilson score 25+ points tonight?")
- **1 tiebreaker question** — numeric guess (e.g. "Total combined points in the highest-scoring game tonight")

**Lifecycle of a week:**

```
upcoming → open → locked → scored
```

- `upcoming`: Week exists but picks aren't open yet
- `open`: Users can submit and change picks
- `locked`: Tip-off of the first game has passed; picks are frozen
- `scored`: Admin has entered correct answers; results are visible

**Scoring:**
- 1 point per correct pick question
- Tiebreaker used only to break ties within the weekly leaderboard (closest without going over wins)

**Season leaderboard:** Running sum of weekly pick scores across all scored weeks. No survivor mechanics, no penalty for skipping a week.

---

## 5. Question Generation

Questions are AI-generated using the Anthropic API, seeded by the WNBA schedule from the ESPN unofficial API.

**Flow:**
1. Admin triggers question generation for a week (specifying date range)
2. App fetches upcoming WNBA games from ESPN (teams, key players, tip-off times)
3. Claude receives the schedule and returns:
   - 8–10 pick questions with flavor text blurbs per question
   - 1 tiebreaker question with flavor text
4. Questions are saved as drafts — admin can review and edit before publishing

**Question quality criteria:**
- Grounded in real players and real games that week
- Answerable yes/no (no "maybe" — needs a definitive outcome)
- Range of difficulty — not all obvious, not all coin flips
- Flavor text should be fun and opinionated, like sports talk radio

---

## 6. User Flows

### Flow 1: New user
```
Landing page → Sign up → This Week page → see open questions and flavor text
→ Toggle yes/no on each question → Enter tiebreaker guess → Submit picks
→ See confirmation: "Your picks are locked in"
```

### Flow 2: Returning user (week open)
```
Log in → This Week page → see previously submitted picks
→ Change any picks → Re-submit
```

### Flow 3: Week locked (post tip-off, pre-scoring)
```
Log in → This Week page → see picks read-only → "Results pending" state
```

### Flow 4: Week scored
```
Log in → This Week page → see correct/incorrect on each pick
→ Score summary: "You got 7/10 — #3 this week"
→ Leaderboard → weekly tab shows full ranking → season tab shows running totals
```

### Flow 5: Admin — generate and publish a week
```
Admin → /admin → "New Week" → enter title + dates
→ "Generate Questions" → review AI-generated questions and flavor text
→ Edit any questions → "Publish" → week status = open
```

### Flow 6: Admin — score a week
```
Admin → /admin → select scored week → Score Results
→ For each pick question: select Yes/No correct answer
→ For tiebreaker: enter the actual number
→ "Submit Scores" → picks marked correct/incorrect, week status = scored
```

---

## 7. Feature Scope

### In scope for v1

| Feature | Notes |
|---------|-------|
| Weekly pick questions (yes/no) | 8–12 per week |
| Tiebreaker question (numeric) | 1 per week |
| Pick submission and editing (while open) | Upsert on re-submit |
| Pick lock at tip-off | Manual status flip by admin |
| Results view per question | After scoring |
| Weekly leaderboard | Per-week ranking |
| Season leaderboard | Running sum of weekly scores |
| AI question generation | ESPN schedule → Claude → draft questions |
| Admin review/edit before publish | Basic edit UI |
| Admin scoring UI | Input correct answers per question |
| Clerk auth (email + Google) | Existing LaunchKit setup |

### Out of scope for v1

| Feature | Rationale |
|---------|-----------|
| Cron-based automation | Manual admin control is sufficient for launch |
| Survivor / elimination mode | Adds complexity, no demand signal yet |
| Social features (comments, reactions) | Nice to have, not core |
| Notifications (email, push) | Add after core loop is proven |
| Paid tiers / monetization | Get the game right first |
| Public (unauthenticated) picks preview | Auth required for v1 |
| Mobile app | Web-first |

---

## 8. Success Metrics

| Metric | Target | How Measured |
|--------|--------|--------------|
| Weekly pick submission rate | > 70% of registered users submit picks for an open week | DB query |
| Week-over-week return rate | > 60% return the following week | Cohort analysis |
| Question generation time | < 5 minutes from admin trigger to published | Timing in admin UI |
| Admin scoring time | < 10 minutes to score a full week | Timing in admin UI |

---

## 9. Risks

| Risk | Mitigation |
|------|-----------|
| ESPN unofficial API changes / goes down | Add error handling; fallback to manual question entry |
| Claude generates low-quality questions | Admin review step before publish; easy edit UI |
| Low user engagement after launch | Start with a known friend group; iterate on question quality |
| Week status not updated in time | Simple admin UI makes status transitions fast |

---

## 10. Open Questions (v1)

1. **Who can be admin?** → `ADMIN_USER_IDS` env var (comma-separated Clerk user IDs). No UI for managing admins in v1.
2. **When do picks lock?** → Admin manually flips status to `locked`. No automatic enforcement in v1.
3. **What if no games that week?** → Admin skips that week. No concept of a "bye week" in the system yet.
