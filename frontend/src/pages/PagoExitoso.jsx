import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import "./EstadoPago.css";

function PagoExitoso() {
  const { limpiarCarritoVisual } = useCarrito();
  const yaLimpio = useRef(false);

  useEffect(() => {
    if (yaLimpio.current) return;

    limpiarCarritoVisual();
    yaLimpio.current = true;
  }, [limpiarCarritoVisual]);

  return (
    <section className="estado-pago-page">
      <div className="estado-pago-card">
        <div className="estado-pago-icono">✓</div>

        <h1>Pago aprobado</h1>

        <p>
          Tu compra fue procesada correctamente. Ya podés acceder a tus cursos.
        </p>

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

export default PagoExitoso;
