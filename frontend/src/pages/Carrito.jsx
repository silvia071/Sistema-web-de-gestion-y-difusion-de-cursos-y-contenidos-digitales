import "./Carrito.css";
import { useCarrito } from "../context/CarritoContext";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import api from "../services/api";

function tokenValido(token) {
  return (
    token && token !== "null" && token !== "undefined" && token.trim() !== ""
  );
}

function formatearPrecio(valor) {
  return Number(valor || 0).toLocaleString("es-AR");
}

function Carrito() {
  const { carrito, carritoBackend, eliminarDelCarrito, vaciarCarrito } =
    useCarrito();

  const navigate = useNavigate();

  const [codigoCupon, setCodigoCupon] = useState("");
  const [aplicandoCupon, setAplicandoCupon] = useState(false);
  const [quitandoCupon, setQuitandoCupon] = useState(false);
  const [mensajeCupon, setMensajeCupon] = useState("");

  const subtotalVisual = carrito.reduce(
    (acc, item) => acc + Number(item.precio || 0),
    0,
  );

  const [resumenCompra, setResumenCompra] = useState({
    subtotal: subtotalVisual,
    descuento: 0,
    totalFinal: subtotalVisual,
    codigoCuponAplicado: null,
  });

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

  const obtenerResumenCarrito = useCallback(async () => {
    if (!carritoBackend?._id || carrito.length === 0) {
      setResumenCompra({
        subtotal: subtotalVisual,
        descuento: 0,
        totalFinal: subtotalVisual,
        codigoCuponAplicado: null,
      });

      return;
    }

    try {
      const { data } = await api.get(
        `/api/carrito/${carritoBackend._id}/total`,
      );

      setResumenCompra({
        subtotal: Number(data.subtotal || 0),
        descuento: Number(data.descuento || 0),
        totalFinal: Number(data.totalFinal || data.subtotal || 0),
        codigoCuponAplicado: data.codigoCuponAplicado || null,
      });

      if (data.codigoCuponAplicado) {
        setCodigoCupon(data.codigoCuponAplicado);
      }
    } catch (error) {
      console.error("Error al obtener resumen del carrito:", error);

      setResumenCompra({
        subtotal: subtotalVisual,
        descuento: 0,
        totalFinal: subtotalVisual,
        codigoCuponAplicado: null,
      });
    }
  }, [carritoBackend?._id, carrito.length, subtotalVisual]);

  useEffect(() => {
    obtenerResumenCarrito();
  }, [obtenerResumenCarrito]);

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

  const handleAplicarCupon = async () => {
    if (aplicandoCupon) return;

    const codigo = codigoCupon.trim().toUpperCase();

    if (!codigo) {
      setMensajeCupon("Ingresá un código de cupón.");
      return;
    }

    if (!carritoBackend?._id) {
      setMensajeCupon("No se pudo obtener el carrito activo.");
      return;
    }

    try {
      setAplicandoCupon(true);
      setMensajeCupon("");

      const { data } = await api.post("/api/cupones/aplicar", {
        codigo,
        carritoId: carritoBackend._id,
      });

      setResumenCompra({
        subtotal: Number(data.subtotal || 0),
        descuento: Number(data.descuento || 0),
        totalFinal: Number(data.totalFinal || 0),
        codigoCuponAplicado: data.codigo || codigo,
      });

      setCodigoCupon(data.codigo || codigo);
      setMensajeCupon("Cupón aplicado correctamente.");
    } catch (error) {
      console.error("Error al aplicar cupón:", error);

      const mensajeBackend =
        error.response?.data?.mensaje ||
        error.response?.data?.error ||
        "No se pudo aplicar el cupón.";

      setMensajeCupon(mensajeBackend);
    } finally {
      setAplicandoCupon(false);
    }
  };

  const handleQuitarCupon = async () => {
    if (quitandoCupon) return;

    if (!carritoBackend?._id) {
      setMensajeCupon("No se pudo obtener el carrito activo.");
      return;
    }

    try {
      setQuitandoCupon(true);
      setMensajeCupon("");

      const { data } = await api.delete(
        `/api/cupones/carrito/${carritoBackend._id}`,
      );

      setResumenCompra({
        subtotal: Number(data.subtotal || subtotalVisual),
        descuento: 0,
        totalFinal: Number(data.totalFinal || data.subtotal || subtotalVisual),
        codigoCuponAplicado: null,
      });

      setCodigoCupon("");
      setMensajeCupon("Cupón quitado correctamente.");
    } catch (error) {
      console.error("Error al quitar cupón:", error);

      const mensajeBackend =
        error.response?.data?.mensaje ||
        error.response?.data?.error ||
        "No se pudo quitar el cupón.";

      setMensajeCupon(mensajeBackend);
    } finally {
      setQuitandoCupon(false);
    }
  };

  const handleIrCheckout = () => {
    const token = localStorage.getItem("token");

    if (!tokenValido(token)) {
      mostrarModal({
        titulo: "Iniciá sesión",
        mensaje: "Tenés que iniciar sesión para poder comprar cursos.",
        tipo: "info",
        accion: () =>
          navigate("/login", {
            replace: true,
            state: { from: "/checkout" },
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

    navigate("/checkout");
  };

  const handleVaciarCarrito = () => {
    mostrarModal({
      titulo: "Vaciar carrito",
      mensaje: "¿Seguro que querés eliminar todos los cursos del carrito?",
      tipo: "warning",
      accion: async () => {
        await vaciarCarrito();

        setCodigoCupon("");
        setMensajeCupon("");
        setResumenCompra({
          subtotal: 0,
          descuento: 0,
          totalFinal: 0,
          codigoCuponAplicado: null,
        });
      },
      textoConfirmar: "Sí, vaciar carrito",
      textoCancelar: "Cancelar",
      mostrarCancelar: true,
    });
  };

  const handleEliminarCurso = (item) => {
    const itemId = item.itemId || item.id || item._id;
    const tituloCurso = item.titulo || "este curso";

    mostrarModal({
      titulo: "Eliminar curso",
      mensaje: `¿Seguro que querés eliminar "${tituloCurso}" del carrito?`,
      tipo: "warning",
      accion: async () => {
        await eliminarDelCarrito(itemId);

        setCodigoCupon("");
        setMensajeCupon("");
        await obtenerResumenCarrito();

        mostrarModal({
          titulo: "Curso eliminado",
          mensaje: `"${tituloCurso}" fue eliminado del carrito.`,
          tipo: "success",
          textoConfirmar: "Aceptar",
        });
      },
      textoConfirmar: "Sí, eliminar",
      textoCancelar: "Cancelar",
      mostrarCancelar: true,
    });
  };

  const cuponAplicado = Boolean(resumenCompra.codigoCuponAplicado);
  const descuento = Number(resumenCompra.descuento || 0);
  const subtotal = Number(resumenCompra.subtotal || subtotalVisual || 0);
  const totalFinal = Number(resumenCompra.totalFinal || subtotal || 0);

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
          <span className="carrito-eyebrow">Revisá tu compra</span>
          <h1 className="carrito-title">Tu carrito</h1>
          <p className="carrito-subtitle">
            Revisá los cursos seleccionados antes de continuar con la compra.
          </p>
        </div>

        {carrito.length > 0 && (
          <div className="checkout-steps" aria-label="Progreso de compra">
            <div className="checkout-step checkout-step--active">
              <span>🛒</span>
              <p>Carrito</p>
            </div>

            <div className="checkout-step">
              <span>🧾</span>
              <p>Confirmar</p>
            </div>

            <div className="checkout-step">
              <span>✓</span>
              <p>Confirmación</p>
            </div>
          </div>
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
                      <span>💻 Online</span>
                      <span>♾️ De por vida</span>
                      <span>☁️ Contenido actualizado</span>
                    </div>
                  </div>

                  <div className="carrito-acciones">
                    <p className="carrito-total-item">
                      ${formatearPrecio(item.precio)}
                    </p>

                    <button
                      type="button"
                      className="btn-eliminar"
                      onClick={() => handleEliminarCurso(item)}
                      aria-label={`Eliminar ${item.titulo}`}
                      title="Eliminar curso"
                    >
                      🗑
                    </button>
                  </div>
                </article>
              );
            })}

            <div className="carrito-cupon carrito-cupon-activo">
              <div className="carrito-cupon-icono">%</div>

              <div className="carrito-cupon-contenido">
                <h3>¿Tenés un cupón de descuento?</h3>
                <p>
                  Ingresá tu código y aplicá el descuento directamente sobre el
                  total del carrito.
                </p>

                <div className="carrito-cupon-form">
                  <input
                    type="text"
                    value={codigoCupon}
                    onChange={(e) => {
                      setCodigoCupon(e.target.value.toUpperCase());
                      setMensajeCupon("");
                    }}
                    placeholder="Ej: DESCUENTO10"
                    disabled={aplicandoCupon || quitandoCupon || cuponAplicado}
                  />

                  {!cuponAplicado ? (
                    <button
                      type="button"
                      onClick={handleAplicarCupon}
                      disabled={aplicandoCupon || !codigoCupon.trim()}
                    >
                      {aplicandoCupon ? "Aplicando..." : "Aplicar"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="carrito-cupon-quitar"
                      onClick={handleQuitarCupon}
                      disabled={quitandoCupon}
                    >
                      {quitandoCupon ? "Quitando..." : "Quitar"}
                    </button>
                  )}
                </div>

                {mensajeCupon && (
                  <p
                    className={`carrito-cupon-mensaje ${
                      cuponAplicado ? "exito" : "error"
                    }`}
                  >
                    {mensajeCupon}
                  </p>
                )}

                {cuponAplicado && (
                  <p className="carrito-cupon-aplicado">
                    Cupón aplicado:{" "}
                    <strong>{resumenCompra.codigoCuponAplicado}</strong>
                  </p>
                )}
              </div>
            </div>
          </div>

          <aside className="carrito-resumen">
            <div className="resumen-header">
              <h3>Resumen de tu compra</h3>
              <span>
                {carrito.length} curso{carrito.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="resumen-linea">
              <span>Subtotal</span>
              <strong>${formatearPrecio(subtotal)}</strong>
            </div>

            {descuento > 0 && (
              <div className="resumen-linea resumen-descuento">
                <span>
                  Descuento
                  {resumenCompra.codigoCuponAplicado
                    ? ` (${resumenCompra.codigoCuponAplicado})`
                    : ""}
                </span>
                <strong>- ${formatearPrecio(descuento)}</strong>
              </div>
            )}

            <div className="resumen-total">
              <span>Total</span>
              <strong>${formatearPrecio(totalFinal)}</strong>
            </div>

            <button
              type="button"
              className="btn-finalizar"
              onClick={handleIrCheckout}
            >
              Continuar con la compra →
            </button>

            <div className="resumen-botones-secundarios">
              <button
                type="button"
                className="btn-vaciar btn-vaciar-carrito"
                onClick={handleVaciarCarrito}
              >
                Vaciar carrito
              </button>

              <Link to="/cursos" className="btn-vaciar btn-seguir-explorando">
                🛍️ Seguir explorando
              </Link>
            </div>

            <div className="carrito-confianza">
              <div>
                <span>🔒</span>
                <strong>Compra segura</strong>
                <p>Tus datos están protegidos</p>
              </div>

              <div>
                <span>⚡</span>
                <strong>Acceso inmediato</strong>
                <p>Comenzá a aprender enseguida</p>
              </div>

              <div>
                <span>🎧</span>
                <strong>Soporte incluido</strong>
                <p>Te acompañamos siempre</p>
              </div>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}

export default Carrito;
