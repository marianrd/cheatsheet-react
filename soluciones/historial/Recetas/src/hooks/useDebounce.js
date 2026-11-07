import { useState, useEffect } from "react";

// Devuelve `value` pero recién `delay` ms después de que dejó de cambiar.
// Reemplaza a debounce() del vanilla. El return del useEffect cancela el timer anterior.
export function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
