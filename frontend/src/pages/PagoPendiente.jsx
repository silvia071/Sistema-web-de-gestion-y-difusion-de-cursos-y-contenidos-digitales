import { Link } from "react-router-dom";
import "./EstadoPago.css";

function PagoPendiente() {
  return (
    <section className="estado-pago-page">
      <div className="estado-pago-card">
        <div className="estado-pago-icono pendiente">!</div>

        <h1>Pago pendiente</h1>

        <p>
          Tu compra fue registrada correctamente. El acceso se habilitará una
          vez confirmado el pago.
        </p>

        <div className="estado-pago-actions">
          <Link to="/carrito" className="estado-pago-btn">
            Volver al carrito
          </Link>
        </div>
      </div>
    </section>
  );
}

export default PagoPendiente;
