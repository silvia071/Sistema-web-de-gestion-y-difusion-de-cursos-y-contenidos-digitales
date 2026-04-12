import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { API_BASE, USE_MOCK_API } from "../config/api";
import { readMockPerfil, writeMockPerfil } from "../services/mockPerfil";
import "./Perfil.css";
import logo from "../assets/logo.png";

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function Perfil() {
  const navigate = useNavigate();

  const [misCursos, setMisCursos] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);

  const syncFormFromUsuario = useCallback((u) => {
    if (!u) return;
    setNombre(u.nombre ?? "");
    setApellido(u.apellido ?? "");
    setDireccion(u.direccion ?? "");
    setTelefono(u.telefono ?? "");
  }, []);

  const clearSessionAndRedirect = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    navigate("/login", { replace: true });
  }, [navigate]);

  const cargarPerfil = useCallback(async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const email = localStorage.getItem("email");

    if (!token || !userId) {
      setLoadError("Volvé a iniciar sesión para ver tu perfil.");
      setUsuario(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setLoadError("");

    if (USE_MOCK_API) {
      const u = readMockPerfil(email);
      if (!u) {
        setLoadError("Volvé a iniciar sesión para ver tu perfil.");
        setUsuario(null);
      } else {
        setUsuario(u);
        syncFormFromUsuario(u);
      }
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/usuarios/${userId}`, {
        headers: authHeaders(),
      });

      if (res.status === 401) {
        clearSessionAndRedirect();
        return;
      }

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setLoadError(
          data.detalle || data.mensaje || "No se pudo cargar el perfil.",
        );
        setUsuario(null);
        return;
      }

      setUsuario(data);
      syncFormFromUsuario(data);
    } catch {
      setLoadError("Error de red al cargar el perfil.");
      setUsuario(null);
    } finally {
      setLoading(false);
    }
  }, [clearSessionAndRedirect, syncFormFromUsuario]);

  useEffect(() => {
    const cursosGuardados = JSON.parse(localStorage.getItem("misCursos")) || [];
    setMisCursos(cursosGuardados);
  }, []);

  useEffect(() => {
    cargarPerfil();
  }, [cargarPerfil]);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const abrirEdicion = () => {
    setSaveError("");
    if (usuario) syncFormFromUsuario(usuario);
    setEditando(true);
  };

  const cancelarEdicion = () => {
    setSaveError("");
    if (usuario) syncFormFromUsuario(usuario);
    setEditando(false);
  };

  const guardarPerfil = async (e) => {
    e.preventDefault();
    setSaveError("");

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) {
      clearSessionAndRedirect();
      return;
    }

    const nombreLimpio = nombre.trim();
    const apellidoLimpio = apellido.trim();
    const direccionLimpia = direccion.trim();
    const telefonoLimpio = telefono.trim();

    if (nombreLimpio.length < 2) {
      setSaveError("El nombre debe tener al menos 2 caracteres.");
      return;
    }
    if (!apellidoLimpio) {
      setSaveError("El apellido es obligatorio.");
      return;
    }

    const body = { nombre: nombreLimpio, apellido: apellidoLimpio };
    if (direccionLimpia) body.direccion = direccionLimpia;
    if (telefonoLimpio) body.telefono = telefonoLimpio;

    if (USE_MOCK_API) {
      const email = usuario?.email ?? localStorage.getItem("email") ?? "";
      const actualizado = {
        id: "local",
        email,
        nombre: nombreLimpio,
        apellido: apellidoLimpio,
        direccion: direccionLimpia,
        telefono: telefonoLimpio,
      };
      writeMockPerfil(actualizado);
      setUsuario(actualizado);
      syncFormFromUsuario(actualizado);
      setEditando(false);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/usuarios/perfil/${userId}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(body),
      });

      if (res.status === 401) {
        clearSessionAndRedirect();
        return;
      }

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data.errores?.length) {
          const msg = data.errores.map((x) => x.mensaje).join(" ");
          setSaveError(msg || "No se pudo guardar.");
        } else {
          setSaveError(
            data.detalle || data.mensaje || "No se pudo guardar el perfil.",
          );
        }
        return;
      }

      setUsuario(data.usuario);
      syncFormFromUsuario(data.usuario);
      setEditando(false);
    } catch {
      setSaveError("Error de red al guardar.");
    } finally {
      setSaving(false);
    }
  };

  const nombreCompleto =
    usuario && (usuario.nombre || usuario.apellido)
      ? `${usuario.nombre ?? ""} ${usuario.apellido ?? ""}`.trim()
      : "";

  const emailMostrado = usuario?.email ?? localStorage.getItem("email") ?? "-";

  return (
    <section className="perfil-page">
      <div className="perfil-card">
        <div className="perfil-header">
          <div className="perfil-avatar">
            <img src={logo} alt="Logo" />
          </div>

          <div className="perfil-header-info">
            <h1 className="perfil-title">Mi perfil</h1>
            <p className="perfil-subtitle">Panel personal del usuario</p>
          </div>
        </div>

        {loading && (
          <p className="perfil-status" role="status">
            Cargando perfil…
          </p>
        )}

        {!loading && loadError && (
          <p className="perfil-status perfil-status--error" role="alert">
            {loadError}
          </p>
        )}

        {!loading && usuario && !editando && (
          <>
            <div className="perfil-grid">
              <div className="perfil-group">
                <span className="perfil-label">Nombre</span>
                <div className="perfil-value">{nombreCompleto || "-"}</div>
              </div>

              <div className="perfil-group">
                <span className="perfil-label">Email</span>
                <div className="perfil-value">{emailMostrado}</div>
              </div>

              <div className="perfil-group">
                <span className="perfil-label">Dirección</span>
                <div className="perfil-value">
                  {usuario.direccion?.trim() ? usuario.direccion : "-"}
                </div>
              </div>

              <div className="perfil-group">
                <span className="perfil-label">Teléfono</span>
                <div className="perfil-value">
                  {usuario.telefono?.trim() ? usuario.telefono : "-"}
                </div>
              </div>

              <div className="perfil-group">
                <span className="perfil-label">Estado</span>
                <div className="perfil-value">Sesión activa</div>
              </div>

              <div className="perfil-group">
                <span className="perfil-label">Cursos comprados</span>
                <div className="perfil-value">{misCursos.length} cursos</div>
              </div>
            </div>

            <div className="perfil-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={abrirEdicion}
              >
                Editar perfil
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={cerrarSesion}
              >
                Cerrar sesión
              </button>
            </div>
          </>
        )}

        {!loading && usuario && editando && (
          <form className="perfil-edit-form" onSubmit={guardarPerfil}>
            {saveError && (
              <p className="perfil-form-error" role="alert">
                {saveError}
              </p>
            )}

            <div className="grid grid-2 perfil-edit-grid">
              <div className="perfil-group">
                <label className="perfil-label" htmlFor="perfil-nombre">
                  Nombre
                </label>
                <input
                  id="perfil-nombre"
                  className="input"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  autoComplete="given-name"
                  required
                  minLength={2}
                />
              </div>

              <div className="perfil-group">
                <label className="perfil-label" htmlFor="perfil-apellido">
                  Apellido
                </label>
                <input
                  id="perfil-apellido"
                  className="input"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  autoComplete="family-name"
                  required
                />
              </div>

              <div className="perfil-group">
                <label className="perfil-label" htmlFor="perfil-email">
                  Email
                </label>
                <input
                  id="perfil-email"
                  className="input"
                  value={usuario.email ?? ""}
                  readOnly
                  aria-readonly="true"
                />
              </div>

              <div className="perfil-group">
                <label className="perfil-label" htmlFor="perfil-telefono">
                  Teléfono
                </label>
                <input
                  id="perfil-telefono"
                  className="input"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  autoComplete="tel"
                  placeholder="Opcional"
                />
              </div>

              <div className="perfil-group perfil-group--full">
                <label className="perfil-label" htmlFor="perfil-direccion">
                  Dirección
                </label>
                <input
                  id="perfil-direccion"
                  className="input"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  autoComplete="street-address"
                  placeholder="Opcional"
                />
              </div>
            </div>

            <div className="perfil-form-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={cancelarEdicion}
                disabled={saving}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? "Guardando…" : "Guardar"}
              </button>
            </div>

            <div className="perfil-actions perfil-actions--after-form">
              <button
                type="button"
                className="btn btn-primary"
                onClick={cerrarSesion}
              >
                Cerrar sesión
              </button>
            </div>
          </form>
        )}

        {!loading && !usuario && !loadError && (
          <p className="perfil-status perfil-status--error" role="alert">
            No se encontró el perfil.
          </p>
        )}
      </div>

      <div className="perfil-cursos">
        <h2 className="perfil-cursos-title">Mis cursos</h2>

        <div className="perfil-cursos-list">
          {misCursos.length > 0 ? (
            misCursos.map((curso) => (
              <div key={curso.id} className="perfil-curso-card">
                <img src={curso.imagen} alt={curso.titulo} />
                <h3>{curso.titulo}</h3>
                <p>${curso.precio.toLocaleString()}</p>
              </div>
            ))
          ) : (
            <div className="perfil-vacio">
              No tenés cursos comprados todavía.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Perfil;
