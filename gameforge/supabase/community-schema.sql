-- Run in Supabase Dashboard → SQL Editor
create extension if not exists pgcrypto;
create table if not exists public.channels(
 id uuid primary key default gen_random_uuid(),
 name text not null check(char_length(name) between 1 and 40),
 is_private boolean not null default false,
 invite_code text not null unique default encode(gen_random_bytes(12),'hex'),
 created_by uuid not null references auth.users(id) on delete cascade,
 created_at timestamptz not null default now()
);
create table if not exists public.channel_members(
 channel_id uuid not null references public.channels(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 joined_at timestamptz not null default now(),
 primary key(channel_id,user_id)
);
create table if not exists public.messages(
 id uuid primary key default gen_random_uuid(),
 channel_id uuid not null references public.channels(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 content text not null check(char_length(content) between 1 and 2000),
 created_at timestamptz not null default now()
);
create index if not exists messages_channel_created_idx on public.messages(channel_id,created_at);
alter table public.channels enable row level security;
alter table public.channel_members enable row level security;
alter table public.messages enable row level security;
create policy "Read visible channels" on public.channels for select to authenticated using(
 not is_private or created_by=auth.uid() or exists(select 1 from public.channel_members m where m.channel_id=id and m.user_id=auth.uid())
);
create policy "Create own channels" on public.channels for insert to authenticated with check(created_by=auth.uid());
create policy "Owners update channels" on public.channels for update to authenticated using(created_by=auth.uid()) with check(created_by=auth.uid());
create policy "Read memberships" on public.channel_members for select to authenticated using(
 user_id=auth.uid() or exists(select 1 from public.channels c where c.id=channel_id and (not c.is_private or c.created_by=auth.uid()))
);
create policy "Join public or own channels" on public.channel_members for insert to authenticated with check(
 user_id=auth.uid() and exists(select 1 from public.channels c where c.id=channel_id and (not c.is_private or c.created_by=auth.uid()))
);
create policy "Read allowed messages" on public.messages for select to authenticated using(
 exists(select 1 from public.channels c where c.id=channel_id and (not c.is_private or c.created_by=auth.uid() or exists(select 1 from public.channel_members m where m.channel_id=c.id and m.user_id=auth.uid())))
);
create policy "Send allowed messages" on public.messages for insert to authenticated with check(
 user_id=auth.uid() and exists(select 1 from public.channels c where c.id=channel_id and (not c.is_private or c.created_by=auth.uid() or exists(select 1 from public.channel_members m where m.channel_id=c.id and m.user_id=auth.uid())))
);
create or replace function public.join_channel_by_invite(invite text) returns uuid language plpgsql security definer set search_path=public as $$
declare channel_uuid uuid;
begin
 if auth.uid() is null then raise exception 'Sign in required'; end if;
 select id into channel_uuid from public.channels where invite_code=invite and is_private=true;
 if channel_uuid is null then raise exception 'Invite code not found'; end if;
 insert into public.channel_members(channel_id,user_id) values(channel_uuid,auth.uid()) on conflict do nothing;
 return channel_uuid;
end; $$;
grant execute on function public.join_channel_by_invite(text) to authenticated;
alter publication supabase_realtime add table public.messages;