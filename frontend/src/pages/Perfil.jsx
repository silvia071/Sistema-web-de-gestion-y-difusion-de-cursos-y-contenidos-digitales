import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
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

  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [editandoPassword, setEditandoPassword] = useState(false);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);

  const [contraseniaActual, setContraseniaActual] = useState("");
  const [nuevaContrasenia, setNuevaContrasenia] = useState("");
  const [repetirContrasenia, setRepetirContrasenia] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const syncFormFromUsuario = useCallback((u) => {
    if (!u) return;

    setNombre(u.nombre ?? "");
    setApellido(u.apellido ?? "");
    setDireccion(u.direccion ?? "");
    setTelefono(u.telefono ?? "");
  }, []);

  const clearSessionAndRedirect = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("nombre");
    localStorage.removeItem("apellido");
    localStorage.removeItem("nombreCompleto");
    localStorage.removeItem("carrito");

    navigate("/", { replace: true });
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
    const email = localStorage.getItem("email");

    if (!token) {
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
      const { data } = await api.get("/api/usuarios/me");

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

  const abrirEdicionPerfil = () => {
    setSaveError("");

    if (usuario) {
      syncFormFromUsuario(usuario);
    }

    setEditandoPerfil(true);
  };

  const cancelarEdicionPerfil = () => {
    setSaveError("");

    if (usuario) {
      syncFormFromUsuario(usuario);
    }

    setEditandoPerfil(false);
  };

  const abrirEdicionPassword = () => {
    setPasswordError("");
    setPasswordSuccess("");
    setEditandoPassword(true);
  };

  const cancelarEdicionPassword = () => {
    limpiarFormularioPassword();
    setPasswordError("");
    setPasswordSuccess("");
    setEditandoPassword(false);
  };

  const guardarPerfil = async (e) => {
    e.preventDefault();
    setSaveError("");

    const token = localStorage.getItem("token");

    if (!token) {
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

    const body = {
      nombre: nombreLimpio,
      apellido: apellidoLimpio,
    };

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
      setEditandoPerfil(false);
      return;
    }

    setSaving(true);

    try {
      const { data } = await api.put("/api/usuarios/me", body);

      setUsuario(data.datos);
      syncFormFromUsuario(data.datos);
      setEditandoPerfil(false);

      localStorage.setItem("nombre", data.datos?.nombre || nombreLimpio);
      localStorage.setItem("apellido", data.datos?.apellido || apellidoLimpio);
      localStorage.setItem(
        "nombreCompleto",
        `${data.datos?.nombre || nombreLimpio} ${
          data.datos?.apellido || apellidoLimpio
        }`.trim(),
      );
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
          data?.error ||
            data?.detalle ||
            data?.mensaje ||
            "No se pudo guardar el perfil.",
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const limpiarFormularioPassword = () => {
    setContraseniaActual("");
    setNuevaContrasenia("");
    setRepetirContrasenia("");
  };

  const cambiarPassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    const token = localStorage.getItem("token");

    if (!token) {
      clearSessionAndRedirect();
      return;
    }

    if (!contraseniaActual.trim()) {
      setPasswordError("Ingresá tu contraseña actual.");
      return;
    }

    if (!nuevaContrasenia.trim()) {
      setPasswordError("Ingresá la nueva contraseña.");
      return;
    }

    if (nuevaContrasenia.length < 6) {
      setPasswordError("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (nuevaContrasenia !== repetirContrasenia) {
      setPasswordError("La nueva contraseña y la repetición no coinciden.");
      return;
    }

    if (USE_MOCK_API) {
      setPasswordSuccess("Contraseña actualizada correctamente.");
      limpiarFormularioPassword();
      setEditandoPassword(false);
      return;
    }

    setSavingPassword(true);

    try {
      const { data } = await api.put("/api/usuarios/me/password", {
        contraseniaActual,
        nuevaContrasenia,
      });

      setPasswordSuccess(
        data?.mensaje || "Contraseña actualizada correctamente.",
      );

      limpiarFormularioPassword();
      setEditandoPassword(false);
    } catch (error) {
      if (error.response?.status === 401) {
        clearSessionAndRedirect();
        return;
      }

      const data = error.response?.data;

      setPasswordError(
        data?.error ||
          data?.detalle ||
          data?.mensaje ||
          "No se pudo cambiar la contraseña.",
      );
    } finally {
      setSavingPassword(false);
    }
  };

  const nombreCompleto =
    usuario && (usuario.nombre || usuario.apellido)
      ? `${usuario.nombre ?? ""} ${usuario.apellido ?? ""}`.trim()
      : "";

  const emailMostrado = usuario?.email ?? localStorage.getItem("email") ?? "-";

  const certificadosObtenidos = useMemo(() => {
    return misCursos.filter(
      (acceso) =>
        Number(acceso?.progreso || 0) >= 100 && acceso?.certificadoEmitido,
    ).length;
  }, [misCursos]);

  const cursosPreview = useMemo(() => {
    return [...misCursos]
      .sort((a, b) => Number(b?.progreso || 0) - Number(a?.progreso || 0))
      .slice(0, 3);
  }, [misCursos]);

  return (
    <section className="perfil-page">
      <div className="perfil-shell">
        <aside className="perfil-sidebar">
          <div className="perfil-user">
            <div className="perfil-avatar">
              <img src={logo} alt="Logo Mundo Dev" />
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

            <button
              type="button"
              className="perfil-menu-item"
              onClick={() => navigate("/mis-certificados")}
            >
              <span>🧾</span>
              Mis certificados
            </button>

            <button
              type="button"
              className="perfil-menu-item"
              onClick={() => navigate("/mis-favoritos")}
            >
              <span>💜</span>
              Mis favoritos
            </button>

            <button
              type="button"
              className="perfil-menu-item"
              onClick={() => navigate("/mis-compras")}
            >
              <span>🛒</span>
              Mis compras
            </button>

            <button
              type="button"
              className="perfil-menu-item"
              onClick={() => navigate("/carrito")}
            >
              <span>🛍️</span>
              Mi carrito
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

            <button type="button" onClick={() => navigate("/contactos")}>
              Contactar soporte →
            </button>
          </div>
        </aside>

        <main className="perfil-main">
          <header className="perfil-main-header">
            <div>
              <span className="perfil-eyebrow">Panel de usuario</span>
              <h1>Mi perfil</h1>
              <p>
                Gestioná tu información personal, tus preferencias y tu
                actividad en Mundo Dev.
              </p>
            </div>

            {!editandoPerfil && usuario && (
              <button
                type="button"
                className="perfil-btn perfil-btn-primary"
                onClick={abrirEdicionPerfil}
              >
                ✎ Editar perfil
              </button>
            )}
          </header>

          <section className="perfil-resumen-grid">
            <button
              type="button"
              className="perfil-resumen-card"
              onClick={() => navigate("/mis-cursos")}
            >
              <span className="perfil-resumen-icon azul">🎓</span>

              <div>
                <p>Cursos comprados</p>
                <strong>{misCursos.length}</strong>
                <small>Ver mis cursos →</small>
              </div>
            </button>

            <button
              type="button"
              className="perfil-resumen-card"
              onClick={() => navigate("/mis-certificados")}
            >
              <span className="perfil-resumen-icon violeta">🧾</span>

              <div>
                <p>Certificados</p>
                <strong>{certificadosObtenidos}</strong>
                <small>Ver certificados →</small>
              </div>
            </button>

            <button
              type="button"
              className="perfil-resumen-card"
              onClick={() => navigate("/mis-favoritos")}
            >
              <span className="perfil-resumen-icon rosa">💜</span>

              <div>
                <p>Favoritos</p>
                <strong>—</strong>
                <small>Ver favoritos →</small>
              </div>
            </button>

            <button
              type="button"
              className="perfil-resumen-card"
              onClick={() => navigate("/mis-compras")}
            >
              <span className="perfil-resumen-icon verde">💼</span>

              <div>
                <p>Mis compras</p>
                <strong>Ver</strong>
                <small>Historial de compras →</small>
              </div>
            </button>
          </section>

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
            <section className="perfil-dashboard-grid">
              <article className="perfil-section-card perfil-info-card">
                <div className="perfil-section-header">
                  <div className="perfil-section-title">
                    <span className="perfil-section-icon">👤</span>

                    <div>
                      <h2>Información personal</h2>
                      <p>Datos principales de tu cuenta.</p>
                    </div>
                  </div>
                </div>

                {!editandoPerfil && (
                  <div className="perfil-info-list">
                    <div className="perfil-info-row">
                      <span className="perfil-info-row-icon">👤</span>

                      <div>
                        <span>Nombre completo</span>
                        <strong>{nombreCompleto || "-"}</strong>
                      </div>

                      <button
                        type="button"
                        className="perfil-info-edit-btn"
                        onClick={abrirEdicionPerfil}
                        title="Editar nombre"
                      >
                        ✎
                      </button>
                    </div>

                    <div className="perfil-info-row">
                      <span className="perfil-info-row-icon">✉️</span>

                      <div>
                        <span>Email</span>
                        <strong>{emailMostrado}</strong>
                      </div>

                      <button
                        type="button"
                        className="perfil-info-edit-btn"
                        onClick={abrirEdicionPerfil}
                        title="Editar email"
                      >
                        ✎
                      </button>
                    </div>

                    <div className="perfil-info-row">
                      <span className="perfil-info-row-icon">📞</span>

                      <div>
                        <span>Teléfono</span>
                        <strong>
                          {usuario.telefono?.trim() ? usuario.telefono : "-"}
                        </strong>
                      </div>

                      <button
                        type="button"
                        className="perfil-info-edit-btn"
                        onClick={abrirEdicionPerfil}
                        title="Editar teléfono"
                      >
                        ✎
                      </button>
                    </div>

                    <div className="perfil-info-row">
                      <span className="perfil-info-row-icon">🏠</span>

                      <div>
                        <span>Dirección</span>
                        <strong>
                          {usuario.direccion?.trim() ? usuario.direccion : "-"}
                        </strong>
                      </div>

                      <button
                        type="button"
                        className="perfil-info-edit-btn"
                        onClick={abrirEdicionPerfil}
                        title="Editar dirección"
                      >
                        ✎
                      </button>
                    </div>

                    <div className="perfil-info-row">
                      <span className="perfil-info-row-icon">▣</span>

                      <div>
                        <span>Estado de cuenta</span>
                        <strong className="perfil-badge-active">
                          {usuario.estadoCuenta || "ACTIVO"}
                        </strong>
                      </div>
                    </div>
                  </div>
                )}

                {editandoPerfil && (
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
                        onClick={cancelarEdicionPerfil}
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

              <article className="perfil-section-card perfil-security-card">
                <div className="perfil-section-header perfil-security-header">
                  <div className="perfil-section-title">
                    <span
                      className="perfil-section-icon perfil-security-main-icon"
                      aria-hidden="true"
                    >
                      <svg
                        className="perfil-security-main-svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="6.5"
                          y="10"
                          width="11"
                          height="9"
                          rx="2"
                          fill="#FACC15"
                        />

                        <path
                          d="M8.5 10V7.8C8.5 5.7 9.9 4.2 12 4.2C14.1 4.2 15.5 5.7 15.5 7.8V10"
                          stroke="#FACC15"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />

                        <circle cx="12" cy="14.2" r="1" fill="#7C3AED" />
                      </svg>
                    </span>
                    <div>
                      <h2>Seguridad</h2>
                      <p>Mantené tu cuenta protegida.</p>
                    </div>
                  </div>

                  <div className="perfil-security-visual" aria-hidden="true">
                    <svg
                      className="perfil-security-svg"
                      viewBox="0 0 120 130"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        className="security-shield-fill"
                        d="M60 12 L99 27 V62 C99 89 82 111 60 123 C38 111 21 89 21 62 V27 Z"
                      />

                      <path
                        className="security-shield-stroke"
                        d="M60 12 L99 27 V62 C99 89 82 111 60 123 C38 111 21 89 21 62 V27 Z"
                      />

                      <path
                        className="security-lock-arc"
                        d="M49 68 V58 C49 51 53 46 60 46 C67 46 71 51 71 58 V68"
                      />

                      <rect
                        className="security-lock-body"
                        x="48"
                        y="66"
                        width="24"
                        height="21"
                        rx="4"
                      />

                      <circle
                        className="security-lock-dot"
                        cx="60"
                        cy="77"
                        r="2.2"
                      />
                    </svg>

                    <span className="security-star security-star-1">+</span>
                    <span className="security-star security-star-2">+</span>
                    <span className="security-star security-star-3">+</span>
                    <span className="security-star security-star-4">+</span>
                  </div>
                </div>

                {!editandoPassword && (
                  <>
                    <div className="perfil-security-list">
                      <div className="perfil-security-row perfil-security-row-password">
                        <span>Contraseña</span>

                        <div className="perfil-security-row-content">
                          <strong>••••••••••</strong>

                          <button
                            type="button"
                            className="perfil-security-change-btn"
                            onClick={abrirEdicionPassword}
                          >
                            Cambiar
                          </button>
                        </div>
                      </div>

                      <div className="perfil-security-row">
                        <span>Último cambio</span>
                        <strong>12 mar 2024</strong>
                      </div>

                      <div className="perfil-security-row perfil-security-row-clickable">
                        <span>Autenticación</span>

                        <div className="perfil-security-row-content">
                          <strong>Email y contraseña</strong>
                          <small>›</small>
                        </div>
                      </div>
                    </div>

                    <div className="perfil-security-tip perfil-security-tip-compact">
                      <span className="perfil-security-tip-icon">🔐</span>

                      <div>
                        <h3>Consejo de seguridad</h3>
                        <p>
                          Usá una contraseña segura y única para proteger tu
                          cuenta.
                        </p>
                      </div>

                      <small>›</small>
                    </div>
                  </>
                )}

                {editandoPassword && (
                  <form className="perfil-edit-form" onSubmit={cambiarPassword}>
                    {passwordError && (
                      <p className="perfil-form-error" role="alert">
                        {passwordError}
                      </p>
                    )}

                    {passwordSuccess && (
                      <p className="perfil-form-success" role="status">
                        {passwordSuccess}
                      </p>
                    )}

                    <div className="perfil-security-grid">
                      <div className="perfil-form-group">
                        <label htmlFor="perfil-password-actual">
                          Contraseña actual
                        </label>
                        <input
                          id="perfil-password-actual"
                          type="password"
                          value={contraseniaActual}
                          onChange={(e) => setContraseniaActual(e.target.value)}
                          autoComplete="current-password"
                          placeholder="Ingresá tu contraseña actual"
                        />
                      </div>

                      <div className="perfil-form-group">
                        <label htmlFor="perfil-password-nueva">
                          Nueva contraseña
                        </label>
                        <input
                          id="perfil-password-nueva"
                          type="password"
                          value={nuevaContrasenia}
                          onChange={(e) => setNuevaContrasenia(e.target.value)}
                          autoComplete="new-password"
                          placeholder="Mínimo 6 caracteres"
                        />
                      </div>

                      <div className="perfil-form-group">
                        <label htmlFor="perfil-password-repetir">
                          Repetir nueva contraseña
                        </label>
                        <input
                          id="perfil-password-repetir"
                          type="password"
                          value={repetirContrasenia}
                          onChange={(e) =>
                            setRepetirContrasenia(e.target.value)
                          }
                          autoComplete="new-password"
                          placeholder="Repetí la nueva contraseña"
                        />
                      </div>
                    </div>

                    <div className="perfil-form-actions">
                      <button
                        type="button"
                        className="perfil-btn perfil-btn-secondary"
                        onClick={cancelarEdicionPassword}
                        disabled={savingPassword}
                      >
                        Cancelar
                      </button>

                      <button
                        type="submit"
                        className="perfil-btn perfil-btn-primary"
                        disabled={savingPassword}
                      >
                        {savingPassword
                          ? "Actualizando…"
                          : "Cambiar contraseña"}
                      </button>
                    </div>
                  </form>
                )}
              </article>

              <div className="perfil-facturacion-wrap perfil-facturacion-card">
                <DatosFacturacion />
              </div>
            </section>
          )}

          {!loading && !usuario && !loadError && (
            <p className="perfil-status perfil-status--error" role="alert">
              No se encontró el perfil.
            </p>
          )}

          <section className="perfil-actividad-cursos-grid">
            <article className="perfil-actividad-card">
              <div className="perfil-cursos-header">
                <div>
                  <span className="perfil-section-icon">🕘</span>
                  <h2>Actividad reciente</h2>
                </div>

                <button type="button" className="perfil-link-btn">
                  Ver todo →
                </button>
              </div>

              <div className="perfil-actividad-list">
                <div className="perfil-actividad-item">
                  <span>📚</span>
                  <div>
                    <strong>Continuaste tu aprendizaje</strong>
                    <p>Revisaste tus cursos disponibles.</p>
                  </div>
                </div>

                <div className="perfil-actividad-item">
                  <span>🧾</span>
                  <div>
                    <strong>Certificados disponibles</strong>
                    <p>Tenés {certificadosObtenidos} certificados emitidos.</p>
                  </div>
                </div>

                <div className="perfil-actividad-item">
                  <span>👤</span>
                  <div>
                    <strong>Información de cuenta</strong>
                    <p>Tu perfil se encuentra activo.</p>
                  </div>
                </div>
              </div>
            </article>

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
                {cursosPreview.length > 0 ? (
                  cursosPreview.map((acceso) => (
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

                        <span className="perfil-curso-chip">
                          {Number(acceso.progreso || 0) >= 100
                            ? "Completado"
                            : "En progreso"}
                        </span>
                      </div>

                      <div className="perfil-curso-body">
                        <h3>{acceso.curso?.titulo || "Curso sin título"}</h3>

                        <div className="perfil-progress-row">
                          <div className="perfil-progress-track">
                            <span
                              style={{
                                width: `${Math.min(
                                  acceso.progreso || 0,
                                  100,
                                )}%`,
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
                          {Number(acceso.progreso || 0) >= 100
                            ? "Ver curso"
                            : "Continuar curso"}
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
          </section>
        </main>
      </div>
    </section>
  );
}

export default Perfil;
