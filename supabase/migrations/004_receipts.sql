-- Payment receipts for FitBodyGym.

create table if not exists public.receipts (
  id uuid primary key default gen_random_uuid(),
  receipt_number text not null unique,
  client_id uuid not null references public.clients(id) on delete cascade,
  membership_id uuid references public.memberships(id) on delete set null,
  client_name text not null,
  client_email text not null,
  client_phone text,
  plan_name text not null,
  paid_at date not null,
  expires_at date not null,
  amount numeric(10,2),
  issued_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists receipts_client_id_idx on public.receipts(client_id);
create index if not exists receipts_issued_at_idx on public.receipts(issued_at);

alter table public.receipts enable row level security;

grant select, insert, update, delete on table public.receipts to service_role;
