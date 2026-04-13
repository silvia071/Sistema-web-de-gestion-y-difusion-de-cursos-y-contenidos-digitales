export const API_BASE =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000";

/** Sin backend: login y perfil usan solo el navegador (localStorage). */
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === "true";
