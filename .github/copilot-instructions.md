# LaunchKit - Copilot Instructions

## Project Overview
LaunchKit is a Next.js 16 SaaS starter (App Router) with Clerk authentication, Supabase database, Stripe payments, and multi-provider AI chat. Uses React 19, Tailwind CSS 4, and TypeScript.

## Architecture: Clerk Auth + Supabase Database

**Critical**: Clerk handles authentication, Supabase is database-only. User IDs are Clerk strings (e.g., `user_2abc...`), not UUIDs.

### Data Flow Pattern
```
Clerk (auth) → firstName, lastName, email, imageUrl
Supabase (database) → profiles (extended data), user_preferences, user_subscriptions
```

### ExtendedUser Type (`src/types/user.ts`)
Combines Clerk user data with Supabase profile/preferences:
```ts
interface ExtendedUser {
  id: string              // Clerk user ID
  email: string           // From Clerk
  firstName: string | null // From Clerk
  lastName: string | null  // From Clerk
  imageUrl: string | null  // From Clerk
  created_at: string
  profile?: Profile       // From Supabase (optional)
  preferences?: UserPreferences // From Supabase (optional)
}
```

## Auth Patterns

### Server Components
```ts
import { getExtendedUser } from '@/lib/auth/server'
const user = await getExtendedUser()
if (!user) redirect('/login')
// Access: user.firstName, user.email, user.profile?.bio
```

### Client Components
```ts
import { useUser } from '@/hooks/use-user'
const { user, profile, preferences, updateProfile, updatePreferences } = useUser()
// Provides Clerk data + Supabase profile/preferences with update functions
```

### API Routes
```ts
import { auth } from '@clerk/nextjs/server'
const { userId } = await auth()
if (!userId) return new Response('Unauthorized', { status: 401 })
```

## Database Patterns

### Supabase Tables (use `user_id TEXT`, not UUID)
All tables query by `user_id` (Clerk ID):
```ts
.from('profiles').select('*').eq('user_id', userId)
```

### Upsert Pattern (create or update)
Profile/preferences functions use upsert for new users:
```ts
.upsert({ user_id: userId, ...updates }, { onConflict: 'user_id' })
```

### Service Role for Webhooks
Webhooks bypass RLS with admin client:
```ts
import { createAdminClient } from '@/lib/supabase/admin'
const supabaseAdmin = createAdminClient()
```

## Route Groups & Layouts
- `(marketing)` - Public pages with Navbar + Footer
- `(auth)` - Login/signup with centered branding  
- `(dashboard)` - Protected pages with Navbar only

## Key Files

| Pattern | Location |
|---------|----------|
| Auth server functions | `src/lib/auth/server.ts` |
| Profile CRUD | `src/lib/profile/client.ts`, `src/lib/profile/server.ts` |
| User hook (client) | `src/hooks/use-user.ts` |
| Database types | `src/types/database.ts`, `src/types/user.ts` |
| Migrations | `supabase/migrations/` |
| Route constants | `src/constants/routes.ts` |
| Feature flags | `src/config/features.ts` |

## Development Commands
```bash
npm run dev              # Start dev server
npm run types:generate   # Regenerate Supabase types after schema changes
npm run validate-setup   # Check env vars
```

## Import Aliases
Always use `@/` imports:
- `@/lib/auth/server` - Server-side auth (never import in client components)
- `@/lib/profile/client` - Client-side profile functions
- `@/hooks/use-user` - Client hook for user data
- `@/components/ui/*` - UI primitives with `cn()` for className merging
