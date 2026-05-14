import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AdminDatosFacturacion.css";

function AdminDatosFacturacion() {
  const navigate = useNavigate();

  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const cargarDatosFacturacion = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/api/datos-facturacion");

        const datosRecibidos = response.data.datos || [];

        setDatos(Array.isArray(datosRecibidos) ? datosRecibidos : []);
      } catch (error) {
        console.error("Error cargando datos de facturación:", error);

        setError(
          error.response?.data?.mensaje ||
            error.response?.data?.error ||
            "No se pudieron cargar los datos de facturación",
        );
      } finally {
        setLoading(false);
      }
    };

    cargarDatosFacturacion();
  }, []);

  const datosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    if (!texto) return datos;

    return datos.filter((dato) => {
      const usuario = dato.usuario || {};

      const campos = [
        dato.razonSocial,
        dato.cuitCuil,
        dato.condicionFiscal,
        dato.domicilioFiscal,
        usuario.nombre,
        usuario.apellido,
        usuario.email,
      ];

      return campos.some((campo) =>
        String(campo || "")
          .toLowerCase()
          .includes(texto),
      );
    });
  }, [datos, busqueda]);

  return (
    <section className="admin-facturacion-page">
      <div className="admin-facturacion-container">
        <button
          type="button"
          className="admin-facturacion-back"
          onClick={() => navigate("/admin")}
        >
          ← Volver al panel
        </button>

        <div className="admin-facturacion-header">
          <div>
            <h1>Datos de facturación</h1>
            <p>
              Consultá los datos fiscales cargados por los clientes del sistema.
            </p>
          </div>

          <div className="admin-facturacion-resumen">
            <span>Total</span>
            <strong>{datos.length}</strong>
          </div>
        </div>

        <div className="admin-facturacion-toolbar">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por cliente, email, CUIT o razón social..."
          />
        </div>

        {loading && (
          <p className="admin-facturacion-status">Cargando datos...</p>
        )}

        {!loading && error && (
          <p className="admin-facturacion-error">{error}</p>
        )}

        {!loading && !error && datosFiltrados.length === 0 && (
          <div className="admin-facturacion-vacio">
            No se encontraron datos de facturación.
          </div>
        )}

        {!loading && !error && datosFiltrados.length > 0 && (
          <div className="admin-facturacion-table-wrapper">
            <table className="admin-facturacion-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Email</th>
                  <th>Razón social</th>
                  <th>CUIT / CUIL</th>
                  <th>Condición fiscal</th>
                  <th>Domicilio fiscal</th>
                </tr>
              </thead>

              <tbody>
                {datosFiltrados.map((dato) => {
                  const usuario = dato.usuario || {};

                  const nombreCompleto = `${usuario.nombre || ""} ${
                    usuario.apellido || ""
                  }`.trim();

                  return (
                    <tr key={dato._id}>
                      <td>{nombreCompleto || "-"}</td>
                      <td>{usuario.email || "-"}</td>
                      <td>{dato.razonSocial || "-"}</td>
                      <td>{dato.cuitCuil || "-"}</td>
                      <td>
                        <span className="admin-facturacion-pill">
                          {dato.condicionFiscal || "-"}
                        </span>
                      </td>
                      <td>{dato.domicilioFiscal || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminDatosFacturacion;
