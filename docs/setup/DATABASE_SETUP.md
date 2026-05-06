# Database Setup Guide

This guide will help you set up the custom user schema for your Supabase project.

## Prerequisites

- A Supabase project
- Supabase CLI installed (optional, for local development)
- Access to Supabase Dashboard

## Setup Instructions

### 1. Environment Variables

Make sure you have the following environment variables in your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Run Database Migrations

You have two options to set up the database schema:

#### Option A: Using Supabase Dashboard

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase/migrations/002_create_profiles_table.sql`
4. Click "Run" to execute the migration
5. Repeat for `supabase/migrations/003_create_user_preferences_table.sql`

#### Option B: Using Supabase CLI (Recommended)

1. Install Supabase CLI if you haven't already:
   ```bash
   npm install -g supabase
   ```

2. Initialize Supabase in your project:
   ```bash
   supabase init
   ```

3. Link your project:
   ```bash
   supabase link --project-ref your-project-id
   ```

4. Push the migrations:
   ```bash
   supabase db push
   ```

### 3. Generate TypeScript Types

After setting up your database schema, generate TypeScript types to keep your code in sync with your database:

#### Prerequisites

1. Install the Supabase CLI globally:
   ```bash
   npm install -g supabase
   ```

2. Get your Supabase Project ID from your project settings or URL (e.g., `abcdefghijklmnop`)

#### Generate Types

**Method 1: Using npm script (Recommended)**

1. Set your project ID as an environment variable:
   ```bash
   export SUPABASE_PROJECT_ID=your-project-id
   ```

2. Run the type generation script:
   ```bash
   npm run types:generate
   ```

**Method 2: Using Supabase CLI directly**

```bash
supabase gen types typescript --project-id your-project-id --schema public > src/types/database.ts
```

This will generate TypeScript types from your database schema and save them to `src/types/database.ts`.

#### When to Regenerate Types

Regenerate types whenever you:
- Add or remove tables
- Add or remove columns
- Change column types
- Modify database schema in any way

#### Continuous Integration

For production projects, consider adding type generation to your CI/CD pipeline to ensure types are always up to date:

```yaml
# Example GitHub Actions workflow
- name: Generate Supabase types
  run: |
    npm install -g supabase
    npm run types:generate
  env:
    SUPABASE_PROJECT_ID: ${{ secrets.SUPABASE_PROJECT_ID }}
```

### 4. Set Up Storage (Optional)

> **Clerk JWT Note**: Client-side access to Supabase RLS policies requires
> Clerk JWT integration with Supabase. Without it, use server/admin-only access
> for profile/preferences and storage operations.

If you want to enable avatar uploads, create a storage bucket:

1. Go to Storage in your Supabase Dashboard
2. Create a new bucket called `avatars`
3. Set the bucket to public
4. Add the following RLS policy:

```sql
-- Allow users to upload their own avatars
CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to view their own avatars
CREATE POLICY "Users can view their own avatar" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to update their own avatars
CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to delete their own avatars
CREATE POLICY "Users can delete their own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
```

## Database Schema Overview

### Tables Created

1. **profiles** - Extended user information
   - Basic info: full_name, username, bio
   - Contact: email, phone, website
   - Professional: company, job_title
   - Personal: location, date_of_birth, avatar_url
   - Settings: timezone, language, theme
   - Notifications: email_notifications, push_notifications, marketing_emails

2. **user_preferences** - Application-specific preferences
   - UI preferences: dashboard_layout, sidebar_collapsed
   - Data preferences: data_export_format, preferred_currency
   - System preferences: auto_save, session_timeout, two_factor_enabled
   - Internationalization: date_format, time_format, week_start_day
   - Custom settings: custom_settings (JSONB field for extensibility)

### Automatic Features

- **Profile Creation**: Automatically creates a profile when a user signs up
- **Preferences Creation**: Automatically creates default preferences when a profile is created
- **Row Level Security**: Users can only access their own data
- **Timestamps**: Automatic created_at and updated_at timestamps

## Using the Schema

### In Your Components

Import the types and hooks:

```typescript
import { useUser } from '@/hooks/use-user'
import { ProfileFormData, PreferencesFormData } from '@/types/user'

// In your component
const { user, profile, preferences, updateProfile, updatePreferences } = useUser()
```

### Server-Side Usage

```typescript
import { getExtendedUser } from '@/lib/auth-server'

// In your server component or API route
const user = await getExtendedUser()
```

### Profile Management

```typescript
import { updateProfile, updateUserPreferences } from '@/lib/profile'

// Update profile
await updateProfile(userId, {
  full_name: 'John Doe',
  bio: 'Software Developer'
})

// Update preferences
await updateUserPreferences(userId, {
  theme: 'dark',
  language: 'en'
})
```

## Customization

### Adding Custom Fields

To add custom fields to the profile:

1. Add the column to the database:
   ```sql
   ALTER TABLE public.profiles ADD COLUMN custom_field TEXT;
   ```

2. Update the TypeScript types in `src/types/database.ts`

3. Update the forms and components as needed

### Custom Settings

Use the `custom_settings` JSONB field in `user_preferences` for app-specific settings:

```typescript
await updateUserPreferences(userId, {
  custom_settings: {
    feature_flags: { beta_features: true },
    dashboard_widgets: ['weather', 'news', 'calendar']
  }
})
```

## Security Considerations

- All tables have Row Level Security (RLS) enabled
- Users can only access their own data
- Profile creation is automatically handled by database triggers
- Username uniqueness is enforced at the database level

## Troubleshooting

### Common Issues

1. **Profile not created**: Check if the trigger function is properly installed
2. **Permission denied**: Verify RLS policies are correctly set up
3. **Username conflicts**: The username field has a unique constraint

### Reset Schema

If you need to reset the schema:

```sql
-- WARNING: This will delete all user data
DROP TABLE IF EXISTS public.user_preferences CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user_preferences() CASCADE;
```

Then re-run the migrations.