import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AdminUsuarios.css";

const USUARIO_INICIAL = {
  nombre: "",
  apellido: "",
  email: "",
  contrasenia: "",
  rol: "CLIENTE",
};

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [procesandoId, setProcesandoId] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  const [modalConfirmacion, setModalConfirmacion] = useState(null);
  const [modalEdicion, setModalEdicion] = useState(null);
  const [modalCrearUsuario, setModalCrearUsuario] = useState(false);

  const navigate = useNavigate();

  const [nuevoUsuario, setNuevoUsuario] = useState(USUARIO_INICIAL);
  const inputNombreRef = useRef(null);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/usuarios");
      setUsuarios(response.data.datos || []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const mostrarError = (err, mensajeDefault) => {
    const erroresValidacion = err.response?.data?.errores;

    if (Array.isArray(erroresValidacion) && erroresValidacion.length > 0) {
      setError(erroresValidacion.map((item) => item.mensaje).join(" - "));
      return;
    }

    setError(
      err.response?.data?.error ||
        err.response?.data?.mensaje ||
        err.response?.data?.detalle ||
        mensajeDefault,
    );
  };

  const mostrarToast = (texto, tipo = "success") => {
    setToast({
      texto,
      tipo,
    });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const limpiarForm = () => {
    setNuevoUsuario(USUARIO_INICIAL);
    setMensaje("");
    setError("");
  };

  const cerrarModalCrearUsuario = () => {
    limpiarForm();
    setModalCrearUsuario(false);
  };

  const handleNuevoUsuario = () => {
    limpiarForm();
    setModalCrearUsuario(true);

    setTimeout(() => {
      inputNombreRef.current?.focus();
    }, 100);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNuevoUsuario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validarFormulario = () => {
    const errores = [];

    const nombre = nuevoUsuario.nombre.trim();
    const apellido = nuevoUsuario.apellido.trim();
    const email = nuevoUsuario.email.trim();
    const contrasenia = nuevoUsuario.contrasenia.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nombre) {
      errores.push("El nombre es obligatorio.");
    } else if (nombre.length < 2) {
      errores.push("El nombre debe tener al menos 2 caracteres.");
    } else if (nombre.length > 50) {
      errores.push("El nombre no puede superar los 50 caracteres.");
    }

    if (!apellido) {
      errores.push("El apellido es obligatorio.");
    } else if (apellido.length < 2) {
      errores.push("El apellido debe tener al menos 2 caracteres.");
    } else if (apellido.length > 50) {
      errores.push("El apellido no puede superar los 50 caracteres.");
    }

    if (!email) {
      errores.push("El email es obligatorio.");
    } else if (!emailRegex.test(email)) {
      errores.push("Ingresá un email válido.");
    } else if (email.length > 100) {
      errores.push("El email no puede superar los 100 caracteres.");
    }

    if (!contrasenia) {
      errores.push("La contraseña es obligatoria.");
    } else if (contrasenia.length < 6) {
      errores.push("La contraseña debe tener al menos 6 caracteres.");
    } else if (contrasenia.length > 30) {
      errores.push("La contraseña no puede superar los 30 caracteres.");
    }

    if (!["CLIENTE", "ADMINISTRADOR"].includes(nuevoUsuario.rol)) {
      errores.push("El rol seleccionado no es válido.");
    }

    return errores;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    const errores = validarFormulario();

    if (errores.length > 0) {
      setError(errores.join(" "));
      return;
    }

    try {
      setGuardando(true);

      const usuarioAEnviar = {
        nombre: nuevoUsuario.nombre.trim(),
        apellido: nuevoUsuario.apellido.trim(),
        email: nuevoUsuario.email.trim().toLowerCase(),
        contrasenia: nuevoUsuario.contrasenia.trim(),
        rol: nuevoUsuario.rol,
      };

      await api.post("/api/usuarios", usuarioAEnviar);

      const textoExito = "Usuario creado correctamente.";
      setMensaje(textoExito);
      mostrarToast(textoExito, "success");

      setNuevoUsuario(USUARIO_INICIAL);
      setModalCrearUsuario(false);

      await cargarUsuarios();
    } catch (err) {
      console.error(err);
      mostrarError(err, "Error al crear usuario.");
    } finally {
      setGuardando(false);
    }
  };

  const obtenerEstadoUsuario = (usuario) => {
    return usuario?.estadoCuenta || "ACTIVO";
  };

  const obtenerIdUsuario = (usuario) => {
    return usuario?._id || usuario?.id;
  };

  const esUsuarioActual = (usuario) => {
    const userId = localStorage.getItem("userId");
    const usuarioId = obtenerIdUsuario(usuario);

    return userId && usuarioId && usuarioId.toString() === userId.toString();
  };

  const abrirModalConfirmacion = (tipo, usuario) => {
    setMensaje("");
    setError("");

    const usuarioId = obtenerIdUsuario(usuario);

    if (!usuarioId) {
      setError("No se pudo obtener el ID del usuario.");
      return;
    }

    if (esUsuarioActual(usuario) && tipo !== "editar") {
      if (tipo === "rol") {
        setError("No podés cambiar tu propio rol desde esta pantalla.");
      }

      if (tipo === "estado") {
        setError("No podés bloquear tu propia cuenta desde esta pantalla.");
      }

      if (tipo === "eliminar") {
        setError("No podés dar de baja tu propia cuenta desde esta pantalla.");
      }

      return;
    }

    let titulo = "";
    let descripcion = "";
    let textoBoton = "";
    let icono = "⇄";

    if (tipo === "rol") {
      const nuevoRol =
        usuario.rol === "ADMINISTRADOR" ? "CLIENTE" : "ADMINISTRADOR";

      titulo = "Cambiar rol";
      descripcion = `¿Querés cambiar el rol de ${usuario.nombre} ${usuario.apellido} a ${formatearRol(nuevoRol)}?`;
      textoBoton = "Cambiar rol";
      icono = "⇄";
    }

    if (tipo === "estado") {
      const estadoActual = obtenerEstadoUsuario(usuario);
      const debeActivar = estadoActual === "BLOQUEADO";

      titulo = debeActivar ? "Activar usuario" : "Bloquear usuario";
      descripcion = `¿Seguro que querés ${
        debeActivar ? "activar" : "bloquear"
      } a ${usuario.nombre} ${usuario.apellido}?`;
      textoBoton = debeActivar ? "Activar" : "Bloquear";
      icono = debeActivar ? "✓" : "⛔";
    }

    if (tipo === "eliminar") {
      titulo = "Dar de baja usuario";
      descripcion = `¿Seguro que querés dar de baja a ${usuario.nombre} ${usuario.apellido}? El usuario quedará bloqueado y podrá ser reactivado más adelante.`;
      textoBoton = "Dar de baja";
      icono = "⛔";
    }

    setModalConfirmacion({
      tipo,
      usuario,
      titulo,
      descripcion,
      textoBoton,
      icono,
    });
  };

  const cerrarModalConfirmacion = () => {
    setModalConfirmacion(null);
  };

  const confirmarAccionUsuario = async () => {
    if (!modalConfirmacion || !modalConfirmacion.usuario) return;

    setMensaje("");
    setError("");

    const { tipo, usuario } = modalConfirmacion;
    const usuarioId = obtenerIdUsuario(usuario);

    if (!usuarioId) {
      setError("No se pudo obtener el ID del usuario.");
      return;
    }

    try {
      setProcesandoId(usuarioId);

      if (tipo === "rol") {
        const nuevoRol =
          usuario.rol === "ADMINISTRADOR" ? "CLIENTE" : "ADMINISTRADOR";

        await api.put(`/api/usuarios/rol/${usuarioId}`, {
          nuevoRol,
        });

        setMensaje("Rol actualizado correctamente.");
      }

      if (tipo === "estado") {
        const estadoActual = obtenerEstadoUsuario(usuario);
        const debeActivar = estadoActual === "BLOQUEADO";
        const endpoint = debeActivar ? "activar" : "bloquear";

        await api.put(`/api/usuarios/${endpoint}/${usuarioId}`);

        const textoExito = debeActivar
          ? `Usuario ${usuario.nombre} ${usuario.apellido} activado correctamente.`
          : `Usuario ${usuario.nombre} ${usuario.apellido} bloqueado correctamente.`;

        setMensaje(textoExito);
        mostrarToast(textoExito, "success");
      }

      if (tipo === "eliminar") {
        await api.delete(`/api/usuarios/${usuarioId}`);

        setMensaje("Usuario dado de baja correctamente.");
      }

      setModalConfirmacion(null);
      await cargarUsuarios();
    } catch (err) {
      console.error(err);
      mostrarError(err, "No se pudo completar la acción.");
    } finally {
      setProcesandoId("");
    }
  };

  const abrirModalEdicion = (usuario) => {
    setMensaje("");
    setError("");

    const usuarioId = obtenerIdUsuario(usuario);

    if (!usuarioId) {
      setError("No se pudo obtener el ID del usuario.");
      return;
    }

    setModalEdicion({
      usuario,
      nombre: usuario.nombre || "",
      apellido: usuario.apellido || "",
      telefono: usuario.telefono || "",
      direccion: usuario.direccion || "",
    });
  };

  const cerrarModalEdicion = () => {
    setModalEdicion(null);
  };

  const guardarEdicionUsuario = async (e) => {
    e.preventDefault();

    if (!modalEdicion?.usuario) return;

    setMensaje("");
    setError("");

    const usuarioId = obtenerIdUsuario(modalEdicion.usuario);

    if (!usuarioId) {
      setError("No se pudo obtener el ID del usuario.");
      return;
    }

    const nombreLimpio = modalEdicion.nombre.trim();
    const apellidoLimpio = modalEdicion.apellido.trim();
    const telefonoLimpio = modalEdicion.telefono.trim();
    const direccionLimpia = modalEdicion.direccion.trim();

    if (!nombreLimpio) {
      setError("El nombre es obligatorio.");
      return;
    }

    if (nombreLimpio.length < 2 || nombreLimpio.length > 50) {
      setError("El nombre debe tener entre 2 y 50 caracteres.");
      return;
    }

    if (!apellidoLimpio) {
      setError("El apellido es obligatorio.");
      return;
    }

    if (apellidoLimpio.length < 2 || apellidoLimpio.length > 50) {
      setError("El apellido debe tener entre 2 y 50 caracteres.");
      return;
    }

    if (telefonoLimpio.length > 30) {
      setError("El teléfono no puede superar los 30 caracteres.");
      return;
    }

    if (direccionLimpia.length > 120) {
      setError("La dirección no puede superar los 120 caracteres.");
      return;
    }

    try {
      setProcesandoId(usuarioId);

      const body = {
        nombre: nombreLimpio,
        apellido: apellidoLimpio,
      };

      if (telefonoLimpio) body.telefono = telefonoLimpio;
      if (direccionLimpia) body.direccion = direccionLimpia;

      await api.put(`/api/usuarios/perfil/${usuarioId}`, body);

      setMensaje("Usuario editado correctamente.");
      setModalEdicion(null);

      await cargarUsuarios();
    } catch (err) {
      console.error(err);
      mostrarError(err, "No se pudo editar el usuario.");
    } finally {
      setProcesandoId("");
    }
  };

  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((usuario) => {
      const texto = busqueda.toLowerCase().trim();

      const coincideBusqueda =
        !texto ||
        usuario.nombre?.toLowerCase().includes(texto) ||
        usuario.apellido?.toLowerCase().includes(texto) ||
        usuario.email?.toLowerCase().includes(texto);

      const coincideRol = !filtroRol || usuario.rol === filtroRol;

      const estadoUsuario = obtenerEstadoUsuario(usuario);
      const coincideEstado = !filtroEstado || estadoUsuario === filtroEstado;

      return coincideBusqueda && coincideRol && coincideEstado;
    });
  }, [usuarios, busqueda, filtroRol, filtroEstado]);

  const totalUsuarios = usuarios.length;

  const totalActivos = usuarios.filter(
    (usuario) => obtenerEstadoUsuario(usuario) === "ACTIVO",
  ).length;

  const totalBloqueados = usuarios.filter(
    (usuario) => obtenerEstadoUsuario(usuario) === "BLOQUEADO",
  ).length;

  const totalAdmins = usuarios.filter(
    (usuario) => usuario.rol === "ADMINISTRADOR",
  ).length;

  const totalClientes = usuarios.filter(
    (usuario) => usuario.rol === "CLIENTE",
  ).length;

  const hayFiltrosActivos = Boolean(
    busqueda.trim() || filtroRol || filtroEstado,
  );

  const limpiarFiltros = () => {
    setBusqueda("");
    setFiltroRol("");
    setFiltroEstado("");
  };

  const obtenerIniciales = (usuario) => {
    const nombre = usuario.nombre?.trim()?.[0] || "";
    const apellido = usuario.apellido?.trim()?.[0] || "";

    return `${nombre}${apellido}`.toUpperCase() || "US";
  };

  const formatearRol = (rol) => {
    if (rol === "ADMINISTRADOR") return "Administrador";
    if (rol === "CLIENTE") return "Cliente";
    return rol || "-";
  };

  const formatearEstado = (estado) => {
    if (estado === "ACTIVO") return "Activo";
    if (estado === "BLOQUEADO") return "Bloqueado";
    if (estado === "PENDIENTE") return "Pendiente";
    return estado || "Activo";
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "-";

    return new Date(fecha).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <section className="admin-usuarios-page">
      <div className="admin-usuarios-shell">
        <header className="admin-usuarios-header">
          <div>
            <div className="admin-usuarios-breadcrumb">
              Dashboard <span>›</span> Usuarios
            </div>

            <h1>Gestión de usuarios</h1>

            <p>Administrá usuarios, roles y accesos de la plataforma.</p>
          </div>

          <div className="admin-usuarios-header-actions">
            <button
              type="button"
              className="admin-usuarios-back-btn"
              onClick={() => navigate("/admin")}
            >
              ← Volver al panel
            </button>

            <button
              type="button"
              className="admin-usuarios-primary-btn"
              onClick={handleNuevoUsuario}
            >
              <span>+</span>
              Nuevo usuario
            </button>
          </div>
        </header>

        {(error || mensaje) && !modalCrearUsuario && !modalEdicion && (
          <div className="admin-usuarios-feedback">
            {error && <div className="admin-usuarios-alert error">{error}</div>}

            {mensaje && (
              <div className="admin-usuarios-alert success">{mensaje}</div>
            )}
          </div>
        )}

        <section className="admin-usuarios-stats">
          <article className="admin-usuario-stat-card purple">
            <div className="admin-stat-icon">👥</div>
            <div>
              <span>Total usuarios</span>
              <strong>{totalUsuarios}</strong>
              <p>En la plataforma</p>
            </div>
          </article>

          <article className="admin-usuario-stat-card green">
            <div className="admin-stat-icon">✓</div>
            <div>
              <span>Activos</span>
              <strong>{totalActivos}</strong>
              <p>Usuarios habilitados</p>
            </div>
          </article>

          <article className="admin-usuario-stat-card gold">
            <div className="admin-stat-icon">⚙</div>
            <div>
              <span>Administradores</span>
              <strong>{totalAdmins}</strong>
              <p>Acceso completo</p>
            </div>
          </article>

          <article className="admin-usuario-stat-card cyan">
            <div className="admin-stat-icon">●</div>
            <div>
              <span>Clientes</span>
              <strong>{totalClientes}</strong>
              <p>Usuarios compradores</p>
            </div>
          </article>
        </section>

        <div className="admin-usuarios-toolbar">
          <div className="admin-usuarios-search">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Buscar usuarios por nombre, email o apellido..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <label className="admin-usuarios-filter">
            <span>Rol</span>
            <select
              value={filtroRol}
              onChange={(e) => setFiltroRol(e.target.value)}
            >
              <option value="">Todos los roles</option>
              <option value="CLIENTE">Cliente</option>
              <option value="ADMINISTRADOR">Administrador</option>
            </select>
          </label>

          <label className="admin-usuarios-filter">
            <span>Estado</span>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="ACTIVO">Activo</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="BLOQUEADO">Bloqueado</option>
            </select>
          </label>

          <button
            type="button"
            className="admin-usuarios-secondary-btn"
            onClick={cargarUsuarios}
          >
            ↻ Recargar
          </button>
        </div>

        <div className="admin-usuarios-dashboard-grid">
          <div className="admin-usuarios-list-card admin-usuarios-list-card-full">
            <div className="admin-usuarios-list-header">
              <div>
                <h2>Usuarios registrados</h2>
                <p>Listado general de usuarios cargados en la plataforma.</p>
              </div>

              <span>{usuariosFiltrados.length} usuarios</span>
            </div>

            <div className="admin-usuarios-list">
              {loading ? (
                <div className="admin-usuarios-empty-card loading">
                  <div className="admin-usuarios-empty-icon">👥</div>

                  <h3>Cargando usuarios</h3>

                  <p>
                    Estamos consultando los usuarios registrados en la
                    plataforma.
                  </p>
                </div>
              ) : usuariosFiltrados.length === 0 ? (
                <div
                  className={`admin-usuarios-empty-card ${
                    usuarios.length === 0 ? "empty" : "filter"
                  }`}
                >
                  <div className="admin-usuarios-empty-icon">
                    {usuarios.length === 0 ? "👥" : "🔎"}
                  </div>

                  <h3>
                    {usuarios.length === 0
                      ? "No hay usuarios registrados"
                      : "No se encontraron usuarios"}
                  </h3>

                  <p>
                    {usuarios.length === 0
                      ? "Todavía no hay usuarios cargados en la plataforma. Cuando se registre o crees un usuario, aparecerá en este listado."
                      : "No hay usuarios que coincidan con la búsqueda, el rol o el estado seleccionado."}
                  </p>

                  <div className="admin-usuarios-empty-actions">
                    {hayFiltrosActivos && usuarios.length > 0 && (
                      <button type="button" onClick={limpiarFiltros}>
                        Limpiar filtros
                      </button>
                    )}

                    <button
                      type="button"
                      className="ghost"
                      onClick={cargarUsuarios}
                    >
                      Recargar usuarios
                    </button>

                    {usuarios.length === 0 && (
                      <button type="button" onClick={handleNuevoUsuario}>
                        Crear usuario
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                usuariosFiltrados.map((usuario) => {
                  const usuarioId = obtenerIdUsuario(usuario);
                  const estadoUsuario = obtenerEstadoUsuario(usuario);
                  const usuarioActual = esUsuarioActual(usuario);
                  const estaProcesando = procesandoId === usuarioId;

                  return (
                    <article key={usuarioId} className="admin-usuario-item">
                      <div className="admin-usuario-main">
                        <div className="admin-usuario-avatar">
                          {obtenerIniciales(usuario)}
                        </div>

                        <div>
                          <h3>
                            {usuario.nombre} {usuario.apellido}
                          </h3>
                          <p>{usuario.email}</p>
                        </div>
                      </div>

                      <div className="admin-usuario-meta">
                        <div>
                          <span>Rol</span>
                          <strong
                            className={`admin-usuario-pill rol ${usuario.rol?.toLowerCase()}`}
                          >
                            {formatearRol(usuario.rol)}
                          </strong>
                        </div>

                        <div>
                          <span>Estado</span>
                          <strong
                            className={`admin-usuario-pill estado ${estadoUsuario.toLowerCase()}`}
                          >
                            {formatearEstado(estadoUsuario)}
                          </strong>
                        </div>

                        <div className="admin-usuario-date">
                          <span>Registrado</span>
                          <strong>
                            {formatearFecha(
                              usuario.createdAt || usuario.fechaCreacion,
                            )}
                          </strong>
                        </div>
                      </div>

                      <div className="admin-usuario-actions">
                        <button
                          type="button"
                          className="admin-usuario-edit-btn"
                          title="Editar usuario"
                          onClick={() => abrirModalEdicion(usuario)}
                          disabled={estaProcesando}
                        >
                          ✎
                        </button>

                        <button
                          type="button"
                          className="admin-usuario-role-btn"
                          title="Cambiar rol"
                          onClick={() => abrirModalConfirmacion("rol", usuario)}
                          disabled={estaProcesando || usuarioActual}
                        >
                          ⇄
                        </button>

                        <button
                          type="button"
                          className="admin-usuario-status-btn"
                          title={
                            estadoUsuario === "BLOQUEADO"
                              ? "Activar usuario"
                              : "Bloquear usuario"
                          }
                          onClick={() =>
                            abrirModalConfirmacion("estado", usuario)
                          }
                          disabled={estaProcesando || usuarioActual}
                        >
                          {estadoUsuario === "BLOQUEADO" ? "✓" : "⛔"}
                        </button>

                        <button
                          type="button"
                          className="admin-usuario-delete-btn"
                          title="Dar de baja usuario"
                          onClick={() =>
                            abrirModalConfirmacion("eliminar", usuario)
                          }
                          disabled={estaProcesando || usuarioActual}
                        >
                          ⛔
                        </button>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {totalBloqueados > 0 && (
          <div className="admin-usuarios-alert warning">
            Hay {totalBloqueados} usuario(s) bloqueado(s) o inactivo(s).
          </div>
        )}
      </div>

      {modalCrearUsuario && (
        <div className="admin-modal-overlay">
          <form
            className="admin-modal-card admin-modal-form admin-modal-usuario"
            onSubmit={handleSubmit}
          >
            <button
              type="button"
              className="admin-modal-close"
              onClick={cerrarModalCrearUsuario}
              disabled={guardando}
            >
              ×
            </button>

            <div className="admin-modal-icon">♙</div>

            <h2>Crear nuevo usuario</h2>

            <p>
              Completá los datos para crear un nuevo usuario en la plataforma.
            </p>

            {error && <div className="admin-usuarios-alert error">{error}</div>}

            <div className="admin-modal-form-grid">
              <label>
                <span>Nombre</span>
                <input
                  ref={inputNombreRef}
                  type="text"
                  name="nombre"
                  placeholder="Ej. Juan"
                  value={nuevoUsuario.nombre}
                  onChange={handleChange}
                  minLength={2}
                  maxLength={50}
                  required
                />

                <small className="admin-field-help">
                  {nuevoUsuario.nombre.length}/50 caracteres
                </small>
              </label>

              <label>
                <span>Apellido</span>
                <input
                  type="text"
                  name="apellido"
                  placeholder="Ej. Pérez"
                  value={nuevoUsuario.apellido}
                  onChange={handleChange}
                  minLength={2}
                  maxLength={50}
                  required
                />

                <small className="admin-field-help">
                  {nuevoUsuario.apellido.length}/50 caracteres
                </small>
              </label>

              <label>
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  placeholder="Ej. juan.perez@correo.com"
                  value={nuevoUsuario.email}
                  onChange={handleChange}
                  maxLength={100}
                  required
                />

                <small className="admin-field-help">
                  {nuevoUsuario.email.length}/100 caracteres
                </small>
              </label>

              <label>
                <span>Contraseña</span>
                <input
                  type="password"
                  name="contrasenia"
                  placeholder="Mínimo 6 caracteres"
                  value={nuevoUsuario.contrasenia}
                  onChange={handleChange}
                  minLength={6}
                  maxLength={30}
                  required
                />

                <small className="admin-field-help">
                  {nuevoUsuario.contrasenia.length}/30 caracteres
                </small>
              </label>

              <label>
                <span>Rol</span>
                <select
                  name="rol"
                  value={nuevoUsuario.rol}
                  onChange={handleChange}
                  required
                >
                  <option value="CLIENTE">Cliente</option>
                  <option value="ADMINISTRADOR">Administrador</option>
                </select>
              </label>
            </div>

            <div className="admin-modal-actions">
              <button
                type="button"
                className="admin-modal-cancel"
                onClick={cerrarModalCrearUsuario}
                disabled={guardando}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="admin-modal-confirm"
                disabled={guardando}
              >
                {guardando ? "Creando..." : "Crear usuario"}
              </button>
            </div>

            <div className="admin-usuarios-permission-card">
              <div>🛡</div>
              <p>
                Los usuarios con rol <strong>Administrador</strong> tienen
                acceso completo al panel.
              </p>
            </div>
          </form>
        </div>
      )}

      {modalConfirmacion && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card">
            <div className="admin-modal-icon">{modalConfirmacion.icono}</div>

            <h2>{modalConfirmacion.titulo}</h2>

            <p>{modalConfirmacion.descripcion}</p>

            <div className="admin-modal-actions">
              <button
                type="button"
                className="admin-modal-cancel"
                onClick={cerrarModalConfirmacion}
                disabled={
                  procesandoId === obtenerIdUsuario(modalConfirmacion.usuario)
                }
              >
                Cancelar
              </button>

              <button
                type="button"
                className={
                  modalConfirmacion.tipo === "eliminar"
                    ? "admin-modal-danger"
                    : "admin-modal-confirm"
                }
                onClick={confirmarAccionUsuario}
                disabled={
                  procesandoId === obtenerIdUsuario(modalConfirmacion.usuario)
                }
              >
                {procesandoId === obtenerIdUsuario(modalConfirmacion.usuario)
                  ? "Procesando..."
                  : modalConfirmacion.textoBoton}
              </button>
            </div>
          </div>
        </div>
      )}

      {modalEdicion && (
        <div className="admin-modal-overlay">
          <form
            className="admin-modal-card admin-modal-form"
            onSubmit={guardarEdicionUsuario}
          >
            <div className="admin-modal-icon">✎</div>

            <h2>Editar usuario</h2>

            <p>
              Modificá los datos básicos de {modalEdicion.usuario.nombre}{" "}
              {modalEdicion.usuario.apellido}.
            </p>

            {error && <div className="admin-usuarios-alert error">{error}</div>}

            <div className="admin-modal-form-grid">
              <label>
                <span>Nombre</span>
                <input
                  type="text"
                  value={modalEdicion.nombre}
                  minLength={2}
                  maxLength={50}
                  onChange={(e) =>
                    setModalEdicion((prev) => ({
                      ...prev,
                      nombre: e.target.value,
                    }))
                  }
                  required
                />

                <small className="admin-field-help">
                  {modalEdicion.nombre.length}/50 caracteres
                </small>
              </label>

              <label>
                <span>Apellido</span>
                <input
                  type="text"
                  value={modalEdicion.apellido}
                  minLength={2}
                  maxLength={50}
                  onChange={(e) =>
                    setModalEdicion((prev) => ({
                      ...prev,
                      apellido: e.target.value,
                    }))
                  }
                  required
                />

                <small className="admin-field-help">
                  {modalEdicion.apellido.length}/50 caracteres
                </small>
              </label>

              <label>
                <span>Teléfono</span>
                <input
                  type="text"
                  value={modalEdicion.telefono}
                  maxLength={30}
                  onChange={(e) =>
                    setModalEdicion((prev) => ({
                      ...prev,
                      telefono: e.target.value,
                    }))
                  }
                  placeholder="Opcional"
                />

                <small className="admin-field-help">
                  {modalEdicion.telefono.length}/30 caracteres
                </small>
              </label>

              <label>
                <span>Dirección</span>
                <input
                  type="text"
                  value={modalEdicion.direccion}
                  maxLength={120}
                  onChange={(e) =>
                    setModalEdicion((prev) => ({
                      ...prev,
                      direccion: e.target.value,
                    }))
                  }
                  placeholder="Opcional"
                />

                <small className="admin-field-help">
                  {modalEdicion.direccion.length}/120 caracteres
                </small>
              </label>
            </div>

            <div className="admin-modal-actions">
              <button
                type="button"
                className="admin-modal-cancel"
                onClick={cerrarModalEdicion}
                disabled={!!procesandoId}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="admin-modal-confirm"
                disabled={!!procesandoId}
              >
                {procesandoId ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>
      )}

      {toast && (
        <div className={`admin-toast ${toast.tipo}`}>
          <div className="admin-toast-icon">
            {toast.tipo === "success" ? "✓" : "!"}
          </div>

          <div>
            <strong>Acción realizada</strong>
            <p>{toast.texto}</p>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminUsuarios;
