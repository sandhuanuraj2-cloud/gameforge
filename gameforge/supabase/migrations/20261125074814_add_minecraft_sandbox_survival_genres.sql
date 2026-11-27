-- Minecraft has several meaningful genres; RPG remains its primary classification.
insert into public.game_genres (game_id, genre_id, is_primary)
select gc.id, g.id, false
from public.game_catalog gc
join public.genre_catalog g on g.slug in ('sandbox', 'survival')
where gc.slug = 'minecraft'
on conflict (game_id, genre_id) do nothing;
