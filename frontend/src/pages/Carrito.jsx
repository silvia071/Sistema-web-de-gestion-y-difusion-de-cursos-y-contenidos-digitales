<<<<<<< HEAD
//para hacer
=======
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

  return (
    <section className="carrito-page">
      <h1 className="carrito-title">Carrito</h1>

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
                    Eliminar
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

            <button
              className="btn-finalizar"
              onClick={() => {
                finalizarCompra();
                alert("Compra realizada con éxito");
              }}
            >
              Finalizar compra
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
>>>>>>> bfaa1e832a1a16c2df45493aec008dc75fc1582c
