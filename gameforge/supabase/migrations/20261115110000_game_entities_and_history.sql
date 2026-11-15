-- GAMEFORGE character, item and patch-history expansion.
create table if not exists public.game_entities (
 id uuid primary key default gen_random_uuid(),
 game_id uuid not null references public.game_catalog(id) on delete cascade,
 slug text not null, name text not null,
 entity_type text not null check (entity_type in ('hero','character','weapon','item','boss','class')),
 role text, abilities jsonb not null default '[]'::jsonb,
 equipment jsonb not null default '[]'::jsonb, counters jsonb not null default '[]'::jsonb,
 notes text, game_version text, source_url text,
 source_status text not null default 'editorial-framework' check (source_status in ('editorial-framework','community-submitted','source-verified')),
 status text not null default 'published' check (status in ('draft','published','archived')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 unique(game_id,slug)
);
create table if not exists public.game_entity_versions (
 id uuid primary key default gen_random_uuid(),
 entity_id uuid not null references public.game_entities(id) on delete cascade,
 game_version text not null, patch_label text, patch_date date,
 is_historical boolean not null default false, snapshot jsonb not null default '{}'::jsonb,
 source_url text, verified_at timestamptz, created_at timestamptz not null default now()
);
create table if not exists public.game_entity_submissions (
 id uuid primary key default gen_random_uuid(),
 game_id uuid not null references public.game_catalog(id) on delete cascade,
 submitted_by uuid not null references auth.users(id) on delete cascade,
 entity_type text not null, name text not null check(char_length(name) between 2 and 100),
 content jsonb not null, claimed_game_version text, source_url text,
 review_status text not null default 'pending' check(review_status in ('pending','approved','rejected')),
 created_at timestamptz not null default now()
);
create index if not exists game_entities_game_type_idx on public.game_entities(game_id,entity_type,status);
create index if not exists game_entity_versions_entity_date_idx on public.game_entity_versions(entity_id,patch_date desc);
create index if not exists game_entity_submissions_review_idx on public.game_entity_submissions(review_status,created_at desc);
alter table public.game_entities enable row level security;
alter table public.game_entity_versions enable row level security;
alter table public.game_entity_submissions enable row level security;
drop policy if exists "Public can read published game entities" on public.game_entities;
create policy "Public can read published game entities" on public.game_entities for select using(status='published');
drop policy if exists "Public can read published entity versions" on public.game_entity_versions;
create policy "Public can read published entity versions" on public.game_entity_versions for select using(exists(select 1 from public.game_entities e where e.id=entity_id and e.status='published'));
drop policy if exists "Users can submit game entities" on public.game_entity_submissions;
create policy "Users can submit game entities" on public.game_entity_submissions for insert to authenticated with check(submitted_by=(select auth.uid()));
drop policy if exists "Users can view own entity submissions" on public.game_entity_submissions;
create policy "Users can view own entity submissions" on public.game_entity_submissions for select to authenticated using(submitted_by=(select auth.uid()));
revoke all on public.game_entities,public.game_entity_versions,public.game_entity_submissions from anon,authenticated;
grant select on public.game_entities,public.game_entity_versions to anon,authenticated;
grant insert,select on public.game_entity_submissions to authenticated;
