import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./MisCompras.css";

function formatearPrecio(valor) {
  const numero = Number(valor || 0);

  return numero.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
}

function formatearFecha(fecha, conHora = false) {
  if (!fecha) return "Sin fecha";

  const opciones = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  if (conHora) {
    opciones.hour = "2-digit";
    opciones.minute = "2-digit";
  }

  return new Date(fecha).toLocaleDateString("es-AR", opciones);
}

function obtenerCursosCompra(compra) {
  return Array.isArray(compra?.detalles) ? compra.detalles : [];
}

function normalizarEstado(estado) {
  return String(estado || "PENDIENTE").toUpperCase();
}

function obtenerClaseEstado(estado) {
  const estadoNormalizado = normalizarEstado(estado);

  if (
    estadoNormalizado === "PAGADA" ||
    estadoNormalizado === "APROBADA" ||
    estadoNormalizado === "COMPLETADA"
  ) {
    return "pagada";
  }

  if (estadoNormalizado === "PENDIENTE" || estadoNormalizado === "EN_PROCESO") {
    return "pendiente";
  }

  if (estadoNormalizado === "CANCELADA" || estadoNormalizado === "RECHAZADA") {
    return "cancelada";
  }

  return "";
}

function obtenerMetodoPago(compra) {
  const metodo =
    compra?.pago?.metodoPago ||
    compra?.pago?.metodo ||
    compra?.metodoPago ||
    compra?.medioPago ||
    compra?.formaPago ||
    "";

  const metodoNormalizado = String(metodo).toUpperCase();
  const estadoNormalizado = normalizarEstado(compra?.estado);

  if (metodoNormalizado.includes("TRANSFERENCIA")) {
    return {
      sigla: "TB",
      texto: "Transferencia bancaria",
    };
  }

  if (
    metodoNormalizado.includes("MERCADO") ||
    metodoNormalizado.includes("BILLETERA")
  ) {
    return {
      sigla: "MP",
      texto: "Mercado Pago",
    };
  }

  if (metodoNormalizado.includes("TARJETA")) {
    return {
      sigla: "TC",
      texto: "Tarjeta",
    };
  }

  if (estadoNormalizado === "PENDIENTE") {
    return {
      sigla: "TB",
      texto: "Transferencia bancaria",
    };
  }

  return {
    sigla: "MP",
    texto: "Mercado Pago",
  };
}

function compraHabilitada(estado) {
  const estadoNormalizado = normalizarEstado(estado);

  return (
    estadoNormalizado === "PAGADA" ||
    estadoNormalizado === "APROBADA" ||
    estadoNormalizado === "COMPLETADA"
  );
}

function obtenerIconoCurso(titulo = "") {
  const texto = titulo.toLowerCase();

  if (texto.includes("javascript")) return "JS";
  if (texto.includes("react")) return "⚛";
  if (texto.includes("html")) return "H";
  if (texto.includes("css")) return "C";
  if (texto.includes("api")) return "API";
  if (texto.includes("node")) return "ND";
  if (texto.includes("python")) return "PY";
  if (texto.includes("java")) return "JV";
  if (texto.includes("sql")) return "SQL";

  return "📘";
}

