import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import "./AdminPagos.css";

function normalizarFiltroEstado(valor) {
  const estado = String(valor || "").toUpperCase();

  const estadosValidos = ["PENDIENTE", "APROBADO", "RECHAZADO"];

  return estadosValidos.includes(estado) ? estado : "";
}

const METODO_PAGO_INICIAL = {
  nombre: "",
  tipo: "TRANSFERENCIA",
  descripcion: "",
  alias: "",
  cbu: "",
  titular: "",
  activo: true,
};

function AdminPagos() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const estadoInicial = normalizarFiltroEstado(searchParams.get("estado"));

  const [pagos, setPagos] = useState([]);
  const [metodosGestion, setMetodosGestion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMetodos, setLoadingMetodos] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [errorAccion, setErrorAccion] = useState("");
  const [errorCarga, setErrorCarga] = useState("");
  const [procesandoId, setProcesandoId] = useState(null);

  const [busqueda, setBusqueda] = useState("");
  const [filtroMetodo, setFiltroMetodo] = useState("");
  const [filtroEstado, setFiltroEstado] = useState(estadoInicial);

  const [modalConfirmacion, setModalConfirmacion] = useState(false);
  const [accionPendiente, setAccionPendiente] = useState(null);
  const [pagoPendiente, setPagoPendiente] = useState(null);

  const [modalMetodoPago, setModalMetodoPago] = useState(false);
  const [nuevoMetodoPago, setNuevoMetodoPago] = useState(METODO_PAGO_INICIAL);
  const [editandoMetodoId, setEditandoMetodoId] = useState(null);
  const [guardandoMetodoPago, setGuardandoMetodoPago] = useState(false);
  const [procesandoMetodoId, setProcesandoMetodoId] = useState(null);
  const [modalEliminarMetodo, setModalEliminarMetodo] = useState(null);
  const [modalErrorMetodo, setModalErrorMetodo] = useState("");

  const obtenerMetodosPago = async () => {
    try {
      setLoadingMetodos(true);

      const response = await api.get("/api/metodos-pago/admin/todos");
      const datos =
        response.data?.datos ||
        (Array.isArray(response.data) ? response.data : []);

      setMetodosGestion(Array.isArray(datos) ? datos : []);
    } catch (error) {
      console.error("Error obteniendo métodos de pago:", error);
      setErrorAccion(
        error.response?.data?.mensaje ||
          "No se pudieron cargar los métodos de pago.",
      );
      setMetodosGestion([]);
    } finally {
      setLoadingMetodos(false);
    }
  };

  const obtenerPagos = async () => {
    try {
      setLoading(true);
      setErrorCarga("");
      setErrorAccion("");

      const response = await api.get("/api/pagos");
      const datos = response.data.datos || response.data || [];

      setPagos(Array.isArray(datos) ? datos : []);
    } catch (error) {
      console.error("Error obteniendo pagos:", error);

      setPagos([]);
      setErrorCarga(
        error.response?.data?.mensaje || "No se pudieron cargar los pagos.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerPagos();
    obtenerMetodosPago();
  }, []);

  useEffect(() => {
    const estadoUrl = normalizarFiltroEstado(searchParams.get("estado"));

    if (estadoUrl) {
      setFiltroEstado(estadoUrl);
    }
  }, [searchParams]);

  const abrirModalMetodoPago = (metodo = null) => {
    setMensaje("");
    setErrorAccion("");

    if (metodo) {
      setEditandoMetodoId(metodo._id);
      setNuevoMetodoPago({
        nombre: metodo.nombre || "",
        tipo: metodo.tipo || "OTRO",
        descripcion: metodo.descripcion || "",
        alias: metodo.alias || "",
        cbu: metodo.cbu || "",
        titular: metodo.titular || "",
        activo: metodo.activo !== false,
      });
    } else {
      setEditandoMetodoId(null);
      setNuevoMetodoPago(METODO_PAGO_INICIAL);
    }

    setModalMetodoPago(true);
  };

  const cerrarModalMetodoPago = () => {
    setNuevoMetodoPago(METODO_PAGO_INICIAL);
    setEditandoMetodoId(null);
    setModalMetodoPago(false);
  };

  const handleChangeMetodoPago = (e) => {
    const { name, value, type, checked } = e.target;

    setNuevoMetodoPago((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validarMetodoPago = () => {
    const errores = [];

    const nombre = nuevoMetodoPago.nombre.trim();
    const descripcion = nuevoMetodoPago.descripcion.trim();
    const alias = nuevoMetodoPago.alias.trim();
    const cbu = nuevoMetodoPago.cbu.trim();
    const titular = nuevoMetodoPago.titular.trim();

    if (!nombre) {
      errores.push("El nombre del método de pago es obligatorio.");
    } else if (nombre.length < 3) {
      errores.push("El nombre debe tener al menos 3 caracteres.");
    } else if (nombre.length > 60) {
      errores.push("El nombre no puede superar los 60 caracteres.");
    }

    if (!nuevoMetodoPago.tipo) {
      errores.push("El tipo de método de pago es obligatorio.");
    }

    if (descripcion.length > 200) {
      errores.push("La descripción no puede superar los 200 caracteres.");
    }

    if (alias.length > 50) {
      errores.push("El alias no puede superar los 50 caracteres.");
    }

    if (cbu.length > 0 && !/^\d{22}$/.test(cbu)) {
      errores.push("El CBU debe tener 22 números.");
    }

    if (titular.length > 80) {
      errores.push("El titular no puede superar los 80 caracteres.");
    }

    return errores;
  };

  const guardarMetodoPago = async (e) => {
    e.preventDefault();

    setMensaje("");
    setErrorAccion("");

    const errores = validarMetodoPago();

    if (errores.length > 0) {
      setErrorAccion(errores.join(" "));
      return;
    }

    const payload = {
      nombre: nuevoMetodoPago.nombre.trim(),
      tipo: nuevoMetodoPago.tipo,
      descripcion: nuevoMetodoPago.descripcion.trim(),
      alias: nuevoMetodoPago.alias.trim(),
      cbu: nuevoMetodoPago.cbu.trim(),
      titular: nuevoMetodoPago.titular.trim(),
      activo: nuevoMetodoPago.activo,
    };

    try {
      setGuardandoMetodoPago(true);

      if (editandoMetodoId) {
        await api.put(`/api/metodos-pago/${editandoMetodoId}`, payload);
        setMensaje("Método de pago actualizado correctamente.");
      } else {
        await api.post("/api/metodos-pago", payload);
        setMensaje("Método de pago creado correctamente.");
      }

      cerrarModalMetodoPago();

      await Promise.all([obtenerPagos(), obtenerMetodosPago()]);
    } catch (error) {
      console.error("Error creando método de pago:", error);

      setErrorAccion(
        error.response?.data?.mensaje ||
          error.response?.data?.detalle ||
          "No se pudo crear el método de pago.",
      );
    } finally {
      setGuardandoMetodoPago(false);
    }
  };

  const cambiarEstadoMetodoPago = async (metodo) => {
    try {
      setProcesandoMetodoId(metodo._id);
      setMensaje("");
      setErrorAccion("");

      await api.patch(`/api/metodos-pago/${metodo._id}/estado`, {
        activo: metodo.activo === false,
      });

      setMensaje(
        metodo.activo === false
          ? "Método de pago activado correctamente."
          : "Método de pago desactivado correctamente.",
      );

      await obtenerMetodosPago();
    } catch (error) {
      console.error("Error cambiando estado del método:", error);
      setErrorAccion(
        error.response?.data?.mensaje ||
          "No se pudo cambiar el estado del método de pago.",
      );
    } finally {
      setProcesandoMetodoId(null);
    }
  };

  const eliminarMetodoPago = async () => {
    if (!modalEliminarMetodo?._id) return;

    const metodoAEliminar = modalEliminarMetodo;

    try {
      setProcesandoMetodoId(metodoAEliminar._id);
      setMensaje("");
      setErrorAccion("");

      await api.delete(`/api/metodos-pago/${metodoAEliminar._id}`);

      setModalEliminarMetodo(null);
      setMensaje("Método de pago eliminado correctamente.");

      await obtenerMetodosPago();
    } catch (error) {
      console.error("Error eliminando método de pago:", error);

      setModalEliminarMetodo(null);

      setModalErrorMetodo(
        error.response?.data?.mensaje ||
          "No se pudo eliminar el método de pago.",
      );
    } finally {
      setProcesandoMetodoId(null);
    }
  };

  const abrirModalConfirmacion = (pagoId, accion) => {
    setPagoPendiente(pagoId);
    setAccionPendiente(accion);
    setModalConfirmacion(true);
  };

  const cerrarModalConfirmacion = () => {
    setModalConfirmacion(false);
    setPagoPendiente(null);
    setAccionPendiente(null);
  };

  const confirmarAccionPago = async () => {
    if (!pagoPendiente || !accionPendiente) return;

    try {
      setProcesandoId(pagoPendiente);
      setMensaje("");
      setErrorAccion("");

      await api.patch(`/api/pagos/${pagoPendiente}/${accionPendiente}`);

      if (accionPendiente === "aprobar") {
        setMensaje(
          "Pago aprobado correctamente. El acceso al curso fue habilitado.",
        );
      } else {
        setMensaje("Pago rechazado correctamente.");
      }

      setPagos((prev) =>
        prev.map((pago) =>
          pago._id === pagoPendiente
            ? {
                ...pago,
                estado:
                  accionPendiente === "aprobar" ? "APROBADO" : "RECHAZADO",
              }
            : pago,
        ),
      );
    } catch (error) {
      console.error("Error procesando pago:", error);

      setErrorAccion(
        error.response?.data?.mensaje ||
          `No se pudo ${
            accionPendiente === "aprobar" ? "aprobar" : "rechazar"
          } el pago.`,
      );
    } finally {
      setProcesandoId(null);
      cerrarModalConfirmacion();
    }
  };

  const aprobarPago = (pagoId) => {
    abrirModalConfirmacion(pagoId, "aprobar");
  };

  const rechazarPago = (pagoId) => {
    abrirModalConfirmacion(pagoId, "rechazar");
  };

  const aplicarFiltroEstado = (estado) => {
    const estadoNormalizado = normalizarFiltroEstado(estado);

    setFiltroEstado(estadoNormalizado);

    if (estadoNormalizado) {
      navigate(`/admin/pagos?estado=${estadoNormalizado}`, { replace: true });
    } else {
      navigate("/admin/pagos", { replace: true });
    }
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setFiltroMetodo("");
    setFiltroEstado("");
    navigate("/admin/pagos", { replace: true });
  };

  const formatearPrecio = (valor) => {
    return Number(valor || 0).toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    });
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "-";

    return new Date(fecha).toLocaleString("es-AR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const obtenerNombreUsuario = (usuario) => {
    if (!usuario) return "Usuario no disponible";

    const nombreCompleto = `${usuario.nombre || ""} ${
      usuario.apellido || ""
    }`.trim();

    return nombreCompleto || usuario.email || "Usuario sin nombre";
  };

  const obtenerInicialesUsuario = (usuario) => {
    if (!usuario) return "US";

    const nombre = usuario.nombre?.trim()?.[0] || "";
    const apellido = usuario.apellido?.trim()?.[0] || "";

    return `${nombre}${apellido}`.toUpperCase() || "US";
  };

  const obtenerMetodoPago = (metodoPago) => {
    if (!metodoPago) return "-";

    return metodoPago.tipo || metodoPago.nombre || "-";
  };

  const formatearMetodoPago = (metodoPago) => {
    const metodo = obtenerMetodoPago(metodoPago);

    if (metodo === "TRANSFERENCIA") return "Transferencia";
    if (metodo === "TARJETA") return "Tarjeta";
    if (metodo === "MERCADO_PAGO") return "Mercado Pago";
    if (metodo === "EFECTIVO") return "Efectivo";
    if (metodo === "OTRO") return "Otro";

    return metodo;
  };

  const formatearEstado = (estado) => {
    if (estado === "APROBADO") return "Aprobado";
    if (estado === "RECHAZADO") return "Rechazado";
    if (estado === "PENDIENTE") return "Pendiente";

    return estado || "Pendiente";
  };

  const obtenerCursosTexto = (pago) => {
    const detalles = pago.compra?.detalles || [];

    if (detalles.length === 0) return "Sin cursos asociados";

    return detalles
      .map((detalle) => detalle.curso?.titulo || "Curso no disponible")
      .join(", ");
  };

  const pagosFiltrados = useMemo(() => {
    return pagos.filter((pago) => {
      const texto = busqueda.toLowerCase().trim();
      const estado = pago.estado || "PENDIENTE";
      const metodo = obtenerMetodoPago(pago.metodoPago);

      const nombreUsuario = obtenerNombreUsuario(pago.usuario).toLowerCase();
      const emailUsuario = pago.usuario?.email?.toLowerCase() || "";
      const cursosTexto = obtenerCursosTexto(pago).toLowerCase();
      const compraId = String(
        pago.compra?._id || pago.compra || "",
      ).toLowerCase();

      const coincideBusqueda =
        !texto ||
        nombreUsuario.includes(texto) ||
        emailUsuario.includes(texto) ||
        cursosTexto.includes(texto) ||
        compraId.includes(texto);

      const coincideMetodo = !filtroMetodo || metodo === filtroMetodo;
      const coincideEstado = !filtroEstado || estado === filtroEstado;

      return coincideBusqueda && coincideMetodo && coincideEstado;
    });
  }, [pagos, busqueda, filtroMetodo, filtroEstado]);

  const totalPagos = pagos.length;

  const totalAprobados = pagos.filter(
    (pago) => pago.estado === "APROBADO",
  ).length;

  const totalPendientes = pagos.filter(
    (pago) => (pago.estado || "PENDIENTE") === "PENDIENTE",
  ).length;

  const totalRechazados = pagos.filter(
    (pago) => pago.estado === "RECHAZADO",
  ).length;

  const montoTotal = pagos.reduce((total, pago) => {
    return total + Number(pago.monto || 0);
  }, 0);

  const montoAprobado = pagos.reduce((total, pago) => {
    if (pago.estado !== "APROBADO") return total;

    return total + Number(pago.monto || 0);
  }, 0);

  const metodosDisponibles = useMemo(() => {
    const metodos = pagos
      .map((pago) => obtenerMetodoPago(pago.metodoPago))
      .filter((metodo) => metodo && metodo !== "-");

    return [...new Set(metodos)];
  }, [pagos]);

  const hayFiltrosActivos = Boolean(busqueda || filtroMetodo || filtroEstado);

  const obtenerEstadoVacio = () => {
    if (errorCarga) {
      return {
        tipo: "error",
        icono: "⚠️",
        titulo: "No se pudieron cargar los pagos",
        descripcion:
          "Ocurrió un problema al consultar la información. Podés reintentar la carga sin salir de esta pantalla.",
        detalle: errorCarga,
        accionPrincipal: "Reintentar",
        onAccionPrincipal: obtenerPagos,
      };
    }

    if (pagos.length === 0) {
      return {
        tipo: "default",
        icono: "💳",
        titulo: "No hay pagos registrados",
        descripcion:
          "Todavía no se generaron pagos en la plataforma. Cuando un alumno inicie una compra, aparecerá en este listado.",
        accionPrincipal: "Recargar pagos",
        onAccionPrincipal: obtenerPagos,
      };
    }

    if (filtroEstado === "PENDIENTE" && totalPendientes === 0) {
      return {
        tipo: "pending",
        icono: "✓",
        titulo: "No hay pagos pendientes",
        descripcion:
          "No hay pagos esperando revisión manual. Podés ver todos los pagos o recargar la información.",
        accionPrincipal: "Ver todos",
        onAccionPrincipal: () => aplicarFiltroEstado(""),
        accionSecundaria: "Recargar pagos",
        onAccionSecundaria: obtenerPagos,
      };
    }

    if (hayFiltrosActivos && pagosFiltrados.length === 0) {
      return {
        tipo: "filter",
        icono: "🔎",
        titulo: "No hay resultados para los filtros aplicados",
        descripcion:
          "No encontramos pagos que coincidan con la búsqueda o los filtros seleccionados.",
        accionPrincipal: "Limpiar filtros",
        onAccionPrincipal: limpiarFiltros,
        accionSecundaria: "Recargar pagos",
        onAccionSecundaria: obtenerPagos,
      };
    }

    return null;
  };

  const estadoVacio = obtenerEstadoVacio();

  if (loading) {
    return (
      <section className="admin-pagos-page">
        <div className="admin-pagos-shell admin-pagos-loading">
          <div className="admin-pagos-loading-card">
            <span>💳</span>
            <h1>Gestión de pagos</h1>
            <p>Cargando pagos registrados...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-pagos-page">
      <div className="admin-pagos-shell">
        <header className="admin-pagos-header">
          <div>
            <div className="admin-pagos-breadcrumb">
              Dashboard <span>›</span> Pagos
            </div>

            <h1>Gestión de pagos</h1>

            <p>Revisá los pagos generados y aprobá o rechazá transferencias.</p>
          </div>

          <div className="admin-pagos-header-actions">
            <button
              type="button"
              className="admin-pagos-back-btn"
              onClick={() => navigate("/admin")}
            >
              ← Volver al panel
            </button>

            <button
              type="button"
              className="admin-pagos-primary-btn"
              onClick={abrirModalMetodoPago}
            >
              <span>+</span>
              Nuevo método
            </button>
          </div>
        </header>

        <section className="admin-pagos-review-banner">
          <div className="admin-pagos-review-icon">⏳</div>

          <div>
            <span>Pagos pendientes de revisión</span>
            <strong>
              {totalPendientes === 1
                ? "Tenés 1 pago pendiente para revisar"
                : `Tenés ${totalPendientes} pagos pendientes para revisar`}
            </strong>
            <p>
              Desde esta pantalla podés aprobar pagos manuales y habilitar el
              acceso a los cursos comprados.
            </p>
          </div>

          <button
            type="button"
            onClick={() => aplicarFiltroEstado("PENDIENTE")}
            disabled={totalPendientes === 0}
          >
            Ver pendientes
          </button>
        </section>

        {(mensaje || errorAccion) && (
          <div className="admin-pagos-feedback">
            {mensaje && (
              <div className="admin-pagos-alert success">{mensaje}</div>
            )}
            {errorAccion && (
              <div className="admin-pagos-alert error">{errorAccion}</div>
            )}
          </div>
        )}

        {filtroEstado === "PENDIENTE" && totalPendientes > 0 && (
          <div className="admin-pagos-alert info">
            Mostrando pagos pendientes de revisión.
          </div>
        )}

        <section className="admin-pagos-stats">
          <article className="admin-pago-stat-card purple">
            <div className="admin-pago-stat-icon">💳</div>
            <div>
              <span>Total pagos</span>
              <strong>{totalPagos}</strong>
              <p>Registrados</p>
            </div>
          </article>

          <article className="admin-pago-stat-card green">
            <div className="admin-pago-stat-icon">✓</div>
            <div>
              <span>Aprobados</span>
              <strong>{totalAprobados}</strong>
              <p>{formatearPrecio(montoAprobado)}</p>
            </div>
          </article>

          <article className="admin-pago-stat-card gold">
            <div className="admin-pago-stat-icon">⏳</div>
            <div>
              <span>Pendientes</span>
              <strong>{totalPendientes}</strong>
              <p>Requieren revisión</p>
            </div>
          </article>

          <article className="admin-pago-stat-card cyan">
            <div className="admin-pago-stat-icon">↯</div>
            <div>
              <span>Monto total</span>
              <strong>{formatearPrecio(montoTotal)}</strong>
              <p>{totalRechazados} rechazados</p>
            </div>
          </article>
        </section>

        <section className="admin-pagos-quick-filters">
          <button
            type="button"
            className={!filtroEstado ? "active" : ""}
            onClick={() => aplicarFiltroEstado("")}
          >
            Todos
          </button>

          <button
            type="button"
            className={filtroEstado === "PENDIENTE" ? "active pending" : ""}
            onClick={() => aplicarFiltroEstado("PENDIENTE")}
          >
            Pendientes
          </button>

          <button
            type="button"
            className={filtroEstado === "APROBADO" ? "active approved" : ""}
            onClick={() => aplicarFiltroEstado("APROBADO")}
          >
            Aprobados
          </button>

          <button
            type="button"
            className={filtroEstado === "RECHAZADO" ? "active rejected" : ""}
            onClick={() => aplicarFiltroEstado("RECHAZADO")}
          >
            Rechazados
          </button>
        </section>

        <div className="admin-pagos-toolbar">
          <div className="admin-pagos-search">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Buscar por usuario, email, curso o compra..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <label className="admin-pagos-filter">
            <span>Método</span>
            <select
              value={filtroMetodo}
              onChange={(e) => setFiltroMetodo(e.target.value)}
              disabled={errorCarga || pagos.length === 0}
            >
              <option value="">Todos los métodos</option>

              {metodosDisponibles.map((metodo) => (
                <option key={metodo} value={metodo}>
                  {formatearMetodoPago({ tipo: metodo })}
                </option>
              ))}
            </select>
          </label>

          <label className="admin-pagos-filter">
            <span>Estado</span>
            <select
              value={filtroEstado}
              onChange={(e) => aplicarFiltroEstado(e.target.value)}
              disabled={errorCarga || pagos.length === 0}
            >
              <option value="">Todos los estados</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="APROBADO">Aprobado</option>
              <option value="RECHAZADO">Rechazado</option>
            </select>
          </label>

          {hayFiltrosActivos && (
            <button
              type="button"
              className="admin-pagos-secondary-btn"
              onClick={limpiarFiltros}
            >
              Limpiar filtros
            </button>
          )}

          <button
            type="button"
            className="admin-pagos-secondary-btn"
            onClick={obtenerPagos}
          >
            ↻ Recargar
          </button>
        </div>

        <section className="admin-metodos-card">
          <div className="admin-metodos-header">
            <div>
              <h2>Métodos de pago</h2>
              <p>
                Creá, editá, activá o desactivá los medios disponibles en el
                checkout.
              </p>
            </div>

            <span>
              {metodosGestion.length === 1
                ? "1 método"
                : `${metodosGestion.length} métodos`}
            </span>
          </div>

          {loadingMetodos ? (
            <div className="admin-metodos-empty">
              Cargando métodos de pago...
            </div>
          ) : metodosGestion.length === 0 ? (
            <div className="admin-metodos-empty">
              <p>No hay métodos de pago cargados.</p>
              <button type="button" onClick={() => abrirModalMetodoPago()}>
                Crear primer método
              </button>
            </div>
          ) : (
            <div className="admin-metodos-grid">
              {metodosGestion.map((metodo) => {
                const activo = metodo.activo !== false;
                const procesando = procesandoMetodoId === metodo._id;

                return (
                  <article
                    key={metodo._id}
                    className={`admin-metodo-item ${
                      activo ? "activo" : "inactivo"
                    }`}
                  >
                    <div className="admin-metodo-icon">💳</div>

                    <div className="admin-metodo-content">
                      <div className="admin-metodo-title">
                        <h3>{metodo.nombre || formatearMetodoPago(metodo)}</h3>
                        <span className={activo ? "activo" : "inactivo"}>
                          {activo ? "Activo" : "Inactivo"}
                        </span>
                      </div>

                      <p>
                        {metodo.descripcion ||
                          "Sin descripción para este método de pago."}
                      </p>

                      <div className="admin-metodo-meta">
                        <small>
                          Tipo: <strong>{formatearMetodoPago(metodo)}</strong>
                        </small>

                        {metodo.alias && (
                          <small>
                            Alias: <strong>{metodo.alias}</strong>
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="admin-metodo-actions">
                      <button
                        type="button"
                        className="editar"
                        onClick={() => abrirModalMetodoPago(metodo)}
                        disabled={procesando}
                        title="Editar método"
                      >
                        ✎
                      </button>

                      <button
                        type="button"
                        className={activo ? "desactivar" : "activar"}
                        onClick={() => cambiarEstadoMetodoPago(metodo)}
                        disabled={procesando}
                        title={activo ? "Desactivar método" : "Activar método"}
                      >
                        {activo ? "◌" : "✓"}
                      </button>

                      <button
                        type="button"
                        className="eliminar"
                        onClick={() => setModalEliminarMetodo(metodo)}
                        disabled={procesando}
                        title="Eliminar método"
                      >
                        🗑
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <div className="admin-pagos-list-card">
          <div className="admin-pagos-list-header">
            <div>
              <h2>Pagos registrados</h2>
              <p>Listado general de pagos generados en la plataforma.</p>
            </div>

            <span>
              {pagosFiltrados.length === 1
                ? "1 pago"
                : `${pagosFiltrados.length} pagos`}
            </span>
          </div>

          <div className="admin-pagos-list">
            {!estadoVacio && (
              <div className="admin-pagos-table-head">
                <span>Usuario</span>
                <span>Método</span>
                <span>Curso/s</span>
                <span>Compra</span>
                <span>Fecha</span>
                <span>Monto</span>
                <span>Acción</span>
              </div>
            )}

            {estadoVacio ? (
              <div className={`admin-pagos-empty ${estadoVacio.tipo}`}>
                <div className="admin-pagos-empty-icon">
                  {estadoVacio.icono}
                </div>

                <h3>{estadoVacio.titulo}</h3>

                <p>{estadoVacio.descripcion}</p>

                {estadoVacio.detalle && (
                  <small className="admin-pagos-empty-detail">
                    {estadoVacio.detalle}
                  </small>
                )}

                <div className="admin-pagos-empty-actions">
                  {estadoVacio.accionPrincipal && (
                    <button
                      type="button"
                      onClick={estadoVacio.onAccionPrincipal}
                    >
                      {estadoVacio.accionPrincipal}
                    </button>
                  )}

                  {estadoVacio.accionSecundaria && (
                    <button
                      type="button"
                      className="ghost"
                      onClick={estadoVacio.onAccionSecundaria}
                    >
                      {estadoVacio.accionSecundaria}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              pagosFiltrados.map((pago) => {
                const estado = pago.estado || "PENDIENTE";
                const estaPendiente = estado === "PENDIENTE";
                const estaProcesando = procesandoId === pago._id;

                return (
                  <article key={pago._id} className="admin-pago-item">
                    <div className="admin-pago-user">
                      <div className="admin-pago-avatar">
                        {obtenerInicialesUsuario(pago.usuario)}
                      </div>

                      <div>
                        <h3>{obtenerNombreUsuario(pago.usuario)}</h3>
                        <p>{pago.usuario?.email || "Sin email"}</p>
                      </div>
                    </div>

                    <div className="admin-pago-meta">
                      <div>
                        <span>Método</span>
                        <strong>{formatearMetodoPago(pago.metodoPago)}</strong>
                      </div>

                      <div>
                        <span>Curso/s</span>
                        <strong>{obtenerCursosTexto(pago)}</strong>
                      </div>

                      <div>
                        <span>Compra</span>
                        <strong>
                          {pago.compra?._id || pago.compra || "-"}
                        </strong>
                      </div>

                      <div>
                        <span>Fecha</span>
                        <strong>
                          {formatearFecha(pago.createdAt || pago.fechaPago)}
                        </strong>
                      </div>
                    </div>

                    <div className="admin-pago-summary">
                      <strong>{formatearPrecio(pago.monto)}</strong>

                      <span
                        className={`admin-pago-pill ${estado.toLowerCase()}`}
                      >
                        {formatearEstado(estado)}
                      </span>
                    </div>

                    <div className="admin-pago-actions">
                      {estaPendiente ? (
                        <>
                          <button
                            type="button"
                            className="admin-pago-approve-btn"
                            disabled={estaProcesando}
                            onClick={() => aprobarPago(pago._id)}
                            title="Aprobar pago"
                          >
                            ✓
                          </button>

                          <button
                            type="button"
                            className="admin-pago-reject-btn"
                            disabled={estaProcesando}
                            onClick={() => rechazarPago(pago._id)}
                            title="Rechazar pago"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <span className="admin-pago-resolved">
                          {estado === "APROBADO" && "Pago aprobado"}
                          {estado === "RECHAZADO" && "Pago rechazado"}
                        </span>
                      )}
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>

        {modalConfirmacion && (
          <div className="admin-pagos-modal-overlay">
            <div className="admin-pagos-modal">
              <h3>
                {accionPendiente === "aprobar"
                  ? "Confirmar aprobación"
                  : "Confirmar rechazo"}
              </h3>

              <p>
                {accionPendiente === "aprobar"
                  ? "¿Seguro que querés aprobar este pago? Esto habilitará el acceso al curso."
                  : "¿Seguro que querés rechazar este pago? La compra quedará cancelada."}
              </p>

              <div className="admin-pagos-modal-actions">
                <button
                  type="button"
                  className="admin-pagos-modal-cancel"
                  onClick={cerrarModalConfirmacion}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className={
                    accionPendiente === "aprobar"
                      ? "admin-pagos-modal-confirm"
                      : "admin-pagos-modal-confirm danger"
                  }
                  onClick={confirmarAccionPago}
                  disabled={procesandoId === pagoPendiente}
                >
                  {procesandoId === pagoPendiente
                    ? "Procesando..."
                    : accionPendiente === "aprobar"
                      ? "Aprobar"
                      : "Rechazar"}
                </button>
              </div>
            </div>
          </div>
        )}
        {modalEliminarMetodo &&
          createPortal(
            <div className="admin-pagos-modal-overlay">
              <div className="admin-pagos-modal">
                <div className="admin-pagos-modal-icon">🗑</div>

                <h3>Eliminar método de pago</h3>

                <p>
                  ¿Seguro que querés eliminar{" "}
                  <strong>{modalEliminarMetodo.nombre}</strong>? Dejará de estar
                  disponible en el checkout.
                </p>

                <div className="admin-pagos-modal-actions">
                  <button
                    type="button"
                    className="admin-pagos-modal-cancel"
                    onClick={() => setModalEliminarMetodo(null)}
                    disabled={procesandoMetodoId === modalEliminarMetodo._id}
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    className="admin-pagos-modal-confirm danger"
                    onClick={eliminarMetodoPago}
                    disabled={procesandoMetodoId === modalEliminarMetodo._id}
                  >
                    {procesandoMetodoId === modalEliminarMetodo._id
                      ? "Eliminando..."
                      : "Eliminar"}
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )}

        {modalErrorMetodo &&
          createPortal(
            <div className="admin-pagos-modal-overlay">
              <div className="admin-pagos-modal">
                <div className="admin-pagos-modal-icon">⚠️</div>

                <h3>No se puede eliminar</h3>

                <p>{modalErrorMetodo}</p>

                <div className="admin-pagos-modal-actions">
                  <button
                    type="button"
                    className="admin-pagos-modal-confirm"
                    onClick={() => setModalErrorMetodo("")}
                  >
                    Entendido
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )}

        {modalMetodoPago && (
          <div className="admin-pagos-modal-overlay">...</div>
        )}

        {modalMetodoPago && (
          <div className="admin-pagos-modal-overlay">
            <form
              className="admin-pagos-modal admin-pagos-modal-metodo"
              onSubmit={guardarMetodoPago}
            >
              <button
                type="button"
                className="admin-pagos-modal-close"
                onClick={cerrarModalMetodoPago}
                disabled={guardandoMetodoPago}
              >
                ×
              </button>

              <div className="admin-pagos-modal-icon">💳</div>

              <h3>
                {editandoMetodoId
                  ? "Editar método de pago"
                  : "Nuevo método de pago"}
              </h3>

              <p>
                {editandoMetodoId
                  ? "Modificá los datos del método de pago seleccionado."
                  : "Completá los datos para agregar una nueva forma de pago disponible en la plataforma."}
              </p>

              {errorAccion && (
                <div className="admin-pagos-alert error">{errorAccion}</div>
              )}

              <div className="admin-pagos-modal-form-grid">
                <label>
                  <span>Nombre</span>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Ej. Transferencia bancaria"
                    value={nuevoMetodoPago.nombre}
                    onChange={handleChangeMetodoPago}
                    minLength={3}
                    maxLength={60}
                    required
                  />

                  <small className="admin-field-help">
                    {nuevoMetodoPago.nombre.length}/60 caracteres
                  </small>
                </label>

                <label>
                  <span>Tipo</span>
                  <select
                    name="tipo"
                    value={nuevoMetodoPago.tipo}
                    onChange={handleChangeMetodoPago}
                    required
                  >
                    <option value="TRANSFERENCIA">Transferencia</option>
                    <option value="TARJETA">Tarjeta</option>
                    <option value="MERCADO_PAGO">Mercado Pago</option>
                    <option value="EFECTIVO">Efectivo</option>
                    <option value="OTRO">Otro</option>
                  </select>
                </label>

                <label className="admin-pagos-modal-field-full">
                  <span>Descripción</span>
                  <textarea
                    name="descripcion"
                    placeholder="Ej. Pago por transferencia bancaria. Enviar comprobante luego de realizar el pago."
                    value={nuevoMetodoPago.descripcion}
                    onChange={handleChangeMetodoPago}
                    rows={3}
                    maxLength={200}
                  />

                  <small className="admin-field-help">
                    {nuevoMetodoPago.descripcion.length}/200 caracteres
                  </small>
                </label>

                <label>
                  <span>Alias</span>
                  <input
                    type="text"
                    name="alias"
                    placeholder="Ej. mundodev.pagos"
                    value={nuevoMetodoPago.alias}
                    onChange={handleChangeMetodoPago}
                    maxLength={50}
                  />

                  <small className="admin-field-help">
                    {nuevoMetodoPago.alias.length}/50 caracteres
                  </small>
                </label>

                <label>
                  <span>CBU</span>
                  <input
                    type="text"
                    name="cbu"
                    placeholder="22 números"
                    value={nuevoMetodoPago.cbu}
                    onChange={handleChangeMetodoPago}
                    maxLength={22}
                  />

                  <small className="admin-field-help">
                    {nuevoMetodoPago.cbu.length}/22 números
                  </small>
                </label>

                <label className="admin-pagos-modal-field-full">
                  <span>Titular</span>
                  <input
                    type="text"
                    name="titular"
                    placeholder="Ej. Mundo Dev"
                    value={nuevoMetodoPago.titular}
                    onChange={handleChangeMetodoPago}
                    maxLength={80}
                  />

                  <small className="admin-field-help">
                    {nuevoMetodoPago.titular.length}/80 caracteres
                  </small>
                </label>

                <label className="admin-pagos-check">
                  <input
                    type="checkbox"
                    name="activo"
                    checked={nuevoMetodoPago.activo}
                    onChange={handleChangeMetodoPago}
                  />
                  <span>Método activo</span>
                </label>
              </div>

              <div className="admin-pagos-modal-actions">
                <button
                  type="button"
                  className="admin-pagos-modal-cancel"
                  onClick={cerrarModalMetodoPago}
                  disabled={guardandoMetodoPago}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="admin-pagos-modal-confirm"
                  disabled={guardandoMetodoPago}
                >
                  {guardandoMetodoPago
                    ? "Guardando..."
                    : editandoMetodoId
                      ? "Guardar cambios"
                      : "Crear método"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminPagos;
