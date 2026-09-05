-- ============================================================
-- Chrono — Esquema inicial
-- Crea las tablas y habilita Row Level Security (RLS)
-- ============================================================

-- ---------- CLIENTS ----------
create table if not exists public.clients (
  id bigint primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  contact text not null default '',
  email text not null default '',
  color text,
  total_billed numeric not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- PROJECTS ----------
create table if not exists public.projects (
  id bigint primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  client_id bigint,
  client_name text not null default '',
  status text not null default 'Pendiente',
  priority text not null default 'Media',
  color text,
  budget numeric not null default 0,
  deadline text not null default '',
  hours_tracked bigint not null default 0,
  hourly_rate numeric not null default 50,
  tasks jsonb not null default '[]',
  created_at timestamptz not null default now()
);

-- ---------- INVOICES ----------
create table if not exists public.invoices (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  number text not null,
  client_id bigint,
  client_name text not null default '',
  amount numeric not null default 0,
  issue_date text not null default '',
  due_date text not null default '',
  status text not null default 'Pendiente',
  created_at timestamptz not null default now()
);

-- ---------- TIME ENTRIES ----------
create table if not exists public.time_entries (
  id bigint primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  project_id bigint not null,
  seconds bigint not null default 0,
  entry_date text not null default '',
  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- Cada usuario solo puede ver y modificar sus propios datos.
-- auth.uid() es el id del usuario autenticado (JWT).
-- ============================================================

alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.invoices enable row level security;
alter table public.time_entries enable row level security;

-- CLIENTS policies
create policy "select own clients" on public.clients
  for select using (auth.uid() = user_id);
create policy "insert own clients" on public.clients
  for insert with check (auth.uid() = user_id);
create policy "update own clients" on public.clients
  for update using (auth.uid() = user_id);
create policy "delete own clients" on public.clients
  for delete using (auth.uid() = user_id);

-- PROJECTS policies
create policy "select own projects" on public.projects
  for select using (auth.uid() = user_id);
create policy "insert own projects" on public.projects
  for insert with check (auth.uid() = user_id);
create policy "update own projects" on public.projects
  for update using (auth.uid() = user_id);
create policy "delete own projects" on public.projects
  for delete using (auth.uid() = user_id);

-- INVOICES policies
create policy "select own invoices" on public.invoices
  for select using (auth.uid() = user_id);
create policy "insert own invoices" on public.invoices
  for insert with check (auth.uid() = user_id);
create policy "update own invoices" on public.invoices
  for update using (auth.uid() = user_id);
create policy "delete own invoices" on public.invoices
  for delete using (auth.uid() = user_id);

-- TIME ENTRIES policies
create policy "select own time entries" on public.time_entries
  for select using (auth.uid() = user_id);
create policy "insert own time entries" on public.time_entries
  for insert with check (auth.uid() = user_id);
create policy "update own time entries" on public.time_entries
  for update using (auth.uid() = user_id);
create policy "delete own time entries" on public.time_entries
  for delete using (auth.uid() = user_id);