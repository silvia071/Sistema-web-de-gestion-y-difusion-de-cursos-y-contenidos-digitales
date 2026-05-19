import "./Carrito.css";
import { useCarrito } from "../context/CarritoContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

function tokenValido(token) {
  return (
    token && token !== "null" && token !== "undefined" && token.trim() !== ""
  );
}

function Carrito() {
  const {
    carrito,
    carritoBackend,
    eliminarDelCarrito,
    vaciarCarrito,
    limpiarCarritoVisual,
  } = useCarrito();

  const navigate = useNavigate();
  const location = useLocation();

  const [metodoPago, setMetodoPago] = useState("TRANSFERENCIA");
  const [metodosPago, setMetodosPago] = useState([]);
  const [procesando, setProcesando] = useState(false);

  const [modal, setModal] = useState({
    visible: false,
    titulo: "",
    mensaje: "",
    tipo: "info",
    accion: null,
    textoConfirmar: "Aceptar",
    textoCancelar: "Cancelar",
    mostrarCancelar: false,
  });

  const subtotal = carrito.reduce(
    (acc, item) => acc + Number(item.precio || 0),
    0,
  );

  useEffect(() => {
    const obtenerMetodosPago = async () => {
      try {
        const response = await api.get("/api/metodos-pago");
        const metodos = Array.isArray(response.data) ? response.data : [];

        setMetodosPago(metodos);

        if (metodos.some((metodo) => metodo.tipo === "TRANSFERENCIA")) {
          setMetodoPago("TRANSFERENCIA");
        } else if (metodos[0]?.tipo) {
          setMetodoPago(metodos[0].tipo);
        }
      } catch (error) {
        console.error("Error al obtener métodos de pago:", error);
      }
    };

    obtenerMetodosPago();
  }, []);

  const obtenerMetodoPagoSeleccionado = () => {
    return metodosPago.find((metodo) => metodo.tipo === metodoPago);
  };

  const metodoExiste = (tipo) =>
    metodosPago.some((metodo) => metodo.tipo === tipo);

  const mostrarModal = ({
    titulo,
    mensaje,
    tipo = "info",
    accion = null,
    textoConfirmar = "Aceptar",
    textoCancelar = "Cancelar",
    mostrarCancelar = false,
  }) => {
    setModal({
      visible: true,
      titulo,
      mensaje,
      tipo,
      accion,
      textoConfirmar,
      textoCancelar,
      mostrarCancelar,
    });
  };

  const cerrarModal = () => {
    setModal({
      visible: false,
      titulo: "",
      mensaje: "",
      tipo: "info",
      accion: null,
      textoConfirmar: "Aceptar",
      textoCancelar: "Cancelar",
      mostrarCancelar: false,
    });
  };

  const confirmarModal = async () => {
    const accion = modal.accion;

    cerrarModal();

    if (accion) {
      await accion();
    }
  };

  const handleContinuarPago = async () => {
    try {
      setProcesando(true);

      const token = localStorage.getItem("token");

      if (!tokenValido(token)) {
        mostrarModal({
          titulo: "Iniciá sesión",
          mensaje: "Tenés que iniciar sesión para poder comprar cursos.",
          tipo: "info",
          accion: () =>
            navigate("/login", {
              replace: true,
              state: { from: location.pathname },
            }),
          textoConfirmar: "Iniciar sesión",
        });

        return;
      }

      if (carrito.length === 0) {
        mostrarModal({
          titulo: "Carrito vacío",
          mensaje: "Agregá al menos un curso antes de continuar con la compra.",
          tipo: "warning",
        });

        return;
      }

      if (!carritoBackend?._id) {
        mostrarModal({
          titulo: "Error de carrito",
          mensaje: "No se pudo obtener el carrito activo.",
          tipo: "error",
        });

        return;
      }

      const metodoSeleccionado = obtenerMetodoPagoSeleccionado();

      if (!metodoSeleccionado?._id) {
        mostrarModal({
          titulo: "Método de pago no disponible",
          mensaje:
            "No se encontró el método de pago seleccionado en el backend.",
          tipo: "warning",
        });

        return;
      }

      const { data: compraResponse } = await api.post(
        `/api/compra/desde-carrito/${carritoBackend._id}`,
      );

      const compra = compraResponse.datos;

      const { data: pagoResponse } = await api.post("/api/pagos", {
        monto: compra.total,
        metodoPago: metodoSeleccionado._id,
        compra: compra._id,
      });

      const pago = pagoResponse.datos;

      const { data: resultadoPagoResponse } = await api.post(
        "/api/pagos/procesar",
        {
          pagoId: pago._id,
        },
      );

      const resultadoPago = resultadoPagoResponse.datos;

      if (resultadoPago?.tipo === "mercadopago" && resultadoPago?.init_point) {
        window.location.href = resultadoPago.init_point;
        return;
      }

      if (resultadoPago?.tipo === "transferencia") {
        limpiarCarritoVisual();
        navigate("/pago-pendiente");
        return;
      }

      limpiarCarritoVisual();

      mostrarModal({
        titulo: "Compra generada",
        mensaje: "La compra fue generada correctamente.",
        tipo: "success",
        accion: () => navigate("/mis-cursos"),
        textoConfirmar: "Ver mis cursos",
      });
    } catch (error) {
      console.error("Error al finalizar compra:", error);

      mostrarModal({
        titulo: "Error al finalizar la compra",
        mensaje:
          error.response?.data?.mensaje ||
          error.message ||
          "Ocurrió un error al finalizar la compra.",
        tipo: "error",
      });
    } finally {
      setProcesando(false);
    }
  };

  const handleVaciarCarrito = () => {
    mostrarModal({
      titulo: "Vaciar carrito",
      mensaje: "¿Seguro que querés eliminar todos los cursos del carrito?",
      tipo: "warning",
      accion: async () => {
        await vaciarCarrito();
      },
      textoConfirmar: "Sí, vaciar carrito",
      textoCancelar: "Cancelar",
      mostrarCancelar: true,
    });
  };

  return (
    <section className="carrito-page">
      {modal.visible && (
        <div className="carrito-modal-overlay">
          <div className={`carrito-modal carrito-modal-${modal.tipo}`}>
            <div className="carrito-modal-icon">
              {modal.tipo === "success" && "✓"}
              {modal.tipo === "warning" && "!"}
              {modal.tipo === "error" && "×"}
              {modal.tipo === "info" && "i"}
            </div>

            <h2>{modal.titulo}</h2>
            <p>{modal.mensaje}</p>

            <div className="carrito-modal-actions">
              {modal.mostrarCancelar && (
                <button
                  type="button"
                  className="carrito-modal-btn-cancelar"
                  onClick={cerrarModal}
                >
                  {modal.textoCancelar}
                </button>
              )}

              <button
                type="button"
                className="carrito-modal-btn-confirmar"
                onClick={confirmarModal}
              >
                {modal.textoConfirmar}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="carrito-header">
        <div>
          <span className="carrito-eyebrow">Finalizá tu compra</span>
          <h1 className="carrito-title">Tu carrito</h1>
          <p className="carrito-subtitle">
            Revisá los cursos seleccionados antes de continuar con el pago.
          </p>
        </div>

        {carrito.length > 0 && (
          <Link to="/cursos" className="carrito-link-cursos">
            Seguir explorando
          </Link>
        )}
      </div>

      {carrito.length === 0 ? (
        <div className="carrito-vacio">
          <div className="carrito-vacio-icono">🛒</div>
          <h2>Tu carrito está vacío</h2>
          <p>Explorá los cursos disponibles y agregá el que quieras empezar.</p>

          <Link to="/cursos" className="btn-finalizar">
            Ver cursos
          </Link>
        </div>
      ) : (
        <div className="carrito-container">
          <div className="carrito-lista">
            {carrito.map((item) => {
              const itemId = item.itemId || item.id || item._id;

              return (
                <article key={itemId} className="carrito-card">
                  <div className="carrito-imagen-wrap">
                    <img
                      src={item.imagen}
                      alt={item.titulo}
                      className="carrito-imagen"
                    />
                  </div>

                  <div className="carrito-info">
                    <div className="carrito-badges">
                      <span>Curso digital</span>
                      <span>Acceso inmediato</span>
                    </div>

                    <h2 className="carrito-item-title">{item.titulo}</h2>

                    <div className="carrito-meta">
                      <span>Online</span>
                      <span>De por vida</span>
                      <span>Contenido actualizado</span>
                    </div>
                  </div>

                  <div className="carrito-acciones">
                    <p className="carrito-total-item">
                      ${Number(item.precio || 0).toLocaleString("es-AR")}
                    </p>

                    <button
                      type="button"
                      className="btn-eliminar"
                      onClick={() => eliminarDelCarrito(itemId)}
                    >
                      Eliminar
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="carrito-resumen">
            <div className="resumen-header">
              <h3>Resumen</h3>
              <span>
                {carrito.length} curso{carrito.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="resumen-linea">
              <span>Subtotal</span>
              <strong>${subtotal.toLocaleString("es-AR")}</strong>
            </div>

            <div className="resumen-total">
              <span>Total</span>
              <strong>${subtotal.toLocaleString("es-AR")}</strong>
            </div>

            <div className="metodos-pago">
              <h4>Método de pago</h4>

              {metodoExiste("TARJETA") && (
                <button
                  type="button"
                  className={`metodo-opcion ${
                    metodoPago === "TARJETA" ? "activo" : ""
                  }`}
                  onClick={() => setMetodoPago("TARJETA")}
                >
                  <span className="metodo-icono">💳</span>

                  <span className="metodo-texto">
                    <span className="metodo-titulo">Mercado Pago</span>
                    <span className="metodo-descripcion">
                      Pagá con tarjeta, débito o saldo disponible.
                    </span>
                  </span>
                </button>
              )}

              {metodoExiste("TRANSFERENCIA") && (
                <button
                  type="button"
                  className={`metodo-opcion ${
                    metodoPago === "TRANSFERENCIA" ? "activo" : ""
                  }`}
                  onClick={() => setMetodoPago("TRANSFERENCIA")}
                >
                  <span className="metodo-icono">🏦</span>

                  <span className="metodo-texto">
                    <span className="metodo-titulo">Transferencia</span>
                    <span className="metodo-descripcion">
                      Pago pendiente de aprobación administrativa.
                    </span>
                  </span>
                </button>
              )}
            </div>

            <button
              type="button"
              className="btn-finalizar"
              onClick={handleContinuarPago}
              disabled={procesando}
            >
              {procesando ? "Procesando..." : "Continuar pago"}
            </button>

            <button
              type="button"
              className="btn-vaciar"
              onClick={handleVaciarCarrito}
            >
              Vaciar carrito
            </button>

            <div className="carrito-confianza">
              <span>✓ Compra segura</span>
              <span>✓ Acceso inmediato</span>
              <span>✓ Soporte incluido</span>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}

export default Carrito;
