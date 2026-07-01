import { Link, useLocation } from "react-router-dom";
import "./EstadoPago.css";

function PagoPendiente() {
  const location = useLocation();

  const metodo = location.state?.metodo || {};
  const tipoResultado = location.state?.tipoResultado || "";

  const tipoMetodo = String(metodo.tipo || "").toUpperCase();

  const esTransferencia =
    tipoResultado === "transferencia" || tipoMetodo === "TRANSFERENCIA";

  const nombreMetodo =
    metodo.nombre ||
    (esTransferencia ? "Transferencia bancaria" : "Método de pago");

  const descripcionMetodo =
    metodo.descripcion ||
    (esTransferencia
      ? "Una vez realizada la transferencia, enviá el comprobante para que podamos verificar el pago y habilitar el acceso al curso."
      : `El pago mediante ${nombreMetodo} quedó pendiente de confirmación administrativa.`);

  return (
    <section className="estado-pago-page">
      <div className="estado-pago-card">
        <div className="estado-pago-icono pendiente">!</div>

        <h1>Pago pendiente</h1>

        <p>
          Tu compra fue registrada correctamente. El acceso se habilitará una
          vez confirmado el pago por administración.
        </p>

        {esTransferencia ? (
          <div className="datos-transferencia">
            <h3>Datos para transferencia</h3>

            <p>
              <strong>Titular:</strong> {metodo.titular || "Mundo Dev SRL"}
            </p>

            <p>
              <strong>Banco:</strong>{" "}
              {metodo.banco || "Banco de la Nación Argentina"}
            </p>

            <p>
              <strong>Alias:</strong> {metodo.alias || "mundo_dev"}
            </p>

            <p>
              <strong>CBU:</strong> {metodo.cbu || "0123456789012345678901"}
            </p>

            <p>{descripcionMetodo}</p>
          </div>
        ) : (
          <div className="datos-transferencia datos-metodo-manual">
            <h3>Método de pago seleccionado</h3>

            <p>
              <strong>Método:</strong> {nombreMetodo}
            </p>

            {metodo.descripcion && (
              <p>
                <strong>Descripción:</strong> {metodo.descripcion}
              </p>
            )}

            <p>
              El pago quedó pendiente de confirmación administrativa. Cuando el
              administrador lo apruebe, se habilitará automáticamente el acceso
              al curso.
            </p>
          </div>
        )}

        <div className="estado-pago-actions">
          <Link to="/mis-compras" className="estado-pago-btn">
            Ver mis compras
          </Link>

          <Link to="/cursos" className="estado-pago-btn secundario">
            Ver más cursos
          </Link>
        </div>
      </div>
    </section>
  );
}

export default PagoPendiente;
