-- GAMEFORGE administrator access and moderated community knowledge publishing.
create table if not exists public.gameforge_admins (
 user_id uuid primary key references auth.users(id) on delete cascade,
 role text not null default 'admin' check (role in ('admin','moderator')),
 created_at timestamptz not null default now()
);
alter table public.gameforge_admins enable row level security;
revoke all on public.gameforge_admins from anon, authenticated;
grant select on public.gameforge_admins to authenticated;
drop policy if exists "Admins can read own role" on public.gameforge_admins;
create policy "Admins can read own role" on public.gameforge_admins for select to authenticated using(user_id=(select auth.uid()));
drop policy if exists "Admins can read entity submissions" on public.game_entity_submissions;
create policy "Admins can read entity submissions" on public.game_entity_submissions for select to authenticated using(exists(select 1 from public.gameforge_admins a where a.user_id=(select auth.uid())));
drop policy if exists "Admins can update entity submissions" on public.game_entity_submissions;
create policy "Admins can update entity submissions" on public.game_entity_submissions for update to authenticated using(exists(select 1 from public.gameforge_admins a where a.user_id=(select auth.uid()))) with check(exists(select 1 from public.gameforge_admins a where a.user_id=(select auth.uid())));
drop policy if exists "Admins can read guide submissions" on public.game_guide_submissions;
create policy "Admins can read guide submissions" on public.game_guide_submissions for select to authenticated using(exists(select 1 from public.gameforge_admins a where a.user_id=(select auth.uid())));
drop policy if exists "Admins can update guide submissions" on public.game_guide_submissions;
create policy "Admins can update guide submissions" on public.game_guide_submissions for update to authenticated using(exists(select 1 from public.gameforge_admins a where a.user_id=(select auth.uid()))) with check(exists(select 1 from public.gameforge_admins a where a.user_id=(select auth.uid())));
drop policy if exists "Admins can insert game entities" on public.game_entities;
create policy "Admins can insert game entities" on public.game_entities for insert to authenticated with check(exists(select 1 from public.gameforge_admins a where a.user_id=(select auth.uid())));
drop policy if exists "Admins can update game entities" on public.game_entities;
create policy "Admins can update game entities" on public.game_entities for update to authenticated using(exists(select 1 from public.gameforge_admins a where a.user_id=(select auth.uid()))) with check(exists(select 1 from public.gameforge_admins a where a.user_id=(select auth.uid())));
drop policy if exists "Admins can insert game guides" on public.game_guides;
create policy "Admins can insert game guides" on public.game_guides for insert to authenticated with check(exists(select 1 from public.gameforge_admins a where a.user_id=(select auth.uid())));
drop policy if exists "Admins can update game guides" on public.game_guides;
create policy "Admins can update game guides" on public.game_guides for update to authenticated using(exists(select 1 from public.gameforge_admins a where a.user_id=(select auth.uid()))) with check(exists(select 1 from public.gameforge_admins a where a.user_id=(select auth.uid())));
create or replace function public.review_game_entity_submission(p_submission_id uuid,p_decision text)
returns void language plpgsql security invoker set search_path = ''
as $$
declare s public.game_entity_submissions%rowtype;
begin
 if (select auth.uid()) is null or not exists(select 1 from public.gameforge_admins a where a.user_id=(select auth.uid())) then raise exception 'Administrator access required'; end if;
 if p_decision not in ('approved','rejected') then raise exception 'Invalid decision'; end if;
 select * into s from public.game_entity_submissions where id=p_submission_id for update;
 if not found or s.review_status <> 'pending' then raise exception 'Submission not found or already reviewed'; end if;
 if p_decision='approved' then
  insert into public.game_entities(game_id,slug,name,entity_type,role,abilities,equipment,counters,notes,game_version,source_url,source_status,status)
  values(s.game_id,regexp_replace(lower(trim(s.name)),'[^a-z0-9]+','-','g')||'-'||left(s.id::text,8),s.name,s.entity_type,nullif(s.content->>'role',''),
   coalesce(s.content->'abilities','[]'::jsonb),coalesce(s.content->'equipment','[]'::jsonb),coalesce(s.content->'counters','[]'::jsonb),nullif(s.content->>'notes',''),
   s.claimed_game_version,s.source_url,'community-submitted','published');
 end if;
 update public.game_entity_submissions set review_status=p_decision where id=s.id;
end; $$;
create or replace function public.review_game_guide_submission(p_submission_id uuid,p_decision text)
returns void language plpgsql security invoker set search_path = ''
as $$
declare s public.game_guide_submissions%rowtype; v_kind text;
begin
 if (select auth.uid()) is null or not exists(select 1 from public.gameforge_admins a where a.user_id=(select auth.uid())) then raise exception 'Administrator access required'; end if;
 if p_decision not in ('approved','rejected') then raise exception 'Invalid decision'; end if;
 select * into s from public.game_guide_submissions where id=p_submission_id for update;
 if not found or s.review_status <> 'pending' then raise exception 'Submission not found or already reviewed'; end if;
 if p_decision='approved' then
  v_kind:=case when s.kind in ('hero-build','strategy','counter','economy','progression','crafting','market','team-composition') then s.kind else 'strategy' end;
  insert into public.game_guides(game_id,slug,title,kind,summary,body,status,source_status,created_by)
  values(s.game_id,regexp_replace(lower(trim(s.title)),'[^a-z0-9]+','-','g')||'-'||left(s.id::text,8),s.title,v_kind,
   coalesce(nullif(s.content->>'summary',''),'Community submitted guide'),coalesce(s.content->'body',s.content),'published','community-submitted',s.submitted_by);
 end if;
 update public.game_guide_submissions set review_status=p_decision where id=s.id;
end; $$;
revoke all on function public.review_game_entity_submission(uuid,text) from public,anon;
revoke all on function public.review_game_guide_submission(uuid,text) from public,anon;
grant execute on function public.review_game_entity_submission(uuid,text) to authenticated;
grant execute on function public.review_game_guide_submission(uuid,text) to authenticated;
