-- WAC Machine Support Platform — Database Schema
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)

-- ── Machines ──────────────────────────────────────────────────────────────────
create table machines (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  brand       text,
  model       text,
  serial      text,
  year        text,
  client      text,
  location    text,
  technician  text,
  status      text not null default 'operational', -- operational | maintenance | inactive
  install_date date,
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── Sticker assignments ────────────────────────────────────────────────────────
-- sticker_code is the number/code printed on the physical sticker (e.g. "001", "A42")
create table sticker_assignments (
  sticker_code  text primary key,
  machine_id    uuid references machines(id) on delete set null,
  assigned_at   timestamptz not null default now(),
  assigned_by   text
);

-- ── Occurrences ────────────────────────────────────────────────────────────────
create table occurrences (
  id            uuid primary key default gen_random_uuid(),
  ref_code      text not null unique,
  machine_id    uuid references machines(id) on delete set null,
  sticker_code  text,
  operator_name text not null,
  issue_type    text not null,
  urgency       text not null default 'medium',
  description   text not null,
  status        text not null default 'open', -- open | in_progress | resolved
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ── Auto-update updated_at ─────────────────────────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger machines_updated_at before update on machines
  for each row execute function update_updated_at();

create trigger occurrences_updated_at before update on occurrences
  for each row execute function update_updated_at();

-- ── Row Level Security ─────────────────────────────────────────────────────────
-- Public (anon) can only read machines via sticker lookup (done server-side)
-- All writes go through Azure Functions using the service_role key (bypasses RLS)
alter table machines enable row level security;
alter table sticker_assignments enable row level security;
alter table occurrences enable row level security;

-- No public access — all API calls go through Azure Functions with service_role key
