import { createContext, useState } from "react";

// Mismas claves de localStorage que usa js/login.js (vanilla).
const KEY_USUARIO = "usuario";
const KEY_ROL = "rol";

export const AuthContext = createContext(null);

// Lee la sesión guardada. Se llama UNA vez, al crear el estado (lazy init),
// así no hay "parpadeo" del formulario al recargar la página.
function leerSesion() {
  const fullName = localStorage.getItem(KEY_USUARIO);
  const rol = localStorage.getItem(KEY_ROL);
  return fullName ? { fullName, rol } : null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(leerSesion);

  // userData = { fullName, rol }
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem(KEY_USUARIO, userData.fullName);
    localStorage.setItem(KEY_ROL, userData.rol);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(KEY_USUARIO);
    localStorage.removeItem(KEY_ROL);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
