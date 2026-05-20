-- Day passes for visitors who pay a single-day entrance.
-- Receipts can now belong either to a registered client or to a day visitor.

alter table public.receipts alter column client_id drop not null;

create table if not exists public.day_passes (
  id uuid primary key default gen_random_uuid(),
  visitor_name text,
  phone text,
  visit_date date not null default current_date,
  amount numeric(10,2) not null default 2.00,
  receipt_id uuid references public.receipts(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists day_passes_visit_date_idx on public.day_passes(visit_date);

alter table public.day_passes enable row level security;

grant select, insert, update, delete on table public.day_passes to service_role;
