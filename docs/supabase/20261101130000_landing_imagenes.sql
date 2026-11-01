-- Fotos editables de la landing Rio Bonito (panel de administracion).
-- Lectura publica; escritura solo para correos de la lista cadis_landing_admins CON email confirmado.
-- El proyecto de Supabase es compartido con otros sistemas: NO basta con "estar autenticado".

-- 1. Lista de administradores permitidos (sin policies: solo se consulta desde la funcion de abajo).
create table if not exists public.cadis_landing_admins (
  email text primary key
);
alter table public.cadis_landing_admins enable row level security;
-- Nadie la lee por la API: solo la funcion cadis_es_admin_landing() (security definer).
revoke all on table public.cadis_landing_admins from anon, authenticated;
comment on table public.cadis_landing_admins is
  'Correos que pueden cambiar las fotos de la landing Cadis. Sin policies a proposito: solo la funcion cadis_es_admin_landing() la lee.';

-- 2. Funcion: el usuario actual es admin de la landing y su correo esta confirmado.
create or replace function public.cadis_es_admin_landing()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from auth.users u
    join public.cadis_landing_admins a on lower(a.email) = lower(u.email)
    where u.id = (select auth.uid())
      and u.email_confirmed_at is not null
  );
$$;
revoke all on function public.cadis_es_admin_landing() from public, anon;
grant execute on function public.cadis_es_admin_landing() to authenticated;

-- 3. Foto activa de cada espacio de la landing.
create table if not exists public.cadis_landing_imagenes (
  slot        text primary key check (char_length(slot) between 1 and 40),
  url         text not null check (url like 'https://%'),
  updated_at  timestamptz not null default now()
);
alter table public.cadis_landing_imagenes enable row level security;

create policy "landing_imagenes_lectura_publica" on public.cadis_landing_imagenes
  for select to anon, authenticated using (true);
create policy "landing_imagenes_admin_insert" on public.cadis_landing_imagenes
  for insert to authenticated with check ((select public.cadis_es_admin_landing()));
create policy "landing_imagenes_admin_update" on public.cadis_landing_imagenes
  for update to authenticated using ((select public.cadis_es_admin_landing()))
  with check ((select public.cadis_es_admin_landing()));
create policy "landing_imagenes_admin_delete" on public.cadis_landing_imagenes
  for delete to authenticated using ((select public.cadis_es_admin_landing()));

-- 4. Bucket publico para las imagenes (sin policy de select: se leen por URL publica, no se pueden listar).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cadis-landing', 'cadis-landing', true, 3145728, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do nothing;

create policy "cadis_landing_admin_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'cadis-landing' and (select public.cadis_es_admin_landing()));
create policy "cadis_landing_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'cadis-landing' and (select public.cadis_es_admin_landing()))
  with check (bucket_id = 'cadis-landing' and (select public.cadis_es_admin_landing()));
create policy "cadis_landing_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'cadis-landing' and (select public.cadis_es_admin_landing()));

-- 5. Administrador inicial. Cambiar o agregar correos aqui.
insert into public.cadis_landing_admins (email) values ('despegaiamark@gmail.com')
on conflict do nothing;
