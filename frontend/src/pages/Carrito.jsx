import "./Carrito.css";
import { useCarrito } from "../context/CarritoContext";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE } from "../config/api";

function Carrito() {
  const { carrito, eliminarDelCarrito, actualizarCantidad, vaciarCarrito } =
    useCarrito();

  const navigate = useNavigate();

  const [metodoPago, setMetodoPago] = useState("TRANSFERENCIA");
  const [metodosPago, setMetodosPago] = useState([]);
  const [procesando, setProcesando] = useState(false);

  const subtotal = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0,
  );

  useEffect(() => {
    const obtenerMetodosPago = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/metodos-pago`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.error || data.mensaje || "Error al cargar métodos de pago",
          );
        }

        setMetodosPago(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error al obtener métodos de pago:", error);
      }
    };

    obtenerMetodosPago();
  }, []);

  const leerErrorBackend = async (res, mensajeFallback) => {
    try {
      const data = await res.json();
      return data.error || data.mensaje || mensajeFallback;
    } catch {
      return mensajeFallback;
    }
  };

  const obtenerMetodoPagoSeleccionado = () => {
    return metodosPago.find((metodo) => metodo.tipo === metodoPago);
  };

  const handleContinuarPago = async () => {
    try {
      setProcesando(true);

      const usuarioId = localStorage.getItem("userId");

      if (!usuarioId) {
        alert("Tenés que iniciar sesión para comprar.");
        navigate("/login");
        return;
      }

      if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
      }

      const metodoSeleccionado = obtenerMetodoPagoSeleccionado();

      if (!metodoSeleccionado?._id) {
        alert("No se encontró el método de pago seleccionado en el backend.");
        return;
      }

      const resCarrito = await fetch(`${API_BASE}/api/carrito`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usuarioId }),
      });

      if (!resCarrito.ok) {
        const mensaje = await leerErrorBackend(
          resCarrito,
          "Error al crear carrito en backend",
        );
        throw new Error(mensaje);
      }

      const carritoBackend = await resCarrito.json();

      for (const item of carrito) {
        const idCurso = item._id || item.id || item.curso?._id || item.curso;

        const resItem = await fetch(
          `${API_BASE}/api/carrito/${carritoBackend._id}/item`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              idCurso,
              cantidad: item.cantidad,
            }),
          },
        );

        if (!resItem.ok) {
          const mensaje = await leerErrorBackend(
            resItem,
            "Error al agregar curso al carrito backend",
          );
          throw new Error(mensaje);
        }
      }

      const resCompra = await fetch(
        `${API_BASE}/api/compra/desde-carrito/${carritoBackend._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ usuarioId }),
        },
      );

      if (!resCompra.ok) {
        const mensaje = await leerErrorBackend(
          resCompra,
          "Error al generar la compra",
        );
        throw new Error(mensaje);
      }

      const compra = await resCompra.json();

      const resPago = await fetch(`${API_BASE}/api/pagos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          monto: compra.total,
          metodoPago: metodoSeleccionado._id,
          usuario: usuarioId,
          compra: compra._id,
        }),
      });

      if (!resPago.ok) {
        const mensaje = await leerErrorBackend(
          resPago,
          "Error al crear el pago",
        );
        throw new Error(mensaje);
      }

      const pago = await resPago.json();

      const resAprobar = await fetch(
        `${API_BASE}/api/pagos/${pago._id}/aprobar`,
        {
          method: "PATCH",
        },
      );

      if (!resAprobar.ok) {
        const mensaje = await leerErrorBackend(
          resAprobar,
          "Error al aprobar el pago",
        );
        throw new Error(mensaje);
      }

      vaciarCarrito();

      alert("Compra realizada correctamente.");
      navigate("/mis-cursos");
    } catch (error) {
      console.error("Error al finalizar compra:", error);
      alert(error.message || "Ocurrió un error al finalizar la compra.");
    } finally {
      setProcesando(false);
    }
  };

  const metodoExiste = (tipo) =>
    metodosPago.some((metodo) => metodo.tipo === tipo);

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
              <div key={item.id || item._id} className="carrito-card">
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
                          actualizarCantidad(
                            item.id || item._id,
                            item.cantidad - 1,
                          );
                        }
                      }}
                    >
                      -
                    </button>

                    <span>{item.cantidad}</span>

                    <button
                      onClick={() =>
                        actualizarCantidad(
                          item.id || item._id,
                          item.cantidad + 1,
                        )
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
                    onClick={() => eliminarDelCarrito(item.id || item._id)}
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

            <div className="metodos-pago">
              <h4>Seleccionar método de pago</h4>

              <button
                type="button"
                className={`metodo-opcion ${
                  metodoPago === "TARJETA" ? "activo" : ""
                }`}
                onClick={() => setMetodoPago("TARJETA")}
                disabled={!metodoExiste("TARJETA")}
              >
                <span className="metodo-icono">💳</span>
                <div className="metodo-texto">
                  <span className="metodo-titulo">Mercado Pago</span>
                  <span className="metodo-descripcion">
                    {metodoExiste("TARJETA")
                      ? "Pagá con tarjeta o saldo"
                      : "No disponible"}
                  </span>
                </div>
              </button>

              <button
                type="button"
                className={`metodo-opcion ${
                  metodoPago === "TRANSFERENCIA" ? "activo" : ""
                }`}
                onClick={() => setMetodoPago("TRANSFERENCIA")}
                disabled={!metodoExiste("TRANSFERENCIA")}
              >
                <span className="metodo-icono">🏦</span>
                <div className="metodo-texto">
                  <span className="metodo-titulo">Transferencia</span>
                  <span className="metodo-descripcion">
                    {metodoExiste("TRANSFERENCIA")
                      ? "Pago simulado para prueba"
                      : "No disponible"}
                  </span>
                </div>
              </button>

              <button
                type="button"
                className={`metodo-opcion ${
                  metodoPago === "EFECTIVO" ? "activo" : ""
                }`}
                onClick={() => setMetodoPago("EFECTIVO")}
                disabled={!metodoExiste("EFECTIVO")}
              >
                <span className="metodo-icono">💵</span>
                <div className="metodo-texto">
                  <span className="metodo-titulo">Efectivo</span>
                  <span className="metodo-descripcion">
                    {metodoExiste("EFECTIVO")
                      ? "Pagá al retirar"
                      : "No disponible"}
                  </span>
                </div>
              </button>
            </div>

            <button
              className="btn-finalizar"
              onClick={handleContinuarPago}
              disabled={procesando}
            >
              {procesando ? "Procesando..." : "Continuar pago"}
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
