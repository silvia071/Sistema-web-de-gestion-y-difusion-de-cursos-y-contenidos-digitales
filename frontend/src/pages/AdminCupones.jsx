import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AdminCupones.css";

function formatearFecha(fecha) {
  if (!fecha) return "Sin vencimiento";

  return new Date(fecha).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatearValor(cupon) {
  if (cupon.tipoDescuento === "PORCENTAJE") {
    return `${cupon.valor}%`;
  }

  return `$${Number(cupon.valor || 0).toLocaleString("es-AR")}`;
}

function AdminCupones() {
  const navigate = useNavigate();

  const [cupones, setCupones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const [formulario, setFormulario] = useState({
    codigo: "",
    descripcion: "",
    tipoDescuento: "PORCENTAJE",
    valor: "",
    fechaFin: "",
    usoMaximo: "",
    montoMinimoCompra: "",
    activo: true,
  });

  const cargarCupones = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/api/cupones");
      setCupones(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar cupones:", err);
      setError(
        err.response?.data?.mensaje || "No se pudieron cargar los cupones.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCupones();
  }, []);

  const cuponesFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    if (!texto) return cupones;

    return cupones.filter((cupon) => {
      const contenido = `${cupon.codigo} ${cupon.descripcion} ${cupon.tipoDescuento}`;
      return contenido.toLowerCase().includes(texto);
    });
  }, [cupones, busqueda]);

  const resumen = useMemo(() => {
    const activos = cupones.filter((cupon) => cupon.activo).length;
    const inactivos = cupones.length - activos;
    const usosTotales = cupones.reduce(
      (acc, cupon) => acc + Number(cupon.usosActuales || 0),
      0,
    );

    return {
      total: cupones.length,
      activos,
      inactivos,
      usosTotales,
    };
  }, [cupones]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormulario((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setMensaje("");
    setError("");
  };

  const limpiarFormulario = () => {
    setFormulario({
      codigo: "",
      descripcion: "",
      tipoDescuento: "PORCENTAJE",
      valor: "",
      fechaFin: "",
      usoMaximo: "",
      montoMinimoCompra: "",
      activo: true,
    });
  };

  const crearCupon = async (e) => {
    e.preventDefault();

    if (guardando) return;

    const codigo = formulario.codigo.trim().toUpperCase();
    const valor = Number(formulario.valor);

    if (!codigo) {
      setError("El código del cupón es obligatorio.");
      return;
    }

    if (!valor || valor <= 0) {
      setError("El valor del descuento debe ser mayor a cero.");
      return;
    }

    if (formulario.tipoDescuento === "PORCENTAJE" && valor > 100) {
      setError("El porcentaje de descuento no puede superar el 100%.");
      return;
    }

    try {
      setGuardando(true);
      setError("");
      setMensaje("");

      const payload = {
        codigo,
        descripcion: formulario.descripcion.trim(),
        tipoDescuento: formulario.tipoDescuento,
        valor,
        activo: formulario.activo,
        montoMinimoCompra: Number(formulario.montoMinimoCompra || 0),
      };

      if (formulario.fechaFin) {
        payload.fechaFin = formulario.fechaFin;
      }

      if (formulario.usoMaximo) {
        payload.usoMaximo = Number(formulario.usoMaximo);
      }

      await api.post("/api/cupones", payload);

      setMensaje("Cupón creado correctamente.");
      limpiarFormulario();
      await cargarCupones();
    } catch (err) {
      console.error("Error al crear cupón:", err);
      setError(err.response?.data?.mensaje || "No se pudo crear el cupón.");
    } finally {
      setGuardando(false);
    }
  };

  const cambiarEstadoCupon = async (cupon) => {
    try {
      setError("");
      setMensaje("");

      const endpoint = cupon.activo
        ? `/api/cupones/${cupon._id}/desactivar`
        : `/api/cupones/${cupon._id}/activar`;

      await api.patch(endpoint);

      setMensaje(
        cupon.activo
          ? "Cupón desactivado correctamente."
          : "Cupón activado correctamente.",
      );

      await cargarCupones();
    } catch (err) {
      console.error("Error al cambiar estado del cupón:", err);
      setError(
        err.response?.data?.mensaje ||
          "No se pudo cambiar el estado del cupón.",
      );
    }
  };

  return (
    <section className="admin-cupones-page">
      <aside className="admin-cupones-sidebar">
        <div className="admin-cupones-brand">
          <div className="admin-cupones-brand-logo">MD</div>

          <div>
            <strong>MD Estudio</strong>
            <span>Panel admin</span>
          </div>
        </div>

        <nav className="admin-cupones-nav">
          <button type="button" onClick={() => navigate("/admin")}>
            🏠 Inicio
          </button>

          <button type="button" onClick={() => navigate("/admin/cursos")}>
            🎓 Cursos
          </button>

          <button type="button" onClick={() => navigate("/admin/lecciones")}>
            🎥 Lecciones
          </button>

          <button type="button" className="active">
            🏷️ Cupones
          </button>

          <button type="button" disabled className="disabled">
            📝 Blog
          </button>

          <button type="button" onClick={() => navigate("/admin/usuarios")}>
            👥 Usuarios
          </button>

          <button type="button" onClick={() => navigate("/admin/pagos")}>
            💳 Pagos
          </button>

          <button type="button" onClick={() => navigate("/admin/compras")}>
            🛒 Compras
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/datos-facturacion")}
          >
            🧾 Facturación
          </button>
        </nav>

        <div className="admin-cupones-sidebar-footer">
          <span>Descuentos</span>
          <strong>Cupones activos</strong>
        </div>
      </aside>

      <main className="admin-cupones-main">
        <header className="admin-cupones-topbar">
          <div className="admin-cupones-search">
            <span>🔎</span>

            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar cupón por código, descripción o tipo..."
            />
          </div>

          <div className="admin-cupones-user-pill">
            <div className="admin-cupones-avatar">A</div>

            <div>
              <strong>Administrador</strong>
              <span>admin@mdestudio.com</span>
            </div>
          </div>
        </header>

        <div className="admin-cupones-content">
          <section className="admin-cupones-hero">
            <div>
              <span className="admin-cupones-eyebrow">
                Gestión de descuentos
              </span>

              <h1>Cupones de descuento</h1>

              <p>
                Creá códigos promocionales, definí porcentajes, vencimientos y
                límites de uso para aplicar descuentos en el carrito.
              </p>
            </div>

            <button
              type="button"
              className="admin-cupones-refresh"
              onClick={cargarCupones}
              disabled={loading}
            >
              {loading ? "Actualizando..." : "↻ Actualizar"}
            </button>
          </section>

          <section className="admin-cupones-stats-grid">
            <article className="admin-cupones-stat-card">
              <div className="admin-cupones-stat-icon violet">🏷️</div>
              <div>
                <span>Total de cupones</span>
                <strong>{resumen.total}</strong>
                <small>Registrados</small>
              </div>
            </article>

            <article className="admin-cupones-stat-card">
              <div className="admin-cupones-stat-icon green">✓</div>
              <div>
                <span>Activos</span>
                <strong>{resumen.activos}</strong>
                <small>Disponibles para usar</small>
              </div>
            </article>

            <article className="admin-cupones-stat-card">
              <div className="admin-cupones-stat-icon orange">⏸</div>
              <div>
                <span>Inactivos</span>
                <strong>{resumen.inactivos}</strong>
                <small>No aplicables</small>
              </div>
            </article>

            <article className="admin-cupones-stat-card">
              <div className="admin-cupones-stat-icon cyan">↗</div>
              <div>
                <span>Usos registrados</span>
                <strong>{resumen.usosTotales}</strong>
                <small>Uso acumulado</small>
              </div>
            </article>
          </section>

          {(mensaje || error) && (
            <div
              className={`admin-cupones-alerta ${error ? "error" : "success"}`}
            >
              {error || mensaje}
            </div>
          )}

          <div className="admin-cupones-grid">
            <section className="admin-cupones-panel">
              <div className="admin-cupones-section-title">
                <div>
                  <h2>Crear cupón</h2>
                  <p>Definí un nuevo descuento para el carrito.</p>
                </div>
              </div>

              <form className="admin-cupones-form" onSubmit={crearCupon}>
                <div className="admin-cupones-field">
                  <label>Código del cupón</label>
                  <input
                    type="text"
                    name="codigo"
                    value={formulario.codigo}
                    onChange={handleChange}
                    placeholder="Ej: DESCUENTO10"
                  />
                </div>

                <div className="admin-cupones-field">
                  <label>Descripción</label>
                  <input
                    type="text"
                    name="descripcion"
                    value={formulario.descripcion}
                    onChange={handleChange}
                    placeholder="Cupón promocional del 10%"
                  />
                </div>

                <div className="admin-cupones-form-row">
                  <div className="admin-cupones-field">
                    <label>Tipo</label>
                    <select
                      name="tipoDescuento"
                      value={formulario.tipoDescuento}
                      onChange={handleChange}
                    >
                      <option value="PORCENTAJE">Porcentaje</option>
                      <option value="MONTO_FIJO">Monto fijo</option>
                    </select>
                  </div>

                  <div className="admin-cupones-field">
                    <label>
                      {formulario.tipoDescuento === "PORCENTAJE"
                        ? "Porcentaje"
                        : "Monto"}
                    </label>
                    <input
                      type="number"
                      name="valor"
                      value={formulario.valor}
                      onChange={handleChange}
                      min="1"
                      max={
                        formulario.tipoDescuento === "PORCENTAJE"
                          ? "100"
                          : undefined
                      }
                      placeholder={
                        formulario.tipoDescuento === "PORCENTAJE"
                          ? "10"
                          : "1500"
                      }
                    />
                  </div>
                </div>

                <div className="admin-cupones-form-row">
                  <div className="admin-cupones-field">
                    <label>Fecha de vencimiento</label>
                    <input
                      type="date"
                      name="fechaFin"
                      value={formulario.fechaFin}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="admin-cupones-field">
                    <label>Cantidad máxima de usos</label>
                    <input
                      type="number"
                      name="usoMaximo"
                      value={formulario.usoMaximo}
                      onChange={handleChange}
                      min="1"
                      placeholder="Sin límite"
                    />
                  </div>
                </div>

                <div className="admin-cupones-field">
                  <label>Monto mínimo de compra</label>
                  <input
                    type="number"
                    name="montoMinimoCompra"
                    value={formulario.montoMinimoCompra}
                    onChange={handleChange}
                    min="0"
                    placeholder="0"
                  />
                </div>

                <label className="admin-cupones-check">
                  <input
                    type="checkbox"
                    name="activo"
                    checked={formulario.activo}
                    onChange={handleChange}
                  />
                  Crear cupón activo
                </label>

                <div className="admin-cupones-form-actions">
                  <button type="submit" disabled={guardando}>
                    {guardando ? "Guardando..." : "Crear cupón"}
                  </button>

                  <button
                    type="button"
                    className="secondary"
                    onClick={limpiarFormulario}
                    disabled={guardando}
                  >
                    Limpiar
                  </button>
                </div>
              </form>
            </section>

            <section className="admin-cupones-panel admin-cupones-list-panel">
              <div className="admin-cupones-section-title">
                <div>
                  <h2>Listado de cupones</h2>
                  <p>Activá, desactivá y revisá el estado de cada cupón.</p>
                </div>
              </div>

              {loading ? (
                <div className="admin-cupones-empty">Cargando cupones...</div>
              ) : cuponesFiltrados.length === 0 ? (
                <div className="admin-cupones-empty">
                  No se encontraron cupones.
                </div>
              ) : (
                <div className="admin-cupones-table-wrap">
                  <table className="admin-cupones-table">
                    <thead>
                      <tr>
                        <th>Código</th>
                        <th>Tipo</th>
                        <th>Valor</th>
                        <th>Vencimiento</th>
                        <th>Usos</th>
                        <th>Estado</th>
                        <th></th>
                      </tr>
                    </thead>

                    <tbody>
                      {cuponesFiltrados.map((cupon) => (
                        <tr key={cupon._id}>
                          <td>
                            <strong>{cupon.codigo}</strong>
                            <span>
                              {cupon.descripcion || "Sin descripción"}
                            </span>
                          </td>

                          <td>{cupon.tipoDescuento}</td>

                          <td>{formatearValor(cupon)}</td>

                          <td>{formatearFecha(cupon.fechaFin)}</td>

                          <td>
                            {Number(cupon.usosActuales || 0)} /{" "}
                            {cupon.usoMaximo || "∞"}
                          </td>

                          <td>
                            <span
                              className={`admin-cupones-estado ${
                                cupon.activo ? "activo" : "inactivo"
                              }`}
                            >
                              {cupon.activo ? "Activo" : "Inactivo"}
                            </span>
                          </td>

                          <td>
                            <button
                              type="button"
                              className={`admin-cupones-toggle ${
                                cupon.activo ? "desactivar" : "activar"
                              }`}
                              onClick={() => cambiarEstadoCupon(cupon)}
                            >
                              {cupon.activo ? "Desactivar" : "Activar"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </section>
  );
}

export default AdminCupones;
