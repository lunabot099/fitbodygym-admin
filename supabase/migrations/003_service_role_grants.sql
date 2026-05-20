-- Grants required for the server-side admin panel.
-- The Vercel server uses SUPABASE_SERVICE_ROLE_KEY, which maps to role service_role.

grant usage on schema public to service_role;

grant select, insert, update, delete on table public.clients to service_role;
grant select, insert, update, delete on table public.memberships to service_role;
grant select on table public.active_memberships to service_role;
