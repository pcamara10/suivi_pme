-- Suivi PME V2 — modules Clients, Fournisseurs, Achats, Paramètres et Factures
create extension if not exists "pgcrypto";

alter table entreprises add column if not exists telephone text;
alter table entreprises add column if not exists email text;
alter table entreprises add column if not exists ninea text;
alter table entreprises add column if not exists rccm text;
alter table entreprises add column if not exists logo_url text;

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  entreprise_id uuid references entreprises(id) on delete cascade not null,
  nom text not null,
  telephone text,
  email text,
  adresse text,
  created_at timestamptz default now()
);

create table if not exists fournisseurs (
  id uuid primary key default gen_random_uuid(),
  entreprise_id uuid references entreprises(id) on delete cascade not null,
  nom text not null,
  telephone text,
  email text,
  adresse text,
  created_at timestamptz default now()
);

alter table ventes add column if not exists client_id uuid references clients(id) on delete set null;
alter table ventes add column if not exists reference text unique default ('FAC-' || to_char(now(), 'YYYYMMDD') || '-' || substr(md5(random()::text), 1, 6));

create table if not exists achats (
  id uuid primary key default gen_random_uuid(),
  entreprise_id uuid references entreprises(id) on delete cascade not null,
  fournisseur_id uuid references fournisseurs(id) on delete set null,
  produit_id uuid references produits(id) not null,
  quantite numeric not null check (quantite > 0),
  prix_unitaire numeric not null default 0,
  utilisateur_id uuid references profils(id),
  date_achat date not null default current_date,
  created_at timestamptz default now()
);

create or replace function ajouter_stock_apres_achat()
returns trigger language plpgsql security definer as $$
begin
  update produits set quantite = quantite + NEW.quantite where id = NEW.produit_id;
  return NEW;
end;
$$;

drop trigger if exists trg_ajouter_stock_apres_achat on achats;
create trigger trg_ajouter_stock_apres_achat
after insert on achats
for each row execute function ajouter_stock_apres_achat();

create or replace function retirer_stock_apres_suppression_achat()
returns trigger language plpgsql security definer as $$
begin
  update produits set quantite = quantite - OLD.quantite where id = OLD.produit_id;
  return OLD;
end;
$$;

drop trigger if exists trg_retirer_stock_apres_suppression_achat on achats;
create trigger trg_retirer_stock_apres_suppression_achat
after delete on achats
for each row execute function retirer_stock_apres_suppression_achat();

alter table clients enable row level security;
alter table fournisseurs enable row level security;
alter table achats enable row level security;

drop policy if exists "clients de son entreprise" on clients;
create policy "clients de son entreprise" on clients
for all using (entreprise_id = get_entreprise_id())
with check (entreprise_id = get_entreprise_id());

drop policy if exists "fournisseurs de son entreprise" on fournisseurs;
create policy "fournisseurs de son entreprise" on fournisseurs
for all using (entreprise_id = get_entreprise_id())
with check (entreprise_id = get_entreprise_id());

drop policy if exists "achats de son entreprise" on achats;
create policy "achats de son entreprise" on achats
for all using (entreprise_id = get_entreprise_id())
with check (entreprise_id = get_entreprise_id());

-- Autoriser la modification des informations de sa propre entreprise
-- Supabase ignore si une policy identique existe déjà grâce au drop.
drop policy if exists "modifier sa propre entreprise" on entreprises;
create policy "modifier sa propre entreprise" on entreprises
for update using (id = get_entreprise_id())
with check (id = get_entreprise_id());
