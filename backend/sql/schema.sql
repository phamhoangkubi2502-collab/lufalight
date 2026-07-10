-- Lufalight backend schema (Supabase / Postgres)
-- Run this once in the Supabase SQL editor for a new project.

create table if not exists products (
  sku text primary key,
  name text not null,
  price_cents integer not null,
  warranty_years integer not null default 1,
  active boolean not null default true
);

create table if not exists inventory (
  sku text primary key references products(sku) on delete cascade,
  stock_qty integer not null default 0,
  low_stock_threshold integer not null default 5,
  updated_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique not null,
  customer_email text,
  shipping_address jsonb,
  status text not null default 'pending', -- pending | paid | refunded | shipped
  carrier text,
  tracking_number text,
  affiliate_code text,
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id bigserial primary key,
  order_id uuid not null references orders(id) on delete cascade,
  sku text not null references products(sku),
  qty integer not null check (qty > 0),
  unit_price_cents integer not null
);

create table if not exists affiliates (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  email text not null,
  commission_rate numeric not null default 0.10,
  payout_email text,
  created_at timestamptz not null default now()
);

create table if not exists commissions (
  id bigserial primary key,
  order_id uuid not null references orders(id) on delete cascade,
  affiliate_id uuid not null references affiliates(id),
  amount_cents integer not null,
  status text not null default 'pending', -- pending | paid
  created_at timestamptz not null default now()
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  sku text not null references products(sku) on delete cascade,
  customer_name text not null,
  rating smallint not null check (rating between 1 and 5),
  title text,
  body text not null,
  approved boolean not null default false, -- moderated before showing publicly
  created_at timestamptz not null default now()
);
create index if not exists reviews_sku_approved_idx on reviews(sku, approved);

-- Row-level security: lock every table down. The backend talks to Postgres using the
-- service-role key, which bypasses RLS entirely — the static frontend never gets a key
-- that can read/write these tables directly.
alter table products enable row level security;
alter table inventory enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table affiliates enable row level security;
alter table commissions enable row level security;
alter table reviews enable row level security;
