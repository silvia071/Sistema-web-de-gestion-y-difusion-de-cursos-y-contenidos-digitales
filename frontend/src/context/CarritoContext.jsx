import { createContext, useContext, useState, useEffect } from "react";

const CarritoContext = createContext();

export const useCarrito = () => useContext(CarritoContext);

export function CarritoProvider({ children }) {
  // 🔹 Estado con persistencia
  const [carrito, setCarrito] = useState(() => {
    try {
      const data = localStorage.getItem("carrito");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  // 🔹 Guardar automáticamente en localStorage
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  // 🔹 Agregar producto
  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === producto.id);

      if (existe) {
        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
        );
      }

      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  // 🔹 Eliminar producto
  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  };

  // 🔹 Actualizar cantidad
  const actualizarCantidad = (id, cantidad) => {
    if (cantidad < 1) return;

    setCarrito((prev) =>
      prev.map((item) => (item.id === id ? { ...item, cantidad } : item)),
    );
  };

  // 🔹 Vaciar carrito
  const vaciarCarrito = () => {
    setCarrito([]);
  };

  // 🔹 Finalizar compra
  const finalizarCompra = () => {
    try {
      const cursosGuardados = localStorage.getItem("misCursos");
      const misCursos = cursosGuardados ? JSON.parse(cursosGuardados) : [];

      const nuevosCursos = carrito.filter(
        (itemCarrito) =>
          !misCursos.some((itemCurso) => itemCurso.id === itemCarrito.id),
      );

      const cursosActualizados = [...misCursos, ...nuevosCursos];

      localStorage.setItem("misCursos", JSON.stringify(cursosActualizados));
      setCarrito([]);
    } catch (error) {
      console.error("Error al finalizar la compra:", error);
    }
  };

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        eliminarDelCarrito,
        actualizarCantidad,
        vaciarCarrito,
        finalizarCompra,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}
