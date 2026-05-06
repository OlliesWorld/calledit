-- Create user preferences table for app settings
-- Note: user_id is TEXT to support Clerk user IDs (e.g., user_2abc...)
CREATE TABLE public.user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  theme TEXT DEFAULT 'system',
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  dashboard_layout TEXT DEFAULT 'default',
  sidebar_collapsed BOOLEAN DEFAULT false,
  data_export_format TEXT DEFAULT 'json',
  auto_save BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  marketing_emails BOOLEAN DEFAULT false,
  preferred_currency TEXT DEFAULT 'USD',
  date_format TEXT DEFAULT 'YYYY-MM-DD',
  time_format TEXT DEFAULT '24h',
  week_start_day INTEGER DEFAULT 1, -- 1 = Monday
  custom_settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (used by server operations)
CREATE POLICY "Service role has full access to preferences"
  ON public.user_preferences
  FOR ALL
  USING (auth.role() = 'service_role');

-- For client access with Clerk JWT integration (requires Supabase JWT config)
-- NOTE: Without Clerk JWT integration, client access will fail and you should
-- use server/admin-only access for this table.
CREATE POLICY "Users can view their own preferences via Clerk JWT"
  ON public.user_preferences
  FOR SELECT
  USING (
    auth.jwt() IS NOT NULL 
    AND (auth.jwt()->>'sub') = user_id
  );

CREATE POLICY "Users can update their own preferences via Clerk JWT"
  ON public.user_preferences
  FOR UPDATE
  USING (
    auth.jwt() IS NOT NULL 
    AND (auth.jwt()->>'sub') = user_id
  );

CREATE POLICY "Users can insert their own preferences via Clerk JWT"
  ON public.user_preferences
  FOR INSERT
  WITH CHECK (
    auth.jwt() IS NOT NULL 
    AND (auth.jwt()->>'sub') = user_id
  );

-- Create indexes
CREATE INDEX user_preferences_user_id_idx ON public.user_preferences(user_id);

-- Create function to handle preferences updates timestamp
CREATE OR REPLACE FUNCTION public.handle_preferences_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically update timestamp
CREATE TRIGGER on_preferences_updated
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.handle_preferences_update();
