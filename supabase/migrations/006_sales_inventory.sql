-- Products, inventory movements and sales.

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'Bebidas',
  price numeric(10,2) not null default 0,
  stock integer not null default 0,
  min_stock integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  sale_number text not null unique,
  total numeric(10,2) not null default 0,
  sold_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.sale_items (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid not null references public.sales(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10,2) not null,
  subtotal numeric(10,2) not null,
  created_at timestamptz not null default now()
);

create table if not exists public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  type text not null check (type in ('purchase', 'sale', 'adjustment', 'loss')),
  quantity integer not null,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists products_active_idx on public.products(active);
create index if not exists sales_sold_at_idx on public.sales(sold_at);
create index if not exists inventory_movements_product_id_idx on public.inventory_movements(product_id);

alter table public.products enable row level security;
alter table public.sales enable row level security;
alter table public.sale_items enable row level security;
alter table public.inventory_movements enable row level security;

grant select, insert, update, delete on table public.products to service_role;
grant select, insert, update, delete on table public.sales to service_role;
grant select, insert, update, delete on table public.sale_items to service_role;
grant select, insert, update, delete on table public.inventory_movements to service_role;
