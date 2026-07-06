import React, { useState } from "react";
import logoSuiviPME from "./assets/logo-suivi-pme.png";
import { supabase } from "./supabaseClient";

const INK = "#152238";
const TEAL = "#1E7F6E";
const TEAL_DARK = "#146252";
const MUSTARD = "#E0913C";
const CORAL = "#C4432B";
const BG = "#F6F4EF";

export default function AuthScreen() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isSuccess = message.toLowerCase().includes("envoyé") || message.toLowerCase().includes("réinitialisation");

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: `1px solid ${INK}20`,
    outline: "none",
    fontSize: 13.5,
    boxSizing: "border-box",
    background: "#FFFFFF",
    color: INK
  };

  const btnStyle = {
    width: "100%",
    padding: "13px 16px",
    borderRadius: 14,
    border: "none",
    background: loading ? `${TEAL}99` : `linear-gradient(135deg, ${TEAL} 0%, ${TEAL_DARK} 100%)`,
    color: "#fff",
    fontWeight: 900,
    fontSize: 14.5,
    cursor: loading ? "default" : "pointer",
    opacity: loading ? 0.75 : 1,
    boxShadow: `0 14px 28px ${TEAL}30`,
    letterSpacing: 0.2
  };

  async function login(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage(error.message);
    setLoading(false);
  }

  async function motDePasseOublie(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    if (!email) {
      setMessage("Veuillez saisir votre adresse email.");
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
    if (error) setMessage(error.message);
    else setMessage("Un lien de réinitialisation a été envoyé à votre adresse email.");
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: `radial-gradient(circle at top left, ${TEAL}22 0, transparent 30%), radial-gradient(circle at bottom right, ${MUSTARD}22 0, transparent 28%), linear-gradient(135deg, ${BG} 0%, #EAF7F3 48%, #EEF4FF 100%)`,
      fontFamily: "Manrope, Inter, Arial, sans-serif",
      padding: 18,
      color: INK,
      boxSizing: "border-box"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
        @media(max-width: 850px){
          .auth-shell{grid-template-columns:1fr!important; max-width:500px!important;}
          .auth-hero{padding:26px!important; min-height:auto!important;}
          .auth-form{padding:28px 24px!important;}
          .auth-title{font-size:30px!important;}
        }
      `}</style>

      <div className="auth-shell" style={{
        width: "100%",
        maxWidth: 900,
        display: "grid",
        gridTemplateColumns: "0.85fr 1fr",
        background: "rgba(255,255,255,0.86)",
        borderRadius: 24,
        boxShadow: "0 28px 80px rgba(21,34,56,0.16)",
        border: `1px solid ${INK}12`,
        overflow: "hidden",
        backdropFilter: "blur(12px)"
      }}>
        <div className="auth-hero" style={{
          position: "relative",
          padding: 28,
          background: `linear-gradient(145deg, ${INK} 0%, #0D1A2C 58%, ${TEAL_DARK} 100%)`,
          color: "#fff",
          minHeight: 420,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}>
          <div style={{ position: "absolute", width: 180, height: 180, borderRadius: "50%", background: `${TEAL}44`, top: -70, right: -60 }} />
          <div style={{ position: "absolute", width: 150, height: 150, borderRadius: "50%", background: `${MUSTARD}44`, bottom: -55, left: -55 }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <img src={logoSuiviPME} alt="Suivi PME" style={{
              width: 62,
              height: 62,
              objectFit: "contain",
              borderRadius: 20,
              background: "#fff",
              padding: 8,
              boxShadow: "0 18px 38px rgba(0,0,0,0.24)"
            }} />
            <h1 className="auth-title" style={{ margin: "26px 0 8px", fontFamily: "Manrope, Inter, sans-serif", fontSize: 36, lineHeight: 1.08, letterSpacing: -1.1 }}>
              Suivi PME
            </h1>
            <p style={{ margin: 0, maxWidth: 420, color: "rgba(255,255,255,0.78)", fontSize: 14.5, lineHeight: 1.65 }}>
              Gérez votre PME simplement : ventes, stocks, dépenses, caisse, utilisateurs et performance en temps réel.
            </p>
            <div style={{ marginTop: 26, display: "grid", gap: 10, fontSize: 13.2, color: "rgba(255,255,255,0.86)" }}>
              {["Ventes et facturation", "Gestion des stocks", "Comptabilité et caisse", "Pilotage clair de votre PME"].map((item) => (
                <div key={item} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ width: 22, height: 22, borderRadius: 999, background: `${TEAL}55`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: "relative", zIndex: 1, fontSize: 11.8, color: "rgba(255,255,255,0.64)", lineHeight: 1.6 }}>
            © 2026 Suivi PME — Version 1.0<br />Développé par Papa Abdoulaye CAMARA
          </div>
        </div>

        <div className="auth-form" style={{ padding: "32px 30px", display: "flex", alignItems: "center", background: "rgba(255,255,255,0.96)" }}>
          <div style={{ width: "100%" }}>
            <div style={{ marginBottom: 22 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 11px", borderRadius: 999, background: `${TEAL}12`, color: TEAL, fontWeight: 900, fontSize: 12, marginBottom: 13 }}>
                ● Espace sécurisé
              </div>
              <h2 style={{ margin: 0, color: INK, fontFamily: "Manrope, Inter, sans-serif", fontSize: 24, letterSpacing: -0.7 }}>
                {mode === "login" ? "Connexion" : "Mot de passe oublié"}
              </h2>
              <p style={{ margin: "7px 0 0", color: `${INK}95`, fontSize: 13.2, lineHeight: 1.55 }}>
                {mode === "login" ? "Accédez à votre espace de gestion." : "Recevez un lien sécurisé par email."}
              </p>
            </div>

            {message && (
              <div style={{ background: isSuccess ? `${TEAL}12` : `${CORAL}12`, color: isSuccess ? TEAL : CORAL, padding: "11px 13px", borderRadius: 13, marginBottom: 16, fontSize: 12.8, fontWeight: 800, border: `1px solid ${isSuccess ? TEAL : CORAL}22` }}>
                {isSuccess ? "✅ " : "⚠️ "}{message}
              </div>
            )}

            {mode === "login" && (
              <form onSubmit={login}>
                <label style={{ fontWeight: 900, color: INK, fontSize: 12.8 }}>Adresse email</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ ...inputStyle, marginTop: 7, marginBottom: 14 }} placeholder="exemple@email.com" />
                <label style={{ fontWeight: 900, color: INK, fontSize: 12.8 }}>Mot de passe</label>
                <div style={{ position: "relative", marginTop: 7, marginBottom: 10 }}>
                  <input type={showPassword ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)} style={{ ...inputStyle, paddingRight: 78 }} placeholder="Votre mot de passe" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 8, top: 7, border: "none", background: `${TEAL}10`, color: TEAL, borderRadius: 10, padding: "7px 9px", fontSize: 11.5, fontWeight: 900, cursor: "pointer" }}>
                    {showPassword ? "Masquer" : "Voir"}
                  </button>
                </div>
                <button type="button" onClick={() => setMode("forgot")} style={{ border: "none", background: "transparent", color: TEAL, fontWeight: 900, cursor: "pointer", padding: "4px 0 18px", fontSize: 12.5 }}>
                  Mot de passe oublié ?
                </button>
                <button type="submit" disabled={loading} style={btnStyle}>{loading ? "Connexion..." : "Se connecter"}</button>
              </form>
            )}

            {mode === "forgot" && (
              <form onSubmit={motDePasseOublie}>
                <label style={{ fontWeight: 900, color: INK, fontSize: 12.8 }}>Adresse email</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ ...inputStyle, marginTop: 7, marginBottom: 16 }} placeholder="exemple@email.com" />
                <button type="submit" disabled={loading} style={btnStyle}>{loading ? "Envoi..." : "Envoyer le lien"}</button>
                <button type="button" onClick={() => setMode("login")} style={{ width: "100%", marginTop: 12, border: `1px solid ${INK}18`, background: "#fff", color: INK, borderRadius: 14, padding: "12px 14px", fontWeight: 900, cursor: "pointer" }}>
                  Retour à la connexion
                </button>
              </form>
            )}

            <div style={{ marginTop: 24, padding: 13, borderRadius: 16, background: `${TEAL}08`, border: `1px solid ${TEAL}22`, fontSize: 12.5, lineHeight: 1.5, color: `${INK}CC` }}>
              <b>Suivi PME</b> centralise la gestion quotidienne de votre entreprise dans un espace simple, sécurisé et moderne.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
