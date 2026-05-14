import { useEffect, useState } from "react";
import api from "../services/api";
import "./DatosFacturacion.css";

function DatosFacturacion() {
  const [datos, setDatos] = useState(null);
  const [form, setForm] = useState({
    razonSocial: "",
    cuitCuil: "",
    condicionFiscal: "Consumidor Final",
    domicilioFiscal: "",
  });

  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError("");
      setMensaje("");

      const response = await api.get("/api/datos-facturacion/mis-datos");

      const datosRecibidos = response.data.datos;

      if (datosRecibidos) {
        setDatos(datosRecibidos);

        setForm({
          razonSocial: datosRecibidos.razonSocial || "",
          cuitCuil: datosRecibidos.cuitCuil || "",
          condicionFiscal: datosRecibidos.condicionFiscal || "Consumidor Final",
          domicilioFiscal: datosRecibidos.domicilioFiscal || "",
        });

        setEditando(false);
      } else {
        setDatos(null);
        setEditando(true);
      }
    } catch (error) {
      console.error("Error cargando datos de facturación:", error);

      setError(
        error.response?.data?.mensaje ||
          "No se pudieron cargar los datos de facturación",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const guardarDatos = async (e) => {
    e.preventDefault();

    setError("");
    setMensaje("");

    const razonSocial = form.razonSocial.trim();
    const cuitCuil = form.cuitCuil.trim();
    const condicionFiscal = form.condicionFiscal.trim();
    const domicilioFiscal = form.domicilioFiscal.trim();

    if (!razonSocial || !cuitCuil || !condicionFiscal || !domicilioFiscal) {
      setError("Todos los campos de facturación son obligatorios.");
      return;
    }

    try {
      setGuardando(true);

      const response = await api.put("/api/datos-facturacion/mis-datos", {
        razonSocial,
        cuitCuil,
        condicionFiscal,
        domicilioFiscal,
      });

      setDatos(response.data.datos);
      setEditando(false);
      setMensaje("Datos de facturación guardados correctamente.");
    } catch (error) {
      console.error("Error guardando datos de facturación:", error);

      setError(
        error.response?.data?.mensaje ||
          error.response?.data?.error ||
          "No se pudieron guardar los datos de facturación",
      );
    } finally {
      setGuardando(false);
    }
  };

  const cancelarEdicion = () => {
    if (datos) {
      setForm({
        razonSocial: datos.razonSocial || "",
        cuitCuil: datos.cuitCuil || "",
        condicionFiscal: datos.condicionFiscal || "Consumidor Final",
        domicilioFiscal: datos.domicilioFiscal || "",
      });

      setEditando(false);
      setError("");
      setMensaje("");
    }
  };

  if (loading) {
    return (
      <div className="datos-facturacion-card">
        <h2>Datos de facturación</h2>
        <p className="datos-facturacion-status">Cargando datos…</p>
      </div>
    );
  }

  return (
    <div className="datos-facturacion-card">
      <div className="datos-facturacion-header">
        <div>
          <h2>Datos de facturación</h2>
          <p>
            Estos datos se usarán para registrar tus compras y emitir la
            documentación correspondiente.
          </p>
        </div>

        {datos && !editando && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setEditando(true)}
          >
            Editar
          </button>
        )}
      </div>

      {mensaje && <p className="datos-facturacion-ok">{mensaje}</p>}
      {error && <p className="datos-facturacion-error">{error}</p>}

      {!editando && datos && (
        <div className="datos-facturacion-grid">
          <div className="datos-facturacion-item">
            <span>Razón social</span>
            <strong>{datos.razonSocial}</strong>
          </div>

          <div className="datos-facturacion-item">
            <span>CUIT / CUIL</span>
            <strong>{datos.cuitCuil}</strong>
          </div>

          <div className="datos-facturacion-item">
            <span>Condición fiscal</span>
            <strong>{datos.condicionFiscal}</strong>
          </div>

          <div className="datos-facturacion-item">
            <span>Domicilio fiscal</span>
            <strong>{datos.domicilioFiscal}</strong>
          </div>
        </div>
      )}

      {editando && (
        <form className="datos-facturacion-form" onSubmit={guardarDatos}>
          <div className="datos-facturacion-form-grid">
            <div className="datos-facturacion-field">
              <label htmlFor="razonSocial">Razón social</label>
              <input
                id="razonSocial"
                name="razonSocial"
                value={form.razonSocial}
                onChange={handleChange}
                placeholder="Ej: Diana Hoffman"
              />
            </div>

            <div className="datos-facturacion-field">
              <label htmlFor="cuitCuil">CUIT / CUIL</label>
              <input
                id="cuitCuil"
                name="cuitCuil"
                value={form.cuitCuil}
                onChange={handleChange}
                placeholder="Ej: 27234567891"
              />
            </div>

            <div className="datos-facturacion-field">
              <label htmlFor="condicionFiscal">Condición fiscal</label>
              <select
                id="condicionFiscal"
                name="condicionFiscal"
                value={form.condicionFiscal}
                onChange={handleChange}
              >
                <option value="Consumidor Final">Consumidor Final</option>
                <option value="Responsable Inscripto">
                  Responsable Inscripto
                </option>
                <option value="Monotributista">Monotributista</option>
                <option value="Exento">Exento</option>
              </select>
            </div>

            <div className="datos-facturacion-field">
              <label htmlFor="domicilioFiscal">Domicilio fiscal</label>
              <input
                id="domicilioFiscal"
                name="domicilioFiscal"
                value={form.domicilioFiscal}
                onChange={handleChange}
                placeholder="Ej: Calle Falsa 123"
              />
            </div>
          </div>

          <div className="datos-facturacion-actions">
            {datos && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={cancelarEdicion}
                disabled={guardando}
              >
                Cancelar
              </button>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={guardando}
            >
              {guardando ? "Guardando…" : "Guardar datos"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default DatosFacturacion;
