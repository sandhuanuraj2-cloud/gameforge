-- Add the first verified FPS catalogue entries.
-- Keep genre links normalized in game_genres; do not use game_catalog.genre.
-- Shooter is the parent classification; FPS is the specific primary classification.
-- Call of Duty: Mobile also has a Battle Royale mode, so it receives that secondary tag.

insert into public.game_catalog (slug, name, platforms)
values
  ('counter-strike-2', 'Counter-Strike 2', array['Windows', 'Linux']::text[]),
  ('valorant', 'VALORANT', array['PC', 'PlayStation', 'Xbox']::text[]),
  ('call-of-duty-mobile', 'Call of Duty: Mobile', array['Android', 'iOS']::text[])
on conflict (slug) do update
set
  name = excluded.name,
  platforms = excluded.platforms;

insert into public.game_genres (game_id, genre_id, is_primary)
select
  g.id,
  gc.id,
  (gc.slug = 'fps') as is_primary
from public.game_catalog g
cross join public.genre_catalog gc
where g.slug in ('counter-strike-2', 'valorant', 'call-of-duty-mobile')
  and gc.slug in ('shooter', 'fps')
on conflict (game_id, genre_id) do update
set is_primary = excluded.is_primary;

insert into public.game_genres (game_id, genre_id, is_primary)
select
  g.id,
  gc.id,
  false
from public.game_catalog g
join public.genre_catalog gc on gc.slug = 'battle-royale'
where g.slug = 'call-of-duty-mobile'
on conflict (game_id, genre_id) do update
set is_primary = excluded.is_primary;
