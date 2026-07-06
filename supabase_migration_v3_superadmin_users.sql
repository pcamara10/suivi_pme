-- ============================================================
-- Suivi PME — Migration V3 SuperAdmin / Utilisateurs en attente
-- Objectif : un utilisateur créé sans PME reste en attente jusqu'au rattachement.
-- À exécuter après vos migrations existantes dans Supabase SQL Editor.
-- ============================================================

create extension if not exists "pgcrypto";

-- 1) Colonnes nécessaires côté profils
alter table profils add column if not exists nom_complet text;
alter table profils add column if not exists email text;
alter table profils add column if not exists telephone text;
alter table profils add column if not exists role text default 'employe';
alter table profils add column if not exists poste text default 'employe';
alter table profils add column if not exists actif boolean default true;
alter table profils add column if not exists created_by uuid references profils(id) on delete set null;
alter table profils add column if not exists code_utilisateur text unique default ('USR-' || upper(substr(md5(random()::text), 1, 6)));
alter table profils add column if not exists statut_rattachement text default 'rattache';
alter table profils add column if not exists poste_souhaite text;
alter table profils add column if not exists date_rattachement timestamptz;

-- Important : entreprise_id doit rester nullable pour les utilisateurs en attente.
alter table profils alter column entreprise_id drop not null;

-- 2) Normalisation des anciens profils
update profils
set statut_rattachement = case
  when entreprise_id is null or poste = 'a_rattacher' then 'en_attente'
  else 'rattache'
end
where statut_rattachement is null;

update profils
set actif = false
where entreprise_id is null and poste <> 'super_admin';

update profils
set poste_souhaite = coalesce(poste_souhaite, nullif(poste, 'a_rattacher'), role, 'employe')
where poste_souhaite is null;

-- 3) Fonctions d'aide RLS
create or replace function public.is_super_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from profils p
    where p.id = auth.uid()
      and (p.poste = 'super_admin' or p.role = 'super_admin' or p.email = 'pcamara0630@gmail.com')
  );
$$;

-- 4) RLS profils : le SuperAdmin voit/gère tout ; chaque utilisateur voit son profil.
alter table profils enable row level security;

drop policy if exists "superadmin gere tous les profils" on profils;
create policy "superadmin gere tous les profils" on profils
for all
using (public.is_super_admin())
with check (public.is_super_admin());

drop policy if exists "utilisateur voit son profil" on profils;
create policy "utilisateur voit son profil" on profils
for select
using (id = auth.uid());

drop policy if exists "gerant voit profils de sa pme" on profils;
create policy "gerant voit profils de sa pme" on profils
for select
using (
  entreprise_id = public.get_entreprise_id()
  and exists (
    select 1 from profils me
    where me.id = auth.uid()
      and me.entreprise_id = profils.entreprise_id
      and me.poste in ('gerant', 'super_admin')
      and coalesce(me.actif, true) = true
  )
);

-- 5) Vue pratique pour l'écran SuperAdmin : utilisateurs non rattachés
create or replace view public.v_users_en_attente_rattachement as
select
  id,
  nom_complet,
  email,
  telephone,
  poste,
  role,
  poste_souhaite,
  statut_rattachement,
  actif,
  created_at
from profils
where poste <> 'super_admin'
  and (
    entreprise_id is null
    or poste = 'a_rattacher'
    or statut_rattachement = 'en_attente'
  );

-- 6) Index utiles
create index if not exists idx_profils_entreprise_id on profils(entreprise_id);
create index if not exists idx_profils_statut_rattachement on profils(statut_rattachement);
create index if not exists idx_profils_poste on profils(poste);
