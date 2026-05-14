import { Link } from "react-router-dom";
import "./EstadoPago.css";

function PagoFallido() {
  return (
    <section className="estado-pago-page">
      <div className="estado-pago-card">
        <div className="estado-pago-icono fallido">×</div>

        <h1>Pago no completado</h1>

        <p>
          El pago fue cancelado, rechazado o no pudo procesarse correctamente.
        </p>

        <div className="estado-pago-actions">
          <Link to="/carrito" className="estado-pago-btn">
            Intentar nuevamente
          </Link>

          <Link to="/cursos" className="estado-pago-btn secundario">
            Ver cursos
          </Link>
        </div>
      </div>
    </section>
  );
}

export default PagoFallido;
