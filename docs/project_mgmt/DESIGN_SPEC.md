# CalledIt — Design Specification
### WNBA Pick'em · Fan-First · Bold & Community-Driven

---

## Concept

**"Fan-made zine meets sports broadcast."**

CalledIt is built for WNBA superfans — people who actually watch the games, know the players, follow the drama. The design rejects the clinical ESPN aesthetic in favor of something that feels like it was made *by* a fan, *for* fans. Bold, loud, personal. Players are stars, not data rows.

---

## Color System

| Token | Value | Usage |
|---|---|---|
| `--black` | `#0a0a0b` | App background |
| `--surface` | `#111114` | Nav bar, status bar |
| `--surface2` | `#1a1a1f` | Cards, panels |
| `--surface3` | `#222228` | Progress tracks, inactive tabs |
| `--border` | `rgba(255,255,255,0.08)` | All borders and dividers |
| `--orange` | `#FF5F1F` | Primary accent — CTAs, brand, active states |
| `--coral` | `#FF3B6E` | Secondary accent — UNDER/NO picks, negative trend |
| `--lime` | `#B8FF3A` | Success / correct pick / streak |
| `--violet` | `#8B5CF6` | AI/community flavor, Leaderboard accent |
| `--gold` | `#FFD166` | #1 rank, streak highlights |
| `--text` | `#F5F5F0` | Primary text |
| `--muted` | `rgba(245,245,240,0.45)` | Secondary text, labels, placeholders |

### Player Gradients
Each player has a signature gradient used on their avatar, card accent stripe, and hero background tint:

| Player | Gradient |
|---|---|
| A'ja Wilson | `#FF5F1F → #FF3B6E` |
| Caitlin Clark | `#FFD166 → #FF8C42` |
| Breanna Stewart | `#8B5CF6 → #3B82F6` |
| Sabrina Ionescu | `#B8FF3A → #00C9A7` |
| Napheesa Collier | `#FF3B6E → #8B5CF6` |

---

## Typography

| Role | Font | Weight | Size (base) |
|---|---|---|---|
| Display / Headlines | Bebas Neue | 400 | 38px (screen titles) |
| Body | DM Sans | 300–700 | 13–17px |
| Mono / Labels | DM Mono | 400–500 | 9–12px |

**Rules:**
- Screen titles: Bebas Neue, ~38px, 0.95 line-height, tight letter-spacing
- Pick buttons: Bebas Neue, 26px
- Community labels / timestamps: DM Mono, 9–11px, uppercase, wide letter-spacing
- Body copy (questions, flavor text): DM Sans, 14–17px, 1.4–1.55 line-height
- Never use font sizes below 9px

---

## Layout & Spacing

- **Max width:** 430px (mobile-first, centered on desktop with border gutters)
- **Horizontal padding:** 20px on all screens
- **Card border-radius:** 12–14px
- **Gap between cards:** 10–12px
- **Button border-radius:** 14px

### Grid principles
- Use `flex` with `gap` for all sibling UI elements — never bare inline flow
- Cards always use explicit pixel sizes, never `height: 100%` + scroll
- Player hero sections use a layered composition: gradient bg → geometric accent → avatar → text overlay

---

## Motion & Animation

| Animation | Duration | Easing | Trigger |
|---|---|---|---|
| `fadeUp` | 400ms | `ease` | Screen mount; staggered per card (60ms increments) |
| `countdown-pop` | 200ms | `ease` | Every second tick |
| `pulse-ring` | 2s | `ease` | Pick card hero avatar (looping) |
| `ticker` | 28s | `linear` | News ticker (looping) |
| `confetti-fall` | 600–1200ms | `ease` | On pick selection |
| `bounceIn` | — | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Pick button selection, progress bar |

**Principles:**
- Stagger card reveals on screen load (60ms per card)
- Pick buttons use a spring-like cubic-bezier for selection bounce
- Confetti burst (18 random particles) fires on every pick — feels rewarding
- Flavor text panel fades in with a 600ms delay after screen load

---

## Component Inventory

### App Shell
- **Status bar** — logo + week badge + user avatar
- **Ticker** — scrolling news strip in orange, DM Mono
- **Bottom nav** — 3 tabs: Picks / Board / Me; active state in `--orange`

### Home Screen
- **Week header** — display title + countdown timer (H:M:S, live)
- **Game matchup strip** — team names, tipoff time, "Live picks" badge
- **Progress bar** — picks locked in / total, animated fill
- **Mini pick cards** (list) — player color stripe + avatar + name/stat + community bar + pick badge + chevron

