# Clerk Authentication Setup Guide

This guide outlines the steps to configure authentication for this Next.js application using Clerk.

## 1. Create a Clerk Application

1. Go to [clerk.com](https://clerk.com) and sign up or log in.
2. Click **Create Application**.
3. Give your application a name (e.g., "LaunchKit" or your app name).
4. Select the authentication methods you want to enable:
   - **Email** (recommended)
   - **Google** (recommended for social login)
   - **GitHub**, **Apple**, etc. (optional)
5. Click **Create Application**.

## 2. Get Your API Keys

After creating your application:

1. Go to **API Keys** in the Clerk Dashboard sidebar.
2. Copy the following keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

## 3. Environment Variables

Add the following to your `.env.local` file:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=key
CLERK_SECRET_KEY=key

# Optional: Customize sign-in/sign-up URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

## 4. Configure Clerk in Supabase
See docs on how to [configure Clerk with Supabase](https://clerk.com/docs/guides/development/integrations/databases/supabase).

## 5. Configure Redirect URLs (Production)

When deploying to production:

1. Go to Clerk Dashboard > **Paths**.
2. Update the URLs to your production domain:
   - Sign-in URL: `https://yourdomain.com/login`
   - Sign-up URL: `https://yourdomain.com/signup`
   - After sign-in URL: `https://yourdomain.com/dashboard`
   - After sign-up URL: `https://yourdomain.com/dashboard`

3. Go to **Domains** and add your production domain.

## 6. Codebase Implementation

Authentication is already implemented in this template:

### Middleware (`src/proxy.ts`)

Protects routes using Clerk middleware:

```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/login(.*)',
  '/signup(.*)',
  '/api/webhooks(.*)',
])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})
```

### Server-Side Auth (`src/lib/auth/server.ts`)

```typescript
import { auth, currentUser } from '@clerk/nextjs/server'

// Get userId and session info
const { userId } = await auth()

// Get full user object
const user = await currentUser()

// Get user with profile/preferences from database
const extendedUser = await getExtendedUser()
```

### Client-Side Auth

Use Clerk's React hooks:

```typescript
import { useUser, useAuth, useClerk } from '@clerk/nextjs'

// Get current user
const { user, isLoaded } = useUser()

// Get auth state
const { userId, isSignedIn } = useAuth()

// Sign out
const { signOut } = useClerk()
```

Or use the custom hooks provided:

```typescript
import { useAuth } from '@/hooks/use-auth'
import { useUser } from '@/hooks/use-user'
```

### Pre-built Components

Clerk provides pre-built UI components:

```tsx
import { SignIn, SignUp, UserButton } from '@clerk/nextjs'

// Sign in page
<SignIn />

// Sign up page  
<SignUp />

// User avatar with dropdown menu
<UserButton afterSignOutUrl="/" />
```

## Troubleshooting

### "Clerk: No Publishable Key"
- Ensure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set in `.env.local`
- Restart the development server after adding env vars

### Redirect Issues
- Check that redirect URLs in Clerk Dashboard match your app URLs
- Ensure middleware matcher includes your routes
