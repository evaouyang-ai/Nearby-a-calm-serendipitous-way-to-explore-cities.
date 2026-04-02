-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- Covers both private journeys and the public discover map.

-- ── Private journeys (cloud Scrapbook) ───────────────────────────────────────

create table if not exists journeys (
  id          text primary key,
  user_id     uuid references auth.users not null,
  plan        jsonb not null,
  citations   jsonb default '[]'::jsonb,
  created_at  timestamptz default now()
);

alter table journeys enable row level security;

create policy "Users can read own journeys"
  on journeys for select
  using (auth.uid() = user_id);

create policy "Users can insert own journeys"
  on journeys for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own journeys"
  on journeys for delete
  using (auth.uid() = user_id);

create index if not exists journeys_user_id_created_at
  on journeys (user_id, created_at desc);


-- ── Public walks (Discover map, anonymous) ───────────────────────────────────

create table if not exists public_walks (
  id          uuid primary key default gen_random_uuid(),
  journey_id  text unique not null,    -- prevents duplicate sharing
  city        text not null,           -- lowercase, e.g. "kyoto"
  plan        jsonb not null,          -- NO user_id stored here — anonymous
  citations   jsonb default '[]'::jsonb,
  created_at  timestamptz default now()
);

-- Fully public for reads, no auth required
alter table public_walks enable row level security;

create policy "Public walks are readable by everyone"
  on public_walks for select
  using (true);

-- Only service role can insert (via api/share.ts which verifies auth server-side)
-- No direct client insert policy needed.

create index if not exists public_walks_city_created_at
  on public_walks (city, created_at desc);

create index if not exists public_walks_created_at
  on public_walks (created_at desc);
