import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CarritoContext = createContext();

export const useCarrito = () => useContext(CarritoContext);

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState(() => {
    try {
      const data = localStorage.getItem("carrito");
      const parsed = data ? JSON.parse(data) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Error al leer el carrito desde localStorage:", error);
      return [];
    }
  });

  const [mensajeCarrito, setMensajeCarrito] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem("carrito", JSON.stringify(carrito));
    } catch (error) {
      console.error("Error al guardar el carrito en localStorage:", error);
    }
  }, [carrito]);

  const mostrarMensaje = (texto) => {
    setMensajeCarrito(texto);

    setTimeout(() => {
      setMensajeCarrito("");
    }, 2000);
  };

  const obtenerId = (producto) => producto?.id || producto?._id || null;

  const normalizarProducto = (producto) => {
    const id = obtenerId(producto);

    if (!id) return null;

    return {
      id,
      titulo: producto?.titulo || "Curso sin título",
      precio: Number(producto?.precio) || 0,
      imagen: producto?.imagen || producto?.img || producto?.image || "",
      cantidad: Number(producto?.cantidad) > 0 ? Number(producto.cantidad) : 1,
    };
  };

  const agregarAlCarrito = (producto) => {
    const productoNormalizado = normalizarProducto(producto);

    if (!productoNormalizado) {
      console.error("El producto no tiene id ni _id:", producto);
      return;
    }

    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === productoNormalizado.id);

      if (existe) {
        return prev.map((item) =>
          item.id === productoNormalizado.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
        );
      }

      return [...prev, productoNormalizado];
    });

    mostrarMensaje("Curso agregado al carrito");
  };

  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  };

  const actualizarCantidad = (id, cantidad) => {
    const nuevaCantidad = Number(cantidad);

    if (nuevaCantidad < 1 || Number.isNaN(nuevaCantidad)) return;

    setCarrito((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, cantidad: nuevaCantidad } : item,
      ),
    );
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  const estaEnCarrito = (id) => {
    return carrito.some((item) => item.id === id);
  };

  const finalizarCompra = () => {
    try {
      const cursosGuardados = localStorage.getItem("misCursos");
      const misCursosParseados = cursosGuardados
        ? JSON.parse(cursosGuardados)
        : [];
      const misCursos = Array.isArray(misCursosParseados)
        ? misCursosParseados
        : [];

      const nuevosCursos = carrito.filter(
        (itemCarrito) =>
          !misCursos.some(
            (itemCurso) => obtenerId(itemCurso) === itemCarrito.id,
          ),
      );

      const cursosActualizados = [...misCursos, ...nuevosCursos];

      localStorage.setItem("misCursos", JSON.stringify(cursosActualizados));
      setCarrito([]);
      mostrarMensaje("Compra realizada con éxito");
    } catch (error) {
      console.error("Error al finalizar la compra:", error);
    }
  };

  const cantidadTotal = useMemo(() => {
    return carrito.reduce((acc, item) => acc + item.cantidad, 0);
  }, [carrito]);

  const subtotal = useMemo(() => {
    return carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  }, [carrito]);

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        mensajeCarrito,
        cantidadTotal,
        subtotal,
        agregarAlCarrito,
        eliminarDelCarrito,
        actualizarCantidad,
        vaciarCarrito,
        finalizarCompra,
        estaEnCarrito,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}
