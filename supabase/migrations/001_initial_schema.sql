-- FitBodyGym initial schema
-- Ejecutar en Supabase SQL Editor o convertir a migración con Supabase CLI.

create extension if not exists pgcrypto;

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  phone text,
  document_id text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  plan_name text not null,
  paid_at date not null,
  expires_at date not null,
  amount numeric(10,2),
  status text not null default 'active' check (status in ('active', 'expired', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint memberships_valid_dates check (expires_at >= paid_at)
);

create index if not exists memberships_client_id_idx on public.memberships(client_id);
create index if not exists memberships_expires_at_idx on public.memberships(expires_at);
create index if not exists clients_email_lower_idx on public.clients (lower(email));

create or replace view public.active_memberships as
select
  c.id as client_id,
  c.full_name,
  lower(trim(c.email)) as email,
  m.plan_name,
  m.paid_at,
  m.expires_at,
  m.status as membership_status,
  c.status as client_status
from public.clients c
join public.memberships m on m.client_id = c.id
where c.status = 'active'
  and m.status = 'active'
  and m.expires_at >= current_date;
