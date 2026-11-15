create or replace function public.create_channel(channel_name text, make_private boolean default false)
returns table(id uuid, name text, is_private boolean, created_by uuid)
language plpgsql
security definer
set search_path = ''
as $function$
declare
  current_user_id uuid := auth.uid();
  clean_name text := btrim(channel_name);
  new_channel_id uuid;
begin
  if current_user_id is null then
    raise exception 'Sign in required';
  end if;
  if clean_name is null or char_length(clean_name) < 1 or char_length(clean_name) > 40 then
    raise exception 'Channel name must be between 1 and 40 characters';
  end if;
  insert into public.channels(name, is_private, created_by)
  values (clean_name, coalesce(make_private, false), current_user_id)
  returning channels.id into new_channel_id;
  insert into public.channel_members(channel_id, user_id)
  values (new_channel_id, current_user_id)
  on conflict do nothing;
  return query
    select c.id, c.name, c.is_private, c.created_by
    from public.channels as c
    where c.id = new_channel_id;
end;
$function$;
revoke all on function public.create_channel(text, boolean) from public;
revoke all on function public.create_channel(text, boolean) from anon;
grant execute on function public.create_channel(text, boolean) to authenticated;
