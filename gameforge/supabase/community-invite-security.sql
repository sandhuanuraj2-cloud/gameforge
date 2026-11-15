-- Apply in Supabase SQL Editor for projects that already ran community-schema.sql.
-- Keep invite_code out of all authenticated table reads; owners retrieve it via RPC.

revoke select on table public.channels from public, anon, authenticated;
grant select (id, name, is_private, created_by, created_at)
  on table public.channels to authenticated;

create or replace function public.get_channel_invite_code(channel_uuid uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  invite text;
begin
  if auth.uid() is null then
    raise exception 'Sign in required';
  end if;

  select c.invite_code into invite
  from public.channels c
  where c.id = channel_uuid
    and c.created_by = (select auth.uid())
    and c.is_private = true;

  if invite is null then
    raise exception 'Only the private-channel owner can retrieve its invite code';
  end if;

  return invite;
end;
$$;

revoke all on function public.get_channel_invite_code(uuid) from public, anon;
grant execute on function public.get_channel_invite_code(uuid) to authenticated;
