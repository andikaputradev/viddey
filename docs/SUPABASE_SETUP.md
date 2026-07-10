# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New project**, choose a name, a region close to your users, and a secure database password.
3. Wait for the project to initialize (typically 1–2 minutes).

## 2. Obtain Credentials

From your project dashboard → **Project Settings** → **API**:

| Key | Used for |
|---|---|
| **Project URL** | `SUPABASE_URL` |
| **service_role** secret | `SUPABASE_SERVICE_ROLE_KEY` |

> **Security:** The service role key bypasses Row Level Security. It must only be used server-side and must never be exposed in client-side code or committed to source control.

Set in `.env.local`:
```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 3. Run Migrations

1. In your Supabase dashboard, open **SQL Editor**.
2. Open `db/migrations/001_initial.sql` from this project.
3. Paste the entire file into the editor and click **Run**.

This creates:
- `public.videos` — video metadata
- `public.reports` — content reports
- Row Level Security policies
- Indexes for slug, delete_token, and created_at
- `increment_views` RPC function

## 4. Verify

After running the migration, check **Table Editor** to confirm both tables exist. Run this query to verify:

```sql
select table_name from information_schema.tables
where table_schema = 'public';
```

Expected output includes `videos` and `reports`.

## Schema Reference

See [DATABASE.md](DATABASE.md) for full column descriptions, constraints, and RPC documentation.

## Connection Pooling (Production)

For high-traffic production use, enable **Supavisor** (Supabase's built-in connection pooler) in your project settings. No code changes are required; Supabase handles pooling transparently with the service role key.
