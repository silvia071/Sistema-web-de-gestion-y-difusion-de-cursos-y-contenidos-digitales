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

         <div className="datos-transferencia">
        <h3>Datos para transferencia</h3>

        <p><strong>Titular:</strong> Mundo Dev SRL </p>
        <p><strong>Banco:</strong> Banco de la Nación Argentina</p>
        <p><strong>Alias:</strong> mundo_dev</p>
        <p><strong>CBU:</strong> 0123456789012345678901</p>

        <p>
          Una vez realizada la transferencia, envíanos el comprobante para
          habilitar el acceso al curso.
        </p>
      </div>

        <div className="estado-pago-actions">
          <Link to="/mis-cursos" className="estado-pago-btn">
            Ir a Mis Cursos
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
