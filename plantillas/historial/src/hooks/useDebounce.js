// hooks/useDebounce.js — SI PIDEN "buscador con debounce" / "no pedir en cada tecla".
// const textoRetrasado = useDebounce(texto, 500);   // 500 ms = lo que suele pedir el vanilla
import { useState, useEffect } from "react";

export function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // cancela el timer anterior si siguen tipeando
  }, [value, delay]);

  return debounced;
}
