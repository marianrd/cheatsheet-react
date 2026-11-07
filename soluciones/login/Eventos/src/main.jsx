import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./index.css";

// ORDEN IMPORTANTE (de afuera hacia adentro):
//   BrowserRouter  -> habilita Link / useNavigate / useParams
//   AuthProvider   -> habilita useAuth() en TODA la app
//   App            -> el Layout usa las dos cosas de arriba
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
