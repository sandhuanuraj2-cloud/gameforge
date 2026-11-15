-- Indexes for foreign-key lookups used by community moderation and knowledge queries.
create index if not exists game_entity_submissions_game_id_idx on public.game_entity_submissions(game_id);
create index if not exists game_entity_submissions_submitted_by_idx on public.game_entity_submissions(submitted_by);
create index if not exists game_guide_submissions_game_id_idx on public.game_guide_submissions(game_id);
create index if not exists game_guide_submissions_submitted_by_idx on public.game_guide_submissions(submitted_by);
create index if not exists game_guides_created_by_idx on public.game_guides(created_by);
