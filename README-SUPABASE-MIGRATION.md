# PrimeWatch by Kayode — Supabase Migration

This project has been migrated from `localStorage` to Supabase. The UI,
branding, layout, and admin dashboard workflow are unchanged — only where
data lives has changed.

## What changed

| Area | Before | Now |
|---|---|---|
| Products & settings | `localStorage` (per-browser only) | Supabase Postgres (`watches`, `store_settings` tables) |
| Product photos | Base64 data embedded in `localStorage` | Uploaded to Supabase Storage (`watch-images` bucket), only the public URL is stored |
| Admin login | Hardcoded password string comparison (`kayode2026`) | Real Supabase Auth (`signInWithPassword`), gated further by database-level RLS policies |
| Data access | Direct `localStorage.getItem/setItem` | `src/lib/storage.ts` — typed functions calling Supabase |

No existing tables were renamed or dropped. The `watches` table is extended
in place (new columns only, via `ADD COLUMN IF NOT EXISTS`), and a new
`store_settings` table was added since settings previously had no table at
all.

## 1. Run the SQL migration

In your Supabase project: **SQL Editor → New Query**, paste the contents of
`supabase/migrations/001_watches_settings_rls.sql`, and run it.

It is idempotent — safe to run again if needed. It will:
- Ensure `watches` has every column the app needs (adds missing ones only)
- Create `store_settings` (new table, single settings row)
- Enable Row Level Security on both tables: public read, authenticated-only write
- Set matching policies on the `watch-images` Storage bucket (public read,
  authenticated upload/delete) and ensure the bucket is public

**This is the real security boundary.** Even if there were ever a bug in the
app's own auth check, Postgres itself refuses writes from anyone who isn't
authenticated — the two layers are independent.

## 2. Create the admin user

Supabase Dashboard → **Authentication → Users → Add User**. Set whatever
email and password you want to log in with.

The existing login screen only has a password field (no email field, to
match the current UI exactly) — the email is configured once via an
environment variable instead (see below), and only the password is entered
at login time.

## 3. Environment variables

Copy `.env.example` to `.env.local` and fill in:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_ADMIN_EMAIL=the-email-you-used-in-step-2
```

Get the URL and anon key from Supabase Dashboard → **Project Settings → API**.

**Note:** this is a Vite project, not Next.js — client-exposed env vars must
be prefixed `VITE_`, not `NEXT_PUBLIC_`. Vite does not read `NEXT_PUBLIC_*`
at all, so using that prefix would silently leave `import.meta.env` empty.

The anon key is safe to expose in client code by design (that's what it's
for) — it has no special privileges beyond what your RLS policies allow.

## 4. Install and run locally

```bash
npm install
npm run dev
```

Open the app, click the discreet "Admin" link in the footer, and log in with
the password you set in step 2. First load will auto-seed the `watches`
table with the sample catalog if it's empty.

## 5. Deploy

### Vercel (already connected to your GitHub repo)

1. Push this updated code to your repository.
2. In Vercel: **Project → Settings → Environment Variables**, add
   `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_ADMIN_EMAIL` (same
   values as your `.env.local`) for the Production environment.
3. Redeploy (Vercel will do this automatically on push, or trigger manually
   from the dashboard).

No other Vercel configuration changes are needed — this is still a static
Vite build (`npm run build` outputs to `dist/`), so your existing Vercel
project settings apply unchanged.

### GitHub

Just push normally:

```bash
git add .
git commit -m "Migrate from localStorage to Supabase"
git push
```

Vercel will pick up the push and redeploy automatically if that's how it's
currently configured.

## What to check after deploying

- [ ] Storefront loads and shows products (confirms public read access works)
- [ ] `/admin` login works with your new Supabase user's password
- [ ] Adding, editing, deleting a product persists after a page refresh
- [ ] Uploading a photo shows it appearing in your Supabase Storage
      `watch-images` bucket, and the product's photo URL points to it
- [ ] Opening the site in a different browser/device shows the same catalog
      (confirms it's no longer per-browser `localStorage`)

## Code changes, file by file

**New files:**
- `src/lib/supabaseClient.ts` — Supabase client instance
- `src/lib/auth.ts` — sign in/out, session check, password update
- `supabase/migrations/001_watches_settings_rls.sql` — schema + RLS + storage policies
- `.env.example` — updated for Supabase (Vite-prefixed vars)

**Rewritten:**
- `src/lib/storage.ts` — same utility functions kept as-is (`formatPrice`,
  `buildWhatsAppLink`, etc.); data functions (`loadWatches`/`saveWatches` and
  equivalents) replaced with granular async Supabase calls
  (`fetchWatches`, `insertWatch`, `updateWatch`, `deleteWatch`, `loadSettings`,
  `saveSettings`, `resetToDefaults`); added `uploadProductPhoto` /
  `deleteProductPhoto` for Storage
- `src/App.tsx` — same view routing and JSX structure; data loading is now
  async with a loading state; added Supabase auth session tracking; added a
  diff-based sync layer so `AdminView`'s existing "hand back the full array"
  pattern still works but now translates into real per-record Supabase calls

**Edited in place (everything else in these files is untouched):**
- `src/views/AdminView.tsx` — login now calls real Supabase Auth instead of
  comparing strings; photo upload now uploads to Storage instead of embedding
  base64; the password field in Settings now calls Supabase's password
  update instead of writing to a settings field; "Lock Dashboard" now signs
  out of the real session; removed the plaintext password hint that used to
  be shown on the login screen
- `src/types.ts` — removed `adminPasswordHash` from `StoreSettings` (auth no
  longer works by comparing a stored string)
- `src/data/initialData.ts` — removed the now-unused seed password field
- `package.json` — added `@supabase/supabase-js`; removed `@google/genai`,
  `express`, `dotenv`, `tsx` (leftover from the original AI Studio scaffold,
  unused anywhere in `src/`)

**Untouched:** `Navbar.tsx`, `Footer.tsx`, `HomeView.tsx`, `CollectionView.tsx`,
`AboutView.tsx`, `ContactView.tsx`, `PrivacyTermsView.tsx`,
`ProductDetailModal.tsx`, and all other components — none of them read or
write data directly; they only receive `watches`/`settings` as props and use
pure formatting utilities, so none of them needed to change.

## Known limitation worth knowing about

`VITE_ADMIN_EMAIL` is a single fixed admin account. This matches the
original single-password design (one admin, Kayode). If you ever want
multiple admin users with different logins, that's a small additional step
(add an email field to the login form, or an admin-role check) rather than
a redesign — ask if/when you need it.
