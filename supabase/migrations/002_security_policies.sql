-- FitBodyGym security baseline
-- Importante: estas políticas son una base inicial. Antes de producción hay que
-- definir roles reales para trabajadores del gimnasio.

alter table public.clients enable row level security;
alter table public.memberships enable row level security;

-- Lectura pública autenticada de membresías activas para que la app móvil pueda
-- validar el acceso premium por email autenticado.
-- Recomendación para producción: reemplazar por una función RPC security definer
-- que valide auth.email() y devuelva solo el estado del usuario actual.

create policy "Authenticated users can read active memberships view source clients"
on public.clients
for select
to authenticated
using (status = 'active');

create policy "Authenticated users can read active memberships"
on public.memberships
for select
to authenticated
using (status = 'active' and expires_at >= current_date);

-- Escritura administrativa pendiente.
-- Se habilitará cuando creemos tabla de perfiles/roles de trabajadores.
