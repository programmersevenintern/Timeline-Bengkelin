create table if not exists public.marketing_app_state (
  id text primary key check (id = 'shared'),
  data jsonb not null default '{
    "activities": [],
    "workshops": [],
    "evaluations": [],
    "socialAccounts": []
  }'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.marketing_app_state enable row level security;

drop policy if exists "Authenticated team members can read shared state"
  on public.marketing_app_state;
create policy "Authenticated team members can read shared state"
  on public.marketing_app_state for select to authenticated
  using (id = 'shared');

drop policy if exists "Authenticated team members can create shared state"
  on public.marketing_app_state;
create policy "Authenticated team members can create shared state"
  on public.marketing_app_state for insert to authenticated
  with check (id = 'shared');

drop policy if exists "Authenticated team members can update shared state"
  on public.marketing_app_state;
create policy "Authenticated team members can update shared state"
  on public.marketing_app_state for update to authenticated
  using (id = 'shared')
  with check (id = 'shared');

grant select, insert, update on public.marketing_app_state to authenticated;
revoke all on public.marketing_app_state from anon;
