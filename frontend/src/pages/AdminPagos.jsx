import { useEffect, useState } from "react";
import api from "../services/api";
import "./AdminPagos.css";

function AdminPagos() {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [procesandoId, setProcesandoId] = useState(null);

  const [modalConfirmacion, setModalConfirmacion] = useState(false);
  const [accionPendiente, setAccionPendiente] = useState(null);
  const [pagoPendiente, setPagoPendiente] = useState(null);

  const obtenerPagos = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/pagos");

      const datos = response.data.datos || response.data || [];

      setPagos(Array.isArray(datos) ? datos : []);
    } catch (error) {
      console.error("Error obteniendo pagos:", error);

      setError(
        error.response?.data?.mensaje || "No se pudieron cargar los pagos.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerPagos();
  }, []);

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
      setError("");

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

      setError(
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

  const obtenerMetodoPago = (metodoPago) => {
    if (!metodoPago) return "-";

    return metodoPago.tipo || metodoPago.nombre || "-";
  };

  const obtenerClaseEstado = (estado) => {
    if (estado === "APROBADO") return "estado-aprobado";
    if (estado === "RECHAZADO") return "estado-rechazado";
    if (estado === "PENDIENTE") return "estado-pendiente";

    return "estado-neutral";
  };

  if (loading) {
    return (
      <section className="admin-pagos">
        <h1>Gestión de pagos</h1>
        <p>Cargando pagos...</p>
      </section>
    );
  }

  return (
    <section className="admin-pagos">
      <div className="admin-pagos-header">
        <div>
          <h1>Gestión de pagos</h1>
          <p>Revisá los pagos generados y aprobá o rechazá transferencias.</p>
        </div>

        <button className="btn-recargar" onClick={obtenerPagos}>
          Recargar
        </button>
      </div>

      {mensaje && <div className="admin-alert success">{mensaje}</div>}
      {error && <div className="admin-alert error">{error}</div>}

      {pagos.length === 0 ? (
        <div className="admin-empty">
          <p>No hay pagos registrados.</p>
        </div>
      ) : (
        <div className="pagos-list">
          {pagos.map((pago) => {
            const estado = pago.estado || "PENDIENTE";
            const estaPendiente = estado === "PENDIENTE";
            const estaProcesando = procesandoId === pago._id;

            return (
              <article key={pago._id} className="pago-card">
                <div className="pago-main">
                  <div>
                    <h3>{obtenerNombreUsuario(pago.usuario)}</h3>

                    <p className="pago-email">
                      {pago.usuario?.email || "Sin email"}
                    </p>

                    <p className="pago-info">
                      Método: {obtenerMetodoPago(pago.metodoPago)}
                    </p>

                    <div className="pago-cursos">
                      <strong>Curso/s:</strong>

                      {pago.compra?.detalles?.length > 0 ? (
                        <ul>
                          {pago.compra.detalles.map((detalle) => (
                            <li key={detalle._id}>
                              {detalle.curso?.titulo || "Curso no disponible"}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span> Sin cursos asociados</span>
                      )}
                    </div>

                    <p className="pago-info">
                      Compra: {pago.compra?._id || pago.compra || "-"}
                    </p>

                    <p className="pago-fecha">
                      Fecha: {formatearFecha(pago.createdAt || pago.fechaPago)}
                    </p>
                  </div>

                  <div className="pago-resumen">
                    <strong>{formatearPrecio(pago.monto)}</strong>

                    <span
                      className={`estado-badge ${obtenerClaseEstado(estado)}`}
                    >
                      {estado}
                    </span>
                  </div>
                </div>

                <div className="pago-actions">
                  {estaPendiente ? (
                    <>
                      <button
                        className="btn-aprobar"
                        disabled={estaProcesando}
                        onClick={() => aprobarPago(pago._id)}
                      >
                        {estaProcesando ? "Procesando..." : "Aprobar"}
                      </button>

                      <button
                        className="btn-rechazar"
                        disabled={estaProcesando}
                        onClick={() => rechazarPago(pago._id)}
                      >
                        Rechazar
                      </button>
                    </>
                  ) : (
                    <span className="pago-resuelto">
                      {estado === "APROBADO" && "Pago ya aprobado"}
                      {estado === "RECHAZADO" && "Pago rechazado"}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {modalConfirmacion && (
        <div className="modal-overlay">
          <div className="modal-confirmacion">
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

            <div className="modal-botones">
              <button
                className="btn-cancelar"
                onClick={cerrarModalConfirmacion}
              >
                Cancelar
              </button>

              <button
                className={
                  accionPendiente === "aprobar"
                    ? "btn-confirmar"
                    : "btn-confirmar btn-confirmar-rechazo"
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
    </section>
  );
}

export default AdminPagos;
