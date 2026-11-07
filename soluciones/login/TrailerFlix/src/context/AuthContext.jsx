import { createContext, useState } from "react";

// js/login.js de TrailerFlix guarda SOLO la clave "usuario" (no hay rol).
const KEY_USUARIO = "usuario";

export const AuthContext = createContext(null);

function leerSesion() {
  const username = localStorage.getItem(KEY_USUARIO);
  return username ? { username } : null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(leerSesion);

  // userData = { username }
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem(KEY_USUARIO, userData.username);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(KEY_USUARIO);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
