-- Confirm one user by email (run in Supabase Dashboard → SQL Editor).
-- Replace the email literal before running.
UPDATE auth.users
SET
  email_confirmed_at = coalesce(email_confirmed_at, timezone('utc', now())),
  updated_at = timezone('utc', now())
WHERE lower(email) = lower('REPLACE_WITH_YOUR_TEST_EMAIL@example.com');
