// main.jsx — PLANTILLA HISTORIAL
// Orden de envoltorios (de afuera hacia adentro): BrowserRouter > Provider > App
// ⚠️ SI el esqueleto YA trae <BrowserRouter> adentro de App.jsx, NO lo repitas acá
//    (dos Routers = error "You cannot render a <Router> inside another <Router>").
//    Lo mismo con el Provider: que esté UNA sola vez.
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ItemsRecientesProvider } from "./context/ItemsRecientesContext.jsx";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ItemsRecientesProvider>
        <App />
      </ItemsRecientesProvider>
    </BrowserRouter>
  </React.StrictMode>
);
