-- =====================================================================
-- Alesya Studio - Initial Schema
-- Single-tenant management for Shopee Live affiliators
-- =====================================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";
create extension if not exists pg_trgm;

-- ---------- ENUMS ----------
do $$ begin
  create type user_role as enum ('admin', 'manager', 'host');
exception when duplicate_object then null; end $$;

do $$ begin
  create type live_status as enum ('scheduled', 'live', 'ended', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type product_status as enum ('saved', 'shortlisted', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type cart_command_status as enum ('queued', 'sent', 'acknowledged', 'failed');
exception when duplicate_object then null; end $$;

-- ---------- PROFILES ----------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text unique not null,
  phone text,
  role user_role not null default 'host',
  avatar_url text,
  shopee_username text,
  affiliate_id text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_profiles_role on profiles(role);
create index if not exists idx_profiles_active on profiles(is_active);

-- ---------- BRANDS ----------
create table if not exists brands (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  shopee_shop_id text,
  shopee_shop_url text,
  logo_url text,
  category text,
  commission_rate numeric(5,2) default 0,
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_brands_active on brands(is_active);

-- ---------- PRODUCTS (riset) ----------
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  shopee_item_id text,
  shopee_shop_id text,
  shopee_url text,
  name text not null,
  image_url text,
  brand_id uuid references brands(id) on delete set null,
  category text,
  price numeric(12,2) not null default 0,
  price_min numeric(12,2),
  price_max numeric(12,2),
  sold_total integer not null default 0,
  sold_monthly integer not null default 0,
  rating numeric(3,2) default 0,
  review_count integer not null default 0,
  stock integer default 0,
  commission_rate numeric(5,2) default 0,
  estimated_commission numeric(12,2) default 0,
  is_winning boolean not null default false,
  status product_status not null default 'saved',
  tags text[] default '{}',
  added_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_products_winning on products(is_winning);
create index if not exists idx_products_status on products(status);
create index if not exists idx_products_brand on products(brand_id);
create index if not exists idx_products_sold_monthly on products(sold_monthly desc);
create index if not exists idx_products_rating on products(rating desc);
create index if not exists idx_products_name_trgm on products using gin (name gin_trgm_ops);

-- ---------- LIVE SESSIONS ----------
create table if not exists live_sessions (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  host_id uuid references profiles(id) on delete set null,
  brand_id uuid references brands(id) on delete set null,
  scheduled_start timestamptz,
  scheduled_end timestamptz,
  actual_start timestamptz,
  actual_end timestamptz,
  status live_status not null default 'scheduled',
  shopee_live_url text,
  thumbnail_url text,
  notes text,
  -- performance metrics (input manual / scrape)
  peak_viewers integer default 0,
  total_viewers integer default 0,
  orders_count integer default 0,
  gmv numeric(14,2) default 0,
  commission numeric(14,2) default 0,
  conversion_rate numeric(5,2) default 0,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_live_status on live_sessions(status);
create index if not exists idx_live_host on live_sessions(host_id);
create index if not exists idx_live_brand on live_sessions(brand_id);
create index if not exists idx_live_scheduled on live_sessions(scheduled_start);

-- ---------- LIVE PRODUCT CART (Keranjang Oren plan) ----------
create table if not exists live_cart_items (
  id uuid primary key default uuid_generate_v4(),
  live_session_id uuid not null references live_sessions(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  position integer not null default 0,
  is_pinned boolean not null default false,
  -- per-item live performance
  clicks integer default 0,
  orders integer default 0,
  revenue numeric(12,2) default 0,
  commission numeric(12,2) default 0,
  notes text,
  created_at timestamptz not null default now(),
  unique (live_session_id, product_id)
);

create index if not exists idx_cart_session on live_cart_items(live_session_id);
create index if not exists idx_cart_product on live_cart_items(product_id);

-- ---------- CART COMMANDS (audit log of "push to orange cart" actions) ----------
create table if not exists cart_commands (
  id uuid primary key default uuid_generate_v4(),
  live_session_id uuid not null references live_sessions(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  command_type text not null, -- 'pin', 'unpin', 'stop_live', 'start_live'
  status cart_command_status not null default 'queued',
  payload jsonb default '{}'::jsonb,
  issued_by uuid references profiles(id) on delete set null,
  issued_at timestamptz not null default now(),
  acknowledged_at timestamptz,
  error_message text
);

create index if not exists idx_cmd_session on cart_commands(live_session_id);
create index if not exists idx_cmd_status on cart_commands(status);

-- ---------- LIVE CHECKLIST ----------
create table if not exists live_checklist_items (
  id uuid primary key default uuid_generate_v4(),
  live_session_id uuid not null references live_sessions(id) on delete cascade,
  label text not null,
  is_done boolean not null default false,
  position integer not null default 0
);

create index if not exists idx_checklist_session on live_checklist_items(live_session_id);

-- ---------- ACTIVITY LOG ----------
create table if not exists activity_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid references profiles(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_activity_actor on activity_logs(actor_id);
create index if not exists idx_activity_created on activity_logs(created_at desc);

-- ---------- TRIGGERS: updated_at ----------
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_profiles_updated on profiles;
create trigger trg_profiles_updated before update on profiles
  for each row execute function set_updated_at();

drop trigger if exists trg_brands_updated on brands;
create trigger trg_brands_updated before update on brands
  for each row execute function set_updated_at();

drop trigger if exists trg_products_updated on products;
create trigger trg_products_updated before update on products
  for each row execute function set_updated_at();

drop trigger if exists trg_live_updated on live_sessions;
create trigger trg_live_updated before update on live_sessions
  for each row execute function set_updated_at();

-- ---------- AUTO-CREATE PROFILE on auth signup ----------
create or replace function handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'host')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_auth_new_user on auth.users;
create trigger trg_auth_new_user
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------- ROW LEVEL SECURITY ----------
alter table profiles enable row level security;
alter table brands enable row level security;
alter table products enable row level security;
alter table live_sessions enable row level security;
alter table live_cart_items enable row level security;
alter table cart_commands enable row level security;
alter table live_checklist_items enable row level security;
alter table activity_logs enable row level security;

-- helper: current user role
create or replace function current_user_role() returns user_role as $$
  select role from profiles where id = auth.uid();
$$ language sql stable security definer;

-- profiles policies
drop policy if exists "profiles_select_self_or_staff" on profiles;
create policy "profiles_select_self_or_staff" on profiles for select
  using (id = auth.uid() or current_user_role() in ('admin','manager'));

drop policy if exists "profiles_update_self" on profiles;
create policy "profiles_update_self" on profiles for update
  using (id = auth.uid() or current_user_role() = 'admin');

drop policy if exists "profiles_admin_all" on profiles;
create policy "profiles_admin_all" on profiles for all
  using (current_user_role() = 'admin')
  with check (current_user_role() = 'admin');

-- brands: staff read, admin write
drop policy if exists "brands_read_all_authed" on brands;
create policy "brands_read_all_authed" on brands for select
  using (auth.uid() is not null);

drop policy if exists "brands_admin_write" on brands;
create policy "brands_admin_write" on brands for all
  using (current_user_role() in ('admin','manager'))
  with check (current_user_role() in ('admin','manager'));

-- products: all authed read, staff write
drop policy if exists "products_read_all_authed" on products;
create policy "products_read_all_authed" on products for select
  using (auth.uid() is not null);

drop policy if exists "products_staff_write" on products;
create policy "products_staff_write" on products for all
  using (current_user_role() in ('admin','manager'))
  with check (current_user_role() in ('admin','manager'));

-- live sessions: host can read own, staff full
drop policy if exists "live_read" on live_sessions;
create policy "live_read" on live_sessions for select
  using (
    auth.uid() is not null and (
      current_user_role() in ('admin','manager')
      or host_id = auth.uid()
    )
  );

drop policy if exists "live_staff_write" on live_sessions;
create policy "live_staff_write" on live_sessions for all
  using (current_user_role() in ('admin','manager'))
  with check (current_user_role() in ('admin','manager'));

drop policy if exists "live_host_update_own" on live_sessions;
create policy "live_host_update_own" on live_sessions for update
  using (host_id = auth.uid());

-- live_cart_items inherit
drop policy if exists "cart_read" on live_cart_items;
create policy "cart_read" on live_cart_items for select using (auth.uid() is not null);

drop policy if exists "cart_staff_write" on live_cart_items;
create policy "cart_staff_write" on live_cart_items for all
  using (current_user_role() in ('admin','manager'))
  with check (current_user_role() in ('admin','manager'));

-- cart_commands
drop policy if exists "cmd_read" on cart_commands;
create policy "cmd_read" on cart_commands for select using (auth.uid() is not null);

drop policy if exists "cmd_staff_write" on cart_commands;
create policy "cmd_staff_write" on cart_commands for all
  using (current_user_role() in ('admin','manager'))
  with check (current_user_role() in ('admin','manager'));

-- checklist
drop policy if exists "checklist_read" on live_checklist_items;
create policy "checklist_read" on live_checklist_items for select using (auth.uid() is not null);

drop policy if exists "checklist_write" on live_checklist_items;
create policy "checklist_write" on live_checklist_items for all
  using (current_user_role() in ('admin','manager'))
  with check (current_user_role() in ('admin','manager'));

-- activity logs
drop policy if exists "activity_read_staff" on activity_logs;
create policy "activity_read_staff" on activity_logs for select
  using (current_user_role() in ('admin','manager'));

drop policy if exists "activity_insert_authed" on activity_logs;
create policy "activity_insert_authed" on activity_logs for insert
  with check (auth.uid() is not null);
