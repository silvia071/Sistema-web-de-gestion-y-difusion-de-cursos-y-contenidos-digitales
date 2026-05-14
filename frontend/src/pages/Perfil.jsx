import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { USE_MOCK_API } from "../config/api";
import api from "../services/api";
import { readMockPerfil, writeMockPerfil } from "../services/mockPerfil";
import "./Perfil.css";

import { getImageUrl } from "../utils/getImageUrl";
import logo from "../assets/logo.png";
import DatosFacturacion from "../components/DatosFacturacion";

const obtenerImagenCurso = (curso) => {
  return (
    getImageUrl(curso?.imagenPortada) ||
    getImageUrl(curso?.imagen) ||
    "/placeholder-curso.png"
  );
};

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
    localStorage.removeItem("nombre");
    localStorage.removeItem("rol");
    localStorage.removeItem("usuario");
    localStorage.removeItem("carrito");

    navigate("/login", { replace: true });
  }, [navigate]);

  const cargarMisCursos = useCallback(async () => {
    try {
      const usuarioId = localStorage.getItem("userId");

      if (!usuarioId || USE_MOCK_API) {
        setMisCursos([]);
        return;
      }

      const response = await api.get(`/api/accesos/usuario/${usuarioId}`);

      const accesos = Array.isArray(response.data?.datos)
        ? response.data.datos
        : [];

      setMisCursos(accesos.filter((acceso) => acceso?.curso));
    } catch (error) {
      console.error("Error cargando cursos:", error);
      setMisCursos([]);
    }
  }, []);

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
      const { data } = await api.get(`/api/usuarios/${userId}`);

      setUsuario(data.datos);
      syncFormFromUsuario(data.datos);
    } catch (error) {
      if (error.response?.status === 401) {
        clearSessionAndRedirect();
        return;
      }

      setLoadError(
        error.response?.data?.detalle ||
          error.response?.data?.mensaje ||
          "No se pudo cargar el perfil.",
      );

      setUsuario(null);
    } finally {
      setLoading(false);
    }
  }, [clearSessionAndRedirect, syncFormFromUsuario]);

  useEffect(() => {
    cargarPerfil();
    cargarMisCursos();
  }, [cargarPerfil, cargarMisCursos]);

  const cerrarSesion = () => {
    clearSessionAndRedirect();
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
      const { data } = await api.put(`/api/usuarios/perfil/${userId}`, body);

      setUsuario(data.datos);
      syncFormFromUsuario(data.datos);
      setEditando(false);
    } catch (error) {
      if (error.response?.status === 401) {
        clearSessionAndRedirect();
        return;
      }

      const data = error.response?.data;

      if (data?.errores?.length) {
        const msg = data.errores.map((x) => x.mensaje).join(" ");
        setSaveError(msg || "No se pudo guardar.");
      } else {
        setSaveError(
          data?.detalle || data?.mensaje || "No se pudo guardar el perfil.",
        );
      }
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
      <div className="perfil-shell">
        <aside className="perfil-sidebar">
          <div className="perfil-user">
            <div className="perfil-avatar">
              <img src={logo} alt="Logo" />
            </div>

            <div>
              <h2>Mi cuenta</h2>
              <p>{nombreCompleto || "Usuario"}</p>
              <span>{emailMostrado}</span>
            </div>
          </div>

          <nav className="perfil-menu" aria-label="Menú del perfil">
            <button type="button" className="perfil-menu-item active">
              <span>👤</span>
              Mi perfil
            </button>

            <button
              type="button"
              className="perfil-menu-item"
              onClick={() => navigate("/mis-cursos")}
            >
              <span>📚</span>
              Mis cursos
            </button>

            <button type="button" className="perfil-menu-item">
              <span>🧾</span>
              Facturación
            </button>

            <button type="button" className="perfil-menu-item">
              <span>⚙️</span>
              Configuración
            </button>

            <button
              type="button"
              className="perfil-menu-item logout"
              onClick={cerrarSesion}
            >
              <span>↪</span>
              Cerrar sesión
            </button>
          </nav>

          <div className="perfil-help">
            <div className="perfil-help-icon">🎧</div>
            <h3>¿Necesitás ayuda?</h3>
            <p>Nuestro equipo está para ayudarte.</p>
            <button type="button" onClick={() => navigate("/contacto")}>
              Contactar soporte
            </button>
          </div>
        </aside>

        <main className="perfil-main">
          <header className="perfil-main-header">
            <div>
              <span className="perfil-eyebrow">Panel de usuario</span>
              <h1>Mi perfil</h1>
              <p>
                Gestioná tu información personal, tus datos de facturación y tus
                cursos.
              </p>
            </div>
          </header>

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

          {!loading && usuario && (
            <article className="perfil-section-card">
              <div className="perfil-section-header">
                <div className="perfil-section-title">
                  <span className="perfil-section-icon">👤</span>
                  <div>
                    <h2>Información personal</h2>
                    <p>Datos principales de tu cuenta.</p>
                  </div>
                </div>

                {!editando && (
                  <button
                    type="button"
                    className="perfil-btn perfil-btn-primary"
                    onClick={abrirEdicion}
                  >
                    Editar perfil
                  </button>
                )}
              </div>

              {!editando && (
                <div className="perfil-info-grid">
                  <div className="perfil-info-item">
                    <span>Nombre completo</span>
                    <strong>{nombreCompleto || "-"}</strong>
                  </div>

                  <div className="perfil-info-item">
                    <span>Email</span>
                    <strong>{emailMostrado}</strong>
                  </div>

                  <div className="perfil-info-item">
                    <span>Dirección</span>
                    <strong>
                      {usuario.direccion?.trim() ? usuario.direccion : "-"}
                    </strong>
                  </div>

                  <div className="perfil-info-item">
                    <span>Teléfono</span>
                    <strong>
                      {usuario.telefono?.trim() ? usuario.telefono : "-"}
                    </strong>
                  </div>

                  <div className="perfil-info-item">
                    <span>Estado de cuenta</span>
                    <strong className="perfil-badge-active">
                      Sesión activa
                    </strong>
                  </div>

                  <div className="perfil-info-item">
                    <span>Cursos comprados</span>
                    <strong>{misCursos.length} cursos</strong>
                  </div>
                </div>
              )}

              {editando && (
                <form className="perfil-edit-form" onSubmit={guardarPerfil}>
                  {saveError && (
                    <p className="perfil-form-error" role="alert">
                      {saveError}
                    </p>
                  )}

                  <div className="perfil-info-grid">
                    <div className="perfil-form-group">
                      <label htmlFor="perfil-nombre">Nombre</label>
                      <input
                        id="perfil-nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        autoComplete="given-name"
                        required
                        minLength={2}
                      />
                    </div>

                    <div className="perfil-form-group">
                      <label htmlFor="perfil-apellido">Apellido</label>
                      <input
                        id="perfil-apellido"
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                        autoComplete="family-name"
                        required
                      />
                    </div>

                    <div className="perfil-form-group">
                      <label htmlFor="perfil-email">Email</label>
                      <input
                        id="perfil-email"
                        value={usuario.email ?? ""}
                        readOnly
                      />
                    </div>

                    <div className="perfil-form-group">
                      <label htmlFor="perfil-telefono">Teléfono</label>
                      <input
                        id="perfil-telefono"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        autoComplete="tel"
                        placeholder="Opcional"
                      />
                    </div>

                    <div className="perfil-form-group perfil-form-group-full">
                      <label htmlFor="perfil-direccion">Dirección</label>
                      <input
                        id="perfil-direccion"
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
                      className="perfil-btn perfil-btn-secondary"
                      onClick={cancelarEdicion}
                      disabled={saving}
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      className="perfil-btn perfil-btn-primary"
                      disabled={saving}
                    >
                      {saving ? "Guardando…" : "Guardar cambios"}
                    </button>
                  </div>
                </form>
              )}
            </article>
          )}

          {!loading && !usuario && !loadError && (
            <p className="perfil-status perfil-status--error" role="alert">
              No se encontró el perfil.
            </p>
          )}

          <div className="perfil-facturacion-wrap">
            <DatosFacturacion />
          </div>

          <section className="perfil-cursos">
            <div className="perfil-cursos-header">
              <div>
                <span className="perfil-section-icon">🎓</span>
                <h2>Mis cursos</h2>
              </div>

              {misCursos.length > 0 && (
                <button
                  type="button"
                  className="perfil-link-btn"
                  onClick={() => navigate("/mis-cursos")}
                >
                  Ver todos →
                </button>
              )}
            </div>

            <div className="perfil-cursos-list">
              {misCursos.length > 0 ? (
                misCursos.slice(0, 3).map((acceso) => (
                  <article
                    key={acceso._id}
                    className="perfil-curso-card"
                    onClick={() =>
                      navigate(`/curso/${acceso.curso._id}/aprender`)
                    }
                  >
                    <div className="perfil-curso-img-wrap">
                      <img
                        src={obtenerImagenCurso(acceso.curso)}
                        alt={acceso.curso?.titulo || "Curso"}
                        className="perfil-curso-img"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder-curso.png";
                        }}
                      />

                      <span className="perfil-curso-chip">En progreso</span>
                    </div>

                    <div className="perfil-curso-body">
                      <h3>{acceso.curso?.titulo || "Curso sin título"}</h3>

                      <div className="perfil-progress-row">
                        <div className="perfil-progress-track">
                          <span
                            style={{
                              width: `${Math.min(acceso.progreso || 0, 100)}%`,
                            }}
                          />
                        </div>
                        <strong>{acceso.progreso || 0}%</strong>
                      </div>

                      <button
                        type="button"
                        className="perfil-btn perfil-btn-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/curso/${acceso.curso._id}/aprender`);
                        }}
                      >
                        Continuar curso
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <div className="perfil-vacio">
                  No tenés cursos comprados todavía.
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </section>
  );
}

export default Perfil;
