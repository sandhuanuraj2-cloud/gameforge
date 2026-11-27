-- Remove the obsolete four-value limit from the legacy single-genre column.
-- The normalized many-to-many relationship is public.game_genres.
-- Keep the old column temporarily for compatibility; it is no longer read by the app.

alter table public.game_catalog
  drop constraint if exists game_catalog_genre_check;

alter table public.game_catalog
  alter column genre drop not null;

comment on column public.game_catalog.genre is
  'Deprecated compatibility field. Use public.game_genres and public.genre_catalog for all genre classification.';
