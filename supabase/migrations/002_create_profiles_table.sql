-- Create profiles table for extended user data
-- Note: user_id is TEXT to support Clerk user IDs (e.g., user_2abc...)
CREATE TABLE public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  full_name TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  location TEXT,
  company TEXT,
  job_title TEXT,
  date_of_birth DATE,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (used by server operations)
CREATE POLICY "Service role has full access to profiles"
  ON public.profiles
  FOR ALL
  USING (auth.role() = 'service_role');

-- For client access with Clerk JWT integration (requires Supabase JWT config)
-- NOTE: Without Clerk JWT integration, client access will fail and you should
-- use server/admin-only access for this table.
CREATE POLICY "Users can view their own profile via Clerk JWT"
  ON public.profiles
  FOR SELECT
  USING (
    auth.jwt() IS NOT NULL 
    AND (auth.jwt()->>'sub') = user_id
  );

CREATE POLICY "Users can update their own profile via Clerk JWT"
  ON public.profiles
  FOR UPDATE
  USING (
    auth.jwt() IS NOT NULL 
    AND (auth.jwt()->>'sub') = user_id
  );

CREATE POLICY "Users can insert their own profile via Clerk JWT"
  ON public.profiles
  FOR INSERT
  WITH CHECK (
    auth.jwt() IS NOT NULL 
    AND (auth.jwt()->>'sub') = user_id
  );

-- Create indexes
CREATE INDEX profiles_user_id_idx ON public.profiles(user_id);
CREATE INDEX profiles_username_idx ON public.profiles(username);
CREATE INDEX profiles_created_at_idx ON public.profiles(created_at);

-- Create function to handle profile updates timestamp
CREATE OR REPLACE FUNCTION public.handle_profile_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically update timestamp
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_profile_update();
