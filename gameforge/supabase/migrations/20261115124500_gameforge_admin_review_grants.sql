-- Required table privileges for SECURITY INVOKER moderation RPCs. RLS restricts these operations to registered GAMEFORGE admins.
grant select,insert,update on public.game_entities,public.game_guides to authenticated;
grant select,update on public.game_entity_submissions,public.game_guide_submissions to authenticated;
