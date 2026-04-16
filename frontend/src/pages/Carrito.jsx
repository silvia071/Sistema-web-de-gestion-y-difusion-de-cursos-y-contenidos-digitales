import "./Carrito.css";
import { useCarrito } from "../context/CarritoContext";
import { Link } from "react-router-dom";

function Carrito() {
  const {
    carrito,
    eliminarDelCarrito,
    actualizarCantidad,
    vaciarCarrito,
    finalizarCompra,
  } = useCarrito();

  const subtotal = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0,
  );

  const irAMercadoPago = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/pagos/crear-preferencia",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            titulo: "Compra de cursos",
            precio: subtotal,
          }),
        },
      );

      if (!res.ok) {
        throw new Error("Error al crear la preferencia de pago");
      }

      const data = await res.json();

      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert("No se pudo obtener el enlace de Mercado Pago");
      }
    } catch (error) {
      console.error("Error al ir a Mercado Pago:", error);
      alert("Error al ir a Mercado Pago");
    }
  };

  return (
    <section className="carrito-page">
      <h1 className="carrito-title">Tu Carrito</h1>

      {carrito.length === 0 ? (
        <div className="carrito-vacio">
          <p>Tu carrito está vacío.</p>
          <Link to="/cursos" className="btn-finalizar">
            Ver cursos
          </Link>
        </div>
      ) : (
        <div className="carrito-container">
          <div className="carrito-lista">
            {carrito.map((item) => (
              <div key={item.id} className="carrito-card">
                <img
                  src={item.imagen}
                  alt={item.titulo}
                  className="carrito-imagen"
                />

                <div className="carrito-info">
                  <h2 className="carrito-item-title">{item.titulo}</h2>
                  <p className="carrito-precio">
                    ${item.precio.toLocaleString()}
                  </p>

                  <div className="carrito-cantidad">
                    <button
                      onClick={() => {
                        if (item.cantidad > 1) {
                          actualizarCantidad(item.id, item.cantidad - 1);
                        }
                      }}
                    >
                      -
                    </button>

                    <span>{item.cantidad}</span>

                    <button
                      onClick={() =>
                        actualizarCantidad(item.id, item.cantidad + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="carrito-acciones">
                  <p className="carrito-total-item">
                    ${(item.precio * item.cantidad).toLocaleString()}
                  </p>

                  <button
                    className="btn-eliminar"
                    onClick={() => eliminarDelCarrito(item.id)}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="carrito-resumen">
            <h3>Resumen de compra</h3>
            <p className="carrito-subtotal">
              <span>Subtotal</span>
              <strong>${subtotal.toLocaleString()}</strong>
            </p>

            <button className="btn-finalizar" onClick={irAMercadoPago}>
              Pagar con Mercado Pago
            </button>

            <button
              className="btn-vaciar"
              onClick={() => {
                if (window.confirm("¿Seguro que querés vaciar el carrito?")) {
                  vaciarCarrito();
                }
              }}
            >
              Vaciar carrito
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Carrito;