### Pick Card Screen
- **Back button** — ghost icon button
- **Player hero** — gradient bg tint + geometric radial accent + pulsing avatar ring + name + stat pill
- **Question** — DM Sans 17px bold
- **Pick buttons** — OVER/UNDER or YES/NO; selected state: solid fill + drop shadow + scale(1.03)
- **Community bar** — OVER % vs UNDER %, pill counts
- **AI Hot Take** — violet-tinted card, ✦ icon, italic flavor text

### Leaderboard Screen
- **Podium** — top 3 in gold/silver/bronze, asymmetric heights (120/96/80px)
- **Tab switcher** — Global / Friends / Weekly
- **Rank rows** — medal emoji for top 3, avatar, username, accuracy, streak badge, points, trend

### Profile Screen
- **Stat grid** — 2×2: Points / Accuracy / Correct / Streak
- **Recent picks** — result icon + question + pick + points earned

### Player Avatar
- Circular, gradient background matching player signature
- Custom SVG silhouette per position (post/guard/forward shooting/dribble/rebound)
- Jersey number badge (bottom-right, glass effect)

---

## Interaction States

| Element | Default | Hover | Selected/Active |
|---|---|---|---|
| Mini pick card | `surface2` bg, dashed "Pick" badge | `translateY(-1px)` | Orange border, filled pick badge |
| Pick button (OVER/YES) | `surface2`, muted text | — | `--orange` bg, black text, glow shadow |
| Pick button (UNDER/NO) | `surface2`, muted text | — | `--coral` bg, black text, glow shadow |
| Nav tab | Muted | — | `--orange` icon + label |
| Leaderboard row (me) | `surface2` | — | Orange-tinted bg + border, orange username |

---

## Screens

### 1. Home / Active Week
Shows the current week's pick cards in a scrollable list. The countdown timer drives urgency. Progress bar motivates completion. Matchup context grounds the picks.

### 2. Pick Card
Full-screen immersive view for a single player pick. The player avatar + gradient hero makes them feel like a star. The question is the hero UI element. Community % gives social context without dictating the pick. AI flavor text adds personality and a reason to keep reading.

### 3. Leaderboard
Competitive but community-first. The podium visualization creates drama for the top 3. The tab system lets users filter to friends or weekly context. Your own row is always highlighted in orange so you can find yourself instantly.

---

## Voice & Copy Principles

- **Flavor text (AI Hot Take):** Written like a passionate fan, not an analyst. Casual, specific, slightly chaotic. Uses phrases like "She's cooking," "absolutely cursed for defenses," "genuinely unhinged."
- **Labels:** Short, uppercase, monospaced — feels like a scoreboard
- **Questions:** Direct, conversational — "Does Caitlin drop 8+ dimes?" not "Will Clark achieve ≥8 assists?"
- **Picks:** Big, confident — OVER / UNDER / YES / NO in display font
- **Status:** "Week 8 Open," "All set!" "WEEK 8 · MAY 5–11" — date-grounded, timely

---

## Texture & Atmosphere

- **Noise overlay:** 2.5% opacity `feTurbulence` SVG filter across the entire app — subtle grain that makes the dark bg feel rich, not flat
- **Gradient mesh:** Player hero backgrounds use a radial gradient tint blending from player color to `--black` — atmospheric, not garish
- **Border system:** All cards use `1px solid rgba(255,255,255,0.08)` — barely-there, keeps depth without clutter
- **Glass effects:** Jersey badge + status elements use `backdropFilter: blur(4px)` with semi-transparent bg

---

## Tweakable Parameters

| Key | Type | Default | Effect |
|---|---|---|---|
| `accentColor` | color | `#FF5F1F` | Primary orange — CTAs, active states, brand |
| `showCommunity` | boolean | `true` | Show/hide community % bars on pick cards |
| `showFlavorText` | boolean | `true` | Show/hide AI hot take panel |
| `fontScale` | number (0.8–1.3) | `1` | Global font size multiplier |

---

## Future Screens (not yet designed)

- **Results Reveal** — post-tipoff screen showing correct/incorrect picks with animated reveal per card
- **Friend Invite** — share your picks / challenge a friend
- **Player Profile** — deep dive on a player's pick history and community accuracy
- **Notifications** — tip-off reminders, result alerts
- **Season Leaderboard** — all-time standings, badges, achievements
