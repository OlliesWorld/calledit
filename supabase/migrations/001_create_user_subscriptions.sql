-- Create user_subscriptions table for Stripe subscription management
-- Note: user_id is TEXT to support Clerk user IDs (e.g., user_2abc...)
CREATE TABLE public.user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL,
  price_id TEXT NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policy for user_subscriptions with Clerk Authentication
-- 
-- IMPORTANT: This app uses Clerk for authentication, not Supabase Auth.
-- The auth.uid() function won't work with Clerk user IDs.
-- 
-- Options for securing this table:
-- 1. Use Supabase service role (admin client) for all subscription queries
--    - Webhook operations already use createAdminClient()
--    - Server-side queries should also use admin client
-- 2. Integrate Clerk JWTs with Supabase (requires additional setup)
--    - Configure Supabase to verify Clerk JWTs
--    - Use auth.jwt()->>'sub' to get Clerk user ID
--
-- For now, we create a policy that allows service role full access
-- and a restrictive policy for anon/authenticated that requires
-- the Clerk JWT integration to be set up.

-- Allow service role full access (used by webhooks and server operations)
CREATE POLICY "Service role has full access to subscriptions"
  ON public.user_subscriptions
  FOR ALL
  USING (auth.role() = 'service_role');

-- For client access with Clerk JWT integration (requires Supabase JWT config)
-- This policy checks the 'sub' claim from the Clerk JWT
CREATE POLICY "Users can view their own subscription via Clerk JWT"
  ON public.user_subscriptions
  FOR SELECT
  USING (
    auth.jwt() IS NOT NULL 
    AND (auth.jwt()->>'sub') = user_id
  );

-- Indexes for performance
CREATE INDEX user_subscriptions_user_id_idx ON public.user_subscriptions(user_id);
CREATE INDEX user_subscriptions_stripe_customer_id_idx ON public.user_subscriptions(stripe_customer_id);
CREATE INDEX user_subscriptions_stripe_subscription_id_idx ON public.user_subscriptions(stripe_subscription_id);
CREATE INDEX user_subscriptions_status_idx ON public.user_subscriptions(status);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function on update
CREATE TRIGGER user_subscriptions_updated_at
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_subscriptions_updated_at();
