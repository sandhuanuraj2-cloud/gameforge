-- GAMEFORGE player profiles. Safe additive migration.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null check (char_length(username) between 3 and 24 and username ~ '^[A-Za-z0-9_]+$'),
  display_name text not null check (char_length(display_name) between 1 and 40),
  avatar_url text,
  bio text not null default '' check (char_length(bio) <= 160),
  updated_at timestamptz not null default now()
);
create unique index if not exists profiles_username_lower_uidx on public.profiles (lower(username));
alter table public.profiles enable row level security;
drop policy if exists "Authenticated users can view player profiles" on public.profiles;
create policy "Authenticated users can view player profiles" on public.profiles for select to authenticated using (true);
drop policy if exists "Players can create their own profile" on public.profiles;
create policy "Players can create their own profile" on public.profiles for insert to authenticated with check (id = (select auth.uid()));
drop policy if exists "Players can update their own profile" on public.profiles;
create policy "Players can update their own profile" on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
revoke all on table public.profiles from public, anon, authenticated;
grant select on table public.profiles to authenticated;
grant insert (id, username, display_name, avatar_url, bio, updated_at) on public.profiles to authenticated;
grant update (username, display_name, avatar_url, bio, updated_at) on public.profiles to authenticated;
