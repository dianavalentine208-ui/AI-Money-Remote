# Email confirmation bypass (local development / test accounts)

Supabase **GoTrue** blocks `signInWithPassword` until `auth.users.email_confirmed_at` is set when **Confirm email** is enabled. The app cannot override that from the browser without exposing a **service role** key (do not add that to Vite).

## 1. Dashboard (fastest for a hosted project)

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project.
2. **Authentication** → **Providers** → **Email**.
3. Turn **off** **Confirm email** (use only on dev/staging if you prefer).

## 2. SQL — confirm one test user

Edit and run in **SQL Editor** (see `supabase/scripts/confirm-user-email.sql`):

```sql
UPDATE auth.users
SET
  email_confirmed_at = coalesce(email_confirmed_at, timezone('utc', now())),
  updated_at = timezone('utc', now())
WHERE lower(email) = lower('your-test@example.com');
```

## 3. Local stack only (`supabase start`)

Add to `supabase/config.toml` (local containers only):

```toml
[auth.email]
enable_confirmations = false
```

**Warning:** Do not run `supabase config push` against production with this unless you intend to change production auth behavior.

## 4. App-side hint (already in repo)

In development, failed sign-in with `email_not_confirmed` gets an extra hint in the toast (see `src/contexts/AuthContext.tsx`).
