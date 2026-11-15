-- GAMEFORGE searchable knowledge catalog.
-- Apply in Supabase SQL Editor after reviewing. This migration is not executed by this commit.
create extension if not exists pgcrypto;

create table if not exists public.game_catalog (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  genre text not null check (genre in ('MOBA','RPG','MMORPG','ARPG')),
  platforms text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.game_guides (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.game_catalog(id) on delete cascade,
  slug text not null unique,
  title text not null,
  kind text not null check (kind in ('hero-build','strategy','counter','economy','progression','crafting','market','team-composition')),
  summary text not null,
  body jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  source_status text not null default 'editorial-framework' check (source_status in ('editorial-framework','community-submitted','source-verified')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.game_guide_versions (
  id uuid primary key default gen_random_uuid(),
  guide_id uuid not null references public.game_guides(id) on delete cascade,
  game_version text not null,
  patch_label text,
  patch_date date,
  is_historical boolean not null default false,
  build_data jsonb not null default '{}'::jsonb,
  source_url text,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  unique (guide_id, game_version, patch_label)
);

create table if not exists public.game_guide_submissions (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.game_catalog(id) on delete cascade,
  submitted_by uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 120),
  kind text not null,
  content jsonb not null,
  claimed_game_version text,
  source_url text,
  review_status text not null default 'pending' check (review_status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

create index if not exists game_guides_game_status_idx on public.game_guides(game_id,status,kind);
create index if not exists game_guide_versions_guide_date_idx on public.game_guide_versions(guide_id,patch_date desc);
create index if not exists game_guide_submissions_review_idx on public.game_guide_submissions(review_status,created_at desc);

alter table public.game_catalog enable row level security;
alter table public.game_guides enable row level security;
alter table public.game_guide_versions enable row level security;
alter table public.game_guide_submissions enable row level security;

drop policy if exists "Public can read game catalog" on public.game_catalog;
create policy "Public can read game catalog" on public.game_catalog for select using (true);
drop policy if exists "Public can read published guides" on public.game_guides;
create policy "Public can read published guides" on public.game_guides for select using (status='published');
drop policy if exists "Public can read published guide versions" on public.game_guide_versions;
create policy "Public can read published guide versions" on public.game_guide_versions for select using (
  exists(select 1 from public.game_guides g where g.id=guide_id and g.status='published')
);
drop policy if exists "Users can submit guides" on public.game_guide_submissions;
create policy "Users can submit guides" on public.game_guide_submissions for insert to authenticated
with check (submitted_by=(select auth.uid()));
drop policy if exists "Users can view own guide submissions" on public.game_guide_submissions;
create policy "Users can view own guide submissions" on public.game_guide_submissions for select to authenticated
using (submitted_by=(select auth.uid()));

revoke all on public.game_catalog, public.game_guides, public.game_guide_versions, public.game_guide_submissions from anon, authenticated;
grant select on public.game_catalog to anon, authenticated;
grant select on public.game_guides, public.game_guide_versions to anon, authenticated;
grant insert, select on public.game_guide_submissions to authenticated;

-- Seed game catalog. Guide publication and historical version records require editorial verification.
insert into public.game_catalog(slug,name,genre,platforms) values
('mobile-legends','Mobile Legends: Bang Bang','MOBA',array['Android','iOS']),
('honor-of-kings','Honor of Kings','MOBA',array['Android','iOS']),
('wild-rift','League of Legends: Wild Rift','MOBA',array['Android','iOS']),
('dota-2','Dota 2','MOBA',array['PC']),
('pokemon-unite','Pokémon UNITE','MOBA',array['Android','iOS','Nintendo Switch']),
('league-of-legends','League of Legends','MOBA',array['PC']),
('smite-2','SMITE 2','MOBA',array['PC','Console']),
('arena-of-valor','Arena of Valor','MOBA',array['Android','iOS','Nintendo Switch']),
('heroes-of-the-storm','Heroes of the Storm','MOBA',array['PC']),
('albion-online','Albion Online','MMORPG',array['PC','Android','iOS']),
('genshin-impact','Genshin Impact','RPG',array['PC','PlayStation','Android','iOS']),
('black-desert','Black Desert Online','MMORPG',array['PC','Console']),
('runescape','RuneScape','MMORPG',array['PC','Mobile']),
('toram-online','Toram Online','MMORPG',array['PC','Android','iOS']),
('world-of-warcraft','World of Warcraft','MMORPG',array['PC']),
('path-of-exile','Path of Exile','ARPG',array['PC','Console']),
('path-of-exile-2','Path of Exile 2','ARPG',array['PC','Console']),
('diablo-iv','Diablo IV','ARPG',array['PC','Console']),
('final-fantasy-xiv','Final Fantasy XIV','MMORPG',array['PC','PlayStation','Xbox']),
('lost-ark','Lost Ark','MMORPG',array['PC']),
('warframe','Warframe','RPG',array['PC','Console','Android','iOS']),
('tower-of-fantasy','Tower of Fantasy','RPG',array['PC','Android','iOS']),
('monster-hunter-wilds','Monster Hunter Wilds','RPG',array['PC','PlayStation','Xbox']),
('elden-ring','Elden Ring','RPG',array['PC','PlayStation','Xbox']),
('minecraft','Minecraft','RPG',array['PC','Console','Mobile']),
('stardew-valley','Stardew Valley','RPG',array['PC','Console','Mobile'])
on conflict(slug) do update set name=excluded.name,genre=excluded.genre,platforms=excluded.platforms;
