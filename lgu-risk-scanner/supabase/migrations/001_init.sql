-- Migration: 001_init.sql
-- Created from supabase/schema.sql

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

-- Performance Indexes
create index if not exists idx_procurements_lgu_id on procurements(lgu_id);
create index if not exists idx_risk_scores_lgu_id on risk_scores(lgu_id);
create index if not exists idx_audit_logs_entity on audit_logs(entity_type, entity_id);
create index if not exists idx_audit_logs_actor on audit_logs(actor);
create index if not exists idx_procurements_status on procurements(status);
create index if not exists idx_risk_scores_level on risk_scores(risk_level);

-- Row-Level Security (RLS) Policies
-- NOTE: Enable RLS on each table and configure policies based on your auth requirements
-- Example policies below (comment out if using service role only)

-- Enable RLS on all tables
alter table lgus enable row level security;
alter table procurements enable row level security;
alter table risk_scores enable row level security;
alter table audit_logs enable row level security;

-- Example RLS policies for read-only access (adjust based on your auth model)
-- Users can view all LGUs and their related data (suitable for auditors/government officials)
create policy "Enable read access for all users" on lgus for select using (true);
create policy "Enable read access for all users" on procurements for select using (true);
create policy "Enable read access for all users" on risk_scores for select using (true);
create policy "Enable read access for all users" on audit_logs for select using (true);

-- Write access: restrict to service role (via application logic)
-- This prevents direct insert/update/delete via anon key
-- All writes should go through your backend API which validates and logs changes
