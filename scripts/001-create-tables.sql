-- Create users/profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null,
  role text not null check (role in ('admin', 'operator')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- Profiles policies
create policy "profiles_select_all"
  on public.profiles for select
  using (true);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Create contacts table
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text,
  company text,
  position text,
  source text,
  stage text not null default 'new' check (stage in ('new', 'contacted', 'follow_up', 'purchased', 'lost')),
  stage_order integer not null default 0,
  assigned_to uuid references public.profiles(id) on delete set null,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  created_by uuid references public.profiles(id) on delete set null
);

alter table public.contacts enable row level security;

-- Contacts policies - users can see all contacts
create policy "contacts_select_all"
  on public.contacts for select
  using (auth.uid() is not null);

create policy "contacts_insert_authenticated"
  on public.contacts for insert
  with check (auth.uid() is not null);

create policy "contacts_update_authenticated"
  on public.contacts for update
  using (auth.uid() is not null);

create policy "contacts_delete_authenticated"
  on public.contacts for delete
  using (auth.uid() is not null);

-- Create activities table
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.contacts(id) on delete cascade,
  type text not null check (type in ('call', 'whatsapp', 'email', 'note', 'meeting')),
  subject text,
  description text not null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

alter table public.activities enable row level security;

-- Activities policies
create policy "activities_select_all"
  on public.activities for select
  using (auth.uid() is not null);

create policy "activities_insert_authenticated"
  on public.activities for insert
  with check (auth.uid() is not null);

create policy "activities_update_authenticated"
  on public.activities for update
  using (auth.uid() is not null);

create policy "activities_delete_authenticated"
  on public.activities for delete
  using (auth.uid() is not null);

-- Create products table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  unit text not null check (unit in ('liter', 'kilo')),
  dilution_ratio text,
  base_price_ars numeric(10, 2),
  base_price_usd numeric(10, 2),
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.products enable row level security;

-- Products policies - everyone can read, only admins can modify
create policy "products_select_all"
  on public.products for select
  using (auth.uid() is not null);

create policy "products_insert_admin"
  on public.products for insert
  with check (
    auth.uid() in (
      select id from public.profiles where role = 'admin'
    )
  );

create policy "products_update_admin"
  on public.products for update
  using (
    auth.uid() in (
      select id from public.profiles where role = 'admin'
    )
  );

create policy "products_delete_admin"
  on public.products for delete
  using (
    auth.uid() in (
      select id from public.profiles where role = 'admin'
    )
  );

-- Create deals table
create table if not exists public.deals (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.contacts(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  quantity numeric(10, 2) not null,
  unit_price numeric(10, 2) not null,
  currency text not null check (currency in ('ARS', 'USD')),
  total_amount numeric(10, 2) not null,
  status text not null default 'pending' check (status in ('pending', 'won', 'lost')),
  notes text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.deals enable row level security;

-- Deals policies
create policy "deals_select_all"
  on public.deals for select
  using (auth.uid() is not null);

create policy "deals_insert_authenticated"
  on public.deals for insert
  with check (auth.uid() is not null);

create policy "deals_update_authenticated"
  on public.deals for update
  using (auth.uid() is not null);

create policy "deals_delete_authenticated"
  on public.deals for delete
  using (auth.uid() is not null);

-- Create indexes for better performance
create index if not exists idx_contacts_stage on public.contacts(stage);
create index if not exists idx_contacts_assigned_to on public.contacts(assigned_to);
create index if not exists idx_activities_contact_id on public.activities(contact_id);
create index if not exists idx_activities_created_at on public.activities(created_at desc);
create index if not exists idx_deals_contact_id on public.deals(contact_id);
create index if not exists idx_deals_status on public.deals(status);
