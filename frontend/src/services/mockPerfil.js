const MOCK_PERFIL_KEY = "perfilUsuarioLocal";

function defaultPerfil(email) {
  const part = email.split("@")[0] || "Usuario";
  return {
    id: "local",
    email,
    nombre: part.length >= 2 ? part : "Usuario",
    apellido: "Demo",
    direccion: "",
    telefono: "",
  };
}

export function readMockPerfil(email) {
  if (!email) return null;
  try {
    const raw = localStorage.getItem(MOCK_PERFIL_KEY);
    if (!raw) return defaultPerfil(email);
    const p = JSON.parse(raw);
    if (p.email !== email) return defaultPerfil(email);
    return {
      id: "local",
      email: p.email,
      nombre: p.nombre ?? defaultPerfil(email).nombre,
      apellido: p.apellido ?? "Demo",
      direccion: p.direccion ?? "",
      telefono: p.telefono ?? "",
    };
  } catch {
    return defaultPerfil(email);
  }
}

export function writeMockPerfil(usuario) {
  const { email, nombre, apellido, direccion, telefono } = usuario;
  localStorage.setItem(
    MOCK_PERFIL_KEY,
    JSON.stringify({
      email,
      nombre,
      apellido,
      direccion: direccion ?? "",
      telefono: telefono ?? "",
    }),
  );
}
