-- Close direct table access through the public (anon) key.
--
-- The app reads and writes every CalledIt table on the server with the
-- service-role client (src/lib/supabase/admin.ts), after Clerk has checked who
-- the user is. Nothing in the browser talks to Supabase directly.
--
-- Until now the anon key (which ships in every Supabase project and is meant to
-- be public) could SELECT weeks and questions, including correct_answer and
-- tiebreaker_answer before a week locked. Revoking the table grants closes
-- that, and anything else RLS might let through later.
--
-- Permissions only: no tables, columns, policies or rows change. To undo:
--   GRANT SELECT ON <table> TO anon, authenticated;
--
-- If a future feature needs browser-side Supabase reads, grant SELECT on a
-- view that leaves out the answer columns rather than re-granting the table.

REVOKE ALL ON TABLE
    public.weeks,
    public.questions,
    public.picks,
    public.profiles,
    public.user_preferences,
    public.user_subscriptions
FROM anon, authenticated;
