import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: "Variables SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquantes." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const body = await req.json();
    const {
      nom_complet,
      email,
      telephone = null,
      poste = "employe",
      entreprise_id = null,
      statut_rattachement = "en_attente",
      actif = false,
      password,
    } = body;

    const emailNormalise = String(email || "").trim().toLowerCase();
    const posteNormalise = String(poste || "employe").trim();
    const isRattache = statut_rattachement === "rattache" && entreprise_id;

    if (!nom_complet || !emailNormalise || !password) {
      return new Response(JSON.stringify({ error: "Nom complet, email et mot de passe obligatoires." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) {
      return new Response(JSON.stringify({ error: listError.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const existingAuthUser = existingUsers.users.find((u) => u.email?.toLowerCase() === emailNormalise);

    let userId: string;
    let userAlreadyExisted = false;

    if (existingAuthUser) {
      userId = existingAuthUser.id;
      userAlreadyExisted = true;
    } else {
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: emailNormalise,
        password,
        email_confirm: true,
        user_metadata: { nom_complet, telephone, poste: posteNormalise },
      });

      if (authError || !authData.user) {
        return new Response(JSON.stringify({ error: authError?.message || "Création Auth impossible." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      userId = authData.user.id;
    }

    const profilPayload = {
      id: userId,
      nom_complet,
      email: emailNormalise,
      telephone,
      role: posteNormalise === "gerant" ? "gerant" : "employe",
      poste: isRattache ? posteNormalise : "a_rattacher",
      poste_souhaite: posteNormalise,
      entreprise_id: isRattache ? entreprise_id : null,
      statut_rattachement: isRattache ? "rattache" : "en_attente",
      date_rattachement: isRattache ? new Date().toISOString() : null,
      actif: Boolean(actif && isRattache),
    };

    const { error: profilError } = await supabaseAdmin
      .from("profils")
      .upsert(profilPayload, { onConflict: "id" });

    if (profilError) {
      if (!userAlreadyExisted) await supabaseAdmin.auth.admin.deleteUser(userId);
      return new Response(JSON.stringify({ error: profilError.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, user_id: userId, existed: userAlreadyExisted }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
