-- =============================================================================
-- PrimeWatch by Kayode — Supabase migration
-- Safe to run multiple times. Does not rename or drop the existing `watches`
-- table. Uses IF NOT EXISTS / ADD COLUMN IF NOT EXISTS throughout so this
-- works regardless of what columns already exist on your table today.
-- Run this in the Supabase SQL Editor (Project -> SQL Editor -> New Query).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. WATCHES TABLE — ensure it exists, then ensure every column the app needs
--    is present. Existing columns/data are left untouched.
-- -----------------------------------------------------------------------------

create table if not exists public.watches (
  id bigint generated always as identity primary key
);

alter table public.watches add column if not exists code text not null default '';
alter table public.watches add column if not exists name text not null default '';
alter table public.watches add column if not exists brand text not null default '';
alter table public.watches add column if not exists price numeric not null default 0;
alter table public.watches add column if not exists original_price numeric;
alter table public.watches add column if not exists categories text[] not null default '{}';
alter table public.watches add column if not exists strap_material text not null default '';
alter table public.watches add column if not exists movement_type text not null default '';
alter table public.watches add column if not exists case_material text not null default '';
alter table public.watches add column if not exists colors text[] not null default '{}';
alter table public.watches add column if not exists stock_status text not null default 'Available';
alter table public.watches add column if not exists is_new_arrival boolean not null default false;
alter table public.watches add column if not exists is_best_seller boolean not null default false;
alter table public.watches add column if not exists is_featured boolean not null default false;
alter table public.watches add column if not exists short_description text not null default '';
alter table public.watches add column if not exists full_description text not null default '';
alter table public.watches add column if not exists features text[] not null default '{}';
alter table public.watches add column if not exists package_contents text[] not null default '{}';
alter table public.watches add column if not exists photos text[] not null default '{}';
alter table public.watches add column if not exists order_index integer not null default 0;
alter table public.watches add column if not exists created_at timestamptz not null default now();

-- Keep stock_status constrained to the values the app understands.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'watches_stock_status_check'
  ) then
    alter table public.watches
      add constraint watches_stock_status_check
      check (stock_status in ('Available', 'Limited Stock', 'Sold Out'));
  end if;
end $$;

create index if not exists watches_order_index_idx on public.watches (order_index);

-- -----------------------------------------------------------------------------
-- 2. STORE SETTINGS TABLE — new table, single-row singleton (id is always 1).
--    This does not replace or rename `watches`; it's a separate table for
--    store-wide settings that previously lived in localStorage.
-- -----------------------------------------------------------------------------

create table if not exists public.store_settings (
  id integer primary key default 1,
  whatsapp_number text not null default '',
  instagram_handle text not null default '',
  tiktok_handle text not null default '',
  facebook_handle text not null default '',
  email text not null default '',
  business_hours text not null default '',
  location text not null default '',
  currency_symbol text not null default '₦',
  hero_title text not null default '',
  hero_subtitle text not null default '',
  hero_image_url text not null default '',
  updated_at timestamptz not null default now(),
  constraint store_settings_singleton check (id = 1)
);

-- Seed the single settings row if it doesn't exist yet (safe no-op if it does).
insert into public.store_settings (id)
values (1)
on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY
--    Public (anon) visitors can only READ. Only authenticated users (i.e. the
--    admin, logged in via Supabase Auth) can write. This is the real security
--    boundary — it holds even if a bug ever let the client-side admin check
--    slip, because Postgres enforces it independently of the app's code.
-- -----------------------------------------------------------------------------

alter table public.watches enable row level security;
alter table public.store_settings enable row level security;

drop policy if exists "Public read watches" on public.watches;
create policy "Public read watches"
  on public.watches for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated insert watches" on public.watches;
create policy "Authenticated insert watches"
  on public.watches for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated update watches" on public.watches;
create policy "Authenticated update watches"
  on public.watches for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated delete watches" on public.watches;
create policy "Authenticated delete watches"
  on public.watches for delete
  to authenticated
  using (true);

drop policy if exists "Public read settings" on public.store_settings;
create policy "Public read settings"
  on public.store_settings for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated update settings" on public.store_settings;
create policy "Authenticated update settings"
  on public.store_settings for update
  to authenticated
  using (true)
  with check (true);

-- -----------------------------------------------------------------------------
-- 4. STORAGE — policies for the existing `watch-images` bucket.
--    Public read (so photos display on the storefront), authenticated-only
--    write/delete. Assumes the bucket already exists (per your setup); this
--    only adds/updates its access policies.
-- -----------------------------------------------------------------------------

drop policy if exists "Public read watch-images" on storage.objects;
create policy "Public read watch-images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'watch-images');

drop policy if exists "Authenticated upload watch-images" on storage.objects;
create policy "Authenticated upload watch-images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'watch-images');

drop policy if exists "Authenticated delete watch-images" on storage.objects;
create policy "Authenticated delete watch-images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'watch-images');

-- Make sure the bucket is public (so the URLs the app stores are directly
-- viewable). No-op if it's already set this way.
update storage.buckets set public = true where id = 'watch-images';

-- =============================================================================
-- 5. CREATE YOUR ADMIN USER (do this manually, not via this script)
--    Supabase Dashboard -> Authentication -> Users -> Add User.
--    Use the email you'll set as VITE_ADMIN_EMAIL in your .env — see README.
-- =============================================================================
