-- Combine submitter and moderator SELECT access into a single permissive policy per table.
drop policy if exists "Users can view own entity submissions" on public.game_entity_submissions;
drop policy if exists "Admins can read entity submissions" on public.game_entity_submissions;
create policy "Submitters and admins can read entity submissions" on public.game_entity_submissions for select to authenticated
using(submitted_by=(select auth.uid()) or exists(select 1 from public.gameforge_admins a where a.user_id=(select auth.uid())));
drop policy if exists "Users can view own guide submissions" on public.game_guide_submissions;
drop policy if exists "Admins can read guide submissions" on public.game_guide_submissions;
create policy "Submitters and admins can read guide submissions" on public.game_guide_submissions for select to authenticated
using(submitted_by=(select auth.uid()) or exists(select 1 from public.gameforge_admins a where a.user_id=(select auth.uid())));
