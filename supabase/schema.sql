begin;
create table if not exists public.learning_progress (
 user_id uuid primary key references auth.users(id) on delete cascade,
 done jsonb not null default '[]'::jsonb check(jsonb_typeof(done)='array'),
 lab boolean not null default false,
 achievements jsonb not null default '{}'::jsonb,
 updated_at timestamptz not null default now()
);
create table if not exists public.study_files (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 name text not null check(char_length(name) between 1 and 60),
 content text not null check(char_length(content)<=10000),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique(user_id,name)
);
create index if not exists study_files_owner on public.study_files(user_id);
create table if not exists public.simulation_history (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 module text not null check(module in ('cpu','memory','paging')),
 config jsonb not null,
 summary jsonb not null,
 created_at timestamptz not null default now()
);
create index if not exists simulation_history_owner on public.simulation_history(user_id,created_at desc);
alter table public.learning_progress enable row level security;
alter table public.study_files enable row level security;
alter table public.simulation_history enable row level security;
create policy own_progress on public.learning_progress for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy own_files on public.study_files for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy own_history on public.simulation_history for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
grant usage on schema public to authenticated;
grant select,insert,update,delete on public.learning_progress,public.study_files,public.simulation_history to authenticated;
revoke all on public.learning_progress,public.study_files,public.simulation_history from anon;
commit;
