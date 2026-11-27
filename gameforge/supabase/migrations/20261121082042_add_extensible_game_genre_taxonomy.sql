-- Reconcile the extensible genre taxonomy already applied to Supabase.
-- This migration is intentionally idempotent so a fresh database can recreate the current schema.

create table if not exists public.genre_catalog (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null unique,
  parent_id uuid references public.genre_catalog(id) on delete set null,
  description text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.game_genres (
  game_id uuid not null references public.game_catalog(id) on delete cascade,
  genre_id uuid not null references public.genre_catalog(id) on delete restrict,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (game_id, genre_id)
);

create index if not exists game_genres_genre_id_idx
  on public.game_genres (genre_id);

create unique index if not exists game_genres_one_primary_per_game
  on public.game_genres (game_id)
  where is_primary = true;

alter table public.genre_catalog enable row level security;
alter table public.game_genres enable row level security;

drop policy if exists "Public can read genre catalog" on public.genre_catalog;
create policy "Public can read genre catalog"
  on public.genre_catalog for select to anon, authenticated using (true);

drop policy if exists "Admins can manage genre catalog" on public.genre_catalog;
create policy "Admins can manage genre catalog"
  on public.genre_catalog for all to authenticated
  using (exists (
    select 1 from public.gameforge_admins a
    where a.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.gameforge_admins a
    where a.user_id = (select auth.uid())
  ));

drop policy if exists "Public can read game genres" on public.game_genres;
create policy "Public can read game genres"
  on public.game_genres for select to anon, authenticated using (true);

drop policy if exists "Admins can manage game genres" on public.game_genres;
create policy "Admins can manage game genres"
  on public.game_genres for all to authenticated
  using (exists (
    select 1 from public.gameforge_admins a
    where a.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.gameforge_admins a
    where a.user_id = (select auth.uid())
  ));

revoke all on public.genre_catalog, public.game_genres from anon;
revoke all on public.genre_catalog, public.game_genres from authenticated;
grant select on public.genre_catalog, public.game_genres to anon, authenticated;
grant insert, update, delete on public.genre_catalog, public.game_genres to authenticated;
grant all on public.genre_catalog, public.game_genres to service_role;

-- Seed the top-level genres first so child rows can reference their parents.
with genre_seed(slug, name, parent_slug, sort_order) as (
  values
    ('action', 'Action', null, 10),
    ('adventure', 'Adventure', null, 20),
    ('rpg', 'Role-Playing (RPG)', null, 30),
    ('strategy', 'Strategy', null, 40),
    ('simulation', 'Simulation', null, 50),
    ('sports', 'Sports', null, 60),
    ('racing', 'Racing', null, 70),
    ('fighting', 'Fighting', null, 80),
    ('shooter', 'Shooter', null, 90),
    ('moba', 'MOBA', null, 100),
    ('puzzle', 'Puzzle', null, 110),
    ('horror', 'Horror', null, 120),
    ('survival', 'Survival', null, 130),
    ('sandbox', 'Sandbox', null, 140),
    ('platformer', 'Platformer', null, 150),
    ('rhythm', 'Rhythm', null, 160),
    ('card-deckbuilder', 'Card & Deckbuilder', null, 170),
    ('party', 'Party', null, 180),
    ('educational', 'Educational', null, 190),
    ('mmo', 'Massively Multiplayer Online (MMO)', null, 200)
)
insert into public.genre_catalog (slug, name, parent_id, sort_order)
select s.slug, s.name, null, s.sort_order
from genre_seed s
on conflict (slug) do update
set name = excluded.name, sort_order = excluded.sort_order;

with genre_seed(slug, name, parent_slug, sort_order) as (
  values
    ('arpg', 'Action RPG', 'rpg', 10),
    ('mmorpg', 'MMORPG', 'rpg', 20),
    ('tactical-rpg', 'Tactical RPG', 'rpg', 30),
    ('jrpg', 'JRPG', 'rpg', 40),
    ('crpg', 'CRPG', 'rpg', 50),
    ('rts', 'Real-Time Strategy (RTS)', 'strategy', 60),
    ('turn-based-strategy', 'Turn-Based Strategy', 'strategy', 70),
    ('4x-strategy', '4X Strategy', 'strategy', 80),
    ('tower-defense', 'Tower Defense', 'strategy', 90),
    ('fps', 'First-Person Shooter (FPS)', 'shooter', 100),
    ('tps', 'Third-Person Shooter (TPS)', 'shooter', 110),
    ('battle-royale', 'Battle Royale', 'shooter', 120),
    ('hero-shooter', 'Hero Shooter', 'shooter', 130),
    ('extraction-shooter', 'Extraction Shooter', 'shooter', 140),
    ('life-sim', 'Life Simulation', 'simulation', 150),
    ('city-builder', 'City Builder', 'simulation', 160),
    ('vehicle-sim', 'Vehicle Simulation', 'simulation', 170),
    ('farming-sim', 'Farming Simulation', 'simulation', 180),
    ('metroidvania', 'Metroidvania', 'action', 190),
    ('visual-novel', 'Visual Novel', 'adventure', 200),
    ('roguelike', 'Roguelike', 'action', 210),
    ('roguelite', 'Roguelite', 'action', 220)
)
insert into public.genre_catalog (slug, name, parent_id, sort_order)
select s.slug, s.name, p.id, s.sort_order
from genre_seed s
join public.genre_catalog p on p.slug = s.parent_slug
on conflict (slug) do update
set name = excluded.name, parent_id = excluded.parent_id, sort_order = excluded.sort_order;

-- Seed the initial primary genre for each existing game.
with game_genre_seed(game_slug, genre_slug) as (
  values
    ('albion-online', 'mmorpg'),
    ('arena-of-valor', 'moba'),
    ('black-desert', 'mmorpg'),
    ('diablo-iv', 'arpg'),
    ('dota-2', 'moba'),
    ('elden-ring', 'rpg'),
    ('final-fantasy-xiv', 'mmorpg'),
    ('genshin-impact', 'rpg'),
    ('heroes-of-the-storm', 'moba'),
    ('honor-of-kings', 'moba'),
    ('league-of-legends', 'moba'),
    ('lost-ark', 'mmorpg'),
    ('minecraft', 'rpg'),
    ('mobile-legends', 'moba'),
    ('monster-hunter-wilds', 'rpg'),
    ('path-of-exile', 'arpg'),
    ('path-of-exile-2', 'arpg'),
    ('pokemon-unite', 'moba'),
    ('runescape', 'mmorpg'),
    ('smite-2', 'moba'),
    ('stardew-valley', 'rpg'),
    ('toram-online', 'mmorpg'),
    ('tower-of-fantasy', 'rpg'),
    ('warframe', 'rpg'),
    ('wild-rift', 'moba'),
    ('world-of-warcraft', 'mmorpg')
)
insert into public.game_genres (game_id, genre_id, is_primary)
select gc.id, g.id, true
from game_genre_seed s
join public.game_catalog gc on gc.slug = s.game_slug
join public.genre_catalog g on g.slug = s.genre_slug
on conflict (game_id, genre_id) do update
set is_primary = excluded.is_primary;
