-- Supabase schema for LGU Risk Scanner
create table if not exists lgus (
  id text primary key,
  name text,
  population integer,
  location text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists procurements (
  id text primary key,
  lgu_id text not null references lgus(id) on delete cascade,
  reference_number text,
  title text not null,
  supplier text,
  amount numeric not null default 0,
  status text not null default 'draft',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists risk_scores (
  id text primary key,
  lgu_id text not null references lgus(id) on delete cascade,
  score numeric not null,
  risk_level text not null,
  explanation text,
  factors jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id text primary key,
  entity_type text not null,
  entity_id text not null,
  action text,
  actor text not null default 'system',
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
