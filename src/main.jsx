import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Erreur application Suivi PME :", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Inter, Arial",background:"#F6F4EF",padding:24,color:"#152238"}}>
          <div style={{maxWidth:560,background:"#fff",border:"1px solid #15223814",borderRadius:20,padding:28,boxShadow:"0 18px 55px rgba(21,34,56,.14)"}}>
            <h1 style={{marginTop:0}}>Une erreur est survenue</h1>
            <p style={{lineHeight:1.6}}>L’application a été protégée par un écran de sécurité au lieu d’afficher une page blanche. Rechargez la page ou vérifiez la console pour le détail technique.</p>
            <pre style={{whiteSpace:"pre-wrap",background:"#F8FAFC",padding:12,borderRadius:12,fontSize:12,color:"#C4432B"}}>{this.state.error?.message || "Erreur inconnue"}</pre>
            <button onClick={() => window.location.reload()} style={{background:"#1E7F6E",color:"#fff",border:"none",borderRadius:12,padding:"12px 16px",fontWeight:800,cursor:"pointer"}}>Recharger l’application</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