function limpiarHtml(valor) {
  return String(valor || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function obtenerDatoLocalStorage(clave) {
  const valor = localStorage.getItem(clave);
  return valor && valor !== "null" && valor !== "undefined" ? valor : "";
}

function obtenerDatosCliente(compra) {
  const usuario = compra?.usuario || {};

  const nombreLocal =
    obtenerDatoLocalStorage("nombreCompleto") ||
    `${obtenerDatoLocalStorage("nombre")} ${obtenerDatoLocalStorage(
      "apellido",
    )}`.trim();

  const nombre =
    `${usuario.nombre || ""} ${usuario.apellido || ""}`.trim() ||
    nombreLocal ||
    "Cliente";

  const email =
    usuario.email || obtenerDatoLocalStorage("email") || "Sin email";

  return {
    nombre,
    email,
  };
}

function imprimirComprobante(compra) {
  if (!compra) return;

  const detalles = obtenerCursosCompra(compra);
  const cliente = obtenerDatosCliente(compra);
  const orden = String(compra._id || compra.id || "").slice(-6);
  const fecha = formatearFecha(compra.createdAt || compra.fechaCompra, true);
  const estado = normalizarEstado(compra.estado);
  const total = formatearPrecio(compra.total);

  const cursosHtml = detalles
    .map((detalle) => {
      const titulo = detalle?.curso?.titulo || "Curso sin título";
      const descripcion =
        detalle?.curso?.descripcion ||
        detalle?.curso?.categoria?.nombre ||
        "Curso online";

      const precio = formatearPrecio(
        detalle?.precioUnitario || detalle?.subtotal,
      );

      return `
        <tr>
          <td>
            <strong>${limpiarHtml(titulo)}</strong>
            <span>${limpiarHtml(descripcion)}</span>
          </td>
          <td>${limpiarHtml(precio)}</td>
        </tr>
      `;
    })
    .join("");

  const ventana = window.open("", "_blank", "width=980,height=900");

  if (!ventana) {
    alert(
      "No se pudo abrir el comprobante. Revisá si el navegador bloqueó la ventana emergente.",
    );
    return;
  }

  ventana.document.write(`
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <title>Comprobante de compra - Mundo Dev</title>
        <link rel="stylesheet" href="/comprobante.css" />
      </head>

      <body>
        <div class="acciones">
          <button class="secondary" onclick="window.close()">Cerrar</button>
          <button onclick="window.print()">Descargar / imprimir comprobante</button>
        </div>

        <div class="comprobante">
          <div class="header">
            <div class="brand">
              <h1>MUNDO <strong>DEV</strong></h1>
              <p>Comprobante de compra de cursos online</p>
            </div>

            <div class="estado">${limpiarHtml(estado)}</div>
          </div>

          <div class="info-grid">
            <div class="info">
              <small>Orden</small>
              <strong>#${limpiarHtml(orden)}</strong>
            </div>

            <div class="info">
              <small>Fecha</small>
              <strong>${limpiarHtml(fecha)}</strong>
            </div>

            <div class="info">
              <small>Cliente</small>
              <strong>${limpiarHtml(cliente.nombre)}</strong>
            </div>

            <div class="info">
              <small>Email</small>
              <strong>${limpiarHtml(cliente.email)}</strong>
            </div>
          </div>

          <h2>Cursos incluidos</h2>

          <table>
            <thead>
              <tr>
                <th>Curso</th>
                <th>Importe</th>
              </tr>
            </thead>

            <tbody>
              ${cursosHtml}
            </tbody>
          </table>

          <div class="total">
            <div class="total-box">
              <small>Total</small>
              <strong>${limpiarHtml(total)}</strong>
            </div>
          </div>

          <div class="footer">
            Este comprobante fue generado digitalmente desde Mundo Dev.
            La disponibilidad del curso depende del estado de aprobación del pago.
            Este documento no reemplaza una factura fiscal.
          </div>
        </div>
      </body>
    </html>
  `);

  ventana.document.close();
  ventana.focus();
}

export default function MisCompras() {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("recientes");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [compraSeleccionada, setCompraSeleccionada] = useState(null);

  const navigate = useNavigate();

  const obtenerMisCompras = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/compra/mis-compras");

      const comprasData = Array.isArray(response.data?.datos)
        ? response.data.datos
        : Array.isArray(response.data)
          ? response.data
          : [];

      setCompras(comprasData);
    } catch (error) {
      setError(
        error.response?.data?.mensaje ||
          error.response?.data?.error ||
          error.message ||
          "No se pudieron cargar tus compras.",
      );

      setCompras([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerMisCompras();
  }, []);

  const resumen = useMemo(() => {
    const totalComprado = compras.reduce(
      (total, compra) => total + Number(compra.total || 0),
      0,
    );

    const cursosComprados = compras.reduce(
      (total, compra) => total + obtenerCursosCompra(compra).length,
      0,
    );

    const pendientes = compras.filter((compra) => {
      const estado = normalizarEstado(compra.estado);
      return estado === "PENDIENTE" || estado === "EN_PROCESO";
    }).length;

    return {
      totalComprado,
      cursosComprados,
      pendientes,
    };
  }, [compras]);

  const comprasFiltradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    let resultado = compras.filter((compra) => {
      const estado = normalizarEstado(compra?.estado);
      const estadoTexto = estado.toLowerCase();

      const cursos = obtenerCursosCompra(compra)
        .map((detalle) => detalle?.curso?.titulo || "")
        .join(" ")
        .toLowerCase();

      const coincideTexto =
        !texto || estadoTexto.includes(texto) || cursos.includes(texto);

      const coincideEstado =
        estadoFiltro === "todos" || estadoTexto === estadoFiltro.toLowerCase();

      return coincideTexto && coincideEstado;
    });

    if (orden === "recientes") {
      resultado = [...resultado].sort(
        (a, b) =>
          new Date(b.createdAt || b.fechaCompra || 0) -
          new Date(a.createdAt || a.fechaCompra || 0),
      );
    }

    if (orden === "antiguas") {
      resultado = [...resultado].sort(
        (a, b) =>
          new Date(a.createdAt || a.fechaCompra || 0) -
          new Date(b.createdAt || b.fechaCompra || 0),
      );
    }

    if (orden === "mayor-total") {
      resultado = [...resultado].sort(
        (a, b) => Number(b.total || 0) - Number(a.total || 0),
      );
    }

    return resultado;
  }, [compras, busqueda, orden, estadoFiltro]);

  if (loading) {
    return (
      <main className="mis-compras-page">
        <section className="mis-compras-hero premium">
          <div>
            <span className="mis-compras-eyebrow">PANEL DE ESTUDIANTE</span>
            <h1>Mis compras</h1>
            <p>Cargando tus órdenes...</p>
          </div>
        </section>

        <section className="mis-compras-table-card">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="mis-compra-skeleton"></div>
          ))}
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mis-compras-page">
        <section className="mis-compras-hero premium">
          <div>
            <span className="mis-compras-eyebrow">PANEL DE ESTUDIANTE</span>
            <h1>Mis compras</h1>
            <p>Hubo un problema al cargar tus órdenes.</p>
          </div>
        </section>

        <div className="mis-compras-empty">
          <h3>No pudimos cargar tus compras</h3>
          <p>{error}</p>
          <button onClick={() => navigate("/cursos")}>Ver cursos</button>
        </div>
      </main>
    );
  }

  return (
    <main className="mis-compras-page">
      <section className="mis-compras-hero premium">
        <div>
          <span className="mis-compras-eyebrow">PANEL DE ESTUDIANTE</span>

          <h1>Mis compras</h1>

          <p>
            Consultá tus órdenes realizadas, el estado de cada compra y los
            cursos incluidos en cada una.
          </p>

          <small className="mis-compras-update">
            ⏱ Última actualización: {formatearFecha(new Date(), true)}
          </small>
        </div>

        <div className="mis-compras-hero-visual">
          <div className="receipt-card">
            <span className="receipt-icon">🧾</span>
            <span className="receipt-check">✓</span>
          </div>
        </div>
      </section>

      {compras.length === 0 ? (
        <div className="mis-compras-empty">
          <h3>No tenés compras todavía</h3>
          <p>Cuando compres un curso, vas a poder ver la orden acá.</p>
          <button onClick={() => navigate("/cursos")}>Explorar cursos</button>
        </div>
      ) : (
        <>
          <section className="mis-compras-stats">
            <article className="mis-compra-stat">
              <span className="stat-icon purple">🛍</span>
              <div>
                <strong>{compras.length}</strong>
                <p>Órdenes realizadas</p>
                <small>Todas tus compras</small>
              </div>
            </article>

            <article className="mis-compra-stat">
              <span className="stat-icon blue">💳</span>
              <div>
                <strong>{formatearPrecio(resumen.totalComprado)}</strong>
                <p>Total comprado</p>
                <small>Suma total invertida</small>
              </div>
            </article>

            <article className="mis-compra-stat">
              <span className="stat-icon green">🎓</span>
              <div>
                <strong>{resumen.cursosComprados}</strong>
                <p>Cursos comprados</p>
                <small>Formación adquirida</small>
              </div>
            </article>

            <article className="mis-compra-stat">
              <span className="stat-icon orange">◔</span>
              <div>
                <strong>{resumen.pendientes}</strong>
                <p>Pendientes</p>
                <small>Órdenes por completar</small>
              </div>
            </article>
          </section>

          <section className="mis-compras-toolbar">
            <div className="mis-compras-search">
              <span>⌕</span>
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por curso o estado..."
              />
            </div>

            <select
              className="mis-compras-select"
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
            >
              <option value="todos">Estado: Todos</option>
              <option value="pagada">Pagadas</option>
              <option value="pendiente">Pendientes</option>
              <option value="cancelada">Canceladas</option>
            </select>

            <select
              className="mis-compras-select"
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
            >
              <option value="recientes">Más recientes</option>
              <option value="antiguas">Más antiguas</option>
              <option value="mayor-total">Mayor total</option>
            </select>
          </section>

          <section className="mis-compras-table-card">
            {comprasFiltradas.length === 0 ? (
              <div className="mis-compras-empty compact">
                <h3>No encontramos compras</h3>
                <p>Probá con otra búsqueda o cambiá el filtro.</p>
              </div>
            ) : (
              <div className="mis-compras-table">
                {comprasFiltradas.map((compra) => {
                  const detalles = obtenerCursosCompra(compra);
                  const fecha = compra.createdAt || compra.fechaCompra;
                  const estado = normalizarEstado(compra.estado);
                  const estadoClase = obtenerClaseEstado(estado);
                  const primerDetalle = detalles[0];
                  const cursosExtra = Math.max(detalles.length - 1, 0);
                  const metodoPago = obtenerMetodoPago(compra);

                  return (
                    <article
                      key={compra._id || compra.id}
                      className="mis-compra-row"
                    >
                      <div className="mis-compra-col orden">
                        <small>Orden</small>
                        <strong>
                          #{String(compra._id || compra.id).slice(-6)}
                        </strong>

                        <span className={`mis-compra-estado ${estadoClase}`}>
                          {estado}
                        </span>
                      </div>

                      <div className="mis-compra-col fecha">
                        <small>Fecha</small>
                        <strong>{formatearFecha(fecha, true)}</strong>

                        <p>
                          <span className="payment-mini">
                            {metodoPago.sigla}
                          </span>
                          {metodoPago.texto}
                        </p>
                      </div>

                      <div className="mis-compra-col cursos">
                        <small>Cursos incluidos ({detalles.length})</small>

                        {primerDetalle ? (
                          <div className="mis-compra-curso-inline">
                            <span className="curso-mini-icon">
                              {obtenerIconoCurso(primerDetalle?.curso?.titulo)}
                            </span>

                            <div>
                              <strong>
                                {primerDetalle?.curso?.titulo ||
                                  "Curso sin título"}
                              </strong>

                              <p>
                                {primerDetalle?.curso?.categoria?.nombre ||
                                  "Curso online"}
                              </p>

                              {cursosExtra > 0 && (
                                <em>+ {cursosExtra} curso más</em>
                              )}
                            </div>
                          </div>
                        ) : (
                          <p>Sin cursos asociados</p>
                        )}
                      </div>

                      <div className="mis-compra-col total">
                        <small>Total</small>
                        <strong>{formatearPrecio(compra.total)}</strong>

                        <button
                          type="button"
                          className="btn-ver-detalle"
                          onClick={() => setCompraSeleccionada(compra)}
                        >
                          Ver detalle →
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <section className="mis-compras-help">
            <p>¿Necesitás ayuda con tu compra? Contactanos y te asistimos.</p>

            <button type="button" onClick={() => navigate("/contactos")}>
              Ir a contacto ↗
            </button>
          </section>
        </>
      )}

      {compraSeleccionada && (
        <div
          className="mis-compra-modal-overlay"
          onClick={() => setCompraSeleccionada(null)}
        >
          <div
            className="mis-compra-modal mis-compra-modal-premium"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mis-compra-modal-header premium">
              <div className="mis-compra-modal-title-wrap">
                <div className="mis-compra-modal-icon">🧾</div>

                <div>
                  <span>Detalle de orden</span>
                  <h2>
                    #
                    {String(
                      compraSeleccionada._id || compraSeleccionada.id,
                    ).slice(-6)}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                className="mis-compra-modal-close"
                onClick={() => setCompraSeleccionada(null)}
              >
                ×
              </button>
            </div>

            <div className="mis-compra-modal-info premium">
              <div className="info-card estado-card">
                <span className="info-icon success">✓</span>
                <div>
                  <small>Estado</small>
                  <strong>{normalizarEstado(compraSeleccionada.estado)}</strong>
                </div>
              </div>

              <div className="info-card">
                <span className="info-icon">📅</span>
                <div>
                  <small>Fecha</small>
                  <strong>
                    {formatearFecha(
                      compraSeleccionada.createdAt ||
                        compraSeleccionada.fechaCompra,
                      true,
                    )}
                  </strong>
                </div>
              </div>

              <div className="info-card">
                <span className="info-icon">💲</span>
                <div>
                  <small>Total</small>
                  <strong>{formatearPrecio(compraSeleccionada.total)}</strong>
                </div>
              </div>
            </div>

            <div className="mis-compra-modal-actions premium">
              <button
                type="button"
                className="btn-imprimir-comprobante"
                onClick={() => imprimirComprobante(compraSeleccionada)}
              >
                <span>🧾</span>
                Descargar / imprimir comprobante
              </button>

              {compraHabilitada(compraSeleccionada.estado) && (
                <button
                  type="button"
                  className="btn-ir-mis-cursos"
                  onClick={() => navigate("/mis-cursos")}
                >
                  <span>🎓</span>
                  Ir a mis cursos
                  <strong>→</strong>
                </button>
              )}
            </div>

            {!compraHabilitada(compraSeleccionada.estado) && (
              <div className="mis-compra-modal-aviso">
                <p>
                  Tu compra todavía no está aprobada. El acceso al curso se
                  habilitará cuando el pago sea confirmado.
                </p>

                <hr />

                <h3> Datos para transferencia</h3>
                <br />
                <p>
                  <strong>Titular:</strong> Mundo Dev SRL
                </p>
                <p>
                  <strong>Banco:</strong> Banco de la Nación Argentina
                </p>
                <p>
                  <strong>Alias:</strong> mundo_dev
                </p>
                <p>
                  <strong>CBU:</strong> 0123456789012345678901
                </p>
                <br />
                <hr />
                <p>
                  Una vez realizada la transferencia, enviá el comprobante para
                  validar el pago y habilitar el acceso al curso.
                </p>
              </div>
            )}

            <div className="mis-compra-modal-section-title">
              <span>📖</span>
              <h3>Cursos incluidos</h3>
            </div>

            <div className="mis-compra-modal-cursos premium">
              {obtenerCursosCompra(compraSeleccionada).map((detalle) => {
                const cursoId = detalle?.curso?._id || detalle?.curso?.id;

                return (
                  <div
                    key={detalle._id || detalle.id}
                    className="mis-compra-modal-curso premium"
                  >
                    <div className="curso-modal-icon-wrap">
                      <span className="curso-mini-icon">
                        {obtenerIconoCurso(detalle?.curso?.titulo)}
                      </span>

                      {compraHabilitada(compraSeleccionada.estado) && (
                        <small className="curso-check">✓</small>
                      )}
                    </div>

                    <div className="curso-modal-content">
                      <strong>
                        {detalle?.curso?.titulo || "Curso sin título"}
                      </strong>

                      <p>
                        {detalle?.curso?.descripcion ||
                          detalle?.curso?.categoria?.nombre ||
                          "Curso online"}
                      </p>

                      <div className="curso-modal-footer">
                        <small>
                          {formatearPrecio(
                            detalle?.precioUnitario || detalle?.subtotal,
                          )}
                        </small>
                      </div>
                    </div>

                    <div className="curso-modal-action-panel">
                      <div className="curso-modal-decoration">{"</>"}</div>

                      {compraHabilitada(compraSeleccionada.estado) &&
                        cursoId && (
                          <button
                            type="button"
                            className="btn-ir-curso"
                            onClick={() =>
                              navigate(`/curso/${cursoId}/aprender`)
                            }
                          >
                            Comenzar curso
                            <span>→</span>
                          </button>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
