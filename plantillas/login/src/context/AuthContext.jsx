// ═══════════════════════════════════════════════════════════════════
// context/AuthContext.jsx (PLANTILLA LOGIN) — la sesión del usuario  (vale ~20-25 pts)
// user = null (sin sesión)  |  { ...datos } (con sesión). Se guarda en localStorage (F5 no desloguea).
// ═══════════════════════════════════════════════════════════════════
import { createContext, useState } from "react";

export const AuthContext = createContext(null);

// 🔧 CAMBIAR: las claves = las que usa js/login.js del vanilla (buscá localStorage.setItem)
//    GameHub y Eventos: "usuario" + "rol"   ·   TrailerFlix: solo "usuario"
const KEY_USUARIO = "usuario";
const KEY_ROL = "rol";

// Se ejecuta UNA vez (lazy init) -> no hay "parpadeo" del formulario al recargar.
function leerSesion() {
  const fullName = localStorage.getItem(KEY_USUARIO);
  const rol = localStorage.getItem(KEY_ROL);
  return fullName ? { fullName, rol } : null;
  // 🔧 SI NO HAY ROL (TrailerFlix):  const username = localStorage.getItem(KEY_USUARIO);
  //                                  return username ? { username } : null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(leerSesion);

  // userData lo arma useLogin con armarSesion(). Misma forma que leerSesion().
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem(KEY_USUARIO, userData.fullName);
    localStorage.setItem(KEY_ROL, userData.rol);
    // 🔧 SI NO HAY ROL: borrá la línea del rol y usá userData.username en vez de fullName.
    // SI PIDEN TOKEN: localStorage.setItem("token", userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(KEY_USUARIO);
    localStorage.removeItem(KEY_ROL);
    // SI HAY TOKEN: localStorage.removeItem("token");
  };

  // SI PIDEN "es admin / es VIP":  const esAdmin = user?.rol === "admin";  y pasarlo en value.
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
