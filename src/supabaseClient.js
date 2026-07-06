import { createClient } from "@supabase/supabase-js";

// Ces deux valeurs se trouvent dans Supabase > Project Settings > API
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Variables d'environnement manquantes : VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY. " +
    "Copiez .env.example vers .env et renseignez vos valeurs (voir README_SETUP.md)."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
